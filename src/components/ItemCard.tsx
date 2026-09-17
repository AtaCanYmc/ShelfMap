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
import { useI18n } from '../services/i18n'

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
      classes: 'bg-sky-100 dark:bg-sky-950/40 text-sky-500 dark:text-sky-400 border-sky-300 dark:border-sky-800/40'
    }
  }
  if (cat.includes('tool') || cat.includes('caliper') || cat.includes('iron') || cat.includes('plier')) {
    return {
      icon: Wrench,
      classes: 'bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800/40'
    }
  }
  if (cat.includes('sensor') || cat.includes('rf') || cat.includes('module') || cat.includes('display')) {
    return {
      icon: Radio,
      classes: 'bg-violet-100 dark:bg-violet-950/40 text-violet-500 dark:text-violet-400 border-violet-300 dark:border-violet-800/40'
    }
  }
  if (cat.includes('screw') || cat.includes('nut') || cat.includes('hardware') || cat.includes('fastener')) {
    return {
      icon: Sliders,
      classes: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800/40'
    }
  }
  return {
    icon: Package,
    classes: 'bg-slate-100 dark:bg-[#181f2c] text-slate-500 dark:text-slate-400 border-slate-300 dark:border-[#273248]'
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
  const { t, categoryName } = useI18n()
  const [menuOpen, setMenuOpen] = useState(false)
  const badge = getCategoryBadge(item.category)
  const IconComponent = badge.icon

  return (
    <div className="group bg-white dark:bg-[#121622] border border-slate-200 dark:border-[#232a3b] hover:border-amber-500/50 rounded-xl p-3 sm:p-3.5 flex gap-3 items-start transition-colors shadow-sm">
      {/* Thumbnail or Tech Placeholder */}
      <div
        onClick={() => item.image_url && onPreviewImage(item.image_url, item.name)}
        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-slate-100 dark:bg-[#0b0e14] border border-slate-200 dark:border-[#1e2536] flex items-center justify-center shrink-0 overflow-hidden relative ${
          item.image_url ? 'cursor-pointer hover:border-amber-500' : 'bg-tech-grid'
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
          <IconComponent className="w-6 h-6 text-slate-500 stroke-[1.5]" />
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
                <span>{categoryName(item.category)}</span>
              </span>
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm leading-snug line-clamp-1">
              {item.name}
            </h4>
          </div>

          {/* Context Menu */}
          <div className="relative shrink-0">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-[#1a2130] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-[#141924] border border-slate-300 dark:border-[#293245] rounded-lg shadow-xl z-50 py-1 text-xs">
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      onEdit(item)
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1f2738] hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t('edit')}</span>
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      onMove(item)
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1f2738] hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <MoveHorizontal className="w-3.5 h-3.5 text-sky-400" />
                    <span>{t('move')}</span>
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      onDelete(item)
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors border-t border-slate-200 dark:border-[#232b3d]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{t('delete')}</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {item.notes && (
          <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
            // {item.notes}
          </p>
        )}

        {/* Tactile Quantity Stepper */}
        <div className="mt-2.5 flex items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-[#1e2536]">
          <span className="text-[11px] font-mono text-slate-500 uppercase">{t('stockLabel')}</span>
          <div className="flex items-center bg-slate-100 dark:bg-[#0b0e14] border border-slate-300 dark:border-[#22293b] rounded p-0.5">
            <button
              onClick={() => onUpdateQuantity(item.id, -1)}
              disabled={item.quantity <= 0}
              className="btn-tactile w-7 h-7 flex items-center justify-center rounded text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#181f2c] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              title={t('decreaseQuantity')}
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span
              className={`min-w-[32px] text-center font-mono text-xs font-semibold px-1 tabular-nums ${
                item.quantity === 0
                  ? 'text-rose-500 dark:text-rose-400'
                  : item.quantity <= 2
                  ? 'text-amber-500'
                  : 'text-slate-900 dark:text-slate-100'
              }`}
            >
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, 1)}
              className="btn-tactile w-7 h-7 flex items-center justify-center rounded text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#181f2c] transition-colors"
              title={t('increaseQuantity')}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
