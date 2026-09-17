import { useState, type FC, type ChangeEvent } from 'react'
import type { SupabaseConfig, Container, Item } from '../types'
import {
  saveSupabaseConfig,
  testSupabaseConnection
} from '../services/supabaseClient'
import { SUPABASE_SETUP_SQL } from '../services/sqlGenerator'
import {
  exportAllData,
  importAllData,
  resetToDemoData
} from '../services/db'
import {
  X,
  Database,
  Check,
  AlertCircle,
  Copy,
  Download,
  Upload,
  RefreshCw,
  Loader2,
  Code2,
  ShieldCheck,
  HardDrive
} from 'lucide-react'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  config: SupabaseConfig
  onConfigUpdated: () => void
  containers: Container[]
  items: Item[]
  onDataReload: () => void
}

export const SettingsModal: FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onConfigUpdated,
  containers,
  items,
  onDataReload
}) => {
  const [activeTab, setActiveTab] = useState<'byos' | 'sql' | 'data'>('byos')
  const [url, setUrl] = useState(config.url)
  const [anonKey, setAnonKey] = useState(config.anonKey)
  const [useDemoMode, setUseDemoMode] = useState(config.useDemoMode)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [copiedSql, setCopiedSql] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleTestConnection = async () => {
    if (!url.trim() || !anonKey.trim()) {
      setTestResult({ success: false, message: 'Please enter both Supabase Project URL and Public Anon Key.' })
      return
    }

    setTesting(true)
    setTestResult(null)
    const res = await testSupabaseConnection(url, anonKey)
    setTesting(false)
    if (res.success) {
      setTestResult({ success: true, message: 'Supabase connection and database schema verified.' })
    } else {
      setTestResult({ success: false, message: res.error || 'Connection failed.' })
    }
  }

  const handleSave = () => {
    saveSupabaseConfig(url, anonKey, useDemoMode)
    onConfigUpdated()
    onClose()
  }

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL)
    setCopiedSql(true)
    setTimeout(() => setCopiedSql(false), 2500)
  }

  const handleExportBackup = () => {
    const jsonString = exportAllData(containers, items)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `shelfmap-inventory-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
  }

  const handleImportBackup = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string
        importAllData(text)
        setImportError(null)
        onDataReload()
        alert('Inventory snapshot restored successfully.')
      } catch (err: unknown) {
        setImportError(err instanceof Error ? err.message : 'Invalid inventory backup format.')
      }
    }
    reader.readAsText(file)
  }

  const handleResetDemo = () => {
    if (confirm('This will replace current local inventory with default Maker bench sample data (ESP32, TS100, M3 fasteners). Continue?')) {
      resetToDemoData()
      onDataReload()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#11151f] border border-[#232a3c] rounded-xl shadow-2xl overflow-hidden my-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#232a3c] bg-[#0c0f14]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-[#1a2234] border border-[#2d3a56] text-amber-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                Workbench Settings
              </div>
              <h3 className="font-semibold text-white text-sm">Database & Storage Configuration</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-[#1a2234] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#232a3c] bg-[#0c0f14]">
          <button
            onClick={() => setActiveTab('byos')}
            className={`flex-1 py-2.5 px-3 text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
              activeTab === 'byos'
                ? 'border-amber-500 text-amber-400 bg-[#141b2b]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>BYOS Supabase</span>
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`flex-1 py-2.5 px-3 text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
              activeTab === 'sql'
                ? 'border-amber-500 text-amber-400 bg-[#141b2b]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>SQL Schema</span>
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`flex-1 py-2.5 px-3 text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
              activeTab === 'data'
                ? 'border-amber-500 text-amber-400 bg-[#141b2b]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>Backup & Data</span>
          </button>
        </div>

        {/* Tab 1: BYOS Settings */}
        {activeTab === 'byos' && (
          <div className="p-5 space-y-4">
            <div className="p-3 rounded-lg bg-[#0c0f14] border border-[#232a3c] text-xs text-slate-300 leading-relaxed font-mono">
              <strong className="text-amber-400">Zero Telemetry:</strong> ShelfMap runs entirely client-side.
              Provide your own free Supabase credentials to sync inventory across devices, or keep Local Offline Mode active.
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#0c0f14] border border-[#232a3c]">
              <div>
                <div className="text-xs font-semibold text-white">Local Offline Storage</div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Store inventory solely in browser storage without cloud sync
                </div>
              </div>
              <input
                type="checkbox"
                checked={useDemoMode}
                onChange={(e) => setUseDemoMode(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-0 bg-[#11151f] border-[#232a3c] cursor-pointer"
              />
            </div>

            {/* URL Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                Supabase Project URL
              </label>
              <input
                type="url"
                disabled={useDemoMode}
                placeholder="https://xyzcompany.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 bg-[#0c0f14] border border-[#232a3c] focus:border-amber-500 disabled:opacity-40 rounded-lg text-xs text-slate-100 font-mono outline-none"
              />
            </div>

            {/* Anon Key Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                Supabase Anon / Public API Key
              </label>
              <input
                type="password"
                disabled={useDemoMode}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                className="w-full px-3 py-2 bg-[#0c0f14] border border-[#232a3c] focus:border-amber-500 disabled:opacity-40 rounded-lg text-xs text-slate-100 font-mono outline-none"
              />
            </div>

            {/* Test Connection Button */}
            {!useDemoMode && (
              <div>
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testing}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1a2234] hover:bg-[#232d45] text-slate-200 text-xs font-mono font-medium transition-colors border border-[#2e3b57]"
                >
                  {testing ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5" />
                  )}
                  <span>Test Connection</span>
                </button>

                {testResult && (
                  <div
                    className={`mt-2 p-2.5 rounded-lg border text-xs font-mono flex items-center gap-2 ${
                      testResult.success
                        ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                        : 'bg-rose-950/60 border-rose-800 text-rose-300'
                    }`}
                  >
                    {testResult.success ? (
                      <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    )}
                    <span>{testResult.message}</span>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#232a3c]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
              >
                <span>Save Configuration</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: SQL Kurulum Kodu */}
        {activeTab === 'sql' && (
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm font-mono">
                Executes schema creation for <code className="text-amber-300 bg-[#0c0f14] px-1 py-0.5 rounded border border-[#232a3c]">containers</code>,{' '}
                <code className="text-amber-300 bg-[#0c0f14] px-1 py-0.5 rounded border border-[#232a3c]">items</code>, and{' '}
                <code className="text-amber-300 bg-[#0c0f14] px-1 py-0.5 rounded border border-[#232a3c]">workshop-images</code> storage bucket:
              </p>
              <button
                type="button"
                onClick={handleCopySql}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 shadow-sm"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-black" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy SQL</span>
                  </>
                )}
              </button>
            </div>

            {/* SQL Snippet box */}
            <div className="relative rounded-lg bg-[#07090d] border border-[#232a3c] p-3 max-h-72 overflow-y-auto">
              <pre className="text-[11px] font-mono text-slate-300 whitespace-pre leading-relaxed">
                {SUPABASE_SETUP_SQL}
              </pre>
            </div>

            <ol className="text-xs text-slate-400 space-y-1 list-decimal list-inside bg-[#0c0f14] p-3 rounded-lg border border-[#232a3c] font-mono">
              <li>Click <strong>Copy SQL</strong> above.</li>
              <li>Open your Supabase dashboard and navigate to <strong>SQL Editor</strong>.</li>
              <li>Paste the code and click <strong>Run</strong>.</li>
            </ol>
          </div>
        )}

        {/* Tab 3: Backup & Data */}
        {activeTab === 'data' && (
          <div className="p-5 space-y-4">
            <div className="p-4 rounded-lg bg-[#0c0f14] border border-[#232a3c] space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white font-mono">Inventory Snapshot Export / Import</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                Export your workshop storage hierarchy and parts inventory to a portable JSON backup file.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1a2234] hover:bg-[#232d45] text-slate-200 text-xs font-mono font-medium transition-colors border border-[#2e3b57]"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Download JSON Backup</span>
                </button>

                <label className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1a2234] hover:bg-[#232d45] text-slate-200 text-xs font-mono font-medium cursor-pointer transition-colors border border-[#2e3b57]">
                  <Upload className="w-3.5 h-3.5 text-sky-400" />
                  <span>Restore JSON Backup</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportBackup}
                    className="hidden"
                  />
                </label>
              </div>
              {importError && (
                <div className="text-xs font-mono text-rose-400 mt-2">{importError}</div>
              )}
            </div>

            <div className="p-4 rounded-lg bg-[#0c0f14] border border-[#232a3c] space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white font-mono">Reset to Sample Maker Inventory</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                Populates storage tree with ESP32-WROOM, TS100 soldering iron, digital calipers, and M3 hardware bins.
              </p>
              <button
                type="button"
                onClick={handleResetDemo}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#2a1d13] hover:bg-[#3d291a] text-amber-400 text-xs font-mono font-semibold transition-colors border border-amber-800/60"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Load Sample Data</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
