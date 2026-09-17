import type { Container, Item } from '../types'

export const INITIAL_MOCK_CONTAINERS: Container[] = [
  {
    id: 'room-workshop',
    name: 'Atölye & Çalışma Odası',
    description: 'Ana elektronik laboratuvarı ve çalışma masası alanı',
    parent_id: null,
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    qr_code: 'shelfmap://c/room-workshop',
    created_at: new Date().toISOString()
  },
  {
    id: 'cabinet-right',
    name: 'Sağ Metal Dolap',
    description: '4 raflı gri endüstriyel metal malzeme dolabı',
    parent_id: 'room-workshop',
    image_url: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&auto=format&fit=crop&q=80',
    qr_code: 'shelfmap://c/cabinet-right',
    created_at: new Date().toISOString()
  },
  {
    id: 'drawer-2',
    name: '2. Çekmece (Mikrodenetleyiciler)',
    description: 'Geliştirme kartları ve IoT modülleri',
    parent_id: 'cabinet-right',
    image_url: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=800&auto=format&fit=crop&q=80',
    qr_code: 'shelfmap://c/drawer-2',
    created_at: new Date().toISOString()
  },
  {
    id: 'toolbox-blue',
    name: 'Mavi Alet Çantası',
    description: 'Mekanik ve hassas el aletleri',
    parent_id: 'cabinet-right',
    image_url: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&auto=format&fit=crop&q=80',
    qr_code: 'shelfmap://c/toolbox-blue',
    created_at: new Date().toISOString()
  },
  {
    id: 'box-fasteners',
    name: 'M3 Vida & Somun Kutusu',
    description: '24 gözlü şeffaf organizer kutu',
    parent_id: 'cabinet-right',
    image_url: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&auto=format&fit=crop&q=80',
    qr_code: 'shelfmap://c/box-fasteners',
    created_at: new Date().toISOString()
  },
  {
    id: 'room-storage',
    name: 'Kiler & Depo',
    description: 'Yedek kablolar ve büyük elektrikli el aletleri',
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
    category: 'Mikrodenetleyici',
    quantity: 4,
    container_id: 'drawer-2',
    image_url: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&auto=format&fit=crop&q=80',
    notes: '38-pin versiyon, 2 tanesi lehimli breadboard uyumlu',
    created_at: new Date().toISOString()
  },
  {
    id: 'item-esp8266-d1',
    name: 'Wemos D1 Mini ESP8266',
    category: 'Mikrodenetleyici',
    quantity: 6,
    container_id: 'drawer-2',
    image_url: 'https://images.unsplash.com/photo-1608555895738-f9b26b38c201?w=600&auto=format&fit=crop&q=80',
    notes: 'Kompakt IoT projeleri için ideal',
    created_at: new Date().toISOString()
  },
  {
    id: 'item-caliper',
    name: 'Dijital Kumpas 150mm (0.01mm)',
    category: 'El Aleti',
    quantity: 1,
    container_id: 'toolbox-blue',
    image_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80',
    notes: 'LR44 pil ile çalışır, kutusunda muhafaza edilmeli',
    created_at: new Date().toISOString()
  },
  {
    id: 'item-soldering-iron',
    name: 'TS100 Akıllı Havya & BC2 Uç',
    category: 'El Aleti',
    quantity: 1,
    container_id: 'toolbox-blue',
    image_url: 'https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?w=600&auto=format&fit=crop&q=80',
    notes: 'XT60 kablosu ve 24V adaptör yanında',
    created_at: new Date().toISOString()
  },
  {
    id: 'item-m3-screws',
    name: 'M3x8mm Silindir Başlı İnbus Cıvata',
    category: 'Hırdavat',
    quantity: 50,
    container_id: 'box-fasteners',
    image_url: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600&auto=format&fit=crop&q=80',
    notes: '3D yazıcı montajı için paslanmaz çelik',
    created_at: new Date().toISOString()
  },
  {
    id: 'item-m3-nuts',
    name: 'M3 Fiberli Paslanmaz Somun',
    category: 'Hırdavat',
    quantity: 42,
    container_id: 'box-fasteners',
    image_url: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600&auto=format&fit=crop&q=80',
    notes: 'Titreşime dayanıklı kilitli tip',
    created_at: new Date().toISOString()
  }
]
