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
GitHub deposunun `main` dalı Vercel'e bağlanır. Her push otomatik prod dağıtımına dönüşür.
Cloudflare'da `ders` CNAME kaydı Vercel'in proje alan adı yönergesine göre daha sonra yapılır; DNS yapılandırması tamamlanmadan `ders.aydadil.com` hazır sayılmaz.

## Geçiş sırası
1. Merkezi şifre doğrulama servisini ve oturum yönetimini incele.
2. Yetkili sunucu uç noktası üzerinden giriş bağla.
3. Öğrenci modüllerini birer birer taşı, içeriklerini ve ilerlemeyi test et.
4. Öğretmen sisteminden öğrenciye özel ders/ödev görüntüleme için erişim katmanı kur.
5. Eski URL'lere yönlendirme ekle, canlı bağlantıları doğrula.
