# AYDA UI 2026 — G4 Kütüphane Tasarım Sistemi

Durum: G4 / adım 1. Sadece g4-preview/index.html. WordPress canlı sayfası ve GitHub kök index.html DEĞİŞMEDİ.

## Sabit kurumsal renkler
AYDA lacivert: #102541 | derin lacivert: #0B1B31 | altın: #E8C37B | krem: #FBF9F5 | beyaz: #FFFFFF | metin: #172B46 | açıklama: #65758B.
Inter ve sistem fontları; 10–15 px köşe yarıçapı; 43–53 px dokunma alanları; altın odak çizgisi; dikkat dağıtmayan gölgeler.

## Mobil akış (900 px ve altı)
1. Kısa ve sabit AYDA başlığı; kompakt giriş ekranı.
2. Arama, tek satır yana kaydırılabilir seviyeler, açılır kaynak türü filtreleri, favoriler, kaynak kartları.
3. Kaynak seçince tam ekran okuma paneli; geri, favori ve bağlantı eylemleri.
4. 360 px–430 px aralığında yatay sayfa taşması olmamalıdır.

## Masaüstü akış (901 px ve üstü)
Sol filtreler; orta kaynak listesi; sağ büyük belge okuma alanı. Kısa üst bilgi, bağımsız kaydırılabilir liste.

## İçerik koruma ve onay koşulu
Mevcut 52 kaynak etiketleri, URL'ler, A1/A2/B1/B2/Sınav kategorileri, arama, favoriler ve aynı sayfada görüntüleme mantığı korunacaktır.
Bu önizlemede gerçek sınıf şifre sistemi çalıştırılmaz ve belgelerin bağlantıları devre dışıdır. Demo favorileri ayda_library_favorites_g4_preview_v1 ile ayrılmıştır.
Gerçek yayın yalnızca kullanıcı G4-2 GO onayı verirse yapılacaktır; o aşamada demo kipi kaldırılacak ve orijinal merkezi erişim ve belge iframe işlevleri korunacaktır.
G5 sınav hazırlık platformu ayrı ele alınacaktır.