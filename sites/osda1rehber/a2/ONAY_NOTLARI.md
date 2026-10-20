# AYDA ÖSD A2 · Onay Taslağı

**Durum:** İnceleme aşamasında. `main` dalı veya `osd.aydadil.com` yayını değiştirilmedi.

## İçerik
- ÖSD Zertifikat A2 (ZA2), 14 yaş ve üzeri sınavı; KID A2 değil.
- Lesen: 2 görev, 30 dk. Başlık eşleştirme ve metne göre A/B/C.
- Hören: 3 görev, yaklaşık 15 dk. Dört seçenek, not alma, konuşmacı tablosu.
- Schreiben: 1 görev, 30 dk. Yaklaşık 50 kelimelik kişisel e-posta.
- Sprechen: 2 görev, yaklaşık 10 dk. Altı konudan beşini anlatma, ortak etkinlik planlama. Hazırlık: 10 dk.
- Her görevde 7 açıklama alanı; örnek Almanca cümleler ve Türkçe açıklamalar, sınav stratejileri, hata/çözüm eşleştirmeleri.
- AYDA A1 tasarımı korunur. Kullanıcı ilerlemesi A1'den ayrı `osd-za2-guide-v1` anahtarıyla saklanır.
- Öğrenci bilgisi alınmaz; kaydedilen işaretler aynı tarayıcıyla sınırlıdır. YouTube yalnız düğmeyle yüklenir.

## Puanlama (resmî ZA2 Gesamtbogen 2026)
Lesen 25 / min 5, Hören 30 / min 6, Schreiben 15 / min 3; yazılı toplam 70 / min 35. Sprechen 20 / min 10. Alt sınırların tamamı gerekir.

## Kaynaklar
- ÖSD A2 sınav tanımı: https://osd.at/en/portfolio-item/osd-zertifikat-a2-za2/
- ZA2 Modellsatz: https://www.osd.at/wp-content/uploads/2023/07/ZA2-Modellsatz.pdf
- ÖSD Gesamtbogen v3.0 (2026): https://osd.at/wp-content/uploads/2026/08/ZA2-GB_Ver.3.0_05_06_26.pdf
- Resmî A2 konuşma örnek videosu: https://www.youtube.com/watch?v=z2aNdPQnbZM

## Test
`node --check a2/content.js`
`node --check a2/app.js`
`node a2/tests/smoke-test.js`

## Yayın onayı sonrası
`a2/` mevcut özel alan adında ayrı dizin olarak erişilebilir hâle getirilebilir; öğrenci A1/A2 seviye seçimi ana sayfaya entegre edilecek. Bu dal kullanıcı onayı olmadan `main` ile birleştirilmeyecek.

Not: A2 içindeki örnekler özgündür, resmî sınav soruları veya ses kayıtları değildir. Gerçek cihaz görsel testi ve çoklu tarayıcı testi, yayın onayından önce ayrıca yapılmalıdır.
