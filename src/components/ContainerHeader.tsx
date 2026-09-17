import type { FC } from 'react'
import type { Container, Item } from '../types'
import {
  Layers,
  Box,
  QrCode,
  Edit2,
  Plus,
  Trash2,
  FolderPlus,
  AlertTriangle
} from 'lucide-react'

interface ContainerHeaderProps {
  currentContainer: Container | null
  subContainers: Container[]
  items: Item[]
  totalAllItems: Item[]
  totalAllContainers: Container[]
  onAddSubContainer: () => void
  onAddItem: () => void
  onEditContainer: (c: Container) => void
  onDeleteContainer: (c: Container) => void
  onPrintQr: (c: Container) => void
  onPreviewImage: (url: string, title: string) => void
}

export const ContainerHeader: FC<ContainerHeaderProps> = ({
  currentContainer,
  subContainers,
  items,
  totalAllItems,
  totalAllContainers,
  onAddSubContainer,
  onAddItem,
  onEditContainer,
  onDeleteContainer,
  onPrintQr,
  onPreviewImage
}) => {
  if (!currentContainer) {
    // Root level view
    const lowStockCount = totalAllItems.filter((i) => i.quantity <= 1).length

    return (
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl p-5 sm:p-6 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                <Layers className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Tüm Lokasyonlar & Odalar
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Atölyenizdeki odaları, dolapları, çekmeceleri ve alet kutularını iç içe düzenleyin ve eşyalarınıza saniyeler içinde ulaşın.
            </p>
          </div>

          {/* Quick Root Stats */}
          <div className="flex items-center gap-3 self-start sm:self-center shrink-0">
            <div className="px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
              <div className="text-base sm:text-lg font-bold text-slate-100">
                {totalAllContainers.length}
              </div>
              <div className="text-[11px] text-slate-400">Konteyner</div>
            </div>
            <div className="px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
              <div className="text-base sm:text-lg font-bold text-slate-100">
                {totalAllItems.length}
              </div>
              <div className="text-[11px] text-slate-400">Toplam Eşya</div>
            </div>
            {lowStockCount > 0 && (
              <div className="px-3 py-2 rounded-xl bg-amber-950/40 border border-amber-800/40 text-center">
                <div className="text-base sm:text-lg font-bold text-amber-400 flex items-center justify-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{lowStockCount}</span>
                </div>
                <div className="text-[11px] text-amber-300">Kritik Stok</div>
              </div>
            )}
          </div>
        </div>

        {/* Quick action bar */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <button
            onClick={onAddSubContainer}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-sm"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Yeni Ana Konum / Oda Ekle</span>
          </button>
          <button
            onClick={onAddItem}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors border border-slate-700"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Genel Eşya Ekle</span>
          </button>
        </div>
      </div>
    )
  }

  // Inside a container
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden mb-6 shadow-sm">
      <div className="flex flex-col md:flex-row">
        {/* Photo Banner */}
        {currentContainer.image_url ? (
          <div
            onClick={() => onPreviewImage(currentContainer.image_url!, currentContainer.name)}
            className="md:w-64 h-48 md:h-auto bg-slate-950 relative overflow-hidden shrink-0 cursor-pointer group"
          >
            <img
              src={currentContainer.image_url}
              alt={currentContainer.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent md:hidden" />
          </div>
        ) : (
          <div className="md:w-48 h-28 md:h-auto bg-gradient-to-br from-indigo-950/60 to-slate-950 flex items-center justify-center shrink-0 border-b md:border-b-0 md:border-r border-slate-800">
            <Layers className="w-12 h-12 text-indigo-400/60" />
          </div>
        )}

        {/* Content */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-800/60">
                    <Layers className="w-3 h-3" />
                    <span>Konteyner Detayı</span>
                  </span>
                  {currentContainer.qr_code && (
                    <button
                      onClick={() => onPrintQr(currentContainer)}
                      className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                      title="QR Kodu Yazdır"
                    >
                      <QrCode className="w-3 h-3 text-sky-400" />
                      <span>{currentContainer.qr_code.replace('shelfmap://c/', 'QR: ')}</span>
                    </button>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {currentContainer.name}
                </h2>
              </div>

              {/* Edit / Delete quick buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => onEditContainer(currentContainer)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Konteyneri Düzenle"
                >
                  <Edit2 className="w-4 h-4 text-indigo-400" />
                </button>
                <button
                  onClick={() => onPrintQr(currentContainer)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="QR Etiketi Yazdır"
                >
                  <QrCode className="w-4 h-4 text-sky-400" />
                </button>
                <button
                  onClick={() => onDeleteContainer(currentContainer)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Konteyneri Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {currentContainer.description && (
              <p className="text-xs sm:text-sm text-slate-300 mt-2">
                {currentContainer.description}
              </p>
            )}

            {/* Badges / stats */}
            <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-sky-400" />
                <strong className="text-slate-200">{subContainers.length}</strong> alt konteyner
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Box className="w-3.5 h-3.5 text-emerald-400" />
                <strong className="text-slate-200">{items.length}</strong> parça/eşya
              </span>
            </div>
          </div>

          {/* Action buttons inside this container */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
            <button
              onClick={onAddItem}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Bu Kutunun İçine Eşya Ekle</span>
            </button>
            <button
              onClick={onAddSubContainer}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors border border-slate-700"
            >
              <FolderPlus className="w-4 h-4 text-indigo-400" />
              <span>İçine Alt Kutu / Çekmece Ekle</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
