/* AYDA Learning Enhancements v2 — progressively enhances the preserved B1 React bundle. */
(function(){
"use strict";
const units = [{"id":1,"title":"Ihr seid einfach die Besten!","topic":"İnsanları özellikleriyle anlatma","grammar":["Adjektive als Nomen","n-Deklination"]},{"id":2,"title":"Er erledigte seine Aufgaben zuverlässig.","topic":"İş deneyimini geçmişte anlatma","grammar":["Präteritum: düzenli, düzensiz ve karışık fiiller"]},{"id":3,"title":"Mein Beruf ist meine Leidenschaft.","topic":"Ev ve yaşam koşullarını ayrıntılı anlatma","grammar":["Relativsätze im Dativ","Relativsätze mit Präpositionen"]},{"id":4,"title":"Obwohl ich Ihnen das erklärt habe, ...","topic":"Müşteri hizmetlerinde sorun ve karşıtlık anlatma","grammar":["obwohl","trotzdem"]},{"id":5,"title":"Bald wird in fast jedem Haushalt ein PC stehen.","topic":"Teknoloji ve geleceğe ilişkin tahminler","grammar":["Futur I","Präsens + zaman ifadesi"]},{"id":6,"title":"Fühlen Sie sich wie zu Hause.","topic":"Davet ve sofra görgüsü","grammar":["falls"]},{"id":7,"title":"Kann ich Ihnen helfen?","topic":"Ürün danışmanlığı ve karar verme","grammar":["Infinitiv mit zu"]},{"id":8,"title":"Während andere lange nachdenken, ...","topic":"Güçlü yönler ve meslek seçimi","grammar":["da","bevor","während"]},{"id":9,"title":"Sport trägt zu einem größeren Wohlbefinden bei.","topic":"Sağlık ve karşılaştırma","grammar":["Komparativ/Superlativ sıfat çekimi"]},{"id":10,"title":"Hätte ich das bloß anders gemacht!","topic":"Pişmanlık ve kaçırılmış fırsatlar","grammar":["Konjunktiv II Vergangenheit"]},{"id":11,"title":"Nachdem wir jahrelang Pech gehabt hatten, ...","topic":"Geçmişte olayların sırası","grammar":["Plusquamperfekt","nachdem"]},{"id":12,"title":"Feiern im Büro?","topic":"İş yerinde etkinlik ve resmî yazışma","grammar":["Genitiv","Adjektivdeklination im Genitiv","trotz + Genitiv"]},{"id":13,"title":"Aus diesem Grund gab es ein Missverständnis.","topic":"Yanlış anlaşılmalar ve neden-sonuç","grammar":["darum/deswegen/daher","nämlich","wegen + Genitiv"]},{"id":14,"title":"Die Teilnahme ist auf eigene Gefahr.","topic":"Kurslar, eğitim ve risk","grammar":["Partizip Präsens/Perfekt als Adjektiv"]},{"id":15,"title":"Schön, dass Sie da sind.","topic":"İş başvurusu ve mülakat","grammar":["nicht nur ... sondern auch","sowohl ... als auch"]},{"id":16,"title":"Wir brauchten uns um nichts zu kümmern.","topic":"Gençlik, aile ve geçmiş alışkanlıklar","grammar":["nicht/nur brauchen + zu"]},{"id":17,"title":"Guck mal! Das ist schön!","topic":"Biyografi, sanat ve kişisel hikâye","grammar":["Ausdrücke mit es"]},{"id":18,"title":"Davon halte ich nicht viel.","topic":"Siyaset, toplum ve görüş bildirme","grammar":["weder ... noch","entweder ... oder","zwar ... aber","Wortbildung"]},{"id":19,"title":"Je älter ich wurde, desto ...","topic":"Turizm ve değişen tercihler","grammar":["je ... desto/umso","Modalpartikeln"]},{"id":20,"title":"Die anderen werden es dir danken!","topic":"Konaklama kuralları ve davranış","grammar":["indem","sodass"]},{"id":21,"title":"Vorher muss natürlich fleißig geübt werden.","topic":"Konser, şehir etkinliği ve yön tarifleri","grammar":["lokal/temporal edatlar","Passiv Präsens mit Modalverben"]},{"id":22,"title":"In der BRD wurde die Demokratie eingeführt.","topic":"Tarih ve toplumsal değişim","grammar":["Passiv Präteritum","Passiv Perfekt"]},{"id":23,"title":"Fahrradfahren ist in.","topic":"Çevre, ulaşım ve taviz","grammar":["(an)statt/ohne ... zu","(an)statt/ohne dass"]},{"id":24,"title":"Das löst mehrere Probleme auf einmal.","topic":"Gelecek vizyonları ve amaç","grammar":["damit","um ... zu","als ob + Konjunktiv II"]}];
const guides = {"1":["Adlaşmış sıfatı bir kişi veya grup için kullanırken büyük harfle yaz. n-Deklination ise bazı eril isimleri artikelin hâline göre değiştirir.","Ich helfe dem netten Kollegen.","Nazik iş arkadaşıma yardım ediyorum.","Kollege sözcüğünün Dativ hâlinde neden Kollegen olduğunu açıkla."],"2":["Präteritum, geçmiş olayları özellikle yazılı anlatımda düzenli şekilde aktarmak için kullanılır. Düzenli fiiller genellikle -te alır; düzensizleri ayrı öğren.","Er arbeitete gestern bis spät.","Dün geç saate kadar çalıştı.","arbeiten ile gehen fiillerinin Präteritum biçimlerini karşılaştır."],"3":["Relativsatz bir kişiyi veya nesneyi daha ayrıntılı tanıtır. Edatlı yapılarda edat önce, ilgi zamiri hemen sonra gelir; hâli edat belirler.","Das ist der Kollege, mit dem ich arbeite.","Bu, birlikte çalıştığım iş arkadaşıdır.","mit edatından sonra neden dem kullanıldığını düşün."],"4":["obwohl bir yan cümle açar ve çekimli fiil sona gider. trotzdem ise bir ana cümleyi bağlar; ardından çekimli fiil ikinci konumda kalır.","Obwohl es regnet, gehen wir spazieren.","Yağmur yağmasına rağmen yürüyüşe çıkıyoruz.","Cümleyi Trotzdem regnet es ... diye başlatırsan anlamı ve fiil sırasını kontrol et."],"5":["Gelecek zamanı hem werden + Infinitiv hem de zaman ifadesiyle Präsens kullanarak anlatabilirsin. Geleceğe ilişkin tahminlerde Futur I özellikle işe yarar.","Morgen werde ich länger lernen.","Yarın daha uzun çalışacağım.","Bu cümleyi morgen ile Präsens kullanarak yeniden kur."],"6":["falls, gerçekleşmesi kesin olmayan bir koşulu belirtir. Yan cümlede fiil sona gider; yan cümle öne gelirse ana cümlenin çekimli fiili hemen ardından gelir.","Falls du Zeit hast, komm vorbei.","Vaktin olursa uğra.","falls yan cümlesinden sonra ana cümlenin fiilini bul."],"7":["zu + Infinitiv bazı fiil ve sıfatlardan sonra ikinci bir eylem anlatır. Ayrılabilen fiillerde zu önek ile kök arasına gelir: aufzustehen.","Ich versuche, jeden Tag Deutsch zu sprechen.","Her gün Almanca konuşmaya çalışıyorum.","versuchen fiilinden sonra ikinci fiili neden zu ile kullandığını açıkla."],"8":["bevor önce gerçekleşecek eylemi, während eş zamanlılığı, da ise çoğu zaman bilinen bir gerekçeyi ifade eder. Hepsi yan cümlede fiili sona gönderir.","Bevor ich zur Arbeit gehe, frühstücke ich.","İşe gitmeden önce kahvaltı yaparım.","Aynı fikri während ile söylesen olayların zaman ilişkisi nasıl değişir?"],"9":["Komparativ iki şeyi karşılaştırır; Superlativ en üst dereceyi gösterir. Sıfat isimden önceyse derece ekine ek olarak artikel, cinsiyet ve hâle göre çekimlenir.","Das ist ein besserer Vorschlag.","Bu daha iyi bir öneridir.","gut, besser, am besten biçimlerini sırayla söyle."],"10":["Geçmişte gerçekleşmemiş bir olayı veya pişmanlığı anlatırken hätte/wäre + Partizip II kullanılır. Bu yapı gerçek bir geçmişi değil, gerçekleşmeyen ihtimali gösterir.","Hätte ich mehr gelernt, hätte ich die Prüfung bestanden.","Daha çok çalışsaydım sınavı geçerdim.","Cümlede gerçekleşmeyen koşulu ve sonucu ayrı ayrı bul."],"11":["Plusquamperfekt, geçmişteki iki olaydan daha önce olanı gösterir: hatte/war + Partizip II. nachdem yan cümlesi ile olay sırasını açıklaştırabilirsin.","Nachdem ich gegessen hatte, ging ich schlafen.","Yemek yedikten sonra uyumaya gittim.","Önce hangi olay oldu? İki fiilin zamanını karşılaştır."],"12":["Genitiv çoğu kez aitlik ve bazı edatlardan sonra kullanılır. trotz standart yazı dilinde Genitiv alır; eril ve nötr isimlerde des biçimine dikkat et.","Trotz des Regens gehen wir spazieren.","Yağmura rağmen yürüyüşe çıkıyoruz.","der Regen ifadesinin neden des Regens biçimine dönüştüğünü açıkla."],"13":["deswegen/darum/daher sonuç bildirir; neden anlatan cümleyi takip edebilir. nämlich ise genellikle açıklama ekler ve çekimli fiilin ikinci konum kuralını değiştirmez.","Ich war krank. Deswegen blieb ich zu Hause.","Hastaydım. Bu nedenle evde kaldım.","deswegen sonrası fiil ve öznenin sırasına dikkat et."],"14":["Partizip I süren bir eylem, Partizip II çoğu zaman tamamlanmış durum veya sonuç bildirir. Sıfat olarak kullanılan Partizip, isimden önce çekim eki alır.","Der lachende Mann öffnet die geschlossene Tür.","Gülen adam kapalı kapıyı açıyor.","lachende ve geschlossene sözcükleri hangi farklı anlamı katıyor?"],"15":["nicht nur ... sondern auch ile bilgi ekleyip güçlendirebilirsin; sowohl ... als auch iki özelliği birlikte belirtir. Paralel ögeler kullanman cümleyi okunur kılar.","Ich spreche sowohl Deutsch als auch Englisch.","Hem Almanca hem de İngilizce konuşuyorum.","Bu cümleyi nicht nur ... sondern auch kullanarak yeniden söyle."],"16":["nicht brauchen + zu bir şeyi yapmanın gerekli olmadığını söyler. Bu yapı, yapılmaması yasak olan bir eylemi anlatmaz; nicht dürfen ile karıştırma.","Du brauchst heute nicht zu kommen.","Bugün gelmene gerek yok.","nicht brauchen zu ile nicht dürfen arasındaki anlam farkını açıkla."],"17":["es bazen gerçek bir nesneyi değil, cümlede yapısal bir görevi üstlenir. Özellikle es ist ... ve es fällt mir ... kalıplarını bütün olarak öğren.","Es fällt mir schwer, früh aufzustehen.","Erken kalkmak bana zor geliyor.","Bu kalıpla kendi hayatından bir örnek kur."],"18":["entweder ... oder seçenek, weder ... noch iki olumsuzluk, zwar ... aber ise karşıtlık bildirir. Bu çift bağlaçları her zaman birlikte düşün.","Ich habe weder Zeit noch Geld.","Ne zamanım ne de param var.","Bir seçenek sunan cümleyi entweder ... oder ile kur."],"19":["je ... desto/umso, iki değişikliğin birbirine bağlı olduğunu anlatır. Her iki bölümde de sıfat veya zarfın karşılaştırma derecesine dikkat et.","Je mehr ich übe, desto sicherer werde ich.","Ne kadar çok pratik yaparsam o kadar kendimden emin olurum.","mehr ve sicherer sözcüklerini hangi iki değişimi anlattıklarına göre eşleştir."],"20":["indem bir eylemin nasıl gerçekleştiğini, sodass ise ortaya çıkan sonucu belirtir. indem yan cümlesinde fiilin sona gittiğini unutma.","Ich lerne, indem ich jeden Tag spreche.","Her gün konuşarak öğreniyorum.","Bu cümleye sonuç bildiren sodass ile ikinci bir cümle ekle."],"21":["Modalverb ile Passiv kurarken modal fiil çekimlenir, Partizip II + werden cümle sonunda kalır. Yapan kişi değil, yapılması gereken işlem vurgulanır.","Hier muss leise gesprochen werden.","Burada alçak sesle konuşulmalıdır.","muss, gesprochen ve werden sözcüklerinin görevlerini açıkla."],"22":["Passiv Präteritum için wurde + Partizip II; Passiv Perfekt için ist + Partizip II + worden kullanılır. worden ile geworden farkını özellikle öğren.","Das Haus ist gebaut worden.","Ev inşa edildi / edilmiş.","Cümleyi wurde gebaut biçimine dönüştür."],"23":["Özne aynıysa ohne/anstatt ... zu kullanılabilir. Özneler farklıysa ohne dass / anstatt dass ile yan cümle kurulur; çekimli fiil sona gider.","Er ging, ohne dass ich es merkte.","Ben fark etmeden gitti.","Burada iki farklı özne bulunduğu için neden ohne zu kullanılmadığını düşün."],"24":["Amaç bildirirken aynı özne için um ... zu, farklı özne gerektiğinde damit kullan. als ob ise çoğunlukla gerçek dışı bir karşılaştırma anlatır.","Ich helfe dir, damit du schneller lernst.","Daha hızlı öğrenebilmen için sana yardım ediyorum.","Ich lerne Deutsch ... cümlesini um ... zu ile tamamla."]};
const ID = "ayda-b1-";
let searchOpen = false, previousFocus = null, lastUnit = null, refreshQueued = false;
const $ = (s,root=document) => root.querySelector(s);
const $$ = (s,root=document) => Array.from(root.querySelectorAll(s));
const clean = s => String(s||"").toLocaleLowerCase("tr-TR").normalize("NFD").replace(/[\u0300-\u036f]/g,"");
function hasAccess(){
  const protectedArea = $("#aydaProtectedContent");
  return !!(protectedArea && getComputedStyle(protectedArea).display !== "none");
}
function activeUnit(){
  const label = $(".detailPage .unitNumber");
  const match = label && label.textContent.match(/(\d+)/);
  return match ? Number(match[1]) : null;
}
function svgText(tag,attrs,text){
  const el = document.createElement(tag);
  Object.entries(attrs||{}).forEach(([k,v])=>el.setAttribute(k,v));
  if(text!==undefined) el.textContent=text;
  return el;
}
function supportGuide(id){
  const box = $(".detailPage .explanationBody");
  if(!box || $(".ayda-extra",box) || !guides[id]) return;
  const [explain,example,translation,task] = guides[id];
  const sec = svgText("section",{class:"ayda-extra","aria-label":"Ek konu anlatımı"});
  sec.append(
    svgText("span",{class:"ayda-kicker"},"AYDA ÖĞRENME NOTU · EK AÇIKLAMA"),
    svgText("h3",{},"Konuyu daha iyi anlamak için"),
    svgText("p",{},explain)
  );
  const exampleBox = svgText("div",{class:"ayda-example",lang:"de"});
  exampleBox.append(svgText("strong",{},example),svgText("span",{lang:"tr"},translation));
  sec.append(exampleBox,svgText("p",{class:"ayda-try"},"Kendini kontrol et: "+task));
  box.appendChild(sec);
}
function restoreDraft(id){
  const textarea = $(".detailPage .writingCard textarea");
  if(!textarea || textarea.dataset.aydaDraftInit === String(id)) return;
  textarea.dataset.aydaDraftInit = String(id);
  try{
    const draft = localStorage.getItem(ID+"writing-draft-"+id);
    if(draft && !textarea.value) {
      const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,"value").set;
      setter.call(textarea,draft);
      textarea.dispatchEvent(new Event("input",{bubbles:true}));
    }
  }catch(e){}
  const label = textarea.closest("label");
  if(label && !$(".ayda-draft-note",label)){
    label.appendChild(svgText("span",{class:"ayda-draft-note"},"Taslağın bu cihazda otomatik kaydedilir."));
  }
}
document.addEventListener("input",function(e){
  if(!e.target.matches(".detailPage .writingCard textarea"))return;
  const id = activeUnit();
  if(!id)return;
  try{localStorage.setItem(ID+"writing-draft-"+id,e.target.value)}catch(err){}
});
function createSearch(){
  if($("#aydaSearchDialog"))return;
  const tools = svgText("div",{id:"aydaLearnerTools",hidden:""});
  const trigger = svgText("button",{type:"button","aria-label":"Ünitelerde konu ara"},"⌕  Konu ara");
  trigger.addEventListener("click",openSearch);
  tools.appendChild(trigger);
  const dialog=svgText("div",{id:"aydaSearchDialog",hidden:"",role:"dialog","aria-modal":"true","aria-labelledby":"aydaSearchTitle"});
  const panel=svgText("div",{id:"aydaSearchPanel"});
  const head=svgText("div",{class:"ayda-search-head"});
  const title=svgText("h2",{id:"aydaSearchTitle"},"B1 konularında ara");
  const close=svgText("button",{id:"aydaSearchClose",type:"button","aria-label":"Aramayı kapat"},"×");
  close.addEventListener("click",closeSearch);
  head.append(title,close);
  const help=svgText("p",{},"Ünite adı, dil bilgisi konusu veya Türkçe açıklama yazabilirsin.");
  const input=svgText("input",{id:"aydaSearchInput",type:"search",placeholder:"Örn. obwohl, Passiv, mülakat...","aria-label":"Ünite veya konu ara"});
  input.addEventListener("input",()=>renderSearch(input.value));
  const result=svgText("div",{id:"aydaSearchResults",role:"list"});
  panel.append(head,help,input,result);
  dialog.appendChild(panel);
  dialog.addEventListener("click",e=>{if(e.target===dialog)closeSearch()});
  document.addEventListener("keydown",function(e){
    if(dialog.hidden)return;
    if(e.key==="Escape"){e.preventDefault();closeSearch()}
    if(e.key==="Tab"){
      const els=$$("button,input",dialog).filter(x=>!x.disabled);
      const first=els[0],last=els[els.length-1];
      if(e.shiftKey && document.activeElement===first){e.preventDefault();last.focus()}
      else if(!e.shiftKey && document.activeElement===last){e.preventDefault();first.focus()}
    }
  });
  document.body.append(tools,dialog);
}
function renderSearch(value){
  const target=$("#aydaSearchResults");if(!target)return;
  target.replaceChildren();
  const term=clean(value.trim());
  const matches=units.filter(u=>!term || clean([u.id,u.title,u.topic,...u.grammar].join(" ")).includes(term));
  if(!matches.length)target.append(svgText("p",{},"Eşleşen ünite bulunamadı. Başka bir kelime dene."));
  matches.forEach(u=>{
    const b=svgText("button",{type:"button",role:"listitem"});
    b.append(svgText("strong",{},"Ünite "+u.id+" · "+u.title),svgText("small",{},u.topic+" · "+u.grammar.join(" / ")));
    b.addEventListener("click",()=>goToUnit(u.id));
    target.appendChild(b);
  });
}
function openSearch(){
  if(!hasAccess())return;
  previousFocus=document.activeElement;
  searchOpen=true;
  const dialog=$("#aydaSearchDialog");
  dialog.hidden=false;
  const input=$("#aydaSearchInput");
  input.value="";
  renderSearch("");
  input.focus();
  document.documentElement.style.overflow="hidden";
}
function closeSearch(){
  searchOpen=false;
  $("#aydaSearchDialog").hidden=true;
  document.documentElement.style.overflow="";
  if(previousFocus && previousFocus.isConnected)previousFocus.focus();
}
function onHome(cb){
  if(activeUnit()!==null){
    $(".detailPage .backButton")?.click();
    setTimeout(cb,85);
  }else cb();
}
function goToUnit(id){
  closeSearch();
  onHome(()=>{
    const allTab=$$(".filterTabs button").find(b=>b.textContent.includes("Tümü"));
    if(allTab && !allTab.classList.contains("active")){
      allTab.click();
      setTimeout(()=>clickCard(id),85);
    }else clickCard(id);
  });
}
function clickCard(id){
  const card=$$(".unitCard").find(c=>Number($(".unitIndex",c)?.textContent)===id);
  if(card)card.querySelector("button")?.click();
  else $("#uniteler")?.scrollIntoView({behavior:"smooth"});
}
function createBottomNav(){
  if($("#aydaLessonNav"))return;
  const nav=svgText("nav",{id:"aydaLessonNav",hidden:"","aria-label":"Ders içinde hızlı gezinme"});
  const options=[["⌂","Üniteler","home"],["▶","Video","video"],["≡","Konu","topic"],["✓","Alıştırma","practice"]];
  options.forEach(([ic,label,action])=>{
    const b=svgText("button",{type:"button","data-action":action});
    b.append(svgText("span",{"aria-hidden":"true"},ic),svgText("strong",{},label));
    b.addEventListener("click",()=>{
      if(action==="home"){onHome(()=>$("#uniteler")?.scrollIntoView({behavior:"smooth"}));return}
      const selector=action==="video"?".detailPage .videoLesson":action==="topic"?".detailPage .explanation":".detailPage .activityRunner";
      $(selector)?.scrollIntoView({behavior:"smooth",block:"start"});
      if(action==="topic"){const detail=$(".detailPage .explanation");if(detail)detail.open=true}
    });
    nav.append(b);
  });
  document.body.appendChild(nav);
}
function fixBrand(){
  // The real branded PNG is supplied separately; never fabricate or redraw it.
  if(!window.AYDA_LOGO_DATA)return;
  $$(".brandMark").forEach(el=>{
    if(el.dataset.aydaLogo==="1")return;
    el.dataset.aydaLogo="1";
    el.style.backgroundImage='url("'+window.AYDA_LOGO_DATA+'")';
    el.setAttribute("role","img");
    el.setAttribute("aria-label","AYDA Dil Akademisi");
  });
}
function refresh(){
  if(!hasAccess()){
    $("#aydaLearnerTools") && ($("#aydaLearnerTools").hidden=true);
    $("#aydaLessonNav") && ($("#aydaLessonNav").hidden=true);
    if(searchOpen)closeSearch();
    fixBrand();
    return;
  }
  $("#aydaLearnerTools").hidden=false;
  const id=activeUnit();
  $("#aydaLessonNav").hidden=id===null;
  if(id!==null){supportGuide(id);restoreDraft(id)}
  lastUnit=id;
  fixBrand();
}
function scheduleRefresh(){
  if(refreshQueued)return;
  refreshQueued=true;
  requestAnimationFrame(()=>{refreshQueued=false;refresh()});
}
function init(){
  createSearch();
  createBottomNav();
  const root=$("#root");
  if(root)new MutationObserver(scheduleRefresh).observe(root,{childList:true,subtree:true,attributes:true,attributeFilter:["style","class"]});
  scheduleRefresh();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();