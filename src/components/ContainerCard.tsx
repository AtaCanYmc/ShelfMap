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
    <div className="group relative bg-slate-900 border border-slate-800 hover:border-indigo-600/50 rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-indigo-950/30 flex flex-col">
      {/* Cover Image or Fallback */}
      <div
        onClick={() => onOpen(container.id)}
        className="relative aspect-[16/10] w-full bg-slate-950 cursor-pointer overflow-hidden"
      >
        {container.image_url ? (
          <img
            src={container.image_url}
            alt={container.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/40 text-slate-700 group-hover:text-indigo-400 transition-colors">
            <FolderOpen className="w-12 h-12 stroke-[1.5]" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/20" />

        {/* Badges on image */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
          {subContainerCount > 0 && (
            <span className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-sky-400 border border-sky-900/50 shadow-sm">
              <Layers className="w-3 h-3" />
              <span>{subContainerCount} alt kutu</span>
            </span>
          )}
          {itemCount > 0 && (
            <span className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-emerald-400 border border-emerald-900/50 shadow-sm">
              <Box className="w-3 h-3" />
              <span>{itemCount} parça</span>
            </span>
          )}
        </div>

        {/* Quick QR button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onPrintQr(container)
          }}
          title="QR Kodu Görüntüle & Yazdır"
          className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-slate-900/80 backdrop-blur-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700/50"
        >
          <QrCode className="w-4 h-4" />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div onClick={() => onOpen(container.id)} className="cursor-pointer">
          <h3 className="font-semibold text-slate-100 text-base group-hover:text-indigo-400 transition-colors line-clamp-1">
            {container.name}
          </h3>
          {container.description && (
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              {container.description}
            </p>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <button
            onClick={() => onOpen(container.id)}
            className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            <span>İçeriği Aç</span>
            <span className="text-sm">→</span>
          </button>

          {/* Context Menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 bottom-full mb-1 w-40 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 py-1 text-xs animate-in fade-in">
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      onEdit(container)
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-200 hover:bg-slate-700 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Düzenle</span>
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      onMove(container)
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-200 hover:bg-slate-700 transition-colors"
                  >
                    <MoveHorizontal className="w-3.5 h-3.5 text-sky-400" />
                    <span>Konumunu Değiştir</span>
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      onPrintQr(container)
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-200 hover:bg-slate-700 transition-colors"
                  >
                    <QrCode className="w-3.5 h-3.5 text-purple-400" />
                    <span>QR Etiketi Yazdır</span>
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      onDelete(container)
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
      </div>
    </div>
  )
}
