import type { FC } from 'react'
import type { Container, Item } from '../types'
import { ContainerCard } from './ContainerCard'
import { Plus, Layers } from 'lucide-react'

interface ContainerGridProps {
  containers: Container[]
  allItems: Item[]
  allContainers: Container[]
  onOpen: (id: string) => void
  onEdit: (container: Container) => void
  onDelete: (container: Container) => void
  onMove: (container: Container) => void
  onPrintQr: (container: Container) => void
  onAddNew: () => void
}

export const ContainerGrid: FC<ContainerGridProps> = ({
  containers,
  allItems,
  allContainers,
  onOpen,
  onEdit,
  onDelete,
  onMove,
  onPrintQr,
  onAddNew
}) => {
  if (containers.length === 0) {
    return (
      <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-8 text-center flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-indigo-950/60 border border-indigo-800/40 flex items-center justify-center text-indigo-400 mb-3">
          <Layers className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-semibold text-slate-200">Bu konumda alt kutu veya raf yok</h4>
        <p className="text-xs text-slate-400 mt-1 max-w-sm">
          Bu alanın içerisine çekmece, alet kutusu veya raf gibi yeni bir alt konteyner ekleyebilirsiniz.
        </p>
        <button
          onClick={onAddNew}
          className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Alt Konteyner Ekle</span>
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {containers.map((c) => {
        const subCount = allContainers.filter((sub) => sub.parent_id === c.id).length
        const itemCount = allItems.filter((item) => item.container_id === c.id).length

        return (
          <ContainerCard
            key={c.id}
            container={c}
            subContainerCount={subCount}
            itemCount={itemCount}
            onOpen={onOpen}
            onEdit={onEdit}
            onDelete={onDelete}
            onMove={onMove}
            onPrintQr={onPrintQr}
          />
        )
      })}
    </div>
  )
}
