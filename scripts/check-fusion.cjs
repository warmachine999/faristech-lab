const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm');
const read=path=>fs.readFileSync(path,'utf8');
const index=read('index.html'),css=read('assets/lab-fusion.css'),interaction=read('assets/lab-fusion.js');
const gamePage=read('jewel-thief.html'),game=read('assets/jewel-thief.js');
const projectLibrary=read('projects.html'),projectDetails=read('project.html');
assert.ok(index.includes('class="atom inventium-atom"')&&index.includes('varon-radiation-effect'),'Original atom and ionization engine must stay');
assert.ok(index.includes('requestAnimationFrame(frame);requestAnimationFrame(animateElectrons);'),'Keep original particle and electron animation loops');
assert.ok(index.includes('function matchaBackground()'),'Matcha background must be animated with the canvas engine');
for(const name of ['dark','light','caramel','tech','matcha']){
 assert.ok(index.includes('data-theme-choice="'+name+'"'),'Theme picker lacks '+name);
 assert.ok(index.includes(name+"Background()"),'Keep animated theme '+name);
}
assert.ok(index.includes('eqText=[')&&index.includes('function caramelBackground()'),'Caramel mathematics scene must be preserved');
assert.ok(index.includes('class="ft-chip-pin top"')&&css.includes('.atom.inventium-atom .core'),'Chip nucleus must use original .core element');
assert.ok(index.includes('const ionTargetSelector=')&&index.includes('.ft-spotlight-card'),'Ionization should include new cards');
assert.ok(index.includes('id="circuitSchematicBtn"')&&index.includes('id="circuitRealisticBtn"'),'Actual circuit simulator must be on home');
assert.ok(index.includes('href="#lab"'),'Circuit card must link to the in-page simulator');
assert.ok(index.includes('href="studio/index.html"'),'Maker Studio must be local');
assert.ok(index.includes('href="jewel-thief.html"'),'Jewel Thief must be local');
assert.ok(index.includes('href="projects.html"'),'Projects should open the library in this site');
assert.ok(index.includes('project.html?id='),'Project card must open details');
assert.ok(projectLibrary.includes('href="project.html?id=')||projectLibrary.includes("href='project.html?id="),'Library cards must open detail pages');
assert.ok(projectDetails.includes('id="overview"'),'Individual project detail must remain functional');
assert.equal((index.match(/class="ft-ribbon-text"/g)||[]).length,2,'Ribbon needs exactly two identical strips for seamless motion');
assert.ok(css.includes('translate3d(-50%,0,0)'),'Ribbon should run as a GPU-composited continuous marquee');
assert.ok(css.includes('@media(prefers-reduced-motion:reduce)'),'Respect user motion preferences');
new vm.Script(interaction,{filename:'assets/lab-fusion.js'});
new vm.Script(game,{filename:'assets/jewel-thief.js'});
assert.ok(gamePage.includes('id="board"')&&gamePage.includes('id="resetBtn"')&&gamePage.includes('assets/jewel-thief.js'),'Game page must load the working controls');
const match=game.match(/const levels=\[([\s\S]*?)\];\nlet lang=/);
assert.ok(match,'Game levels must remain defined as data');
const levels=vm.runInNewContext('['+match[1]+']');
assert.equal(levels.length,3,'Jewel Thief must have three levels');
for(const [i,level] of levels.entries()){
 const rows=level.map,height=rows.length,width=rows[0].length;
 assert.ok(rows.every(row=>row.length===width),'Level '+(i+1)+' rows must have equal width');
 const points={},queue=[],seen=new Set();
 for(let y=0;y<height;y++)for(let x=0;x<width;x++)if('SJE'.includes(rows[y][x]))points[rows[y][x]]=[x,y];
 assert.ok(points.S&&points.J&&points.E,'Level '+(i+1)+' needs start, jewel and exit');
 queue.push(points.S);seen.add(points.S.join(','));
 while(queue.length){
  const [x,y]=queue.shift();
  for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const nx=x+dx,ny=y+dy,k=nx+','+ny;
   if(ny<0||ny>=height||nx<0||nx>=width||rows[ny][nx]==='#'||seen.has(k))continue;
   seen.add(k);queue.push([nx,ny]);
  }
 }
 assert.ok(seen.has(points.J.join(','))&&seen.has(points.E.join(',')),'Level '+(i+1)+' jewel and exit must be reachable');
}
for(const path of ['studio/index.html','studio/projects.html','studio/project.html','studio/pricing.html']){
 const page=read(path);assert.ok(page.includes('href="../index.html"'),'Studio page must link back to main Lab: '+path);
 assert.ok(page.includes('FARISTECH LAB'),'Studio brand should remain consistent: '+path);
}
console.log('Fusion validation passed: preserved features, 5 animated themes, correct local routes, seamless ribbon, 3 reachable game stages.');
