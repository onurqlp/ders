const fs=require('node:fs');const path=require('node:path');const assert=require('node:assert/strict');const vm=require('node:vm');
const root=path.resolve(__dirname,'..'), read=p=>fs.readFileSync(path.join(root,p),'utf8');
for(const level of ['a1','a2']){
 const html=read(level+'/index.html'),js=read(level+'/ux-review.js'),css=read(level+'/ux-review.css');
 new vm.Script(js,{filename:level+'/ux-review.js'});
 assert.ok(html.includes('href="ux-review.css"')&&html.includes('src="ux-review.js"'));
 assert.ok(html.indexOf('src="app.js"')<html.indexOf('src="ux-review.js"'),'script load order');
 assert.ok(js.includes('localStorage.getItem(key)')&&js.includes('ayda-osd-'),'separate persistence');
 assert.ok(js.includes('study-workspace')&&js.includes('study-detail')&&js.includes('study-done'));
 assert.ok(css.includes('grid-template-columns:minmax(0,1fr) minmax(0,1fr)'),'desktop two columns');
 assert.ok(css.includes('@media(max-width:760px)'),'mobile breakpoint');
 for(const original of ['app.js','content.js','style.css'])assert.ok(fs.existsSync(path.join(root,level,original)));
}
assert.ok(!read('index.html').includes('İNCELEME TASLAĞI'));
console.log('PASS: review-only A1/A2 assets, syntax, scripts, mobile/desktop layouts and isolated progress.');
