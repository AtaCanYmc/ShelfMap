import React from 'react'
import { X } from 'lucide-react'

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
        className="relative max-w-4xl max-h-[90vh] bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
      >
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800">
          <h4 className="font-semibold text-sm text-slate-100 truncate pr-4">{title}</h4>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-2 flex items-center justify-center overflow-auto">
          <img
            src={imageUrl}
            alt={title}
            className="max-w-full max-h-[80vh] object-contain rounded-lg"
          />
        </div>
      </div>
    </div>
  )
}
