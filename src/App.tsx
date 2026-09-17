import { useState, useEffect, useCallback } from 'react'
import type { Container, Item, SupabaseConfig } from './types'
import {
  fetchAllContainers,
  fetchAllItems,
  createContainer,
  updateContainer,
  deleteContainer,
  createItem,
  updateItem,
  deleteItem,
  updateItemQuantity,
  getContainerPath
} from './services/db'
import { getSupabaseConfig } from './services/supabaseClient'
import { Navbar } from './components/Navbar'
import { Breadcrumbs } from './components/Breadcrumbs'
import { ContainerHeader } from './components/ContainerHeader'
import { ContainerGrid } from './components/ContainerGrid'
import { ItemList } from './components/ItemList'
import { ItemModal } from './components/ItemModal'
import { ContainerModal } from './components/ContainerModal'
import { MoveModal } from './components/MoveModal'
import { QrScannerModal } from './components/QrScannerModal'
import { QrPrintModal } from './components/QrPrintModal'
import { SettingsModal } from './components/SettingsModal'
import { SearchView } from './components/SearchView'
import { ImagePreviewModal } from './components/ImagePreviewModal'
import { Loader2, Database, Sparkles } from 'lucide-react'

export function App() {
  const [containers, setContainers] = useState<Container[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [currentContainerId, setCurrentContainerId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [config, setConfig] = useState<SupabaseConfig>(getSupabaseConfig())

  // Modals state
  const [isItemModalOpen, setIsItemModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | null>(null)

  const [isContainerModalOpen, setIsContainerModalOpen] = useState(false)
  const [editingContainer, setEditingContainer] = useState<Container | null>(null)

  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false)
  const [moveItemTarget, setMoveItemTarget] = useState<Item | null>(null)
  const [moveContainerTarget, setMoveContainerTarget] = useState<Container | null>(null)

  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false)
  const [isQrPrintOpen, setIsQrPrintOpen] = useState(false)
  const [printContainer, setPrintContainer] = useState<Container | null>(null)

  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null)

  // Load all containers and items
  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [cList, iList] = await Promise.all([
        fetchAllContainers(),
        fetchAllItems()
      ])
      setContainers(cList)
      setItems(iList)
    } catch (err) {
      console.error('Failed to load inventory data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Global keyboard shortcuts: / for search, Escape for closing modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)
      ) {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Derived calculations
  const currentContainer = containers.find((c) => c.id === currentContainerId) || null
  const subContainers = containers.filter((c) => c.parent_id === currentContainerId)
  const currentItems = items.filter((i) => i.container_id === currentContainerId)
  const breadcrumbPath = getContainerPath(currentContainerId, containers)

  // Handlers for Items
  const handleSaveItem = async (
    itemData: Omit<Item, 'id' | 'created_at'>,
    id?: string
  ) => {
    if (id) {
      const updated = await updateItem(id, itemData)
      setItems((prev) => prev.map((i) => (i.id === id ? updated : i)))
    } else {
      const created = await createItem(itemData)
      setItems((prev) => [created, ...prev])
    }
  }

  const handleDeleteItem = async (item: Item) => {
    if (confirm(`Are you sure you want to delete item "${item.name}"?`)) {
      await deleteItem(item.id)
      setItems((prev) => prev.filter((i) => i.id !== item.id))
    }
  }

  const handleUpdateItemQuantity = async (id: string, delta: number) => {
    const updated = await updateItemQuantity(id, delta)
    setItems((prev) => prev.map((i) => (i.id === id ? updated : i)))
  }

  // Handlers for Containers
  const handleSaveContainer = async (
    containerData: Omit<Container, 'id' | 'created_at'>,
    id?: string
  ) => {
    if (id) {
      const updated = await updateContainer(id, containerData)
      setContainers((prev) => prev.map((c) => (c.id === id ? updated : c)))
    } else {
      const created = await createContainer(containerData)
      setContainers((prev) => [created, ...prev])
    }
  }

  const handleDeleteContainer = async (container: Container) => {
    const subCount = containers.filter((c) => c.parent_id === container.id).length
    const itemCount = items.filter((i) => i.container_id === container.id).length
    const promptMsg = subCount > 0 || itemCount > 0
      ? `Delete "${container.name}" along with ${subCount} nested containers and ${itemCount} items?`
      : `Are you sure you want to delete container "${container.name}"?`

    if (confirm(promptMsg)) {
      await deleteContainer(container.id)
      if (currentContainerId === container.id) {
        setCurrentContainerId(container.parent_id)
      }
      loadData()
    }
  }

  // Handler for Move
  const handleConfirmMove = async (newLocationId: string | null) => {
    if (moveItemTarget) {
      const updated = await updateItem(moveItemTarget.id, { container_id: newLocationId })
      setItems((prev) => prev.map((i) => (i.id === moveItemTarget.id ? updated : i)))
    } else if (moveContainerTarget) {
      const updated = await updateContainer(moveContainerTarget.id, { parent_id: newLocationId })
      setContainers((prev) => prev.map((c) => (c.id === moveContainerTarget.id ? updated : c)))
    }
  }

  return (
    <div className="min-h-screen bg-[#0c0f14] text-slate-100 flex flex-col selection:bg-amber-500 selection:text-black font-sans">
      {/* Top Navigation */}
      <Navbar
        config={config}
        onOpenScanner={() => setIsQrScannerOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onNewContainer={() => {
          setEditingContainer(null)
          setIsContainerModalOpen(true)
        }}
        onNewItem={() => {
          setEditingItem(null)
          setIsItemModalOpen(true)
        }}
        onGoHome={() => setCurrentContainerId(null)}
      />

      {/* Main Workshop Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4">
        {/* BYOS Banner / Notice if running on demo local storage */}
        {config.useDemoMode && !config.isConfigured && (
          <div className="mb-4 p-3 rounded-lg bg-[#11151f] border border-[#232a3c] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs text-slate-300 font-mono">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong className="text-amber-400">LOCAL OFFLINE STORAGE:</strong> Inventory is saved locally in browser storage. Connect your personal Supabase instance to enable cross-device cloud sync.
              </span>
            </div>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold uppercase tracking-wider text-[11px] shrink-0 transition-colors shadow-sm"
            >
              <Database className="w-3.5 h-3.5 text-black" />
              <span>Connect Supabase</span>
            </button>
          </div>
        )}

        {/* Breadcrumb path bar */}
        <div className="mb-3">
          <Breadcrumbs
            path={breadcrumbPath}
            onNavigate={(id) => setCurrentContainerId(id)}
          />
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-400 font-mono">
            <Loader2 className="w-8 h-8 animate-spin text-amber-400 mb-3" />
            <p className="text-xs uppercase tracking-widest text-slate-400">Loading workshop inventory...</p>
          </div>
        ) : (
          <>
            {/* Current Location Banner & Quick Actions */}
            <ContainerHeader
              currentContainer={currentContainer}
              subContainers={subContainers}
              items={currentItems}
              totalAllItems={items}
              totalAllContainers={containers}
              onAddSubContainer={() => {
                setEditingContainer(null)
                setIsContainerModalOpen(true)
              }}
              onAddItem={() => {
                setEditingItem(null)
                setIsItemModalOpen(true)
              }}
              onEditContainer={(c) => {
                setEditingContainer(c)
                setIsContainerModalOpen(true)
              }}
              onDeleteContainer={(c) => handleDeleteContainer(c)}
              onPrintQr={(c) => {
                setPrintContainer(c)
                setIsQrPrintOpen(true)
              }}
              onPreviewImage={(url, title) => setPreviewImage({ url, title })}
            />

            {/* Section 1: Child Containers / Boxes */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
                  {currentContainer ? 'Sub-Containers & Storage Bins' : 'Primary Storage Facilities'} ({subContainers.length})
                </h3>
              </div>

              <ContainerGrid
                containers={subContainers}
                allItems={items}
                allContainers={containers}
                onOpen={(id) => setCurrentContainerId(id)}
                onEdit={(c) => {
                  setEditingContainer(c)
                  setIsContainerModalOpen(true)
                }}
                onDelete={(c) => handleDeleteContainer(c)}
                onMove={(c) => {
                  setMoveContainerTarget(c)
                  setMoveItemTarget(null)
                  setIsMoveModalOpen(true)
                }}
                onPrintQr={(c) => {
                  setPrintContainer(c)
                  setIsQrPrintOpen(true)
                }}
                onAddNew={() => {
                  setEditingContainer(null)
                  setIsContainerModalOpen(true)
                }}
              />
            </section>

            {/* Section 2: Items in this container */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
                  {currentContainer
                    ? `Components & Items in "${currentContainer.name}"`
                    : 'Root Level / Unassigned Items'}{' '}
                  ({currentItems.length})
                </h3>
              </div>

              <ItemList
                items={currentItems}
                containerName={currentContainer?.name}
                onEdit={(item) => {
                  setEditingItem(item)
                  setIsItemModalOpen(true)
                }}
                onDelete={(item) => handleDeleteItem(item)}
                onMove={(item) => {
                  setMoveItemTarget(item)
                  setMoveContainerTarget(null)
                  setIsMoveModalOpen(true)
                }}
                onUpdateQuantity={handleUpdateItemQuantity}
                onPreviewImage={(url, title) => setPreviewImage({ url, title })}
                onAddNew={() => {
                  setEditingItem(null)
                  setIsItemModalOpen(true)
                }}
              />
            </section>
          </>
        )}
      </main>

      {/* Modals */}
      <ItemModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        onSave={handleSaveItem}
        initialItem={editingItem}
        currentContainerId={currentContainerId}
        allContainers={containers}
      />

      <ContainerModal
        isOpen={isContainerModalOpen}
        onClose={() => setIsContainerModalOpen(false)}
        onSave={handleSaveContainer}
        initialContainer={editingContainer}
        currentParentId={currentContainerId}
        allContainers={containers}
      />

      <MoveModal
        isOpen={isMoveModalOpen}
        onClose={() => setIsMoveModalOpen(false)}
        targetItem={moveItemTarget}
        targetContainer={moveContainerTarget}
        allContainers={containers}
        onConfirmMove={handleConfirmMove}
      />

      <QrScannerModal
        isOpen={isQrScannerOpen}
        onClose={() => setIsQrScannerOpen(false)}
        allContainers={containers}
        onSelectContainer={(id) => setCurrentContainerId(id)}
        onQuickAddItem={(id) => {
          setCurrentContainerId(id)
          setEditingItem(null)
          setIsItemModalOpen(true)
        }}
      />

      <QrPrintModal
        isOpen={isQrPrintOpen}
        onClose={() => setIsQrPrintOpen(false)}
        container={printContainer}
        allContainers={containers}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onConfigUpdated={() => {
          setConfig(getSupabaseConfig())
          loadData()
        }}
        containers={containers}
        items={items}
        onDataReload={loadData}
      />

      <SearchView
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        containers={containers}
        items={items}
        onSelectContainer={(id) => setCurrentContainerId(id)}
      />

      <ImagePreviewModal
        isOpen={Boolean(previewImage)}
        onClose={() => setPreviewImage(null)}
        imageUrl={previewImage?.url || ''}
        title={previewImage?.title || ''}
      />
    </div>
  )
}
export default App
