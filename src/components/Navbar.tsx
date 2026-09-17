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
    <header className="sticky top-0 z-30 bg-[#0e121a]/95 backdrop-blur border-b border-[#222838]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-13 flex items-center justify-between gap-3">
        {/* Brand */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-2.5 text-left group focus:outline-none shrink-0"
        >
          <div className="w-7 h-7 rounded bg-[#161c28] border border-[#2d364a] flex items-center justify-center text-amber-400 group-hover:border-amber-500/50 transition-colors">
            <Layers className="w-4 h-4 stroke-[2]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold tracking-tight text-white text-sm sm:text-base font-mono">
              SHELFMAP
            </span>
            <span className="hidden md:inline-block text-[10px] font-mono text-slate-500 font-medium px-1 py-0.2 rounded bg-[#161c28] border border-[#232a3b]">
              v0.1
            </span>
          </div>
        </button>

        {/* Technical Search Bar */}
        <div className="flex-1 max-w-md mx-1 sm:mx-2">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#121620] border border-[#232a3b] hover:border-[#38435c] text-slate-400 hover:text-slate-200 text-xs transition-colors"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="truncate">Search components, tools, bins...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-[#1a202c] border border-[#2d364a] rounded">
              /
            </kbd>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick QR Scanner */}
          <button
            onClick={onOpenScanner}
            title="Scan Physical QR Code"
            className="btn-tactile p-2 rounded-lg bg-[#141924] hover:bg-[#1a202e] text-slate-300 hover:text-white border border-[#242b3c] transition-colors"
          >
            <QrCode className="w-4 h-4 text-sky-400" />
          </button>

          {/* Add Dropdown */}
          <div className="relative">
            <button
              onClick={() => setAddMenuOpen(!addMenuOpen)}
              className="btn-tactile flex items-center gap-1.5 py-1.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-lg text-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden xs:inline">Add</span>
            </button>

            {addMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setAddMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-[#131722] border border-[#252c3d] rounded-xl shadow-xl z-50 py-1 text-xs">
                  <button
                    onClick={() => {
                      setAddMenuOpen(false)
                      onNewContainer()
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-200 hover:bg-[#1c2232] hover:text-white transition-colors"
                  >
                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                    <span>New Container / Bin</span>
                  </button>
                  <button
                    onClick={() => {
                      setAddMenuOpen(false)
                      onNewItem()
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-200 hover:bg-[#1c2232] hover:text-white transition-colors"
                  >
                    <Box className="w-3.5 h-3.5 text-sky-400" />
                    <span>New Item / Component</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Database / Settings Status Pill */}
          <button
            onClick={onOpenSettings}
            title={
              config.isConfigured && !config.useDemoMode
                ? 'Supabase Backend Connected'
                : 'Running in Local Demo Storage'
            }
            className="btn-tactile flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-[#141924] hover:bg-[#1a202e] text-slate-300 hover:text-white border border-[#242b3c] text-xs transition-colors"
          >
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                config.isConfigured && !config.useDemoMode
                  ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]'
                  : 'bg-amber-400'
              }`}
            />
            <span className="hidden md:inline font-mono text-[11px] text-slate-400">
              {config.isConfigured && !config.useDemoMode ? 'BYOS' : 'LOCAL'}
            </span>
            <Settings className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>
        </div>
      </div>
    </header>
  )
}
