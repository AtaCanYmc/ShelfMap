export interface Container {
  id: string
  user_id?: string
  name: string
  description?: string | null
  parent_id: string | null
  image_url?: string | null
  qr_code: string
  created_at?: string
}

export interface Item {
  id: string
  user_id?: string
  name: string
  category: string
  quantity: number
  container_id: string | null
  image_url?: string | null
  notes?: string | null
  created_at?: string
}

export interface BreadcrumbNode {
  id: string
  name: string
}

export interface SupabaseConfig {
  url: string
  anonKey: string
  isConfigured: boolean
  useDemoMode: boolean
}

export interface SearchResultItem {
  item: Item
  path: BreadcrumbNode[]
  containerName: string | null
}

export interface SearchResultContainer {
  container: Container
  path: BreadcrumbNode[]
  itemCount: number
  childCount: number
}
