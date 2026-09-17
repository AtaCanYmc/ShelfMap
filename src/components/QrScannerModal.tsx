import { useEffect, useRef, useState, type FC, type FormEvent, type ChangeEvent } from 'react'
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode'
import type { Container } from '../types'
import { findContainerByQrCode, getContainerPath } from '../services/db'
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

// Subtle audio beep on successful scan using Web Audio API
function playScanBeep() {
  try {
    const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(880, audioCtx.currentTime) // A5 note
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
  const [matchedContainer, setMatchedContainer] = useState<Container | null>(null)
  const [scannedCode, setScannedCode] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [manualCode, setManualCode] = useState('')
  const [showManual, setShowManual] = useState(false)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const scannerContainerId = 'shelfmap-qr-reader'

  useEffect(() => {
    if (!isOpen) {
      // Stop scanner if active
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
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0
          },
          (decodedText) => {
            if (!isMounted) return
            handleScanSuccess(decodedText)
          },
          () => {
            // Ignore frame scan failures
          }
        )
      } catch (err: unknown) {
        if (isMounted) {
          console.warn('Kamera açılamadı:', err)
          setErrorMsg(
            'Kamera başlatılamadı. Lütfen kamera izni verdiğinizden emin olun veya manuel giriş yapın.'
          )
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
      setErrorMsg(`"${text}" koduna ait bir konteyner bulunamadı.`)
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
      setErrorMsg('Görselde QR kod tespit edilemedi.')
    }
  }

  const containerPath = matchedContainer
    ? getContainerPath(matchedContainer.id, allContainers)
    : []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-sky-950/80 border border-sky-800/60 text-sky-400">
              <Camera className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-white text-base">Kutu QR Kodu Tara</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Camera View Area */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 aspect-square flex items-center justify-center shadow-inner">
            <div id={scannerContainerId} className="w-full h-full" />

            {/* Target reticle overlay if active */}
            {!matchedContainer && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-indigo-500/70 rounded-2xl relative animate-pulse">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-indigo-400 -mt-1 -ml-1 rounded-tl" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-indigo-400 -mt-1 -mr-1 rounded-tr" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-indigo-400 -mb-1 -ml-1 rounded-bl" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-indigo-400 -mb-1 -mr-1 rounded-br" />
                </div>
              </div>
            )}
          </div>

          {/* Scanned Result Banner */}
          {matchedContainer && (
            <div className="mt-4 p-4 rounded-xl bg-indigo-950/70 border border-indigo-500/60 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-1">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <span>Kutu Tespit Edildi!</span>
                </div>
                {scannedCode && (
                  <span className="font-mono text-[10px] text-indigo-300/80 truncate max-w-[120px]">
                    {scannedCode}
                  </span>
                )}
              </div>
              <h4 className="text-base font-bold text-white mb-1">
                {matchedContainer.name}
              </h4>
              <p className="text-xs text-slate-400 mb-3">
                {containerPath.map((p) => p.name).join(' > ')}
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onSelectContainer(matchedContainer.id)
                    onClose()
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  <span>Kutuyu Aç</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    onQuickAddItem(matchedContainer.id)
                    onClose()
                  }}
                  className="flex items-center justify-center gap-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors"
                  title="Bu kutuya hemen yeni eşya ekle"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Eşya Ekle</span>
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && !matchedContainer && (
            <div className="mt-3 p-3 rounded-xl bg-amber-950/50 border border-amber-800/60 text-amber-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>{errorMsg}</div>
            </div>
          )}

          {/* Fallback Tools (Manual entry & Image file scan) */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => setShowManual(!showManual)}
              className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
            >
              <Keyboard className="w-3.5 h-3.5 text-indigo-400" />
              <span>{showManual ? 'Kameraya Dön' : 'Manuel Kod Gir'}</span>
            </button>

            <label className="flex items-center gap-1.5 text-slate-400 hover:text-white cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span>Fotoğraftan Tara</span>
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
                placeholder="Örn: shelfmap://c/drawer-2 veya kutu ID"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 outline-none"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium transition-colors"
              >
                Ara
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
