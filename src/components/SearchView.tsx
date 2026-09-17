import { useState, useMemo, Fragment, type FC } from 'react'
import type { Container, Item } from '../types'
import { searchWarehouse } from '../services/db'
import { getCategoryBadge } from './ItemCard'
import { useI18n } from '../services/i18n'
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
  const { t, categoryName } = useI18n()
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
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#11151f] border border-slate-300 dark:border-[#232a3c] rounded-xl shadow-2xl overflow-hidden my-6 transition-colors">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-[#232a3c] flex items-center gap-3 bg-slate-50 dark:bg-[#0c0f14]">
          <Search className="w-5 h-5 text-amber-500 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder={t('searchPlaceholderFull')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-slate-900 dark:text-slate-100 placeholder-slate-500 text-sm font-mono outline-none focus:ring-0"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1.5 rounded text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#1a2234] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1.5 rounded bg-slate-200 dark:bg-[#1a2234] hover:bg-slate-300 dark:hover:bg-[#232d45] text-slate-700 dark:text-slate-300 text-xs font-mono transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 overflow-x-auto border-b border-slate-200 dark:border-[#232a3c] scrollbar-none bg-slate-100 dark:bg-[#0e121b]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-[11px] font-mono uppercase px-2.5 py-1 rounded border transition-colors shrink-0 ${
                selectedCategory === cat
                  ? 'bg-amber-500/15 border-amber-500 text-amber-500 font-semibold'
                  : 'bg-white dark:bg-[#141a29] border-slate-300 dark:border-[#232d42] text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {cat === 'all' ? t('allCategories') : categoryName(cat)}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!query.trim() ? (
            <div className="py-12 text-center text-slate-500 text-xs font-mono">
              <Search className="w-7 h-7 mx-auto text-slate-600 dark:text-slate-700 mb-2 stroke-[1.5]" />
              {t('searchGuideText')}
              <br />
              Examples: <span className="text-amber-500 font-semibold">ESP32</span>, <span className="text-amber-500 font-semibold">TS100</span>, <span className="text-amber-500 font-semibold">M3</span>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs font-mono">
              <Box className="w-7 h-7 mx-auto text-slate-600 dark:text-slate-700 mb-2 stroke-[1.5]" />
              {t('noSearchResults')} "{query}"
            </div>
          ) : (
            <>
              {/* Items Section */}
              {matchedItems.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-1">
                    {t('itemsAndParts')} ({matchedItems.length})
                  </div>
                  {matchedItems.map(({ item, path, containerName: cName }) => {
                    const badge = getCategoryBadge(item.category)
                    const IconComponent = badge.icon

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelect(item.container_id)}
                        className="group p-3 rounded-lg bg-slate-50 dark:bg-[#0c0f14] border border-slate-200 dark:border-[#232a3c] hover:border-amber-500 hover:bg-amber-50/50 dark:hover:bg-[#141b2b] cursor-pointer transition-all flex items-center justify-between gap-3 min-h-[44px]"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Image / Icon */}
                          <div className="w-10 h-10 rounded bg-slate-100 dark:bg-[#11151f] border border-slate-300 dark:border-[#232a3c] flex items-center justify-center shrink-0 overflow-hidden">
                            {item.image_url ? (
                              <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <IconComponent className="w-4 h-4 text-slate-500" />
                            )}
                          </div>

                          {/* Info & Path */}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <h5 className="font-semibold text-slate-900 dark:text-slate-100 text-sm group-hover:text-amber-500 transition-colors truncate">
                                {item.name}
                              </h5>
                              <span
                                className={`text-[10px] font-mono px-1.5 py-0.2 rounded border font-semibold ${badge.classes}`}
                              >
                                {categoryName(item.category)}
                              </span>
                              <span className="text-[11px] font-mono tabular-nums text-slate-600 dark:text-slate-400">
                                ×{item.quantity}
                              </span>
                            </div>

                            {/* Full Breadcrumb Path */}
                            <div className="flex items-center gap-1 text-xs font-mono text-slate-600 dark:text-slate-400 truncate">
                              <span className="text-slate-500 font-semibold uppercase text-[10px]">{t('location')}:</span>
                              {path.length === 0 ? (
                                <span className="italic">
                                  {cName}
                                </span>
                              ) : (
                                path.map((node, i) => (
                                  <Fragment key={node.id}>
                                    {i > 0 && (
                                      <ChevronRight className="w-3 h-3 text-slate-500 shrink-0" />
                                    )}
                                    <span
                                      className={
                                        i === path.length - 1
                                          ? 'text-amber-500 font-semibold'
                                          : ''
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

                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-500 shrink-0 transition-colors" />
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Containers Section */}
              {selectedCategory === 'all' && matchedContainers.length > 0 && (
                <div className="space-y-2 mt-4 pt-4 border-t border-slate-200 dark:border-[#232a3c]">
                  <div className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-1">
                    {t('containersAndBins')} ({matchedContainers.length})
                  </div>
                  {matchedContainers.map(({ container, path, itemCount, childCount }) => (
                    <div
                      key={container.id}
                      onClick={() => handleSelect(container.id)}
                      className="group p-3 rounded-lg bg-slate-50 dark:bg-[#0c0f14] border border-slate-200 dark:border-[#232a3c] hover:border-amber-500 hover:bg-amber-50/50 dark:hover:bg-[#141b2b] cursor-pointer transition-all flex items-center justify-between gap-3 min-h-[44px]"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded bg-amber-100 dark:bg-[#182338] border border-amber-300 dark:border-[#2d3a56] flex items-center justify-center shrink-0">
                          <Layers className="w-4 h-4 text-amber-500" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h5 className="font-semibold text-slate-900 dark:text-slate-100 text-sm group-hover:text-amber-500 transition-colors truncate">
                              {container.name}
                            </h5>
                            <span className="text-[10px] font-mono tabular-nums text-slate-600 dark:text-slate-400">
                              ({childCount} {t('nestedBinsCount')}, {itemCount} {t('itemsCount')})
                            </span>
                          </div>

                          <div className="flex items-center gap-1 text-xs font-mono text-slate-600 dark:text-slate-400 truncate">
                            <span className="text-slate-500 font-semibold uppercase text-[10px]">{t('path')}:</span>
                            {path.map((node, i) => (
                              <Fragment key={node.id}>
                                {i > 0 && (
                                  <ChevronRight className="w-3 h-3 text-slate-500 shrink-0" />
                                )}
                                <span
                                  className={
                                    i === path.length - 1
                                      ? 'text-amber-500 font-semibold'
                                      : ''
                                  }
                                >
                                  {node.name}
                                </span>
                              </Fragment>
                            ))}
                          </div>
                        </div>
                      </div>

                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-500 shrink-0 transition-colors" />
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
