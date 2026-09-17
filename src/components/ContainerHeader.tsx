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
      <div className="bg-[#11151f] border border-[#22293b] rounded-xl p-5 sm:p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-500 font-semibold px-2 py-0.5 rounded bg-amber-950/40 border border-amber-800/40">
                Workshop Hierarchy
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Master Storage Map
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
              Map and locate all electronics, boards, tools, and hardware across nested physical containers.
            </p>
          </div>

          {/* Technical Stat Strip */}
          <div className="grid grid-cols-3 gap-2 shrink-0 font-mono">
            <div className="px-3.5 py-2 rounded-lg bg-[#0e1219] border border-[#1f2638] text-left">
              <div className="text-lg font-bold text-white tabular-nums">
                {totalAllContainers.length}
              </div>
              <div className="text-[10px] text-slate-500 uppercase">Containers</div>
            </div>
            <div className="px-3.5 py-2 rounded-lg bg-[#0e1219] border border-[#1f2638] text-left">
              <div className="text-lg font-bold text-white tabular-nums">
                {totalAllItems.length}
              </div>
              <div className="text-[10px] text-slate-500 uppercase">Items</div>
            </div>
            <div className={`px-3.5 py-2 rounded-lg border text-left ${
              lowStockCount > 0
                ? 'bg-amber-950/20 border-amber-800/50 text-amber-400'
                : 'bg-[#0e1219] border-[#1f2638] text-slate-400'
            }`}>
              <div className="text-lg font-bold tabular-nums flex items-center gap-1">
                {lowStockCount > 0 && <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                <span>{lowStockCount}</span>
              </div>
              <div className="text-[10px] text-slate-500 uppercase">Low Stock</div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-5 pt-4 border-t border-[#1f2638] flex flex-wrap items-center gap-2.5">
          <button
            onClick={onAddSubContainer}
            className="btn-tactile inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors"
          >
            <FolderPlus className="w-4 h-4 stroke-[2]" />
            <span>Add Root Location / Room</span>
          </button>
          <button
            onClick={onAddItem}
            className="btn-tactile inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg bg-[#181e2b] hover:bg-[#202738] text-slate-200 hover:text-white border border-[#273147] transition-colors"
          >
            <Plus className="w-4 h-4 text-sky-400" />
            <span>Add General Item</span>
          </button>
        </div>
      </div>
    )
  }

  // Inside a specific container
  return (
    <div className="bg-[#11151f] border border-[#22293b] rounded-xl overflow-hidden mb-6">
      <div className="flex flex-col md:flex-row">
        {/* Photo or technical placeholder */}
        {currentContainer.image_url ? (
          <div
            onClick={() => onPreviewImage(currentContainer.image_url!, currentContainer.name)}
            className="md:w-60 h-44 md:h-auto bg-[#0b0e14] relative overflow-hidden shrink-0 cursor-pointer group"
          >
            <img
              src={currentContainer.image_url}
              alt={currentContainer.name}
              className="w-full h-full object-cover transition-opacity hover:opacity-90"
            />
          </div>
        ) : (
          <div className="md:w-44 h-24 md:h-auto bg-[#0b0e14] bg-tech-grid flex items-center justify-center shrink-0 border-b md:border-b-0 md:border-r border-[#1f2638]">
            <Layers className="w-10 h-10 text-slate-700 stroke-[1.5]" />
          </div>
        )}

        {/* Content */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1 font-mono">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#181f2c] text-sky-400 border border-[#27334a]">
                    CONTAINER
                  </span>
                  {currentContainer.qr_code && (
                    <button
                      onClick={() => onPrintQr(currentContainer)}
                      className="inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-white px-2 py-0.5 rounded bg-[#141924] border border-[#232b3d] transition-colors"
                      title="Print QR label"
                    >
                      <QrCode className="w-3 h-3 text-amber-400" />
                      <span>{currentContainer.qr_code.replace('shelfmap://c/', '')}</span>
                    </button>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {currentContainer.name}
                </h2>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => onEditContainer(currentContainer)}
                  className="btn-tactile p-1.5 rounded-lg bg-[#161c28] hover:bg-[#202838] text-slate-300 hover:text-white border border-[#263147] transition-colors"
                  title="Edit Container"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onPrintQr(currentContainer)}
                  className="btn-tactile p-1.5 rounded-lg bg-[#161c28] hover:bg-[#202838] text-slate-300 hover:text-white border border-[#263147] transition-colors"
                  title="Print QR Label"
                >
                  <QrCode className="w-3.5 h-3.5 text-amber-400" />
                </button>
                <button
                  onClick={() => onDeleteContainer(currentContainer)}
                  className="btn-tactile p-1.5 rounded-lg bg-[#161c28] hover:bg-rose-950/50 text-slate-400 hover:text-rose-400 border border-[#263147] hover:border-rose-900/60 transition-colors"
                  title="Delete Container"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {currentContainer.description && (
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                {currentContainer.description}
              </p>
            )}

            {/* Counts */}
            <div className="flex items-center gap-3 mt-3 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-sky-400" />
                <strong className="text-slate-200 tabular-nums">{subContainers.length}</strong> sub-units
              </span>
              <span className="text-slate-700">•</span>
              <span className="flex items-center gap-1">
                <Box className="w-3.5 h-3.5 text-amber-400" />
                <strong className="text-slate-200 tabular-nums">{items.length}</strong> items inside
              </span>
            </div>
          </div>

          {/* Action Bar */}
          <div className="mt-4 pt-3 border-t border-[#1f2638] flex flex-wrap items-center gap-2">
            <button
              onClick={onAddItem}
              className="btn-tactile inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add Item Inside</span>
            </button>
            <button
              onClick={onAddSubContainer}
              className="btn-tactile inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#181e2b] hover:bg-[#202738] text-slate-200 hover:text-white border border-[#273147] transition-colors"
            >
              <FolderPlus className="w-3.5 h-3.5 text-slate-400" />
              <span>Add Sub-Box / Drawer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
