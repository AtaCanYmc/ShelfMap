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
      console.error('Veriler yüklenirken hata:', err)
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
    if (confirm(`"${item.name}" eşyasını silmek istediğinize emin misiniz?`)) {
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
      ? `"${container.name}" konteynerini ve içindeki ${subCount} alt kutu ve ${itemCount} eşyayı silmek istediğinize emin misiniz?`
      : `"${container.name}" konteynerini silmek istediğinize emin misiniz?`

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
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
          <div className="mb-4 p-3 rounded-2xl bg-indigo-950/40 border border-indigo-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs text-indigo-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>
                <strong>ShelfMap Deneme Modu:</strong> Şu an yerel demo verileriyle çalışıyorsunuz. Kendi Supabase bağlantınızı kurup verilerinizi bulutta saklamak için Ayarlar'a göz atın.
              </span>
            </div>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium shrink-0 transition-colors"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Supabase Bağla</span>
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
          <div className="py-24 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-400 mb-3" />
            <p className="text-xs">Atölye envanteri yükleniyor...</p>
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
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                  {currentContainer ? 'İçindeki Alt Kutular & Raflar' : 'Ana Konumlar & Odalar'} ({subContainers.length})
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
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                  {currentContainer
                    ? `"${currentContainer.name}" İçindeki Eşyalar & Parçalar`
                    : 'Kök Düzeydeki / Atanmamış Eşyalar'}{' '}
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
