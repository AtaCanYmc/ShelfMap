# ShelfMap 🗄️⚡

> **Atölye ve Ev Eşyaları İçin Hiyerarşik Konteyner Haritası & Akıllı Envanter Takibi**  
> *Bring Your Own Supabase (BYOS) • PWA • QR Kod Entegrasyonu • Görsel Destekli Envanter*

Evdeki elektronik parçaları, ESP modellerini, sensörleri, el aletlerini ve vidaları ararken kaybolmaya son! **ShelfMap**, fiziksel saklama alanlarınızı (Odalar → Dolaplar → Çekmeceler → Alet Kutuları → Bölmeli Kutular) hiyerarşik olarak haritalayan ve eşyalarınızın tam konumunu anında gösteren modern bir Progressive Web App (PWA)'dir.

---

## ✨ Temel Özellikler

1. **İç İçe Konteyner Hiyerarşisi (Self-Referencing Nesting)**:
   - Sınırsız derinlikte hiyerarşik saklama mimarisi (`Oda > Dolap > 2. Çekmece > Mavi Kutu`).
   - Döngüsel hataları (cycle detection) engelleyen akıllı taşıma sistemi.
   - Her seviyede ekmek kırıntısı (**Breadcrumb**) navigasyonu.

2. **Bring Your Own Supabase (BYOS)**:
   - **Sıfır Sunucu Maliyeti & Tam Veri Mahremiyeti**: Verileriniz geliştiricinin sunucusunda değil, kendi ücretsiz Supabase hesabınızda durur.
   - Uygulama içinden tek tıkla SQL kurulum scripti kopyalama.
   - Supabase bağlantısı olmadan da anında denemek için dahili **Yerel Demo Modu** (LocalStorage).

3. **Görsel Odaklı Envanter (Fotoğraf & Kamera Desteği)**:
   - Kutuların dıştan fotoğrafı ve eşyaların yakından görseli ile görsel hafızayı devreye sokun.
   - PWA kamera entegrasyonu (`capture="environment"`).
   - **İstemci Taraflı Yerel Sıkıştırma (Native Canvas Compression)**: 10-15MB'lık telefon fotoğraflarını yüklemeden önce tarayıcıda ~150KB'a optimize eder.

4. **Fiziksel QR Kod & Barkod Sistemi**:
   - Her kutu veya çekmece için anında **yazdırılabilir QR etiketleri** üretin.
   - Telefon kamerasıyla kutunun üzerindeki QR kodu taratarak doğrudan o kutunun içine gidin veya içine hızlı eşya ekleyin.
   - Web Audio API ile taranma geri bildirimi (bip sesi).

5. **Anlık ve Konum Yollu Arama (Full Path Search)**:
   - Parça, kategori veya not bazlı canlı arama.
   - Arama sonuçlarında eşyanın sadece adı değil, `Atölye > Sağ Dolap > 2. Çekmece > Mavi Kutu` şeklinde **tam konum yolu** görüntülenir.

6. **PWA (Progressive Web App)**:
   - Mobilde ana ekrana eklenebilir, tam ekran yerel uygulama gibi çalışır.
   - Service Worker ve offline önbellekleme desteği.

---

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Node.js 18+ ve npm

### Kurulum ve Çalıştırma
```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

Tarayıcınızda `http://localhost:5173` adresine giderek ShelfMap'i anında kullanmaya başlayabilirsiniz. İlk açılışta hazır örnek Maker verileri (ESP32, TS100 Havya, Dijital Kumpas, M3 Vidalar vb.) otomatik olarak yüklenecektir.

---

## 🗄️ Supabase Kurulum Rehberi (BYOS)

ShelfMap'i kendi bulut veritabanınıza bağlamak için:

1. [Supabase](https://supabase.com) üzerinde ücretsiz yeni bir proje oluşturun.
2. ShelfMap uygulamasında sağ üstteki **Ayarlar (Dişli)** butonuna tıklayın ve **SQL Kurulum Kodu** sekmesine geçin.
3. **SQL'i Kopyala** butonuna basın.
4. Supabase panelinizde sol menüdeki **SQL Editor** kısmına gidin, kodu yapıştırın ve **Run** butonuna basın:
   - `containers` ve `items` tabloları,
   - İndeksler ve RLS politikaları,
   - `workshop-images` public storage bucket'ı otomatik olarak oluşturulacaktır.
5. Supabase Dashboard -> **Project Settings -> API** bölümünden:
   - **Project URL**
   - **anon / public key**
   bilgilerini kopyalayın ve ShelfMap Ayarlar ekranına girip **Kaydet**'e basın.

Artık tüm atölye envanteriniz kendi Supabase veritabanınızda güvenle saklanır!

---

## 🧪 Testler ve Doğrulama

Temel hiyerarşik yol çözümleyici (Breadcrumb path), döngü tespiti (cycle detection) ve arama motoru testlerini çalıştırmak için:

```bash
npm run test:core   # veya: npx tsx src/services/db.test.ts
npm run build       # Üretim derlemesi ve TypeScript doğrulaması
```

---

## 📦 Lisans
MIT License.
