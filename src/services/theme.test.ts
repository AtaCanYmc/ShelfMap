import assert from 'node:assert'
import {
  getStoredThemePreference,
  resolveEffectiveTheme
} from './theme.js'

console.log('Testing Theme Service logic...')

// Test theme resolution
assert.strictEqual(resolveEffectiveTheme('dark'), 'dark', 'Dark pref must resolve to dark')
assert.strictEqual(resolveEffectiveTheme('light'), 'light', 'Light pref must resolve to light')

// When system, must resolve to either dark or light
const sys = resolveEffectiveTheme('system')
assert.ok(sys === 'dark' || sys === 'light', 'System must resolve to dark or light')

// Default preference when storage is absent
assert.strictEqual(getStoredThemePreference(), 'system', 'Default stored pref should be system')

console.log('✅ All theme tests passed successfully!')
