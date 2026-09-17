import { useState, useEffect, type FC, type FormEvent, type ChangeEvent } from 'react'
import type { Container } from '../types'
import { getContainerPath, wouldCreateCycle } from '../services/db'
import { uploadWorkshopImage } from '../services/supabaseClient'
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
      setError(err instanceof Error ? err.message : 'Görsel yüklenirken hata oluştu')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Lütfen bir konteyner / konum adı girin')
      return
    }

    if (initialContainer && wouldCreateCycle(initialContainer.id, parentId, allContainers)) {
      setError('Bir konteyner kendi altına veya kendi alt klasörüne taşınamaz (döngüsel hata).')
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
      setError(err instanceof Error ? err.message : 'Kaydedilirken hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  // Pre-calculate readable path for all containers, filtering out self/descendants if editing
  const availableParents = allContainers
    .filter((c) => {
      if (!initialContainer) return true
      return !wouldCreateCycle(initialContainer.id, c.id, allContainers)
    })
    .map((c) => {
      const path = getContainerPath(c.id, allContainers)
      const label = path.map((p) => p.name).join(' > ')
      return { id: c.id, label }
    })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-950/80 border border-indigo-800/60 text-indigo-400">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-white text-base">
              {initialContainer ? 'Konteyneri Düzenle' : 'Yeni Konteyner / Kutu Ekle'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Konteyner / Konum Adı *
            </label>
            <input
              type="text"
              required
              placeholder="Örn: Çalışma Odası, Metal Dolap, 3. Çekmece, Alet Çantası"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
            />
          </div>

          {/* Parent Container Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Üst Konum (Hangi odanın/dolabın içinde?)
            </label>
            <select
              value={parentId || ''}
              onChange={(e) => setParentId(e.target.value || null)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-slate-100 outline-none"
            >
              <option value="">-- Ana Konum (Kök Seviye / Oda / Ev) --</option>
              {availableParents.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              Boş bırakırsanız bağımsız bir ana lokasyon (Örn: Oda veya Atölye) olarak eklenir.
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Açıklama (Opsiyonel)
            </label>
            <textarea
              rows={2}
              placeholder="Örn: Kapının yanındaki 5 katlı raf ünitesinin 2. katı..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-slate-100 placeholder-slate-500 outline-none resize-none"
            />
          </div>

          {/* Photo Upload Section */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Kutunun / Lokasyonun Fotoğrafı
            </label>

            {/* Preview if exists */}
            {imageUrl ? (
              <div className="relative mb-2 w-full h-36 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden group">
                <img
                  src={imageUrl}
                  alt="Önizleme"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-rose-900 text-white transition-colors"
                  title="Fotoğrafı Kaldır"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : null}

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer transition-colors border border-slate-700">
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                ) : (
                  <Camera className="w-4 h-4 text-sky-400" />
                )}
                <span>Kameradan Çek</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="hidden"
                />
              </label>

              <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer transition-colors border border-slate-700">
                <Upload className="w-4 h-4 text-emerald-400" />
                <span>Galeriden Seç</span>
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
                className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs border border-slate-800 transition-colors"
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>URL ile Ekle</span>
              </button>
            </div>

            {showUrlInput && (
              <input
                type="url"
                placeholder="https://... görsel web adresi"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="mt-2 w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-600 outline-none"
              />
            )}
          </div>

          {/* QR Code / Physical Label Identifier */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Özel QR / Barkod Kodu (Opsiyonel)
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Boş bırakılırsa otomatik benzersiz kod atanır"
                value={qrCode}
                onChange={(e) => setQrCode(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-slate-100 placeholder-slate-600 outline-none font-mono"
              />
              <QrCode className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-medium transition-colors shadow-md shadow-indigo-950"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{initialContainer ? 'Değişiklikleri Kaydet' : 'Konteyneri Ekle'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
