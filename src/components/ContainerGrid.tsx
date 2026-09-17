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
      <div className="bg-[#10141d]/60 border border-dashed border-[#222838] rounded-xl p-8 text-center flex flex-col items-center justify-center">
        <div className="w-10 h-10 rounded-lg bg-[#161c28] border border-[#273248] flex items-center justify-center text-slate-400 mb-2.5">
          <Layers className="w-5 h-5 stroke-[1.5]" />
        </div>
        <h4 className="text-sm font-semibold text-slate-200">No Sub-Containers Here</h4>
        <p className="text-xs text-slate-400 mt-1 max-w-sm leading-relaxed">
          Create a shelf, drawer, or organizer box inside this location to nest your storage.
        </p>
        <button
          onClick={onAddNew}
          className="btn-tactile mt-3.5 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#181f2c] hover:bg-[#20293a] text-slate-200 hover:text-white border border-[#29354d] transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-amber-400" />
          <span>Add Sub-Container</span>
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
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
