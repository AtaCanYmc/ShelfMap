import type { Container, Item, BreadcrumbNode, SearchResultItem, SearchResultContainer } from '../types'
import { getSupabaseClient } from './supabaseClient'
import { INITIAL_MOCK_CONTAINERS, INITIAL_MOCK_ITEMS } from './mockData'

const LOCAL_CONTAINERS_KEY = 'shelfmap_local_containers'
const LOCAL_ITEMS_KEY = 'shelfmap_local_items'

// Helper to generate a unique UUID-like identifier
function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9)
}

// LocalStorage helpers
function loadLocalContainers(): Container[] {
  const saved = localStorage.getItem(LOCAL_CONTAINERS_KEY)
  if (!saved) {
    localStorage.setItem(LOCAL_CONTAINERS_KEY, JSON.stringify(INITIAL_MOCK_CONTAINERS))
    return INITIAL_MOCK_CONTAINERS
  }
  try {
    return JSON.parse(saved)
  } catch {
    return INITIAL_MOCK_CONTAINERS
  }
}

function saveLocalContainers(containers: Container[]): void {
  localStorage.setItem(LOCAL_CONTAINERS_KEY, JSON.stringify(containers))
}

function loadLocalItems(): Item[] {
  const saved = localStorage.getItem(LOCAL_ITEMS_KEY)
  if (!saved) {
    localStorage.setItem(LOCAL_ITEMS_KEY, JSON.stringify(INITIAL_MOCK_ITEMS))
    return INITIAL_MOCK_ITEMS
  }
  try {
    return JSON.parse(saved)
  } catch {
    return INITIAL_MOCK_ITEMS
  }
}

function saveLocalItems(items: Item[]): void {
  localStorage.setItem(LOCAL_ITEMS_KEY, JSON.stringify(items))
}

/**
 * Resolves the full breadcrumb path from root down to the given container ID.
 * Returns [] if containerId is null (meaning root).
 */
export function getContainerPath(
  containerId: string | null,
  allContainers: Container[]
): BreadcrumbNode[] {
  if (!containerId) return []

  const containerMap = new Map<string, Container>()
  allContainers.forEach((c) => containerMap.set(c.id, c))

  const path: BreadcrumbNode[] = []
  const visited = new Set<string>() // prevent infinite cycles
  let currentId: string | null = containerId

  while (currentId && !visited.has(currentId)) {
    visited.add(currentId)
    const current = containerMap.get(currentId)
    if (!current) break

    path.unshift({ id: current.id, name: current.name })
    currentId = current.parent_id
  }

  return path
}

/**
 * Checks if targetId is an ancestor or the container itself to prevent cyclic hierarchies.
 */
export function wouldCreateCycle(
  containerId: string,
  newParentId: string | null,
  allContainers: Container[]
): boolean {
  if (!newParentId) return false
  if (containerId === newParentId) return true

  const containerMap = new Map<string, Container>()
  allContainers.forEach((c) => containerMap.set(c.id, c))

  let currentId: string | null = newParentId
  const visited = new Set<string>()

  while (currentId && !visited.has(currentId)) {
    if (currentId === containerId) return true
    visited.add(currentId)
    const parent = containerMap.get(currentId)
    currentId = parent?.parent_id || null
  }

  return false
}

// ==========================================
// CONTAINERS CRUD
// ==========================================

export async function fetchAllContainers(): Promise<Container[]> {
  const client = getSupabaseClient()
  if (client) {
    const { data, error } = await client
      .from('containers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase fetchContainers hatası:', error)
      throw error
    }
    return (data as Container[]) || []
  }

  return loadLocalContainers()
}

export async function createContainer(
  containerData: Omit<Container, 'id' | 'created_at'>
): Promise<Container> {
  const id = generateId()
  const qr_code = containerData.qr_code || `shelfmap://c/${id}`
  const newContainer: Container = {
    ...containerData,
    id,
    qr_code,
    created_at: new Date().toISOString()
  }

  const client = getSupabaseClient()
  if (client) {
    const { data, error } = await client
      .from('containers')
      .insert([newContainer])
      .select()
      .single()

    if (error) throw error
    return data as Container
  }

  const list = loadLocalContainers()
  list.unshift(newContainer)
  saveLocalContainers(list)
  return newContainer
}

export async function updateContainer(
  id: string,
  updates: Partial<Container>
): Promise<Container> {
  const client = getSupabaseClient()
  if (client) {
    const { data, error } = await client
      .from('containers')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Container
  }

  const list = loadLocalContainers()
  const idx = list.findIndex((c) => c.id === id)
  if (idx === -1) throw new Error('Konteyner bulunamadı')
  list[idx] = { ...list[idx], ...updates }
  saveLocalContainers(list)
  return list[idx]
}

export async function deleteContainer(id: string): Promise<void> {
  const client = getSupabaseClient()
  if (client) {
    // Database cascade constraint handles descendants and item set-null
    const { error } = await client.from('containers').delete().eq('id', id)
    if (error) throw error
    return
  }

  // Local storage cascade deletion
  const list = loadLocalContainers()
  // Collect all descendant ids recursively
  const toDelete = new Set<string>([id])
  let changed = true
  while (changed) {
    changed = false
    list.forEach((c) => {
      if (c.parent_id && toDelete.has(c.parent_id) && !toDelete.has(c.id)) {
        toDelete.add(c.id)
        changed = true
      }
    })
  }

  const filteredContainers = list.filter((c) => !toDelete.has(c.id))
  saveLocalContainers(filteredContainers)

  // Unset or delete items in these containers
  const items = loadLocalItems()
  const updatedItems = items.map((item) => {
    if (item.container_id && toDelete.has(item.container_id)) {
      return { ...item, container_id: null }
    }
    return item
  })
  saveLocalItems(updatedItems)
}

// ==========================================
// ITEMS CRUD
// ==========================================

export async function fetchAllItems(): Promise<Item[]> {
  const client = getSupabaseClient()
  if (client) {
    const { data, error } = await client
      .from('items')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase fetchItems hatası:', error)
      throw error
    }
    return (data as Item[]) || []
  }

  return loadLocalItems()
}

export async function createItem(
  itemData: Omit<Item, 'id' | 'created_at'>
): Promise<Item> {
  const newItem: Item = {
    ...itemData,
    id: generateId(),
    created_at: new Date().toISOString()
  }

  const client = getSupabaseClient()
  if (client) {
    const { data, error } = await client
      .from('items')
      .insert([newItem])
      .select()
      .single()

    if (error) throw error
    return data as Item
  }

  const list = loadLocalItems()
  list.unshift(newItem)
  saveLocalItems(list)
  return newItem
}

export async function updateItem(
  id: string,
  updates: Partial<Item>
): Promise<Item> {
  const client = getSupabaseClient()
  if (client) {
    const { data, error } = await client
      .from('items')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Item
  }

  const list = loadLocalItems()
  const idx = list.findIndex((i) => i.id === id)
  if (idx === -1) throw new Error('Eşya bulunamadı')
  list[idx] = { ...list[idx], ...updates }
  saveLocalItems(list)
  return list[idx]
}

export async function deleteItem(id: string): Promise<void> {
  const client = getSupabaseClient()
  if (client) {
    const { error } = await client.from('items').delete().eq('id', id)
    if (error) throw error
    return
  }

  const list = loadLocalItems()
  const filtered = list.filter((i) => i.id !== id)
  saveLocalItems(filtered)
}

export async function updateItemQuantity(id: string, delta: number): Promise<Item> {
  const client = getSupabaseClient()
  if (client) {
    // Read current quantity first
    const { data: current, error: readErr } = await client
      .from('items')
      .select('quantity')
      .eq('id', id)
      .single()
    if (readErr) throw readErr

    const newQty = Math.max(0, (current?.quantity || 0) + delta)
    const { data, error } = await client
      .from('items')
      .update({ quantity: newQty })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Item
  }

  const list = loadLocalItems()
  const idx = list.findIndex((i) => i.id === id)
  if (idx === -1) throw new Error('Eşya bulunamadı')
  list[idx].quantity = Math.max(0, (list[idx].quantity || 0) + delta)
  saveLocalItems(list)
  return list[idx]
}

// ==========================================
// QR & SEARCH HELPERS
// ==========================================

export function findContainerByQrCode(
  code: string,
  containers: Container[]
): Container | null {
  const trimmed = code.trim()
  return (
    containers.find(
      (c) =>
        c.qr_code === trimmed ||
        c.id === trimmed ||
        trimmed.endsWith(`/c/${c.id}`) ||
        trimmed.includes(c.id)
    ) || null
  )
}

export function searchWarehouse(
  query: string,
  containers: Container[],
  items: Item[]
): {
  matchedItems: SearchResultItem[]
  matchedContainers: SearchResultContainer[]
} {
  const q = query.trim().toLowerCase()
  if (!q) {
    return { matchedItems: [], matchedContainers: [] }
  }

  // 1. Search items
  const matchedItems: SearchResultItem[] = items
    .filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q) ||
        (i.notes && i.notes.toLowerCase().includes(q))
    )
    .map((item) => {
      const path = getContainerPath(item.container_id, containers)
      const containerName = item.container_id
        ? containers.find((c) => c.id === item.container_id)?.name || 'Bilinmeyen Konum'
        : 'Kök Dizin (Konteyner atanmamış)'

      return {
        item,
        path,
        containerName
      }
    })

  // 2. Search containers
  const matchedContainers: SearchResultContainer[] = containers
    .filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q))
    )
    .map((container) => {
      const path = getContainerPath(container.id, containers)
      const childCount = containers.filter((c) => c.parent_id === container.id).length
      const itemCount = items.filter((i) => i.container_id === container.id).length

      return {
        container,
        path,
        itemCount,
        childCount
      }
    })

  return { matchedItems, matchedContainers }
}

// Reset local data to mock defaults
export function resetToDemoData(): void {
  localStorage.setItem(LOCAL_CONTAINERS_KEY, JSON.stringify(INITIAL_MOCK_CONTAINERS))
  localStorage.setItem(LOCAL_ITEMS_KEY, JSON.stringify(INITIAL_MOCK_ITEMS))
}

// Export data as JSON
export function exportAllData(containers: Container[], items: Item[]): string {
  return JSON.stringify({ containers, items, exportedAt: new Date().toISOString() }, null, 2)
}

// Import data from JSON
export function importAllData(jsonData: string): { containers: Container[]; items: Item[] } {
  const parsed = JSON.parse(jsonData)
  if (!Array.isArray(parsed.containers) || !Array.isArray(parsed.items)) {
    throw new Error('Geçersiz ShelfMap yedek dosyası formatı.')
  }
  saveLocalContainers(parsed.containers)
  saveLocalItems(parsed.items)
  return { containers: parsed.containers, items: parsed.items }
}
