'use strict';
// MedHub core: routing for the student sections, the student's saved state, home, unified search and notifications.
Object.assign(paths,{
 play:'<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4z"/>',
 stethoscope:'<path d="M5 3v6a5 5 0 0 0 10 0V3M5 3h2m6 0h2M10 14v2a5 5 0 0 0 10 0v-2"/><circle cx="20" cy="11" r="2"/>',
 layers:'<path d="m12 3 9 5-9 5-9-5zM3 13l9 5 9-5"/>',
 columns:'<rect x="3" y="4" width="5" height="16" rx="1.5"/><rect x="10" y="4" width="5" height="11" rx="1.5"/><rect x="17" y="4" width="4" height="7" rx="1.5"/>',
 alert:'<path d="M12 3 2 20h20zM12 10v4m0 3v.2"/>',
 note:'<path d="M5 3h10l4 4v14H5zM15 3v4h4M8 12h8M8 16h5"/>',
 award:'<circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 7 5-3 5 3-1.5-7"/>',
 timer:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 2h6"/>',
 org:'<rect x="9" y="3" width="6" height="5" rx="1"/><rect x="2" y="16" width="6" height="5" rx="1"/><rect x="16" y="16" width="6" height="5" rx="1"/><path d="M12 8v4M5 16v-4h14v4"/>',
 passport:'<rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="10" r="3"/><path d="M8 17h8"/>'
});
const MHS=(()=>{
 const KEY='medhub-state-v1',base={done:['msk-7','msk-8','msk-9','msk-10','msk-12','msk-13','msk-14','cns-2','cns-1','cns-5'],saved:[],notes:{},answers:{},recent:[],log:[],logStatus:{},osceChecks:{},osceFav:[],apps:[],drafts:{},taskStatus:{},myTasks:[],events:[],decisions:{},seenNotes:[]};
 let s={};try{s=JSON.parse(localStorage.getItem(KEY))||{};}catch{}
 s={...base,...s};
 return {s,save(){try{localStorage.setItem(KEY,JSON.stringify(s));}catch{toast('تعذر الحفظ في هذا المتصفح.');}},reset(){Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,JSON.parse(JSON.stringify(base)));this.save();}};
})();
const mhRoute={'basic-years':{page:'home'},'clinical-years':{page:'home'},'student-calendar':{page:'week'},'student-club':{page:'home'}};
const mhViews={};
const allLectures=()=>MH.modules.flatMap(m=>m.lectures);
const lectureById=id=>allLectures().find(l=>l.id===id);
const moduleById=id=>MH.modules.find(m=>m.id===id);
const arDate=(d,opts={day:'numeric',month:'long'})=>new Date(d+'T12:00:00').toLocaleDateString('ar-SA-u-ca-gregory-nu-latn',opts);
const pctOf=(a,b)=>b?Math.round(a/b*100):0;
const bar=(p,label='')=>`<span class="mh-bar" role="progressbar" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100" ${label?`aria-label="${label}"`:''}><i style="width:${p}%"></i></span>`;
function moduleProgress(m){const done=m.lectures.filter(l=>MHS.s.done.includes(l.id)).length;return {done,total:m.lectures.length,p:pctOf(done,m.lectures.length)};}
function renderMH(sub=false){
 const fn=mhViews[view];if(!fn)return false;
 const r=mhRoute[view];main.innerHTML=fn(r)||'';
 const info=sectionInfo[view],h=main.querySelector('.mh-head h1,.mh-chart-head h1,.mh-club-head h1,.mh-cal-head h1');
 if(info&&h){h.insertAdjacentHTML('beforebegin',`<span class="mh-sec-badge">${icon(info[0])}</span>`);if(info[1]&&!h.nextElementSibling)h.insertAdjacentHTML('afterend',`<p class="mh-sec-lead">${info[1]}</p>`);}
 hydrateIcons(main);
 mhViews[view+':after']?.(r);
 if(sub){window.scrollTo({top:0,behavior:'instant'});main.focus({preventScroll:true});window.mhEnter?.();}
 return true;
}
// Sections show a few tabs; related pages inside a tab sit behind a small segmented switch.
// Every tab and switch carries an icon so its purpose reads at a glance.
const tabIcon={home:'grid',rotation:'calendar',logbook:'note',skills:'target',osce:'timer',tutor:'stethoscope',station:'timer',passport:'passport',assess:'checkCircle',structure:'org',explore:'search',positions:'send',apps:'inbox',mine:'users',workspace:'columns',admissions:'lock',volunteer:'users',regs:'ticket',shifts:'clock',contrib:'award',organizer:'settings',catalog:'book',bookings:'calendar',record:'award',pathways:'flag',instructor:'user',guides:'file',help:'info',support:'inbox',new:'plus',team:'users',items:'award',add:'plus',evidence:'clip',verifier:'shield',cv:'file',share:'shield',reviewer:'user',journey:'flag',profile:'user'};
const sectionInfo={'basic-years':['book','المحاضرات والموارد وتقدّمك في السنوات الأولى إلى الثالثة.'],'clinical-years':['stethoscope','تدريبك في المستشفى، سجلك السريري، ومهاراتك وتقييماتك.'],'student-club':['users','الفرق واللجان، فرص التقديم، وعضوياتك ومهامك.'],'student-calendar':['calendar','محاضراتك واختباراتك ومواعيدك الشخصية في جدول واحد.'],activities:['flag','فعاليات الكلية وحملاتها، فرص التطوع، والمشاريع الكبرى.'],training:['award','الدورات والورش، حجوزاتك، ومسارات تطوير مهاراتك.'],services:['info','الخدمات والأدلة الموثوقة، والدعم عند مواجهة مشكلة في المنصة.'],portfolio:['passport','إنجازاتك وخبراتك، توثيقها، ومشاركتها وسيرتك الذاتية.'],supervision:['stethoscope','']};
function sectionNav(view,tabs,groups,page){
 const g=Object.entries(groups).find(([,items])=>items.some(([p])=>p===page)),tab=g?g[0]:page;
 return `<nav class="mh-subnav" aria-label="أقسام الصفحة">${tabs.map(([k,t])=>`<button data-action="mh-go" data-view="${view}" data-page="${k}" ${k===tab?'aria-current="page"':''}>${icon(tabIcon[k]||'grid')}<span>${t}</span></button>`).join('')}</nav>${g&&g[1].length>1?`<div class="mh-seg mh-inner" role="group" aria-label="عرض">${g[1].map(([p,t])=>`<button class="${p===page?'active':''}" data-action="mh-go" data-view="${view}" data-page="${p}">${icon(tabIcon[p]||'grid')}<span>${t}</span></button>`).join('')}</div>`:''}`;
}
function crumbs(view,items){return `<nav class="mh-crumbs" aria-label="مسار التنقل">${items.map(([label,page,id],i)=>i<items.length-1?`<button data-action="mh-go" data-view="${view}" data-page="${page}" ${id?`data-id="${id}"`:''}>${label}</button>${icon('chevronLeft')}`:`<span aria-current="page">${label}</span>`).join('')}</nav>`;}

// Routing: student sections plus a supervisor view for faculty.
navItems.splice(navItems.findIndex(n=>n[0]==='student-calendar')+1,0,['student-club','users','النادي الطلابي'],['supervision','stethoscope','الإشراف السريري']);
{const prevAllowed=allowedViews;allowedViews=function(){const v=prevAllowed().filter(x=>x!=='student-club'&&x!=='supervision');if(role==='student')v.splice(4,0,'student-club');if(role==='faculty'||role==='admin')v.push('supervision');return v;};}
{const prevRender=render;render=function(){if(role&&allowedViews().includes(view)&&mhViews[view]){renderNav();if(renderMH())return;}if(role==='student'&&view==='overview'){renderNav();main.innerHTML=mhViews.home();hydrateIcons(main);return;}prevRender();};}

// Student home
mhViews.home=()=>{
 const m=moduleById('cns'),pr=moduleProgress(m),s=MHS.s;
 const last=lectureById(s.recent[0])||m.lectures.find(l=>!s.done.includes(l.id))||m.lectures[0];
 const today=MH.events.filter(ev=>ev.date===MH.today&&!ev.cancelled).concat(s.events.filter(ev=>ev.date===MH.today)).sort((a,b)=>a.start.localeCompare(b.start));
 const upcoming=MH.events.filter(ev=>['exam','deadline'].includes(ev.type)&&ev.date>MH.today&&!ev.cancelled).slice(0,3);
 const weeks=Array.from({length:m.weeks},(_,i)=>i+1);
 const places=[['basic-years','book','محاضراتي','الموديولات والملفات والأسئلة'],['student-calendar','calendar','التقويم','محاضراتك واختباراتك ومواعيدك'],['activities','flag','الأنشطة','فعاليات وتطوع ومبادرات'],['training','award','التدريب','دورات وورش ومسارات مهارات'],['student-club','users','النادي','الفرق واللجان والتقديم'],['clinical-years','stethoscope','السنوات السريرية','الروتيشن والسجل وOSCE'],['portfolio','passport','ملفي','إنجازاتي وسيرتي الذاتية'],['services','info','الخدمات والدعم','أدلة وروابط وطلبات دعم']];
 return `<div class="mh-home">
 <section class="mh-today">
  <div class="mh-today-head"><p class="mh-date">${arDate(MH.today,{weekday:'long',day:'numeric',month:'long'})}</p><h1>صباح الخير، عبدالله</h1><p>السنة الثالثة · ${e(m.name)} <span lang="en">${m.en}</span></p></div>
  <ol class="mh-weeks" aria-label="أسابيع الموديول">${weeks.map(w=>`<li class="${w<m.week?'past':w===m.week?'now':''}"><span>الأسبوع ${w}</span>${w===m.week?'<b>الآن</b>':''}</li>`).join('')}</ol>
  <div class="mh-today-pillars">${pillarArch(13)}</div>
 </section>
 <div class="mh-home-grid">
  <section class="mh-continue" aria-labelledby="continue-h"><h2 id="continue-h">${icon('play')} أكمل من حيث توقفت</h2>
   <button class="mh-continue-card" data-action="mh-lecture" data-id="${last.id}"><strong lang="en">${e(last.title)}</strong><span>${e(last.doctor)} · ${specialtyAr[last.specialty]||last.specialty} · الأسبوع ${last.week}</span><span class="mh-continue-progress">${bar(pr.p,'إنجاز الموديول')} أنجزت ${pr.done} من ${pr.total} محاضرات</span><span class="mh-continue-go">افتح المحاضرة ${icon('arrowLeft')}</span></button>
   <h2 class="mh-gap">${icon('bell')} آخر تحديث</h2><p class="mh-latest">${e(MH.announcements[0].text)} <small>${e(MH.announcements[0].from)}</small></p><button class="text-button" data-action="mh-notes">كل الإشعارات ${icon('arrowLeft')}</button></section>
  <section aria-labelledby="sched-h"><div class="mh-sec-title"><h2 id="sched-h">${icon('clock')} اليوم</h2><button class="text-button" data-action="mh-go" data-view="student-calendar" data-page="week">التقويم ${icon('arrowLeft')}</button></div>
   <ol class="mh-agenda">${today.map(ev=>`<li class="layer-${ev.layer}"><time>${ev.start}</time><span><strong dir="auto">${e(ev.title)}</strong><small>${MH.types[ev.type]||''} · ${e(ev.place||'')}</small></span></li>`).join('')||'<li class="empty">لا مواعيد اليوم.</li>'}</ol>
   <h2 class="mh-gap">${icon('alert')} قادم</h2><ul class="mh-upcoming">${upcoming.map(ev=>`<li><time>${arDate(ev.date)}</time><span>${e(ev.title)}</span><em class="type-${ev.type}">${MH.types[ev.type]}</em></li>`).join('')}</ul></section>
 </div>
 <nav class="mh-places" aria-labelledby="places-h"><h2 id="places-h">${icon('grid')} كل ما في المنصة</h2><ul>${places.map(([v,ico,t,d])=>`<li><button data-action="mh-go" data-view="${v}" data-page="${mhRoute[v]?.page==='week'?'week':'home'}"><span class="mh-place-icon">${icon(ico)}</span><span><strong>${t}</strong><small>${d}</small></span></button></li>`).join('')}</ul></nav>
 </div>`;
};

// Unified search across sections
function searchIndex(){
 const idx=[];
 MH.modules.forEach(m=>{idx.push({kind:'موديول',title:m.name,sub:`${m.en} · السنة ${m.year}`,go:['basic-years','module',m.id],text:m.name+m.en+m.about});
  m.lectures.forEach(l=>idx.push({kind:'محاضرة',title:l.title,sub:`${m.name} · ${l.specialty} · الأسبوع ${l.week}`,go:['basic-years','lecture',l.id],text:l.title+l.specialty+l.doctor+l.objectives.join(' '),filters:{year:m.year,week:l.week,spec:l.specialty}}));});
 MH.extraCourses.forEach(c=>idx.push({kind:'مقرر',title:c.name,sub:c.en,go:['basic-years','home'],text:c.name+c.en}));
 MH.clinical.rotations.forEach(r=>idx.push({kind:'روتيشن',title:r.name,sub:`${r.en} · ${r.site}`,go:['clinical-years','rotation',r.id],text:r.name+r.en+r.site}));
 MH.clinical.osce.forEach(o=>idx.push({kind:'محطة OSCE',title:o.name,sub:o.en,go:['clinical-years','osce',o.id],text:o.name+o.en+o.skill}));
 MH.club.units.forEach(u=>idx.push({kind:'النادي',title:u.name,sub:u.about,go:['student-club','unit',u.id],text:u.name+u.about}));
 MH.events.concat(MHS.s.events).forEach(ev=>idx.push({kind:'موعد',title:ev.title,sub:`${arDate(ev.date)} · ${ev.start}`,go:['student-calendar','event',ev.id],text:ev.title+(ev.place||'')}));
 return idx;
}
function openSearch(q=''){
 openDialog(`${dialogHeader('البحث في المنصة','اضغط Ctrl+K من أي صفحة')}<div class="dialog-body mh-search"><label class="search-field">${icon('search')}<input id="mh-q" type="search" placeholder="محاضرة، موديول، هدف تعليمي، روتيشن، فريق، موعد…" value="${e(q)}" autocomplete="off"></label><div class="mh-search-kinds" role="group" aria-label="نوع المحتوى">${['الكل','محاضرة','موعد','فعالية','دورة','خدمة','إنجاز','روتيشن','النادي'].map((k,i)=>`<button class="${i?'':'active'}" data-kind="${k}">${k}</button>`).join('')}</div><div id="mh-results" aria-live="polite"></div></div>`,true);
 const idx=searchIndex();let kind='الكل';
 const draw=()=>{const v=$('#mh-q').value.trim().toLowerCase();const hits=idx.filter(x=>(kind==='الكل'||x.kind===kind)&&(!v||(x.title+x.text+x.sub).toLowerCase().includes(v))).slice(0,30);
  $('#mh-results').innerHTML=hits.length?`<ul>${hits.map(h=>`<li><button data-action="mh-go" data-view="${h.go[0]}" data-page="${h.go[1]}" ${h.go[2]?`data-id="${h.go[2]}"`:''}><em>${h.kind}</em><strong>${e(h.title)}</strong><small>${e(h.sub)}</small></button></li>`).join('')}</ul>`:`<p class="mh-empty">لا نتائج لـ «${e(v)}». جرّب اسم المحاضرة بالإنجليزية أو اسم التخصص.</p>`;};
 $('#mh-q').addEventListener('input',draw);
 $('.mh-search-kinds').addEventListener('click',ev=>{const b=ev.target.closest('[data-kind]');if(!b)return;kind=b.dataset.kind;$$('.mh-search-kinds button').forEach(x=>x.classList.toggle('active',x===b));draw();});
 draw();setTimeout(()=>$('#mh-q').focus(),50);
}
function notifications(){
 const s=MHS.s,list=[
  {id:'n1',icon:'calendar',text:'تغيّرت قاعة محاضرة Diseases of Myelin إلى القاعة 3.',when:'2026-11-02',go:['student-calendar','event','e7']},
  {id:'n2',icon:'alert',text:'أُلغيت محاضرة Neurophysiology يوم 11 نوفمبر.',when:'2026-11-02',go:['student-calendar','event','e13']},
  {id:'n3',icon:'file',text:'تحديث في ملف محاضرة Patterns of Injury.',when:'2026-11-01',go:['basic-years','lecture','cns-6']},
  {id:'n4',icon:'users',text:'حُدّد موعد مقابلتك في فريق الجراحة: الجمعة 1:00 م.',when:'2026-11-02',go:['student-club','apps']},
  {id:'n5',icon:'stethoscope',text:'طلب المشرف تعديل نشاط «عرض حالة في الجولة».',when:'2026-10-24',go:['clinical-years','logbook']},
  {id:'n6',icon:'check',text:'أُسندت إليك مهمة: حجز قاعة ورشة الإسعافات.',when:'2026-11-01',go:['student-club','workspace']}].concat(window.mhExtraNotes?.()||[]).sort((a,b)=>b.when.localeCompare(a.when));
 openDialog(`${dialogHeader('الإشعارات')}<div class="dialog-body"><ul class="mh-notes">${list.map(n=>`<li class="${s.seenNotes.includes(n.id)?'':'unread'}"><button data-action="mh-go" data-view="${n.go[0]}" data-page="${n.go[1]}" ${n.go[2]?`data-id="${n.go[2]}"`:''} data-note="${n.id}">${icon(n.icon)}<span>${e(n.text)}<small>${arDate(n.when)}</small></span></button></li>`).join('')}</ul><p class="mh-fine">تصلك إشعارات المواد والمواعيد والجهات التي تنتمي إليها فقط.</p></div>`);
}

// Supervisor review (faculty/admin): approve or return the student's logbook entries
mhViews.supervision=()=>{
 const entries=clinicalLog().filter(x=>['pending','changes'].includes(x.status));
 return `<div class="mh-clinical mh-sup"><div class="page-heading"><div><h1>الإشراف السريري</h1><p>أنشطة Logbook المرسلة من الطلاب المكلّف بالإشراف عليهم. لا يحتوي السجل على بيانات تعريفية للمرضى.</p></div></div>
 <ul class="mh-review-list">${entries.map(x=>{const req=MH.clinical.requirements.find(r=>r.id===x.req);return `<li><div><strong>عبدالله · ${e(req.name)}</strong><small>${arDate(x.date)} · ${e(x.dept)} · <span lang="en">${x.level}</span></small>${x.note?`<p>${e(x.note)}</p>`:''}</div><div class="mh-review-actions"><button class="btn" data-action="mh-review" data-id="${x.id}" data-to="approved">${icon('check')} اعتماد</button><button class="btn secondary" data-action="mh-review" data-id="${x.id}" data-to="changes">طلب تعديل</button></div></li>`;}).join('')||'<li class="mh-empty">لا أنشطة بانتظار المراجعة.</li>'}</ul></div>`;
};
function clinicalLog(){const s=MHS.s;return MH.clinical.logbook.concat(s.log).map(x=>({...x,status:s.logStatus[x.id]||x.status,feedback:s.logStatus[x.id+':fb']||x.feedback}));}

document.addEventListener('click',ev=>{
 const b=ev.target.closest('[data-action]');if(!b)return;const a=b.dataset.action,s=MHS.s;
 if(a==='mh-go'){if(b.dataset.note&&!s.seenNotes.includes(b.dataset.note)){s.seenNotes.push(b.dataset.note);MHS.save();}if(dialog.open)closeDialog();const v=b.dataset.view;mhRoute[v]={...mhRoute[v],page:b.dataset.page,id:b.dataset.id};if(view===v)renderMH(true);else go(v);}
 else if(a==='mh-lecture'){mhRoute['basic-years']={page:'lecture',id:b.dataset.id};view==='basic-years'?renderMH(true):go('basic-years');}
 else if(a==='mh-search')openSearch();
 else if(a==='mh-notes')notifications();
 else if(a==='mh-review'){const fb=b.dataset.to==='changes'?prompt('ملاحظة للطالب:','أضف تفاصيل أوضح عن دورك في النشاط.'):null;if(b.dataset.to==='changes'&&fb===null)return;s.logStatus[b.dataset.id]=b.dataset.to;if(fb)s.logStatus[b.dataset.id+':fb']=fb;MHS.save();renderMH();toast(b.dataset.to==='approved'?'اعتُمد النشاط.':'أُعيد النشاط للطالب مع ملاحظتك.');}
});
// The bell opens the unified notification centre for students.
document.addEventListener('click',ev=>{if(role==='student'&&ev.target.closest('#notifications-button')){ev.stopImmediatePropagation();notifications();}},true);
// Global search entry in the topbar.
{const t=$('.topbar-tools');if(t){const btn=document.createElement('button');btn.className='icon-button mh-search-btn';btn.dataset.action='mh-search';btn.setAttribute('aria-label','البحث في المنصة (Ctrl+K)');btn.innerHTML=icon('search');t.prepend(btn);}}
document.addEventListener('keydown',ev=>{if((ev.ctrlKey||ev.metaKey)&&ev.key.toLowerCase()==='k'&&role){ev.preventDefault();openSearch();}});
