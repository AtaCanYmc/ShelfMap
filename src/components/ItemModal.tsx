import { useState, useEffect, type FC, type FormEvent, type ChangeEvent } from 'react'
import type { Item, Container } from '../types'
import { getContainerPath } from '../services/db'
import { uploadWorkshopImage } from '../services/supabaseClient'
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

const CATEGORY_SUGGESTIONS = [
  'Mikrodenetleyici',
  'El Aleti',
  'Hırdavat',
  'Sensör & Modül',
  'Kablo & Bağlantı',
  'Komponent & Çip',
  '3D Baskı Parçası',
  'Pil & Güç',
  'Genel'
]

export const ItemModal: FC<ItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialItem,
  currentContainerId,
  allContainers
}) => {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Genel')
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
      setCategory('Mikrodenetleyici')
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
      setError(err instanceof Error ? err.message : 'Görsel yüklenirken hata oluştu')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Lütfen bir eşya/parça adı girin')
      return
    }

    setSaving(true)
    setError(null)
    try {
      await onSave(
        {
          name: name.trim(),
          category: category.trim() || 'Genel',
          quantity: Math.max(0, quantity),
          container_id: containerId,
          image_url: imageUrl.trim() || null,
          notes: notes.trim() || null
        },
        initialItem?.id
      )
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Kaydedilirken hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  // Pre-calculate readable path for all containers
  const containerOptions = allContainers.map((c) => {
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
            <div className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800/60 text-emerald-400">
              <Box className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-white text-base">
              {initialItem ? 'Eşyayı / Parçayı Düzenle' : 'Yeni Eşya / Parça Ekle'}
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
              Eşya / Parça Adı *
            </label>
            <input
              type="text"
              required
              placeholder="Örn: ESP32 NodeMCU, Dijital Kumpas, M3x10 Vida"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Kategori
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Örn: Mikrodenetleyici, El Aleti..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-slate-100 placeholder-slate-500 outline-none mb-2"
            />
            {/* Quick chips */}
            <div className="flex flex-wrap gap-1.5">
              {CATEGORY_SUGGESTIONS.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`text-[11px] px-2 py-0.5 rounded-full border transition-colors ${
                    category === cat
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Quantity */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Adet / Stok
              </label>
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(0, q - 1))}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="number"
                  min="0"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                  className="w-full text-center bg-transparent border-none text-slate-100 font-mono text-sm focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Container Selector */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Bulunduğu Konteyner / Kutu
              </label>
              <select
                value={containerId || ''}
                onChange={(e) => setContainerId(e.target.value || null)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-slate-100 outline-none"
              >
                <option value="">-- Kök Dizin (Konumsuz) --</option>
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
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Eşya Fotoğrafı
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
              {/* Mobile Camera Upload */}
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

              {/* Gallery / File Picker */}
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

              {/* URL toggle */}
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

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Notlar / Özellikler (Opsiyonel)
            </label>
            <textarea
              rows={2}
              placeholder="Örn: 3.3V mantık seviyesi, 0.96 inç OLED ekran ile uyumlu..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-slate-100 placeholder-slate-500 outline-none resize-none"
            />
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
              <span>{initialItem ? 'Değişiklikleri Kaydet' : 'Eşyayı Ekle'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
