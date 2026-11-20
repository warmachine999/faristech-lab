/* FarisTech Lab premium layer: only small UI enhancements.
   The original simulator, radiation, electrons and background canvas remain untouched. */
(()=>{
'use strict';
const byId=(id)=>document.getElementById(id);
const preview=byId('ftLedDemo'),toggle=byId('ftLedToggle');
let power=true;
function isArabic(){return document.documentElement.lang==='ar'}
function syncPreview(){
 if(!preview||!toggle)return;
 preview.dataset.power=power?'on':'off';
 toggle.setAttribute('aria-pressed',String(power));
 toggle.textContent=isArabic()
  ?(power?'اللمبة شغّالة · اضغط للإطفاء':'اللمبة طافية · اضغط للتشغيل')
  :(power?'LED ON · TAP TO SWITCH':'LED OFF · TAP TO SWITCH');
 toggle.setAttribute('aria-label',isArabic()
  ?(power?'إطفاء اللمبة':'تشغيل اللمبة')
  :(power?'Turn the LED off':'Turn the LED on'));
}
toggle?.addEventListener('click',()=>{power=!power;syncPreview()});
function syncNewCopy(){
 const ar=isArabic();
 for(const el of document.querySelectorAll('[data-ft-en][data-ft-ar]')){
  const value=ar?el.dataset.ftAr:el.dataset.ftEn;
  if(el.hasAttribute('data-theme-choice')){
   // Preserve the icon inside the theme button when translating its label.
   const last=[...el.childNodes].findLast(n=>n.nodeType===Node.TEXT_NODE);
   if(last)last.textContent=' '+value;
   else el.append(document.createTextNode(' '+value));
  }else el.textContent=value;
 }
 syncPreview();
}
byId('langBtn')?.addEventListener('click',()=>{
 // Existing language handler runs first, then new cards use the resulting direction.
 queueMicrotask(syncNewCopy);
});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',syncNewCopy);
else syncNewCopy();
window.addEventListener('pageshow',syncNewCopy);
const themeButton=byId('themeBtn');
themeButton?.addEventListener('click',()=>{
 const menu=byId('themeMenu');
 if(!menu||menu.hidden)return;
 const pressed=menu.querySelector('[aria-pressed="true"]');
 if(pressed)pressed.setAttribute('aria-current','true');
});
const visual=byId('ftLedDemo');
visual?.addEventListener('keydown',(event)=>{
 if((event.key==='Enter'||event.key===' ')&&event.target===visual){
  event.preventDefault();toggle?.click();
 }
});
})();