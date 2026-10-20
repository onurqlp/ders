# AYDA Öğrenci Portalı

**Canlı giriş:** https://ders.aydadil.com/  
**Kaynak repo:** https://github.com/onurqlp/ders

Öğrencilerin A1, A2, B1, B2 ve C1 seviyelerinden öğrenme kaynaklarına, AYDA kütüphanesine, sınav hazırlığına ve ders kitaplarına ulaşması için hazırlanmış giriş sayfası.

## Güncel çalışma biçimi (20 Ekim 2026)

- Ana ekranda seviyeler şifre olmadan görülebilir; ilgili öğrenme kaynaklarına geçmek için AYDA merkezi sınıf kodu kullanılır.
- A1, A2, B1 öğrenme platformları ayrı WordPress/GitHub kaynaklarında çalışır. B2 ve C1 için portalda bağımsız bir ders modülü olmadığı için sınav hazırlığına yönlendirilir.
- AYDA kodlarının denetimi şu anda `onurqlp/ayda-pass` içindeki **istemci tarafı JavaScript ve JSON** üzerinden yapılır. Bu sistem sunucu tarafından doğrulanan güvenli bir SSO değildir.
- `ders.aydadil.com`, `www.aydadil.com` ve `onurqlp.github.io` farklı kökenlerdir. Tarayıcı `localStorage` oturumları bunlar arasında otomatik paylaşılmaz; bir sitede girişin yapılması diğer sitede yeniden doğrulama istenmeyeceğini **garanti etmez**.
- Portalda daha önceden kaydedilmiş AYDA kodu bulunuyorsa seviyeye geçişte `aydaAutoLogin()` ile süresi ve etkinliği yeniden kontrol edilir. Kod açıkça şifre listesi içinde doğrulanmadan oturum açılmış kabul edilmez.
- Öğrenci ilerlemeleri ders uygulamalarında çoğunlukla tarayıcıda tutulur. Bunlar çoklu cihaz senkronizasyonu veya sunucu yedeği değildir.
- Resmî öğrenci iletişim WhatsApp numarası: **+90 540 912 25 03**.

## Yayın

`.github/workflows/pages.yml` üzerinden GitHub Pages yayımlanır; GitHub Actions iş akışının **başarılı sonuçlanması** yalnızca Pages dağıtımının doğrulandığı anlamına gelir. `www.aydadil.com` altında bulunan sayfaların ayrıca `onurqlp/ayda-wordpress-sync` WordPress yayın akışları bulunur.

## Bakım ilkeleri

1. Ders içerikleri, soru/cevap verileri, öğrencinin ilerleme anahtarları ve mevcut AYDA parolaları onaysız biçimde dönüştürülmez.
2. A1/A2/B1, sınav, kütüphane ve ders kitapları kaynaklarına ait bağlantılar ayrı ayrı doğrulanır.
3. Yayın öncesi giriş, çıkış, sayfa yönlendirmeleri, mobil/masaüstü ve otomatik testler kontrol edilir.
4. Gerçek sunucu tabanlı tek oturum ve çoklu cihaz yedeklemesi için ayrı bir kimlik doğrulama/veri katmanı gerekir. Statik JavaScript ile çözülmüş gibi gösterilmez.
5. GitHub Pages canlı sürümü ile WordPress canlı kopyası aynı şey değildir; her birinin dağıtım sonuçları ayrıca doğrulanır.
