import { useState, useEffect, type FC, type ChangeEvent } from 'react'
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
  useI18n,
  SUPPORTED_LANGUAGES,
  type Language
} from '../services/i18n'
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
  HardDrive,
  Sun,
  Moon,
  Globe,
  Sliders
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

type TabType = 'preferences' | 'byos' | 'sql' | 'data'

export const SettingsModal: FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onConfigUpdated,
  containers,
  items,
  onDataReload
}) => {
  const { lang, setLanguage, t } = useI18n()
  const [activeTab, setActiveTab] = useState<TabType>('preferences')
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('shelfmap_theme') as 'dark' | 'light') || 'dark'
  })

  const [url, setUrl] = useState(config.url)
  const [anonKey, setAnonKey] = useState(config.anonKey)
  const [useDemoMode, setUseDemoMode] = useState(config.useDemoMode)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [copiedSql, setCopiedSql] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('shelfmap_theme', theme)
  }, [theme])

  if (!isOpen) return null

  const handleTestConnection = async () => {
    if (!url.trim() || !anonKey.trim()) {
      setTestResult({ success: false, message: t('fillCredentials') })
      return
    }

    setTesting(true)
    setTestResult(null)
    const res = await testSupabaseConnection(url, anonKey)
    setTesting(false)
    if (res.success) {
      setTestResult({ success: true, message: t('connectionSuccess') })
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
        alert(t('backupSuccess'))
      } catch (err: unknown) {
        setImportError(err instanceof Error ? err.message : t('backupInvalid'))
      }
    }
    reader.readAsText(file)
  }

  const handleResetDemo = () => {
    if (confirm(t('confirmSampleData'))) {
      resetToDemoData()
      onDataReload()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#11151f] dark:bg-[#11151f] bg-white border border-[#232a3c] dark:border-[#232a3c] border-slate-300 rounded-xl shadow-2xl overflow-hidden my-6 transition-colors">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#232a3c] dark:border-[#232a3c] border-slate-200 bg-[#0c0f14] dark:bg-[#0c0f14] bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-[#1a2234] dark:bg-[#1a2234] bg-amber-100 border border-[#2d3a56] dark:border-[#2d3a56] border-amber-300 text-amber-500">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-400 text-slate-500 font-semibold">
                {t('settingsTitle')}
              </div>
              <h3 className="font-semibold text-white dark:text-white text-slate-900 text-sm">
                {t('settingsSubtitle')}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-slate-400 hover:text-white dark:hover:text-white text-slate-500 hover:text-slate-900 hover:bg-[#1a2234] dark:hover:bg-[#1a2234] hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#232a3c] dark:border-[#232a3c] border-slate-200 bg-[#0c0f14] dark:bg-[#0c0f14] bg-slate-50 overflow-x-auto">
          <button
            onClick={() => setActiveTab('preferences')}
            className={`flex-1 min-w-[90px] py-2.5 px-3 text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
              activeTab === 'preferences'
                ? 'border-amber-500 text-amber-500 bg-[#141b2b] dark:bg-[#141b2b] bg-white'
                : 'border-transparent text-slate-400 hover:text-slate-200 dark:hover:text-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{t('tabPreferences')}</span>
          </button>
          <button
            onClick={() => setActiveTab('byos')}
            className={`flex-1 min-w-[90px] py-2.5 px-3 text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
              activeTab === 'byos'
                ? 'border-amber-500 text-amber-500 bg-[#141b2b] dark:bg-[#141b2b] bg-white'
                : 'border-transparent text-slate-400 hover:text-slate-200 dark:hover:text-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t('tabByos')}</span>
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`flex-1 min-w-[90px] py-2.5 px-3 text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
              activeTab === 'sql'
                ? 'border-amber-500 text-amber-500 bg-[#141b2b] dark:bg-[#141b2b] bg-white'
                : 'border-transparent text-slate-400 hover:text-slate-200 dark:hover:text-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>{t('tabSql')}</span>
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`flex-1 min-w-[90px] py-2.5 px-3 text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
              activeTab === 'data'
                ? 'border-amber-500 text-amber-500 bg-[#141b2b] dark:bg-[#141b2b] bg-white'
                : 'border-transparent text-slate-400 hover:text-slate-200 dark:hover:text-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>{t('tabData')}</span>
          </button>
        </div>

        {/* Tab 0: Preferences (Theme & Language) */}
        {activeTab === 'preferences' && (
          <div className="p-5 space-y-6">
            {/* Theme Selector */}
            <div className="space-y-2.5">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 dark:text-slate-300 text-slate-700">
                {t('appearanceTitle')}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Dark Option */}
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`flex items-start gap-3 p-3.5 rounded-lg text-left transition-all border ${
                    theme === 'dark'
                      ? 'border-amber-500 bg-[#151c2b] dark:bg-[#151c2b] bg-slate-900 text-white shadow-sm'
                      : 'border-[#232a3c] dark:border-[#232a3c] border-slate-200 bg-[#0c0f14] dark:bg-[#0c0f14] bg-slate-50 text-slate-400 hover:border-slate-400'
                  }`}
                >
                  <div className={`p-2 rounded-md ${theme === 'dark' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>
                    <Moon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-white flex items-center justify-between">
                      <span>{t('themeDark')}</span>
                      {theme === 'dark' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      {t('themeDarkDesc')}
                    </p>
                  </div>
                </button>

                {/* Light Option */}
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`flex items-start gap-3 p-3.5 rounded-lg text-left transition-all border ${
                    theme === 'light'
                      ? 'border-amber-500 bg-amber-50/50 text-slate-900 shadow-sm'
                      : 'border-[#232a3c] dark:border-[#232a3c] border-slate-200 bg-[#0c0f14] dark:bg-[#0c0f14] bg-slate-50 text-slate-400 hover:border-slate-400'
                  }`}
                >
                  <div className={`p-2 rounded-md ${theme === 'light' ? 'bg-amber-500/20 text-amber-600' : 'bg-slate-800 dark:bg-slate-800 bg-slate-200 text-slate-600'}`}>
                    <Sun className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-semibold dark:text-white text-slate-900 flex items-center justify-between">
                      <span>{t('themeLight')}</span>
                      {theme === 'light' && <Check className="w-3.5 h-3.5 text-amber-600" />}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                      {t('themeLightDesc')}
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Language Selector */}
            <div className="space-y-2.5">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 dark:text-slate-300 text-slate-700 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-sky-400" />
                <span>{t('languageTitle')}</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SUPPORTED_LANGUAGES.map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => setLanguage(item.code as Language)}
                    className={`btn-tactile flex items-center gap-2.5 p-2.5 rounded-lg border text-xs font-mono text-left transition-colors ${
                      lang === item.code
                        ? 'border-amber-500 bg-amber-500/10 text-amber-500 font-semibold'
                        : 'border-[#232a3c] dark:border-[#232a3c] border-slate-200 hover:border-slate-400 text-slate-300 dark:text-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="text-base leading-none">{item.flag}</span>
                    <div className="truncate">
                      <div className="leading-tight">{item.nativeName}</div>
                      <div className="text-[10px] text-slate-500 uppercase">{item.label}</div>
                    </div>
                    {lang === item.code && (
                      <Check className="w-3.5 h-3.5 ml-auto text-amber-500 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#232a3c] dark:border-[#232a3c] border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white dark:hover:text-white text-slate-600 hover:text-slate-900 transition-colors"
              >
                {t('close')}
              </button>
            </div>
          </div>
        )}

        {/* Tab 1: BYOS Settings */}
        {activeTab === 'byos' && (
          <div className="p-5 space-y-4">
            <div className="p-3 rounded-lg bg-[#0c0f14] dark:bg-[#0c0f14] bg-slate-50 border border-[#232a3c] dark:border-[#232a3c] border-slate-200 text-xs text-slate-300 dark:text-slate-300 text-slate-700 leading-relaxed font-mono">
              <strong className="text-amber-500">Zero Telemetry:</strong> {t('byosZeroTelemetry')}
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#0c0f14] dark:bg-[#0c0f14] bg-slate-50 border border-[#232a3c] dark:border-[#232a3c] border-slate-200">
              <div>
                <div className="text-xs font-semibold text-white dark:text-white text-slate-900">{t('localOfflineMode')}</div>
                <div className="text-[11px] text-slate-400 dark:text-slate-400 text-slate-500 font-mono">
                  {t('localOfflineDesc')}
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
              <label className="block text-xs font-semibold text-slate-300 dark:text-slate-300 text-slate-700 uppercase tracking-wider mb-1 font-mono">
                {t('supabaseUrl')}
              </label>
              <input
                type="url"
                disabled={useDemoMode}
                placeholder="https://xyzcompany.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 bg-[#0c0f14] dark:bg-[#0c0f14] bg-slate-50 border border-[#232a3c] dark:border-[#232a3c] border-slate-300 focus:border-amber-500 disabled:opacity-40 rounded-lg text-xs text-slate-100 dark:text-slate-100 text-slate-900 font-mono outline-none"
              />
            </div>

            {/* Anon Key Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 dark:text-slate-300 text-slate-700 uppercase tracking-wider mb-1 font-mono">
                {t('supabaseKey')}
              </label>
              <input
                type="password"
                disabled={useDemoMode}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                className="w-full px-3 py-2 bg-[#0c0f14] dark:bg-[#0c0f14] bg-slate-50 border border-[#232a3c] dark:border-[#232a3c] border-slate-300 focus:border-amber-500 disabled:opacity-40 rounded-lg text-xs text-slate-100 dark:text-slate-100 text-slate-900 font-mono outline-none"
              />
            </div>

            {/* Test Connection Button */}
            {!useDemoMode && (
              <div>
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testing}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1a2234] dark:bg-[#1a2234] bg-slate-100 hover:bg-[#232d45] dark:hover:bg-[#232d45] hover:bg-slate-200 text-slate-200 dark:text-slate-200 text-slate-800 text-xs font-mono font-medium transition-colors border border-[#2e3b57] dark:border-[#2e3b57] border-slate-300"
                >
                  {testing ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-500" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5" />
                  )}
                  <span>{t('testConnection')}</span>
                </button>

                {testResult && (
                  <div
                    className={`mt-2 p-2.5 rounded-lg border text-xs font-mono flex items-center gap-2 ${
                      testResult.success
                        ? 'bg-emerald-950/60 dark:bg-emerald-950/60 bg-emerald-50 border-emerald-800 dark:border-emerald-800 border-emerald-300 text-emerald-400 dark:text-emerald-300 text-emerald-800'
                        : 'bg-rose-950/60 dark:bg-rose-950/60 bg-rose-50 border-rose-800 dark:border-rose-800 border-rose-300 text-rose-400 dark:text-rose-300 text-rose-800'
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
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#232a3c] dark:border-[#232a3c] border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white dark:hover:text-white text-slate-600 hover:text-slate-900 transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
              >
                <span>{t('saveConfigBtn')}</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: SQL Kurulum Kodu */}
        {activeTab === 'sql' && (
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-300 dark:text-slate-300 text-slate-700 leading-relaxed max-w-sm font-mono">
                {t('sqlNotice')}
              </p>
              <button
                type="button"
                onClick={handleCopySql}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 shadow-sm"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-black" />
                    <span>{t('copied')}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{t('copySqlBtn')}</span>
                  </>
                )}
              </button>
            </div>

            {/* SQL Snippet box */}
            <div className="relative rounded-lg bg-[#07090d] dark:bg-[#07090d] bg-slate-900 border border-[#232a3c] dark:border-[#232a3c] border-slate-700 p-3 max-h-72 overflow-y-auto">
              <pre className="text-[11px] font-mono text-slate-300 whitespace-pre leading-relaxed">
                {SUPABASE_SETUP_SQL}
              </pre>
            </div>

            <ol className="text-xs text-slate-400 dark:text-slate-400 text-slate-600 space-y-1 list-decimal list-inside bg-[#0c0f14] dark:bg-[#0c0f14] bg-slate-50 p-3 rounded-lg border border-[#232a3c] dark:border-[#232a3c] border-slate-200 font-mono">
              <li>{t('sqlStep1')}</li>
              <li>{t('sqlStep2')}</li>
              <li>{t('sqlStep3')}</li>
            </ol>
          </div>
        )}

        {/* Tab 3: Backup & Data */}
        {activeTab === 'data' && (
          <div className="p-5 space-y-4">
            <div className="p-4 rounded-lg bg-[#0c0f14] dark:bg-[#0c0f14] bg-slate-50 border border-[#232a3c] dark:border-[#232a3c] border-slate-200 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white dark:text-white text-slate-900 font-mono">
                {t('backupSectionTitle')}
              </h4>
              <p className="text-[11px] text-slate-400 dark:text-slate-400 text-slate-600 leading-relaxed font-mono">
                {t('backupSectionDesc')}
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1a2234] dark:bg-[#1a2234] bg-slate-100 hover:bg-[#232d45] dark:hover:bg-[#232d45] hover:bg-slate-200 text-slate-200 dark:text-slate-200 text-slate-800 text-xs font-mono font-medium transition-colors border border-[#2e3b57] dark:border-[#2e3b57] border-slate-300"
                >
                  <Download className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t('downloadBackup')}</span>
                </button>

                <label className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1a2234] dark:bg-[#1a2234] bg-slate-100 hover:bg-[#232d45] dark:hover:bg-[#232d45] hover:bg-slate-200 text-slate-200 dark:text-slate-200 text-slate-800 text-xs font-mono font-medium cursor-pointer transition-colors border border-[#2e3b57] dark:border-[#2e3b57] border-slate-300">
                  <Upload className="w-3.5 h-3.5 text-sky-400" />
                  <span>{t('restoreBackup')}</span>
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

            <div className="p-4 rounded-lg bg-[#0c0f14] dark:bg-[#0c0f14] bg-slate-50 border border-[#232a3c] dark:border-[#232a3c] border-slate-200 space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white dark:text-white text-slate-900 font-mono">
                {t('sampleDataTitle')}
              </h4>
              <p className="text-[11px] text-slate-400 dark:text-slate-400 text-slate-600 leading-relaxed font-mono">
                {t('sampleDataDesc')}
              </p>
              <button
                type="button"
                onClick={handleResetDemo}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#2a1d13] hover:bg-[#3d291a] text-amber-400 text-xs font-mono font-semibold transition-colors border border-amber-800/60"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{t('loadSampleDataBtn')}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
