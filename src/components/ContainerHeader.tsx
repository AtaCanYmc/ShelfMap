import type { FC } from 'react'
import type { Container, Item } from '../types'
import {
  Layers,
  Box,
  QrCode,
  Edit2,
  Plus,
  Trash2,
  FolderPlus,
  AlertTriangle
} from 'lucide-react'
import { useI18n } from '../services/i18n'

interface ContainerHeaderProps {
  currentContainer: Container | null
  subContainers: Container[]
  items: Item[]
  totalAllItems: Item[]
  totalAllContainers: Container[]
  onAddSubContainer: () => void
  onAddItem: () => void
  onEditContainer: (c: Container) => void
  onDeleteContainer: (c: Container) => void
  onPrintQr: (c: Container) => void
  onPreviewImage: (url: string, title: string) => void
}

export const ContainerHeader: FC<ContainerHeaderProps> = ({
  currentContainer,
  subContainers,
  items,
  totalAllItems,
  totalAllContainers,
  onAddSubContainer,
  onAddItem,
  onEditContainer,
  onDeleteContainer,
  onPrintQr,
  onPreviewImage
}) => {
  const { t } = useI18n()

  if (!currentContainer) {
    // Root level view
    const lowStockCount = totalAllItems.filter((i) => i.quantity <= 1).length

    return (
      <div className="bg-[#11151f] dark:bg-[#11151f] bg-white border border-[#22293b] dark:border-[#22293b] border-slate-200 rounded-xl p-4 sm:p-6 mb-6 shadow-sm transition-colors">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-500 font-semibold px-2 py-0.5 rounded bg-amber-950/40 dark:bg-amber-950/40 bg-amber-100 border border-amber-800/40 dark:border-amber-800/40 border-amber-300">
                {t('root')}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white dark:text-white text-slate-900 tracking-tight">
              {t('primaryLocations')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 text-slate-600 mt-1.5 leading-relaxed">
              {t('searchGuideText')}
            </p>
          </div>

          {/* Technical Stat Strip */}
          <div className="grid grid-cols-3 gap-2 shrink-0 font-mono">
            <div className="px-3 py-2 rounded-lg bg-[#0e1219] dark:bg-[#0e1219] bg-slate-50 border border-[#1f2638] dark:border-[#1f2638] border-slate-200 text-left">
              <div className="text-base sm:text-lg font-bold text-white dark:text-white text-slate-900 tabular-nums">
                {totalAllContainers.length}
              </div>
              <div className="text-[10px] text-slate-500 uppercase">{t('nestedBinsCount')}</div>
            </div>
            <div className="px-3 py-2 rounded-lg bg-[#0e1219] dark:bg-[#0e1219] bg-slate-50 border border-[#1f2638] dark:border-[#1f2638] border-slate-200 text-left">
              <div className="text-base sm:text-lg font-bold text-white dark:text-white text-slate-900 tabular-nums">
                {totalAllItems.length}
              </div>
              <div className="text-[10px] text-slate-500 uppercase">{t('itemsCount')}</div>
            </div>
            <div className={`px-3 py-2 rounded-lg border text-left ${
              lowStockCount > 0
                ? 'bg-amber-950/20 dark:bg-amber-950/20 bg-amber-50 border-amber-800/50 dark:border-amber-800/50 border-amber-300 text-amber-500'
                : 'bg-[#0e1219] dark:bg-[#0e1219] bg-slate-50 border-[#1f2638] dark:border-[#1f2638] border-slate-200 text-slate-400'
            }`}>
              <div className="text-base sm:text-lg font-bold tabular-nums flex items-center gap-1">
                {lowStockCount > 0 && <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                <span>{lowStockCount}</span>
              </div>
              <div className="text-[10px] text-slate-500 uppercase">Alert</div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-5 pt-4 border-t border-[#1f2638] dark:border-[#1f2638] border-slate-200 flex flex-wrap items-center gap-2.5">
          <button
            onClick={onAddSubContainer}
            className="btn-tactile inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors min-h-[40px]"
          >
            <FolderPlus className="w-4 h-4 stroke-[2]" />
            <span>{t('createFirstContainer')}</span>
          </button>
          <button
            onClick={onAddItem}
            className="btn-tactile inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg bg-[#181e2b] dark:bg-[#181e2b] bg-slate-100 hover:bg-[#202738] dark:hover:bg-[#202738] hover:bg-slate-200 text-slate-200 dark:text-slate-200 text-slate-800 border border-[#273147] dark:border-[#273147] border-slate-300 transition-colors min-h-[40px]"
          >
            <Plus className="w-4 h-4 text-sky-400" />
            <span>{t('createFirstItem')}</span>
          </button>
        </div>
      </div>
    )
  }

  // Inside a specific container
  return (
    <div className="bg-[#11151f] dark:bg-[#11151f] bg-white border border-[#22293b] dark:border-[#22293b] border-slate-200 rounded-xl overflow-hidden mb-6 shadow-sm transition-colors">
      <div className="flex flex-col md:flex-row">
        {/* Photo or technical placeholder */}
        {currentContainer.image_url ? (
          <div
            onClick={() => onPreviewImage(currentContainer.image_url!, currentContainer.name)}
            className="md:w-60 h-44 md:h-auto bg-[#0b0e14] dark:bg-[#0b0e14] bg-slate-100 relative overflow-hidden shrink-0 cursor-pointer group"
          >
            <img
              src={currentContainer.image_url}
              alt={currentContainer.name}
              className="w-full h-full object-cover transition-opacity hover:opacity-90"
            />
          </div>
        ) : (
          <div className="md:w-44 h-24 md:h-auto bg-[#0b0e14] dark:bg-[#0b0e14] bg-slate-100 bg-tech-grid flex items-center justify-center shrink-0 border-b md:border-b-0 md:border-r border-[#1f2638] dark:border-[#1f2638] border-slate-200">
            <Layers className="w-10 h-10 text-slate-600 dark:text-slate-700 stroke-[1.5]" />
          </div>
        )}

        {/* Content */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1 font-mono">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#181f2c] dark:bg-[#181f2c] bg-sky-100 text-sky-500 dark:text-sky-400 border border-[#27334a] dark:border-[#27334a] border-sky-200">
                    CONTAINER
                  </span>
                  {currentContainer.qr_code && (
                    <button
                      onClick={() => onPrintQr(currentContainer)}
                      className="inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-white dark:hover:text-white text-slate-600 hover:text-slate-900 px-2 py-0.5 rounded bg-[#141924] dark:bg-[#141924] bg-slate-100 border border-[#232b3d] dark:border-[#232b3d] border-slate-300 transition-colors"
                      title={t('printLabelsTitle')}
                    >
                      <QrCode className="w-3 h-3 text-amber-500" />
                      <span>{currentContainer.qr_code.replace('shelfmap://c/', '')}</span>
                    </button>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white dark:text-white text-slate-900 tracking-tight">
                  {currentContainer.name}
                </h2>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => onEditContainer(currentContainer)}
                  className="btn-tactile p-2 rounded-lg bg-[#161c28] dark:bg-[#161c28] bg-slate-100 hover:bg-[#202838] dark:hover:bg-[#202838] hover:bg-slate-200 text-slate-300 dark:text-slate-300 text-slate-700 hover:text-white dark:hover:text-white border border-[#263147] dark:border-[#263147] border-slate-300 transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center"
                  title={t('edit')}
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onPrintQr(currentContainer)}
                  className="btn-tactile p-2 rounded-lg bg-[#161c28] dark:bg-[#161c28] bg-slate-100 hover:bg-[#202838] dark:hover:bg-[#202838] hover:bg-slate-200 text-slate-300 dark:text-slate-300 text-slate-700 hover:text-white dark:hover:text-white border border-[#263147] dark:border-[#263147] border-slate-300 transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center"
                  title={t('printLabelsTitle')}
                >
                  <QrCode className="w-3.5 h-3.5 text-amber-500" />
                </button>
                <button
                  onClick={() => onDeleteContainer(currentContainer)}
                  className="btn-tactile p-2 rounded-lg bg-[#161c28] dark:bg-[#161c28] bg-slate-100 hover:bg-rose-950/50 hover:text-rose-400 text-slate-400 dark:text-slate-400 text-slate-600 border border-[#263147] dark:border-[#263147] border-slate-300 hover:border-rose-900/60 transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center"
                  title={t('delete')}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {currentContainer.description && (
              <p className="text-xs sm:text-sm text-slate-300 dark:text-slate-300 text-slate-700 mt-2 leading-relaxed">
                {currentContainer.description}
              </p>
            )}

            {/* Counts */}
            <div className="flex items-center gap-3 mt-3 text-xs font-mono text-slate-400 dark:text-slate-400 text-slate-600">
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-sky-400" />
                <strong className="text-slate-200 dark:text-slate-200 text-slate-800 tabular-nums">{subContainers.length}</strong> {t('nestedBinsCount')}
              </span>
              <span className="text-slate-500 dark:text-slate-700">•</span>
              <span className="flex items-center gap-1">
                <Box className="w-3.5 h-3.5 text-amber-500" />
                <strong className="text-slate-200 dark:text-slate-200 text-slate-800 tabular-nums">{items.length}</strong> {t('itemsCount')}
              </span>
            </div>
          </div>

          {/* Action Bar */}
          <div className="mt-4 pt-3 border-t border-[#1f2638] dark:border-[#1f2638] border-slate-200 flex flex-wrap items-center gap-2">
            <button
              onClick={onAddItem}
              className="btn-tactile inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors min-h-[38px]"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{t('createFirstItem')}</span>
            </button>
            <button
              onClick={onAddSubContainer}
              className="btn-tactile inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-[#181e2b] dark:bg-[#181e2b] bg-slate-100 hover:bg-[#202738] dark:hover:bg-[#202738] hover:bg-slate-200 text-slate-200 dark:text-slate-200 text-slate-800 border border-[#273147] dark:border-[#273147] border-slate-300 transition-colors min-h-[38px]"
            >
              <FolderPlus className="w-3.5 h-3.5 text-slate-500" />
              <span>{t('createFirstContainer')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
