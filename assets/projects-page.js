/* FarisTech Lab project pages: localization and navigation only.
   Project data/rendering remains in the original project page scripts. */
(() => {
  'use strict';
  const doc=document.documentElement;
  const params=new URLSearchParams(window.location.search);
  const stored=(() => {try{return localStorage.getItem('ft-lang')}catch(_){return null}})();
  const lang=params.get('lang')==='ar'?'ar':params.get('lang')==='en'?'en':stored==='ar'?'ar':'en';
  doc.lang=lang;doc.dir=lang==='ar'?'rtl':'ltr';
  document.querySelectorAll('[data-en][data-ar]').forEach(el=>{
    const copy=el.dataset[lang];
    if(copy!==undefined)el.innerHTML=copy;
  });
  const localeButton=document.getElementById('langBtn');
  if(localeButton){
    localeButton.textContent=lang==='ar'?'English':'عربي 🇸🇦';
    localeButton.setAttribute('aria-label',lang==='ar'?'Switch to English':'خلّ الموقع بالعربي');
    localeButton.addEventListener('click',()=>{
      const next=lang==='ar'?'en':'ar';
      try{localStorage.setItem('ft-lang',next)}catch(_){}
      const url=new URL(window.location.href);
      url.searchParams.set('lang',next);
      window.location.assign(url.pathname+url.search+url.hash);
    });
  }
  const search=document.getElementById('search');
  if(search){
    search.placeholder=lang==='ar'?'ابحث عن مشروع، أداة، ESP32، PCB…':'Search projects, topics, ESP32, PCB…';
    search.setAttribute('aria-label',lang==='ar'?'ابحث في المشاريع':'Search projects');
    const cat=document.getElementById('category'),level=document.getElementById('level');
    if(cat?.options[0])cat.options[0].textContent=lang==='ar'?'كل التصنيفات':'All categories';
    if(level?.options[0])level.options[0].textContent=lang==='ar'?'كل المستويات':'All levels';
    for(const option of level?.options||[]){
      const localized={Beginner:'مبتدئ',Intermediate:'متوسط',Advanced:'متقدم'};
      if(lang==='ar'&&localized[option.value])option.textContent=localized[option.value];
    }
    const summary=document.querySelector('.library-summary strong');
    if(summary&&typeof PROJECTS_DATA!=='undefined')summary.textContent=String(PROJECTS_DATA.length).padStart(2,'0');
    document.title=lang==='ar'?'المشاريع والتجارب — فارستك لاب':'Projects & Experiments — FarisTech Lab';
  }
  if(document.body.dataset.projectPage==='detail'){
    const mappings=[
      ['.sectionHead h2','From idea to prototype.','من الفكرة للنموذج.'],
      ['.storyCard:nth-child(1) h3','What is this project?','وش فكرة المشروع؟'],
      ['.storyCard:nth-child(2) h3','What needed solving?','وش المشكلة اللي بنحلّها؟'],
      ['.storyCard:nth-child(3) h3','How I built it','كيف صممته؟'],
      ['.storyCard:nth-child(4) h3','What happened in the end?','وش كانت النتيجة؟'],
      ['.sideCard:nth-child(1) h3','Project information','معلومات المشروع'],
      ['.sideCard:nth-child(2) h3','Parts / Components','القطع والمكونات'],
      ['.section#mediaSection .sectionHead h2','Photos & screenshots.','الصور واللقطات.'],
      ['.more + div .btn','Browse all project areas →','شوف كل مجالات المشاريع →'],
      ['.cta h2','Want to build something like this?','ودّك تسوي مشروع زي هذا؟'],
      ['.cta p','Tell me what you want to make and we can start from there.','قل لي وش ودّك تصنع ونبدأ من الفكرة.'],
      ['.sectionHead small','THE BUILD NOTES','تفاصيل الشغل'],
      ['.section#mediaSection .sectionHead small','PROJECT MEDIA','صور المشروع']
    ];
    for(const [selector,en,ar] of mappings){
      const element=document.querySelector(selector);
      if(element&&!element.hasAttribute('data-en'))element.textContent=lang==='ar'?ar:en;
    }
  }
  const menu=document.getElementById('menuBtn'),links=document.getElementById('projectLinks');
  if(menu&&links){
    const sync=()=>{
      const open=links.classList.contains('open');
      menu.setAttribute('aria-expanded',String(open));
      menu.setAttribute('aria-label',lang==='ar'?(open?'اقفل القائمة':'افتح القائمة'):(open?'Close navigation':'Open navigation'));
    };
    menu.addEventListener('click',sync);
    links.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
      links.classList.remove('open');sync();
    }));
    document.addEventListener('keydown',e=>{
      if(e.key==='Escape'&&links.classList.contains('open')){links.classList.remove('open');sync();menu.focus()}
    });
    sync();
  }
})();