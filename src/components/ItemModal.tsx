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
  'Microcontroller',
  'Hand Tool',
  'Hardware',
  'Sensor & Module',
  'Cable & Wire',
  'Component & IC',
  '3D Print Part',
  'Battery & Power',
  'General'
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
  const [category, setCategory] = useState('General')
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
      setError('Please provide an item name')
      return
    }

    setSaving(true)
    setError(null)
    try {
      await onSave(
        {
          name: name.trim(),
          category: category.trim() || 'General',
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
      <div className="relative w-full max-w-lg bg-[#11151f] border border-[#232a3c] rounded-xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#202738] bg-[#0d1017]">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-[#161c28] border border-[#273248] text-amber-400">
              <Box className="w-4 h-4 stroke-[2]" />
            </div>
            <h3 className="font-semibold text-white text-sm">
              {initialItem ? 'Edit Component / Item' : 'New Component / Item'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#1c2232] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
              Item / Part Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. ESP32 NodeMCU, Digital Caliper, M3x10 Screws"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-[#0a0d13] border border-[#232a3c] focus:border-amber-500 focus:ring-0 rounded-lg text-xs sm:text-sm text-slate-100 placeholder-slate-600 outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
              Category
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Microcontroller, Hand Tool..."
              className="w-full px-3 py-2 bg-[#0a0d13] border border-[#232a3c] focus:border-amber-500 rounded-lg text-xs text-slate-100 placeholder-slate-600 outline-none mb-2"
            />
            {/* Chips */}
            <div className="flex flex-wrap gap-1">
              {CATEGORY_SUGGESTIONS.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors ${
                    category === cat
                      ? 'bg-amber-500 text-slate-950 font-semibold border-amber-400'
                      : 'bg-[#0a0d13] text-slate-400 border-[#202738] hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Quantity */}
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                Quantity / Stock
              </label>
              <div className="flex items-center bg-[#0a0d13] border border-[#232a3c] rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(0, q - 1))}
                  className="btn-tactile w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:text-white hover:bg-[#181f2c]"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="number"
                  min="0"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                  className="w-full text-center bg-transparent border-none text-slate-100 font-mono text-xs tabular-nums focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="btn-tactile w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:text-white hover:bg-[#181f2c]"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Container Selector */}
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                Target Container / Box
              </label>
              <select
                value={containerId || ''}
                onChange={(e) => setContainerId(e.target.value || null)}
                className="w-full px-3 py-2 bg-[#0a0d13] border border-[#232a3c] focus:border-amber-500 rounded-lg text-xs text-slate-100 font-mono outline-none"
              >
                <option value="">-- Root Level (Unassigned) --</option>
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
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
              Component Photo
            </label>

            {imageUrl ? (
              <div className="relative mb-2 w-full h-32 rounded-lg bg-[#0a0d13] border border-[#232a3c] overflow-hidden">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="absolute top-2 right-2 p-1 rounded bg-black/80 hover:bg-rose-900 text-white transition-colors"
                  title="Remove Image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : null}

            <div className="flex flex-wrap items-center gap-2">
              <label className="btn-tactile flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141924] hover:bg-[#1c2232] text-slate-200 text-xs font-medium cursor-pointer border border-[#263146] transition-colors">
                {uploading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
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

              <label className="btn-tactile flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141924] hover:bg-[#1c2232] text-slate-200 text-xs font-medium cursor-pointer border border-[#263146] transition-colors">
                <Upload className="w-3.5 h-3.5 text-emerald-400" />
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
                className="btn-tactile flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#0a0d13] hover:bg-[#141924] text-slate-400 hover:text-slate-200 text-xs border border-[#232a3c] transition-colors"
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
                className="mt-2 w-full px-3 py-1.5 bg-[#0a0d13] border border-[#232a3c] rounded-lg text-xs text-slate-100 placeholder-slate-600 outline-none font-mono"
              />
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
              Specs & Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. 3.3V logic, pinout, package type..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-[#0a0d13] border border-[#232a3c] focus:border-amber-500 rounded-lg text-xs text-slate-100 placeholder-slate-600 outline-none resize-none font-mono"
            />
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#202738]">
            <button
              type="button"
              onClick={onClose}
              className="btn-tactile px-3.5 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="btn-tactile flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 text-xs font-semibold transition-colors"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{initialItem ? 'Save Changes' : 'Create Item'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
