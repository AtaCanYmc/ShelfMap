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
      setTestResult({ success: false, message: 'Lütfen Project URL ve Anon Key alanlarını doldurun.' })
      return
    }

    setTesting(true)
    setTestResult(null)
    const res = await testSupabaseConnection(url, anonKey)
    setTesting(false)
    if (res.success) {
      setTestResult({ success: true, message: 'Supabase bağlantısı ve tablolar başarıyla doğrulandı!' })
    } else {
      setTestResult({ success: false, message: res.error || 'Bağlantı kurulamadı.' })
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
    link.download = `shelfmap-backup-${new Date().toISOString().slice(0, 10)}.json`
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
        alert('Yedek başarıyla geri yüklendi!')
      } catch (err: unknown) {
        setImportError(err instanceof Error ? err.message : 'Yedek dosyası okunamadı.')
      }
    }
    reader.readAsText(file)
  }

  const handleResetDemo = () => {
    if (confirm('Tüm mevcut yerel veriler varsayılan örnek Maker verileriyle değiştirilecek. Emin misiniz?')) {
      resetToDemoData()
      onDataReload()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-950/80 border border-indigo-800/60 text-indigo-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">Veritabanı & Ayarlar</h3>
              <p className="text-[11px] text-slate-400">Bring Your Own Supabase (BYOS) Yapılandırması</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/60">
          <button
            onClick={() => setActiveTab('byos')}
            className={`flex-1 py-2.5 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
              activeTab === 'byos'
                ? 'border-indigo-500 text-indigo-400 bg-slate-900/80'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Supabase Bağlantısı</span>
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`flex-1 py-2.5 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
              activeTab === 'sql'
                ? 'border-indigo-500 text-indigo-400 bg-slate-900/80'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>SQL Kurulum Kodu</span>
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`flex-1 py-2.5 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
              activeTab === 'data'
                ? 'border-indigo-500 text-indigo-400 bg-slate-900/80'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>Yedekleme & Demo</span>
          </button>
        </div>

        {/* Tab 1: BYOS Settings */}
        {activeTab === 'byos' && (
          <div className="p-5 space-y-4">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <strong className="text-white font-medium">Veri Mahremiyeti:</strong> ShelfMap,
              sunucu masrafı olmadan ve tamamen sizin kontrolünüzde çalışır. Kendi ücretsiz
              Supabase projenizin API bilgilerini buraya girerek tüm verilerinizi kendi bulutunuzda
              saklayabilirsiniz.
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <div className="text-xs font-semibold text-slate-200">Yerel Demo Modu</div>
                <div className="text-[11px] text-slate-400">
                  Supabase olmadan tarayıcı önbelleğinde (LocalStorage) çalıştır
                </div>
              </div>
              <input
                type="checkbox"
                checked={useDemoMode}
                onChange={(e) => setUseDemoMode(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-0 bg-slate-900 border-slate-700 cursor-pointer"
              />
            </div>

            {/* URL Input */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Supabase Project URL
              </label>
              <input
                type="url"
                disabled={useDemoMode}
                placeholder="https://xyzcompany.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 disabled:opacity-50 rounded-xl text-xs text-slate-100 font-mono outline-none"
              />
            </div>

            {/* Anon Key Input */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Supabase Anon / Public API Key
              </label>
              <input
                type="password"
                disabled={useDemoMode}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 disabled:opacity-50 rounded-xl text-xs text-slate-100 font-mono outline-none"
              />
            </div>

            {/* Test Connection Button */}
            {!useDemoMode && (
              <div>
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testing}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors border border-slate-700"
                >
                  {testing ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5" />
                  )}
                  <span>Bağlantıyı Test Et</span>
                </button>

                {testResult && (
                  <div
                    className={`mt-2 p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
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
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors shadow-md shadow-indigo-950"
              >
                <span>Ayarları Kaydet</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: SQL Kurulum Kodu */}
        {activeTab === 'sql' && (
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
                Supabase projenizde <code className="text-indigo-300 bg-slate-950 px-1 py-0.5 rounded">containers</code>,{' '}
                <code className="text-indigo-300 bg-slate-950 px-1 py-0.5 rounded">items</code> tablolarını ve{' '}
                <code className="text-indigo-300 bg-slate-950 px-1 py-0.5 rounded">workshop-images</code> storage bucket'ını tek tıkla kurun:
              </p>
              <button
                type="button"
                onClick={handleCopySql}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors shrink-0 shadow-sm"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Kopyalandı!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>SQL'i Kopyala</span>
                  </>
                )}
              </button>
            </div>

            {/* SQL Snippet box */}
            <div className="relative rounded-xl bg-slate-950 border border-slate-800 p-3 max-h-72 overflow-y-auto">
              <pre className="text-[11px] font-mono text-slate-300 whitespace-pre leading-relaxed">
                {SUPABASE_SETUP_SQL}
              </pre>
            </div>

            <ol className="text-xs text-slate-400 space-y-1 list-decimal list-inside bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              <li>Yukarıdaki <strong>SQL'i Kopyala</strong> butonuna basın.</li>
              <li>Supabase panelinizde soldaki <strong>SQL Editor</strong> sekmesine gidin.</li>
              <li>Kodu yapıştırıp sağ alttaki yeşil <strong>Run</strong> butonuna tıklayın.</li>
            </ol>
          </div>
        )}

        {/* Tab 3: Yedekleme & Demo */}
        {activeTab === 'data' && (
          <div className="p-5 space-y-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-xs font-semibold text-white">Yedekleme & Geri Yükleme</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Tüm atölye konteyner ve eşya haritanızı JSON dosyası olarak bilgisayarınıza veya telefonunuza yedekleyin.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors border border-slate-700"
                >
                  <Download className="w-3.5 h-3.5 text-sky-400" />
                  <span>JSON Yedeği İndir</span>
                </button>

                <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer transition-colors border border-slate-700">
                  <Upload className="w-3.5 h-3.5 text-emerald-400" />
                  <span>JSON Yedeği Geri Yükle</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportBackup}
                    className="hidden"
                  />
                </label>
              </div>
              {importError && (
                <div className="text-xs text-rose-400 mt-2">{importError}</div>
              )}
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="text-xs font-semibold text-white">Örnek Maker Verilerini Geri Yükle</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                ESP32, TS100 Havya, Dijital Kumpas ve M3 vidaların bulunduğu varsayılan atölye şablonunu tekrar yükler.
              </p>
              <button
                type="button"
                onClick={handleResetDemo}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-950/50 hover:bg-amber-900/50 text-amber-300 text-xs font-medium transition-colors border border-amber-800/60"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Örnek Atölye Verilerini Yükle</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
