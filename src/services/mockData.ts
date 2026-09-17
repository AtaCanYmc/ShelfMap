import type { Container, Item } from '../types'

export const INITIAL_MOCK_CONTAINERS: Container[] = [
  {
    id: 'room-workshop',
    name: 'Workshop & Lab',
    description: 'Main electronic prototyping workbench and lab area',
    parent_id: null,
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    qr_code: 'shelfmap://c/room-workshop',
    created_at: new Date().toISOString()
  },
  {
    id: 'cabinet-right',
    name: 'Right Metal Cabinet',
    description: '4-shelf industrial metal storage cabinet',
    parent_id: 'room-workshop',
    image_url: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&auto=format&fit=crop&q=80',
    qr_code: 'shelfmap://c/cabinet-right',
    created_at: new Date().toISOString()
  },
  {
    id: 'drawer-2',
    name: 'Drawer 2 (Microcontrollers)',
    description: 'Development boards and IoT modules',
    parent_id: 'cabinet-right',
    image_url: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=800&auto=format&fit=crop&q=80',
    qr_code: 'shelfmap://c/drawer-2',
    created_at: new Date().toISOString()
  },
  {
    id: 'toolbox-blue',
    name: 'Blue Tool Bag',
    description: 'Mechanical hand tools and precision instruments',
    parent_id: 'cabinet-right',
    image_url: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&auto=format&fit=crop&q=80',
    qr_code: 'shelfmap://c/toolbox-blue',
    created_at: new Date().toISOString()
  },
  {
    id: 'box-fasteners',
    name: 'M3 Fasteners Organizer',
    description: '24-compartment transparent hardware organizer',
    parent_id: 'cabinet-right',
    image_url: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&auto=format&fit=crop&q=80',
    qr_code: 'shelfmap://c/box-fasteners',
    created_at: new Date().toISOString()
  },
  {
    id: 'room-storage',
    name: 'Storage Room',
    description: 'Spares, heavy power tools, and bulk spools',
    parent_id: null,
    image_url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&auto=format&fit=crop&q=80',
    qr_code: 'shelfmap://c/room-storage',
    created_at: new Date().toISOString()
  }
]

export const INITIAL_MOCK_ITEMS: Item[] = [
  {
    id: 'item-esp32-nodemcu',
    name: 'ESP32 NodeMCU CP2102 (WiFi+BT)',
    category: 'Microcontroller',
    quantity: 4,
    container_id: 'drawer-2',
    image_url: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&auto=format&fit=crop&q=80',
    notes: '38-pin version, 2 units soldered and breadboard friendly',
    created_at: new Date().toISOString()
  },
  {
    id: 'item-esp8266-d1',
    name: 'Wemos D1 Mini ESP8266',
    category: 'Microcontroller',
    quantity: 6,
    container_id: 'drawer-2',
    image_url: 'https://images.unsplash.com/photo-1608555895738-f9b26b38c201?w=600&auto=format&fit=crop&q=80',
    notes: 'Ideal for compact IoT projects',
    created_at: new Date().toISOString()
  },
  {
    id: 'item-caliper',
    name: 'Digital Caliper 150mm (0.01mm)',
    category: 'Hand Tool',
    quantity: 1,
    container_id: 'toolbox-blue',
    image_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80',
    notes: 'Powered by LR44 cell, keep in protective case',
    created_at: new Date().toISOString()
  },
  {
    id: 'item-soldering-iron',
    name: 'TS100 Smart Soldering Iron & BC2 Tip',
    category: 'Hand Tool',
    quantity: 1,
    container_id: 'toolbox-blue',
    image_url: 'https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?w=600&auto=format&fit=crop&q=80',
    notes: 'Includes XT60 cable and 24V adapter',
    created_at: new Date().toISOString()
  },
  {
    id: 'item-m3-screws',
    name: 'M3x8mm Socket Head Cap Screws',
    category: 'Hardware',
    quantity: 50,
    container_id: 'box-fasteners',
    image_url: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600&auto=format&fit=crop&q=80',
    notes: 'Stainless steel for 3D printer assembly',
    created_at: new Date().toISOString()
  },
  {
    id: 'item-m3-nuts',
    name: 'M3 Nylon Insert Lock Nuts',
    category: 'Hardware',
    quantity: 42,
    container_id: 'box-fasteners',
    image_url: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600&auto=format&fit=crop&q=80',
    notes: 'Vibration-resistant self-locking nuts',
    created_at: new Date().toISOString()
  }
]
