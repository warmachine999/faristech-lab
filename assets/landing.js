(() => {
  'use strict';
  const $ = (sel) => document.querySelector(sel);
  const html = document.documentElement;
  const copy = {
    en: {
      'nav.work':'Our work','nav.fields':'What we do','nav.circuits':'Circuit lab','nav.about':'About','nav.explore':'Explore lab','nav.studio':'Studio',
      'hero.kicker':'INDEPENDENT ENGINEERING & CREATIVE LAB','hero.line1':'Imagine it.','hero.line2':'Engineer it.','hero.line3':'Make it real.','hero.lead':'A creative playground for serious ideas. We turn curiosity into circuits, software, prototypes, and things you can actually touch.','hero.primary':'Explore our work','hero.secondary':'Launch circuit lab','hero.foot':'Design. Build. Test. Repeat.<br>Curiosity is the starting point.','hero.bottom':"A PLACE FOR WHAT'S NEXT.",
      'visual.status':'SYSTEM ONLINE','visual.label1':'EXPERIMENT IN PROGRESS','visual.label2':'DESIGN / CREATE / ITERATE','visual.footer1':'ALWAYS EXPERIMENTING','visual.footer2':'SCROLL TO DISCOVER ↓',
      'work.title1':'Explore the','work.title2':'extraordinary.','work.intro':'Not just things to look at. Real projects and working tools to experiment with, learn from, and build upon.','work.live':'TRY IT LIVE','work.archive':'OPEN LIBRARY','work.workspace':'WORKSPACE',
      'circuit.preview':'SCHEMATIC PREVIEW','circuit.power':'POWER SOURCE','circuit.on':'ON · LED ACTIVE','circuit.off':'OFF · LED INACTIVE',
      'work.circuitTitle':'Circuit Lab.','work.circuitBody':'Make electricity make sense. Experiment with real circuit concepts in our interactive simulator, from schematics to lifelike views.','work.projectsTitle':'Real builds.','work.projectsBody':'Robotics, microcontrollers, 3D design, and the process behind every experiment.','work.browse':'Explore projects','work.studioTitle':'Maker studio.','work.studioBody':'See our design work, services, and the tools we use to bring concepts to life.','work.openStudio':'Open the studio',
      'fields.title1':'Different worlds.','fields.title2':'One curiosity.','fields.intro':'Great ideas rarely fit in one category. We connect the physical and digital to create something new.',
      'fields.hardware':'Hardware & electronics','fields.hardwareBody':'Circuits, microcontrollers, sensors, and the little details that make devices work in the real world.',
      'fields.software':'Code & connected systems','fields.softwareBody':'Interfaces, websites, smart systems, and code that turns a creative concept into a usable experience.',
      'fields.design':'Design & fabrication','fields.designBody':'3D modeling, practical prototyping, and the art of transforming an idea into something you can hold.',
      'process.title1':'Less talking.','process.title2':'More making.','process.intro':'Every project starts somewhere. Ours start with questions and get better through experiments.','process.one':'Ask what if.','process.oneBody':'Find a problem, chase an idea, and picture a better way.','process.two':'Build a version.','process.twoBody':'Wire it, model it, write it. Ideas become prototypes.','process.three':'Test and evolve.','process.threeBody':"Learn what works, improve what doesn't, and try again.",
      'about.line1':'Made for','about.line2':'the curious.','about.body':"FarisTech Lab is an independent creative engineering space built around one belief: the best way to learn the future is to build it. From first circuits to ambitious prototypes, we're here to keep experimenting.",'about.cta':'Meet the maker',
      'end.title1':'Something amazing','end.title2':'starts with an idea.','end.body':"Take a look around, test a circuit, or explore the work. There's always something new to build.",'end.projects':'Discover projects','end.contact':'Get in touch','footer.tagline':'Imagination is just the beginning.','footer.top':'BACK TO TOP'
    },
    ar: {
      'nav.work':'أعمالنا','nav.fields':'مجالاتنا','nav.circuits':'مختبر الدوائر','nav.about':'عن المختبر','nav.explore':'استكشف المختبر','nav.studio':'الاستوديو',
      'hero.kicker':'مختبر هندسي وإبداعي مستقل','hero.line1':'تخيلها.','hero.line2':'صمّمها.','hero.line3':'حوّلها إلى واقع.','hero.lead':'مساحة إبداعية للأفكار الطموحة. نحوّل الفضول إلى دوائر إلكترونية وبرمجيات ونماذج أولية ومشاريع حقيقية يمكنك لمسها.','hero.primary':'استكشف أعمالنا','hero.secondary':'افتح مختبر الدوائر','hero.foot':'صمّم. ابنِ. اختبر. كرّر.<br>الفضول هو البداية.','hero.bottom':'مساحة لصناعة المستقبل.',
      'visual.status':'النظام يعمل','visual.label1':'تجربة قيد التنفيذ','visual.label2':'صمّم / ابتكر / طوّر','visual.footer1':'تجارب بلا توقف','visual.footer2':'مرّر للاستكشاف ↓',
      'work.title1':'اكتشف مشاريع','work.title2':'خارج المألوف.','work.intro':'ليست مجرد أشياء تشاهدها. مشاريع حقيقية وأدوات تفاعلية تجرّبها وتتعلم منها وتطوّرها.','work.live':'جرّب الآن','work.archive':'مكتبة المشاريع','work.workspace':'مساحة العمل',
      'circuit.preview':'معاينة المخطط','circuit.power':'مصدر الطاقة','circuit.on':'تشغيل · الليد مضيء','circuit.off':'إيقاف · الليد مطفأ',
      'work.circuitTitle':'مختبر الدوائر.','work.circuitBody':'تعلّم الكهرباء بالتجربة. استكشف مفاهيم الدوائر في محاكي تفاعلي، من الرموز التخطيطية إلى الأشكال الواقعية.','work.projectsTitle':'مشاريع حقيقية.','work.projectsBody':'روبوتات ومتحكمات وتصميم ثلاثي الأبعاد، مع خطوات وتفاصيل كل تجربة.','work.browse':'استكشف المشاريع','work.studioTitle':'استوديو التصنيع.','work.studioBody':'تعرّف على أعمال التصميم والخدمات والأدوات التي نحول بها الأفكار إلى واقع.','work.openStudio':'افتح الاستوديو',
      'fields.title1':'مجالات متعددة.','fields.title2':'فضول واحد.','fields.intro':'الأفكار الرائعة لا تنتمي لمجال واحد. نربط العالم الرقمي بالعالم الحقيقي لنبتكر شيئاً جديداً.',
      'fields.hardware':'الإلكترونيات والأجهزة','fields.hardwareBody':'دوائر ومتحكمات وحساسات، والتفاصيل الصغيرة التي تجعل الأجهزة تعمل في الواقع.',
      'fields.software':'البرمجة والأنظمة الذكية','fields.softwareBody':'واجهات ومواقع وأنظمة متصلة وبرمجيات تحول الفكرة إلى تجربة مفيدة.',
      'fields.design':'التصميم والتصنيع','fields.designBody':'نمذجة ثلاثية الأبعاد ونماذج أولية عملية وتحويل الأفكار إلى أشياء ملموسة.',
      'process.title1':'كلام أقل.','process.title2':'صناعة أكثر.','process.intro':'كل مشروع يبدأ بسؤال، ويتحسن بالتجربة خطوة بعد خطوة.','process.one':'اسأل: ماذا لو؟','process.oneBody':'اكتشف تحدياً وتخيّل طريقة أفضل لحلّه.','process.two':'ابنِ نسخة أولية.','process.twoBody':'وصّل وصمّم واكتب الكود. حوّل الفكرة إلى نموذج.','process.three':'اختبر وطوّر.','process.threeBody':'تعلّم مما ينجح وحسّن ما لا ينجح، وجرّب مجدداً.',
      'about.line1':'صُنع من أجل','about.line2':'الفضوليين.','about.body':'فارستك لاب مساحة هندسية وإبداعية مستقلة تؤمن بأن أفضل طريقة لتعلّم المستقبل هي بناؤه. من أول دائرة إلى أكثر النماذج طموحاً، نحن هنا لنواصل التجربة.','about.cta':'تعرّف على المبتكر',
      'end.title1':'كل شيء مذهل','end.title2':'يبدأ بفكرة.','end.body':'تجوّل في الموقع وجرّب دائرة كهربائية أو استكشف مشاريعنا. هناك دائماً شيء جديد نصنعه.','end.projects':'اكتشف المشاريع','end.contact':'تواصل معنا','footer.tagline':'الخيال مجرد البداية.','footer.top':'العودة للأعلى'
    }
  };
  const getSaved = (key, fallback) => {try {return localStorage.getItem(key) || fallback} catch (_) {return fallback}};
  const save = (key, value) => {try {localStorage.setItem(key, value)} catch (_) {}};
  let lang = getSaved('ftl-language','en') === 'ar' ? 'ar' : 'en';
  let power = true;
  const powerState = $('#powerState');
  const circuitDemo = $('#circuitDemo');
  const powerToggle = $('#powerToggle');
  const langToggle = $('#langToggle');
  const themeToggle = $('#themeToggle');
  const menuToggle = $('#menuToggle');
  const mainNav = $('#mainNav');
  function updatePower() {
    if (!circuitDemo || !powerToggle || !powerState) return;
    circuitDemo.dataset.power = power ? 'on' : 'off';
    powerToggle.setAttribute('aria-pressed',String(power));
    powerState.textContent = copy[lang][power?'circuit.on':'circuit.off'];
    const label = lang === 'ar' ? (power?'إطفاء الليد':'تشغيل الليد') : (power?'Turn LED off':'Turn LED on');
    powerToggle.setAttribute('aria-label',label);
  }
  function setLanguage(next) {
    lang = next;
    html.lang = next;
    html.dir = next === 'ar'?'rtl':'ltr';
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const value=copy[lang][el.dataset.i18n];
      if (value === undefined) return;
      if (el.dataset.i18n === 'hero.foot') el.innerHTML=value;
      else el.textContent=value;
    });
    langToggle.textContent=lang==='ar'?'EN':'عربي';
    langToggle.setAttribute('aria-label',lang==='ar'?'Switch to English':'التبديل إلى العربية');
    document.title=lang==='ar'?'فارستك لاب — حوّل الأفكار إلى واقع.':'FarisTech Lab — Ideas made real.';
    save('ftl-language',lang);
    updatePower();
  }
  function setTheme(theme) {
    html.dataset.theme=theme;
    themeToggle.setAttribute('aria-label',theme==='dark'?'Switch to light theme':'Switch to dark theme');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content',theme==='dark'?'#070909':'#eff1eb');
    save('ftl-theme',theme);
  }
  powerToggle?.addEventListener('click',()=>{power=!power;updatePower()});
  langToggle?.addEventListener('click',()=>setLanguage(lang==='en'?'ar':'en'));
  themeToggle?.addEventListener('click',()=>setTheme(html.dataset.theme==='dark'?'light':'dark'));
  menuToggle?.addEventListener('click',()=>{
    const open=mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded',String(open));
    menuToggle.setAttribute('aria-label',open?'Close menu':'Open menu');
  });
  mainNav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    mainNav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded','false');
  }));
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&mainNav?.classList.contains('open')){
      mainNav.classList.remove('open');menuToggle?.setAttribute('aria-expanded','false');menuToggle?.focus();
    }
  });
  const scrollProgress=$('#scrollProgress');
  const header=$('#siteHeader');
  let scrollQueued=false;
  function updateScroll(){
    if(scrollProgress){
      const max=document.documentElement.scrollHeight-window.innerHeight;
      scrollProgress.style.width=(max>0?Math.min(100,Math.max(0,window.scrollY/max*100)):0)+'%';
    }
    header?.classList.toggle('scrolled',window.scrollY>30);
    scrollQueued=false;
  }
  window.addEventListener('scroll',()=>{
    if(!scrollQueued){scrollQueued=true;requestAnimationFrame(updateScroll)}
  },{passive:true});
  updateScroll();
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if('IntersectionObserver' in window&&!reduced){
    const obs=new IntersectionObserver(entries=>{
      for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('visible');obs.unobserve(entry.target)}
    },{threshold:.1,rootMargin:'0px 0px -20px 0px'});
    document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
  }else document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));
  const art=$('#heroArt');
  if(art&&!reduced&&window.matchMedia('(hover: hover) and (pointer: fine)').matches){
    const visual=art.querySelector('.visual-shell');
    let frame=null;
    art.addEventListener('pointermove',e=>{
      if(frame)cancelAnimationFrame(frame);
      frame=requestAnimationFrame(()=>{
        const rect=art.getBoundingClientRect();
        const x=(e.clientX-rect.left)/rect.width-.5;
        const y=(e.clientY-rect.top)/rect.height-.5;
        visual.style.transform='rotateY('+(-x*6)+'deg) rotateX('+(y*6)+'deg)';
      });
    });
    art.addEventListener('pointerleave',()=>{if(frame)cancelAnimationFrame(frame);visual.style.transform=''});
  }
  const year=$('#year');if(year)year.textContent=String(new Date().getFullYear());
  setTheme(getSaved('ftl-theme','dark')==='light'?'light':'dark');
  setLanguage(lang);
})();