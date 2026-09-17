import React from 'react'
import { X, Eye } from 'lucide-react'

interface ImagePreviewModalProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  title: string
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title
}) => {
  if (!isOpen || !imageUrl) return null

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-zoom-out"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-4xl max-h-[90vh] bg-[#11151f] border border-[#232a3c] rounded-xl overflow-hidden shadow-2xl flex flex-col"
      >
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#0c0f14] border-b border-[#232a3c]">
          <div className="flex items-center gap-2 min-w-0 pr-4">
            <Eye className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400 font-semibold shrink-0">
              Inspection:
            </span>
            <h4 className="font-mono font-semibold text-xs text-slate-100 truncate">{title}</h4>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#1a2234] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-3 bg-[#07090d] flex items-center justify-center overflow-auto">
          <img
            src={imageUrl}
            alt={title}
            className="max-w-full max-h-[78vh] object-contain rounded border border-[#232a3c]"
          />
        </div>
      </div>
    </div>
  )
}
