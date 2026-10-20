import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
const root=path.resolve(import.meta.dirname,'..');
const read=async p=>JSON.parse(await fs.readFile(path.join(root,p),'utf8'));
const [config,rows,images,faq]=await Promise.all(['site.config.json','src/comparisons.json','src/images.json','src/faq.json'].map(read));
createRequire(import.meta.url)('../public/assets/selector-core.js');
const {questions}=globalThis.AYDASelector;
const e=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// configure-pages supplies the actual URL, including a project-repository prefix.
const pagesBase=process.env.PAGES_BASE_URL;
let basePath='';
if(pagesBase){
 const url=new URL(pagesBase);
 config.origin=url.origin;
 basePath=url.pathname.replace(/\/$/,'');
}
const canonical=new URL(basePath+config.path,config.origin).href;
const groups=[['LESEN','lesen','Okuma'],['HÖREN','horen','Dinleme'],['SCHREIBEN','schreiben','Yazma'],['SPRECHEN','sprechen','Konuşma']];
function card(d,type,section,num){
 const brand=type==='goethe'?'Goethe':'ÖSD';
 const name=brand+' '+section+' '+(type==='goethe'?'Teil':'Aufgabe')+' '+num;
 const dim=images[d.img];
 return `<article class="exam-card ${type}"><div class="exam-brand"><b>${brand} A1</b><span class="metric">${e(d.metric)}</span></div><p class="task-label">${type==='goethe'?'Teil':'Aufgabe'} ${num}</p><h4>${e(d.headline)}</h4><p>${e(d.desc)}</p><blockquote>${e(d.excerpt)}</blockquote><p class="focus-label">${e(d.focus)}</p>${dim?`<details class="example"><summary>Resmî örneği gör <span aria-hidden="true">+</span></summary><a href="{{ASSETS}}${d.img}-960.webp" data-example="${e(name)}" data-source="${e(d.src)}" aria-label="${e(name)} örneğini büyüt"><img src="{{ASSETS}}${d.img}-480.webp" srcset="{{ASSETS}}${d.img}-480.webp 480w, {{ASSETS}}${d.img}-960.webp 960w" sizes="(max-width:767px) calc(100vw - 88px), 500px" width="${dim.width}" height="${dim.height}" loading="lazy" decoding="async" alt="${e(name)}: ${e(d.headline)} — resmî modelden kesit"></a><p class="source-note">${e(d.src)} · Büyütmek için görsele dokun.</p></details>`:`<p class="source-note">Görev özeti · ${e(d.src)} · Üstteki kısa akış ifadesi öğretmen açıklamasıdır.</p>`}</article>`;
}
const comparisons=groups.map(([label,id,tr])=>`<section class="section-panel" id="${id}" aria-labelledby="heading-${id}"><h3 id="heading-${id}">${label} <span>— ${tr}</span></h3>${rows.filter(x=>x.section===label).map((r,i)=>`<details class="task" id="${id}-${r.number}"${i===0?' open':''}><summary><span class="task-no">0${r.number}</span><span>${e(r.title)}</span><span class="task-plus" aria-hidden="true">+</span></summary><div class="comparison-grid">${card(r.goethe,'goethe',label,r.number)}${card(r.osd,'osd',label,r.number)}</div><div class="teacher-comment"><strong>ÖĞRETMENİN YORUMU</strong><p>${e(r.insight)}</p></div></details>`).join('')}</section>`).join('\n');
const schema={'@context':'https://schema.org','@graph':[{'@type':'LearningResource','@id':canonical+'#resource',url:canonical,name:'Goethe A1 mi ÖSD A1 mi? Sınav Karşılaştırması',description:'Dört beceride görev formatlarının bağımsız öğretmen analizi.',inLanguage:'tr',educationalLevel:'A1',learningResourceType:'Karşılaştırmalı sınav rehberi',dateModified:config.updated,publisher:{'@type':'Organization',name:config.brand,url:config.links.home},isAccessibleForFree:true},{'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Ana sayfa',item:config.links.home},{'@type':'ListItem',position:2,name:'A1 sınav rehberi',item:canonical}]}]};
const replacements={CANONICAL:canonical,ROBOTS:config.indexable?'index,follow,max-image-preview:large':'noindex,nofollow',SOCIAL:new URL(basePath+'/assets/social.jpg',config.origin).href,VERIFICATION:config.searchConsoleVerification?`<meta name="google-site-verification" content="${e(config.searchConsoleVerification)}">`:'',SCHEMA:JSON.stringify(schema).replace(/</g,'\\u003c'),HOME:config.links.home,WHATSAPP:config.links.whatsapp,TEST_URL:config.links.mockExam||config.links.levelTest,TEST_LABEL:config.links.mockExam?'Ücretsiz A1 deneme sınavını çöz':'A1 seviyeni test et',COURSE:config.links.course,MATERIALS:config.links.materials,PREPARATION:config.links.preparation,PRIVACY:config.links.privacy,COMPARISONS:comparisons,TABS:groups.map(([label,id,tr])=>`<button id="tab-${id}" data-tab="${id}" type="button">${label}<small>${tr}</small></button>`).join(''),FAQ:faq.map(([q,a])=>`<details><summary>${e(q)}<span aria-hidden="true">+</span></summary><p>${e(a)}</p></details>`).join(''),QUESTIONS:questions.map((q,i)=>`<fieldset data-question="${i}"${i?' hidden':''}><legend>${e(q.title)}</legend>${q.options.map(([v,label],j)=>`<label class="quiz-option"><input type="radio" name="q${i}" value="${v}" required><span>${e(label)}</span></label>`).join('')}</fieldset>`).join('')};
await fs.mkdir(path.join(root,'dist/assets'),{recursive:true});
await fs.cp(path.join(root,'public/assets'),path.join(root,'dist/assets'),{recursive:true});
await fs.writeFile(path.join(root,'dist/assets/config.js'),'window.AYDA_CONFIG='+JSON.stringify({...config,canonical}).replace(/</g,'\\u003c')+';\n');
await fs.writeFile(path.join(root,'dist/assets/favicon.svg'),'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0a1223"/><path d="m15 48 17-34 17 34M22 36h20" stroke="#edc778" stroke-width="6" fill="none"/></svg>');
const template=(await fs.readFile(path.join(root,'src/page.html'),'utf8')).replace('<script src="{{ASSETS}}app.js"','<script src="{{ASSETS}}selector-core.js" defer></script>\n  <script src="{{ASSETS}}app.js"');
const route=config.path.replace(/^\/+|\/+$/g,'');
for(const [target,assets] of [['index.html','assets/'],[route+'/index.html','../'.repeat(route.split('/').length)+'assets/']]){
 let html=template.replace(/\{\{(\w+)\}\}/g,(m,k)=>k==='ASSETS'?m:replacements[k]??m).replaceAll('{{ASSETS}}',assets);
 if(/\{\{\w+\}\}/.test(html)) throw new Error('Unresolved placeholder');
 await fs.mkdir(path.dirname(path.join(root,'dist',target)),{recursive:true});
 await fs.writeFile(path.join(root,'dist',target),html);
}
await fs.writeFile(path.join(root,'dist/robots.txt'),config.indexable?`User-agent: *\nAllow: /\nSitemap: ${config.origin}${basePath}/sitemap.xml\n`:'User-agent: *\nDisallow: /\n');
await fs.writeFile(path.join(root,'dist/sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${e(canonical)}</loc><lastmod>${config.updated}</lastmod></url></urlset>`);
await fs.writeFile(path.join(root,'dist/.nojekyll'),'');
console.log(`Built ${rows.length} task pairs, ${faq.length} FAQs, 5 quiz questions. Indexing: ${config.indexable}.`);
