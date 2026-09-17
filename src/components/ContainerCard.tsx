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
import { useI18n } from '../services/i18n'

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
  const { t } = useI18n()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="group relative bg-white dark:bg-[#121622] border border-slate-200 dark:border-[#232a3b] hover:border-amber-500/50 rounded-xl overflow-hidden transition-colors flex flex-col shadow-sm">
      {/* Cover Image or Technical Grid */}
      <div
        onClick={() => onOpen(container.id)}
        className="relative aspect-[16/10] w-full bg-slate-100 dark:bg-[#0b0e14] cursor-pointer overflow-hidden border-b border-slate-200 dark:border-[#1f2638]"
      >
        {container.image_url ? (
          <img
            src={container.image_url}
            alt={container.name}
            className="w-full h-full object-cover transition-opacity hover:opacity-90"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-tech-grid text-slate-500 group-hover:text-amber-500 transition-colors">
            <FolderOpen className="w-9 h-9 stroke-[1.5]" />
          </div>
        )}

        {/* Badges on image */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1 font-mono">
          {subContainerCount > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-white/90 dark:bg-[#0b0e14]/90 text-sky-500 dark:text-sky-400 border border-slate-200 dark:border-[#232b3d] shadow-sm">
              <Layers className="w-2.5 h-2.5" />
              <span>{subContainerCount}</span>
            </span>
          )}
          {itemCount > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-white/90 dark:bg-[#0b0e14]/90 text-amber-500 border border-slate-200 dark:border-[#232b3d] shadow-sm">
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
          title={t('printLabelsTitle')}
          className="btn-tactile absolute top-2 right-2 p-1.5 rounded bg-white/90 dark:bg-[#0b0e14]/90 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-[#232b3d] transition-colors shadow-sm"
        >
          <QrCode className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div onClick={() => onOpen(container.id)} className="cursor-pointer">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm group-hover:text-amber-500 transition-colors line-clamp-1">
            {container.name}
          </h3>
          {container.description && (
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
              {container.description}
            </p>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-[#1e2536] flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
          <button
            onClick={() => onOpen(container.id)}
            className="flex items-center gap-1 text-sky-500 dark:text-sky-400 hover:text-sky-600 dark:hover:text-sky-300 font-medium font-mono text-xs transition-colors min-h-[32px]"
          >
            <span>{t('open').toUpperCase()}</span>
            <span className="text-sm">→</span>
          </button>

          {/* Context Menu */}
          <div className="relative">
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
                <div className="absolute right-0 bottom-full mb-1 w-44 bg-white dark:bg-[#141924] border border-slate-300 dark:border-[#293245] rounded-lg shadow-xl z-50 py-1 text-xs font-sans">
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      onEdit(container)
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1f2738] hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t('edit')}</span>
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      onMove(container)
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1f2738] hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <MoveHorizontal className="w-3.5 h-3.5 text-sky-400" />
                    <span>{t('move')}</span>
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      onPrintQr(container)
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1f2738] hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <QrCode className="w-3.5 h-3.5 text-amber-500" />
                    <span>{t('printLabelsTitle')}</span>
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      onDelete(container)
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
      </div>
    </div>
  )
}
