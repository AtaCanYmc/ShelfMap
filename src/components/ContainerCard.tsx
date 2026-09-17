import { useState, type FC } from 'react'
import type { Container } from '../types'
import {
  Layers,
  Box,
  QrCode,
  MoreVertical,
  Edit2,
  Trash2,
  MoveHorizontal,
  FolderOpen
} from 'lucide-react'

interface ContainerCardProps {
  container: Container
  subContainerCount: number
  itemCount: number
  onOpen: (id: string) => void
  onEdit: (container: Container) => void
  onDelete: (container: Container) => void
  onMove: (container: Container) => void
  onPrintQr: (container: Container) => void
}

export const ContainerCard: FC<ContainerCardProps> = ({
  container,
  subContainerCount,
  itemCount,
  onOpen,
  onEdit,
  onDelete,
  onMove,
  onPrintQr
}) => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="group relative bg-[#121622] border border-[#232a3b] hover:border-[#3b4764] rounded-xl overflow-hidden transition-colors flex flex-col">
      {/* Cover Image or Technical Grid */}
      <div
        onClick={() => onOpen(container.id)}
        className="relative aspect-[16/10] w-full bg-[#0b0e14] cursor-pointer overflow-hidden border-b border-[#1f2638]"
      >
        {container.image_url ? (
          <img
            src={container.image_url}
            alt={container.name}
            className="w-full h-full object-cover transition-opacity hover:opacity-90"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-tech-grid text-slate-700 group-hover:text-slate-500 transition-colors">
            <FolderOpen className="w-9 h-9 stroke-[1.5]" />
          </div>
        )}

        {/* Badges on image */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1 font-mono">
          {subContainerCount > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-[#0b0e14]/90 text-sky-400 border border-[#232b3d]">
              <Layers className="w-2.5 h-2.5" />
              <span>{subContainerCount}</span>
            </span>
          )}
          {itemCount > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-[#0b0e14]/90 text-amber-400 border border-[#232b3d]">
              <Box className="w-2.5 h-2.5" />
              <span>{itemCount}</span>
            </span>
          )}
        </div>

        {/* Quick QR print button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onPrintQr(container)
          }}
          title="View & Print QR Label"
          className="btn-tactile absolute top-2 right-2 p-1.5 rounded bg-[#0b0e14]/90 text-slate-400 hover:text-white border border-[#232b3d] transition-colors"
        >
          <QrCode className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div onClick={() => onOpen(container.id)} className="cursor-pointer">
          <h3 className="font-semibold text-slate-100 text-sm group-hover:text-amber-400 transition-colors line-clamp-1">
            {container.name}
          </h3>
          {container.description && (
            <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
              {container.description}
            </p>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-3 pt-2.5 border-t border-[#1e2536] flex items-center justify-between text-xs text-slate-400">
          <button
            onClick={() => onOpen(container.id)}
            className="flex items-center gap-1 text-sky-400 hover:text-sky-300 font-medium font-mono text-xs transition-colors"
          >
            <span>OPEN</span>
            <span className="text-sm">→</span>
          </button>

          {/* Context Menu */}
          <div className="relative">
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
                <div className="absolute right-0 bottom-full mb-1 w-40 bg-[#141924] border border-[#293245] rounded-lg shadow-xl z-50 py-1 text-xs font-sans">
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      onEdit(container)
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-slate-200 hover:bg-[#1f2738] transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      onMove(container)
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-slate-200 hover:bg-[#1f2738] transition-colors"
                  >
                    <MoveHorizontal className="w-3.5 h-3.5 text-sky-400" />
                    <span>Move Location</span>
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      onPrintQr(container)
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-slate-200 hover:bg-[#1f2738] transition-colors"
                  >
                    <QrCode className="w-3.5 h-3.5 text-amber-400" />
                    <span>Print QR Label</span>
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      onDelete(container)
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
      </div>
    </div>
  )
}
