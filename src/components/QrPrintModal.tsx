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
        const pathString = path.map((p) => p.name).join(' / ')
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
      <div className="relative w-full max-w-lg bg-[#11151f] border border-[#232a3c] rounded-xl shadow-2xl overflow-hidden my-6 no-print">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#232a3c] bg-[#0c0f14]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-[#1a2234] border border-[#2d3a56] text-amber-400">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                Label Generation
              </div>
              <h3 className="font-semibold text-white text-sm">Print Adhesive Labels</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-[#1a2234] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Batch toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-[#0c0f14] border border-[#232a3c] text-xs font-mono">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span className="text-slate-300">
                Include child containers ({allContainers.filter((c) => c.parent_id === container.id).length} nested bins)
              </span>
            </div>
            <input
              type="checkbox"
              checked={batchMode}
              onChange={(e) => setBatchMode(e.target.checked)}
              className="w-4 h-4 rounded text-amber-500 focus:ring-0 bg-[#11151f] border-[#232a3c] cursor-pointer"
            />
          </div>

          {/* Label Preview Container */}
          <div className="max-h-80 overflow-y-auto space-y-3 p-1">
            {labels.map((lbl) => (
              <div
                key={lbl.container.id}
                className="bg-[#ffffff] text-black p-3.5 rounded border border-[#e2e8f0] shadow-sm flex flex-col sm:flex-row items-center gap-4 relative overflow-hidden"
              >
                {/* Physical crop marks in corners */}
                <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-neutral-400 pointer-events-none" />
                <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-neutral-400 pointer-events-none" />
                <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-neutral-400 pointer-events-none" />
                <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-neutral-400 pointer-events-none" />

                {/* QR Canvas image */}
                <div className="w-24 h-24 shrink-0 bg-white p-1 border border-neutral-200 flex items-center justify-center">
                  <img
                    src={lbl.qrDataUrl}
                    alt={lbl.container.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Label textual details */}
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <div className="text-[9px] uppercase font-mono font-bold tracking-widest text-neutral-500 mb-0.5">
                    SHELFMAP // PARTS BIN
                  </div>
                  <h4 className="font-bold text-base leading-tight text-neutral-900 truncate">
                    {lbl.container.name}
                  </h4>
                  <p className="text-[10px] font-mono text-neutral-600 mt-1 line-clamp-2 leading-relaxed">
                    {lbl.pathString}
                  </p>
                  <div className="mt-1.5 text-[9px] font-mono text-neutral-400 truncate">
                    {lbl.container.qr_code || `shelfmap://c/${lbl.container.id}`}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Copy URI */}
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#0c0f14] border border-[#232a3c] text-xs font-mono">
            <span className="text-slate-400 truncate text-[11px]">
              {container.qr_code || `shelfmap://c/${container.id}`}
            </span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold shrink-0 ml-2"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#232a3c]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4 text-black" />
              <span>Print Labels ({labels.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Physical adhesive print sheet output */}
      <div className="hidden print:block fixed inset-0 bg-white p-4 z-50 text-black">
        <div className="grid grid-cols-2 gap-3">
          {labels.map((lbl) => (
            <div
              key={lbl.container.id}
              className="border border-neutral-400 p-3 rounded flex items-center gap-3 page-break-inside-avoid"
            >
              <img
                src={lbl.qrDataUrl}
                alt={lbl.container.name}
                className="w-20 h-20 object-contain shrink-0"
              />
              <div className="min-w-0">
                <div className="text-[8px] font-mono font-bold uppercase tracking-wider text-neutral-500">
                  SHELFMAP STORAGE
                </div>
                <div className="font-bold text-sm leading-tight truncate">
                  {lbl.container.name}
                </div>
                <div className="text-[9px] font-mono text-neutral-700 mt-0.5 line-clamp-2">
                  {lbl.pathString}
                </div>
                <div className="text-[8px] font-mono text-neutral-400 mt-1 truncate">
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
