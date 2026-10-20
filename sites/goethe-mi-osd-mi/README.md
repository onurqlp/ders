# AYDA — Goethe mi, ÖSD mi?

Çalışan site: https://onurqlp.github.io/goethe-mi-osd-mi/

## Yükleme — bu sürümde derleme gerekmez

1. ZIP'i bilgisayarında çıkar.
2. ZIP içindeki **index.html**, **assets** klasörü ve diğer dosyaları `goethe-mi-osd-mi` deposunun ana dizinine yükle. Dosyaları ZIP adıyla bir alt klasöre koyma. Aynı isimli dosyaları güncelle.
3. **Settings → Pages → Source: Deploy from a branch → Branch: main → /(root) → Save** seç. Ana dalın adı master ise master seç.
4. Pages yayını tamamlandığında siteyi aç ve Ctrl+F5 ile yenile.

Depo ana ekranında README.md ile aynı seviyede **index.html** görünmelidir. Tasarım bu dosyadan açılır. `dist` klasörünü seçmek veya Node kurmak gerekmez.

GitHub Actions kullanıyorsan bu paketteki `.github/workflows/pages.yml` dosyasını da eski dosyanın yerine yükle. Yeni workflow hazır kök dosyalarını yayınlar; önceki derleme iş akışına ihtiyaç duymaz. İki yöntemi birlikte ayarlamana gerek yok.

## İçerik

AYDA V5 arayüzü ve gerçek logo; 11 görev karşılaştırması, 8 SSS, format seçici ve görsel büyütme. AYDA kodundaki gerçek kurs sistemi demosu, sınav hazırlık platformu, kütüphane ve program/fiyat CTA'ları eklendi.

Canonical, paylaşım ve sosyal görsel URL'leri mevcut `https://onurqlp.github.io/goethe-mi-osd-mi/` adresine göre hazırlandı. Yerel açılış için index.html dosyasına çift tıklanabilir.

Analitik ve reklam kimlikleri verilmediği için bu servisler kapalıdır. Seviye testi tam deneme sınavı olarak adlandırılmaz. Arama motoru indekslemesi önceki sürümdeki gibi kapalıdır. İndeksleme açılacaksa iki HTML dosyasındaki robots meta değeri ve robots.txt birlikte güncellenmelidir. Resmî kesitlerin yeniden yayınlama hakları ayrıca değerlendirilmelidir.

Bu paket hazırlanmıştır; GitHub hesabına uzaktan yükleme yapılmamıştır.
