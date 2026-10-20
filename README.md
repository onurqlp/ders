# AYDA Öğrenci Portalı

Kurumsal öğrenci başlangıç noktası: `ders.aydadil.com`

## İçerik
- Mobil ve masaüstü uyumlu ana sayfa
- A1, A2, B1, B2 ve C1 seviye seçimi
- AYDA sınav hazırlık, kütüphane, ders kitapları, sınav rehberleri ve kelime çalışması bağlantıları
- WhatsApp üzerinden kursa mesaj

## Mevcut durum
- Portal statik olarak yayınlanır; seviye seçimi yalnızca aynı sekmede oturum süresince hatırlanır.
- Bu seçim kimlik doğrulaması veya yetkilendirme değildir.
- **Merkezi AYDA şifre sistemi henüz entegre değildir.** Parolaları tarayıcı JS dosyalarına veya herkese açık repoya eklemeyin.
- Öğrenci ilerleme bilgileri için ayrı sunucu tarafı veri eşitlemesi gerekecektir.
- Mevcut eğitim uygulamaları şimdilik bağımsız adreslerine açılır; içerikleri henüz fiziksel olarak taşınmamıştır.

## Dağıtım
GitHub Pages için `.github/workflows/pages.yml` yayını hazırlanmıştır. **Settings → Pages → Build and deployment → Source: GitHub Actions** seçilmelidir. Sonrasında `main` dalına her push yeni yayını başlatır. Yayın adresi: `https://onurqlp.github.io/ders/` (Pages etkinleşince).
Cloudflare DNS daha sonra `ders.aydadil.com` adresine bağlanacaktır. DNS ve Pages özel alan adı ayarları tamamlanmadan bu adres hazır sayılmaz.

## Geçiş sırası
1. Merkezi şifre doğrulama servisini ve oturum yönetimini incele.
2. Yetkili sunucu uç noktası üzerinden giriş bağla.
3. Öğrenci modüllerini birer birer taşı, içeriklerini ve ilerlemeyi test et.
4. Öğretmen sisteminden öğrenciye özel ders/ödev görüntüleme için erişim katmanı kur.
5. Eski URL'lere yönlendirme ekle, canlı bağlantıları doğrula.
