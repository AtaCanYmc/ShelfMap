import { useEffect, useState, type FC } from 'react'
import QRCode from 'qrcode'
import type { Container } from '../types'
import { getContainerPath } from '../services/db'
import { X, Printer, QrCode, Layers, Copy, Check } from 'lucide-react'

interface QrPrintModalProps {
  isOpen: boolean
  onClose: () => void
  container: Container | null
  allContainers: Container[]
}

interface LabelData {
  container: Container
  pathString: string
  qrDataUrl: string
}

export const QrPrintModal: FC<QrPrintModalProps> = ({
  isOpen,
  onClose,
  container,
  allContainers
}) => {
  const [labels, setLabels] = useState<LabelData[]>([])
  const [batchMode, setBatchMode] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!isOpen || !container) {
      setLabels([])
      return
    }

    const generateLabels = async () => {
      const targets = batchMode
        ? [container, ...allContainers.filter((c) => c.parent_id === container.id)]
        : [container]

      const generated: LabelData[] = []
      for (const item of targets) {
        const path = getContainerPath(item.id, allContainers)
        const pathString = path.map((p) => p.name).join(' > ')
        const qrContent = item.qr_code || `shelfmap://c/${item.id}`
        const qrDataUrl = await QRCode.toDataURL(qrContent, {
          width: 320,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#ffffff'
          }
        })
        generated.push({ container: item, pathString, qrDataUrl })
      }
      setLabels(generated)
    }

    generateLabels()
  }, [isOpen, container, batchMode, allContainers])

  if (!isOpen || !container) return null

  const handlePrint = () => {
    window.print()
  }

  const handleCopyCode = () => {
    if (!container) return
    const code = container.qr_code || `shelfmap://c/${container.id}`
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6 no-print">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-950/80 border border-purple-800/60 text-purple-400">
              <QrCode className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-white text-base">QR Etiket Yazdır</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Batch toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span className="text-slate-200">
                Alt konteynerlerin etiketlerini de dahil et ({allContainers.filter((c) => c.parent_id === container.id).length} alt kutu)
              </span>
            </div>
            <input
              type="checkbox"
              checked={batchMode}
              onChange={(e) => setBatchMode(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-0 focus:ring-offset-0 bg-slate-900 border-slate-700 cursor-pointer"
            />
          </div>

          {/* Label Preview Container */}
          <div className="max-h-80 overflow-y-auto space-y-4 p-2">
            {labels.map((lbl) => (
              <div
                key={lbl.container.id}
                className="bg-white text-slate-950 p-4 rounded-xl shadow-lg border border-slate-200 flex flex-col sm:flex-row items-center gap-4"
              >
                {/* QR Canvas image */}
                <div className="w-28 h-28 shrink-0 bg-white p-1 rounded-lg border border-slate-100 flex items-center justify-center">
                  <img
                    src={lbl.qrDataUrl}
                    alt={lbl.container.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Label textual details */}
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 mb-0.5">
                    ShelfMap Depolama
                  </div>
                  <h4 className="font-bold text-base leading-tight text-slate-900 truncate">
                    {lbl.container.name}
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {lbl.pathString}
                  </p>
                  <div className="mt-2 text-[10px] font-mono text-slate-400 truncate">
                    {lbl.container.qr_code || `shelfmap://c/${lbl.container.id}`}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Copy Link */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <span className="font-mono text-slate-400 truncate text-[11px]">
              {container.qr_code || `shelfmap://c/${container.id}`}
            </span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium shrink-0 ml-2"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Kopyalandı' : 'Kopyala'}</span>
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Kapat
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors shadow-md shadow-purple-950"
            >
              <Printer className="w-4 h-4" />
              <span>Etiketi Yazdır ({labels.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hidden container for print only */}
      <div className="hidden print:block fixed inset-0 bg-white p-4 z-50 text-black">
        <div className="grid grid-cols-2 gap-4">
          {labels.map((lbl) => (
            <div
              key={lbl.container.id}
              className="border-2 border-dashed border-gray-400 p-3 rounded-lg flex items-center gap-3 page-break-inside-avoid"
            >
              <img
                src={lbl.qrDataUrl}
                alt={lbl.container.name}
                className="w-24 h-24 object-contain shrink-0"
              />
              <div className="min-w-0">
                <div className="text-[9px] font-bold uppercase text-gray-500">
                  ShelfMap Kutu Etiketi
                </div>
                <div className="font-bold text-sm leading-tight truncate">
                  {lbl.container.name}
                </div>
                <div className="text-[10px] text-gray-700 mt-1 line-clamp-2">
                  {lbl.pathString}
                </div>
                <div className="text-[9px] font-mono text-gray-400 mt-1 truncate">
                  {lbl.container.qr_code || `shelfmap://c/${lbl.container.id}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
