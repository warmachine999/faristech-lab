(()=>{
const themes=['light','dark','caramel','matcha','cyber'],themeNames={en:['Light','Dark','Caramel','Matcha','Cyber'],ar:['فاتح','داكن','كراميل','ماتشا','سايبر']};
const projects=[
{icon:'⌘',name:['3D Models','نماذج ثلاثية الأبعاد'],category:['3D Design & Manufacturing','تصميم وتصنيع ثلاثي الأبعاد'],level:['Intermediate','متوسط'],desc:['Custom 3D models, printable parts and real-life objects.','تصاميم ثلاثية الأبعاد مخصصة وقطع قابلة للطباعة واستخدامها بالحياة اليومية.'],tools:'SolidWorks · Bambu Studio · FDM Printing',overview:['Functional 3D design from a rough idea, photo, or measurement to a part that can actually be printed and used.','تصميم عملي يبدأ من فكرة أو صورة أو مقاس، وينتهي بقطعة قابلة للطباعة والاستخدام.'],challenge:['Turn real-world dimensions and mechanical requirements into a clean model while keeping tolerances, strength, and printability in mind.','تحويل المقاسات والمتطلبات الميكانيكية إلى تصميم مضبوط مع مراعاة التحمل وسهولة الطباعة.'],build:['Sketch the concept, model the geometry, test clearances, prepare the print, then revise after a physical fit check.','نرسم الفكرة، نبني المجسم، نراجع الخلوصات، نجهز الطباعة، وبعدها نختبر القطعة ونحسنها.'],result:['A practical printable design with sensible tolerances and a repeatable CAD-to-print workflow.','تصميم قابل للطباعة مع مقاسات مناسبة وخطوات واضحة من CAD إلى القطعة النهائية.']},
{icon:'▤',name:['PCB Design','تصميم PCB'],category:['PCB Design & Electronics','تصميم لوحات إلكترونية'],level:['Intermediate','متوسط'],desc:['Simple boards to more complex multi-layer PCB designs.','تصميم لوحات إلكترونية بسيطة أو متعددة الطبقات.'],tools:'EasyEDA · KiCad · Schematic Design',overview:['Custom electronics boards from schematic planning through PCB layout and practical bring-up.','تصميم لوحات إلكترونية مخصصة من المخطط إلى توزيع القطع وتجهيز اللوحة للاختبار.'],challenge:['Keep power, signal routing, connectors, footprints, and component placement clear while avoiding common layout mistakes.','تنظيم التغذية والإشارات والموصلات ومواقع القطع وتجنب أخطاء التصميم.'],build:['Create the schematic, verify nets and footprints, place components, route the board, run checks, then prepare fabrication files.','نرسم الدائرة، نراجع التوصيلات والبصمات، نوزع القطع، نرسم المسارات، ثم نفحص الملفات.'],result:['A clean board layout that is easier to assemble, test, and improve in the next revision.','لوحة مرتبة وأسهل في التجميع والاختبار والتطوير في الإصدار التالي.']},
{icon:'⌁',name:['ESP32 Projects','مشاريع ESP32'],category:['Embedded Systems & IoT','الأنظمة المضمنة وإنترنت الأشياء'],level:['Intermediate','متوسط'],desc:['Sensors, dashboards, IoT and microcontroller experiments.','حساسات ولوحات تحكم وإنترنت الأشياء وتجارب المتحكمات.'],tools:'ESP32 · C++ · Wi-Fi · Sensors',overview:['ESP32 projects that connect sensors, controls, dashboards, and physical hardware into one working system.','مشاريع تجمع الحساسات والتحكم ولوحات البيانات والقطع الإلكترونية باستخدام ESP32.'],challenge:['Make hardware, firmware, networking, and real-time sensor behavior work together reliably.','جعل الهاردوير والفيرموير والشبكة وقراءات الحساسات تعمل مع بعض بشكل ثابت.'],build:['Wire and verify hardware, test each sensor alone, write modular firmware, add networking, then integrate the system.','نوصل القطع ونتأكد منها، نختبر كل حساس، نكتب الكود بشكل منظم، ثم نربط النظام.'],result:['A connected prototype with clear sensor data and practical controls.','نموذج متصل يعرض بيانات واضحة ويوفر تحكماً عملياً.']},
{icon:'A',name:['Arduino','أردوينو'],category:['Embedded Electronics','إلكترونيات مدمجة'],level:['Beginner','مبتدئ'],desc:['Controllers, LEDs, motors and learning-focused builds.','متحكمات وLED ومحركات ومشاريع للتعلم والتجربة.'],tools:'Arduino · C++ · Breadboard · Electronics',overview:['Arduino experiments focused on understanding electronics by building working circuits.','تجارب أردوينو لفهم الإلكترونيات من خلال بناء دوائر تعمل فعلياً.'],challenge:['Keep wiring, code, and component behavior clear enough to learn from while producing a useful result.','ترتيب التوصيلات والكود وسلوك القطع بطريقة سهلة للفهم وتعطي نتيجة مفيدة.'],build:['Test one component at a time, combine the working pieces, add logic, then improve the layout and code.','نختبر كل قطعة لحالها، نجمع الأجزاء الناجحة، نضيف المنطق، وبعدها نحسن التوصيل والكود.'],result:['A beginner-friendly prototype that makes the relationship between code and hardware clear.','نموذج مناسب للتعلم ويوضح العلاقة بين الكود والهاردوير.']},
{icon:'⌖',name:['Sensors & Measurement','الحساسات والقياس'],category:['Sensors & Measurement','الحساسات والقياس'],level:['Beginner','مبتدئ'],desc:['Distance, temperature, motion and other sensor builds.','مشاريع قياس المسافة والحرارة والحركة وحساسات ثانية.'],tools:'Distance · Temperature · Motion · I²C',overview:['Sensor experiments that measure the real world and turn raw readings into useful information or actions.','تجارب تقيس العالم الحقيقي وتحول القراءات إلى معلومات أو أوامر مفيدة.'],challenge:['Get stable readings, understand calibration, and separate real changes from noisy measurements.','الحصول على قراءات ثابتة ومعايرة الحساس وفهم الفرق بين التغير الحقيقي والتشويش.'],build:['Verify the sensor, log raw values, calibrate thresholds, then connect readings to a display or controller.','نفحص الحساس، نسجل القراءات، نضبط الحدود، وبعدها نربطه بشاشة أو متحكم.'],result:['A predictable measurement system ready to become part of a larger project.','نظام قياس واضح ويمكن إضافته لمشروع أكبر.']},
{icon:'◈',name:['Robotics','الروبوتات'],category:['Mechatronics & Robotics','الميكاترونكس والروبوتات'],level:['Advanced','متقدم'],desc:['Servos, motors, sensors and robotic mechanisms.','سيرفو ومحركات وحساسات وآليات روبوتية.'],tools:'Servos · Motors · Sensors · ESP32',overview:['Robot mechanisms combining motion, electronics, sensors, and control logic.','آليات روبوتية تجمع الحركة والإلكترونيات والحساسات ومنطق التحكم.'],challenge:['Mechanical alignment, servo ranges, power delivery, wiring, and software must work together.','ضبط الحركة ومدى السيرفو والطاقة والتوصيلات والبرنامج بحيث تشتغل كلها بتناغم.'],build:['Prototype the mechanism, establish safe motion limits, test one axis at a time, then coordinate the system.','نبني الآلية، نحدد حدود الحركة، نختبر كل محور لحاله، ثم ننسق النظام كامل.'],result:['A robot subsystem that is easier to troubleshoot and expand.','نظام روبوتي أسهل في الفحص والتطوير.']},
{icon:'▣',name:['Displays & Interfaces','الشاشات والواجهات'],category:['Displays & Interfaces','الشاشات والواجهات'],level:['Intermediate','متوسط'],desc:['LCD, OLED, TFT and user-interface experiments.','تجارب LCD وOLED وTFT وتصميم واجهات المستخدم.'],tools:'OLED · TFT · LCD · UI Design',overview:['Small displays and control interfaces that make sensor data and device states clear.','شاشات صغيرة وواجهات تحكم تعرض بيانات الحساسات وحالة الجهاز بشكل مفهوم.'],challenge:['Fit useful information into a small screen without clutter while keeping updates responsive.','عرض المعلومات المهمة على شاشة صغيرة بدون زحمة مع تحديث سريع.'],build:['Verify communication, design the information layout, then add live values, states, and interaction.','نتأكد من الاتصال، نصمم ترتيب المعلومات، ثم نضيف القراءات والحالات والتفاعل.'],result:['A clean embedded interface that makes hardware easier to use.','واجهة واضحة تخلي استخدام الجهاز أسهل.']},
{icon:'◎',name:['RFID & NFC','RFID و NFC'],category:['RFID & NFC','RFID و NFC'],level:['Intermediate','متوسط'],desc:['Reader/writer experiments, tags and smart identification ideas.','تجارب قراءة وكتابة البطاقات وأفكار التعريف الذكي.'],tools:'RFID · NFC · ESP32 · Tags',overview:['RFID and NFC experiments for tags, identification, access concepts, and quick digital links.','تجارب RFID وNFC للبطاقات والتعريف والربط السريع بالخدمات الرقمية.'],challenge:['Read tags reliably and keep the user flow simple.','قراءة البطاقات بشكل ثابت وتسهيل تجربة الاستخدام.'],build:['Test the reader, identify tag types, read UIDs/data, then connect the result to a useful action.','نختبر القارئ، نحدد نوع البطاقة، نقرأ البيانات، ثم نربطها بوظيفة مفيدة.'],result:['A practical RFID/NFC workflow ready for a larger build.','طريقة عمل عملية يمكن تطويرها لمشروع أكبر.']}
,
{icon:'♟',name:['LumiMate Smart Chessboard','LumiMate رقعة الشطرنج الذكية'],category:['Smart Chess & Learning','شطرنج ذكي وتعليمي'],level:['In development','قيد التطوير'],desc:['A light-guided chessboard designed to help beginners learn, avoid illegal moves and record games automatically.','رقعة شطرنج بإضاءة إرشادية تساعد المبتدئين يتعلموا، ويتجنبوا النقلات الخاطئة، وتسجل اللعب تلقائياً.'],tools:'ESP32-WROOM-32U · 64 reed switches · 64 RGB LEDs · Web dashboard',overview:['LumiMate combines an 8×8 sensor board, addressable lighting and a web interface. It is designed to guide players through legal moves and keep a digital move history.','LumiMate تجمع بين رقعة 8×8 بحساسات وإضاءة قابلة للتحكم وواجهة ويب. الفكرة إنها ترشد اللاعب للحركات القانونية وتحفظ سجل النقلات رقمياً.'],challenge:['Detect piece placement reliably, identify square changes, guide beginners without interrupting play, and make move recording easier than writing notation by hand.','التحدي هو قراءة أماكن القطع بدقة، ومعرفة المربعات اللي تغيرت، ومساعدة المبتدئ بدون ما تقطع اللعب، وتسجيل النقلات بدل الكتابة اليدوية.'],build:['The planned system uses a reed switch under each square, an RGB LED per square, an ESP32 controller and a browser dashboard for board state, history and learning guidance.','النظام يستخدم حساس Reed تحت كل مربع، وLED RGB لكل مربع، ومتحكم ESP32، ولوحة ويب تعرض حالة الرقعة وسجل النقلات والإرشادات التعليمية.'],result:['A smart-chess concept focused on beginner education, automatic move notation and clear visual guidance. External chess-platform integration remains a planned capability, not a confirmed live connection.','فكرة شطرنج ذكي تركّز على تعليم المبتدئين وتسجيل النقلات تلقائياً والإرشاد البصري. الربط مع منصات الشطرنج ميزة مخطط لها وليست اتصالاً مباشراً مؤكداً حالياً.']},
{icon:'⌁',name:['Universal Hardware Lab','مختبر الأجهزة الشامل'],category:['Embedded Systems & Test Platform','أنظمة مدمجة ومنصة اختبار'],level:['Concept / in development','فكرة قيد التطوير'],desc:['A reusable ESP32-C6 bench station intended to test common sensors, displays, LEDs and modules from one firmware.','محطة اختبار قابلة لإعادة الاستخدام باستخدام ESP32-C6 لفحص الحساسات والشاشات والـLED والوحدات من فيرموير واحد.'],tools:'ESP32-C6 Super Mini · Multi-pin ports · Sensor/display modules',overview:['A planned bench-top hardware station that keeps an ESP32-C6 installed and provides reusable multi-pin ports for quick experiments.','محطة تجارب مخطط لها، يكون فيها ESP32-C6 ثابت ويوجد منافذ متعددة الأطراف لتجارب الهاردوير بسرعة.'],challenge:['Reduce repeated firmware uploads and make it easier to identify, test and compare modules without rebuilding the setup each time.','تقليل الحاجة لرفع كود جديد كل مرة، وتسهيل التعرف على الوحدات وفحصها ومقارنتها بدون إعادة تركيب التجربة.'],build:['The concept uses a single firmware with a local dashboard, port profiles and guided test routines. Automatic detection depends on each module and its identification method.','الفكرة تعتمد على فيرموير واحد ولوحة تحكم محلية وملفات إعداد للمنافذ واختبارات موجهة. التعرف التلقائي يعتمد على نوع الوحدة وطريقة تعريفها.'],result:['A reusable electronics learning and test platform concept. It is presented as in development, not as a completed universal auto-detection product.','منصة قابلة لإعادة الاستخدام للتعلم وفحص الإلكترونيات. المشروع قيد التطوير وليس منتجاً مكتملاً يتعرف تلقائياً على كل القطع.']},
{icon:'▣',name:['Faris Hack Handheld','Faris Hack جهاز محمول'],category:['Portable Electronics Tool','أداة إلكترونيات محمولة'],level:['Concept / in development','فكرة قيد التطوير'],desc:['A compact ESP32-S3 handheld concept with a small display, joystick and modular electronics features.','فكرة جهاز إلكترونيات محمول صغير باستخدام ESP32-S3 مع شاشة وعصا تحكم ووحدات إضافية.'],tools:'ESP32-S3 · OLED · microSD · Joystick · RFID · IR',overview:['A portable interface concept for organizing electronics experiments and module tools in one handheld device.','واجهة محمولة لتنظيم تجارب الإلكترونيات وأدوات الوحدات المختلفة في جهاز واحد.'],challenge:['Fit the controls, display, storage and expansion modules into a compact enclosure while keeping the interface understandable.','تجميع أزرار التحكم والشاشة والتخزين والوحدات الإضافية داخل حجم صغير مع واجهة سهلة وواضحة.'],build:['The current concept centers on an ESP32-S3, a small OLED, microSD storage, joystick controls and optional RFID/IR modules.','التصميم الحالي يعتمد على ESP32-S3 وشاشة OLED صغيرة وذاكرة microSD وعصا تحكم ووحدات RFID وIR اختيارية.'],result:['A modular handheld electronics project concept. Individual functions require their matching hardware and firmware and should not be assumed to be fully implemented.','مشروع جهاز محمول قابل للتوسعة. كل وظيفة تحتاج الهاردوير والفيرموير المناسب، وما نفترض إنها كلها مكتملة حالياً.']}];
const services=[
{icon:'⌘',key:'3D Design',name:['3D Design','تصميم ثلاثي الأبعاد'],desc:['Custom parts, cases, brackets, school projects and printable objects.','قطع وأغطية وحوامل ومشاريع مدرسية وأشياء قابلة للطباعة.'],price:['From 10 SAR / simple model','من 10 ريال / نموذج بسيط'],message:['Hi FarisTech X! I want a custom 3D model. I can send dimensions, a photo or a sketch here:','هلا FarisTech X! أبغى تصميم 3D مخصص. أقدر أرسل المقاسات أو صورة أو رسم هنا:']},
{icon:'▤',key:'PCB Design',name:['PCB Design','تصميم PCB'],desc:['One-layer boards through more complex multi-layer PCB designs.','من لوحة بطبقة واحدة إلى تصاميم PCB متعددة الطبقات.'],price:['From 15 SAR / 1 layer','من 15 ريال / طبقة واحدة'],message:['Hi FarisTech X! I need help designing a PCB. Here are the circuit requirements/components:','هلا FarisTech X! أبغى مساعدة في تصميم PCB. هذي متطلبات الدائرة والقطع:']},
{icon:'⌁',key:'Electronics',name:['Electronics','إلكترونيات'],desc:['ESP32, Arduino, sensors, displays, RFID, LEDs, motors and prototypes.','ESP32 وأردوينو وحساسات وشاشات وRFID وLED ومحركات ونماذج أولية.'],price:['From 20 SAR / simple build','من 20 ريال / مشروع بسيط'],message:['Hi FarisTech X! I have an electronics project/question. These are the parts and what I want it to do:','هلا FarisTech X! عندي مشروع إلكترونيات أو سؤال. هذي القطع والشي اللي أبغاه يسويه:']},
{icon:'✦',key:'Robotics',name:['Robotics','روبوتات'],desc:['Servos, motors, sensors, control systems and robot mechanisms.','سيرفو ومحركات وحساسات وأنظمة تحكم وآليات روبوتية.'],price:['From 50 SAR / simple build','من 50 ريال / مشروع بسيط'],message:['Hi FarisTech X! I want to discuss a robotics build. My idea is:','هلا FarisTech X! أبغى أتكلم عن مشروع روبوت. فكرتي هي:']},
{icon:'◫',key:'Consultation / Help',name:['Consultation & Technical Help','استشارة ومساعدة تقنية'],desc:['Advice, troubleshooting, project planning and custom technical help.','استشارة وحل مشاكل وتخطيط مشاريع ومساعدة تقنية حسب الطلب.'],price:['Quote / request','السعر حسب الطلب'],message:['Hi FarisTech X! I need technical advice/help with this problem:','هلا FarisTech X! أحتاج استشارة أو مساعدة تقنية في المشكلة هذي:']},
{icon:'⌘',key:'Website Making',name:['Website Making','تصميم مواقع'],desc:['Responsive websites for portfolios, school projects and small businesses.','مواقع متجاوبة للملفات الشخصية والمشاريع المدرسية والأعمال الصغيرة.'],price:['From 75 SAR / simple website','من 75 ريال / موقع بسيط'],message:['Hi FarisTech X! I want a website. The type of website, pages and style I need are:','هلا FarisTech X! أبغى موقع. نوع الموقع والصفحات والتصميم اللي أحتاجه:']},
{icon:'⚙',key:'Dashboards & IoT',name:['Dashboards & IoT','لوحات تحكم وإنترنت الأشياء'],desc:['Sensor dashboards, control panels, data displays and connected prototypes.','لوحات حساسات وتحكم وعرض بيانات ونماذج متصلة.'],price:['From 40 SAR / simple dashboard','من 40 ريال / لوحة بسيطة'],message:['Hi FarisTech X! I want a dashboard or IoT project. The sensors, controls and features I need are:','هلا FarisTech X! أبغى لوحة تحكم أو مشروع IoT. الحساسات والتحكم والميزات المطلوبة:']},
{icon:'✧',key:'Prototyping',name:['Prototyping','النماذج الأولية'],desc:['Plan, design, build, test and improve an idea into a working prototype.','نخطط ونصمم ونبني ونختبر ونطور الفكرة إلى نموذج يعمل.'],price:['Quote / project','السعر حسب المشروع'],message:['Hi FarisTech X! I have an idea I want to turn into a working prototype. Here is the idea:','هلا FarisTech X! عندي فكرة أبغى أحولها إلى نموذج يعمل. هذي تفاصيلها:']}
];
const $=s=>document.querySelector(s),langKey='ftx-studio-lang',themeKey='ftx-studio-theme';let lang=localStorage.getItem(langKey)||'en',theme=localStorage.getItem(themeKey)||'dark';
const wa=(message)=>'https://wa.me/966509347473?text='+encodeURIComponent(message+(lang==='en'?'\n\nStarting prices are minimums. Final price depends on complexity, materials, size and revisions.':'\n\nالأسعار المعروضة أسعار بداية وحد أدنى. السعر النهائي يعتمد على التعقيد والخامات والحجم والتعديلات.'));
function setTheme(next){theme=themes.includes(next)?next:'dark';document.documentElement.dataset.theme=theme;localStorage.setItem(themeKey,theme);const i=themes.indexOf(theme);const b=$('#themeBtn');if(b)b.textContent=(themeNames[lang][i]||theme)+' ◈'}
function setLang(next){lang=next==='ar'?'ar':'en';localStorage.setItem(langKey,lang);document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.querySelectorAll('[data-en]').forEach(el=>{const val=el.dataset[lang];if(val!==undefined)el.innerHTML=val});const l=$('#langBtn');if(l)l.textContent=lang==='en'?'حجازي':'English';l.title=lang==='en'?'Switch to Hijazi Arabic':'التبديل إلى الإنجليزية';setTheme(theme);renderPage();refreshGamesLanguage()}
function header(){const current=document.body.dataset.page;document.querySelectorAll('.navlinks a').forEach(a=>a.classList.toggle('active',a.dataset.nav===current));$('#themeBtn')?.addEventListener('click',()=>setTheme(themes[(themes.indexOf(theme)+1)%themes.length]));$('#langBtn')?.addEventListener('click',()=>setLang(lang==='en'?'ar':'en'));$('#menuBtn')?.addEventListener('click',()=>$('.navlinks')?.classList.toggle('open'));document.querySelectorAll('.navlinks a').forEach(a=>a.addEventListener('click',()=>$('.navlinks')?.classList.remove('open')));setTheme(theme)}
function projectCards(){const root=$('#projectGrid');if(!root)return;root.innerHTML=projects.map((p,i)=>'<a class="card" href="project.html?id='+i+'"><div class="projectmeta"><span>PROJECT / '+String(i+1).padStart(2,'0')+'</span><span class="tag">'+p.level[lang==='ar'?1:0]+'</span></div><div class="cardicon">'+p.icon+'</div><h3>'+p.name[lang==='ar'?1:0]+'</h3><p>'+p.desc[lang==='ar'?1:0]+'</p><p class="mono" style="margin-top:16px">'+p.tools+'</p><span class="btn soft">'+(lang==='ar'?'التفاصيل ↗':'Explore project ↗')+'</span></a>').join('')}
function serviceCards(){const root=$('#serviceGrid');if(!root)return;root.innerHTML=services.map((s,i)=>'<article class="card"><div class="cardicon">'+s.icon+'</div><h3>'+s.name[lang==='ar'?1:0]+'</h3><p>'+s.desc[lang==='ar'?1:0]+'</p><div class="price">'+s.price[lang==='ar'?1:0]+'<small>'+(lang==='ar'?'سعر بداية':'Starting price')+'</small></div><a class="btn primary" target="_blank" rel="noopener" href="'+wa(s.message[lang==='ar'?1:0]+' ')+'">'+(lang==='ar'?'اسأل عن الخدمة ↗':'Ask about this ↗')+'</a></article>').join('')}
function projectDetail(){const root=$('#projectDetail');if(!root)return;const id=Math.max(0,Math.min(projects.length-1,Number(new URLSearchParams(location.search).get('id')||0))),p=projects[id],k=lang==='ar'?1:0;document.title=p.name[k]+' — FarisTech X';root.innerHTML='<div class="mono">PROJECT / '+String(id+1).padStart(2,'0')+'</div><h1>'+p.name[k]+'</h1><p class="lead">'+p.desc[k]+'</p><div class="detailgrid"><div><article class="sidebox"><div class="mono">01 / OVERVIEW</div><h2>'+(lang==='ar'?'عن المشروع':'What is this project?')+'</h2><p>'+p.overview[k]+'</p></article><article class="sidebox"><div class="mono">02 / CHALLENGE</div><h2>'+(lang==='ar'?'التحدي':'The challenge')+'</h2><p>'+p.challenge[k]+'</p></article><article class="sidebox"><div class="mono">03 / BUILD PROCESS</div><h2>'+(lang==='ar'?'طريقة العمل':'How it is built')+'</h2><p>'+p.build[k]+'</p></article><article class="sidebox"><div class="mono">04 / RESULT</div><h2>'+(lang==='ar'?'النتيجة':'The result')+'</h2><p>'+p.result[k]+'</p></article></div><aside><div class="sidebox"><h3>'+(lang==='ar'?'معلومات المشروع':'Project information')+'</h3><p><b>'+(lang==='ar'?'التصنيف':'Category')+':</b> '+p.category[k]+'</p><p><b>'+(lang==='ar'?'المستوى':'Level')+':</b> '+p.level[k]+'</p><p><b>'+(lang==='ar'?'الأدوات':'Tools')+':</b> '+p.tools+'</p></div><div class="sidebox"><h3>'+(lang==='ar'?'اسأل عن مشروع مشابه':'Discuss a similar build')+'</h3><p>'+(lang==='ar'?'أرسل تفاصيل فكرتك على واتساب.':'Send your project idea and requirements on WhatsApp.')+'</p><a class="btn primary" target="_blank" href="'+wa((lang==='ar'?'هلا FarisTech X! أبغى أسأل عن مشروع ':'Hi FarisTech X! I want to ask about the project ')+p.name[k]+'. ')+'">'+(lang==='ar'?'واتساب ↗':'WhatsApp ↗')+'</a></div></aside></div>'}
function renderPage(){projectCards();serviceCards();projectDetail();document.querySelectorAll('[data-wa]').forEach(a=>a.href=wa(a.dataset.wa))}
function setupReveal(){if(!('IntersectionObserver'in window)){document.querySelectorAll('.reveal').forEach(e=>e.classList.add('visible'));return}const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.1});document.querySelectorAll('.reveal').forEach(e=>io.observe(e))}
function background(){const c=$('#themeBg');if(!c)return;const g=c.getContext('2d');let w=0,h=0,t=0,pts=[];function resize(){const d=Math.min(devicePixelRatio||1,1.5);w=innerWidth;h=innerHeight;c.width=w*d;c.height=h*d;c.style.width=w+'px';c.style.height=h+'px';g.setTransform(d,0,0,d,0,0);pts=Array.from({length:Math.max(35,Math.floor(w*h/19000))},(_,i)=>({x:Math.random()*w,y:Math.random()*h,r:1+Math.random()*2,v:.15+Math.random()*.35,p:Math.random()*6.28}))}function frame(){t+=.008;g.clearRect(0,0,w,h);const light=theme==='light'||theme==='matcha',caramel=theme==='caramel',cyber=theme==='cyber';pts.forEach((p,i)=>{p.y+=Math.sin(t+p.p)*p.v*.25;if(!light&&!caramel){p.x+=Math.cos(t*.6+p.p)*p.v*.35}const color=cyber?(i%2?'0,229,255':'189,92,255'):matchaColor();g.fillStyle='rgba('+color+','+(light?.13:caramel?.22:.32)+')';g.beginPath();g.arc(p.x,p.y,p.r,0,Math.PI*2);g.fill();if(cyber&&i%4===0){g.strokeStyle='rgba(0,229,255,.08)';g.beginPath();g.moveTo(p.x,p.y);g.lineTo(p.x+28,p.y-18);g.stroke()}});if(caramel){g.font='14px Georgia';g.fillStyle='rgba(255,190,120,.12)';['V = IR','P = VI','F = ma','E = mc²'].forEach((s,i)=>g.fillText(s,(i*237+t*8)%(w+80),80+i*130))}if(matcha){g.strokeStyle='rgba(83,130,77,.10)';for(let i=0;i<7;i++){g.beginPath();g.ellipse(w*(i+.5)/7,h*.5,55+Math.sin(t+i)*9,18,Math.sin(t*.2+i),0,Math.PI*2);g.stroke()}}requestAnimationFrame(frame)}function matchaColor(){return theme==='matcha'?'75,123,75':theme==='light'?'54,118,146':caramel?'255,173,98':'100,120,255'}resize();addEventListener('resize',resize);requestAnimationFrame(frame)}

function shuffleGameItems(items,rng=Math.random){
 const result=[...items];
 for(let i=result.length-1;i>0;i--){
  const j=Math.floor(rng()*(i+1));
  [result[i],result[j]]=[result[j],result[i]];
 }
 return result;
}
function ohmGameOptions(voltage,resistance,rng=Math.random){
 const answer=Number((voltage/resistance).toFixed(2));
 const unique=new Set([answer]);
 for(const offset of [.5,-.55,1.2,-.3,.75,-1.05,.25]){
  const candidate=Math.max(.01,Number((answer+offset).toFixed(2)));
  if(candidate!==answer)unique.add(candidate);
  if(unique.size>=4)break;
 }
 for(let step=1;unique.size<4;step++)unique.add(Number((answer+step*.37).toFixed(2)));
 return {answer,choices:shuffleGameItems([...unique].slice(0,4),rng)};
}
let refreshGamesLanguage=()=>{};
function games(){
 const memoryGrid=$('#memoryGrid'),ohmQuestion=$('#ohmQuestion'),reactionBtn=$('#reactionBtn');
 if(!memoryGrid&&!ohmQuestion&&!reactionBtn)return;
 const txt=(english,arabic)=>lang==='ar'?arabic:english;
 const status=(id,value)=>{const el=$(id);if(el)el.textContent=value};
 const memorySymbols=['Ω','V','A','⚡','⌁','▤','◈','⌘'];
 let first=null,memoryLock=false,memoryPairs=0,memoryMoves=0,memoryRound=0,memoryTimer=null,memoryPhase='ready';
 function memoryText(){
  const text={
   ready:txt('Find all eight pairs.','ابحث عن الأزواج الثمانية.'),
   first:txt('Pick a second card.','اختر البطاقة الثانية.'),
   miss:txt('Not a match. Try another pair.','مو متطابقين، جرّب زوج ثاني.'),
   match:txt('Nice match! Keep going.','مطابقة ممتازة! كمّل.'),
   won:txt('Excellent! All eight pairs matched.','كفو! طابقت الأزواج الثمانية.')
  };
  return text[memoryPhase];
 }
 function renderMemory(){
  if(!memoryGrid)return;
  status('#memoryScore',memoryPairs+' / 8 · '+txt('Moves: ','المحاولات: ')+memoryMoves);
  status('#memoryStatus',memoryText());
  memoryGrid.querySelectorAll('button').forEach((button,i)=>{
   button.setAttribute('aria-label',button.classList.contains('matched')
    ?txt('Matched: ','تمت المطابقة: ')+button.dataset.s
    :button.classList.contains('open')
     ?txt('Revealed: ','مكشوف: ')+button.dataset.s
     :txt('Hidden card ','بطاقة مخفية ')+(i+1));
  });
 }
 function resetMemory(){
  if(memoryTimer!==null){clearTimeout(memoryTimer);memoryTimer=null}
  memoryRound++;first=null;memoryLock=false;memoryPairs=0;memoryMoves=0;memoryPhase='ready';
  const shuffled=shuffleGameItems([...memorySymbols,...memorySymbols]);
  memoryGrid.innerHTML=shuffled.map((symbol,i)=>'<button class="memorytile" type="button" data-i="'+i+'" data-s="'+symbol+'" aria-label="Hidden card '+(i+1)+'">?</button>').join('');
  memoryGrid.querySelectorAll('button').forEach(button=>{
   button.onclick=()=>{
    if(memoryLock||button.disabled||button.classList.contains('matched')||button.classList.contains('open'))return;
    button.classList.add('open');button.textContent=button.dataset.s;
    if(!first){first=button;memoryPhase='first';renderMemory();return}
    const other=first;first=null;memoryMoves++;
    if(other.dataset.s===button.dataset.s){
     other.classList.add('matched');button.classList.add('matched');
     other.disabled=true;button.disabled=true;memoryPairs++;
     memoryPhase=memoryPairs===8?'won':'match';renderMemory();
     return;
    }
    memoryLock=true;memoryPhase='miss';renderMemory();
    const round=memoryRound;
    memoryTimer=setTimeout(()=>{
     if(round!==memoryRound)return;
     other.classList.remove('open');button.classList.remove('open');
     other.textContent='?';button.textContent='?';memoryLock=false;memoryTimer=null;
     memoryPhase='ready';renderMemory();
    },750);
   };
  });
  renderMemory();
 }
 if(memoryGrid){
  $('#memoryReset').onclick=resetMemory;
  resetMemory();
 }
 let ohmVoltage=0,ohmResistance=0,ohmAnswer=0,ohmQuestionNumber=0,ohmCorrect=0;
 let ohmPhase='choose',ohmTimer=null,ohmRound=0;
 function renderOhm(){
  if(!ohmQuestion)return;
  status('#ohmScore',txt('Solved: ','تم حل: ')+ohmCorrect+' · '+txt('Question ','السؤال ')+ohmQuestionNumber);
  status('#ohmQuestion',txt('Voltage: ','الجهد: ')+ohmVoltage+' V · '+txt('Resistance: ','المقاومة: ')+ohmResistance+' Ω\n'+txt('Find current (I = V ÷ R). Round to 2 decimals.','احسب التيار (I = V ÷ R). قرّب لمنزلتين عشريتين.'));
  status('#ohmStatus',ohmPhase==='correct'
   ?txt('Correct! Next question coming up.','إجابة صحيحة! السؤال التالي قريب.')
   :ohmPhase==='wrong'
    ?txt('Not quite. Try a different choice.','مو صحيح. جرّب خيار ثاني.')
    :txt('Choose the correct current.','اختر قيمة التيار الصحيحة.'));
 }
 function nextOhm(){
  if(ohmTimer!==null){clearTimeout(ohmTimer);ohmTimer=null}
  ohmRound++;ohmQuestionNumber++;ohmPhase='choose';
  ohmVoltage=2+Math.floor(Math.random()*11);
  ohmResistance=2+Math.floor(Math.random()*9);
  const puzzle=ohmGameOptions(ohmVoltage,ohmResistance);ohmAnswer=puzzle.answer;
  const choices=$('#ohmChoices');
  choices.innerHTML=puzzle.choices.map(n=>'<button type="button" data-v="'+n+'">'+n.toFixed(2)+' A</button>').join('');
  choices.querySelectorAll('button').forEach(button=>{
   button.onclick=()=>{
    if(ohmPhase==='correct'||button.disabled)return;
    if(Number(button.dataset.v)===ohmAnswer){
     ohmCorrect++;ohmPhase='correct';
     button.classList.add('correct');
     choices.querySelectorAll('button').forEach(b=>b.disabled=true);
     renderOhm();
     const round=ohmRound;
     ohmTimer=setTimeout(()=>{if(round===ohmRound)nextOhm()},1300);
    }else{
     button.disabled=true;button.classList.add('incorrect');ohmPhase='wrong';
     renderOhm();
    }
   };
  });
  renderOhm();
 }
 if(ohmQuestion){
  $('#ohmNext').onclick=nextOhm;
  nextOhm();
 }
 let reactionPhase='idle',reactionTimer=null,reactionStarted=0,reactionMs=0,reactionBest=0;
 const reactionStorage='ftx-studio-reaction-best';
 try{reactionBest=Number(localStorage.getItem(reactionStorage))||0}catch(error){reactionBest=0}
 function showReaction(){
  if(!reactionBtn)return;
  const names={
   idle:[txt('Press start when ready.','اضغط ابدأ لما تكون جاهز.'),txt('Start test','ابدأ الاختبار')],
   waiting:[txt('Wait for the green signal…','انتظر الإشارة الخضراء…'),txt('Wait…','انتظر…')],
   go:[txt('GREEN! Press the button now!','أخضر! اضغط الآن!'),txt('CLICK NOW!','اضغط الآن!')],
   early:[txt('Too early! Wait for green. Try again.','بدري! انتظر اللون الأخضر وجرب مرة ثانية.'),txt('Try again','جرّب ثانية')],
   result:[txt('Reaction time: ','وقت الاستجابة: ')+reactionMs+' ms',txt('Try again','جرّب ثانية')],
   hidden:[txt('Test cancelled because the tab was hidden.','تم إلغاء الاختبار لأن الصفحة كانت مخفية.'),txt('Start again','ابدأ من جديد')]
  };
  status('#reactionStatus',names[reactionPhase][0]);
  reactionBtn.textContent=names[reactionPhase][1];
  reactionBtn.style.background=reactionPhase==='go'?'var(--good)':'';
  reactionBtn.setAttribute('aria-label',names[reactionPhase][1]);
  status('#reactionBest',reactionBest?txt('Best: ','أفضل وقت: ')+reactionBest+' ms':txt('Best: —','أفضل وقت: —'));
 }
 function startReaction(){
  if(reactionTimer!==null){clearTimeout(reactionTimer);reactionTimer=null}
  reactionPhase='waiting';showReaction();
  reactionTimer=setTimeout(()=>{
   reactionTimer=null;
   if(reactionPhase!=='waiting'||document.hidden)return;
   reactionPhase='go';reactionStarted=performance.now();showReaction();
  },1200+Math.random()*2500);
 }
 if(reactionBtn){
  reactionBtn.onclick=()=>{
   if(reactionPhase==='waiting'){
    if(reactionTimer!==null)clearTimeout(reactionTimer);
    reactionTimer=null;reactionPhase='early';showReaction();return;
   }
   if(reactionPhase==='go'){
    reactionMs=Math.max(0,Math.round(performance.now()-reactionStarted));
    reactionPhase='result';
    if(!reactionBest||reactionMs<reactionBest){
     reactionBest=reactionMs;
     try{localStorage.setItem(reactionStorage,String(reactionBest))}catch(error){}
    }
    showReaction();return;
   }
   startReaction();
  };
  document.addEventListener('visibilitychange',()=>{
   if(document.hidden&&(reactionPhase==='waiting'||reactionPhase==='go')){
    if(reactionTimer!==null)clearTimeout(reactionTimer);
    reactionTimer=null;reactionPhase='hidden';showReaction();
   }
  });
  showReaction();
 }
 refreshGamesLanguage=()=>{renderMemory();renderOhm();showReaction()};
}

function init(){header();setLang(lang);setupReveal();background();games();$('#year')&&($('#year').textContent=new Date().getFullYear())}
document.addEventListener('DOMContentLoaded',init);
})();