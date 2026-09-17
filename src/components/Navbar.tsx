import { useState, type FC } from 'react'
import {
  QrCode,
  Settings,
  Search,
  Plus,
  Box,
  Layers
} from 'lucide-react'
import type { SupabaseConfig } from '../types'
import { useI18n } from '../services/i18n'

interface NavbarProps {
  config: SupabaseConfig
  onOpenScanner: () => void
  onOpenSettings: () => void
  onOpenSearch: () => void
  onNewContainer: () => void
  onNewItem: () => void
  onGoHome: () => void
}

export const Navbar: FC<NavbarProps> = ({
  config,
  onOpenScanner,
  onOpenSettings,
  onOpenSearch,
  onNewContainer,
  onNewItem,
  onGoHome
}) => {
  const { t } = useI18n()
  const [addMenuOpen, setAddMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 bg-[#0e121a]/95 dark:bg-[#0e121a]/95 bg-white/95 backdrop-blur border-b border-[#222838] dark:border-[#222838] border-slate-200 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between gap-2 sm:gap-3">
        {/* Brand */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-2 sm:gap-2.5 text-left group focus:outline-none shrink-0 min-h-[44px]"
        >
          <div className="w-8 h-8 rounded bg-[#161c28] dark:bg-[#161c28] bg-amber-50 border border-[#2d364a] dark:border-[#2d364a] border-amber-300 flex items-center justify-center text-amber-500 group-hover:border-amber-500 transition-colors">
            <Layers className="w-4 h-4 stroke-[2]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold tracking-tight text-white dark:text-white text-slate-900 text-sm sm:text-base font-mono">
              SHELFMAP
            </span>
            <span className="hidden sm:inline-block text-[10px] font-mono text-slate-500 font-medium px-1 py-0.2 rounded bg-[#161c28] dark:bg-[#161c28] bg-slate-100 border border-[#232a3b] dark:border-[#232a3b] border-slate-300">
              v0.1
            </span>
          </div>
        </button>

        {/* Technical Search Bar */}
        <div className="flex-1 max-w-md mx-1 sm:mx-2">
          <button
            onClick={onOpenSearch}
            className="w-full min-h-[40px] flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#121620] dark:bg-[#121620] bg-slate-100 border border-[#232a3b] dark:border-[#232a3b] border-slate-300 hover:border-amber-500/50 text-slate-400 hover:text-slate-200 dark:hover:text-slate-200 text-slate-600 hover:text-slate-900 text-xs transition-colors"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="truncate">{t('searchPrompt')}</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-[#1a202c] dark:bg-[#1a202c] bg-slate-200 border border-[#2d364a] dark:border-[#2d364a] border-slate-300 rounded">
              /
            </kbd>
          </button>
        </div>

        {/* Desktop Action Controls (On mobile, most are available via MobileBottomBar) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Quick QR Scanner - Desktop only */}
          <button
            onClick={onOpenScanner}
            title={t('qrScannerTitle')}
            className="hidden md:inline-flex btn-tactile p-2 rounded-lg bg-[#141924] dark:bg-[#141924] bg-slate-100 hover:bg-[#1a202e] dark:hover:bg-[#1a202e] hover:bg-slate-200 text-slate-300 dark:text-slate-300 text-slate-700 hover:text-white dark:hover:text-white border border-[#242b3c] dark:border-[#242b3c] border-slate-300 transition-colors min-w-[40px] min-h-[40px] items-center justify-center"
          >
            <QrCode className="w-4 h-4 text-sky-400" />
          </button>

          {/* Add Dropdown */}
          <div className="relative">
            <button
              onClick={() => setAddMenuOpen(!addMenuOpen)}
              className="btn-tactile flex items-center gap-1.5 py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-lg text-xs transition-colors min-h-[40px]"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden xs:inline">{t('add')}</span>
            </button>

            {addMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setAddMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-52 bg-[#131722] dark:bg-[#131722] bg-white border border-[#252c3d] dark:border-[#252c3d] border-slate-300 rounded-xl shadow-xl z-50 py-1 text-xs">
                  <button
                    onClick={() => {
                      setAddMenuOpen(false)
                      onNewContainer()
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-slate-200 dark:text-slate-200 text-slate-700 hover:bg-[#1c2232] dark:hover:bg-[#1c2232] hover:bg-slate-100 hover:text-white dark:hover:text-white hover:text-slate-900 transition-colors"
                  >
                    <Layers className="w-4 h-4 text-amber-500" />
                    <span>{t('newContainer')}</span>
                  </button>
                  <button
                    onClick={() => {
                      setAddMenuOpen(false)
                      onNewItem()
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-slate-200 dark:text-slate-200 text-slate-700 hover:bg-[#1c2232] dark:hover:bg-[#1c2232] hover:bg-slate-100 hover:text-white dark:hover:text-white hover:text-slate-900 transition-colors"
                  >
                    <Box className="w-4 h-4 text-sky-400" />
                    <span>{t('newItem')}</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Database / Settings Status Pill */}
          <button
            onClick={onOpenSettings}
            title={t('settingsTitle')}
            className="btn-tactile flex items-center gap-1.5 py-2 px-2.5 rounded-lg bg-[#141924] dark:bg-[#141924] bg-slate-100 hover:bg-[#1a202e] dark:hover:bg-[#1a202e] hover:bg-slate-200 text-slate-300 dark:text-slate-300 text-slate-700 hover:text-white dark:hover:text-white border border-[#242b3c] dark:border-[#242b3c] border-slate-300 text-xs transition-colors min-h-[40px]"
          >
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                config.isConfigured && !config.useDemoMode
                  ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]'
                  : 'bg-amber-400'
              }`}
            />
            <span className="hidden md:inline font-mono text-[11px] text-slate-400 dark:text-slate-400 text-slate-600">
              {config.isConfigured && !config.useDemoMode ? t('byosOnline') : t('localDemo')}
            </span>
            <Settings className="w-3.5 h-3.5 text-slate-400 dark:text-slate-400 text-slate-600 ml-0.5" />
          </button>
        </div>
      </div>
    </header>
  )
}
