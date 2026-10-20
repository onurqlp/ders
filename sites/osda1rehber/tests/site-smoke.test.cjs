const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');const get=p=>fs.readFileSync(path.join(root,p),'utf8');
const landing=get('index.html'),a1=get('a1/index.html'),a2=get('a2/index.html');
const js1=get('a1/app.js'),js2=get('a2/app.js'),data1=get('a1/content.js'),data2=get('a2/content.js');
function data(js){const sandbox=vm.createContext({});vm.runInContext(js,sandbox,{timeout:2000});return{sections:vm.runInContext('sections',sandbox),checklist:vm.runInContext('checklist',sandbox)};}
const s1=data(data1),s2=data(data2);const ids1=s1.sections.flatMap(s=>s.tasks.map(t=>t.id));const ids2=s2.sections.flatMap(s=>s.tasks.map(t=>t.id));
assert.deepEqual(Array.from(s1.sections.map(x=>x.tasks.length)),[3,3,2,3]);assert.deepEqual(Array.from(s2.sections.map(x=>x.tasks.length)),[2,3,1,2]);
assert.equal(ids1.length,11);assert.equal(ids2.length,8);assert.ok(s1.checklist.length>=10);assert.ok(s2.checklist.length>=10);
for(const [level,html,js,ids] of [['a1',a1,js1,ids1],['a2',a2,js2,ids2]]){
  assert.ok(html.includes('href="../"'),'Missing level selector backlink: '+level);
  assert.ok(html.includes('src="app.js"')&&html.includes('src="content.js"')&&html.includes('href="style.css"'));
  assert.ok(html.includes('src="../assets/ayda-logo.png"') ||
    html.includes('src="https://www.aydadil.com/wp-content/uploads/2026/10/ayda-home-v89-baa791945bb954a30b.png"'),
    'Missing approved AYDA logo: '+level);
  assert.ok(js.includes('official'+level.toUpperCase()+'Card')||js.includes('officialScanCard(t.id)'));
  assert.ok(js.includes("assets/model/"),'Images must be on owned domain');
  assert.ok(!js.includes('raw.githubusercontent.com'),'External branch dependency '+level);
  for(const id of ids)assert.ok(js.includes("'"+id+"'"),'Missing model screenshot '+level+' '+id);
}
const scans1=['za1-page-02.jpg','za1-page-03.jpg','za1-page-04.jpg','za1-page-05.jpg','za1-page-06.jpg','za1-page-07.jpg','za1-hoeren-2.jpg','za1-hoeren-3.jpg','za1-page-09.jpg','za1-page-10.jpg','za1-page-11.jpg','za1-page-12.jpg'];
const scans2=['za2-page-02.jpg','za2-page-03.jpg','za2-page-04.jpg','za2-page-05.jpg','za2-hoeren-1.jpg','za2-hoeren-2.jpg','za2-hoeren-3.jpg','za2-page-07.jpg','za2-page-08.jpg','za2-page-09.jpg','za2-page-10.jpg'];
for(const [level,scanNames] of [['a1',scans1],['a2',scans2]]){
 for(const n of scanNames){const file=path.join(root,level,'assets/model',n);assert.ok(fs.existsSync(file),file);const sz=fs.statSync(file).size;assert.ok(sz>8000&&sz<1_800_000,n+' invalid image');}
}
assert.ok(js1.includes('officialA1Card(t.id)'));assert.ok(js2.includes('officialScanCard(t.id)'));
assert.ok(landing.includes('href="a1/"')&&landing.includes('href="a2/"'));assert.ok(landing.includes('assets/ayda-logo.png') || landing.includes('https://www.aydadil.com/wp-content/uploads/2026/10/ayda-home-v89-baa791945bb954a30b.png'), 'Landing approved logo missing');
assert.ok(landing.includes('genel')&&landing.includes('Sınav günü'));
assert.equal(get('CNAME').trim(),'osd.aydadil.com');
for(const n of ['ayda-logo.png','shop.webp','cafe.webp','kitchen.webp'])assert.ok(fs.existsSync(path.join(root,'assets',n)));
assert.ok(data1.includes('../assets/')&&data2.includes('ÖSD'));
assert.ok(js1.includes('osd-za1-guide-v1')&&js2.includes('osd-za2-guide-v1'));
assert.ok(a2.includes('35/70')&&a1.includes('38/75'),'Score conditions must be level-specific');
console.log('PASS: unified landing, 19 official illustrated tasks, correct source images, separate progress, legacy paths and A1/A2 scoring.');