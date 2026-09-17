import type { FC } from 'react'
import type { Item } from '../types'
import { ItemCard } from './ItemCard'
import { Plus, Box } from 'lucide-react'
import { useI18n } from '../services/i18n'

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
  const { t } = useI18n()

  if (items.length === 0) {
    return (
      <div className="bg-white/60 dark:bg-[#10141d]/60 border border-dashed border-slate-300 dark:border-[#222838] rounded-xl p-8 text-center flex flex-col items-center justify-center">
        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-[#161c28] border border-slate-300 dark:border-[#273248] flex items-center justify-center text-slate-400 mb-2.5">
          <Box className="w-5 h-5 stroke-[1.5] text-amber-500" />
        </div>
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          {containerName ? `${t('itemsInContainer')} "${containerName}"` : t('unassignedItems')}
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-sm leading-relaxed">
          {t('noItemsHere')}
        </p>
        <button
          onClick={onAddNew}
          className="btn-tactile mt-3.5 inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors min-h-[38px]"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>{t('createFirstItem')}</span>
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
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
