'use strict';
// Skills & Training: catalog, sessions, eligibility, bookings and waitlist offers, pathways, record, certificates.
const courseById=id=>MH2.courses.find(c=>c.id===id);
function bookings(){const ov=st('bkOv',{});return MH2.bookings.concat(st('bkNew',[])).map(b=>({...b,status:ov[b.id]||b.status}));}
const myBooking=cid=>bookings().find(b=>b.course===cid&&!['cancelled'].includes(b.status));
const completedCourses=()=>bookings().filter(b=>b.status==='completed').map(b=>b.course);
function eligibility(c){
 const reasons=[];if(!c.years.includes(MY_YEAR))reasons.push(`مخصصة لطلاب السنوات ${c.years.join('، ')}`);
 const done=completedCourses(),missing=c.pre.filter(p=>!done.includes(p)&&!(p==='c-suture'&&false));
 missing.forEach(p=>reasons.push(`تتطلب إكمال «${courseById(p).ar}» أولًا`));
 return {ok:!reasons.length,reasons};
}
const trTabs=[['home','الرئيسية'],['catalog','الكتالوج'],['bookings','حجوزاتي'],['record','سجلي التدريبي']];
const trGroups={record:[['record','السجل والشهادات'],['pathways','المسارات'],['instructor','لوحة المدرب']]};
mhViews.training=r=>{
 const tabPage=r.page==='course'?'catalog':r.page;
 const body={home:trHome,catalog:trCatalog,bookings:trBookings,record:trRecord,pathways:trPathways,instructor:trInstructor,course:()=>trCourse(courseById(r.id))}[r.page]||trHome;
 return `<div class="mh-train"><header class="mh-head"><div><h1>المهارات والتدريب</h1></div></header>${sectionNav('training',trTabs,trGroups,tabPage)}${body()}</div>`;
};
function courseRow(c,why=''){const b=myBooking(c.id),left=c.sessions.reduce((a,s)=>a+Math.max(0,s.seats-s.taken),0);
 return `<li><button class="mh-evrow" data-action="mh-go" data-view="training" data-page="course" data-id="${c.id}"><span class="mh-course-mark">${icon({surgical:'clip',emergency:'health',research:'search',comm:'users'}[c.cat]||'award')}</span><span><strong lang="en">${c.title}</strong><small>${c.ar} · ${MH2.trainCats[c.cat]} · ${c.level} · ${c.hours} ساعات${why?` · <em>${why}</em>`:''}</small></span><span class="mh-evstate s-${b?b.status:left?'open':'full'}">${b?MH2.bookStatus[b.status]:left?`${left} مقعد`:'مكتمل'}</span></button></li>`;}
function trHome(){
 const offers=bookings().filter(b=>b.status==='offer'),rec=st('recOn',true),ints=st('trInterests',MH2.interests);
 const recs=MH2.courses.filter(c=>!myBooking(c.id)&&c.years.includes(MY_YEAR)&&ints.includes(c.cat)).map(c=>[c,c.cat==='surgical'?'ضمن مسار المهارات الجراحية الذي بدأته':'يطابق اهتمامك بـ'+MH2.trainCats[c.cat]]);
 return `${offers.map(b=>{const c=courseById(b.course),s=c.sessions.find(x=>x.id===b.session);return `<div class="mh-offer-band">${icon('timer')}<span><strong>توفر لك مقعد في ${c.ar}</strong><small>${arDate(s.date,{weekday:'long',day:'numeric',month:'long'})} · ${s.time} · اقبل قبل ${b.offerUntil.slice(11)} يوم ${arDate(b.offerUntil.slice(0,10))}</small></span><button class="btn" data-action="bk-set" data-id="${b.id}" data-to="confirmed">قبول المقعد</button><button class="btn secondary" data-action="bk-set" data-id="${b.id}" data-to="cancelled">رفض</button></div>`;}).join('')}
 <div class="mh-home-grid"><section><div class="mh-sec-title"><h2>مقترحة لك</h2><button class="text-button" data-action="tr-rec">${rec?'إيقاف الاقتراحات':'تفعيل الاقتراحات'}</button></div>${rec?`<ol class="mh-evlist">${recs.map(([c,w])=>courseRow(c,w)).join('')||'<li class="mh-empty">لا اقتراحات حاليًا.</li>'}</ol><p class="mh-fine">الاقتراح مبني على سنتك واهتماماتك (${ints.map(i=>MH2.trainCats[i]).join('، ')}) والمسارات التي بدأتها.</p>`:'<p class="mh-empty">الاقتراحات متوقفة.</p>'}</section>
 <section><div class="mh-sec-title"><h2>التسجيل مفتوح</h2><button class="text-button" data-action="mh-go" data-view="training" data-page="catalog">الكتالوج ${icon('arrowLeft')}</button></div><ol class="mh-evlist">${MH2.courses.filter(c=>c.sessions.some(s=>s.date>MH.today&&s.taken<s.seats)).slice(0,4).map(c=>courseRow(c)).join('')}</ol></section></div>`;
}
function trCatalog(){
 const f=st('trFilter',{q:'',cat:'all',mode:'all',level:'all',seats:false,cert:false});
 const list=MH2.courses.filter(c=>(!f.q||(c.title+c.ar+c.org+c.trainer).toLowerCase().includes(f.q.toLowerCase()))&&(f.cat==='all'||c.cat===f.cat)&&(f.mode==='all'||c.mode===f.mode)&&(f.level==='all'||c.level===f.level)&&(!f.seats||c.sessions.some(s=>s.taken<s.seats&&s.date>MH.today))&&(!f.cert||c.cert!=='لا توجد'));
 const opt=(id,cur,pairs,l)=>`<select id="${id}" aria-label="${l}">${pairs.map(([v,t])=>`<option value="${v}" ${cur===v?'selected':''}>${t}</option>`).join('')}</select>`;
 return `<div class="mh-filterbar"><label class="search-field">${icon('search')}<input id="tr-q" type="search" placeholder="اسم الدورة أو المدرب أو الجهة" value="${e(f.q)}"></label>${opt('tr-cat',f.cat,[['all','كل التخصصات'],...Object.entries(MH2.trainCats)],'التخصص')}${opt('tr-level',f.level,[['all','كل المستويات'],['مبتدئ','مبتدئ'],['متوسط','متوسط']],'المستوى')}${opt('tr-mode',f.mode,[['all','كل الطرق'],['حضوري','حضوري'],['عن بعد','عن بعد'],['هجين','هجين']],'طريقة التقديم')}<label class="mh-toggle"><input type="checkbox" id="tr-seats" ${f.seats?'checked':''}> بها مقاعد</label><label class="mh-toggle"><input type="checkbox" id="tr-cert" ${f.cert?'checked':''}> بشهادة</label></div>
 <ol class="mh-evlist">${list.map(c=>courseRow(c)).join('')||'<li class="mh-empty">لا دورات تطابق التصفية.</li>'}</ol><p class="mh-fine">الدورات أمثلة تدريبية وليست قائمة مقررات رسمية.</p>`;
}
function trCourse(c){
 const el=eligibility(c),b=myBooking(c.id),saved=st('trSaved',[]).includes(c.id);
 return `${crumbs('training',[['التدريب','home'],['الكتالوج','catalog'],[c.ar]])}<article class="mh-event"><header class="mh-event-head"><div class="mh-poster train" aria-hidden="true">${icon({surgical:'clip',emergency:'health',research:'search',comm:'users'}[c.cat]||'award')}</div><div><h2 lang="en">${c.title}</h2><p>${c.ar} · ${c.org}</p><ul class="mh-tags"><li>${MH2.trainCats[c.cat]}</li><li>${c.level}</li><li>${c.mode}</li><li>${c.cert}</li></ul></div></header>
 <div class="mh-event-body"><div><h3>الأهداف التعليمية</h3><ol class="mh-objectives">${c.objectives.map(o=>`<li>${o}</li>`).join('')}</ol><h3>المهارات</h3><ul class="mh-tags">${c.skills.map(s=>`<li lang="en">${s}</li>`).join('')}</ul>
 <h3>اختر الجلسة</h3><ul class="mh-sessions">${c.sessions.map(s=>{const full=s.taken>=s.seats,past=s.date<MH.today,mine=b&&b.session===s.id;return `<li class="${mine?'me':''}"><div><strong>${arDate(s.date,{weekday:'long',day:'numeric',month:'long'})}</strong><small><bdi dir="ltr">${s.time}</bdi> · ${s.place} · ${s.trainer}</small></div><span>${bar(Math.round(s.taken/s.seats*100))} ${s.taken}/${s.seats}</span>${mine?`<span class="mh-pill">${MH2.bookStatus[b.status]}</span>`:past?'<span class="mh-fine">انتهت</span>':b?'':`<button class="btn small" data-action="bk-book" data-course="${c.id}" data-session="${s.id}" ${el.ok?'':'disabled'}>${full?'قائمة الانتظار':'احجز'}</button>`}</li>`;}).join('')}</ul></div>
 <aside class="mh-event-side"><div class="mh-elig ${el.ok?'ok':'no'}">${icon(el.ok?'checkCircle':'alert')}<span><strong>${el.ok?'أنت مؤهل للتسجيل':'غير مؤهل حاليًا'}</strong>${el.ok?`<small>سنتك وسجلك يستوفيان الشروط.</small>`:el.reasons.map(x=>`<small>${x}</small>`).join('')}${el.ok?'':'<small>يمكن طلب مراجعة بشرية إن كانت لديك خبرة سابقة.</small>'}</span></div>
 <dl><div><dt>المدرب</dt><dd>${c.trainer}</dd></div><div><dt>المدة</dt><dd>${c.hours} ساعات · ${c.lang}</dd></div><div><dt>المتطلبات السابقة</dt><dd>${c.pre.map(p=>courseById(p).ar).join('، ')||'لا يوجد'}</dd></div><div><dt>الإكمال</dt><dd>${c.completion}</dd></div><div><dt>الانسحاب</dt><dd>${c.withdraw}</dd></div><div><dt>الرسوم</dt><dd>${c.fee}</dd></div>${c.prep?`<div><dt>التحضير</dt><dd>${c.prep}</dd></div>`:''}</dl>
 <button class="btn secondary" data-action="tr-save" data-id="${c.id}">${icon('bookmark')} ${saved?'محفوظة':'حفظ'}</button>${b&&['confirmed','pending','waitlisted'].includes(b.status)?` <button class="btn secondary" data-action="bk-set" data-id="${b.id}" data-to="cancelled">إلغاء الحجز</button>`:''}
 <p class="mh-fine">حضور الورشة لا يعني التأهل لممارسة المهارة باستقلالية.</p></aside></div></article>`;
}
function trBookings(){
 const groups=[['offer','عروض تنتظر ردك'],['confirmed','مؤكدة وقادمة'],['pending','بانتظار الموافقة'],['waitlisted','قائمة الانتظار'],['completed','مكتملة'],['cancelled','ملغاة أو منسحب منها']],all=bookings();
 const saved=st('trSaved',[]).map(courseById);
 return groups.map(([k,t])=>{const bs=all.filter(b=>b.status===k);return bs.length?`<section class="mh-reggroup"><h2>${t}</h2><ul class="mh-sessions">${bs.map(b=>{const c=courseById(b.course),s=c.sessions.find(x=>x.id===b.session);return `<li><div><strong>${c.ar}</strong><small>${arDate(s.date)} · <bdi dir="ltr">${s.time}</bdi> · ${s.place} · ${s.trainer}</small></div>${k==='offer'?`<button class="btn small" data-action="bk-set" data-id="${b.id}" data-to="confirmed">قبول</button><button class="btn small secondary" data-action="bk-set" data-id="${b.id}" data-to="cancelled">رفض</button>`:`<button class="text-button" data-action="mh-go" data-view="training" data-page="course" data-id="${c.id}">التفاصيل</button>`}</li>`;}).join('')}</ul></section>`:'';}).join('')+(saved.length?`<section class="mh-reggroup"><h2>محفوظة</h2><ol class="mh-evlist">${saved.map(c=>courseRow(c)).join('')}</ol></section>`:'')+'<p class="mh-fine">الحجوزات المؤكدة تظهر في التقويم الموحد.</p>';
}
function trPathways(){
 const P=MH2.pathway,done=completedCourses(),booked=bookings().filter(b=>['confirmed','offer','pending'].includes(b.status)).map(b=>b.course);
 const steps=P.steps.map(([cid,n,req])=>({cid,n,req,state:cid&&done.includes(cid)?'done':cid&&booked.includes(cid)?'now':'next'})),p=pctOf(steps.filter(s=>s.state==='done').length,steps.length);
 return `<section class="mh-path"><h2>${P.name} <span lang="en">${P.en}</span></h2><p class="mh-big">${bar(p)} ${p}% · ${steps.filter(s=>s.state!=='done').length} خطوات متبقية</p><ol class="mh-pathsteps">${steps.map((s,i)=>`<li class="${s.state}"><b>${i+1}</b><span><strong>${s.n}</strong><small>${s.req?'إلزامية':'اختيارية'} · ${{done:'مكتملة ومتحقق منها',now:'محجوزة',next:'لم تبدأ'}[s.state]}</small></span>${s.cid&&s.state==='next'?`<button class="text-button" data-action="mh-go" data-view="training" data-page="course" data-id="${s.cid}">الدورة المقترحة ${icon('arrowLeft')}</button>`:''}</li>`).join('')}</ol></section>`;
}
function trRecord(){
 const all=bookings(),ev=MH2.evidence;
 return `<section><h2>سجلي التدريبي</h2><table class="mh-contrib"><thead><tr><th>الدورة</th><th>الحالة</th><th>الحضور</th><th>الإكمال</th></tr></thead><tbody>${all.map(b=>{const c=courseById(b.course);return `<tr><td><strong>${c.ar}</strong><small lang="en">${c.title}</small></td><td>${MH2.bookStatus[b.status]}</td><td>${b.attended?'حضر':'—'}</td><td>${{completed:'مكتمل',undefined:'غير مكتمل'}[b.completion]||'غير مكتمل'}</td></tr>`;}).join('')}</tbody></table></section>
 <section><h2 class="mh-gap">مستوى الدليل لكل مهارة</h2><table class="mh-skills-ev"><thead><tr><th>المهارة</th>${ev.map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${[['Instrument recognition',3],['Simple interrupted suture',1],['CPR awareness',0]].map(([s,n])=>`<tr><th scope="row" lang="en">${s}</th>${ev.map((_,i)=>`<td><span class="mh-dot ${i<=n?'on':''} ${i===n?'cur':''}"></span></td>`).join('')}</tr>`).join('')}</tbody></table></section>
 <section><h2 class="mh-gap">الشهادات</h2><ul class="mh-certs">${MH2.certs.map(c=>`<li>${icon('award')}<span><strong>${c.title}</strong><small>شهادة ${c.type} · ${c.issuer} · ${arDate(c.date)} · رقم التحقق <bdi dir="ltr">${c.code}</bdi> · ${c.valid}</small></span><button class="btn small secondary" data-action="mh-demo" data-msg="تنزيل الشهادة متاح عند اعتماد الجهة المصدرة؛ هذا نموذج.">${icon('download')} تنزيل</button></li>`).join('')}</ul></section>`;
}
function trInstructor(){
 const c=courseById('c-suture'),s=c.sessions[1],att=st('trAtt',{}),names=['ليان الحربي','محمد الأنصاري','شهد العتيبي','عبدالله الحربي','نوف القرشي'];
 return `<p class="mh-lede">معاينة دور المدرب: <b>${c.ar}</b> · ${arDate(s.date)} · ${s.place}</p><table><thead><tr><th>المتدرب</th><th>الحضور</th><th>متطلبات الإكمال</th></tr></thead><tbody>${names.map((n,i)=>`<tr><td>${n}</td><td><label class="mh-toggle"><input type="checkbox" data-att="${i}" ${att[i]?'checked':''}> حضر</label></td><td>${att[i]?'<span class="mh-pill">بانتظار التقييم العملي</span>':'—'}</td></tr>`).join('')}</tbody></table><p class="mh-fine">الحضور غير الإكمال؛ الإكمال يتطلب ${c.completion}.</p>`;
}
mhViews['training:after']=()=>{
 const f=MHS.s.trFilter;if(f){const bind=(id,k,val=x=>x.value)=>{const el=$('#'+id);el?.addEventListener(el.type==='search'?'input':'change',()=>{f[k]=val(el);MHS.save();renderMH();if(el.type==='search'){const n=$('#'+id);n.focus();n.setSelectionRange(n.value.length,n.value.length);}});};bind('tr-q','q');bind('tr-cat','cat');bind('tr-level','level');bind('tr-mode','mode');bind('tr-seats','seats',x=>x.checked);bind('tr-cert','cert',x=>x.checked);}
 $$('[data-att]').forEach(cb=>cb.addEventListener('change',()=>{st('trAtt',{})[cb.dataset.att]=cb.checked;MHS.save();renderMH();}));
};
document.addEventListener('click',ev=>{
 const b=ev.target.closest('[data-action]');if(!b)return;const a=b.dataset.action;
 if(a==='bk-book'){const c=courseById(b.dataset.course),s=c.sessions.find(x=>x.id===b.dataset.session);if(myBooking(c.id)){toast('لديك حجز في هذه الدورة بالفعل.');return;}const full=s.taken>=s.seats;st('bkNew',[]).push({id:'bk-u'+Date.now(),course:c.id,session:s.id,status:full?'waitlisted':'confirmed'});MHS.save();renderMH();toast(full?'أُضفت لقائمة الانتظار؛ سنرسل لك عرضًا عند توفر مقعد.':'تم تأكيد حجزك، ويظهر في تقويمك.');}
 else if(a==='bk-set'){st('bkOv',{})[b.dataset.id]=b.dataset.to;MHS.save();renderMH();toast(b.dataset.to==='confirmed'?'تم تأكيد المقعد.':'تم الإلغاء؛ انتقل المقعد للتالي في الانتظار.');}
 else if(a==='tr-save'){const s=st('trSaved',[]);MHS.s.trSaved=s.includes(b.dataset.id)?s.filter(x=>x!==b.dataset.id):[...s,b.dataset.id];MHS.save();renderMH();}
 else if(a==='tr-rec'){MHS.s.recOn=!st('recOn',true);MHS.save();renderMH();}
});
