'use strict';
// The brand motif: an arch of vertical pillars, taken from the columns inside the UQU logo.
function pillarArch(n=17){
 const w=600,h=300,gap=10,bw=(w-gap*(n-1))/n,mid=(n-1)/2;
 const bars=Array.from({length:n},(_,i)=>{
  const x=(i-mid)/mid,height=Math.round(h*(.32+.68*Math.sqrt(1-x*x*.92))),left=i*(bw+gap);
  return `<rect class="pillar${i===mid?' gold':''}" style="--i:${Math.abs(i-mid)}" x="${left.toFixed(1)}" y="${h-height}" width="${bw.toFixed(1)}" height="${height}" rx="${(bw/2).toFixed(1)}"/>`;
 }).join('');
 return `<svg class="pillars" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMax meet" aria-hidden="true" focusable="false">${bars}</svg>`;
}
