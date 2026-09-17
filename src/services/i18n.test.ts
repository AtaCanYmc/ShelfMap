import assert from 'node:assert'
import { translations, SUPPORTED_LANGUAGES, type Language } from './i18n.js'

console.log('Testing ShelfMap i18n dictionary and language integrity...')

// 1. Check all 5 required languages are supported
const expectedLangs: Language[] = ['en', 'tr', 'de', 'fr', 'es']
assert.strictEqual(SUPPORTED_LANGUAGES.length, 5, 'Must support 5 languages')
for (const lang of expectedLangs) {
  assert.ok(SUPPORTED_LANGUAGES.some((l) => l.code === lang), `Language ${lang} must be supported`)
  assert.ok(translations[lang], `Translations dictionary must exist for ${lang}`)
}

// 2. Check key parity with English dictionary
const englishKeys = Object.keys(translations.en) as (keyof typeof translations.en)[]
for (const lang of expectedLangs) {
  const langDict = translations[lang]
  for (const key of englishKeys) {
    assert.ok(
      key in langDict && (langDict as Record<string, unknown>)[key] !== undefined,
      `Key "${key}" must be translated in ${lang}`
    )
  }
}

// 3. Category translations integrity
for (const lang of expectedLangs) {
  const catMap = translations[lang].categories
  assert.ok(catMap.Microcontroller, `Microcontroller category translated in ${lang}`)
  assert.ok(catMap.Tool, `Tool category translated in ${lang}`)
  assert.ok(catMap.Fastener, `Fastener category translated in ${lang}`)
}

console.log('✅ All i18n validation tests passed successfully!')
