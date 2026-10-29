import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
gsap.registerPlugin(ScrollTrigger);
const preference=matchMedia('(prefers-reduced-motion: reduce)');
let cleanup=()=>{};
function setup(){cleanup();if(preference.matches)return;
 const lenis=new Lenis({duration:1.05,smoothWheel:true,syncTouch:false});lenis.on('scroll',ScrollTrigger.update);const tick=t=>lenis.raf(t*1000);gsap.ticker.add(tick);gsap.ticker.lagSmoothing(0);
 const listeners=[];const on=(el,event,fn)=>{el.addEventListener(event,fn);listeners.push(()=>el.removeEventListener(event,fn))};
 const ctx=gsap.context(()=>{
 document.querySelectorAll('a[href^="#"]').forEach(a=>on(a,'click',e=>{const target=a.hash?document.querySelector(a.hash):document.body;if(!target)return;e.preventDefault();lenis.scrollTo(target,{offset:-24,onComplete:()=>{history.replaceState(null,'',a.hash||location.pathname);if(target!==document.body){target.setAttribute('tabindex','-1');target.focus({preventScroll:true})}}})}));
 let intro=true;try{intro=!sessionStorage.getItem('portfolio-intro');sessionStorage.setItem('portfolio-intro','seen')}catch{}
 const curtain=document.querySelector('.intro-curtain');
 if(intro&&!location.hash){curtain.hidden=false;gsap.set(curtain,{yPercent:0});const greeting=curtain.querySelector('.greeting'),path=curtain.querySelector('path');const tl=gsap.timeline({onComplete:()=>curtain.hidden=true});['Hello','Vanakkam','Namaste','karthik.'].forEach((word,i)=>tl.call(()=>greeting.textContent=word,[],i*.2));tl.to(curtain,{yPercent:-115,duration:.85,ease:'power3.inOut'},.8).to(path,{attr:{d:'M0 0 H100 V0 Q50 0 0 0 Z'},duration:.85,ease:'power2.inOut'},.8);gsap.from('.scene',{opacity:0,y:25,duration:.85,delay:.7,clearProps:'opacity,transform'});}else curtain.hidden=true;
 document.querySelectorAll('h1,.heading h2,.about h2,.contact h2,.product-title h2').forEach(el=>{if(!el.querySelector('.line-mask')){const parts=el.innerHTML.split(/<br\s*\/?>/i);el.innerHTML=parts.map(line=>`<span class="line-mask"><span class="line-inner">${line}</span></span>`).join('')}gsap.from(el.querySelectorAll('.line-inner'),{yPercent:110,duration:.85,stagger:.12,ease:'power3.out',delay:el.tagName==='H1'&&intro&&!location.hash?.9:0,scrollTrigger:{trigger:el,start:'top 95%',once:true},clearProps:'transform,opacity'})});
 gsap.utils.toArray('.heading p,.about p,.work-select,.product-title p').forEach(el=>gsap.from(el,{y:18,opacity:0,duration:.65,scrollTrigger:{trigger:el,start:'top 96%',once:true},clearProps:'transform,opacity'}));
 gsap.fromTo('.product-shell',{scale:.95},{scale:1,ease:'none',scrollTrigger:{trigger:'.product-shell',start:'top bottom',end:'top 20%',scrub:.6}});
 gsap.fromTo('.contact-curve',{scaleY:1},{scaleY:.02,ease:'none',scrollTrigger:{trigger:'.contact',start:'top bottom',end:'top 25%',scrub:.6}});
 gsap.to('.hero-copy',{y:55,opacity:.6,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
 gsap.to('.scene',{y:20,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
 ScrollTrigger.create({trigger:'.hero',start:'top top',end:'bottom top',onUpdate:self=>dispatchEvent(new CustomEvent('hero-progress',{detail:self.progress}))});
 if(matchMedia('(hover:hover) and (pointer:fine)').matches){
 document.querySelectorAll('.button,nav .links a').forEach(el=>{const x=gsap.quickTo(el,'x',{duration:.45,ease:'power3.out'}),y=gsap.quickTo(el,'y',{duration:.45,ease:'power3.out'});let r;on(el,'pointerenter',()=>r=el.getBoundingClientRect());on(el,'pointermove',e=>{if(!r)return;x((e.clientX-r.left-r.width/2)*.13);y((e.clientY-r.top-r.height/2)*.18)});on(el,'pointerleave',()=>{x(0);y(0)})});
 const preview=document.querySelector('.work-preview'),x=gsap.quickTo(preview,'x',{duration:.35}),y=gsap.quickTo(preview,'y',{duration:.35});document.querySelectorAll('.work-select').forEach(el=>{on(el,'pointerenter',()=>{preview.querySelector('strong').textContent=el.querySelector('strong').textContent;preview.querySelector('small').textContent=el.querySelector('small').textContent;preview.hidden=false;gsap.to(preview,{opacity:1,scale:1,duration:.25})});on(el,'pointermove',e=>{x(Math.min(e.clientX+25,innerWidth-245));y(Math.min(e.clientY+15,innerHeight-150))});on(el,'pointerleave',()=>gsap.to(preview,{opacity:0,scale:.95,duration:.2,onComplete:()=>preview.hidden=true}))});
 }
 });
 cleanup=()=>{listeners.forEach(fn=>fn());ctx.revert();gsap.ticker.remove(tick);lenis.destroy();document.querySelector('.intro-curtain').hidden=true;document.querySelector('.work-preview').hidden=true;dispatchEvent(new CustomEvent('hero-progress',{detail:0}))};
 document.fonts.ready.then(()=>ScrollTrigger.refresh());
}
setup();preference.addEventListener('change',setup);
