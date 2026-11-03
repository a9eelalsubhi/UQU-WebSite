'use strict';
// Motion layer: entrances on route change only, the pulse sweep under the topbar, and scroll reveals.
// Content is fully visible without it; everything is skipped under prefers-reduced-motion.
(()=>{
 const g=window.gsap,reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const canAnimate=()=>!!g&&!reduce.matches;
 if(g&&window.ScrollTrigger)g.registerPlugin(ScrollTrigger);
 document.documentElement.classList.add('motion-ready');
 const EASE='expo.out';
 const sweep=document.createElement('div');sweep.className='route-pulse';sweep.setAttribute('aria-hidden','true');
 sweep.innerHTML='<svg viewBox="0 0 600 20" preserveAspectRatio="none"><path pathLength="1" d="M0 14H250l6-4 6 4h18l5 3 7-15 7 17 5-5h20l9-4 9 4H600"/></svg>';
 $('.topbar')?.append(sweep);
 const sweepPath=sweep.querySelector('path');
 const REVEAL='.hub-card,.panel,.metric,.resource-card,.initiative-card,.service-card,.course-tile,.lecture-card,.permission-card,.report-stat,.chart-row';

 function playSweep(){
  if(!canAnimate())return;
  g.killTweensOf(sweepPath);
  g.fromTo(sweepPath,{strokeDasharray:'0.2 1.4',strokeDashoffset:.2},{strokeDashoffset:-1,duration:1.2,ease:'power2.inOut',onComplete:()=>g.set(sweepPath,{clearProps:'all'})});
 }
 function countUp(el){
  const m=el.textContent.match(/^(\d+)(%?)$/);if(!m)return;
  const end=+m[1],o={v:0};
  g.to(o,{v:end,duration:1.1,ease:'power3.out',onUpdate:()=>{el.textContent=Math.round(o.v)+m[2];}});
 }
 function grow(root){
  root.querySelectorAll('.progress-fill,.chart-bar>i').forEach(el=>g.from(el,{scaleX:0,transformOrigin:'right center',duration:1,ease:EASE,clearProps:'transform'}));
  root.querySelectorAll('.metric-value,.report-stat strong').forEach(countUp);
 }
 function enterView(){
  const main=$('#main');
  window.ScrollTrigger?.getAll().forEach(t=>t.kill());
  const fold=innerHeight*.92;
  const above=[],below=[];
  main.querySelectorAll(REVEAL).forEach(el=>(el.getBoundingClientRect().top<fold?above:below).push(el));
  const top=[...main.children].filter(el=>!el.matches(REVEAL)&&el.getBoundingClientRect().top<fold);
  const tl=g.timeline({defaults:{ease:EASE,duration:.8}});
  if(top.length)tl.from(top,{y:16,opacity:0,stagger:.06,clearProps:'transform,opacity'});
  if(above.length)tl.from(above,{y:18,opacity:0,stagger:.035,clearProps:'transform,opacity'},.12);
  grow(main);
  if(window.ScrollTrigger&&below.length){
   g.set(below,{opacity:0,y:22});
   ScrollTrigger.batch(below,{start:'top 94%',once:true,onEnter:batch=>g.to(batch,{opacity:1,y:0,duration:.8,ease:EASE,stagger:.05,clearProps:'transform,opacity'})});
  }
 }
 let lastKey='';
 const baseRender=render;
 render=function(){
  baseRender.apply(this,arguments);
  PulseScene.sync();
  const key=role+'|'+view;
  if(!role||key===lastKey)return;
  lastKey=key;
  if(!canAnimate())return;
  playSweep();enterView();
 };
 const baseEntry=showRoleEntry;
 showRoleEntry=function(){
  baseEntry.apply(this,arguments);
  lastKey='';PulseScene.sync();
  if(!canAnimate())return;
  const q=s=>$$(s,$('#role-entry'));
  g.timeline({defaults:{ease:EASE,duration:1}})
   .from(q('.gate-visual'),{opacity:0,scale:.94,duration:1.6,clearProps:'transform,opacity'},0)
   .from(q('.gate-logo,.gate-copy h1,.gate-lede,.gate-prompt'),{y:20,opacity:0,stagger:.08,clearProps:'transform,opacity'},.1)
   .from(q('.gate-role,.gate-staff'),{x:-24,opacity:0,stagger:.07,clearProps:'transform,opacity'},.45)
   .from(q('.gate-top,.gate-foot'),{opacity:0,duration:.8,clearProps:'opacity'},.7);
 };
 // The page booted before this file loaded; catch up with whatever is on screen.
 role?render():showRoleEntry();
})();
