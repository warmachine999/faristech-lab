(()=>{'use strict';
const $=id=>document.getElementById(id);
const levels=[
 {name:['The First Vault','الخزنة الأولى'],
  map:["###########","#S...#...E#","#....#....#","#.........#","#.###..#..#","#...#..#..#","#......J..#","#.........#","###########"],
  lasers:[{axis:'h',line:3,from:2,to:7,period:4,phase:2,duty:1},{axis:'v',line:9,from:2,to:7,period:3,phase:1,duty:1}]},
 {name:['The Crossroads','الممرات المتقاطعة'],
  map:["############","#S..#......#","#...#..##..#","#...#......#","#..........#","#..##..##..#","#.....#....#","#...J......#","#...#....E.#","############"],
  lasers:[{axis:'h',line:4,from:2,to:9,period:4,phase:1,duty:2},{axis:'v',line:6,from:2,to:8,period:5,phase:2,duty:2},{axis:'h',line:7,from:2,to:10,period:5,phase:3,duty:1}]},
 {name:['The Final Heist','السرقة الأخيرة'],
  map:["#############","#S..#....#..#","#...#....#..#","#...........#","#..###.###..#","#...........#","#..#..#.....#","#..#..#.J...#","#...........#","#........E..#","#############"],
  lasers:[{axis:'h',line:3,from:2,to:10,period:5,phase:1,duty:2},{axis:'v',line:6,from:3,to:9,period:4,phase:2,duty:1},{axis:'h',line:8,from:3,to:11,period:3,phase:2,duty:1},{axis:'v',line:10,from:4,to:9,period:5,phase:3,duty:2}]}
];
let lang='en';
try{const l=localStorage.getItem('ft-lang');lang=l==='ar'?'ar':'en';const theme=localStorage.getItem('ft-theme');if(['dark','light','caramel','tech','matcha'].includes(theme))document.documentElement.dataset.theme=theme;}catch(_){}
let current=0,player={x:1,y:1},start={x:1,y:1},jewel={x:1,y:1},exit={x:1,y:1},turn=0,lives=3,got=false,done=false,gameOver=false,message='',kind='normal';
const directions={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0],wait:[0,0]};
const strings={
 en:{
  ready:'Find the diamond, then escape through the exit.',
  jewel:'Diamond acquired! Get to the exit door.',
  needs:'Find the diamond before leaving the vault.',
  wall:'A wall blocks that way. Try another path.',
  hit:'Laser hit! Lost one life — try a different route.',
  over:'Security caught you! Restart this vault to try again.',
  success:'Vault cleared! Ready for the next heist?',
  complete:'You made it through all three vaults. Master thief!',
  scanning:'LASERS / SCANNING',passed:'LASERS / SAFE WINDOW',
  mission:'GRAB JEWEL → REACH EXIT',escape:'JEWEL SECURED → ESCAPE',
  next:'Next vault ↗',again:'Play again ↗',restart:'Try again ↻',win:'Vault cleared!',final:'Legendary heist!',fail:'Caught by security!',
  score:'New record: {n} moves.',phase:'SECURITY ACTIVE',safe:'SAFE FOR NOW',
  markOn:'● SCANNING',markOff:'○ NO ACTIVE BEAMS'
 },
 ar:{
  ready:'دوّر على الجوهرة، وبعدها اطلع من باب الخروج.',
  jewel:'أخذت الجوهرة! الحين روح للمخرج.',
  needs:'لازم تاخذ الجوهرة قبل ما تطلع من الخزنة.',
  wall:'فيه جدار قدّامك. جرّب طريق ثاني.',
  hit:'لمسك الليزر! راحت فرصة — جرّب طريق غير.',
  over:'مسكك نظام الحماية! ابدأ من جديد وجرب خطة ثانية.',
  success:'عدّيت الخزنة! جاهز للمهمة اللي بعدها؟',
  complete:'خلصت الخزنات الثلاث! أنت حرامي جواهر محترف!',
  scanning:'الليزر / يفحص',passed:'الليزر / آمن الحين',
  mission:'خذ الجوهرة ← اطلع',escape:'الجوهرة معك ← اهرب',
  next:'الخزنة الجاية ↗',again:'العب مرة ثانية ↗',restart:'حاول مرة ثانية ↻',
  win:'نجحت بالمهمة!',final:'سرقة أسطورية!',fail:'مسكك الليزر!',
  score:'رقم جديد: {n} خطوة.',phase:'نظام الحماية شغّال',safe:'آمن حالياً',
  markOn:'● فيه ليزر شغّال',markOff:'○ الليزر مطفي'
 }
};
const t=(key)=>strings[lang][key]||strings.en[key]||key;
const grid=$('board'),statusEl=$('status');
function coords(map,target){
 for(let y=0;y<map.length;y++)for(let x=0;x<map[y].length;x++)if(map[y][x]===target)return{x,y};
 return{x:1,y:1};
}
function startLevel(index){
 current=index;turn=0;lives=3;got=false;done=false;gameOver=false;kind='normal';message=t('ready');
 const map=levels[current].map;
 start=coords(map,'S');player={...start};jewel=coords(map,'J');exit=coords(map,'E');
 $('overlay').hidden=true;draw();
}
function beamCells(time){
 const map=levels[current].map,active=new Map();
 for(const beam of levels[current].lasers){
  if((time+beam.phase)%beam.period>=beam.duty)continue;
  for(let p=beam.from;p<=beam.to;p++){
   const x=beam.axis==='h'?p:beam.line,y=beam.axis==='h'?beam.line:p;
   if(map[y]?.[x]===undefined||map[y][x]==='#')continue;
   const key=x+','+y;
   if(!active.has(key))active.set(key,{h:false,v:false});
   active.get(key)[beam.axis]=true;
  }
 }
 return active;
}
function bestKey(){return 'ftl-jewel-best-'+(current+1)}
function getBest(){try{const x=Number(localStorage.getItem(bestKey()));return Number.isFinite(x)&&x>0?x:null}catch(_){return null}}
function storeBest(){
 const old=getBest();if(old===null||turn<old){try{localStorage.setItem(bestKey(),String(turn))}catch(_){}return true}
 return false;
}
function announce(text,type='normal'){message=text;kind=type}
function checkCollision(){
 const beams=beamCells(turn);
 if(beams.has(player.x+','+player.y)){
  lives--;got=false;player={...start};
  if(lives===0){gameOver=true;announce(t('over'),'danger');showOverlay(false)}
  else announce(t('hit'),'danger');
  return true;
 }
 return false;
}
function move(direction){
 if(done||gameOver)return;
 const offset=directions[direction];if(!offset)return;
 const nx=player.x+offset[0],ny=player.y+offset[1];
 if(direction!=='wait'){
  const tile=levels[current].map[ny]?.[nx];
  if(tile===undefined||tile==='#'){announce(t('wall'),'warning');draw();return;}
  player={x:nx,y:ny};
 }
 turn++;
 if(checkCollision()){draw();return;}
 if(player.x===jewel.x&&player.y===jewel.y&&!got){got=true;announce(t('jewel'),'success')}
 else if(player.x===exit.x&&player.y===exit.y){
  if(got){
   done=true;const record=storeBest();
   announce(t('success')+(record?' '+t('score').replace('{n}',turn):''),'success');
   showOverlay(true);
  }else announce(t('needs'),'warning');
 }else if(got)announce(t('jewel'),'success');
 else announce(t('ready'));
 draw();
}
function showOverlay(won){
 const modal=$('overlay');modal.hidden=false;
 const last=current===levels.length-1;
 $('overlayIcon').textContent=won?(last?'🏆':'💎'):'🚨';
 $('overlayTitle').textContent=won?(last?t('final'):t('win')):t('fail');
 $('overlayText').textContent=won?(last?t('complete'):t('success')):t('over');
 $('overlayAction').textContent=won?(last?t('again'):t('next')):t('restart');
 $('overlayAction').dataset.action=won?(last?'again':'next'):'restart';
}
function draw(){
 const level=levels[current],map=level.map;
 grid.style.gridTemplateColumns='repeat('+map[0].length+',minmax(0,1fr))';
 const active=beamCells(turn);let html='';
 for(let y=0;y<map.length;y++)for(let x=0;x<map[y].length;x++){
  const tile=map[y][x],isWall=tile==='#',isExit=x===exit.x&&y===exit.y,isJewel=x===jewel.x&&y===jewel.y&&!got;
  const isPlayer=player.x===x&&player.y===y,beam=active.get(x+','+y);
  let classes='cell '+(isWall?'wall':'floor');
  if(!isWall){
   if(isExit)classes+=' exit';
   if(isJewel)classes+=' jewel';
   if(isPlayer)classes+=' player';
   if(beam?.h)classes+=' laser-h';
   if(beam?.v)classes+=' laser-v';
  }
  let content='';
  if(isJewel)content='<span class="piece diamond" aria-hidden="true">💎</span>';
  if(isExit)content='<span class="piece door" aria-hidden="true">⇥</span>';
  if(isPlayer)content='<span class="piece thief" aria-hidden="true">🥷</span>';
  html+='<div class="'+classes+'">'+content+'</div>';
 }
 grid.innerHTML=html;
 $('levelNum').textContent=String(current+1).padStart(2,'0');
 $('levelName').textContent=' / '+level.name[lang==='ar'?1:0];
 $('lives').textContent=String(lives);
 $('moves').textContent=String(turn);
 $('best').textContent=getBest()===null?'—':String(getBest());
 statusEl.textContent=message;
 statusEl.style.color=kind==='danger'?'var(--danger)':kind==='success'?'var(--neon)':'var(--mute)';
 $('boardMission').textContent=got?t('escape'):t('mission');
 $('laserPhase').textContent=t(active.size?'scanning':'passed');
 $('securityState').textContent=t(active.size?'markOn':'markOff');
 $('securityState').classList.toggle('alert',active.size>0);
 grid.setAttribute('aria-label',(lang==='ar'?'خزنة ':'Vault ')+(current+1)+', '+t(got?'escape':'mission')+'. '+turn+' moves.');
}
function setLocale(next){
 lang=next;document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';
 $('langBtn').textContent=lang==='ar'?'English':'عربي 🇸🇦';
 document.querySelectorAll('[data-en][data-ar]').forEach(el=>el.textContent=el.dataset[lang]);
 try{localStorage.setItem('ft-lang',lang)}catch(_){}
 if(done||gameOver)showOverlay(done);
 else announce(got?t('jewel'):t('ready'));
 draw();
 document.title=lang==='ar'?'سرقة الجوهرة — فارستك لاب':'Jewel Thief — FarisTech Lab';
}
$('langBtn').addEventListener('click',()=>setLocale(lang==='en'?'ar':'en'));
$('resetBtn').addEventListener('click',()=>startLevel(current));
$('firstBtn').addEventListener('click',()=>startLevel(0));
$('overlayAction').addEventListener('click',()=>{
 const action=$('overlayAction').dataset.action;
 if(action==='next')startLevel(current+1);
 else if(action==='again')startLevel(0);
 else startLevel(current);
});
document.querySelectorAll('[data-dir]').forEach(b=>b.addEventListener('click',()=>move(b.dataset.dir)));
document.addEventListener('keydown',(e)=>{
 if(e.altKey||e.ctrlKey||e.metaKey)return;
 if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;
 const key=e.key.toLowerCase();
 const command={'arrowup':'up','w':'up','arrowdown':'down','s':'down','arrowleft':'left','a':'left','arrowright':'right','d':'right',' ':'wait'}[key];
 if(command){e.preventDefault();move(command)}
 if(key==='r')startLevel(current);
 if(key==='enter'&&$('overlay').hidden===false&&document.activeElement?.tagName!=='BUTTON')$('overlayAction').click();
});
startLevel(0);setLocale(lang);
})();