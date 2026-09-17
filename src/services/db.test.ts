import assert from 'node:assert'
import {
  getContainerPath,
  wouldCreateCycle,
  searchWarehouse,
  findContainerByQrCode
} from './db'
import { INITIAL_MOCK_CONTAINERS, INITIAL_MOCK_ITEMS } from './mockData'

console.log('Running ShelfMap core logic tests...')

// 1. Test getContainerPath
const drawerPath = getContainerPath('drawer-2', INITIAL_MOCK_CONTAINERS)
assert.strictEqual(drawerPath.length, 3, 'Drawer path should have 3 levels')
assert.strictEqual(drawerPath[0].name, 'Atölye & Çalışma Odası')
assert.strictEqual(drawerPath[1].name, 'Sağ Metal Dolap')
assert.strictEqual(drawerPath[2].name, '2. Çekmece (Mikrodenetleyiciler)')

const rootPath = getContainerPath('room-workshop', INITIAL_MOCK_CONTAINERS)
assert.strictEqual(rootPath.length, 1)
assert.strictEqual(rootPath[0].name, 'Atölye & Çalışma Odası')

const nullPath = getContainerPath(null, INITIAL_MOCK_CONTAINERS)
assert.strictEqual(nullPath.length, 0)

// 2. Test wouldCreateCycle
// Moving 'cabinet-right' into its own child 'drawer-2' must be detected as a cycle!
const createsCycle = wouldCreateCycle('cabinet-right', 'drawer-2', INITIAL_MOCK_CONTAINERS)
assert.strictEqual(createsCycle, true, 'Moving cabinet into its child drawer must create cycle')

// Moving 'cabinet-right' into root (null) is valid
const validMove = wouldCreateCycle('cabinet-right', null, INITIAL_MOCK_CONTAINERS)
assert.strictEqual(validMove, false, 'Moving to root should not create cycle')

// Moving 'drawer-2' into 'room-storage' is valid
const validMove2 = wouldCreateCycle('drawer-2', 'room-storage', INITIAL_MOCK_CONTAINERS)
assert.strictEqual(validMove2, false)

// 3. Test Search with full path
const searchResult = searchWarehouse('ESP32', INITIAL_MOCK_CONTAINERS, INITIAL_MOCK_ITEMS)
assert.strictEqual(searchResult.matchedItems.length, 1)
assert.strictEqual(searchResult.matchedItems[0].item.name, 'ESP32 NodeMCU CP2102 (WiFi+BT)')
assert.strictEqual(searchResult.matchedItems[0].path.length, 3)
assert.strictEqual(
  searchResult.matchedItems[0].path.map((p) => p.name).join(' > '),
  'Atölye & Çalışma Odası > Sağ Metal Dolap > 2. Çekmece (Mikrodenetleyiciler)'
)

// 4. Test QR Code matching
const foundContainer = findContainerByQrCode('shelfmap://c/drawer-2', INITIAL_MOCK_CONTAINERS)
assert.ok(foundContainer, 'Should find container by full QR URL')
assert.strictEqual(foundContainer?.id, 'drawer-2')

const foundByRawId = findContainerByQrCode('drawer-2', INITIAL_MOCK_CONTAINERS)
assert.ok(foundByRawId, 'Should find container by raw ID')

console.log('✅ All ShelfMap core logic tests passed successfully!')
