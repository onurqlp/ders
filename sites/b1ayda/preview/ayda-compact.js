/* AYDA B1 | Kompakt hibrit öğrenme katmanı
 * Öğrenci içeriklerini yeniden yazmaz; React içinde bulunan soru/cevap/video/ilerleme
 * veri yapılarına müdahale etmez. Yalnızca görünümü ve gezinmeyi yönetir.
 */
(() => {
  "use strict";
  const PREFIX = "ayda-b1-compact-v1:";
  const $ = (selector, scope=document) => scope.querySelector(selector);
  const $$ = (selector, scope=document) => [...scope.querySelectorAll(selector)];
  const state = { unit:null, tab:"learn", stage:"sets", group:1, restorePending:false, currentStep:0 };
  let refreshQueued=false;
  const SET_SIZE=6, QUESTION_TOTAL=24;
  const SET_NAMES=["Temeli kavra","Kullan ve anlat","Kontrol et","Üret ve özetle"];
  const safeRead=(key)=>{try{return localStorage.getItem(PREFIX+key)}catch{return null}};
  const safeWrite=(key,value)=>{try{localStorage.setItem(PREFIX+key,String(value))}catch{}};
  const create=(tag,props={},text)=>{
    const element=document.createElement(tag);
    Object.entries(props).forEach(([name,value])=>element.setAttribute(name,value));
    if(text!==undefined)element.textContent=text;
    return element;
  };
  function accessOK(){
    const area=$("#aydaProtectedContent");
    return !!(area&&getComputedStyle(area).display!=="none");
  }
  function unitId(){
    const label=$(".detailPage .unitNumber");
    const found=label?.textContent.match(/\b(\d{1,2})\b/);
    return found?Number(found[1]):null;
  }
  function savedCorrect(){
    try{
      const value=JSON.parse(localStorage.getItem("ayda-b1-progress")||"{}");
      return Array.isArray(value.correct)?value.correct:[];
    }catch{return []}
  }
  function selectedIndex(){
    return $$(".runnerSteps button").findIndex(b=>b.classList.contains("active"));
  }
  function completedIndices(){
    return $$(".runnerSteps button").reduce((out,button,index)=>{
      if(button.classList.contains("complete"))out.push(index);
      return out;
    },[]);
  }
  function setCurrentQuestion(index){
    const buttons=$$(".detailPage .runnerSteps button");
    if(index<0||index>=buttons.length)return;
    state.stage="sets";
    state.group=Math.floor(index/SET_SIZE)+1;
    state.currentStep=index;
    document.body.dataset.aydaSet=String(state.group);
    buttons[index].click(); // React'in mevcut soru seçicisini kullanır
    safeWrite("step-"+state.unit,index);
    scheduleRefresh();
  }
  function restoreUnit(id){
    state.unit=id;
    const savedTab=safeRead("tab-"+id);
    state.tab=["learn","video","practice"].includes(savedTab)?savedTab:"learn";
    state.stage="sets";
    const storedStep=safeRead("step-"+id);
    let index=storedStep===null?NaN:Number(storedStep);
    if(!Number.isInteger(index)||index<0||index>=QUESTION_TOTAL){
      const complete=new Set(savedCorrect());
      index=Array.from({length:QUESTION_TOTAL},(_,n)=>n).find(n=>!complete.has("u"+id+"a"+(n+1)))??23;
    }
    state.group=Math.floor(index/SET_SIZE)+1;
    state.currentStep=index;
    state.restorePending=index!==selectedIndex();
    if(state.restorePending){
      requestAnimationFrame(()=>{
        if(state.unit!==id||!accessOK())return;
        const buttons=$$(".detailPage .runnerSteps button");
        if(buttons[index]&&!buttons[index].classList.contains("active")){
          buttons[index].click();
        }
        state.restorePending=false;
        scheduleRefresh();
      });
    }
  }
  function stopHiddenVideos(){
    $$(".detailPage .videoFrame iframe").forEach(frame=>{
      // Iframe'ı aynı URL'den yeniden yüklemek gizlenen videonun sesini durdurur.
      const old=frame.getAttribute("src");
      if(old)frame.setAttribute("src",old);
    });
  }
  function targetForTab(){
    if(state.tab==="learn")return $(".detailPage .explanation");
    if(state.tab==="video")return $(".detailPage .videoLesson")||$(".detailPage .explanation");
    if(state.stage==="skills")return $(".detailPage .readingSection")||$(".detailPage .productionGrid");
    return $(".detailPage .activityRunner");
  }
  function scrollToSection(){
    requestAnimationFrame(()=>targetForTab()?.scrollIntoView({behavior:"smooth",block:"start"}));
  }
  function openTab(tab,scroll=true){
    if(!state.unit)return;
    if(!["learn","video","practice"].includes(tab))return;
    if(state.tab==="video"&&tab!=="video")stopHiddenVideos();
    // Selecting "Alıştırma" always opens the question sets, not the optional homework screen.
    if(tab==="practice"&&state.stage==="skills")state.stage="sets";
    state.tab=tab;
    safeWrite("tab-"+state.unit,tab);
    render();
    if(scroll)scrollToSection();
  }
  function selectSet(group){
    if(!state.unit)return;
    openTab("practice",false);
    if(group==="skills"){
      state.stage="skills";
      render();
      scrollToSection();
      return;
    }
    if(!Number.isInteger(group)||group<1||group>4)return;
    state.stage="sets";state.group=group;
    const completed=new Set(completedIndices());
    const start=(group-1)*SET_SIZE;
    const firstUnfinished=Array.from({length:SET_SIZE},(_,i)=>start+i).find(i=>!completed.has(i));
    setCurrentQuestion(firstUnfinished??start);
    render();
    scrollToSection();
  }
  // In-page controls supplement the fixed menu: students can navigate even if
  // they never notice the bottom navigation or use a laptop.
  function nextStep(){
    if(!state.unit)return;
    if(state.tab==="learn"){openTab("video");return}
    if(state.tab==="video"){openTab("practice");return}
    if(state.stage==="skills"){$(".detailPage .backButton")?.click();return}
    const index=selectedIndex();
    if(index>=QUESTION_TOTAL-1){selectSet("skills");return}
    if(index>=0){
      setCurrentQuestion(index+1);
      scrollToSection();
    }else selectSet(1);
  }
  function actionButton(text,action,primary=false){
    const button=create("button",{type:"button",class:primary?"ayda-inline-primary":"ayda-inline-secondary","data-ayda-inline-action":action},text);
    button.addEventListener("click",()=>{
      switch(action){
        case "video": openTab("video");break;
        case "learn": openTab("learn");break;
        case "practice": openTab("practice");break;
        case "skills": selectSet("skills");break;
        case "home": $(".detailPage .backButton")?.click();break;
        case "next": nextStep();break;
      }
    });
    return button;
  }
  function createInPageActions(kind,target,location="append"){
    if(!target||$('[data-ayda-actions="'+kind+'"]'))return;
    const foot=create("nav",{class:"ayda-inline-actions","data-ayda-actions":kind,"aria-label":"Dersin sonraki adımı"});
    if(kind==="learn"){
      foot.append(actionButton("▶ Videoyu izle","video",true),actionButton("Doğrudan alıştırma →","practice"));
    }else if(kind==="video"){
      foot.append(actionButton("Alıştırmalara geç →","practice",true),actionButton("Konuya dön","learn"));
    }else if(kind==="practice"){
      foot.append(actionButton("Sonraki soru →","next",true),actionButton("▶ Videoya dön","video"));
    }else if(kind==="skills"){
      foot.append(actionButton("✓ Üniteyi bitir · Ünitelere dön","home",true),actionButton("Alıştırmaları tekrar et","practice"));
    }
    if(location==="after")target.insertAdjacentElement("afterend",foot);
    else target.append(foot);
  }
  function ensureInlineControls(){
    const hero=$(".detailPage .unitHero");
    if(!hero)return;
    if(!$("#aydaInlinePath")){
      const panel=create("section",{id:"aydaInlinePath",class:"ayda-inline-path","aria-label":"Bu ünitenin çalışma adımları"});
      const title=create("div",{class:"ayda-inline-title"});
      title.append(
        create("strong",{},"Bu ünitede"),
        create("span",{},"İstediğin bölümden başlayabilirsin.")
      );
      const tabs=create("nav",{class:"ayda-inline-tabs","aria-label":"Sayfa içi bölüm seçimi"});
      [["learn","① Konu anlatımı"],["video","▶ Video izle"],["practice","✎ Alıştırmalar"]].forEach(([tab,label])=>{
        const button=create("button",{type:"button","data-ayda-inline-tab":tab,"aria-pressed":"false"},label);
        button.addEventListener("click",()=>openTab(tab));
        tabs.append(button);
      });
      const bottom=create("div",{class:"ayda-inline-continue"});
      const where=create("span",{id:"aydaInlineWhere"},"Konu anlatımı");
      const next=actionButton("İlerle →","next",true);
      next.id="aydaInlineNext";
      bottom.append(where,next);
      panel.append(title,tabs,bottom);
      hero.insertAdjacentElement("afterend",panel);
    }
    createInPageActions("learn",$(".detailPage .explanationBody"));
    createInPageActions("video",$(".detailPage .videoLesson"));
    createInPageActions("practice",$(".detailPage .activityRunner"));
    createInPageActions("skills",$(".detailPage .unitCheck"),"after");
  }
  function updateInlineControls(){
    const panel=$("#aydaInlinePath");
    if(!panel)return;
    Array.from(panel.querySelectorAll("[data-ayda-inline-tab]")).forEach(button=>{
      const active=button.dataset.aydaInlineTab===state.tab;
      button.setAttribute("aria-pressed",String(active));
      button.classList.toggle("active",active);
    });
    let current,nextLabel;
    if(state.tab==="learn"){
      current="Şu an: Konu anlatımı";
      nextLabel="Videoya ilerle →";
    }else if(state.tab==="video"){
      current="Şu an: Ünite videosu";
      nextLabel="Alıştırmalara ilerle →";
    }else if(state.stage==="skills"){
      current="Şu an: Okuma, yazma ve konuşma";
      nextLabel="Ünitelere dön →";
    }else{
      current="Şu an: Set "+state.group+"/4 · Soru "+Math.max(1,Math.min(6,state.currentStep%SET_SIZE+1))+"/6";
      nextLabel=state.currentStep===23?"Ünite görevlerine geç →":"Sonraki soruya ilerle →";
    }
    const where=$("#aydaInlineWhere",panel);
    const next=$("#aydaInlineNext",panel);
    if(where&&where.textContent!==current)where.textContent=current;
    if(next&&next.textContent!==nextLabel)next.textContent=nextLabel;
    const practiceNext=$('[data-ayda-actions="practice"] [data-ayda-inline-action="next"]');
    if(practiceNext){
      const label=state.currentStep===23?"Ünite görevlerine geç →":"Sonraki soru →";
      if(practiceNext.textContent!==label)practiceNext.textContent=label;
    }
  }
  function createDock(){
    const dock=create("section",{id:"aydaCompactDock",hidden:"","aria-label":"AYDA B1 ünite öğrenme menüsü"});
    const head=create("div",{class:"ayda-compact-head"});
    const back=create("button",{type:"button",class:"ayda-compact-back","aria-label":"Tüm ünitelere dön"},"← Üniteler");
    back.addEventListener("click",()=>$(".detailPage .backButton")?.click());
    const headText=create("div",{class:"ayda-compact-summary"});
    headText.append(create("strong",{id:"aydaCompactUnit"},"Ünite"),create("span",{id:"aydaCompactStatus"},"Hazır"));
    head.append(back,headText);
    const progress=create("div",{class:"ayda-compact-progress","aria-hidden":"true"});
    progress.append(create("span",{id:"aydaCompactProgressBar"}));
    const tabs=create("nav",{class:"ayda-compact-tabs","aria-label":"Ünite bölümleri"});
    [["learn","Öğren"],["video","Video"],["practice","Alıştırma"]].forEach(([key,title])=>{
      const button=create("button",{type:"button","data-ayda-tab-button":key,"aria-pressed":"false"},title);
      button.addEventListener("click",()=>openTab(key));
      tabs.append(button);
    });
    const picker=create("div",{id:"aydaCompactSetPicker",hidden:""});
    const buttons=create("div",{class:"ayda-compact-set-buttons"});
    for(let set=1;set<=4;set++){
      const button=create("button",{type:"button","data-ayda-set-button":String(set),"aria-label":"Set "+set+"; sorular "+((set-1)*6+1)+"–"+(set*6)},String(set));
      button.addEventListener("click",()=>selectSet(set));
      buttons.append(button);
    }
    const skills=create("button",{type:"button","data-ayda-set-button":"skills"},"Görevler");
    skills.addEventListener("click",()=>selectSet("skills"));
    buttons.append(skills);
    const line=create("div",{class:"ayda-compact-set-summary",id:"aydaCompactSetSummary","aria-live":"polite"});
    picker.append(buttons,line);
    const note=create("span",{class:"ayda-compact-note",id:"aydaCompactNote"});
    dock.append(head,progress,tabs,picker,note);
    document.body.append(dock);
    return dock;
  }
  function render(){
    const dock=$("#aydaCompactDock")||createDock();
    if(!state.unit||!accessOK()){
      dock.hidden=true;
      document.body.classList.remove("ayda-compact-active");
      delete document.body.dataset.aydaTab;
      delete document.body.dataset.aydaSet;
      delete document.body.dataset.aydaStage;
      return;
    }
    dock.hidden=false;
    document.body.classList.add("ayda-compact-active");
    document.body.dataset.aydaTab=state.tab;
    document.body.dataset.aydaSet=String(state.group);
    document.body.dataset.aydaStage=state.stage;
    const title=$(".detailPage .unitHero h1")?.textContent||"Ünite";
    $("#aydaCompactUnit",dock).textContent="Ünite "+String(state.unit).padStart(2,"0")+" · "+title;
    const finished=completedIndices();
    $("#aydaCompactStatus",dock).textContent=finished.length+"/24 alıştırma tamamlandı";
    $("#aydaCompactProgressBar",dock).style.width=(finished.length/QUESTION_TOTAL*100)+"%";
    $$("[data-ayda-tab-button]",dock).forEach(button=>{
      const active=button.dataset.aydaTabButton===state.tab;
      button.setAttribute("aria-pressed",String(active));
      button.classList.toggle("active",active);
    });
    const picker=$("#aydaCompactSetPicker",dock);
    picker.hidden=state.tab!=="practice";
    if(state.tab==="practice"){
      $$("[data-ayda-set-button]",dock).forEach(button=>{
        const key=button.dataset.aydaSetButton;
        const active=state.stage==="skills"?key==="skills":key===String(state.group);
        button.classList.toggle("active",active);
        button.setAttribute("aria-pressed",String(active));
        if(key!=="skills"){
          const group=Number(key), start=(group-1)*SET_SIZE;
          const count=finished.filter(index=>index>=start&&index<start+SET_SIZE).length;
          button.textContent=count===6?"✓ "+key:key;
          button.title="Set "+key+" · "+SET_NAMES[group-1]+": "+count+"/6 tamamlandı";
        }
      });
      if(state.stage==="skills"){
        $("#aydaCompactSetSummary",dock).textContent="Ünite görevleri: okuma · yazma · konuşma";
      }else{
        const start=(state.group-1)*SET_SIZE;
        const count=finished.filter(index=>index>=start&&index<start+SET_SIZE).length;
        const step=state.currentStep-start+1;
        $("#aydaCompactSetSummary",dock).textContent=
          count===6?"✓ "+SET_NAMES[state.group-1]+" tamamlandı · Sonraki sete geçebilirsin":
          "Set "+state.group+"/4 · "+SET_NAMES[state.group-1]+" · Soru "+Math.max(1,Math.min(6,step))+"/6 · "+count+"/6 doğru";
      }
    }
    updateInlineControls();
    $("#aydaCompactNote",dock).textContent=
      state.tab==="learn"?"Konuyu öğren veya hatırla; istersen doğrudan alıştırmaya geç.":
      state.tab==="video"?"Videoyu sayfadan ayrılmadan izle; ihtiyacın yoksa geç.":
      state.stage==="skills"?"Okuma, yazma ve konuşma çalışmalarını burada tamamla.":
      "Her sette 6 soru var. Sonraki sete istediğinde geçebilirsin.";
  }
  function refresh(){
    if(!accessOK()||!$(".detailPage")){
      state.unit=null;
      render();
      return;
    }
    const id=unitId();
    if(!id||id<1||id>24){state.unit=null;render();return}
    if(state.unit!==id)restoreUnit(id);
    const active=selectedIndex();
    if(active>=0&&!state.restorePending){
      state.currentStep=active;
      if(state.stage==="sets"){
        state.group=Math.floor(active/SET_SIZE)+1;
      }
      safeWrite("step-"+id,active);
    }
    ensureInlineControls();
    render();
  }
  function scheduleRefresh(){
    if(refreshQueued)return;
    refreshQueued=true;
    requestAnimationFrame(()=>{refreshQueued=false;refresh()});
  }
  function init(){
    createDock();
    const root=$("#root");
    if(root)new MutationObserver(scheduleRefresh).observe(root,{subtree:true,childList:true,attributes:true,attributeFilter:["class","style"]});
    scheduleRefresh();
  }
  // Diğer navigasyon katmanlarının da kullanabilmesi için salt gezinme API'si.
  window.AYDA_COMPACT={openTab,selectSet,refresh:scheduleRefresh};
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});
  else init();
})();