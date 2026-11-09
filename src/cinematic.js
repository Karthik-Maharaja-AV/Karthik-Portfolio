import { createLiquidRenderer } from "./liquid-renderer.js";
import { cases as sourceCases } from "./data.js";
import { productModules, renderProduct } from "./product.js";
import { createWorkExplorer } from "./work.js";
import { initExperience } from "./experience.js";
import { renderIcons } from "./icons.js";
import "./contact.js";

const root=document.getElementById('apple-portfolio'),q=s=>root.querySelector(s),qa=s=>[...root.querySelectorAll(s)];
const experienceMotion=initExperience(root);
const viewport=document.scrollingElement,motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
let reduced=motionPreference.matches;
const capabilities={apex:{title:'Apex',sub:'Logic with a human side.',detail:'Business logic and tests. Built to work together.'},flow:{title:'Flow',sub:'Less friction. More flow.',detail:'Guided experiences that make the next step clear.'},data:{title:'Data',sub:'Every field has a purpose.',detail:'Consistent CRM fields. Connected downstream reporting.'}};
const casePresentation=[
  [0,'Less overlap.<br>More clarity.','code','Refactoring calculation automation, with tests around the changed behavior.'],
  [2,'The next step.<br>Made simple.','flow','A guided experience for choosing eligible opportunity partners.'],
  [5,'Every field.<br>Connected.','data','Salesforce-aligned fields and mappings that reach downstream reporting.'],
  [1,'Things change.<br>Forecasts follow.','data','Forecast handling for lost deals and changing quote-line dates.'],
  [3,'The right access.<br>For the right work.','flow','Targeted permissions for integrations and business users.'],
  [4,'Care, beyond<br>the code.','code','Approval groups, retired flags, metadata, and release runbooks.'],
];
const cases=casePresentation.map(([index,title,art,summary])=>{
  const item=sourceCases[index];
  return {category:item.label.toUpperCase(), title, art, heading:item.title,
    description:item.contribution, impact:item.impact, steps:item.approach, summary,
    number:item.number,tags:item.tags,group:item.category==='apex'?'automation':item.category==='experience'?'experience':'access-data'};
});
let capability='apex',product='crm';
const gallery=q('.ap-gallery');
createWorkExplorer(root,cases,()=>{
  const start=work.getBoundingClientRect().top+viewport.scrollTop-q('.ap-local').offsetHeight;
  if(viewport.scrollTop>start)window.scrollTo({top:start,behavior:'instant'});
  measureScroll();
});
function persist(){
  try {sessionStorage.setItem('portfolio-selections',JSON.stringify({capability,product}));} catch {}
}
function setCapability(id,save=true){if(!capabilities[id])return;capability=id;const c=capabilities[id];q('.ap-chip-front strong').textContent=c.title;q('.ap-chip-sub').textContent=c.sub;q('.ap-chip-stage').setAttribute('aria-label',`Layered titanium-style ${c.title} chip; conceptual illustration of Salesforce development`);q('.ap-capability-detail').textContent=c.detail;qa('[data-capability]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.capability===id)));if(save)persist();}
function setProduct(id,save=true){
  if(!productModules[id])return;
  product=id;
  renderProduct(root,id);
  if(save)persist();
}
qa('[data-go]').forEach(b=>b.onclick=()=>{const section=q(`[data-section="${b.dataset.go}"]`);if(section)viewport.scrollTo({top:section.getBoundingClientRect().top+viewport.scrollTop-q('.ap-local').offsetHeight,behavior:reduced?'instant':'smooth'});});
qa('[data-capability]').forEach(b=>b.onclick=()=>setCapability(b.dataset.capability));qa('[data-product]').forEach(b=>b.onclick=()=>setProduct(b.dataset.product));
let frame=0,timer;
function requestScrollRender(){if(!frame)frame=requestAnimationFrame(()=>{frame=0;renderScroll();});}
window.addEventListener('scroll',()=>{requestScrollRender();clearTimeout(timer);timer=setTimeout(persist,300);},{passive:true});
// Pin the hero and gallery within their own native-scroll sections.
const hero=q('.ap-hero'),work=q('.ap-work');
function wrapContents(element,name){const wrap=document.createElement('div');wrap.className=name;while(element.firstChild)wrap.append(element.firstChild);element.append(wrap);return wrap;}
const heroPin=wrapContents(hero,'ap-hero-pin'),workPin=wrapContents(work,'ap-work-pin');
const story=document.createElement('div');story.className='ap-scroll-story';story.innerHTML='<span>Built with intent.</span><h2>Less friction.<br><span>More possibility.</span></h2><p class="ap-film-description">Logic, workflows, and data.<br>Designed to work beautifully together.</p>';heroPin.append(story);
const connected=document.createElement('div');connected.className='ap-connect-word';connected.textContent='Connected.';heroPin.append(connected);
const iris=document.createElement('div');iris.className='ap-iris';iris.setAttribute('aria-hidden','true');iris.innerHTML='<div class="ap-iris-copy"><span>THE WORK, UP CLOSE</span><h2>Good systems.<br>Better experiences.</h2></div>';heroPin.append(iris);
const filmTimeline=document.createElement('div');filmTimeline.className='ap-film-timeline';filmTimeline.setAttribute('aria-hidden','true');filmTimeline.innerHTML='<span>01 DISCOVER</span><span>02 BUILD</span><span>03 CONNECT</span>';heroPin.append(filmTimeline);
const cue=document.createElement('span');cue.className='ap-scroll-cue';cue.textContent='SCROLL TO UNFOLD ↓';heroPin.append(cue);
const introText=q('.ap-intro>p:last-child');
const introWords=introText.textContent.trim().split(/\s+/);introText.replaceChildren();
introWords.forEach((word,i)=>{const span=document.createElement('span');span.className='ap-read-word';span.textContent=word;introText.append(span);if(i<introWords.length-1)introText.append(' ');});
const words=qa('.ap-read-word'),copy=q('.ap-hero-copy'),chip=q('.ap-chip-stack'),chipFront=q('.ap-chip-front'),chipMiddle=q('.ap-chip-middle'),chipBottom=q('.ap-chip-bottom'),model=q('.ap-product-model'),personHeading=q('.ap-person h2');
const clamp=(x,min=0,max=1)=>Math.max(min,Math.min(max,x));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
// A reflective liquid sculpture, ray marched locally with no network assets.
// Its camera, shape, lighting, and composition all follow the scroll position.
let geometry=null,visualY=viewport.scrollTop;
const liquidRenderer=reduced?null:createLiquidRenderer({ root, heroPin });
function measureScroll(){
  const top=el=>el.getBoundingClientRect().top+viewport.scrollTop;
  const height=viewport.clientHeight,header=q('.ap-local').offsetHeight,pin=height-header;
  root.style.setProperty('--ap-pin-height',pin+'px');
  root.classList.toggle('ap-effects',!reduced);
  hero.style.height=reduced?'':Math.round(height*3.65)+'px';
  const galleryTravel=Math.max(0,gallery.scrollWidth-gallery.clientWidth);
  work.style.height=reduced?'':Math.round(pin+(galleryTravel>4?Math.max(height*.8,galleryTravel*.7):0))+'px';
  geometry={height,header,pin,heroStart:top(hero)-header,heroTravel:hero.offsetHeight-pin,workStart:top(work)-header,workTravel:work.offsetHeight-pin,galleryTravel,introStart:top(introText),introHeight:introText.offsetHeight,modelTop:top(model),personTop:top(personHeading)};
  experienceMotion.measure();
  visualY=viewport.scrollTop;
  liquidRenderer?.resize(heroPin.clientWidth,pin);
  renderScroll();
}
function renderScroll(){
  if(!geometry)return;
  const g=geometry,target=viewport.scrollTop;
  const delta=target-visualY;
  visualY=Math.abs(delta)<.2?target:visualY+delta*.19;
  const y=visualY;
  const max=viewport.scrollHeight-viewport.clientHeight;
  root.style.setProperty('--ap-read-progress',(max?y/max*100:0)+'%');
  experienceMotion.render(y,g.height);
  if(reduced)return;
  const progress=clamp((y-g.heroStart)/Math.max(1,g.heroTravel));
  const fade=smooth((progress-.025)/.20),turn=smooth(progress/.62),explode=smooth((progress-.32)/.58);
  copy.style.opacity=String(1-fade);
  copy.style.transform=`translate3d(0,${-70*fade}px,0) scale(${1-.1*fade})`;
  copy.style.visibility=fade>.99?'hidden':'visible';
  const storyIn=smooth((progress-.19)/.16),storyOut=smooth((progress-.48)/.14);
  story.style.opacity=String(storyIn*(1-storyOut));
  story.style.transform=`translate3d(0,${(1-storyIn)*28}px,0)`;
  chip.style.transform=`translateY(${-38*turn}px) rotateX(${42-28*turn}deg) rotateZ(${-33+29*turn}deg) scale(${1+.26*turn})`;
  chipFront.style.transform=`translateZ(${80*explode}px)`;
  chipMiddle.style.transform=`translateZ(${-17-13*explode}px)`;
  chipBottom.style.transform=`translateZ(${-36-65*explode}px)`;
  q('.ap-stage-glow').style.opacity=String(.65+.35*turn);
  cue.style.opacity=String(1-smooth(progress/.18));
  const connectIn=smooth((progress-.53)/.12),connectOut=smooth((progress-.80)/.12);
  connected.style.opacity=String(connectIn*(1-connectOut));
  connected.style.transform=`translateY(${(1-connectIn)*60}px) scale(${.8+.2*connectIn+1.3*connectOut})`;
  const exit=smooth((progress-.86)/.14);
  iris.style.clipPath=`circle(${exit*85}% at 50% 50%)`;
  filmTimeline.style.opacity=String(1-smooth((progress-.84)/.09));
  [...filmTimeline.children].forEach((el,i)=>el.classList.toggle('ap-active-act',i===(progress<.24?0:progress<.58?1:2)));
  q('.ap-chip-picker').style.opacity=String(1-smooth((progress-.62)/.12));
  q('.ap-chip-picker').style.visibility=progress>.75?'hidden':'visible';
  q('.ap-capability-detail').style.opacity=String(1-smooth((progress-.62)/.12));
  q('.ap-local').classList.toggle('ap-film-nav',y<g.heroStart+g.heroTravel+g.pin*.6);
  if(y<g.heroStart+g.heroTravel+g.pin&&y>=0)liquidRenderer?.draw(progress);
  const read=clamp((y+g.height*.79-g.introStart)/(g.height*.48+g.introHeight));
  words.forEach((word,i)=>{word.style.opacity=String(.22+.78*smooth(read*(words.length+5)-i));});
  if(y>=g.workStart-2&&y<=g.workStart+g.workTravel+2){
    gallery.scrollLeft=clamp((y-g.workStart)/Math.max(1,g.workTravel))*g.galleryTravel;
    const center=gallery.scrollLeft+gallery.clientWidth/2;
    qa('.ap-feature').forEach(card=>{const distance=clamp((card.offsetLeft+card.offsetWidth/2-center)/gallery.clientWidth,-1,1);card.style.transform=`perspective(1200px) rotateY(${-distance*11}deg) translateY(${Math.abs(distance)*17}px) scale(${1-Math.abs(distance)*.045})`;});
  }
  const modelIn=smooth((y+g.height*.94-g.modelTop)/(g.height*.75));
  model.style.transform=`perspective(1000px) rotateX(${10*(1-modelIn)}deg) translateY(${35*(1-modelIn)}px) scale(${.95+.05*modelIn})`;
  const personIn=smooth((y+g.height*.9-g.personTop)/(g.height*.55));
  personHeading.style.transform=`translateY(${30*(1-personIn)}px)`;
  if(Math.abs(target-visualY)>.2)requestScrollRender();
}
motionPreference.addEventListener('change',()=>{
  reduced=motionPreference.matches;
  if(reduced){[copy,chip,chipFront,chipMiddle,chipBottom,story,model,personHeading,cue,connected,iris,filmTimeline,q('.ap-chip-picker'),q('.ap-capability-detail'),...qa('.ap-feature')].forEach(el=>el.removeAttribute('style'));words.forEach(el=>el.style.opacity='1');q('.ap-local').classList.remove('ap-film-nav');}
  measureScroll();
});
window.addEventListener('resize',measureScroll,{passive:true});
new ResizeObserver(measureScroll).observe(q('.ap-local'));
new ResizeObserver(measureScroll).observe(model);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)requestScrollRender();});
measureScroll();
let saved={};
try {saved=JSON.parse(sessionStorage.getItem('portfolio-selections')||'{}');} catch {}
setCapability(saved.capability||'apex',false);
setProduct(saved.product||'crm',false);
window.addEventListener('pageshow',()=>requestAnimationFrame(measureScroll));
renderIcons(root);
