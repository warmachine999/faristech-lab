// Studio game regression tests: no browser or npm packages required.
// Run with: node scripts/check-studio-games.cjs
const fs=require('node:fs');
const assert=require('node:assert/strict');
const vm=require('node:vm');

const source=fs.readFileSync('studio/app.js','utf8');
const page=fs.readFileSync('studio/games.html','utf8');
const css=fs.readFileSync('studio/styles.css','utf8');
new vm.Script(source,{filename:'studio/app.js'});
assert.match(page,/id="memoryGrid"/);
assert.match(page,/id="ohmScore"/);
assert.match(page,/id="reactionBest"/);
for(const id of ['memory','ohm','reaction']) {
 assert.ok(page.includes('class="gamebox" id="'+id+'"'), 'Missing deep link target #'+id);
}
const shortRoute=fs.readFileSync('games.html','utf8');
assert.ok(shortRoute.includes('./studio/games.html'), 'Easy /games.html address must route to the full Studio games');

assert.ok((page.match(/aria-live="polite"/g)||[]).length>=3);
assert.match(css,/\.quizchoices button\.correct/);
assert.match(css,/\.quizchoices button\.incorrect/);
assert.ok(!source.includes('sort(()=>Math.random()-.5)'),'Do not shuffle with an inconsistent sort comparator');
assert.ok(!source.includes('setLang(lang);renderPage();'),'Initialization must not render each page twice');
assert.ok(source.includes('renderPage();refreshGamesLanguage()'),'Live localization must preserve game state');

const start=source.indexOf('function shuffleGameItems(');
const end=source.indexOf('function init(){',start);
assert.ok(start>=0&&end>start,'Game module boundaries not found');

let now=0,nextTimerId=0;
const timers=new Map();
const setTimer=(fn,ms)=>{const id=++nextTimerId;timers.set(id,{fn,at:now+ms});return id};
const clearTimer=id=>timers.delete(id);
function advance(ms){
 const until=now+ms;
 for(let steps=0;steps<500;steps++){
  const entries=[...timers].filter(([,timer])=>timer.at<=until).sort((a,b)=>a[1].at-b[1].at);
  if(!entries.length)break;
  const [id,timer]=entries[0];timers.delete(id);now=timer.at;timer.fn();
 }
 now=until;
}
function classList(){
 const classes=new Set();
 return {
  add:(...names)=>names.forEach(x=>classes.add(x)),
  remove:(...names)=>names.forEach(x=>classes.delete(x)),
  contains:name=>classes.has(name)
 };
}
function button(tag){
 const attr=name=>(tag.match(new RegExp(name+'="([^"]*)"'))||[])[1];
 return {
  dataset:{s:attr('data-s'),v:attr('data-v'),i:attr('data-i')},
  classList:classList(),disabled:false,textContent:'?',style:{},
  attributes:{},setAttribute(name,value){this.attributes[name]=String(value)},
  click(){if(!this.disabled&&typeof this.onclick==='function')this.onclick()}
 };
}
function element(id){
 let raw='';
 return {
  id,style:{},textContent:'',onclick:null,buttons:[],dataset:{},classList:classList(),attributes:{},
  get innerHTML(){return raw},
  set innerHTML(value){raw=value;this.buttons=[...value.matchAll(/<button\b[^>]*>/g)].map(m=>button(m[0]))},
  querySelectorAll(selector){assert.equal(selector,'button');return this.buttons},
  setAttribute(name,value){this.attributes[name]=String(value)},
  click(){if(typeof this.onclick==='function')this.onclick()}
 };
}
const ids=['memoryGrid','memoryScore','memoryStatus','memoryReset','ohmQuestion','ohmScore',
 'ohmStatus','ohmChoices','ohmNext','reactionBtn','reactionStatus','reactionBest'];
const elements=Object.fromEntries(ids.map(id=>[id,element(id)]));
const events={};
const document={
 hidden:false,
 addEventListener:(name,fn)=>{(events[name]??=[]).push(fn)}
};
const stored=new Map();
const localStorage={
 getItem:key=>stored.get(key)??null,
 setItem:(key,value)=>stored.set(key,String(value))
};
const context=vm.createContext({
 console,Math,document,localStorage,
 $:selector=>elements[selector.slice(1)]??null,
 lang:'en',performance:{now:()=>now},setTimeout:setTimer,clearTimeout:clearTimer
});
vm.runInContext(source.slice(start,end)+
 '\nthis.__games={games,shuffleGameItems,ohmGameOptions,refresh:()=>refreshGamesLanguage()};',context);
const api=context.__games;

const original=[1,2,3,4,5,6,7,8];
const shuffled=api.shuffleGameItems(original,()=>.25);
assert.deepEqual([...original],[1,2,3,4,5,6,7,8],'Shuffle must not mutate input');
assert.deepEqual([...shuffled].sort((a,b)=>a-b),original);
assert.notDeepEqual([...shuffled],original,'Fisher-Yates must rearrange cards');
for(let v=2;v<=12;v++)for(let r=2;r<=10;r++){
 const item=api.ohmGameOptions(v,r,()=>.45);
 assert.equal(item.answer,Number((v/r).toFixed(2)),'Ohm answer must be correct to 2 decimals');
 assert.equal(new Set(item.choices).size,4,'Ohm choices must be unique');
 assert.ok(item.choices.includes(item.answer),'Correct answer must be among 4 options');
 assert.ok(item.choices.every(x=>x>0),'Every displayed current must be positive');
}
api.games();

// MEMORY: restart during the mismatch timer must not touch the new board.
assert.equal(elements.memoryGrid.buttons.length,16,'Memory needs 16 face-down cards');
let tiles=elements.memoryGrid.buttons;
const first=tiles[0],different=tiles.find(b=>b.dataset.s!==first.dataset.s);
first.click();different.click();
assert.match(elements.memoryScore.textContent,/Moves: 1/);
elements.memoryReset.click();
const fresh=elements.memoryGrid.buttons;
assert.notEqual(fresh,tiles,'Restart must recreate fresh buttons');
advance(1200);
assert.ok(fresh.every(b=>b.textContent==='?'),'Stale mismatch timer must not flip freshly reset cards');
assert.match(elements.memoryScore.textContent,/Moves: 0/);
const groups=new Map();
for(const b of fresh){const group=groups.get(b.dataset.s)||[];group.push(b);groups.set(b.dataset.s,group)}
assert.equal(groups.size,8);
for(const pair of groups.values()){assert.equal(pair.length,2);pair[0].click();pair[1].click()}
assert.match(elements.memoryScore.textContent,/8 \/ 8/);
assert.ok(fresh.every(b=>b.disabled),'All matched cards should be disabled');
assert.match(elements.memoryStatus.textContent,/Excellent/);
elements.memoryReset.click();
assert.match(elements.memoryStatus.textContent,/Find all/,'Restart must reset the win message');

// OHM: wrong option, correct option, duplicate clicks, stale auto-next.
let options=elements.ohmChoices.buttons;
assert.equal(options.length,4);
const questionValues=()=>{const q=elements.ohmQuestion.textContent;const v=Number((q.match(/Voltage: (\d+)/)||[])[1]);const r=Number((q.match(/Resistance: (\d+)/)||[])[1]);return Number((v/r).toFixed(2))};
const correct=questionValues();
const right=options.find(b=>Number(b.dataset.v)===correct);
const wrong=options.find(b=>Number(b.dataset.v)!==correct);
assert.ok(right&&wrong);
wrong.click();
assert.ok(wrong.disabled);
assert.match(elements.ohmStatus.textContent,/Not quite/);
right.click();right.click();
assert.match(elements.ohmScore.textContent,/Solved: 1/);
assert.ok(options.every(b=>b.disabled),'Correct choice must lock all options');
const questionBefore=elements.ohmScore.textContent;
elements.ohmNext.click();
const questionAfter=elements.ohmScore.textContent;
assert.notEqual(questionBefore,questionAfter);
advance(1600);
assert.equal(elements.ohmScore.textContent,questionAfter,'Old auto-next timer must not overwrite a manually selected question');
assert.match(elements.ohmStatus.textContent,/Choose the correct current/);

// LANGUAGE: switching while games have state must not reset the round.
context.lang='ar';api.refresh();
assert.match(elements.memoryStatus.textContent,/الأزواج/);
assert.match(elements.ohmQuestion.textContent,/الجهد/);
assert.match(elements.reactionStatus.textContent,/ابدأ/);
assert.match(elements.ohmScore.textContent,/السؤال/);
context.lang='en';api.refresh();
assert.match(elements.ohmScore.textContent,/Question/);

// REACTION: early taps must cancel timer; tab hide cancels; best persists.
elements.reactionBtn.click();
assert.match(elements.reactionStatus.textContent,/Wait/);
elements.reactionBtn.click();
assert.match(elements.reactionStatus.textContent,/Too early/);
advance(5000);
assert.doesNotMatch(elements.reactionStatus.textContent,/GREEN/,'Cancelled timers must not start a reaction test');
elements.reactionBtn.click();
advance(4000); // guarantee start signal regardless of randomized delay
assert.match(elements.reactionStatus.textContent,/GREEN/);
advance(230);elements.reactionBtn.click();
assert.match(elements.reactionStatus.textContent,/Reaction time:/);
assert.match(elements.reactionBest.textContent,/Best:/);
assert.ok(Number(stored.get('ftx-studio-reaction-best'))>=0,'Best must persist');
elements.reactionBtn.click(); // new waiting round
document.hidden=true;
(events.visibilitychange||[]).forEach(fn=>fn());
assert.match(elements.reactionStatus.textContent,/cancelled/);
advance(5000);
assert.doesNotMatch(elements.reactionStatus.textContent,/GREEN/);
document.hidden=false;
elements.reactionBtn.click();
context.lang='ar';api.refresh();
assert.match(elements.reactionStatus.textContent,/انتظر/,'Language switch during waiting must keep waiting state');
advance(4000);advance(140);elements.reactionBtn.click();
assert.match(elements.reactionStatus.textContent,/الاستجابة/);
assert.ok(elements.reactionBtn.style.background==='','Reaction button must return to normal color');
console.log('Studio games: Memory, Ohm and Reaction interaction tests passed.');
