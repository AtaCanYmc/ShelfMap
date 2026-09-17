import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { SupabaseConfig } from '../types'
import { compressImage } from './imageUtils'

const STORAGE_KEY_URL = 'shelfmap_supabase_url'
const STORAGE_KEY_KEY = 'shelfmap_supabase_anon_key'
const STORAGE_KEY_DEMO = 'shelfmap_use_demo_mode'

let cachedClient: SupabaseClient | null = null
let currentUrl = ''
let currentKey = ''

export function getSupabaseConfig(): SupabaseConfig {
  const url = localStorage.getItem(STORAGE_KEY_URL) || ''
  const anonKey = localStorage.getItem(STORAGE_KEY_KEY) || ''
  const useDemoMode = localStorage.getItem(STORAGE_KEY_DEMO) === 'true' || (!url && !anonKey)

  return {
    url,
    anonKey,
    isConfigured: Boolean(url && anonKey),
    useDemoMode
  }
}

export function saveSupabaseConfig(url: string, anonKey: string, useDemoMode = false): void {
  localStorage.setItem(STORAGE_KEY_URL, url.trim())
  localStorage.setItem(STORAGE_KEY_KEY, anonKey.trim())
  localStorage.setItem(STORAGE_KEY_DEMO, String(useDemoMode))
  cachedClient = null
  currentUrl = ''
  currentKey = ''
}

export function getSupabaseClient(): SupabaseClient | null {
  const config = getSupabaseConfig()
  if (config.useDemoMode || !config.isConfigured) {
    return null
  }

  if (cachedClient && currentUrl === config.url && currentKey === config.anonKey) {
    return cachedClient
  }

  try {
    cachedClient = createClient(config.url, config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    })
    currentUrl = config.url
    currentKey = config.anonKey
    return cachedClient
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err)
    return null
  }
}

export async function testSupabaseConnection(url: string, anonKey: string): Promise<{ success: boolean; error?: string }> {
  try {
    const testClient = createClient(url.trim(), anonKey.trim())
    const { error } = await testClient.from('containers').select('id').limit(1)
    if (error) {
      // If table does not exist, provide clear message
      if (error.code === '42P01') {
        return { success: false, error: 'Database tables not detected. Please run the setup SQL script in your Supabase SQL Editor.' }
      }
      return { success: false, error: error.message }
    }
    return { success: true }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Connection failed' }
  }
}

export async function uploadWorkshopImage(file: File): Promise<string> {
  // 1. Compress image natively on client
  const compressedBlob = await compressImage(file)

  const client = getSupabaseClient()
  if (!client) {
    // If running in demo / local mode, return compressed data URL
    const reader = new FileReader()
    return new Promise((resolve) => {
      reader.onload = () => resolve(reader.result as string)
      reader.readAsDataURL(compressedBlob)
    })
  }

  // 2. Upload to Supabase Storage workshop-images
  const ext = file.name.split('.').pop() || 'jpg'
  const cleanName = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`
  const filePath = `uploads/${cleanName}`

  const { error: uploadError } = await client.storage
    .from('workshop-images')
    .upload(filePath, compressedBlob, {
      contentType: 'image/jpeg',
      upsert: true
    })

  if (uploadError) {
    console.error('Storage upload error:', uploadError)
    throw new Error(`Failed to upload image: ${uploadError.message}`)
  }

  const { data } = client.storage.from('workshop-images').getPublicUrl(filePath)
  return data.publicUrl
}
