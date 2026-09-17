import type { FC } from 'react'
import type { Item } from '../types'
import { ItemCard } from './ItemCard'
import { Plus, Box } from 'lucide-react'

interface ItemListProps {
  items: Item[]
  containerName?: string
  onEdit: (item: Item) => void
  onDelete: (item: Item) => void
  onMove: (item: Item) => void
  onUpdateQuantity: (id: string, delta: number) => void
  onPreviewImage: (url: string, title: string) => void
  onAddNew: () => void
}

export const ItemList: FC<ItemListProps> = ({
  items,
  containerName,
  onEdit,
  onDelete,
  onMove,
  onUpdateQuantity,
  onPreviewImage,
  onAddNew
}) => {
  if (items.length === 0) {
    return (
      <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-8 text-center flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center text-emerald-400 mb-3">
          <Box className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-semibold text-slate-200">
          {containerName ? `"${containerName}" içinde henüz eşya yok` : 'Henüz atanmamış eşya yok'}
        </h4>
        <p className="text-xs text-slate-400 mt-1 max-w-sm">
          Bu kutuya veya çekmeceye ait elektronik parçalar, aletler veya vidalar ekleyin.
        </p>
        <button
          onClick={onAddNew}
          className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Eşya / Parça Ekle</span>
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
          onMove={onMove}
          onUpdateQuantity={onUpdateQuantity}
          onPreviewImage={onPreviewImage}
        />
      ))}
    </div>
  )
}
