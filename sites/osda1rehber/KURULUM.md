# ÖSD A1 Sınav Rehberi

## Açma
ZIP paketini çıkarın, `index.html` dosyasını Chrome, Edge, Safari veya Firefox ile açın. Kurulum, paket yöneticisi, framework veya sunucu gerekmez. HTML, CSS ve Vanilla JavaScript kullanılır. Dosyaları aynı klasörde tutun.

## Yayınlama
Bu klasörün içindeki index.html, style.css, content.js ve app.js dosyalarını, assets klasörüyle birlikte statik hosting sağlayıcınızın yayın klasörüne yükleyin. Ana belge index.html olmalıdır. HTTPS tercih edin; öğrencilerle yayın adresini paylaşın. Yerel dosya yolu başkasının cihazında açılmaz. Bu teslimatta herkese açık bir site yayımlanmamıştır.

## Düzenleme
- content.js: Bölümler, 11 görevin içerikleri, Almanca/Türkçe örnekler ve kontrol listesi. Her görevde what, example, steps, think, tip, wrong, right, remember alanları bulunur.
- index.html: Giriş, sınav günü, puanlama ve kaynaklar.
- style.css: Renk, boyut ve mobil düzen.
- app.js: Görüntüleme, kopyalama, büyütme, video ve cihaz içi kayıt.

Her görev yedi başlıkla gösterilir; yanlış/doğru alanları birlikte altıncı başlıktadır. İçerikteki HTML yalnızca güvenilen öğretmen düzenlemeleri için tasarlanmıştır; kullanıcı girdisi alınmaz.

## Gizlilik ve çevrimdışı kullanım
Hesap, analiz, reklam, veri tabanı veya takip sistemi yoktur. localStorage yalnızca son görev ve kontrol listesini saklar. Gizli modda veya yerel dosya kullanımında tarayıcı kayıtları sınırlandırabilir. Bu durumda rehber çalışır, kalıcı kayıt sağlanamayabilir. Aynı dosyanın başka klasöre taşınması kayıtları taşımayabilir.

Video, kullanıcı düğmeye basınca YouTube bağlantısı kurar. Video ve kaynak bağlantıları internet ister. İndirilmiş metin, görseller ve diğer işlevler çevrimdışı çalışır. Yalnızca URL üzerinden ziyaret edilmiş sayfanın çevrimdışı tekrar açılması garanti edilmez; çevrimdışı kullanım için ZIP indirilmelidir.

`index.html` içindeki robots meta etiketi varsayılan olarak noindex,nofollow ayarlıdır. Arama motoru dizinine izin vermek için değiştirilebilir. noindex bir şifre veya erişim koruması değildir.

## Kaynak ve kapsam
Yalnızca ÖSD Zertifikat A1 (ZA1). Resmî sınav sayfası ve 2024 model kitapçığı 15 Ekim 2026 tarihinde kontrol edildi. Kaynak bağlantıları sayfanın altında yer alır. Tavsiyeler resmî kuraldan ayrıdır; fotoğraflar yapay zekâyla üretilmiş özgün öğretici örneklerdir. Sözlü video dökümü doğrulanamadı; video alıntısı veya zaman damgası üretilmedi.

## Temel kontrol
360, 375, 390 ve 430 piksel mobil genişlikleri ile masaüstü görünümü kontrol edilir. Gerçek iPhone/Android cihaz testi yerine tarayıcı görünüm testi kullanılır; gerçek cihazlarda son kontrol önerilir.

## Gezinme
Ana ekran dört bölüm sunar. Bölüm seçildikten sonra görev listesi açılır; bir ekranda yalnızca tek görevin içeriği görünür. Geri/sonraki ve ana sayfa bağlantılarıyla ilerlenir. Adresin # işaretinden sonraki kısmı doğrudan görev paylaşımı sağlar. 11 görevin yedi açıklama başlığı korunmuştur.

## Yapılan kontroller
360, 375, 390, 430 ve 1440 piksel genişliklerinde 22 görünümde yatay taşma kontrol edildi. Menü, tek görev gösterimi, ileri/geri, kopyalama, görsel büyütme, Escape ile kapatma, kontrol listesi kaydı, sıfırlama ve video yükleme kontrol edildi. Edge/Chromium tarayıcısı kullanıldı; gerçek telefon donanımı ve diğer tarayıcı motorları test edilmedi.

## AYDA arayüzü
Kullanıcının AYDA Ana Sayfa V5 dosyasındaki gerçek gömülü logo ve lacivert (#102541), koyu lacivert (#0b1b31), altın (#e8c37b), krem (#fbf7ef) renkleri kullanıldı. Logo assets/ayda-logo.png içindedir. Tek görevli gezinme korunur.
