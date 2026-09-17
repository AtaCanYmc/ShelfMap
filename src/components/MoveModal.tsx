import { useState, type FC } from 'react'
import type { Container, Item } from '../types'
import { getContainerPath, wouldCreateCycle } from '../services/db'
import { X, MoveHorizontal, Check, Loader2, Warehouse } from 'lucide-react'

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
      setError(err instanceof Error ? err.message : 'Relocation failed.')
    } finally {
      setLoading(false)
    }
  }

  const title = targetItem
    ? `Relocate Item: ${targetItem.name}`
    : `Relocate Container: ${targetContainer?.name}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#11151f] border border-[#232a3c] rounded-xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#232a3c] bg-[#0c0f14]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-[#1a2234] border border-[#2d3a56] text-amber-400">
              <MoveHorizontal className="w-4 h-4" />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                Relocation Dispatch
              </div>
              <h3 className="font-semibold text-white text-sm truncate max-w-[260px]">
                {title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-[#1a2234] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {error && (
            <div className="p-3 rounded bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-mono">
              ERR: {error}
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Select Destination:
            </span>
            <span className="font-mono text-[11px] text-slate-500 tabular-nums">
              {validContainers.length + 1} targets available
            </span>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1 font-mono text-xs">
            {/* Root Option */}
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg border transition-all flex items-center justify-between ${
                selectedId === null
                  ? 'bg-[#182338] border-amber-500/80 text-white font-medium'
                  : 'bg-[#0c0f14] border-[#232a3c] text-slate-300 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <Warehouse className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>ROOT / Storage Facility</span>
              </div>
              {selectedId === null && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
            </button>

            {/* Containers */}
            {validContainers.map((c) => {
              const path = getContainerPath(c.id, allContainers)
              const pathString = path.map((p) => p.name).join(' / ')
              const isSelected = selectedId === c.id

              return (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-lg border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#182338] border-amber-500/80 text-white font-medium'
                      : 'bg-[#0c0f14] border-[#232a3c] text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="truncate pr-2">
                    <div className="font-semibold text-slate-200">{c.name}</div>
                    <div className="text-[10px] text-slate-500 truncate">{pathString}</div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                </button>
              )
            })}
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#232a3c]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleMove}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />}
              <span>Confirm Move</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
