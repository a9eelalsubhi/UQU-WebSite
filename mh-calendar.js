'use strict';
// Academic Calendar: one time grid, three layers (official, organizational, personal) plus club events.
const calState={last:'week',cursor:MH.today,layers:['official','org','personal','club'],type:'all',module:'all',q:''};
const isoAdd=(d,n)=>{const x=new Date(d+'T12:00:00');x.setDate(x.getDate()+n);return x.toISOString().slice(0,10);};
const weekStart=d=>{const x=new Date(d+'T12:00:00');return isoAdd(d,-x.getDay());};
const mins=t=>{const [h,m]=t.split(':').map(Number);return h*60+m;};
const dayNames=['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
function calEvents(){
 const s=MHS.s,mine=s.events.flatMap(ev=>ev.repeat?Array.from({length:ev.repeat},(_,i)=>({...ev,id:ev.id+'~'+i,series:ev.id,date:isoAdd(ev.date,i*7)})).filter(x=>!s.skips?.includes(x.id)):[ev]);
 return MH.events.concat(mine,window.mhExtraEvents?.()||[]).filter(ev=>calState.layers.includes(ev.layer)&&(calState.type==='all'||ev.type===calState.type)&&(calState.module==='all'||ev.module===calState.module)&&(!calState.q||(ev.title+(ev.place||'')).toLowerCase().includes(calState.q.toLowerCase())));
}
function conflicts(list){const out=new Set();const live=list.filter(x=>!x.cancelled);live.forEach(a=>live.forEach(b=>{if(a!==b&&a.date===b.date&&mins(a.start)<mins(b.end)&&mins(b.start)<mins(a.end))out.add(a.id);}));return out;}
const chip=(ev,clash)=>`<button class="mh-ev layer-${ev.layer} ${ev.cancelled?'cancelled':''} ${clash.has(ev.id)?'clash':''}" data-action="mh-go" data-view="student-calendar" data-page="event" data-id="${ev.id}"><time>${ev.start}</time><span dir="auto">${e(ev.title)}</span></button>`;
mhViews['student-calendar']=r=>{
 const page=['month','week','day','agenda'].includes(r.page)?r.page:r.page==='event'?(calState.last||'month'):'month';
 if(['month','week','day','agenda'].includes(r.page))calState.last=r.page;
 const list=calEvents(),clash=conflicts(list),c=calState.cursor;
 const title=page==='month'?arDate(c,{month:'long',year:'numeric'}):page==='week'?`${arDate(weekStart(c))} — ${arDate(isoAdd(weekStart(c),6))}`:page==='day'?arDate(c,{weekday:'long',day:'numeric',month:'long'}):'المواعيد القادمة';
 const body={month:()=>calMonth(list,clash),week:()=>calWeek(list,clash,7,weekStart(c)),day:()=>calWeek(list,clash,1,c),agenda:()=>calAgenda(list,clash)}[page]();
 const changed=MH.events.filter(ev=>ev.changed||ev.cancelled);
 const myClashes=[...clash].map(id=>list.find(x=>x.id===id)).filter(x=>x&&x.layer==='personal');
 return `<div class="mh-cal"><header class="mh-cal-head"><div><h1>التقويم الأكاديمي</h1><p>محاضراتك وتقييماتك وروتيشناتك واجتماعات النادي وخطتك الشخصية في جدول واحد.</p></div><div class="mh-head-actions"><button class="btn secondary" data-action="mh-ics">${icon('download')} تصدير ICS</button><button class="btn" data-action="mh-plan">${icon('plus')} جلسة مذاكرة</button></div></header>
 <div class="mh-cal-bar"><div class="mh-cal-nav"><button class="icon-button" data-action="mh-cal-step" data-dir="-1" aria-label="السابق">${icon('chevronRight')}</button><h2>${title}</h2><button class="icon-button" data-action="mh-cal-step" data-dir="1" aria-label="التالي">${icon('chevronLeft')}</button><button class="btn secondary small" data-action="mh-cal-today">اليوم</button></div>
 <div class="mh-seg" role="group" aria-label="طريقة العرض">${[['agenda','قائمة'],['week','أسبوع'],['month','شهر']].map(([k,t])=>`<button class="${k===page?'active':''}" data-action="mh-go" data-view="student-calendar" data-page="${k}">${t}</button>`).join('')}</div></div>
 <div class="mh-cal-tools"><div class="mh-layer-chips" role="group" aria-label="الطبقات">${Object.entries(MH.layers).map(([k,[n,d]])=>`<label class="layer-${k}" title="${d}"><input type="checkbox" data-layer="${k}" ${calState.layers.includes(k)?'checked':''}><i></i>${n}</label>`).join('')}</div>
 <details class="mh-cal-filter" ${calState.q||calState.type!=='all'||calState.module!=='all'?'open':''}><summary>${icon('search')} بحث وتصفية${calState.q||calState.type!=='all'||calState.module!=='all'?' <b>مفعّلة</b>':''}</summary><div class="mh-cal-filter-body"><label class="search-field">${icon('search')}<input id="mh-cal-q" type="search" placeholder="ابحث في المواعيد" value="${e(calState.q)}"></label><select id="mh-cal-type" aria-label="نوع النشاط"><option value="all">كل الأنشطة</option>${Object.entries(MH.types).map(([k,v])=>`<option value="${k}" ${calState.type===k?'selected':''}>${v}</option>`).join('')}</select><select id="mh-cal-mod" aria-label="الموديول"><option value="all">كل الموديولات</option>${MH.modules.filter(m=>m.lectures.length).map(m=>`<option value="${m.id}" ${calState.module===m.id?'selected':''}>${m.name}</option>`).join('')}</select></div></details></div>
 ${changed.length?`<details class="mh-cal-changes"><summary>${icon('refresh')} ${changed.length===1?'تغيير واحد':changed.length===2?'تغييران':changed.length+' تغييرات'} في الجدول هذا الأسبوع</summary><ul>${changed.map(ev=>`<li><button data-action="mh-go" data-view="student-calendar" data-page="event" data-id="${ev.id}"><strong dir="auto">${e(ev.title.replace(/^محاضرة ملغاة: /,''))}</strong> — ${ev.cancelled?'أُلغيت':e(ev.changed)}</button></li>`).join('')}</ul></details>`:''}
 ${myClashes.length?`<div class="mh-alert">${icon('alert')}<span><strong>تعارض:</strong> ${myClashes.map(x=>`«${e(x.title)}» ${arDate(x.date)} ${x.start}`).join('، ')} تتداخل مع موعد آخر. المواعيد الرسمية لا تتغير تلقائيًا.</span></div>`:''}${body}
 ${r.page==='event'?eventDetail(r.id,list,clash):''}</div>`;
};
function calMonth(list,clash){
 const c=calState.cursor,first=c.slice(0,8)+'01',start=weekStart(first),month=c.slice(5,7);
 const cells=Array.from({length:42},(_,i)=>isoAdd(start,i));
 return `<table class="mh-month"><thead><tr>${dayNames.map(d=>`<th>${d}</th>`).join('')}</tr></thead><tbody>${[0,1,2,3,4,5].map(w=>`<tr>${cells.slice(w*7,w*7+7).map(d=>{const evs=list.filter(x=>x.date===d).sort((a,b)=>a.start.localeCompare(b.start));return `<td class="${d.slice(5,7)!==month?'out':''} ${d===MH.today?'today':''}"><button class="mh-daynum" data-action="mh-cal-day" data-date="${d}" aria-label="${arDate(d,{weekday:'long',day:'numeric',month:'long'})}">${+d.slice(8)}</button>${evs.slice(0,3).map(ev=>chip(ev,clash)).join('')}${evs.length>3?`<button class="mh-more" data-action="mh-cal-day" data-date="${d}">+${evs.length-3}</button>`:''}</td>`;}).join('')}</tr>`).join('')}</tbody></table>`;
}
function calWeek(list,clash,n,from){
 const days=Array.from({length:n},(_,i)=>isoAdd(from,i)),H0=7,H1=22,hpx=46;
 // Overlapping events share width only within their own cluster.
 const col=d=>{const evs=list.filter(x=>x.date===d).sort((a,b)=>mins(a.start)-mins(b.start));let cluster=[],lanes=[],clusterEnd=0;const close=()=>cluster.forEach(ev=>ev._lanes=lanes.length);evs.forEach(ev=>{if(mins(ev.start)>=clusterEnd){close();cluster=[];lanes=[];}let l=lanes.findIndex(end=>end<=mins(ev.start));if(l<0){l=lanes.length;lanes.push(0);}lanes[l]=mins(ev.end);ev._lane=l;cluster.push(ev);clusterEnd=Math.max(clusterEnd,mins(ev.end));});close();
  return evs.map(ev=>`<button class="mh-block layer-${ev.layer} ${ev.cancelled?'cancelled':''} ${clash.has(ev.id)?'clash':''}" style="top:${(mins(ev.start)-H0*60)/60*hpx}px;height:${Math.max(26,(mins(ev.end)-mins(ev.start))/60*hpx-3)}px;inset-inline-start:${ev._lane*18}px;width:calc(100% - ${(ev._lanes-1)*18}px);z-index:${ev._lane+1}" data-action="mh-go" data-view="student-calendar" data-page="event" data-id="${ev.id}"><strong dir="auto">${e(ev.title)}</strong><small><bdi dir="ltr">${ev.start}–${ev.end}</bdi>${ev.place?' · '+e(ev.place):''}</small></button>`).join('');};
 const now=(new Date().getHours()*60+new Date().getMinutes()-H0*60)/60*hpx;
 return `<div class="mh-grid" style="--cols:${n};--hpx:${hpx}px"><div class="mh-grid-head"><span></span>${days.map(d=>`<button class="${d===MH.today?'today':''}" data-action="mh-cal-day" data-date="${d}">${dayNames[new Date(d+'T12:00:00').getDay()]} <b>${+d.slice(8)}</b></button>`).join('')}</div>
 <div class="mh-grid-body" style="height:${(H1-H0)*hpx}px"><div class="mh-hours">${Array.from({length:H1-H0},(_,i)=>`<span style="top:${i*hpx}px">${String(H0+i).padStart(2,'0')}:00</span>`).join('')}</div>${days.map(d=>`<div class="mh-daycol ${d===MH.today?'today':''}">${col(d)}${d===MH.today&&now>0&&now<(H1-H0)*hpx?`<i class="mh-now" style="top:${now}px"></i>`:''}</div>`).join('')}</div></div>`;
}
function calAgenda(list,clash){
 const up=list.filter(x=>x.date>=MH.today).sort((a,b)=>(a.date+a.start).localeCompare(b.date+b.start));const days=[...new Set(up.map(x=>x.date))];
 return `<ol class="mh-agenda-days">${days.map(d=>`<li><h3>${arDate(d,{weekday:'long',day:'numeric',month:'long'})}</h3><ol class="mh-agenda">${up.filter(x=>x.date===d).map(ev=>`<li class="layer-${ev.layer} ${ev.cancelled?'cancelled':''} ${clash.has(ev.id)?'clash':''}"><time>${ev.start}</time><button data-action="mh-go" data-view="student-calendar" data-page="event" data-id="${ev.id}"><strong>${e(ev.title)}</strong><small>${MH.types[ev.type]||''} · ${e(ev.place||'')} · ${MH.layers[ev.layer][0]}</small></button></li>`).join('')}</ol></li>`).join('')||'<li class="mh-empty">لا مواعيد تطابق التصفية.</li>'}</ol>`;
}
function eventDetail(id,list,clash){
 const ev=list.find(x=>x.id===id)||MH.events.find(x=>x.id===id);if(!ev)return '';
 const m=ev.module&&moduleById(ev.module),lec=ev.lecture&&lectureById(ev.lecture),mine=ev.layer==='personal'&&MHS.s.events.some(x=>x.id===(ev.series||ev.id));
 return `<div class="mh-sheet" role="dialog" aria-labelledby="ev-title"><div class="mh-sheet-card layer-${ev.layer}"><button class="icon-button mh-sheet-x" data-action="mh-go" data-view="student-calendar" data-page="${calState.last||'month'}" aria-label="إغلاق">${icon('close')}</button>
 <span class="mh-layer-tag">${MH.layers[ev.layer][0]} · ${MH.types[ev.type]||''}</span><h2 id="ev-title">${e(ev.title)}</h2>
 <dl><div><dt>الموعد</dt><dd>${arDate(ev.date,{weekday:'long',day:'numeric',month:'long'})} · <bdi dir="ltr">${ev.start}–${ev.end}</bdi></dd></div><div><dt>المكان</dt><dd>${e(ev.place||'—')}</dd></div><div><dt>الجهة</dt><dd>${{official:m?m.coordinator+' (منسق الموديول)':'الكلية',org:'قائد الدفعة',personal:'أنت',club:'النادي الطلابي'}[ev.layer]}</dd></div>${m?`<div><dt>الموديول</dt><dd>${m.name}</dd></div>`:''}${ev.series?'<div><dt>التكرار</dt><dd>أسبوعيًا</dd></div>':''}</dl>
 ${ev.cancelled?`<p class="mh-alert">${icon('alert')} أُلغي هذا الموعد.</p>`:''}${ev.changed?`<p class="mh-change">${icon('refresh')} ${e(ev.changed)}</p>`:''}${clash.has(ev.id)?`<p class="mh-alert">${icon('alert')} يتداخل مع موعد آخر في اليوم نفسه.</p>`:''}
 <button class="text-button" data-action="mh-report" data-type="استخدام قسم في المنصة" data-context="student-calendar/event/${ev.id}">${icon('alert')} الإبلاغ عن خطأ في هذا الموعد</button><div class="mh-form-actions">${lec?`<button class="btn" data-action="mh-lecture" data-id="${lec.id}">فتح المحاضرة</button>`:''}${ev.layer==='club'?`<button class="btn secondary" data-action="mh-go" data-view="student-club" data-page="mine">فتح في النادي</button>`:''}${mine?`${ev.series?`<button class="btn secondary" data-action="mh-skip" data-id="${ev.id}">إلغاء هذه الجلسة فقط</button>`:''}<button class="btn secondary danger" data-action="mh-del-ev" data-id="${ev.series||ev.id}">${ev.series?'حذف السلسلة كاملة':'حذف'}</button>`:''}</div></div></div>`;
}
function planForm(){
 openDialog(`${dialogHeader('جلسة مذاكرة جديدة','تُضاف لتقويمك الشخصي ولا يراها غيرك')}<form class="dialog-body mh-plan" id="mh-plan"><div class="form-grid"><div class="field full"><label for="p-title">العنوان</label><input id="p-title" name="title" required maxlength="60" value="مذاكرة"></div>
 <div class="field"><label for="p-lec">مرتبطة بمحاضرة</label><select id="p-lec" name="lecture"><option value="">بدون</option>${allLectures().map(l=>`<option value="${l.id}">${e(l.title)}</option>`).join('')}</select></div>
 <div class="field"><label for="p-date">التاريخ</label><input id="p-date" name="date" type="date" required value="${calState.cursor}"></div><div class="field"><label for="p-start">من</label><input id="p-start" name="start" type="time" required value="16:00"></div><div class="field"><label for="p-end">إلى</label><input id="p-end" name="end" type="time" required value="17:30"></div>
 <div class="field"><label for="p-rem">تذكير</label><select id="p-rem" name="reminder"><option>قبل 15 دقيقة</option><option>قبل ساعة</option><option>بدون</option></select></div><div class="field"><label for="p-rep">التكرار</label><select id="p-rep" name="repeat"><option value="1">مرة واحدة</option><option value="4">أسبوعيًا لأربعة أسابيع</option><option value="8">أسبوعيًا لثمانية أسابيع</option></select></div></div>
 <p class="form-error" id="form-error" role="alert"></p><div class="dialog-footer"><button class="btn">إضافة</button></div></form>`);
 $('#mh-plan').addEventListener('submit',ev=>{ev.preventDefault();const d=new FormData(ev.target);if(d.get('end')<=d.get('start')){$('#form-error').textContent='وقت النهاية يجب أن يكون بعد البداية.';return;}
  const lec=lectureById(d.get('lecture')),item={id:'p'+Date.now(),date:d.get('date'),start:d.get('start'),end:d.get('end'),title:String(d.get('title')).trim()+(lec?': '+lec.title:''),type:'study',layer:'personal',place:'',module:lec?.module,lecture:lec?.id,repeat:+d.get('repeat')>1?+d.get('repeat'):0};
  MHS.s.events.push(item);MHS.save();closeDialog();calState.cursor=item.date;const clash=conflicts(calEvents());const hit=[...clash].some(id=>id===item.id||id.startsWith(item.id+'~'));renderMH();toast(hit?'أُضيفت الجلسة، لكنها تتعارض مع موعد آخر.':'أُضيفت الجلسة لتقويمك.');});
}
function exportICS(){
 const esc=t=>String(t).replace(/[,;\\]/g,m=>'\\'+m),stamp=d=>d.replace(/-/g,'');
 const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//UQU MedHub//AR'].concat(calEvents().filter(x=>!x.cancelled).flatMap(ev=>['BEGIN:VEVENT',`UID:${ev.id}@medhub.uqu`,`DTSTART:${stamp(ev.date)}T${ev.start.replace(':','')}00`,`DTEND:${stamp(ev.date)}T${ev.end.replace(':','')}00`,`SUMMARY:${esc(ev.title)}`,`LOCATION:${esc(ev.place||'')}`,'END:VEVENT']),['END:VCALENDAR']);
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([lines.join('\r\n')],{type:'text/calendar'}));a.download='medhub-calendar.ics';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);toast('صُدّر التقويم بصيغة ICS حسب التصفية الحالية.');
}
mhViews['student-calendar:after']=()=>{
 const q=$('#mh-cal-q');q?.addEventListener('input',()=>{calState.q=q.value;renderMH();const n=$('#mh-cal-q');n.focus();n.setSelectionRange(n.value.length,n.value.length);});
 $$('[data-layer]').forEach(cb=>cb.addEventListener('change',()=>{calState.layers=$$('[data-layer]').filter(x=>x.checked).map(x=>x.dataset.layer);renderMH();}));
 $('#mh-cal-type')?.addEventListener('change',ev=>{calState.type=ev.target.value;renderMH();});
 $('#mh-cal-mod')?.addEventListener('change',ev=>{calState.module=ev.target.value;renderMH();});
 $('.mh-sheet-card')?.focus?.();
};
document.addEventListener('click',ev=>{
 const b=ev.target.closest('[data-action]');if(!b)return;const a=b.dataset.action,s=MHS.s,pg=calState.last||'month';
 if(a==='mh-cal-step'){const d=+b.dataset.dir,c=calState.cursor;calState.cursor=pg==='month'?(()=>{const x=new Date(c.slice(0,8)+'15T12:00:00');x.setMonth(x.getMonth()+d);return x.toISOString().slice(0,10);})():isoAdd(c,(pg==='week'?7:1)*d);renderMH();}
 else if(a==='mh-cal-today'){calState.cursor=MH.today;renderMH();}
 else if(a==='mh-cal-day'){calState.cursor=b.dataset.date;mhRoute['student-calendar']={page:'day'};renderMH(true);}
 else if(a==='mh-plan')planForm();
 else if(a==='mh-ics')exportICS();
 else if(a==='mh-skip'){s.skips=[...(s.skips||[]),b.dataset.id];MHS.save();mhRoute['student-calendar']={page:pg};renderMH();toast('أُلغيت هذه الجلسة فقط؛ بقية السلسلة كما هي.');}
 else if(a==='mh-del-ev'){s.events=s.events.filter(x=>x.id!==b.dataset.id);MHS.save();mhRoute['student-calendar']={page:pg};renderMH();toast('حُذف الموعد.');}
});
document.addEventListener('keydown',ev=>{if(ev.key==='Escape'&&view==='student-calendar'&&mhRoute['student-calendar'].page==='event'&&!dialog.open){mhRoute['student-calendar']={page:calState.last||'month'};renderMH();}});
