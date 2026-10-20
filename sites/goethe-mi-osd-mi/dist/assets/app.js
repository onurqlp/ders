/* Progressive enhancement: all comparison/FAQ text is in the HTML. */
(()=>{
 'use strict';
 const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
 const config=window.AYDA_CONFIG;
 const events=new Set(['comparison_tab_click','exam_example_open','teacher_insight_view','exam_selector_start','exam_selector_complete','mock_exam_cta_click','course_cta_click','whatsapp_cta_click','ad_slot_view','materials_cta_click']);
 const analyticsReady=config.analytics.enabled&&/^G-[A-Z0-9]+$/.test(config.analytics.ga4Id);
 let consent=false,tagLoaded=false;
 const device=()=>matchMedia('(max-width:767px)').matches?'mobile':matchMedia('(max-width:1023px)').matches?'tablet':'desktop';
 function track(name,params={}){if(consent&&events.has(name)&&typeof window.gtag==='function') window.gtag('event',name,{device_category:device(),...params});}
 function setConsent(granted){
   consent=Boolean(granted)&&analyticsReady;
   try{localStorage.setItem('ayda-analytics-consent',consent?'granted':'denied');}catch{/* Consent still works for this visit. */}
   window['ga-disable-'+config.analytics.ga4Id]=!consent;
   if(consent&&!tagLoaded){
     window.dataLayer=window.dataLayer||[]; window.gtag=function(){window.dataLayer.push(arguments);};
     window.gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
     window.gtag('consent','update',{analytics_storage:'granted'});
     window.gtag('js',new Date());window.gtag('config',config.analytics.ga4Id,{send_page_view:true,allow_google_signals:false,allow_ad_personalization_signals:false});
     const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(config.analytics.ga4Id);document.head.append(script);tagLoaded=true;
   }else if(tagLoaded){window.gtag('consent','update',{analytics_storage:consent?'granted':'denied'});}
   $('#privacy-dialog').close();
 }
 window.AYDAConsent={grant:()=>setConsent(true),deny:()=>setConsent(false)};
 if(analyticsReady){
   $('#privacy-open').hidden=false;
   let saved=null;try{saved=localStorage.getItem('ayda-analytics-consent');}catch{}
   if(saved==='granted')setConsent(true);else if(saved===null)$('#privacy-dialog').showModal();
 }
 $('#privacy-open').addEventListener('click',()=>$('#privacy-dialog').showModal());
 $('#privacy-accept').addEventListener('click',()=>setConsent(true));$('#privacy-reject').addEventListener('click',()=>setConsent(false));
 $$('[data-cta]').forEach(a=>a.addEventListener('click',()=>{
   const names={mock:'mock_exam_cta_click',course:'course_cta_click',whatsapp:'whatsapp_cta_click',materials:'materials_cta_click'};
   track(names[a.dataset.cta],{placement:a.closest('section,header,footer,aside')?.id||a.closest('section,header,footer,aside')?.classList[0]||'page',destination_type:a.dataset.cta==='mock'?(config.links.mockExam?'mock_exam':'level_test'):a.dataset.cta});
 }));

 const tabs=$$('.tabs button'), panels=$$('.section-panel'),tablist=$('.tabs');
 tablist.hidden=false;tablist.setAttribute('role','tablist');
 tabs.forEach(t=>{t.setAttribute('role','tab');t.setAttribute('aria-controls',t.dataset.tab);});
 panels.forEach(p=>{p.setAttribute('role','tabpanel');p.setAttribute('aria-labelledby','tab-'+p.id);p.tabIndex=0;});
 function activate(id){
   tabs.forEach(t=>{const on=t.dataset.tab===id;t.setAttribute('aria-selected',String(on));t.tabIndex=on?0:-1;});
   panels.forEach(p=>p.hidden=p.id!==id);
 }
 activate('lesen');
 function hashTarget(){
   let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}
   const target=document.getElementById(id);if(!target)return;
   const panel=target.closest('.section-panel');if(panel)activate(panel.id);
   let parent=target;while(parent){if(parent.tagName==='DETAILS')parent.open=true;parent=parent.parentElement;}
   if(panel)requestAnimationFrame(()=>target.scrollIntoView({block:'start',behavior:'instant'}));
 }
 tabs.forEach((t,i)=>{
   t.addEventListener('click',()=>{activate(t.dataset.tab);history.replaceState(null,'','#'+t.dataset.tab);track('comparison_tab_click',{section:t.dataset.tab});});
   t.addEventListener('keydown',ev=>{let next;if(ev.key==='ArrowRight')next=(i+1)%tabs.length;if(ev.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;if(ev.key==='Home')next=0;if(ev.key==='End')next=tabs.length-1;if(next!==undefined){ev.preventDefault();tabs[next].focus();tabs[next].click();}});
 });
 addEventListener('hashchange',hashTarget);hashTarget();
 $$('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>{if(a.hash===location.hash)hashTarget();}));

 const menu=$('.menu-toggle'),nav=$('#main-nav');menu.hidden=false;$('.site-header').classList.add('enhanced');
 function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Menüyü aç');}
 menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Menüyü kapat':'Menüyü aç');});
 nav.addEventListener('click',ev=>{if(ev.target.closest('a'))closeMenu();});
 document.addEventListener('keydown',ev=>{if(ev.key==='Escape'&&nav.classList.contains('open')){closeMenu();menu.focus();}});

 const dialog=$('#example-dialog');let exampleOpener;
 $$('[data-example]').forEach(link=>link.addEventListener('click',ev=>{
   if(ev.ctrlKey||ev.metaKey||ev.shiftKey||ev.altKey)return;
   ev.preventDefault();exampleOpener=link;
   $('#example-image').src=link.href;$('#example-image').alt=link.querySelector('img').alt;
   $('#example-title').textContent=link.dataset.example;$('#example-source').textContent=link.dataset.source+' · Resmî modelden kesit';
   dialog.showModal();document.body.classList.add('modal-open');track('exam_example_open',{example:link.dataset.example});
 }));
 $('#example-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',ev=>{if(ev.target===dialog){const r=dialog.getBoundingClientRect();if(ev.clientX<r.left||ev.clientX>r.right||ev.clientY<r.top||ev.clientY>r.bottom)dialog.close();}});
 dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');exampleOpener?.focus();});
 $('#keyword-toggle').addEventListener('click',ev=>{const b=ev.currentTarget,on=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',String(on));b.textContent=on?'Vurguyu kaldır':'Anahtar ifadeyi vurgula';$('.keyword-demo').classList.toggle('unhighlighted',!on);});

 const form=$('#selector'),fields=$$('#selector fieldset');let step=0,started=false,currentResult;
 form.hidden=false;
 function showStep(focus=false){fields.forEach((f,i)=>f.hidden=i!==step);$('#question-count').textContent=`Soru ${step+1} / ${fields.length}`;$('#quiz-progress').style.width=(step+1)/fields.length*100+'%';$('#quiz-back').disabled=step===0;$('#quiz-next').textContent=step===fields.length-1?'Rehberimi göster →':'Devam et →';$('#quiz-error').textContent='';if(focus){const legend=fields[step].querySelector('legend');legend.tabIndex=-1;legend.focus();}}
 form.addEventListener('change',()=>{if(!started){started=true;track('exam_selector_start');}$('#quiz-error').textContent='';});
 form.addEventListener('submit',ev=>{
   ev.preventDefault();if(!fields[step].querySelector('input:checked')){$('#quiz-error').textContent='Devam etmek için bir seçenek seç.';fields[step].querySelector('input').focus();return;}
   if(step<fields.length-1){step++;showStep(true);return;}
   const answers=fields.map(f=>f.querySelector('input:checked').value);currentResult=window.AYDASelector.evaluate(answers);
   $('#result-title').textContent=currentResult.title;$('#result-copy').textContent=currentResult.copy;$('#result-caution').textContent=currentResult.caution;
   $('#result-reasons').replaceChildren(...currentResult.reasons.map(s=>{const li=document.createElement('li');li.textContent=s;return li;}));
   form.hidden=true;$('#quiz-result').hidden=false;$('#quiz-result').focus();track('exam_selector_complete',{format_preference:currentResult.key});
 });
 $('#quiz-back').addEventListener('click',()=>{if(step>0){step--;showStep(true);}});
 $('#quiz-restart').addEventListener('click',()=>{form.reset();step=0;started=false;currentResult=null;$('#quiz-result').hidden=true;$('#share-status').textContent='';$('#share-fallback').hidden=true;form.hidden=false;showStep(true);});
 $('#share-result').addEventListener('click',async()=>{
   const text=currentResult.title+' '+currentResult.copy+'\nAYDA A1 format rehberi: '+config.canonical+'#format-secici';
   try{
     if(navigator.share){await navigator.share({title:'A1 format rehberim',text});$('#share-status').textContent='Paylaşım tamamlandı.';}
     else if(navigator.clipboard&&isSecureContext){await navigator.clipboard.writeText(text);$('#share-status').textContent='Sonuç bağlantısıyla birlikte kopyalandı.';}
     else throw new Error('Manual copy');
   }catch(err){if(err.name==='AbortError')return;const box=$('#share-fallback');box.value=text;box.hidden=false;box.focus();box.select();$('#share-status').textContent='Metni seçip kopyalayabilirsin.';}
 });
 showStep();
 let scheduled=false;function updateProgress(){const max=document.documentElement.scrollHeight-innerHeight;$('#reading-progress').style.transform=`scaleX(${max>0?scrollY/max:0})`;scheduled=false;}
 addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateProgress);}},{passive:true});addEventListener('resize',updateProgress);updateProgress();
 if('IntersectionObserver'in window){
   const seen=new WeakSet();const insightObserver=new IntersectionObserver(entries=>entries.forEach(en=>{if(en.isIntersecting&&consent&&!seen.has(en.target)){track('teacher_insight_view',{insight:en.target.dataset.insight});seen.add(en.target);}}),{threshold:.35});$$('[data-insight]').forEach(x=>insightObserver.observe(x));
   let heroVisible=true,finalVisible=false,dismissed=false;const updateMobile=()=>{$('.mobile-cta').hidden=dismissed||heroVisible||finalVisible;};
   const ctaObserver=new IntersectionObserver(entries=>{entries.forEach(en=>{if(en.target.classList.contains('hero'))heroVisible=en.isIntersecting;else finalVisible=en.isIntersecting;});updateMobile();});ctaObserver.observe($('.hero'));ctaObserver.observe($('.final-cta'));
   $('#mobile-cta-close').addEventListener('click',()=>{dismissed=true;updateMobile();});
 }
 // Ad requests require a separately integrated, verified CMP to call this API.
 let adsLoaded=false;
 const adsReady=config.ads.enabled&&config.ads.cmpReady&&/^ca-pub-\d+$/.test(config.ads.publisherId);
 if(adsReady)$$('[data-ad-slot]').forEach(el=>{if(/^\d+$/.test(config.ads.slots[el.dataset.adSlot]||''))el.hidden=false;});
 window.AYDAAdsConsent=granted=>{
   if(!granted){if(adsLoaded)location.reload();return;}
   if(!adsReady||adsLoaded)return;adsLoaded=true;
   const script=document.createElement('script');script.async=true;script.crossOrigin='anonymous';script.src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client='+config.ads.publisherId;document.head.append(script);
   $$('[data-ad-slot]:not([hidden])').forEach(el=>{const ins=document.createElement('ins');ins.className='adsbygoogle';ins.style.display='block';ins.dataset.adClient=config.ads.publisherId;ins.dataset.adSlot=config.ads.slots[el.dataset.adSlot];ins.dataset.adFormat='auto';ins.dataset.fullWidthResponsive='true';el.querySelector('.ad-mount').append(ins);(window.adsbygoogle=window.adsbygoogle||[]).push({});});
   if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>entries.forEach(en=>{if(en.isIntersecting&&consent){track('ad_slot_view',{slot:en.target.dataset.adSlot});observer.unobserve(en.target);}}),{threshold:.5});$$('[data-ad-slot]:not([hidden])').forEach(el=>observer.observe(el));}
 };
})();
