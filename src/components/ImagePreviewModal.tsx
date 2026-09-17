import React from 'react'
import { X, Eye } from 'lucide-react'
import { useI18n } from '../services/i18n'

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
  const { t } = useI18n()

  if (!isOpen || !imageUrl) return null

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md cursor-zoom-out"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-4xl max-h-[90vh] bg-[#11151f] dark:bg-[#11151f] bg-white border border-[#232a3c] dark:border-[#232a3c] border-slate-300 rounded-xl overflow-hidden shadow-2xl flex flex-col cursor-default"
      >
        <div className="flex items-center justify-between px-4 py-3 bg-[#0c0f14] dark:bg-[#0c0f14] bg-slate-50 border-b border-[#232a3c] dark:border-[#232a3c] border-slate-200">
          <div className="flex items-center gap-2 min-w-0 pr-4">
            <Eye className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-400 text-slate-500 font-semibold shrink-0">
              {t('inspectionView')}
            </span>
            <h4 className="font-mono font-semibold text-xs text-slate-100 dark:text-slate-100 text-slate-900 truncate">{title}</h4>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-slate-400 hover:text-white dark:hover:text-white text-slate-500 hover:text-slate-900 hover:bg-[#1a2234] dark:hover:bg-[#1a2234] hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-3 bg-[#07090d] dark:bg-[#07090d] bg-slate-100 flex items-center justify-center overflow-auto">
          <img
            src={imageUrl}
            alt={title}
            className="max-w-full max-h-[78vh] object-contain rounded border border-[#232a3c] dark:border-[#232a3c] border-slate-300"
          />
        </div>
      </div>
    </div>
  )
}
