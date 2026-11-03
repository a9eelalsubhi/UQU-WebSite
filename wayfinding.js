'use strict';
// Wayfinding: a short primary menu per role, secondary pages under «أخرى», a phone tab bar, and a visible search field.
const navPlan={
 student:{primary:['overview','basic-years','clinical-years','student-calendar','student-club','tickets'],bar:['overview','basic-years','student-calendar','student-club']},
 faculty:{primary:['overview','library','tickets','supervision'],bar:['overview','library','tickets','supervision']},
 employee:{primary:['overview','tickets','library','initiatives','reports'],bar:['overview','tickets','library','initiatives']},
 admin:{primary:['overview','tickets','library','initiatives','reports'],bar:['overview','tickets','library','reports']}
};
const navLabels={student:{overview:'الرئيسية',tickets:'الطلبات',library:'مكتبة السلايدات',permissions:'صلاحياتي'},faculty:{overview:'الرئيسية',library:'مقرراتي والسلايدات',tickets:'الطلبات المحالة'},employee:{overview:'الرئيسية'},admin:{overview:'لوحة الإدارة',permissions:'الأدوار والصلاحيات'}};
const navShort={overview:'الرئيسية','basic-years':'دراستي','student-calendar':'التقويم','student-club':'النادي',library:'المكتبة',tickets:'الطلبات',supervision:'الإشراف',initiatives:'المبادرات',reports:'التقارير'};
function navLink(id,cls='nav-item'){const n=navItems.find(x=>x[0]===id);if(!n)return '';const label=navLabels[role]?.[id]||n[2];const count=id==='tickets'?visibleTickets().filter(t=>t.status!=='done').length:0;
 return `<a href="#${id}" class="${cls} ${view===id?'active':''}" ${view===id?'aria-current="page"':''}>${icon(n[1])}<span>${cls==='tab-item'?navShort[id]||label:label}</span>${count&&cls==='nav-item'?`<span class="nav-count" aria-label="${count} مفتوح">${count}</span>`:''}</a>`;}
{const baseNav=renderNav;renderNav=function(){
 baseNav();if(!role)return;
 const allowed=allowedViews(),plan=navPlan[role]||navPlan.student,primary=plan.primary.filter(v=>allowed.includes(v)),rest=allowed.filter(v=>!primary.includes(v));
 $('#nav').innerHTML=primary.map(id=>navLink(id)).join('')+(rest.length?`<div class="nav-label nav-more">أخرى</div>${rest.map(id=>navLink(id)).join('')}`:'');
 const label=navLabels[role]?.[view]||navItems.find(n=>n[0]===view)?.[2]||'الرئيسية';$('#breadcrumb').textContent=label;
 let bar=$('#tabbar');if(!bar){bar=document.createElement('nav');bar.id='tabbar';bar.className='tabbar';bar.setAttribute('aria-label','التنقل السريع');document.body.append(bar);}
 bar.innerHTML=plan.bar.filter(v=>allowed.includes(v)).map(id=>navLink(id,'tab-item')).join('')+`<button class="tab-item" data-action="open-menu">${icon('menu')}<span>المزيد</span></button>`;
};}
document.addEventListener('click',ev=>{if(ev.target.closest('[data-action="open-menu"]'))$('#menu-button')?.click();});
// Search as a field people recognise, not a lone icon.
{const btn=$('.mh-search-btn');if(btn){btn.classList.add('search-launch');btn.innerHTML=`${icon('search')}<span>ابحث عن محاضرة، موعد، أو فريق</span><kbd>Ctrl K</kbd>`;}
 $('.topbar-title')?.after?.(btn||document.createElement('span'));}
// The sidebar keeps one quiet link to the presentation guide instead of a promo card.
{const note=$('.initiative-note');if(note){const link=document.createElement('button');link.className='sidebar-guide';link.id='guide-button';link.innerHTML=`${icon('info')}<span>دليل العرض</span>`;link.addEventListener('click',showGuide);note.replaceWith(link);}}
