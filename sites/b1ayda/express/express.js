/* AYDA B1 Express · Eğitim odaklı çalışma motoru.
   24 unit + 576 tasks read from source-generated course-data.js.
   Standalone state; original B1 portal and its progress key remain untouched. */
(()=>{
"use strict";
const BOOK=window.AYDA_B1_EXPRESS_DATA||{};
const UNITS=Array.isArray(BOOK.units)?BOOK.units:[];
const VIDEOS=Array.isArray(BOOK.videos)?BOOK.videos:[];
const TOTAL=576;
const KEY="ayda_b1_express_progress_v1";
const DRAFT_KEY="ayda_b1_express_drafts_v1";
const $=(q,root=document)=>root.querySelector(q);
const escape=s=>String(s??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;");
let progress={},drafts={};
try{let p=JSON.parse(localStorage.getItem(KEY)||"{}");if(p&&typeof p==="object"&&!Array.isArray(p))progress=p}catch{}
try{let p=JSON.parse(localStorage.getItem(DRAFT_KEY)||"{}");if(p&&typeof p==="object"&&!Array.isArray(p))drafts=p}catch{}
let state={tab:"units",unit:0,index:0,search:"",selected:null,tokens:[],answer:"",feedback:null,hint:false};
const app=$("#app"),dialog=$("#videoModal");
const key=(u,i)=>"u"+u+"a"+(i+1);
const row=(u,i)=>progress[key(u,i)];
const isDone=r=>Boolean(r&&["correct","wrong","self"].includes(r.status));
const progressFor=u=>Array.from({length:24},(_,i)=>isDone(row(u,i))?1:0).reduce((a,b)=>a+b,0);
const doneTotal=()=>Object.values(progress).filter(isDone).length;
const pct=()=>Math.round(doneTotal()/TOTAL*100);
const wrongs=()=>Object.entries(progress).flatMap(([k,p])=>{if(p?.status!=="wrong")return[];const m=k.match(/^u(\d+)a(\d+)$/);return m?[{unit:+m[1],index:+m[2]-1,entry:p}]:[]});
const setRecord=(u,i,status,value)=>{progress[key(u,i)]={status,value,date:Date.now()};try{localStorage.setItem(KEY,JSON.stringify(progress))}catch{toast("Bu tarayıcı ilerlemeyi kaydedemedi.")}syncCounters()};
const saveDraft=(u,i,value)=>{drafts[key(u,i)]=value;try{localStorage.setItem(DRAFT_KEY,JSON.stringify(drafts))}catch{}};
function toast(message){const el=$("#toast");el.textContent=message;el.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove("show"),2800)}
function syncCounters(){const n=doneTotal();$("#globalCounter").textContent=n+" / "+TOTAL;$("#heroPercent").textContent=pct()+"%";$("#heroBar").style.width=pct()+"%";$("#reviewCount").textContent=wrongs().length}
function normalize(s){return String(s??"").trim().toLocaleLowerCase("de-DE").replaceAll("ä","ae").replaceAll("ö","oe").replaceAll("ü","ue").replaceAll("ß","ss").replace(/["„“'.,!?;:()]/g,"").replace(/\s+/g," ")}
function route(){
 const h=decodeURIComponent(location.hash.replace(/^#/,""));
 const m=h.match(/^unit\/(\d+)(?:\/(\d+))?$/);
 if(m&&+m[1]>=1&&+m[1]<=24){state.tab="unit";state.unit=+m[1];state.index=Math.min(23,Math.max(0,(+m[2]||1)-1))}
 else if(h==="review")state.tab="review";
 else if(h==="help")state.tab="help";
 else state.tab="units";
 restore();render();
 window.scrollTo({top:0,behavior:"instant"});
}
function navigate(tab,u,i){
 const target=tab==="unit"?"unit/"+u+"/"+i:tab==="review"?"review":tab==="help"?"help":"";
 if(location.hash==="#"+target)route();else location.hash="#"+target;
}
function restore(){
 state.selected=null;state.tokens=[];state.answer="";state.feedback=null;state.hint=false;
 if(state.tab!=="unit")return;
 const q=UNITS[state.unit-1]?.exercises?.[state.index];if(!q)return;
 const record=row(state.unit,state.index);
 const value=record?.value??drafts[key(state.unit,state.index)];
 if(q.source?.type==="order"&&Array.isArray(value))state.tokens=value.filter(n=>Number.isInteger(n)&&n>=0&&n<q.source.words.length);
 else if(q.options&&record&&Number.isInteger(value))state.selected=value;
 else if(typeof value==="string")state.answer=value;
}
function displayTabs(){
 for(const b of document.querySelectorAll(".tab")){
  const current=b.dataset.tab===(state.tab==="unit"?"units":state.tab);
  b.classList.toggle("is-active",current);
  if(current)b.setAttribute("aria-current","page");else b.removeAttribute("aria-current");
 }
}
function render(){
 syncCounters();displayTabs();
 if(UNITS.length!==24||UNITS.some(u=>u.exercises?.length!==24)){
  app.innerHTML='<div class="message-card"><h2>İçerik yüklenemedi</h2><p>Sayfayı yenileyin. Ünite veri dosyaları henüz yayınlanmamış olabilir.</p></div>';return;
 }
 if(state.tab==="unit")return renderUnit();
 if(state.tab==="review")return renderReview();
 if(state.tab==="help")return renderHelp();
 renderUnits();
}
function renderUnits(){
 const matching=UNITS.filter(u=>(u.id+" "+u.title+" "+u.topicTr+" "+u.grammar.join(" ")+" "+u.vocabulary.join(" ")).toLocaleLowerCase("tr-TR").includes(state.search.toLocaleLowerCase("tr-TR")));
 app.innerHTML='<section><div class="section-toolbar"><div><h2>Üniteler</h2><p>24 ünite · her birinde 24 özgün alıştırma · B1.1 ve B1.2</p></div><input type="search" class="search-input" id="unitSearch" placeholder="Ünite veya konu ara…" aria-label="Ünite ara" value="'+escape(state.search)+'"></div><div class="unit-grid">'+matching.map(u=>{
  const n=progressFor(u.id);
  return '<button type="button" class="unit-card '+(n===24?"complete":"")+'" data-unit="'+u.id+'"><span class="unit-meta"><span>'+(u.id<=12?"B1.1":"B1.2")+' · ÜNİTE '+String(u.id).padStart(2,"0")+'</span><span>'+n+'/24</span></span><span class="unit-title" lang="de">'+escape(u.title)+'</span><span class="unit-detail">'+escape(u.topicTr)+' · '+escape(u.grammar.join(" / "))+'</span><span class="unit-track"><span style="width:'+(n/24*100)+'%"></span></span></button>';
 }).join("")+'</div>'+(matching.length?"":'<div class="message-card">Aramanızla eşleşen ünite bulunamadı.</div>')+'</section>';
}
function exampleLine([de,tr]){
 return '<li><span><strong lang="de">'+escape(de)+'</strong><small>'+escape(tr)+'</small></span><button class="sound-btn" type="button" data-speech="'+escape(de)+'" aria-label="Almanca cümleyi dinle">▶ Dinle</button></li>';
}
function videosFor(id){
 return VIDEOS.filter(v=>v.units?.includes(id)).map(v=>'<button class="video-btn" data-video="'+escape(v.id)+'" type="button">▷ '+escape(v.title)+'</button>').join("");
}
function renderUnit(){
 const u=UNITS[state.unit-1],q=u.exercises[state.index],n=progressFor(u.id);
 const steps=u.exercises.map((item,i)=>{
  const status=row(u.id,i)?.status||"";
  return '<button type="button" class="step '+(i===state.index?"current ":status)+'" data-step="'+(i+1)+'" aria-label="'+(i+1)+'. soru" aria-current="'+(i===state.index?'step':'false')+'">'+(i+1)+'</button>';
 }).join("");
 app.innerHTML='<article class="sheet"><header class="sheet-head"><div class="sheet-topline"><span class="mini-label">'+(u.id<=12?"B1.1":"B1.2")+' · Ünite '+String(u.id).padStart(2,"0")+' · '+n+'/24 tamamlandı</span><button type="button" class="quiet" data-back>← Üniteler</button></div><h2 lang="de">'+escape(u.title)+'</h2><p>'+escape(u.topicTr)+' · '+escape(u.grammar.join(" / "))+'</p></header>'+
 '<section class="lesson"><span class="kicker">KONU MANTIĞI · TÜRKÇE</span><h3>'+escape(u.grammar.join(" & "))+'</h3><div class="logic"><strong>Temel mantık</strong><p>'+escape(u.logic)+'</p></div><div class="rule-grid"><div class="rule"><strong>Cümle sırası</strong><p>'+escape(u.wordOrder)+'</p></div><div class="rule warning"><strong>Sık yapılan hata</strong><p>'+escape(u.pitfall)+'</p></div></div><p><b>Hatırlatma:</b> '+escape(u.tip)+'</p><ul class="example-list">'+u.examples.map(exampleLine).join("")+'</ul><div class="videos">'+videosFor(u.id)+'</div></section>'+
 '<section class="practice"><div class="practice-top"><h3>Alıştırmalar</h3><span class="practice-count">Soru '+(state.index+1)+' / 24</span></div><div class="step-grid" aria-label="Soru seçimi">'+steps+'</div>'+renderQuestion(q,u)+'</section>'+
 '<div class="section-divider"></div><section class="extra-sections"><div class="kicker">GERÇEK HAYAT BECERİLERİ</div>'+renderExtras(u)+'</section>'+
 '<footer class="sheet-footer"><button class="btn-secondary" type="button" data-prev '+(state.index===0?'disabled':'')+'>← Önceki</button><button class="btn-primary" type="button" data-next>'+(state.index===23?(u.id===24?"Ünitelere dön":"Sonraki ünite →"):"Sonraki soru →")+'</button></footer></article>';
}
function renderExtras(u){
 const reading=u.reading;
 let result='<details><summary>Okuma · '+escape(reading.title)+'</summary><div class="detail-body"><p class="kicker">'+escape(reading.type)+'</p><p lang="de">'+escape(reading.text)+'</p>'+reading.questions.map(a=>'<p><b>'+escape(a.prompt)+'</b><br><span class="phrase">'+escape(a.answer)+'</span><br><small>'+escape(a.explanation)+'</small></p>').join("")+'</div></details>';
 result+='<details><summary>Yazma · '+escape(u.writing.prompt)+'</summary><div class="detail-body"><p>'+escape(u.writing.points.join(" · "))+'</p><div class="phrases">'+u.writing.phrases.map(p=>'<span class="phrase" lang="de">'+escape(p)+'</span>').join("")+'</div><p><strong>Önerilen uzunluk:</strong> '+escape(u.writing.minWords)+' kelime.</p><p><b>Örnek metin:</b></p><p lang="de">'+escape(u.writing.sample)+'</p></div></details>';
 result+='<details><summary>Konuşma · '+escape(u.speakingTask.context)+'</summary><div class="detail-body"><p>'+escape(u.speakingTask.prompt)+'</p><div class="phrases">'+u.speakingTask.phrases.map(p=>'<span class="phrase" lang="de">'+escape(p)+'</span>').join("")+'</div></div></details>';
 return result;
}
function correctAnswer(q){return String(q.answer??"")}
function modelFor(u,q){if(!q.manual)return correctAnswer(q);
 const text=String(q.prompt||"");
 if(text.includes("Mini")||text.includes("mini paragraf")||text.includes("kelimelik"))return u.writing.sample;
 if(text.includes("eşleştir"))return q.answer||u.examples.map(x=>x.join(" — ")).join("; ");
 return u.speakingTask.phrases.join(" · ");
}
function renderQuestion(q,u){
 const isOrder=q.source?.type==="order";
 const isManual=Boolean(q.manual);
 let html='';
 if(q.visual)html+='<div class="visual">'+escape(q.visual)+'</div>';
 if(isOrder){
  const words=q.source.words||q.options||[];
  const chosen=state.tokens.map(i=>'<button type="button" class="piece" data-undo="'+i+'">'+escape(words[i])+' ×</button>').join("");
  html+='<div class="kicker">Oluşturduğun cümle</div><div class="piece-answer">'+(chosen||'<span class="blank-note">Kelimeleri sırayla seç.</span>')+'</div><div class="kicker">Kelimeler</div><div class="piece-pool">'+words.map((word,i)=>'<button type="button" class="piece" data-token="'+i+'" '+(state.tokens.includes(i)?"disabled":"")+'>'+escape(word)+'</button>').join("")+'</div><button type="button" class="quiet" data-clear>↺ Baştan başla</button>';
 }else if(q.options&&q.options.length&&!isManual){
  html+='<div class="choice-list">'+q.options.map((opt,i)=>'<button type="button" data-choice="'+i+'" aria-pressed="'+(i===state.selected)+'" class="choice '+(i===state.selected?"selected":"")+'"><span class="choice-key">'+String.fromCharCode(65+i)+'</span><span>'+escape(opt)+'</span></button>').join("")+'</div>';
 }else if(isManual){
  html+='<textarea id="studentAnswer" class="answer-textarea" placeholder="B1 seviyesinde kendi cevabını yaz…" aria-label="Yazılı cevabın">'+escape(state.answer)+'</textarea>';
 }else{
  html+='<input id="studentAnswer" class="answer-input" type="text" autocomplete="off" spellcheck="false" placeholder="Almanca cevabını yaz" aria-label="Almanca cevabın" value="'+escape(state.answer)+'">';
 }
 if((q.prompt||"").includes("Okuma metnine"))html='<div class="context-reading" lang="de">'+escape(u.reading.text)+'</div>'+html;
 return '<div class="question"><div class="question-heading"><span class="question-kind">'+(isManual?"Yazma · Konuşma":isOrder?"Cümle kurma":q.options?"Çoktan seçmeli":"Kısa yanıt")+'</span><span class="question-num">'+String(state.index+1).padStart(2,"0")+' / 24</span></div><h4>'+escape(q.prompt)+'</h4>'+html+
 '<div class="actions"><button type="button" data-check class="btn-primary">'+(isManual?"Örnek cevabı gör":"Cevabı kontrol et")+'</button><button type="button" data-hint class="btn-secondary">İpucu</button>'+(!isManual?'<button type="button" data-reveal class="btn-secondary">Doğru cevap</button>':"")+'</div>'+
 (state.hint?'<div class="response"><strong>İpucu</strong><p>'+escape(q.hint||u.tip)+'</p></div>':"")+
 (state.feedback?feedbackHTML(q,u,state.feedback):"")+'</div>';
}
function feedbackHTML(q,u,fb){
 let title=fb.status==="correct"?"Doğru cevap":fb.status==="wrong"?"Tekrar etmen iyi olur":fb.status==="manual"?"Örnekle karşılaştır":"Cevap ve gerekçe";
 const manual=Boolean(q.manual);
 const msg=manual?'<p>Bu açık uçlu görev otomatik olarak notlandırılmaz. Kendi cümleni anlam, dil bilgisi ve iletişim amacı bakımından karşılaştır.</p><div class="actions"><button type="button" class="btn-primary" data-self="self">Çalıştım, tamamladım</button><button type="button" class="btn-secondary" data-self="wrong">Tekrar listeme ekle</button></div>':"";
 return '<div class="response '+(fb.status==="correct"?"good":fb.status==="wrong"?"bad":"")+'" role="status"><strong>'+title+'</strong><p><b>'+(manual?"Örnek / kalıplar":"Doğru cevap")+':</b> '+escape(modelFor(u,q))+'</p><p><b>Açıklama:</b> '+escape(q.hint||u.tip)+'</p>'+msg+'</div>';
}
function refreshQuestion(){
 const q=UNITS[state.unit-1]?.exercises?.[state.index],u=UNITS[state.unit-1];
 const element=$(".question");
 if(q&&element){element.outerHTML=renderQuestion(q,u)}
}
function check(reveal){
 const u=UNITS[state.unit-1],q=u.exercises[state.index];let val,ok=false;
 if(q.manual){state.feedback={status:"manual"};refreshQuestion();return}
 if(q.source?.type==="order"){
  val=state.tokens.slice();
  if(!reveal&&!val.length){toast("Önce kelimeleri sırala.");return}
  ok=normalize(val.map(i=>q.source.words[i]).join(" "))===normalize(q.answer);
 }else if(q.options){
  val=state.selected;
  if(!reveal&&val===null){toast("Önce bir seçenek seç.");return}
  ok=q.options[val]===q.answer;
 }else{
  val=state.answer.trim();
  if(!reveal&&!val){toast("Önce Almanca cevabını yaz.");return}
  ok=[q.answer,...(q.source?.alternatives||[])].filter(x=>typeof x==="string").some(x=>normalize(x)===normalize(val));
 }
 if(!reveal)setRecord(u.id,state.index,ok?"correct":"wrong",val);
 state.feedback={status:reveal?"reveal":ok?"correct":"wrong"};
 if(!reveal)renderUnit();else refreshQuestion();
 if(ok&&!reveal)toast("Doğru! Açıklamayı da inceleyebilirsin.");
}
function renderReview(){
 const list=wrongs().sort((a,b)=>a.unit-b.unit||a.index-b.index);
 app.innerHTML='<section><div class="section-toolbar"><div><h2>Tekrar listem</h2><p>Yanlış yaptığın sorular burada birikir. Tekrar doğru çözünce listeden çıkar.</p></div></div>'+
 (list.length?'<div class="review-list">'+list.map(item=>'<div class="review-item"><span><strong>Ünite '+item.unit+' · Soru '+(item.index+1)+'</strong><small>'+escape(UNITS[item.unit-1]?.title||"")+'</small></span><button type="button" class="btn-primary" data-review="'+item.unit+'/'+(item.index+1)+'">Tekrar çöz →</button></div>').join("")+'</div>':'<div class="message-card"><h2>Tekrar listen boş.</h2><p>Yanlış cevapladığın soruları burada göreceksin.</p></div>')+'</section>';
}
function renderHelp(){
 app.innerHTML='<section class="message-card"><h2>Bu kitapla nasıl çalışılır?</h2><p><b>1.</b> Önce üniteyi seç; Türkçe dil bilgisi mantığını ve Almanca örnekleri oku.</p><p><b>2.</b> Alıştırmayı çöz; cevabını kontrol et ve gerekçesini incele. İstersen ipucunu aç.</p><p><b>3.</b> Yanlışlarını <b>Tekrar listem</b> sayfasından yeniden çöz.</p><p><b>4.</b> Her ünitenin altında okuma, yazma ve konuşma bölümlerini çalış. Almanca seslendirme cihaz desteğine bağlıdır.</p><p>İlerleme yalnızca bu cihazın tarayıcısında tutulur ve B1 ana sitesindeki kayıttan ayrıdır. Açık uçlu yazma ve konuşma görevleri otomatik değerlendirilmez; özgün örnek ve kalıplarla öz değerlendirme yaparsın.</p><p><button class="btn-primary" type="button" data-tab="units">Üniteleri aç →</button></p></section>';
}
function speak(text){
 if(!window.speechSynthesis){toast("Bu cihazda Almanca seslendirme yok.");return}
 try{speechSynthesis.cancel();const voice=new SpeechSynthesisUtterance(text);voice.lang="de-DE";voice.rate=.87;speechSynthesis.speak(voice)}catch{toast("Seslendirme başlatılamadı.")}
}
function play(id){
 const video=VIDEOS.find(v=>v.id===id);if(!video)return;
 const url=String(video.embedUrl||"");
 if(!/^https:\/\/(www\.youtube-nocookie\.com|drive\.google\.com)\//.test(url)){toast("Video adresi desteklenmiyor.");return}
 $("#videoTitle").textContent=video.title;
 const iframe=document.createElement("iframe");iframe.src=url;iframe.title=video.title;
 iframe.loading="lazy";iframe.allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen";
 iframe.allowFullscreen=true;iframe.referrerPolicy="strict-origin-when-cross-origin";
 $("#videoContainer").replaceChildren(iframe);
 if(dialog.showModal)dialog.showModal();else dialog.setAttribute("open","");
}
function closeVideo(){if(dialog.open)dialog.close();$("#videoContainer").replaceChildren()}
document.addEventListener("click",e=>{
 const btn=e.target.closest("button");if(!btn)return;
 if(btn.dataset.tab){navigate(btn.dataset.tab);return}
 if(btn.dataset.unit){navigate("unit",+btn.dataset.unit,1);return}
 if(btn.hasAttribute("data-back")){navigate("units");return}
 if(btn.dataset.step){navigate("unit",state.unit,+btn.dataset.step);return}
 if(btn.hasAttribute("data-prev")){if(state.index>0)navigate("unit",state.unit,state.index);return}
 if(btn.hasAttribute("data-next")){if(state.index<23)navigate("unit",state.unit,state.index+2);else if(state.unit<24)navigate("unit",state.unit+1,1);else navigate("units");return}
 if(btn.dataset.choice!==undefined){state.selected=+btn.dataset.choice;state.feedback=null;refreshQuestion();return}
 if(btn.dataset.token!==undefined){const i=+btn.dataset.token;if(!state.tokens.includes(i))state.tokens.push(i);state.feedback=null;refreshQuestion();return}
 if(btn.dataset.undo!==undefined){const i=state.tokens.indexOf(+btn.dataset.undo);if(i>=0)state.tokens.splice(i,1);state.feedback=null;refreshQuestion();return}
 if(btn.hasAttribute("data-clear")){state.tokens=[];state.feedback=null;refreshQuestion();return}
 if(btn.hasAttribute("data-check")){check(false);return}
 if(btn.hasAttribute("data-reveal")){check(true);return}
 if(btn.hasAttribute("data-hint")){state.hint=!state.hint;refreshQuestion();return}
 if(btn.dataset.self){const q=UNITS[state.unit-1].exercises[state.index];setRecord(state.unit,state.index,btn.dataset.self,state.answer);state.feedback={status:"manual"};renderUnit();toast(btn.dataset.self==="self"?"Çalışma kaydedildi.":"Tekrar listene eklendi.");return}
 if(btn.dataset.speech){speak(btn.dataset.speech);return}
 if(btn.dataset.video){play(btn.dataset.video);return}
 if(btn.dataset.review){const [u,i]=btn.dataset.review.split("/").map(Number);navigate("unit",u,i);return}
});
document.addEventListener("input",e=>{
 if(e.target.id==="unitSearch"){const pos=e.target.selectionStart;state.search=e.target.value;renderUnits();const input=$("#unitSearch");input.focus();input.setSelectionRange(pos,pos);return}
 if(e.target.id==="studentAnswer"){state.answer=e.target.value;state.feedback=null;saveDraft(state.unit,state.index,state.answer)}
});
$("#closeVideo").addEventListener("click",closeVideo);
dialog.addEventListener("close",()=>$("#videoContainer").replaceChildren());
dialog.addEventListener("click",e=>{if(e.target===dialog)closeVideo()});
window.addEventListener("hashchange",route);
route();
})();
