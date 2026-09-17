import type { FC } from 'react'
import {
  Layers,
  Search,
  QrCode,
  Plus,
  Settings
} from 'lucide-react'
import { useI18n } from '../services/i18n'

interface MobileBottomBarProps {
  onGoHome: () => void
  onOpenSearch: () => void
  onOpenScanner: () => void
  onQuickAdd: () => void
  onOpenSettings: () => void
  hasCloudSync: boolean
}

export const MobileBottomBar: FC<MobileBottomBarProps> = ({
  onGoHome,
  onOpenSearch,
  onOpenScanner,
  onQuickAdd,
  onOpenSettings,
  hasCloudSync
}) => {
  const { t } = useI18n()

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0e121a]/95 backdrop-blur border-t border-slate-200 dark:border-[#232a3c] shadow-2xl transition-colors"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-center justify-around h-14 px-2 max-w-lg mx-auto">
        {/* 1. Home / Root */}
        <button
          onClick={onGoHome}
          className="btn-tactile flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-slate-400 hover:text-white dark:hover:text-white text-slate-600 dark:text-slate-400 transition-colors"
        >
          <Layers className="w-4 h-4 mb-0.5 text-amber-500" />
          <span className="text-[10px] font-mono uppercase tracking-tight">{t('dockHome')}</span>
        </button>

        {/* 2. Search */}
        <button
          onClick={onOpenSearch}
          className="btn-tactile flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-slate-400 hover:text-white dark:hover:text-white text-slate-600 dark:text-slate-400 transition-colors"
        >
          <Search className="w-4 h-4 mb-0.5 text-slate-400" />
          <span className="text-[10px] font-mono uppercase tracking-tight">{t('dockSearch')}</span>
        </button>

        {/* 3. QR Scanner - Prominent Center Floating Button */}
        <div className="flex-1 flex items-center justify-center">
          <button
            onClick={onOpenScanner}
            aria-label={t('dockScan')}
            className="btn-tactile flex items-center justify-center w-11 h-11 -mt-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-lg shadow-sky-500/20 border-2 border-[#0e121a] dark:border-[#0e121a] border-white transition-transform active:scale-95"
          >
            <QrCode className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>

        {/* 4. Add Action */}
        <button
          onClick={onQuickAdd}
          className="btn-tactile flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-slate-400 hover:text-white dark:hover:text-white text-slate-600 dark:text-slate-400 transition-colors"
        >
          <Plus className="w-4 h-4 mb-0.5 text-amber-500 stroke-[2.5]" />
          <span className="text-[10px] font-mono uppercase tracking-tight">{t('dockAdd')}</span>
        </button>

        {/* 5. Settings with Cloud status indicator */}
        <button
          onClick={onOpenSettings}
          className="btn-tactile flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-slate-400 hover:text-white dark:hover:text-white text-slate-600 dark:text-slate-400 transition-colors relative"
        >
          <div className="relative">
            <Settings className="w-4 h-4 mb-0.5" />
            <span
              className={`absolute -top-0.5 -right-1 w-2 h-2 rounded-full ${
                hasCloudSync
                  ? 'bg-emerald-400 ring-2 ring-[#0e121a]'
                  : 'bg-amber-400 ring-2 ring-[#0e121a]'
              }`}
            />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-tight">{t('dockSettings')}</span>
        </button>
      </div>
    </nav>
  )
}
