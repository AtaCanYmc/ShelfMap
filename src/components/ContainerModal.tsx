import { useState, useEffect, type FC, type FormEvent, type ChangeEvent } from 'react'
import type { Container } from '../types'
import { getContainerPath, wouldCreateCycle } from '../services/db'
import { uploadWorkshopImage } from '../services/supabaseClient'
import { useI18n } from '../services/i18n'
import {
  X,
  Camera,
  Upload,
  Link as LinkIcon,
  Loader2,
  Layers,
  QrCode
} from 'lucide-react'

interface ContainerModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (container: Omit<Container, 'id' | 'created_at'>, id?: string) => Promise<void>
  initialContainer?: Container | null
  currentParentId?: string | null
  allContainers: Container[]
}

export const ContainerModal: FC<ContainerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialContainer,
  currentParentId,
  allContainers
}) => {
  const { t } = useI18n()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [parentId, setParentId] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState('')
  const [qrCode, setQrCode] = useState('')
  const [uploading, setUploading] = useState(false)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialContainer) {
      setName(initialContainer.name)
      setDescription(initialContainer.description || '')
      setParentId(initialContainer.parent_id)
      setImageUrl(initialContainer.image_url || '')
      setQrCode(initialContainer.qr_code || '')
      setShowUrlInput(Boolean(initialContainer.image_url && !initialContainer.image_url.startsWith('blob:')))
    } else {
      setName('')
      setDescription('')
      setParentId(currentParentId || null)
      setImageUrl('')
      setQrCode('')
      setShowUrlInput(false)
    }
    setError(null)
  }, [initialContainer, currentParentId, isOpen])

  if (!isOpen) return null

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)
    try {
      const uploadedUrl = await uploadWorkshopImage(file)
      setImageUrl(uploadedUrl)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to upload photo')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError(t('containerNamePlaceholder'))
      return
    }

    if (initialContainer && wouldCreateCycle(initialContainer.id, parentId, allContainers)) {
      setError('A container cannot be placed inside itself or its own sub-containers (cycle detected).')
      return
    }

    setSaving(true)
    setError(null)
    try {
      await onSave(
        {
          name: name.trim(),
          description: description.trim() || null,
          parent_id: parentId,
          image_url: imageUrl.trim() || null,
          qr_code: qrCode.trim() || ''
        },
        initialContainer?.id
      )
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save container')
    } finally {
      setSaving(false)
    }
  }

  const availableParents = allContainers
    .filter((c) => {
      if (!initialContainer) return true
      return !wouldCreateCycle(initialContainer.id, c.id, allContainers)
    })
    .map((c) => {
      const path = getContainerPath(c.id, allContainers)
      const label = path.map((p) => p.name).join(' / ')
      return { id: c.id, label }
    })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#11151f] border border-slate-300 dark:border-[#232a3c] rounded-xl shadow-2xl overflow-hidden my-6 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-[#202738] bg-slate-50 dark:bg-[#0d1017]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-amber-100 dark:bg-[#161c28] border border-amber-300 dark:border-[#273248] text-amber-500">
              <Layers className="w-4 h-4 stroke-[2]" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
              {initialContainer ? t('editContainerTitle') : t('newContainerTitle')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#1c2232] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-400 dark:text-rose-300 text-rose-800 text-xs">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-xs font-mono uppercase text-slate-600 dark:text-slate-400 mb-1">
              {t('containerName')} *
            </label>
            <input
              type="text"
              required
              placeholder={t('containerNamePlaceholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0a0d13] border border-slate-300 dark:border-[#232a3c] focus:border-amber-500 rounded-lg text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-500 outline-none"
            />
          </div>

          {/* Parent Container Selector */}
          <div>
            <label className="block text-xs font-mono uppercase text-slate-600 dark:text-slate-400 mb-1">
              {t('parentLocation')}
            </label>
            <select
              value={parentId || ''}
              onChange={(e) => setParentId(e.target.value || null)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0a0d13] border border-slate-300 dark:border-[#232a3c] focus:border-amber-500 rounded-lg text-xs text-slate-900 dark:text-slate-100 font-mono outline-none"
            >
              <option value="">-- {t('root')} --</option>
              {availableParents.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-mono uppercase text-slate-600 dark:text-slate-400 mb-1">
              {t('containerDescription')}
            </label>
            <textarea
              rows={2}
              placeholder={t('containerDescPlaceholder')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0a0d13] border border-slate-300 dark:border-[#232a3c] focus:border-amber-500 rounded-lg text-xs text-slate-900 dark:text-slate-100 placeholder-slate-500 outline-none resize-none font-mono"
            />
          </div>

          {/* Photo Upload Section */}
          <div>
            <label className="block text-xs font-mono uppercase text-slate-600 dark:text-slate-400 mb-1">
              Exterior Photo
            </label>

            {imageUrl ? (
              <div className="relative mb-2 w-full h-32 rounded-lg bg-slate-50 dark:bg-[#0a0d13] border border-slate-300 dark:border-[#232a3c] overflow-hidden">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="absolute top-2 right-2 p-1.5 rounded bg-black/80 hover:bg-rose-900 text-white transition-colors"
                  title={t('removePhoto')}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : null}

            <div className="flex flex-wrap items-center gap-2">
              <label className="btn-tactile flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 dark:bg-[#141924] hover:bg-slate-200 dark:hover:bg-[#1c2232] text-slate-800 dark:text-slate-200 text-xs font-medium cursor-pointer border border-slate-300 dark:border-[#263146] transition-colors min-h-[38px]">
                {uploading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-500" />
                ) : (
                  <Camera className="w-3.5 h-3.5 text-sky-400" />
                )}
                <span>Camera</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="hidden"
                />
              </label>

              <label className="btn-tactile flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 dark:bg-[#141924] hover:bg-slate-200 dark:hover:bg-[#1c2232] text-slate-800 dark:text-slate-200 text-xs font-medium cursor-pointer border border-slate-300 dark:border-[#263146] transition-colors min-h-[38px]">
                <Upload className="w-3.5 h-3.5 text-emerald-500" />
                <span>Gallery</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="btn-tactile flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-[#0a0d13] hover:bg-slate-200 dark:hover:bg-[#141924] text-slate-700 dark:text-slate-400 hover:text-slate-200 text-xs border border-slate-300 dark:border-[#232a3c] transition-colors min-h-[38px]"
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>URL</span>
              </button>
            </div>

            {showUrlInput && (
              <input
                type="url"
                placeholder="https://... image web address"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="mt-2 w-full px-3 py-2 bg-slate-50 dark:bg-[#0a0d13] border border-slate-300 dark:border-[#232a3c] rounded-lg text-xs text-slate-900 dark:text-slate-100 placeholder-slate-500 outline-none font-mono"
              />
            )}
          </div>

          {/* QR Code / Physical Label Identifier */}
          <div>
            <label className="block text-xs font-mono uppercase text-slate-600 dark:text-slate-400 mb-1">
              {t('customQrCode')}
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder={t('customQrPlaceholder')}
                value={qrCode}
                onChange={(e) => setQrCode(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-[#0a0d13] border border-slate-300 dark:border-[#232a3c] focus:border-amber-500 rounded-lg text-xs text-slate-900 dark:text-slate-100 placeholder-slate-500 outline-none font-mono"
              />
              <QrCode className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-[#202738]">
            <button
              type="button"
              onClick={onClose}
              className="btn-tactile px-4 py-2 text-xs font-mono text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors min-h-[38px]"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="btn-tactile flex items-center gap-1.5 px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 text-xs font-semibold uppercase tracking-wider transition-colors min-h-[38px]"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{t('saveContainerBtn')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
