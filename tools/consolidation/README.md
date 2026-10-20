# AYDA Öğrenci Platformları — Tek Depo, Test Aşaması G0

**MERKEZ:** onurqlp/ders  
**ÇALIŞMA DALI:** consolidation/test-stage-01-20261020  
**CANLI DAL:** main (bu çalışma sırasında değiştirilmez)  
**DURUM:** Test/yapısal taşıma; kesinlikle canlı yayın değil.

## Mimari

- \`index.html\` ve mevcut \`main\` değişmeden kalır.
- \`sites/<orijinal-depo-adı>/\` her ayrı ders/sınav/kütüphane sitesinin tam, değiştirilmemiş kopyasını içerir.
- \`tools/consolidation/sources.json\` kaynak envanteri ve kategori haritasıdır.
- \`tools/consolidation/source-manifests/*.json\` her kaynak için aktarım commit'i, dosya sayısı, byte sayısı ve SHA-256 kayıtlarını tutar.
- \`tools/consolidation/verification-report.json\` aktarım sonrasında üretilen test sonucudur.
- Kaynak eğitim depoları geçiş süresince **silinmez**, değiştirilmez ve canlı adresleri etkilenmez.
- Öğretmen, yönetim, parola/erişim deposu ve WordPress üretim yayım yetkileri öğrenci içeriğine taşınmaz.
- İç içe kopyalanmış \`.github/workflows\` dosyaları ana depoda workflow olarak çalışmaz.

## Değişmez kurallar

1. Sorular, cevaplar, açıklamalar, videolar, PDF/görseller, alıştırmalar, konuşma görevleri, sesler ve tüm materyal bağlantıları korunur.
2. Kaynak aktarmak, sayfaların URL'sini otomatik değiştirmek veya şifre/oturum sistemini değiştirmek anlamına gelmez.
3. A1/A2/B1 kaynaklarının mevcut içerik bütünlüğü testleri ilk G0 tesliminde ayrı ayrı geçmelidir.
4. Canlıya dokunan \`main\`, WordPress script'leri ve diğer depoların Actions workflow'ları çalıştırılmaz.
5. Test/önizleme ve sonrasında her platformun onayı ayrı ayrı alınmadan \`main\`'e merge yapılmaz.
6. Her yeni adım öncekilerin onaylı durumunu referans alır. Test kaydı ve kaynak envanteri saklanır.
7. Daha sonraki tasarım değişikliklerinde girişteki kaynak dosyalarının SHA değerleri bir başlangıç kanıtıdır; görünüm dosyalarında ancak açıkça onaylanan değişiklikler yapılabilir.

## Aşamalar

- **G0.1** — 22 öğrenci odaklı depoyu \`sites/\` altında bağımsız, kayıpsız kopyala.
- **G0.2** — SHA-256/dosya sayısı bütünlüğü + A1/A2/B1 var olan testleri çalıştır.
- **G0.3** — Ayrı test yayını ve önizleme adresi oluştur; canlı \`main\`'e dokunma.
- **G1** — Merkezi portal görsel düzeni ve bağlantılar (önizleme/onay).
- **G2** — A1 (önizleme/onay).
- **G3** — A2 (önizleme/onay).
- **G4** — B1 (önizleme/onay).
- **G5** — Sınav ana merkezi (önizleme/onay).
- **G6.1** — A1 sınav alt sayfaları (önizleme/onay).
- **G6.2** — A2 sınav alt sayfaları (önizleme/onay).
- **G6.3** — B1/B2 sınav alt sayfaları (önizleme/onay).
- **G7** — Kütüphane (önizleme/onay).
- **G8** — Ders materyalleri (önizleme/onay).
- **G9** — Birleştirme/sistem çapında regresyon; yalnızca tüm onaylar alındığında canlı geçiş önerisi.

### Yerinde bırakılan altyapı

\`ayda-pass\`: Canlı erişim şifreleri ve bağımsız kimlik doğrulama davranışı; öğrenci içerik kopyasına eklenmez.  
\`ayda-wordpress-sync\`: WordPress yayın betikleri; test süresinde tetiklenmez. Canlı geçişte ayrıca kontrol edilir.

Bu belge test aşaması mutabakatı olup \`main\` üzerinde hiçbir dosya güncellemesi yapmaz.
