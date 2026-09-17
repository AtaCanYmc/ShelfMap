import { useEffect, useRef, useState, type FC, type FormEvent, type ChangeEvent } from 'react'
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode'
import type { Container } from '../types'
import { findContainerByQrCode, getContainerPath } from '../services/db'
import { useI18n } from '../services/i18n'
import {
  X,
  Camera,
  Layers,
  ArrowRight,
  Plus,
  AlertCircle,
  Keyboard,
  Upload
} from 'lucide-react'

interface QrScannerModalProps {
  isOpen: boolean
  onClose: () => void
  allContainers: Container[]
  onSelectContainer: (containerId: string) => void
  onQuickAddItem: (containerId: string) => void
}

function playScanBeep() {
  try {
    const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(880, audioCtx.currentTime)
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12)
    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.start()
    osc.stop(audioCtx.currentTime + 0.12)
  } catch {
    // Ignore audio error
  }
}

export const QrScannerModal: FC<QrScannerModalProps> = ({
  isOpen,
  onClose,
  allContainers,
  onSelectContainer,
  onQuickAddItem
}) => {
  const { t } = useI18n()
  const [matchedContainer, setMatchedContainer] = useState<Container | null>(null)
  const [scannedCode, setScannedCode] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [manualCode, setManualCode] = useState('')
  const [showManual, setShowManual] = useState(false)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const scannerContainerId = 'shelfmap-qr-reader'

  useEffect(() => {
    if (!isOpen) {
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .catch(() => {})
          .then(() => {
            scannerRef.current = null
          })
      }
      setMatchedContainer(null)
      setScannedCode(null)
      setErrorMsg(null)
      return
    }

    let isMounted = true

    const startScanner = async () => {
      try {
        const html5QrCode = new Html5Qrcode(scannerContainerId, {
          formatsToSupport: [
            Html5QrcodeSupportedFormats.QR_CODE,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.EAN_13
          ],
          verbose: false
        })
        scannerRef.current = html5QrCode

        await html5QrCode.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 240, height: 240 },
            aspectRatio: 1.0
          },
          (decodedText) => {
            if (!isMounted) return
            handleScanSuccess(decodedText)
          },
          () => {}
        )
      } catch (err: unknown) {
        if (isMounted) {
          console.warn('Camera failed:', err)
          setErrorMsg(t('cameraPermissionError'))
        }
      }
    }

    const timer = setTimeout(() => {
      startScanner()
    }, 200)

    return () => {
      isMounted = false
      clearTimeout(timer)
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .catch(() => {})
          .then(() => {
            scannerRef.current = null
          })
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleScanSuccess = (text: string) => {
    playScanBeep()
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50)
    }

    setScannedCode(text)
    const found = findContainerByQrCode(text, allContainers)
    if (found) {
      setMatchedContainer(found)
      setErrorMsg(null)
    } else {
      setMatchedContainer(null)
      setErrorMsg(`${t('noContainerForCode')}: "${text}"`)
    }
  }

  const handleManualSearch = (e: FormEvent) => {
    e.preventDefault()
    if (!manualCode.trim()) return
    handleScanSuccess(manualCode.trim())
  }

  const handleImageFileScan = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(scannerContainerId)
      }
      const result = await scannerRef.current.scanFile(file, true)
      handleScanSuccess(result)
    } catch {
      setErrorMsg(t('noQrInImage'))
    }
  }

  const containerPath = matchedContainer
    ? getContainerPath(matchedContainer.id, allContainers)
    : []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#11151f] dark:bg-[#11151f] bg-white border border-[#232a3c] dark:border-[#232a3c] border-slate-300 rounded-xl shadow-2xl overflow-hidden my-6 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#232a3c] dark:border-[#232a3c] border-slate-200 bg-[#0c0f14] dark:bg-[#0c0f14] bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-[#1a2234] dark:bg-[#1a2234] bg-amber-100 border border-[#2d3a56] dark:border-[#2d3a56] border-amber-300 text-amber-500">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-400 text-slate-500 font-semibold">
                {t('dockScan')}
              </div>
              <h3 className="font-semibold text-white dark:text-white text-slate-900 text-sm">{t('qrScannerTitle')}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-slate-400 hover:text-white dark:hover:text-white text-slate-500 hover:text-slate-900 hover:bg-[#1a2234] dark:hover:bg-[#1a2234] hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Camera View Area with HUD corner reticles */}
          <div className="relative rounded-lg overflow-hidden bg-[#07090d] border border-[#232a3c] dark:border-[#232a3c] border-slate-700 aspect-square flex items-center justify-center shadow-inner">
            <div id={scannerContainerId} className="w-full h-full" />

            {/* Target reticle overlay if active */}
            {!matchedContainer && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="w-52 h-52 border border-amber-500/40 relative">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-400 -mt-0.5 -ml-0.5" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-400 -mt-0.5 -mr-0.5" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-400 -mb-0.5 -ml-0.5" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-400 -mb-0.5 -mr-0.5" />
                  <div className="absolute top-2 left-2 font-mono text-[9px] uppercase tracking-widest text-amber-400/80">
                    {t('scanZone')}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Scanned Result Card */}
          {matchedContainer && (
            <div className="mt-4 p-4 rounded-lg bg-[#141b2b] dark:bg-[#141b2b] bg-amber-50/70 border border-amber-500 shadow-lg animate-in fade-in">
              <div className="flex items-center justify-between text-amber-500 text-[11px] font-mono font-semibold uppercase tracking-wider mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>{t('containerIdentified')}</span>
                </div>
                {scannedCode && (
                  <span className="font-mono text-[10px] text-slate-400 dark:text-slate-400 text-slate-600 truncate max-w-[140px]">
                    {scannedCode}
                  </span>
                )}
              </div>
              <h4 className="text-base font-bold text-white dark:text-white text-slate-900 mb-1">
                {matchedContainer.name}
              </h4>
              <p className="text-xs font-mono text-slate-400 dark:text-slate-400 text-slate-600 mb-3 truncate">
                {containerPath.map((p) => p.name).join(' / ')}
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onSelectContainer(matchedContainer.id)
                    onClose()
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-black rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm min-h-[40px]"
                >
                  <span>{t('openContainerBtn')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    onQuickAddItem(matchedContainer.id)
                    onClose()
                  }}
                  className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-[#1a2234] dark:bg-[#1a2234] bg-white hover:bg-[#232d45] dark:hover:bg-[#232d45] hover:bg-slate-100 text-slate-200 dark:text-slate-200 text-slate-800 border border-[#2e3b57] dark:border-[#2e3b57] border-slate-300 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors min-h-[40px]"
                  title={t('addItemBtn')}
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{t('addItemBtn')}</span>
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && !matchedContainer && (
            <div className="mt-3 p-3 rounded-lg bg-[#2a1315] dark:bg-[#2a1315] bg-rose-50 border border-[#7f1d1d] dark:border-[#7f1d1d] border-rose-300 text-[#fca5a5] dark:text-[#fca5a5] text-rose-800 text-xs font-mono flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>{errorMsg}</div>
            </div>
          )}

          {/* Fallback Tools (Manual entry & Image file scan) */}
          <div className="mt-4 pt-3 border-t border-[#232a3c] dark:border-[#232a3c] border-slate-200 flex items-center justify-between text-xs font-mono">
            <button
              type="button"
              onClick={() => setShowManual(!showManual)}
              className="flex items-center gap-1.5 text-slate-400 dark:text-slate-400 text-slate-600 hover:text-white dark:hover:text-white hover:text-slate-900 transition-colors py-1.5"
            >
              <Keyboard className="w-3.5 h-3.5 text-amber-500" />
              <span>{showManual ? t('returnToCamera') : t('manualInput')}</span>
            </button>

            <label className="flex items-center gap-1.5 text-slate-400 dark:text-slate-400 text-slate-600 hover:text-white dark:hover:text-white hover:text-slate-900 cursor-pointer transition-colors py-1.5">
              <Upload className="w-3.5 h-3.5 text-sky-400" />
              <span>{t('scanFile')}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileScan}
                className="hidden"
              />
            </label>
          </div>

          {showManual && (
            <form onSubmit={handleManualSearch} className="mt-3 flex gap-2">
              <input
                type="text"
                placeholder={t('manualPlaceholder')}
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                className="flex-1 px-3 py-2 bg-[#0c0f14] dark:bg-[#0c0f14] bg-slate-50 border border-[#232a3c] dark:border-[#232a3c] border-slate-300 focus:border-amber-500 rounded-lg text-xs font-mono text-slate-200 dark:text-slate-200 text-slate-900 placeholder-slate-500 outline-none"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-black rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors min-h-[38px]"
              >
                {t('lookup')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
