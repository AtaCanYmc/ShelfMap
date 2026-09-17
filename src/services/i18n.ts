import { createContext, useContext, useState, useEffect, type ReactNode, createElement } from 'react'

export type Language = 'en' | 'tr' | 'de' | 'fr' | 'es'

export interface LanguageOption {
  code: Language
  label: string
  nativeName: string
  flag: string
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'tr', label: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'de', label: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
]

export const translations = {
  en: {
    // Common
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    confirm: 'Confirm',
    close: 'Close',
    edit: 'Edit',
    copy: 'Copy',
    copied: 'Copied!',
    move: 'Relocate',
    search: 'Search',
    add: 'Add',
    open: 'Open',
    back: 'Back',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    all: 'All',
    root: 'ROOT / Storage Facility',
    location: 'Location',
    path: 'Path',

    // Navbar
    searchPrompt: 'Search parts, ICs, containers (/)...',
    newContainer: 'New Container',
    newItem: 'New Item',
    quickAdd: 'Quick Add',
    byosOnline: 'BYOS ONLINE',
    localDemo: 'LOCAL DEMO',

    // Sections
    primaryLocations: 'Primary Storage Facilities',
    subContainers: 'Sub-Containers & Bins',
    itemsInContainer: 'Components & Items in',
    unassignedItems: 'Root Level / Unassigned Items',
    nestedBinsCount: 'sub-bins',
    itemsCount: 'items',
    noContainersHere: 'No nested containers inside this location yet.',
    noItemsHere: 'No items or components stored here yet.',
    createFirstContainer: 'Create First Sub-Container',
    createFirstItem: 'Store First Component',

    // Container Modal
    newContainerTitle: 'New Storage Container',
    editContainerTitle: 'Edit Storage Container',
    containerName: 'Container Name',
    containerNamePlaceholder: 'e.g. Rack A, Drawer 2, Blue Sortimo Box',
    parentLocation: 'Parent Container (Location)',
    containerDescription: 'Description / Notes',
    containerDescPlaceholder: 'Dimensions, shelf location, or physical characteristics...',
    customQrCode: 'Custom Barcode / QR Identifier',
    customQrPlaceholder: 'Auto-generated if empty',
    saveContainerBtn: 'Save Container',

    // Item Modal
    newItemTitle: 'Register New Component',
    editItemTitle: 'Edit Component Details',
    itemName: 'Component / Item Name',
    itemNamePlaceholder: 'e.g. ESP32-WROOM-32, TS100 Soldering Tip, M3x10 Bolt',
    itemCategory: 'Category',
    itemQuantity: 'Quantity in Stock',
    itemContainer: 'Storage Container',
    itemNotes: 'Notes, Specs & Pinouts',
    itemNotesPlaceholder: 'Pinout details, component values, tolerance, supplier...',
    itemPhoto: 'Component Photo',
    tapToPhoto: 'Tap to take photo or select image',
    changePhoto: 'Change photo',
    removePhoto: 'Remove photo',
    saveItemBtn: 'Save Component',

    // Move Modal
    relocateTitleItem: 'Relocate Item',
    relocateTitleContainer: 'Relocate Container',
    selectDestination: 'Select Destination',
    targetsAvailable: 'targets available',
    confirmMoveBtn: 'Confirm Move',

    // QR Scanner Modal
    qrScannerTitle: 'Optical Barcode & QR Scanner',
    scanZone: 'SCAN_ZONE',
    containerIdentified: 'CONTAINER IDENTIFIED',
    openContainerBtn: 'Open Container',
    addItemBtn: 'Add Item',
    manualInput: 'Manual Code Input',
    returnToCamera: 'Return to Camera',
    scanFile: 'Scan File',
    lookup: 'Lookup',
    manualPlaceholder: 'e.g. shelfmap://c/drawer-2 or container ID',
    noContainerForCode: 'No container indexed under code',
    cameraPermissionError: 'Unable to initialize optical sensor. Check camera permissions or switch to manual input below.',
    noQrInImage: 'No optical QR or barcode code recognized in image.',

    // QR Print Modal
    printLabelsTitle: 'Print Adhesive Labels',
    includeSubBins: 'Include child containers',
    printLabelsBtn: 'Print Labels',
    partsBinHeader: 'SHELFMAP // PARTS BIN',

    // Search View
    searchPlaceholderFull: 'Search parts, ICs, sensors, screws, or containers...',
    searchGuideText: 'Type part name, specification, or container to search index.',
    noSearchResults: 'No items or containers match',
    itemsAndParts: 'Items & Parts',
    containersAndBins: 'Containers & Storage Bins',
    allCategories: 'All Categories',

    // Settings Modal
    settingsTitle: 'Workbench Settings',
    settingsSubtitle: 'Configuration, Theme & Cloud Sync',
    tabPreferences: 'Preferences',
    tabByos: 'BYOS Supabase',
    tabSql: 'SQL Schema',
    tabData: 'Backup & Data',
    
    // Preferences Tab
    appearanceTitle: 'Appearance & Theme',
    themeSystem: 'System Default',
    themeSystemDesc: 'Follow device operating system appearance',
    themeDark: 'Dark Mode',
    themeDarkDesc: 'Carbon workshop with amber tool accents',
    themeLight: 'Light Mode',
    themeLightDesc: 'Clean blueprint paper with high-contrast text',
    languageTitle: 'Display Language',

    // BYOS Tab
    byosZeroTelemetry: 'Zero Telemetry: ShelfMap runs entirely client-side. Provide your own free Supabase credentials to sync inventory across devices, or keep Local Offline Mode active.',
    localOfflineMode: 'Local Offline Storage',
    localOfflineDesc: 'Store inventory solely in browser storage without cloud sync',
    supabaseUrl: 'Supabase Project URL',
    supabaseKey: 'Supabase Anon / Public API Key',
    testConnection: 'Test Connection',
    saveConfigBtn: 'Save Configuration',
    connectionSuccess: 'Supabase connection and database schema verified.',
    fillCredentials: 'Please enter both Supabase Project URL and Public Anon Key.',

    // SQL Tab
    sqlNotice: 'Executes schema creation for containers, items, and workshop-images storage bucket:',
    copySqlBtn: 'Copy SQL',
    sqlStep1: 'Click Copy SQL above.',
    sqlStep2: 'Open your Supabase dashboard and navigate to SQL Editor.',
    sqlStep3: 'Paste the code and click Run.',

    // Backup Tab
    backupSectionTitle: 'Inventory Snapshot Export / Import',
    backupSectionDesc: 'Export your workshop storage hierarchy and parts inventory to a portable JSON backup file.',
    downloadBackup: 'Download JSON Backup',
    restoreBackup: 'Restore JSON Backup',
    sampleDataTitle: 'Reset to Sample Maker Inventory',
    sampleDataDesc: 'Populates storage tree with ESP32-WROOM, TS100 soldering iron, digital calipers, and M3 hardware bins.',
    loadSampleDataBtn: 'Load Sample Data',
    confirmSampleData: 'This will replace current local inventory with default Maker bench sample data. Continue?',
    backupSuccess: 'Inventory snapshot restored successfully.',
    backupInvalid: 'Invalid inventory backup format.',

    // Image Preview
    inspectionView: 'Inspection:',

    // Banner
    demoBannerTitle: 'LOCAL OFFLINE STORAGE:',
    demoBannerDesc: 'Inventory is saved locally in browser storage. Connect your personal Supabase instance to enable cross-device cloud sync.',
    connectSupabaseBtn: 'Connect Supabase',

    // Mobile Dock
    dockHome: 'Home',
    dockSearch: 'Search',
    dockScan: 'Scan QR',
    dockAdd: 'Add',
    dockSettings: 'Settings',

    // Confirm dialogs
    confirmDeleteItem: 'Are you sure you want to delete item',
    confirmDeleteContainer: 'Are you sure you want to delete container',
    confirmDeleteContainerSub: 'along with nested containers and items?',

    // Categories
    categories: {
      all: 'All',
      Microcontroller: 'Microcontroller',
      Tool: 'Tool',
      Fastener: 'Fastener',
      Sensor: 'Sensor',
      Module: 'Module',
      Component: 'Component',
      Passive: 'Passive',
      Wire: 'Wire & Cable',
      Other: 'Other',
    }
  },

  tr: {
    // Common
    cancel: 'İptal',
    save: 'Kaydet',
    delete: 'Sil',
    confirm: 'Onayla',
    close: 'Kapat',
    edit: 'Düzenle',
    copy: 'Kopyala',
    copied: 'Kopyalandı!',
    move: 'Taşı',
    search: 'Ara',
    add: 'Ekle',
    open: 'Aç',
    back: 'Geri',
    loading: 'Yükleniyor...',
    error: 'Hata',
    success: 'Başarılı',
    all: 'Tümü',
    root: 'KÖK / Atölye Deposu',
    location: 'Konum',
    path: 'Yol',

    // Navbar
    searchPrompt: 'Parça, entegre, kutu ara (/)...',
    newContainer: 'Yeni Kutu',
    newItem: 'Yeni Parça',
    quickAdd: 'Hızlı Ekle',
    byosOnline: 'BYOS ÇEVRİMİÇİ',
    localDemo: 'YEREL DEMO',

    // Sections
    primaryLocations: 'Ana Depolama Konumları',
    subContainers: 'Alt Kutular ve Çekmeceler',
    itemsInContainer: 'İçindeki Parçalar:',
    unassignedItems: 'Kök Seviye / Atanmamış Parçalar',
    nestedBinsCount: 'alt kutu',
    itemsCount: 'parça',
    noContainersHere: 'Bu konumda henüz alt kutu veya çekmece yok.',
    noItemsHere: 'Burada depolanmış parça veya eşya bulunmuyor.',
    createFirstContainer: 'İlk Alt Kutuyu Ekle',
    createFirstItem: 'İlk Parçayı Ekle',

    // Container Modal
    newContainerTitle: 'Yeni Depolama Kutusu',
    editContainerTitle: 'Kutuyu Düzenle',
    containerName: 'Kutu / Konum Adı',
    containerNamePlaceholder: 'Örn: Raf A, 2. Çekmece, Mavi Alet Çantası',
    parentLocation: 'Üst Konum (Konteyner)',
    containerDescription: 'Açıklama / Notlar',
    containerDescPlaceholder: 'Boyutlar, raf yeri veya fiziksel özellikler...',
    customQrCode: 'Özel Barkod / QR Kodu',
    customQrPlaceholder: 'Boş bırakılırsa otomatik üretilir',
    saveContainerBtn: 'Kutuyu Kaydet',

    // Item Modal
    newItemTitle: 'Yeni Parça / Eşya Ekle',
    editItemTitle: 'Parça Detaylarını Düzenle',
    itemName: 'Parça / Eşya Adı',
    itemNamePlaceholder: 'Örn: ESP32-WROOM-32, TS100 Havya Ucu, M3x10 Civata',
    itemCategory: 'Kategori',
    itemQuantity: 'Stok Adedi',
    itemContainer: 'Depolandığı Kutu',
    itemNotes: 'Notlar, Özellikler & Pinout',
    itemNotesPlaceholder: 'Pinout detayları, tolerans, tedarikçi, çalışma voltajı...',
    itemPhoto: 'Parça Fotoğrafı',
    tapToPhoto: 'Fotoğraf çekmek veya seçmek için dokunun',
    changePhoto: 'Fotoğrafı değiştir',
    removePhoto: 'Fotoğrafı kaldır',
    saveItemBtn: 'Parçayı Kaydet',

    // Move Modal
    relocateTitleItem: 'Eşyayı Taşı',
    relocateTitleContainer: 'Kutuyu Taşı',
    selectDestination: 'Hedef Konumu Seçin',
    targetsAvailable: 'hedef mevcut',
    confirmMoveBtn: 'Taşımayı Onayla',

    // QR Scanner Modal
    qrScannerTitle: 'Optik Barkod & QR Tarayıcı',
    scanZone: 'TARAMA_ALANI',
    containerIdentified: 'KUTU TESPİT EDİLDİ',
    openContainerBtn: 'Kutuyu Aç',
    addItemBtn: 'Eşya Ekle',
    manualInput: 'Manuel Kod Girişi',
    returnToCamera: 'Kameraya Dön',
    scanFile: 'Görselden Tara',
    lookup: 'Bul',
    manualPlaceholder: 'Örn: shelfmap://c/drawer-2 veya kutu ID',
    noContainerForCode: 'Bu koda ait kutu bulunamadı',
    cameraPermissionError: 'Kamera başlatılamadı. Kamera izinlerini kontrol edin veya manuel kod girin.',
    noQrInImage: 'Görselde okunabilir QR veya barkod tespit edilemedi.',

    // QR Print Modal
    printLabelsTitle: 'Yapışkan Etiket Yazdır',
    includeSubBins: 'Alt kutuların etiketlerini de dahil et',
    printLabelsBtn: 'Etiketleri Yazdır',
    partsBinHeader: 'SHELFMAP // PARÇA KUTUSU',

    // Search View
    searchPlaceholderFull: 'Parça, sensör, vida, kumpas veya kutu ara...',
    searchGuideText: 'Aramak istediğiniz parça veya kutunun adını yazın.',
    noSearchResults: 'Eşleşen parça veya kutu bulunamadı:',
    itemsAndParts: 'Parçalar & Eşyalar',
    containersAndBins: 'Kutular & Konumlar',
    allCategories: 'Tüm Kategoriler',

    // Settings Modal
    settingsTitle: 'Atölye Ayarları',
    settingsSubtitle: 'Yapılandırma, Tema ve Bulut Senkronizasyonu',
    tabPreferences: 'Tercihler',
    tabByos: 'BYOS Supabase',
    tabSql: 'SQL Şeması',
    tabData: 'Yedek & Veri',
    
    // Preferences Tab
    appearanceTitle: 'Görünüm & Tema',
    themeSystem: 'Sistem Varsayılanı',
    themeSystemDesc: 'Cihaz işletim sistemi temasını takip et',
    themeDark: 'Karanlık Mod',
    themeDarkDesc: 'Amber takım vurgularıyla karbon atölye teması',
    themeLight: 'Aydınlık Mod',
    themeLightDesc: 'Yüksek kontrastlı temiz mühendislik kâğıdı teması',
    languageTitle: 'Arayüz Dili',

    // BYOS Tab
    byosZeroTelemetry: 'Sıfır Telemetri: ShelfMap tamamen istemci tarafında çalışır. Verilerinizi cihazlar arasında eşitlemek için kendi ücretsiz Supabase bilgilerinizi girin veya Çevrimdışı Modda kalın.',
    localOfflineMode: 'Yerel Çevrimdışı Depolama',
    localOfflineDesc: 'Verileri bulut olmadan yalnızca tarayıcı önbelleğinde sakla',
    supabaseUrl: 'Supabase Project URL',
    supabaseKey: 'Supabase Anon / Public API Key',
    testConnection: 'Bağlantıyı Test Et',
    saveConfigBtn: 'Ayarları Kaydet',
    connectionSuccess: 'Supabase bağlantısı ve veritabanı şeması doğrulandı.',
    fillCredentials: 'Lütfen Project URL ve Public Anon Key alanlarını doldurun.',

    // SQL Tab
    sqlNotice: 'containers, items tabloları ve workshop-images storage bucket kurulumu:',
    copySqlBtn: 'SQL\'i Kopyala',
    sqlStep1: 'Yukarıdaki SQL\'i Kopyala butonuna tıklayın.',
    sqlStep2: 'Supabase panelinizde SQL Editor sekmesine gidin.',
    sqlStep3: 'Kodu yapıştırıp Run butonuna tıklayın.',

    // Backup Tab
    backupSectionTitle: 'Envanter Yedeği İndir / Geri Yükle',
    backupSectionDesc: 'Tüm atölye depolama haritanızı taşınabilir JSON dosyası olarak kaydedin.',
    downloadBackup: 'JSON Yedeği İndir',
    restoreBackup: 'JSON Yedeği Geri Yükle',
    sampleDataTitle: 'Örnek Maker Verilerini Geri Yükle',
    sampleDataDesc: 'Depolama ağacını ESP32, TS100 havya, dijital kumpas ve M3 vida kutuları ile doldurur.',
    loadSampleDataBtn: 'Örnek Verileri Yükle',
    confirmSampleData: 'Mevcut yerel veriler varsayılan örnek Maker verileriyle değiştirilecek. Devam edilsin mi?',
    backupSuccess: 'Yedek başarıyla geri yüklendi.',
    backupInvalid: 'Geçersiz yedek dosyası formatı.',

    // Image Preview
    inspectionView: 'İnceleme:',

    // Banner
    demoBannerTitle: 'YEREL ÇEVRİMDIŞI DEPOLAMA:',
    demoBannerDesc: 'Envanteriniz yerel tarayıcı belleğinde saklanıyor. Cihazlar arası senkronizasyon için Supabase bağlayabilirsiniz.',
    connectSupabaseBtn: 'Supabase Bağla',

    // Mobile Dock
    dockHome: 'Depo',
    dockSearch: 'Ara',
    dockScan: 'QR Tara',
    dockAdd: 'Ekle',
    dockSettings: 'Ayarlar',

    // Confirm dialogs
    confirmDeleteItem: 'Bu parçayı silmek istediğinize emin misiniz:',
    confirmDeleteContainer: 'Bu kutuyu silmek istediğinize emin misiniz:',
    confirmDeleteContainerSub: 'içindeki alt kutular ve parçalarla birlikte silinsin mi?',

    // Categories
    categories: {
      all: 'Tümü',
      Microcontroller: 'Mikrodenetleyici',
      Tool: 'El Aleti',
      Fastener: 'Hırdavat & Civata',
      Sensor: 'Sensör',
      Module: 'Modül & Kart',
      Component: 'Komponent',
      Passive: 'Pasif Eleman',
      Wire: 'Kablo & Bağlantı',
      Other: 'Diğer',
    }
  },

  de: {
    // Common
    cancel: 'Abbrechen',
    save: 'Speichern',
    delete: 'Löschen',
    confirm: 'Bestätigen',
    close: 'Schließen',
    edit: 'Bearbeiten',
    copy: 'Kopieren',
    copied: 'Kopiert!',
    move: 'Verschieben',
    search: 'Suchen',
    add: 'Hinzufügen',
    open: 'Öffnen',
    back: 'Zurück',
    loading: 'Laden...',
    error: 'Fehler',
    success: 'Erfolgreich',
    all: 'Alle',
    root: 'ROOT / Hauptlager',
    location: 'Ort',
    path: 'Pfad',

    // Navbar
    searchPrompt: 'Bauteile, ICs, Boxen suchen (/)...',
    newContainer: 'Neue Box',
    newItem: 'Neues Teil',
    quickAdd: 'Schnell hinzufügen',
    byosOnline: 'BYOS ONLINE',
    localDemo: 'LOKALE DEMO',

    // Sections
    primaryLocations: 'Hauptlagerbereiche',
    subContainers: 'Unterbehälter & Fächer',
    itemsInContainer: 'Bauteile in',
    unassignedItems: 'Hauptebene / Nicht zugeordnete Teile',
    nestedBinsCount: 'Fächer',
    itemsCount: 'Teile',
    noContainersHere: 'Noch keine Unterbehälter an diesem Ort vorhanden.',
    noItemsHere: 'Noch keine Teile hier gelagert.',
    createFirstContainer: 'Ersten Unterbehälter erstellen',
    createFirstItem: 'Erstes Bauteil hinzufügen',

    // Container Modal
    newContainerTitle: 'Neuer Lagerbehälter',
    editContainerTitle: 'Lagerbehälter bearbeiten',
    containerName: 'Behältername',
    containerNamePlaceholder: 'z.B. Regal A, Schublade 2, Sortimentskasten',
    parentLocation: 'Übergeordneter Behälter',
    containerDescription: 'Beschreibung / Notizen',
    containerDescPlaceholder: 'Maße, Regalplatz oder physische Merkmale...',
    customQrCode: 'Benutzerdefinierter Barcode / QR-Code',
    customQrPlaceholder: 'Automatisch generiert falls leer',
    saveContainerBtn: 'Behälter speichern',

    // Item Modal
    newItemTitle: 'Neues Bauteil registrieren',
    editItemTitle: 'Bauteildaten bearbeiten',
    itemName: 'Bauteil- / Artikelname',
    itemNamePlaceholder: 'z.B. ESP32-WROOM-32, TS100 Lötspitze, M3x10 Schraube',
    itemCategory: 'Kategorie',
    itemQuantity: 'Bestandsmenge',
    itemContainer: 'Lagerbehälter',
    itemNotes: 'Notizen, Pinouts & Spezifikationen',
    itemNotesPlaceholder: 'Pinbelegung, Bauteilwerte, Toleranz, Lieferant...',
    itemPhoto: 'Bauteilfoto',
    tapToPhoto: 'Tippen für Fotoaufnahme oder Bildauswahl',
    changePhoto: 'Foto ändern',
    removePhoto: 'Foto entfernen',
    saveItemBtn: 'Bauteil speichern',

    // Move Modal
    relocateTitleItem: 'Teil verschieben',
    relocateTitleContainer: 'Behälter verschieben',
    selectDestination: 'Zielort auswählen',
    targetsAvailable: 'Ziele verfügbar',
    confirmMoveBtn: 'Verschieben bestätigen',

    // QR Scanner Modal
    qrScannerTitle: 'Optischer Barcode- & QR-Scanner',
    scanZone: 'SCAN_ZONE',
    containerIdentified: 'BEHÄLTER ERKANNT',
    openContainerBtn: 'Behälter öffnen',
    addItemBtn: 'Teil hinzufügen',
    manualInput: 'Manuelle Code-Eingabe',
    returnToCamera: 'Zurück zur Kamera',
    scanFile: 'Datei scannen',
    lookup: 'Suchen',
    manualPlaceholder: 'z.B. shelfmap://c/drawer-2 oder Box-ID',
    noContainerForCode: 'Kein Behälter gefunden für Code',
    cameraPermissionError: 'Kamera konnte nicht gestartet werden. Bitte Berechtigungen prüfen.',
    noQrInImage: 'Kein Barcode oder QR-Code im Bild erkannt.',

    // QR Print Modal
    printLabelsTitle: 'Haftetiketten drucken',
    includeSubBins: 'Untergeordnete Behälter einbeziehen',
    printLabelsBtn: 'Etiketten drucken',
    partsBinHeader: 'SHELFMAP // TEILEBOX',

    // Search View
    searchPlaceholderFull: 'Bauteile, ICs, Sensoren, Schrauben oder Boxen suchen...',
    searchGuideText: 'Geben Sie Name, Spezifikation oder Box-ID ein.',
    noSearchResults: 'Keine Treffer für',
    itemsAndParts: 'Bauteile & Artikel',
    containersAndBins: 'Behälter & Fächer',
    allCategories: 'Alle Kategorien',

    // Settings Modal
    settingsTitle: 'Werkstatteinstellungen',
    settingsSubtitle: 'Konfiguration, Design & Cloud-Sync',
    tabPreferences: 'Einstellungen',
    tabByos: 'BYOS Supabase',
    tabSql: 'SQL-Schema',
    tabData: 'Backup & Daten',
    
    // Preferences Tab
    appearanceTitle: 'Erscheinungsbild & Design',
    themeSystem: 'Systemstandard',
    themeSystemDesc: 'Aussehen an das Betriebssystem anpassen',
    themeDark: 'Dunkelmodus',
    themeDarkDesc: 'Carbon-Werkstatt mit bernsteinfarbenen Werkzeug-Akzenten',
    themeLight: 'Hellmodus',
    themeLightDesc: 'Sauberes Konstruktionspapier mit hohem Kontrast',
    languageTitle: 'Sprache',

    // BYOS Tab
    byosZeroTelemetry: 'Keine Telemetrie: ShelfMap läuft vollständig clientseitig. Verbinden Sie Ihr eigenes kostenloses Supabase-Projekt oder bleiben Sie im Offline-Modus.',
    localOfflineMode: 'Lokaler Offline-Speicher',
    localOfflineDesc: 'Inventar nur im Browser-Speicher ohne Cloud sichern',
    supabaseUrl: 'Supabase Project URL',
    supabaseKey: 'Supabase Anon / Public API Key',
    testConnection: 'Verbindung testen',
    saveConfigBtn: 'Konfiguration speichern',
    connectionSuccess: 'Supabase-Verbindung und Schema verifiziert.',
    fillCredentials: 'Bitte Project URL und Public Anon Key angeben.',

    // SQL Tab
    sqlNotice: 'Erstellt Tabellen containers, items und den workshop-images Bucket:',
    copySqlBtn: 'SQL kopieren',
    sqlStep1: 'Klicken Sie oben auf SQL kopieren.',
    sqlStep2: 'Öffnen Sie den Supabase SQL Editor.',
    sqlStep3: 'Code einfügen und Run ausführen.',

    // Backup Tab
    backupSectionTitle: 'Inventar-Snapshot Export / Import',
    backupSectionDesc: 'Exportieren Sie Ihre gesamte Werkstattstruktur in eine portable JSON-Datei.',
    downloadBackup: 'JSON-Backup herunterladen',
    restoreBackup: 'JSON-Backup wiederherstellen',
    sampleDataTitle: 'Musterdaten laden',
    sampleDataDesc: 'Lädt Musterdaten mit ESP32, TS100 Lötkolben, Messschieber und M3 Schrauben.',
    loadSampleDataBtn: 'Musterdaten laden',
    confirmSampleData: 'Möchten Sie das lokale Inventar durch Maker-Musterdaten ersetzen?',
    backupSuccess: 'Inventar erfolgreich wiederhergestellt.',
    backupInvalid: 'Ungültiges Backup-Dateiformat.',

    // Image Preview
    inspectionView: 'Detailansicht:',

    // Banner
    demoBannerTitle: 'LOKALER OFFLINE-MODUS:',
    demoBannerDesc: 'Inventar wird lokal im Browser gespeichert. Verbinden Sie Supabase für geräteübergreifenden Abgleich.',
    connectSupabaseBtn: 'Supabase verbinden',

    // Mobile Dock
    dockHome: 'Lager',
    dockSearch: 'Suche',
    dockScan: 'QR Scan',
    dockAdd: 'Neu',
    dockSettings: 'Optionen',

    // Confirm dialogs
    confirmDeleteItem: 'Möchten Sie diesen Artikel wirklich löschen:',
    confirmDeleteContainer: 'Möchten Sie diesen Behälter wirklich löschen:',
    confirmDeleteContainerSub: 'zusammen mit allen enthaltenen Boxen und Teilen?',

    // Categories
    categories: {
      all: 'Alle',
      Microcontroller: 'Mikrocontroller',
      Tool: 'Werkzeug',
      Fastener: 'Schrauben & Eisenwaren',
      Sensor: 'Sensor',
      Module: 'Modul & Board',
      Component: 'Bauteil',
      Passive: 'Passives Element',
      Wire: 'Kabel & Draht',
      Other: 'Sonstiges',
    }
  },

  fr: {
    // Common
    cancel: 'Annuler',
    save: 'Enregistrer',
    delete: 'Supprimer',
    confirm: 'Confirmer',
    close: 'Fermer',
    edit: 'Modifier',
    copy: 'Copier',
    copied: 'Copié !',
    move: 'Déplacer',
    search: 'Rechercher',
    add: 'Ajouter',
    open: 'Ouvrir',
    back: 'Retour',
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    all: 'Tous',
    root: 'RACINE / Atelier Principal',
    location: 'Emplacement',
    path: 'Chemin',

    // Navbar
    searchPrompt: 'Rechercher composants, boîtes (/)...',
    newContainer: 'Nouvelle Boîte',
    newItem: 'Nouvelle Pièce',
    quickAdd: 'Ajout Rapide',
    byosOnline: 'BYOS EN LIGNE',
    localDemo: 'DÉMO LOCALE',

    // Sections
    primaryLocations: 'Emplacements Principaux',
    subContainers: 'Sous-Bacs & Tiroirs',
    itemsInContainer: 'Pièces dans',
    unassignedItems: 'Niveau Racine / Pièces non assignées',
    nestedBinsCount: 'sous-bacs',
    itemsCount: 'pièces',
    noContainersHere: 'Aucun sous-conteneur dans cet emplacement.',
    noItemsHere: 'Aucune pièce stockée ici pour le moment.',
    createFirstContainer: 'Créer le premier sous-bac',
    createFirstItem: 'Ajouter la première pièce',

    // Container Modal
    newContainerTitle: 'Nouveau Bac de Rangement',
    editContainerTitle: 'Modifier le Bac de Rangement',
    containerName: 'Nom du Bac',
    containerNamePlaceholder: 'Ex: Étagère A, Tiroir 2, Mallette Bleue',
    parentLocation: 'Emplacement Parent',
    containerDescription: 'Description / Notes',
    containerDescPlaceholder: 'Dimensions, étagère ou caractéristiques...',
    customQrCode: 'Code-barres / QR Code personnalisé',
    customQrPlaceholder: 'Généré automatiquement si vide',
    saveContainerBtn: 'Enregistrer le Bac',

    // Item Modal
    newItemTitle: 'Enregistrer une Nouvelle Pièce',
    editItemTitle: 'Modifier la Pièce',
    itemName: 'Nom de la Pièce / Objet',
    itemNamePlaceholder: 'Ex: ESP32-WROOM-32, Panne TS100, Vis M3x10',
    itemCategory: 'Catégorie',
    itemQuantity: 'Quantité en Stock',
    itemContainer: 'Bac de Rangement',
    itemNotes: 'Notes, Broches & Spécifications',
    itemNotesPlaceholder: 'Détails du brochage, tolérance, fournisseur...',
    itemPhoto: 'Photo de la Pièce',
    tapToPhoto: 'Appuyez pour photographier ou choisir une image',
    changePhoto: 'Changer la photo',
    removePhoto: 'Supprimer la photo',
    saveItemBtn: 'Enregistrer la Pièce',

    // Move Modal
    relocateTitleItem: 'Déplacer la Pièce',
    relocateTitleContainer: 'Déplacer le Bac',
    selectDestination: 'Sélectionner la Destination',
    targetsAvailable: 'destinations disponibles',
    confirmMoveBtn: 'Confirmer le Déplacement',

    // QR Scanner Modal
    qrScannerTitle: 'Scanner Optique QR & Code-barres',
    scanZone: 'ZONE_SCAN',
    containerIdentified: 'BAC IDENTIFIÉ',
    openContainerBtn: 'Ouvrir le Bac',
    addItemBtn: 'Ajouter une Pièce',
    manualInput: 'Saisie Manuelle de Code',
    returnToCamera: 'Retour à la Caméra',
    scanFile: 'Scanner un Fichier',
    lookup: 'Rechercher',
    manualPlaceholder: 'Ex: shelfmap://c/drawer-2 ou ID du bac',
    noContainerForCode: 'Aucun bac trouvé pour le code',
    cameraPermissionError: 'Impossible d\'accéder à la caméra. Vérifiez les autorisations.',
    noQrInImage: 'Aucun code détecté dans l\'image.',

    // QR Print Modal
    printLabelsTitle: 'Imprimer des Étiquettes Adhésives',
    includeSubBins: 'Inclure les sous-bacs',
    printLabelsBtn: 'Imprimer les Étiquettes',
    partsBinHeader: 'SHELFMAP // BAC À PIÈCES',

    // Search View
    searchPlaceholderFull: 'Rechercher pièces, composants, vis ou boîtes...',
    searchGuideText: 'Saisissez le nom d\'une pièce, d\'une valeur ou d\'un bac.',
    noSearchResults: 'Aucun résultat correspondant pour',
    itemsAndParts: 'Pièces & Composants',
    containersAndBins: 'Bacs & Rangement',
    allCategories: 'Toutes Catégories',

    // Settings Modal
    settingsTitle: 'Paramètres de l\'Atelier',
    settingsSubtitle: 'Configuration, Thème et Synchronisation',
    tabPreferences: 'Préférences',
    tabByos: 'BYOS Supabase',
    tabSql: 'Schéma SQL',
    tabData: 'Sauvegarde & Données',
    
    // Preferences Tab
    appearanceTitle: 'Apparence & Thème',
    themeSystem: 'Système par Défaut',
    themeSystemDesc: 'Suivre l\'apparence du système d\'exploitation',
    themeDark: 'Mode Sombre',
    themeDarkDesc: 'Atelier carbone avec accents ambrés',
    themeLight: 'Mode Clair',
    themeLightDesc: 'Papier technique clair à fort contraste',
    languageTitle: 'Langue de l\'Interface',

    // BYOS Tab
    byosZeroTelemetry: 'Zéro Télémétrie : ShelfMap fonctionne entièrement côté client. Renseignez vos identifiants Supabase gratuits pour synchroniser ou restez en mode hors ligne.',
    localOfflineMode: 'Stockage Local Hors Ligne',
    localOfflineDesc: 'Conserver les données dans le navigateur sans cloud',
    supabaseUrl: 'Supabase Project URL',
    supabaseKey: 'Supabase Anon / Public API Key',
    testConnection: 'Tester la Connexion',
    saveConfigBtn: 'Enregistrer la Configuration',
    connectionSuccess: 'Connexion Supabase et schéma vérifiés.',
    fillCredentials: 'Veuillez saisir l\'URL et la clé anonyme.',

    // SQL Tab
    sqlNotice: 'Crée les tables containers, items et le bucket workshop-images :',
    copySqlBtn: 'Copier le SQL',
    sqlStep1: 'Cliquez sur Copier le SQL ci-dessus.',
    sqlStep2: 'Ouvrez l\'éditeur SQL dans votre console Supabase.',
    sqlStep3: 'Collez le code et cliquez sur Run.',

    // Backup Tab
    backupSectionTitle: 'Export / Import de Sauvegarde',
    backupSectionDesc: 'Exportez toute la structure de votre atelier dans un fichier JSON.',
    downloadBackup: 'Télécharger la Sauvegarde JSON',
    restoreBackup: 'Restaurer la Sauvegarde JSON',
    sampleDataTitle: 'Recharger les Données Démo',
    sampleDataDesc: 'Remplit l\'inventaire avec ESP32, fer TS100, pied à coulisse et vis M3.',
    loadSampleDataBtn: 'Charger les Données Démo',
    confirmSampleData: 'Remplacer l\'inventaire actuel par les données de démonstration ?',
    backupSuccess: 'Sauvegarde restaurée avec succès.',
    backupInvalid: 'Format de fichier de sauvegarde invalide.',

    // Image Preview
    inspectionView: 'Aperçu Découverte :',

    // Banner
    demoBannerTitle: 'STOCKAGE LOCAL HORS LIGNE :',
    demoBannerDesc: 'Vos pièces sont stockées dans ce navigateur. Connectez votre Supabase pour synchroniser entre appareils.',
    connectSupabaseBtn: 'Connecter Supabase',

    // Mobile Dock
    dockHome: 'Atelier',
    dockSearch: 'Chercher',
    dockScan: 'Scanner',
    dockAdd: 'Ajouter',
    dockSettings: 'Réglages',

    // Confirm dialogs
    confirmDeleteItem: 'Voulez-vous vraiment supprimer la pièce :',
    confirmDeleteContainer: 'Voulez-vous vraiment supprimer le bac :',
    confirmDeleteContainerSub: 'ainsi que tous les sous-bacs et pièces qu\'il contient ?',

    // Categories
    categories: {
      all: 'Tous',
      Microcontroller: 'Microcontrôleur',
      Tool: 'Outil',
      Fastener: 'Visserie & Fixation',
      Sensor: 'Capteur',
      Module: 'Module & Carte',
      Component: 'Composant',
      Passive: 'Composant Passif',
      Wire: 'Câble & Filaire',
      Other: 'Autre',
    }
  },

  es: {
    // Common
    cancel: 'Cancelar',
    save: 'Guardar',
    delete: 'Eliminar',
    confirm: 'Confirmar',
    close: 'Cerrar',
    edit: 'Editar',
    copy: 'Copiar',
    copied: '¡Copiado!',
    move: 'Reubicar',
    search: 'Buscar',
    add: 'Añadir',
    open: 'Abrir',
    back: 'Volver',
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    all: 'Todos',
    root: 'RAÍZ / Taller Principal',
    location: 'Ubicación',
    path: 'Ruta',

    // Navbar
    searchPrompt: 'Buscar piezas, integrados, cajas (/)...',
    newContainer: 'Nueva Caja',
    newItem: 'Nueva Pieza',
    quickAdd: 'Añadir Rápido',
    byosOnline: 'BYOS EN LÍNEA',
    localDemo: 'DEMO LOCAL',

    // Sections
    primaryLocations: 'Ubicaciones Principales',
    subContainers: 'Subcajas y Cajones',
    itemsInContainer: 'Piezas en',
    unassignedItems: 'Nivel Raíz / Piezas no asignadas',
    nestedBinsCount: 'subcajas',
    itemsCount: 'piezas',
    noContainersHere: 'Aún no hay subcajas en esta ubicación.',
    noItemsHere: 'No hay piezas almacenadas aquí todavía.',
    createFirstContainer: 'Crear Primera Subcaja',
    createFirstItem: 'Almacenar Primera Pieza',

    // Container Modal
    newContainerTitle: 'Nueva Caja de Almacenaje',
    editContainerTitle: 'Editar Caja de Almacenaje',
    containerName: 'Nombre de la Caja',
    containerNamePlaceholder: 'Ej: Estante A, Cajón 2, Maletín Azul',
    parentLocation: 'Ubicación Superior (Contenedor)',
    containerDescription: 'Descripción / Notas',
    containerDescPlaceholder: 'Dimensiones, balda o características físicas...',
    customQrCode: 'Código de Barras / QR Personalizado',
    customQrPlaceholder: 'Se genera automáticamente si se deja vacío',
    saveContainerBtn: 'Guardar Caja',

    // Item Modal
    newItemTitle: 'Registrar Nueva Pieza',
    editItemTitle: 'Editar Detalles de la Pieza',
    itemName: 'Nombre de la Pieza / Artículo',
    itemNamePlaceholder: 'Ej: ESP32-WROOM-32, Punta Soldador TS100, Tornillo M3x10',
    itemCategory: 'Categoría',
    itemQuantity: 'Cantidad en Stock',
    itemContainer: 'Caja de Almacenaje',
    itemNotes: 'Notas, Pines y Especificaciones',
    itemNotesPlaceholder: 'Pinouts, valores de componente, tolerancia, proveedor...',
    itemPhoto: 'Foto de la Pieza',
    tapToPhoto: 'Toque para tomar foto o elegir imagen',
    changePhoto: 'Cambiar foto',
    removePhoto: 'Eliminar foto',
    saveItemBtn: 'Guardar Pieza',

    // Move Modal
    relocateTitleItem: 'Reubicar Pieza',
    relocateTitleContainer: 'Reubicar Caja',
    selectDestination: 'Seleccionar Destino',
    targetsAvailable: 'destinos disponibles',
    confirmMoveBtn: 'Confirmar Reubicación',

    // QR Scanner Modal
    qrScannerTitle: 'Escáner Óptico de Barras y QR',
    scanZone: 'ZONA_ESCANEO',
    containerIdentified: 'CAJA IDENTIFICADA',
    openContainerBtn: 'Abrir Caja',
    addItemBtn: 'Añadir Pieza',
    manualInput: 'Entrada Manual de Código',
    returnToCamera: 'Volver a la Cámara',
    scanFile: 'Escanear Archivo',
    lookup: 'Buscar',
    manualPlaceholder: 'Ej: shelfmap://c/drawer-2 o ID de caja',
    noContainerForCode: 'Ninguna caja indexada con el código',
    cameraPermissionError: 'No se pudo iniciar la cámara. Verifique los permisos.',
    noQrInImage: 'No se detectó ningún código en la imagen.',

    // QR Print Modal
    printLabelsTitle: 'Imprimir Etiquetas Adhesivas',
    includeSubBins: 'Incluir subcajas secundarias',
    printLabelsBtn: 'Imprimir Etiquetas',
    partsBinHeader: 'SHELFMAP // CAJA DE PIEZAS',

    // Search View
    searchPlaceholderFull: 'Buscar componentes, integrados, tornillos o cajas...',
    searchGuideText: 'Escriba nombre, especificación o caja para buscar en el índice.',
    noSearchResults: 'No hay coincidencias para',
    itemsAndParts: 'Piezas y Componentes',
    containersAndBins: 'Cajas y Almacenaje',
    allCategories: 'Todas las Categorías',

    // Settings Modal
    settingsTitle: 'Ajustes del Taller',
    settingsSubtitle: 'Configuración, Tema y Sincronización',
    tabPreferences: 'Preferencias',
    tabByos: 'BYOS Supabase',
    tabSql: 'Esquema SQL',
    tabData: 'Copia & Datos',
    
    // Preferences Tab
    appearanceTitle: 'Apariencia y Tema',
    themeSystem: 'Predeterminado del Sistema',
    themeSystemDesc: 'Seguir la apariencia del sistema operativo',
    themeDark: 'Modo Oscuro',
    themeDarkDesc: 'Taller de carbono con acentos ámbar',
    themeLight: 'Modo Claro',
    themeLightDesc: 'Plano técnico claro con alto contraste',
    languageTitle: 'Idioma de la Interfaz',

    // BYOS Tab
    byosZeroTelemetry: 'Cero Telemetría: ShelfMap funciona 100% en el cliente. Ingrese sus credenciales de Supabase gratuitas para sincronizar o mantenga el Modo Sin Conexión.',
    localOfflineMode: 'Almacenamiento Local Offline',
    localOfflineDesc: 'Guardar inventario solo en el navegador sin nube',
    supabaseUrl: 'Supabase Project URL',
    supabaseKey: 'Supabase Anon / Public API Key',
    testConnection: 'Probar Conexión',
    saveConfigBtn: 'Guardar Configuración',
    connectionSuccess: 'Conexión y esquema de Supabase verificados.',
    fillCredentials: 'Por favor ingrese la Project URL y la Public Anon Key.',

    // SQL Tab
    sqlNotice: 'Crea las tablas containers, items y el bucket workshop-images:',
    copySqlBtn: 'Copiar SQL',
    sqlStep1: 'Haga clic en Copiar SQL arriba.',
    sqlStep2: 'Abra el editor SQL en su consola de Supabase.',
    sqlStep3: 'Pegue el código y haga clic en Run.',

    // Backup Tab
    backupSectionTitle: 'Exportar / Importar Copia de Seguridad',
    backupSectionDesc: 'Exporte la estructura de su taller en un archivo JSON portátil.',
    downloadBackup: 'Descargar Copia JSON',
    restoreBackup: 'Restaurar Copia JSON',
    sampleDataTitle: 'Restaurar Datos de Muestra',
    sampleDataDesc: 'Rellena el taller con ESP32, soldador TS100, calibre y tornillos M3.',
    loadSampleDataBtn: 'Cargar Datos Demo',
    confirmSampleData: '¿Desea reemplazar el inventario local por datos de muestra?',
    backupSuccess: 'Copia de seguridad restaurada con éxito.',
    backupInvalid: 'Formato de archivo de respaldo no válido.',

    // Image Preview
    inspectionView: 'Inspección:',

    // Banner
    demoBannerTitle: 'ALMACENAMIENTO LOCAL OFFLINE:',
    demoBannerDesc: 'El inventario se almacena en este navegador. Conecte Supabase para sincronizar entre sus dispositivos.',
    connectSupabaseBtn: 'Conectar Supabase',

    // Mobile Dock
    dockHome: 'Taller',
    dockSearch: 'Buscar',
    dockScan: 'Escanear',
    dockAdd: 'Nuevo',
    dockSettings: 'Ajustes',

    // Confirm dialogs
    confirmDeleteItem: '¿Seguro que desea eliminar la pieza:',
    confirmDeleteContainer: '¿Seguro que desea eliminar la caja:',
    confirmDeleteContainerSub: 'junto con todas sus subcajas y piezas?',

    // Categories
    categories: {
      all: 'Todos',
      Microcontroller: 'Microcontrolador',
      Tool: 'Herramienta',
      Fastener: 'Tornillería y Fijación',
      Sensor: 'Sensor',
      Module: 'Módulo y Placa',
      Component: 'Componente',
      Passive: 'Elemento Pasivo',
      Wire: 'Cableado y Conexión',
      Other: 'Otro',
    }
  }
} as const

export type TranslationKey = keyof typeof translations.en

interface I18nContextType {
  lang: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => string
  categoryName: (cat: string) => string
}

const I18nContext = createContext<I18nContextType | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('shelfmap_language') as Language
    if (saved && ['en', 'tr', 'de', 'fr', 'es'].includes(saved)) {
      return saved
    }
    const nav = navigator.language?.toLowerCase() || ''
    if (nav.startsWith('tr')) return 'tr'
    if (nav.startsWith('de')) return 'de'
    if (nav.startsWith('fr')) return 'fr'
    if (nav.startsWith('es')) return 'es'
    return 'en'
  })

  useEffect(() => {
    localStorage.setItem('shelfmap_language', lang)
    document.documentElement.lang = lang
  }, [lang])

  const setLanguage = (newLang: Language) => {
    setLangState(newLang)
  }

  const t = (key: TranslationKey): string => {
    const dict = translations[lang] || translations.en
    const val = (dict as Record<string, unknown>)[key]
    if (typeof val === 'string') return val
    const fallbackVal = (translations.en as Record<string, unknown>)[key]
    return typeof fallbackVal === 'string' ? fallbackVal : key
  }

  const categoryName = (cat: string): string => {
    const dict = translations[lang] || translations.en
    const catMap = dict.categories as Record<string, string>
    return catMap[cat] || (translations.en.categories as Record<string, string>)[cat] || cat
  }

  return createElement(
    I18nContext.Provider,
    { value: { lang, setLanguage, t, categoryName } },
    children
  )
}

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}
