import { useState, useEffect, type FC, type FormEvent, type ChangeEvent } from 'react'
import type { Item, Container } from '../types'
import { getContainerPath } from '../services/db'
import { uploadWorkshopImage } from '../services/supabaseClient'
import { useI18n } from '../services/i18n'
import {
  X,
  Camera,
  Upload,
  Link as LinkIcon,
  Loader2,
  Box,
  Plus,
  Minus
} from 'lucide-react'

interface ItemModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (item: Omit<Item, 'id' | 'created_at'>, id?: string) => Promise<void>
  initialItem?: Item | null
  currentContainerId?: string | null
  allContainers: Container[]
}

const CATEGORY_KEYS = [
  'Microcontroller',
  'Tool',
  'Fastener',
  'Sensor',
  'Module',
  'Component',
  'Passive',
  'Wire',
  'Other'
]

export const ItemModal: FC<ItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialItem,
  currentContainerId,
  allContainers
}) => {
  const { t, categoryName } = useI18n()
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Microcontroller')
  const [quantity, setQuantity] = useState(1)
  const [containerId, setContainerId] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState('')
  const [notes, setNotes] = useState('')
  const [uploading, setUploading] = useState(false)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialItem) {
      setName(initialItem.name)
      setCategory(initialItem.category)
      setQuantity(initialItem.quantity)
      setContainerId(initialItem.container_id)
      setImageUrl(initialItem.image_url || '')
      setNotes(initialItem.notes || '')
      setShowUrlInput(Boolean(initialItem.image_url && !initialItem.image_url.startsWith('blob:')))
    } else {
      setName('')
      setCategory('Microcontroller')
      setQuantity(1)
      setContainerId(currentContainerId || null)
      setImageUrl('')
      setNotes('')
      setShowUrlInput(false)
    }
    setError(null)
  }, [initialItem, currentContainerId, isOpen])

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
      setError(err instanceof Error ? err.message : 'Failed to compress and upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError(t('itemNamePlaceholder'))
      return
    }

    setSaving(true)
    setError(null)
    try {
      await onSave(
        {
          name: name.trim(),
          category: category.trim() || 'Other',
          quantity: Math.max(0, quantity),
          container_id: containerId,
          image_url: imageUrl.trim() || null,
          notes: notes.trim() || null
        },
        initialItem?.id
      )
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save item')
    } finally {
      setSaving(false)
    }
  }

  const containerOptions = allContainers.map((c) => {
    const path = getContainerPath(c.id, allContainers)
    const label = path.map((p) => p.name).join(' / ')
    return { id: c.id, label }
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#11151f] dark:bg-[#11151f] bg-white border border-[#232a3c] dark:border-[#232a3c] border-slate-300 rounded-xl shadow-2xl overflow-hidden my-6 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#202738] dark:border-[#202738] border-slate-200 bg-[#0d1017] dark:bg-[#0d1017] bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-[#161c28] dark:bg-[#161c28] bg-amber-100 border border-[#273248] dark:border-[#273248] border-amber-300 text-amber-500">
              <Box className="w-4 h-4 stroke-[2]" />
            </div>
            <h3 className="font-semibold text-white dark:text-white text-slate-900 text-sm">
              {initialItem ? t('editItemTitle') : t('newItemTitle')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-slate-400 hover:text-white dark:hover:text-white text-slate-500 hover:text-slate-900 hover:bg-[#1c2232] dark:hover:bg-[#1c2232] hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-2.5 rounded-lg bg-rose-950/40 dark:bg-rose-950/40 bg-rose-50 border border-rose-800 dark:border-rose-800 border-rose-300 text-rose-400 dark:text-rose-300 text-rose-800 text-xs">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 dark:text-slate-400 text-slate-600 mb-1">
              {t('itemName')} *
            </label>
            <input
              type="text"
              required
              placeholder={t('itemNamePlaceholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-[#0a0d13] dark:bg-[#0a0d13] bg-slate-50 border border-[#232a3c] dark:border-[#232a3c] border-slate-300 focus:border-amber-500 rounded-lg text-xs sm:text-sm text-slate-100 dark:text-slate-100 text-slate-900 placeholder-slate-500 outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 dark:text-slate-400 text-slate-600 mb-1">
              {t('itemCategory')}
            </label>
            {/* Chips */}
            <div className="flex flex-wrap gap-1.5">
              {CATEGORY_KEYS.map((catKey) => {
                const localizedName = categoryName(catKey)
                return (
                  <button
                    type="button"
                    key={catKey}
                    onClick={() => setCategory(catKey)}
                    className={`text-[11px] font-mono px-2.5 py-1 rounded border transition-colors ${
                      category === catKey
                        ? 'bg-amber-500 text-slate-950 font-semibold border-amber-400'
                        : 'bg-[#0a0d13] dark:bg-[#0a0d13] bg-slate-100 text-slate-400 dark:text-slate-400 text-slate-600 border-[#202738] dark:border-[#202738] border-slate-300 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    {localizedName}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Quantity & Container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Quantity */}
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 dark:text-slate-400 text-slate-600 mb-1">
                {t('itemQuantity')}
              </label>
              <div className="flex items-center bg-[#0a0d13] dark:bg-[#0a0d13] bg-slate-50 border border-[#232a3c] dark:border-[#232a3c] border-slate-300 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(0, q - 1))}
                  className="btn-tactile w-8 h-8 flex items-center justify-center rounded text-slate-400 hover:text-white dark:hover:text-white text-slate-600 hover:text-slate-900 hover:bg-[#181f2c] dark:hover:bg-[#181f2c] hover:bg-slate-200"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="number"
                  min="0"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                  className="w-full text-center bg-transparent border-none text-slate-100 dark:text-slate-100 text-slate-900 font-mono text-xs tabular-nums focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="btn-tactile w-8 h-8 flex items-center justify-center rounded text-slate-400 hover:text-white dark:hover:text-white text-slate-600 hover:text-slate-900 hover:bg-[#181f2c] dark:hover:bg-[#181f2c] hover:bg-slate-200"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Container Selector */}
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 dark:text-slate-400 text-slate-600 mb-1">
                {t('itemContainer')}
              </label>
              <select
                value={containerId || ''}
                onChange={(e) => setContainerId(e.target.value || null)}
                className="w-full px-3 py-2 bg-[#0a0d13] dark:bg-[#0a0d13] bg-slate-50 border border-[#232a3c] dark:border-[#232a3c] border-slate-300 focus:border-amber-500 rounded-lg text-xs text-slate-100 dark:text-slate-100 text-slate-900 font-mono outline-none"
              >
                <option value="">-- {t('root')} --</option>
                {containerOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Photo Upload Section */}
          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 dark:text-slate-400 text-slate-600 mb-1">
              {t('itemPhoto')}
            </label>

            {imageUrl ? (
              <div className="relative mb-2 w-full h-32 rounded-lg bg-[#0a0d13] dark:bg-[#0a0d13] bg-slate-50 border border-[#232a3c] dark:border-[#232a3c] border-slate-300 overflow-hidden">
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
              <label className="btn-tactile flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#141924] dark:bg-[#141924] bg-slate-100 hover:bg-[#1c2232] dark:hover:bg-[#1c2232] hover:bg-slate-200 text-slate-200 dark:text-slate-200 text-slate-800 text-xs font-medium cursor-pointer border border-[#263146] dark:border-[#263146] border-slate-300 transition-colors min-h-[38px]">
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

              <label className="btn-tactile flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#141924] dark:bg-[#141924] bg-slate-100 hover:bg-[#1c2232] dark:hover:bg-[#1c2232] hover:bg-slate-200 text-slate-200 dark:text-slate-200 text-slate-800 text-xs font-medium cursor-pointer border border-[#263146] dark:border-[#263146] border-slate-300 transition-colors min-h-[38px]">
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
                className="btn-tactile flex items-center gap-1 px-3 py-2 rounded-lg bg-[#0a0d13] dark:bg-[#0a0d13] bg-slate-100 hover:bg-[#141924] dark:hover:bg-[#141924] hover:bg-slate-200 text-slate-400 dark:text-slate-400 text-slate-700 hover:text-slate-200 text-xs border border-[#232a3c] dark:border-[#232a3c] border-slate-300 transition-colors min-h-[38px]"
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
                className="mt-2 w-full px-3 py-2 bg-[#0a0d13] dark:bg-[#0a0d13] bg-slate-50 border border-[#232a3c] dark:border-[#232a3c] border-slate-300 rounded-lg text-xs text-slate-100 dark:text-slate-100 text-slate-900 placeholder-slate-500 outline-none font-mono"
              />
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 dark:text-slate-400 text-slate-600 mb-1">
              {t('itemNotes')}
            </label>
            <textarea
              rows={2}
              placeholder={t('itemNotesPlaceholder')}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-[#0a0d13] dark:bg-[#0a0d13] bg-slate-50 border border-[#232a3c] dark:border-[#232a3c] border-slate-300 focus:border-amber-500 rounded-lg text-xs text-slate-100 dark:text-slate-100 text-slate-900 placeholder-slate-500 outline-none resize-none font-mono"
            />
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#202738] dark:border-[#202738] border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-tactile px-4 py-2 text-xs font-mono text-slate-400 hover:text-white dark:hover:text-white text-slate-600 hover:text-slate-900 transition-colors min-h-[38px]"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="btn-tactile flex items-center gap-1.5 px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 text-xs font-semibold uppercase tracking-wider transition-colors min-h-[38px]"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{t('saveItemBtn')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
