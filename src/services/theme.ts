export type ThemePreference = 'system' | 'dark' | 'light'

const THEME_STORAGE_KEY = 'shelfmap_theme'

export function getStoredThemePreference(): ThemePreference {
  if (typeof localStorage === 'undefined') {
    return 'system'
  }
  const saved = localStorage.getItem(THEME_STORAGE_KEY)
  if (saved === 'dark' || saved === 'light' || saved === 'system') {
    return saved
  }
  return 'system'
}

export function getSystemTheme(): 'dark' | 'light' {
  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light'
  }
  return 'dark'
}

export function resolveEffectiveTheme(pref: ThemePreference): 'dark' | 'light' {
  if (pref === 'system') {
    return getSystemTheme()
  }
  return pref
}

export function applyTheme(pref: ThemePreference): 'dark' | 'light' {
  const effective = resolveEffectiveTheme(pref)

  if (typeof document !== 'undefined') {
    const root = document.documentElement
    root.setAttribute('data-theme', effective)
    if (effective === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
    }

    // Update theme-color meta tag for PWA status bar
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', effective === 'dark' ? '#0c0f14' : '#f4f6f9')
    }
  }

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(THEME_STORAGE_KEY, pref)
  }
  return effective
}
