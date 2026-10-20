/* No dependencies. Run: node a2/tests/smoke-test.js */
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const code=fs.readFileSync(path.join(root,'content.js'),'utf8');
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const css=fs.readFileSync(path.join(root,'style.css'),'utf8');
const ctx=vm.createContext({});
vm.runInContext(code,ctx,{timeout:1500});
const sections=vm.runInContext('sections',ctx);
const checklist=vm.runInContext('checklist',ctx);
const expected={lesen:2,horen:3,schreiben:1,sprechen:2};
assert.equal(sections.length,4,'Must have four skills');
for(const s of sections){
  assert.equal(s.tasks.length,expected[s.id],s.id+' task count');
  for(const t of s.tasks){
    for(const k of ['id','title','what','example','steps','think','tip','wrong','right','remember']){
      assert.ok(t[k],t.id+' missing '+k);
    }
    assert.ok(t.steps.length>=4,t.id+' insufficient steps');
    assert.ok(t.example.includes('Özgün')||t.example.includes('özgün'),t.id+' example must say original');
    assert.ok(html.includes('href="#'+s.id+'"'),'Missing link '+s.id);
  }
}
assert.equal(sections.flatMap(s=>s.tasks).length,8);
assert.ok(checklist.length>=10);
assert.ok(html.includes('ÖSD A2'));
assert.ok(html.includes('35/70'));
assert.ok(html.includes('10/20'));
assert.ok(html.includes('2026/08/ZA2-GB_Ver.3.0_05_06_26.pdf'));
assert.ok(!html.includes('38/75'),'A1 scoring leaked to A2');
assert.ok(!app.includes("osd-za1-guide-v1"),'A1 storage key leaked');
assert.ok(app.includes("osd-za2-guide-v1"));
assert.ok(app.includes('z2aNdPQnbZM'));
assert.ok(css.length>10000);
const officialAssets={
 'lesen-1':['za2-page-02.jpg','za2-page-03.jpg'],
 'lesen-2':['za2-page-04.jpg','za2-page-05.jpg'],
 'horen-1':['za2-hoeren-1.jpg'],
 'horen-2':['za2-hoeren-2.jpg'],
 'horen-3':['za2-hoeren-3.jpg'],
 'schreiben-1':['za2-page-07.jpg','za2-page-08.jpg'],
 'sprechen-1':['za2-page-10.jpg'],
 'sprechen-2':['za2-page-09.jpg']
};
for(const [task,assets] of Object.entries(officialAssets)){
  assert.ok(app.includes("'"+task+"'"),'Missing official scan mapping '+task);
  for(const asset of assets){
    assert.ok(fs.existsSync(path.resolve(root,'assets/model',asset)),'Missing official screenshot '+asset);
    assert.ok(app.includes(asset),'App not referencing official screenshot '+asset);
    const bytes=fs.statSync(path.resolve(root,'assets/model',asset)).size;
    assert.ok(bytes>10000&&bytes<1800000,'Invalid scan size '+asset);
  }
}
assert.ok(app.includes('officialScanCard(t.id)'), 'Official source preview must be in task template');
assert.ok(app.indexOf('officialScanCard(t.id)')<app.indexOf("${heading(2,'Karşıma nasıl bir soru gelecek?')}"), 'Real source should come before teacher example');
assert.ok(app.includes('resmî ÖSD ZA2 model kitapçığından'),'Official screenshot must be attributed');

for(const file of ['../assets/ayda-logo.png','style.css','app.js','content.js']){
  assert.ok(fs.existsSync(path.resolve(root,file)),'Missing '+file);
}
console.log('PASS: Four skills, 8 unique ZA2 tasks, 7-field coverage, original examples, routes, score thresholds, distinct progress and assets.');
