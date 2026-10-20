/* AYDA B1 · Ana sayfaya dersleri bozmadan alıştırma kitabı bağlantısı. */
(()=>{"use strict";
const ID="ayda-b1-express-card";
const st=document.createElement("style");
const selector="#"+ID;
st.textContent=[
selector+"{width:min(1180px,calc(100% - 40px));margin:19px auto 29px;padding:23px 27px;background:#fff;border:1px solid #dbe3ea;border-left:5px solid #e8c37b;border-radius:16px;display:flex;justify-content:space-between;align-items:center;gap:18px;box-shadow:0 8px 25px #0b1b310d;text-decoration:none;color:#142b44;transition:border-color .16s,box-shadow .16s}",
selector+":hover{border-color:#a3b5c5;box-shadow:0 12px 30px #0b1b3115}",
selector+":focus-visible{outline:3px solid #214d75;outline-offset:3px}",
selector+" .ayda-b1-express-heading{display:block;font-size:clamp(18px,2.5vw,22px);font-weight:850;letter-spacing:-.018em;color:#102541;line-height:1.3}",
selector+" .ayda-b1-express-copy{display:block;font-size:13px;line-height:1.6;color:#536779;margin-top:6px}",
selector+" .ayda-b1-express-link{flex-shrink:0;display:inline-flex;align-items:center;justify-content:center;border-radius:9px;background:#102541;min-height:45px;padding:11px 16px;color:white;font-size:13px;font-weight:750;white-space:nowrap}",
"@media(max-width:640px){"+selector+"{width:calc(100% - 24px);margin:13px auto 21px;padding:17px 16px;flex-direction:column;align-items:stretch;gap:12px}"+selector+" .ayda-b1-express-link{width:100%}}",
"@media(prefers-reduced-motion:reduce){"+selector+"{transition:none}}"
].join("\n");
document.head.append(st);
function mount(){
 const gate=document.getElementById("aydaProtectedContent");
 if(!gate||getComputedStyle(gate).display==="none")return;
 const hero=gate.querySelector(".hero");
 if(!hero||document.getElementById(ID))return;
 const link=document.createElement("a");link.id=ID;link.href="./express/";
 link.setAttribute("aria-label","AYDA B1 Komple Alıştırmalar çalışma kitabını aç");
 const content=document.createElement("span");
 const heading=document.createElement("strong");heading.className="ayda-b1-express-heading";heading.textContent="B1 Komple Alıştırmalar";
 const caption=document.createElement("span");caption.className="ayda-b1-express-copy";caption.textContent="24 ünite · 576 özgün soru · Türkçe konu mantığı · Okuma, yazma ve konuşma";
 const action=document.createElement("span");action.className="ayda-b1-express-link";action.textContent="Çalışmaya başla →";
 content.append(heading,caption);link.append(content,action);
 hero.insertAdjacentElement("afterend",link);
}
let pending=false;
const observer=new MutationObserver(()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;mount()})});
observer.observe(document.getElementById("root")||document.body,{childList:true,subtree:true});
const gate=document.getElementById("aydaProtectedContent");
if(gate)observer.observe(gate,{attributes:true,attributeFilter:["style","class"]});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})();


/* AYDA approved G3 navy corporate identity overlay. React course bundle untouched. */
(()=>{
"use strict";
const URL="https://www.aydadil.com/wp-content/uploads/2026/10/ayda-home-v89-baa791945bb954a30b.png";
const WHATS="https://wa.me/905409122503?text=Merhaba%20AYDA%20Dil%20Akademisi%2C%20Almanca%20kurslar%C4%B1n%C4%B1z%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum.";
const css=document.createElement("style");
css.id="ayda-b1-corporate-css";
css.textContent=`
.topbar{background:#0b1b31!important;color:#fff!important;width:min(1180px,calc(100% - 24px))!important;margin:12px auto 0!important;padding:14px 22px!important;min-height:92px!important;border-radius:15px!important;gap:16px!important;box-shadow:0 8px 20px #0b1b311c}
.topbar .brand{display:flex!important;flex-direction:column!important;justify-content:center!important;gap:1px!important;min-width:133px!important;align-items:center!important}
.topbar .brand>.brandMark,.topbar .brand>span:not(.ayda-b1-subtitle),.loginBrand>.brandMark,.loginBrand>span:not(.ayda-b1-subtitle){display:none!important}
.ayda-b1-original-logo{display:block;width:148px;height:auto;max-width:100%;object-fit:contain}
.ayda-b1-subtitle{display:block;color:#e8c37b!important;font-size:9px!important;font-weight:800!important;letter-spacing:.21em!important;line-height:1.35!important;white-space:nowrap!important}
.topbar nav{display:flex!important;align-items:center!important;flex-wrap:wrap!important;justify-content:flex-end!important;gap:7px!important}
.topbar nav a{color:#f0f3f7!important;font-size:13px!important;font-weight:700!important;display:inline-flex;align-items:center;padding:9px!important;border-radius:9px!important}
.topbar nav a:hover{background:#ffffff16!important}
.topbar nav .ayda-b1-contact{background:#e8c37b!important;color:#102541!important;padding:10px 13px!important;white-space:nowrap!important}
.topbar .levelPill{display:none!important}
.loginBrand{display:flex!important;flex-direction:column!important;align-items:center!important;gap:2px!important;margin-bottom:28px!important}
.loginBrand .ayda-b1-original-logo{width:175px}
.loginBrand .ayda-b1-subtitle{color:#8d7547!important;font-size:10px!important}
@media(max-width:720px){.topbar{flex-direction:column!important;align-items:stretch!important;padding:12px 13px!important;gap:10px!important}.topbar .brand{align-self:center!important}.topbar nav{justify-content:center!important;gap:4px!important}.topbar nav a{font-size:11px!important;padding:8px 7px!important}.topbar .ayda-b1-original-logo{width:131px!important}}
@media(max-width:380px){.topbar nav a{font-size:10px!important;padding:6px!important}.topbar nav{gap:2px!important}}
`;
document.head.appendChild(css);
function decorate(){
 for(const el of document.querySelectorAll(".topbar .brand,.loginBrand")){
  if(!el.querySelector(".ayda-b1-original-logo")){
   const img=document.createElement("img");img.className="ayda-b1-original-logo";img.src=URL;img.alt="AYDA Dil Akademisi";img.width=134;img.height=49;img.decoding="async";el.appendChild(img);
  }
  if(!el.querySelector(".ayda-b1-subtitle")){
   const small=document.createElement("small");small.className="ayda-b1-subtitle";small.textContent="DİL AKADEMİSİ";el.appendChild(small);
  }
 }
 const nav=document.querySelector(".topbar nav");
 if(nav&&!nav.querySelector(".ayda-b1-contact")){
  const a=document.createElement("a");a.className="ayda-b1-contact";a.href=WHATS;a.target="_blank";a.rel="noopener noreferrer";a.textContent="Bize yazın ↗";nav.appendChild(a);
 }
}
let pending=false;
const root=document.getElementById("root")||document.body;
const observer=new MutationObserver(()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;decorate()})});
observer.observe(root,{childList:true,subtree:true});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",decorate,{once:true});else decorate();
})();
