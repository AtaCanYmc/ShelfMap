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
  const [addMenuOpen, setAddMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between gap-2">
        {/* Brand */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-2.5 text-left group focus:outline-none shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-blue-600 to-sky-400 p-0.5 shadow-md shadow-indigo-950">
            <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center group-hover:bg-slate-900 transition-colors">
              <Layers className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
          <div className="hidden sm:block">
            <span className="font-bold tracking-tight text-white text-base">Shelf</span>
            <span className="font-bold tracking-tight text-indigo-400 text-base">Map</span>
          </div>
        </button>

        {/* Search Bar Trigger */}
        <div className="flex-1 max-w-md mx-2">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 text-xs sm:text-sm transition-all shadow-inner"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="w-4 h-4 text-slate-500 shrink-0" />
              <span className="truncate">Parça, alet veya kutu ara...</span>
            </div>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-slate-900 border border-slate-800 rounded">
              /
            </kbd>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* QR Scanner */}
          <button
            onClick={onOpenScanner}
            title="Kutu QR Kodunu Tara"
            className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors relative"
          >
            <QrCode className="w-4 h-4 text-sky-400" />
          </button>

          {/* Add Dropdown */}
          <div className="relative">
            <button
              onClick={() => setAddMenuOpen(!addMenuOpen)}
              className="flex items-center gap-1.5 py-1.5 px-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors shadow-sm shadow-indigo-900/40"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden xs:inline">Ekle</span>
            </button>

            {addMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setAddMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl z-50 py-1.5 animate-in fade-in zoom-in-95 duration-100">
                  <button
                    onClick={() => {
                      setAddMenuOpen(false)
                      onNewContainer()
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    <Layers className="w-4 h-4 text-indigo-400" />
                    <span>Yeni Konteyner / Kutu</span>
                  </button>
                  <button
                    onClick={() => {
                      setAddMenuOpen(false)
                      onNewItem()
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    <Box className="w-4 h-4 text-emerald-400" />
                    <span>Yeni Eşya / Parça</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Settings / BYOS Status */}
          <button
            onClick={onOpenSettings}
            title={
              config.isConfigured && !config.useDemoMode
                ? 'Supabase Bağlı'
                : 'Demo / Yerel Mod (Supabase ayarları)'
            }
            className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors relative"
          >
            <Settings className="w-4 h-4" />
            <span
              className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ring-2 ring-slate-900 ${
                config.isConfigured && !config.useDemoMode
                  ? 'bg-emerald-400'
                  : 'bg-amber-400 animate-pulse'
              }`}
            />
          </button>
        </div>
      </div>
    </header>
  )
}
