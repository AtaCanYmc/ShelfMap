import { useState, useMemo, Fragment, type FC } from 'react'
import type { Container, Item } from '../types'
import { searchWarehouse } from '../services/db'
import { getCategoryBadge } from './ItemCard'
import {
  Search,
  X,
  Layers,
  ChevronRight,
  ArrowRight,
  Box
} from 'lucide-react'

interface SearchViewProps {
  isOpen: boolean
  onClose: () => void
  containers: Container[]
  items: Item[]
  onSelectContainer: (containerId: string | null) => void
}

export const SearchView: FC<SearchViewProps> = ({
  isOpen,
  onClose,
  containers,
  items,
  onSelectContainer
}) => {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = useMemo(() => {
    const set = new Set<string>()
    items.forEach((i) => {
      if (i.category) set.add(i.category)
    })
    return ['all', ...Array.from(set)]
  }, [items])

  const { matchedItems, matchedContainers } = useMemo(() => {
    const results = searchWarehouse(query, containers, items)
    if (selectedCategory === 'all') {
      return results
    }
    return {
      matchedItems: results.matchedItems.filter(
        (m) => m.item.category.toLowerCase() === selectedCategory.toLowerCase()
      ),
      matchedContainers: results.matchedContainers
    }
  }, [query, selectedCategory, containers, items])

  if (!isOpen) return null

  const handleSelect = (containerId: string | null) => {
    onSelectContainer(containerId)
    onClose()
  }

  const totalResults = matchedItems.length + (selectedCategory === 'all' ? matchedContainers.length : 0)

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950/80">
          <Search className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Parça, sensör, vida, kumpas veya kutu adı yazın..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-slate-100 placeholder-slate-500 text-sm sm:text-base outline-none focus:ring-0"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-xs font-medium"
          >
            Kapat
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 overflow-x-auto border-b border-slate-800/80 scrollbar-none bg-slate-900">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white font-medium'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat === 'all' ? 'Tüm Kategoriler' : cat}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!query.trim() ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              <Search className="w-8 h-8 mx-auto text-slate-700 mb-2 stroke-[1.5]" />
              Aramak istediğiniz parça veya kutunun adını yukarıya yazın.
              <br />
              Örn: <span className="text-indigo-400">ESP32</span>, <span className="text-indigo-400">Kumpas</span>, <span className="text-indigo-400">M3</span>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              <Box className="w-8 h-8 mx-auto text-slate-700 mb-2 stroke-[1.5]" />
              "{query}" ile eşleşen bir eşya veya konteyner bulunamadı.
            </div>
          ) : (
            <>
              {/* Items Section */}
              {matchedItems.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
                    Eşyalar & Parçalar ({matchedItems.length})
                  </div>
                  {matchedItems.map(({ item, path, containerName }) => {
                    const badge = getCategoryBadge(item.category)
                    const IconComponent = badge.icon

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelect(item.container_id)}
                        className="group p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-indigo-600/50 hover:bg-slate-800/40 cursor-pointer transition-all flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Image / Icon */}
                          <div className="w-11 h-11 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 overflow-hidden">
                            {item.image_url ? (
                              <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <IconComponent className="w-5 h-5 text-slate-600" />
                            )}
                          </div>

                          {/* Info & Path */}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <h5 className="font-semibold text-slate-100 text-sm group-hover:text-indigo-400 transition-colors truncate">
                                {item.name}
                              </h5>
                              <span
                                className={`text-[10px] px-1.5 py-0.2 rounded border font-medium ${badge.classes}`}
                              >
                                {item.category}
                              </span>
                              <span className="text-[11px] font-mono text-slate-400">
                                ×{item.quantity}
                              </span>
                            </div>

                            {/* Full Breadcrumb Path */}
                            <div className="flex items-center gap-1 text-xs text-slate-400 truncate">
                              <span className="text-slate-500 font-medium">Konum:</span>
                              {path.length === 0 ? (
                                <span className="text-slate-400 italic">
                                  {containerName}
                                </span>
                              ) : (
                                path.map((node, i) => (
                                  <Fragment key={node.id}>
                                    {i > 0 && (
                                      <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
                                    )}
                                    <span
                                      className={
                                        i === path.length - 1
                                          ? 'text-sky-400 font-medium'
                                          : 'text-slate-400'
                                      }
                                    >
                                      {node.name}
                                    </span>
                                  </Fragment>
                                ))
                              )}
                            </div>
                          </div>
                        </div>

                        <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 shrink-0 transition-colors" />
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Containers Section */}
              {selectedCategory === 'all' && matchedContainers.length > 0 && (
                <div className="space-y-2 mt-4 pt-4 border-t border-slate-800">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
                    Konteynerler & Kutular ({matchedContainers.length})
                  </div>
                  {matchedContainers.map(({ container, path, itemCount, childCount }) => (
                    <div
                      key={container.id}
                      onClick={() => handleSelect(container.id)}
                      className="group p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-sky-600/50 hover:bg-slate-800/40 cursor-pointer transition-all flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-lg bg-indigo-950/40 border border-indigo-900/50 flex items-center justify-center shrink-0">
                          <Layers className="w-5 h-5 text-indigo-400" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h5 className="font-semibold text-slate-100 text-sm group-hover:text-sky-400 transition-colors truncate">
                              {container.name}
                            </h5>
                            <span className="text-[10px] text-slate-400">
                              ({childCount} alt kutu, {itemCount} eşya)
                            </span>
                          </div>

                          <div className="flex items-center gap-1 text-xs text-slate-400 truncate">
                            <span className="text-slate-500 font-medium">Yol:</span>
                            {path.map((node, i) => (
                              <Fragment key={node.id}>
                                {i > 0 && (
                                  <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
                                )}
                                <span
                                  className={
                                    i === path.length - 1
                                      ? 'text-indigo-400 font-medium'
                                      : 'text-slate-400'
                                  }
                                >
                                  {node.name}
                                </span>
                              </Fragment>
                            ))}
                          </div>
                        </div>
                      </div>

                      <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-sky-400 shrink-0 transition-colors" />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
