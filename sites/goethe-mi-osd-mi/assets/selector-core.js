/* Transparent preference rules; this is not a validated assessment. */
(function (root) {
  'use strict';
  const questions = [
    {title:'Görseller öğrenmeni nasıl etkiler?',options:[['visual','Anlamı görselle eşleştirince daha rahatım.'],['neutral','Metinle veya görselle benzer rahatlıktayım.']]},
    {title:'Dinlediğini ikinci kez duymak senin için ne kadar önemli?',options:[['repeat','Ayrıntıları kontrol etmek için önemli.'],['neutral','Tek dinlemeye de çalışabilirim.']]},
    {title:'Konuşmaya nasıl başlamak istersin?',options:[['choice','Konuyu seçenekler arasından kendim seçerek.'],['structure','Önceden belirlenmiş kısa görevle.']]},
    {title:'Hangi görev akışı sana daha yakın?',options:[['structure','Kısa ve sınırları belli soru-cevap.'],['neutral','Açık uçlu ve kısa görevlerde benzer rahatlıktayım.']]},
    {title:'Hangisini yapmak daha rahat geliyor?',options:[['visual','Seçtiğim fotoğrafı birkaç cümleyle anlatmak.'],['structure','Bir kart üzerinden soru sorup yanıtlamak.']]}
  ];
  function evaluate(answers) {
    if(answers.length!==questions.length || answers.some((v,i)=>!questions[i].options.some(o=>o[0]===v))) throw new Error('Beş geçerli yanıt gerekli.');
    const visual=answers.filter(x=>x==='visual'||x==='choice').length;
    const structure=answers.filter(x=>x==='structure'||x==='repeat').length;
    const key=visual>structure?'visual':structure>visual?'structured':'balanced';
    const records={
      visual:{title:'ÖSD’nin görsel ve seçimli görevlerini önce dene.',copy:'Tercihlerin, ÖSD’nin bazı görsel eşleştirme ve seçimli konuşma görevleriyle örtüşüyor. Gerçek bir model üzerinde bunu deneyerek kontrol et.'},
      structured:{title:'Goethe’nin yapılandırılmış görevlerini önce dene.',copy:'Tercihlerin, kısa soru-cevap akışı veya yeniden dinleme desteğine yakın. Goethe modelindeki ilgili görevleri deneyerek başlayabilirsin.'},
      balanced:{title:'İki formatı da deneyerek karar ver.',copy:'Yanıtların tek bir görev biçimine güçlü biçimde yönelmiyor. Aynı gün iki modelden birer okuma, dinleme ve konuşma görevi dene; nerede daha rahat olduğunu karşılaştır.'}
    };
    const reasons=[];
    if(answers[0]==='visual') reasons.push('Görselle anlam eşleştirmeyi seçtin: ÖSD Lesen Aufgabe 3 bu desteği sunar.');
    if(answers[1]==='repeat') reasons.push('Tekrar duymak önemli: Goethe Hören Teil 1 ve 3 iki kez dinletilir.');
    if(answers[2]==='choice') reasons.push('Konu seçmek istiyorsun: ÖSD Sprechen Aufgabe 1’de altı konudan dördünü seçersin.');
    if(answers[2]==='structure'||answers[3]==='structure'||answers[4]==='structure') reasons.push('Yapılandırılmış konuşmayı tercih ettin: Goethe’nin kartla soru-cevap görevini dene.');
    if(answers[4]==='visual') reasons.push('Fotoğraf anlatmayı seçtin: ÖSD Sprechen Aufgabe 2’de üç görselden biri seçilir.');
    if(!reasons.length) reasons.push('Belirgin bir görsel veya yapı tercihi belirtmedin; gerçek görev deneyimi daha açıklayıcı olabilir.');
    return {key,...records[key],reasons,caution:'Bu rehber dil seviyesini veya başarı olasılığını ölçmez. ÖSD’de tek dinleme ve serbest konuşma; Goethe’de ayrıntı kontrolü ve kartla etkileşim ayrıca çalışılmalıdır.'};
  }
  root.AYDASelector={questions,evaluate};
  if(typeof module!=='undefined') module.exports=root.AYDASelector;
})(typeof window!=='undefined'?window:globalThis);
