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
  if (cat.includes('mikro') || cat.includes('esp') || cat.includes('arduino') || cat.includes('işlemci')) {
    return {
      icon: Cpu,
      classes: 'bg-sky-950/70 text-sky-400 border-sky-800/50'
    }
  }
  if (cat.includes('alet') || cat.includes('kumpas') || cat.includes('havya') || cat.includes('pense')) {
    return {
      icon: Wrench,
      classes: 'bg-amber-950/70 text-amber-400 border-amber-800/50'
    }
  }
  if (cat.includes('sensör') || cat.includes('rf') || cat.includes('anten') || cat.includes('modül')) {
    return {
      icon: Radio,
      classes: 'bg-purple-950/70 text-purple-400 border-purple-800/50'
    }
  }
  if (cat.includes('vida') || cat.includes('somun') || cat.includes('hırdavat') || cat.includes('mekanik')) {
    return {
      icon: Sliders,
      classes: 'bg-emerald-950/70 text-emerald-400 border-emerald-800/50'
    }
  }
  return {
    icon: Package,
    classes: 'bg-slate-800 text-slate-300 border-slate-700'
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
    <div className="group bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-3.5 sm:p-4 flex gap-3 sm:gap-4 items-start transition-all hover:shadow-md hover:shadow-slate-950/40">
      {/* Thumbnail */}
      <div
        onClick={() => item.image_url && onPreviewImage(item.image_url, item.name)}
        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 overflow-hidden relative ${
          item.image_url ? 'cursor-pointer' : ''
        }`}
      >
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            loading="lazy"
          />
        ) : (
          <IconComponent className="w-8 h-8 text-slate-700" />
        )}
      </div>

      {/* Main Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5 flex-wrap mb-1">
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${badge.classes}`}
              >
                <IconComponent className="w-3 h-3" />
                <span>{item.category}</span>
              </span>
            </div>
            <h4 className="font-semibold text-slate-100 text-sm sm:text-base leading-snug line-clamp-1">
              {item.name}
            </h4>
          </div>

          {/* Context Menu */}
          <div className="relative shrink-0">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1 w-36 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 py-1 text-xs animate-in fade-in">
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      onEdit(item)
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-200 hover:bg-slate-700 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Düzenle</span>
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      onMove(item)
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-200 hover:bg-slate-700 transition-colors"
                  >
                    <MoveHorizontal className="w-3.5 h-3.5 text-sky-400" />
                    <span>Kutuyu Değiştir</span>
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      onDelete(item)
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-rose-400 hover:bg-rose-950/40 transition-colors border-t border-slate-700/50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Sil</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {item.notes && (
          <p className="text-xs text-slate-400 mt-1 line-clamp-1 italic">
            "{item.notes}"
          </p>
        )}

        {/* Quantity Controls */}
        <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
          <span className="text-xs text-slate-400">Adet / Stok:</span>
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => onUpdateQuantity(item.id, -1)}
              disabled={item.quantity <= 0}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              title="1 Azalt"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span
              className={`min-w-[32px] text-center font-mono text-xs font-semibold px-1 ${
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
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="1 Arttır"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
