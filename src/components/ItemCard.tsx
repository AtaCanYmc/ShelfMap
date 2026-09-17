import { useState, type FC } from 'react'
import type { Item } from '../types'
import {
  Cpu,
  Wrench,
  Package,
  Radio,
  Sliders,
  MoreVertical,
  Edit2,
  Trash2,
  MoveHorizontal,
  Plus,
  Minus
} from 'lucide-react'

interface ItemCardProps {
  item: Item
  onEdit: (item: Item) => void
  onDelete: (item: Item) => void
  onMove: (item: Item) => void
  onUpdateQuantity: (id: string, delta: number) => void
  onPreviewImage: (url: string, title: string) => void
}

export function getCategoryBadge(category: string) {
  const cat = category.toLowerCase()
  if (cat.includes('micro') || cat.includes('mcu') || cat.includes('esp') || cat.includes('arduino')) {
    return {
      icon: Cpu,
      label: 'MCU',
      classes: 'bg-sky-950/40 text-sky-400 border-sky-800/40'
    }
  }
  if (cat.includes('tool') || cat.includes('caliper') || cat.includes('iron') || cat.includes('plier')) {
    return {
      icon: Wrench,
      label: 'TOOL',
      classes: 'bg-amber-950/40 text-amber-400 border-amber-800/40'
    }
  }
  if (cat.includes('sensor') || cat.includes('rf') || cat.includes('module') || cat.includes('display')) {
    return {
      icon: Radio,
      label: 'SENSOR',
      classes: 'bg-violet-950/40 text-violet-400 border-violet-800/40'
    }
  }
  if (cat.includes('screw') || cat.includes('nut') || cat.includes('hardware') || cat.includes('fastener')) {
    return {
      icon: Sliders,
      label: 'FASTENER',
      classes: 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40'
    }
  }
  return {
    icon: Package,
    label: category.toUpperCase().slice(0, 8),
    classes: 'bg-[#181f2c] text-slate-400 border-[#273248]'
  }
}

export const ItemCard: FC<ItemCardProps> = ({
  item,
  onEdit,
  onDelete,
  onMove,
  onUpdateQuantity,
  onPreviewImage
}) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const badge = getCategoryBadge(item.category)
  const IconComponent = badge.icon

  return (
    <div className="group bg-[#121622] border border-[#232a3b] hover:border-[#38435d] rounded-xl p-3 sm:p-3.5 flex gap-3 items-start transition-colors">
      {/* Thumbnail or Tech Placeholder */}
      <div
        onClick={() => item.image_url && onPreviewImage(item.image_url, item.name)}
        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-[#0b0e14] border border-[#1e2536] flex items-center justify-center shrink-0 overflow-hidden relative ${
          item.image_url ? 'cursor-pointer hover:border-slate-500' : 'bg-tech-grid'
        }`}
      >
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover transition-opacity hover:opacity-90"
            loading="lazy"
          />
        ) : (
          <IconComponent className="w-6 h-6 text-slate-600 stroke-[1.5]" />
        )}
      </div>

      {/* Main Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-1 font-mono">
              <span
                className={`inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.2 rounded border ${badge.classes}`}
              >
                <IconComponent className="w-2.5 h-2.5" />
                <span>{item.category}</span>
              </span>
            </div>
            <h4 className="font-semibold text-slate-100 text-xs sm:text-sm leading-snug line-clamp-1">
              {item.name}
            </h4>
          </div>

          {/* Context Menu */}
          <div className="relative shrink-0">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 rounded hover:bg-[#1a2130] text-slate-500 hover:text-slate-200 transition-colors"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1 w-36 bg-[#141924] border border-[#293245] rounded-lg shadow-xl z-50 py-1 text-xs">
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      onEdit(item)
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-slate-200 hover:bg-[#1f2738] transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      onMove(item)
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-slate-200 hover:bg-[#1f2738] transition-colors"
                  >
                    <MoveHorizontal className="w-3.5 h-3.5 text-sky-400" />
                    <span>Move Box</span>
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      onDelete(item)
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-rose-400 hover:bg-rose-950/40 transition-colors border-t border-[#232b3d]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {item.notes && (
          <p className="text-[11px] font-mono text-slate-400 mt-1 line-clamp-1 text-slate-400">
            // {item.notes}
          </p>
        )}

        {/* Tactile Quantity Stepper */}
        <div className="mt-2.5 flex items-center justify-between gap-2 pt-2 border-t border-[#1e2536]">
          <span className="text-[11px] font-mono text-slate-500 uppercase">Stock:</span>
          <div className="flex items-center bg-[#0b0e14] border border-[#22293b] rounded p-0.5">
            <button
              onClick={() => onUpdateQuantity(item.id, -1)}
              disabled={item.quantity <= 0}
              className="btn-tactile w-6 h-6 flex items-center justify-center rounded text-slate-400 hover:text-white hover:bg-[#181f2c] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              title="Decrease by 1"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span
              className={`min-w-[28px] text-center font-mono text-xs font-semibold px-1 tabular-nums ${
                item.quantity === 0
                  ? 'text-rose-400'
                  : item.quantity <= 2
                  ? 'text-amber-400'
                  : 'text-slate-100'
              }`}
            >
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, 1)}
              className="btn-tactile w-6 h-6 flex items-center justify-center rounded text-slate-400 hover:text-white hover:bg-[#181f2c] transition-colors"
              title="Increase by 1"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
