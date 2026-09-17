import { useState, type FC } from 'react'
import type { Container, Item } from '../types'
import { getContainerPath, wouldCreateCycle } from '../services/db'
import { X, MoveHorizontal, Check, Loader2 } from 'lucide-react'

interface MoveModalProps {
  isOpen: boolean
  onClose: () => void
  targetItem?: Item | null
  targetContainer?: Container | null
  allContainers: Container[]
  onConfirmMove: (newParentOrContainerId: string | null) => Promise<void>
}

export const MoveModal: FC<MoveModalProps> = ({
  isOpen,
  onClose,
  targetItem,
  targetContainer,
  allContainers,
  onConfirmMove
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(
    targetItem ? targetItem.container_id : targetContainer?.parent_id || null
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen || (!targetItem && !targetContainer)) return null

  // Filter out containers that would create cycles if moving a container
  const validContainers = allContainers.filter((c) => {
    if (!targetContainer) return true
    return !wouldCreateCycle(targetContainer.id, c.id, allContainers)
  })

  const handleMove = async () => {
    setLoading(true)
    setError(null)
    try {
      await onConfirmMove(selectedId)
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Taşıma başarısız oldu')
    } finally {
      setLoading(false)
    }
  }

  const title = targetItem
    ? `"${targetItem.name}" Eşyasını Taşı`
    : `"${targetContainer?.name}" Konteynerini Taşı`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-sky-950/80 border border-sky-800/60 text-sky-400">
              <MoveHorizontal className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-white text-sm sm:text-base truncate">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <p className="text-xs text-slate-300">
            Yeni hedef konumu seçin:
          </p>

          <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
            {/* Root Option */}
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className={`w-full text-left px-3 py-2.5 rounded-xl border text-xs transition-all flex items-center justify-between ${
                selectedId === null
                  ? 'bg-indigo-950/60 border-indigo-500 text-white font-medium'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <span>🏠 Ana Seviye / Kök Konum (Herhangi bir kutunun dışı)</span>
              {selectedId === null && <Check className="w-4 h-4 text-indigo-400" />}
            </button>

            {/* Containers */}
            {validContainers.map((c) => {
              const path = getContainerPath(c.id, allContainers)
              const pathString = path.map((p) => p.name).join(' > ')
              const isSelected = selectedId === c.id

              return (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl border text-xs transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-950/60 border-indigo-500 text-white font-medium'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="truncate pr-2">
                    <div className="font-semibold text-slate-200">{c.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{pathString}</div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-indigo-400 shrink-0" />}
                </button>
              )
            })}
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              İptal
            </button>
            <button
              type="button"
              onClick={handleMove}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-medium transition-colors shadow-md shadow-indigo-950"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Yeni Konuma Taşı</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
