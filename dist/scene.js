'use strict';
// Pulse scene: a rotating 3D point-cloud heart with a scan plane and an ECG trace, drawn on one canvas.
const PulseScene=(()=>{
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const BEAT=1.15;// seconds per heartbeat (~52 bpm, calm)
 function heartPoints(n){
  const pts=[];
  for(let i=0;i<n;i++){
   const t=Math.random()*Math.PI*2,edge=i%3===0,phi=edge?(Math.random()-.5)*.5:Math.asin(Math.random()*2-1),r=Math.cos(phi);
   const x=16*Math.sin(t)**3,y=13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t);
   const fill=edge?1:Math.sqrt(Math.random())*.2+.8;
   pts.push({x:x*r*fill/17,y:-y*r*fill/17+.1,z:Math.sin(phi)*.42*fill,s:Math.random()});
  }
  return pts;
 }
 // ECG waveform for one beat, phase in [0,1)
 function ecg(p){
  const g=(c,w,a)=>a*Math.exp(-((p-c)**2)/(2*w*w));
  return g(.18,.025,.12)+g(.36,.008,-.12)+g(.39,.01,1)+g(.42,.009,-.28)+g(.62,.045,.22);
 }
 function mount(canvas,{compact=false}={}){
  const ctx=canvas.getContext('2d');
  const pts=heartPoints(compact?900:1700);
  let w=0,h=0,dpr=1,raf=0,running=false,visible=true,t0=performance.now(),tiltX=0,tiltY=0,targetX=0,targetY=0;
  const trace=[];
  const css=()=>getComputedStyle(canvas);
  function size(){
   const r=canvas.getBoundingClientRect();dpr=Math.min(devicePixelRatio||1,2);
   w=r.width;h=r.height;canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  function frame(now,fill=false){
   const t=(now-t0)/1000,phase=(t%BEAT)/BEAT,style=css();
   const ink=style.getPropertyValue('--scene-ink').trim()||'#0a6b66',hot=style.getPropertyValue('--scene-hot').trim()||'#c79a3c',line=style.getPropertyValue('--scene-line').trim()||'#0a6b66';
   ctx.clearRect(0,0,w,h);
   tiltX+=(targetX-tiltX)*.06;tiltY+=(targetY-tiltY)*.06;
   const traceOnly=h<120,traceH=traceOnly?h:compact?Math.min(44,h*.18):Math.min(90,h*.16),cx=w/2,cy=(h-traceH)/2,scale=Math.min(w,h-traceH)*.36;
   const beat=1+.045*Math.exp(-((phase-.4)**2)/.002)+.02*Math.exp(-((phase-.62)**2)/.006);
   const ry=Math.sin(t*.45)*.75+tiltX*.5,rx=-.18+tiltY*.35,cyR=Math.cos(ry),syR=Math.sin(ry),cxR=Math.cos(rx),sxR=Math.sin(rx);
   const scanY=Math.sin(t*.7)*.95;
   if(!traceOnly)for(const p of pts){
    let x=p.x*beat,y=p.y*beat,z=p.z*beat;
    const x1=x*cyR+z*syR,z1=-x*syR+z*cyR,y1=y*cxR-z1*sxR,z2=y*sxR+z1*cxR;
    const persp=2.6/(2.6+z2),sx=cx+x1*scale*persp,sy=cy+y1*scale*persp;
    const depth=(1-z2)/2,near=Math.abs(p.y-scanY)<.035;
    ctx.globalAlpha=near?.95:.18+depth*.55;
    ctx.fillStyle=near?hot:ink;
    const r=(near?1.9:.8+depth*1.1)*persp*(compact?.85:1);
    ctx.fillRect(sx-r/2,sy-r/2,r,r);
   }
   // scan plane ellipse
   const ey=cy+scanY*scale*.95*cxR;
   ctx.globalAlpha=traceOnly?0:.35;ctx.strokeStyle=hot;ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(cx,ey,scale*1.05,scale*.16,0,0,Math.PI*2);ctx.stroke();
   {
    const base=h-traceH/2,amp=traceH*.42,speed=w/2.4;
    const headX=(t*speed)%(w+40)-20;
    if(fill){trace.length=0;for(let x=0;x<=headX;x+=2)trace.push({x,y:base-ecg(((t-(headX-x)/speed)%BEAT+BEAT)%BEAT/BEAT)*amp});}
    else trace.push({x:headX,y:base-ecg(phase)*amp});
    while(trace.length&&(trace.length>400||trace[0].x>headX))trace.shift();
    ctx.globalAlpha=.16;ctx.strokeStyle=line;ctx.beginPath();ctx.moveTo(0,base);ctx.lineTo(w,base);ctx.stroke();
    ctx.lineWidth=2;ctx.lineJoin='round';
    for(let i=1;i<trace.length;i++){
     const a=trace[i-1],b=trace[i];
     ctx.globalAlpha=Math.max(0,1-(headX-b.x)/(w*.7))*.9;ctx.strokeStyle=line;
     ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
    }
    const head=trace[trace.length-1];
    if(head){ctx.globalAlpha=1;ctx.fillStyle=hot;ctx.beginPath();ctx.arc(head.x,head.y,3.2,0,Math.PI*2);ctx.fill();}
   }
   ctx.globalAlpha=1;
  }
  function loop(now){frame(now);if(running)raf=requestAnimationFrame(loop);}
  function start(){if(running||reduce.matches||!visible||document.hidden)return;running=true;raf=requestAnimationFrame(loop);}
  function stop(){running=false;cancelAnimationFrame(raf);}
  function still(){size();frame(t0+BEAT*1000*2.3,true);}
  const ro=new ResizeObserver(()=>{size();if(!running)reduce.matches?still():frame(performance.now());});ro.observe(canvas);
  const io=new IntersectionObserver(([en])=>{visible=en.isIntersecting;visible?start():stop();});io.observe(canvas);
  const onVis=()=>document.hidden?stop():start();document.addEventListener('visibilitychange',onVis);
  const onMove=e=>{const r=canvas.getBoundingClientRect();targetX=((e.clientX-r.left)/r.width-.5)*2;targetY=((e.clientY-r.top)/r.height-.5)*2;};
  window.addEventListener('pointermove',onMove,{passive:true});
  const onReduce=()=>reduce.matches?(stop(),still()):start();reduce.addEventListener('change',onReduce);
  size();reduce.matches?still():start();
  return {destroy(){stop();ro.disconnect();io.disconnect();document.removeEventListener('visibilitychange',onVis);window.removeEventListener('pointermove',onMove);reduce.removeEventListener('change',onReduce);}};
 }
 const live=new WeakMap();
 // Mount every [data-pulse-scene] canvas in the document, and release the ones that left it.
 function sync(){
  document.querySelectorAll('canvas[data-pulse-scene]').forEach(c=>{if(!live.has(c))live.set(c,mount(c,{compact:c.dataset.pulseScene==='compact'}));});
  sync.mounted=(sync.mounted||[]).filter(c=>{if(c.isConnected)return true;live.get(c)?.destroy();return false;});
  document.querySelectorAll('canvas[data-pulse-scene]').forEach(c=>{if(!sync.mounted.includes(c))sync.mounted.push(c);});
 }
 return {sync};
})();
