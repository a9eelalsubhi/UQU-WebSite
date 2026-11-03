'use strict';
// Clinical Years: the ward chart. Dashboard, rotations, logbook, requirements, skills, OSCE, case tutor, assessments, passport.
const MHC=MH.clinical;
const levelAr={'Observed':'مشاهدة','Assisted':'مساعدة','Performed Under Supervision':'تنفيذ تحت الإشراف'};
const logStatusAr={draft:'مسودة',pending:'بانتظار المشرف',approved:'معتمد',changes:'مطلوب تعديل',rejected:'مرفوض'};
const clinicalTabs=[['home','لوحتي'],['logbook','السجل والمتطلبات'],['osce','التدريب'],['passport','ملفي السريري']];
const clinicalGroups={home:[['home','اليوم'],['rotation','تفاصيل الروتيشن']],logbook:[['logbook','السجل السريري'],['skills','المتطلبات والمهارات']],osce:[['osce','محطات OSCE'],['tutor','الحالات الافتراضية'],['station','']],passport:[['passport','الجواز السريري'],['assess','التقييمات']]};
const mhTutor={case:null,asked:[],examined:[],tested:[],ddx:null,mode:'guided'};
function reqStats(){const log=clinicalLog();return MHC.requirements.map(r=>{const mine=log.filter(x=>x.req===r.id);const ok=mine.filter(x=>x.status==='approved').length,wait=mine.filter(x=>x.status==='pending').length;return {...r,ok,wait,logged:mine.filter(x=>x.status!=='draft').length,left:Math.max(0,r.need-ok)};});}
function reqMeter(r){const seg=n=>`${Math.min(n,r.need)/r.need*100}%`;return `<span class="mh-meter" aria-label="${r.ok} معتمد، ${r.wait} بانتظار المراجعة، من ${r.need}"><i class="ok" style="width:${seg(r.ok)}"></i><i class="wait" style="width:${seg(r.wait)}"></i></span>`;}
const rotById=id=>MHC.rotations.find(r=>r.id===id);
mhViews['clinical-years']=r=>{
 const page=r.page==='station'?'osce':r.page;
 const body={home:clinicalHome,rotation:()=>clinicalRotation(rotById(r.id)||rotById(MHC.profile.rotation)),logbook:clinicalLogbook,skills:clinicalSkills,osce:()=>r.page==='station'||r.id&&r.page==='osce'?osceStation(MHC.osce.find(o=>o.id===r.id)):osceLibrary(),tutor:clinicalTutor,assess:clinicalAssess,passport:clinicalPassport}[page]||clinicalHome;
 return `<div class="mh-clinical"><header class="mh-chart-head"><div><h1>السنوات السريرية</h1><p>معاينة بصفة طالب السنة الخامسة · بيانات توضيحية</p></div><button class="btn secondary" data-action="mh-go" data-view="clinical-years" data-page="logbook" data-id="new">${icon('plus')} نشاط جديد</button></header>
 ${sectionNav('clinical-years',clinicalTabs,{...clinicalGroups,osce:clinicalGroups.osce.filter(x=>x[1])},r.page==='station'?'osce':r.page)}${body()}</div>`;
};
function rotationTimeline(){
 const start=new Date('2026-08-30'),end=new Date('2027-03-11'),span=end-start,x=d=>((new Date(d)-start)/span*100).toFixed(2),now=x(MH.today);
 return `<figure class="mh-gantt" aria-label="الروتيشنات خلال السنة"><div class="mh-gantt-track">${MHC.rotations.map(r=>`<button class="mh-gantt-bar ${r.status}" style="inset-inline-start:${x(r.start)}%;width:${x(r.end)-x(r.start)}%" data-action="mh-go" data-view="clinical-years" data-page="rotation" data-id="${r.id}"><strong>${r.name}</strong><small lang="en">${r.en}</small></button>`).join('')}<span class="mh-gantt-now" style="inset-inline-start:${now}%"><b>اليوم</b></span></div><figcaption><span>أغسطس 2026</span><span>مارس 2027</span></figcaption></figure>`;
}
function clinicalHome(){
 const p=MHC.profile,cur=rotById(p.rotation),stats=reqStats(),needs=clinicalLog().filter(x=>['changes','draft'].includes(x.status));
 const due=MHC.assessments.filter(a=>a.status==='upcoming').slice(0,3);
 return `<section class="mh-chart"><dl class="mh-chart-grid"><div><dt>السنة</dt><dd>الخامسة</dd></div><div><dt>الروتيشن الحالي</dt><dd>${cur.name} <small lang="en">${cur.en}</small></dd></div><div><dt>موقع التدريب</dt><dd>${e(p.site)}</dd></div><div><dt>المجموعة</dt><dd>${p.group}</dd></div><div><dt>المشرف</dt><dd>${e(p.supervisor)}</dd></div><div><dt>الأسبوع</dt><dd>${cur.week} من ${cur.weeks}</dd></div></dl></section>
 ${rotationTimeline()}
 <div class="mh-ward-grid two"><section><h2>جدول اليوم</h2><ol class="mh-agenda">${p.today.map(([t,what,where])=>`<li class="layer-official"><time>${t}</time><span><strong>${what}</strong><small>${where}</small></span></li>`).join('')}</ol></section>
 <section><h2>يحتاج إجراء منك</h2><ul class="mh-action-list">${needs.map(x=>`<li class="${x.status}"><span>${logStatusAr[x.status]}</span><strong>${MHC.requirements.find(q=>q.id===x.req).name} · ${arDate(x.date)}</strong>${x.feedback?`<small>${e(x.feedback)}</small>`:''}<button class="text-button" data-action="mh-go" data-view="clinical-years" data-page="logbook">فتح ${icon('arrowLeft')}</button></li>`).join('')||'<li>لا شيء الآن.</li>'}</ul>
 <h2>التقييمات القادمة</h2><ul class="mh-plain">${due.map(a=>`<li><b>${arDate(a.date)}</b> <span lang="en">${a.type}</span> — ${a.title} <em class="kind ${a.kind==='رسمي'?'formal':''}">${a.kind}</em></li>`).join('')}</ul></section></div>
 <section class="mh-ward-news"><h2>إعلانات المنسق</h2>${MHC.announcements.map(a=>`<p><time>${arDate(a.date)}</time> ${e(a.text)} <small>— ${e(a.from)}</small></p>`).join('')}</section>`;
}
function clinicalRotation(r){
 const days=['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس'],week=[['جولة 7:30','جولة 7:30','جولة 7:30','جولة 7:30','جولة 7:00'],['CbD 10:00','عيادة 9:00','CbD 10:00','عيادة 9:00','تقييم أسبوعي'],['قسم','قسم','عيادة الصدرية','قسم','—']];
 return `<section class="mh-rot-head"><div><h2>${r.name} <span lang="en">${r.en}</span></h2><p>${arDate(r.start)} — ${arDate(r.end)} · ${e(r.site)}${r.week?` · الأسبوع ${r.week} من ${r.weeks}`:''}</p></div><span class="mh-rot-state ${r.status}">${{done:'منتهٍ',current:'حالي',next:'قادم'}[r.status]}</span></section>
 ${r.status==='current'?`<div class="mh-ward-grid two"><section><h2>أهداف التدريب</h2><ol class="mh-objectives">${r.objectives.map(o=>`<li>${o}</li>`).join('')}</ol><h2>المجموعة والمشرف</h2><p>${MHC.profile.group} · ${e(MHC.profile.supervisor)} · الباطنة 2، الدور الرابع</p><p class="mh-fine">تعليمات الموقع: الحضور بالمعطف والبطاقة الجامعية، والتسجيل عند مكتب التعليم قبل الجولة.</p></section>
 <section><h2>الجدول الأسبوعي</h2><table class="mh-week-table"><thead><tr>${days.map(d=>`<th>${d}</th>`).join('')}</tr></thead><tbody>${week.map(row=>`<tr>${row.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>
 <h2>المواد التعليمية</h2><ul class="mh-plain"><li>${icon('file')} Clinical Module Hub: Internal Medicine — Study Guide</li><li>${icon('file')} OSCE Preparation: محطات الباطنة</li><li>${icon('play')} تسجيلات جلسات CbD</li></ul></section></div>
 <div class="mh-alert">${icon('alert')}<span><strong>تنبيه تعارض:</strong> تقييم DOPS يوم 12 نوفمبر يتداخل مع عيادة الصدرية. أُبلغ منسق الروتيشن؛ لا يتغير أي موعد رسمي تلقائيًا.</span></div>`:'<p class="mh-empty">تظهر تفاصيل الروتيشن وجدوله عند بدايته.</p>'}
 <section><h2>توزيع الروتيشنات</h2>${rotationTimeline()}</section><button class="text-button" data-action="mh-report" data-type="عرض الموارد" data-context="clinical-years/rotation/${r.id}">${icon('alert')} الإبلاغ عن مشكلة في عرض الجدول</button>`;
}
function clinicalLogbook(){
 const log=clinicalLog().sort((a,b)=>b.date.localeCompare(a.date)),isNew=mhRoute['clinical-years'].id==='new';
 return `${isNew?logForm():''}<section class="mh-logbook"><div class="mh-sec-title"><h2>السجل السريري الرقمي</h2>${isNew?'':`<button class="btn small" data-action="mh-go" data-view="clinical-years" data-page="logbook" data-id="new">${icon('plus')} إضافة نشاط</button>`}</div>
 <p class="mh-fine">سجل تعليمي فقط؛ لا تُدخل اسم المريض أو رقم ملفه أو أي بيانات تعريفية. تسجيل النشاط لا يعني اعتماده حتى يراجعه المشرف.</p>
 <ol class="mh-log">${log.map(x=>{const req=MHC.requirements.find(q=>q.id===x.req);return `<li class="${x.status}"><time>${arDate(x.date)}</time><div><strong>${req.name} <small lang="en">${req.en}</small></strong><span>${e(x.dept)} · ${levelAr[x.level]||x.level}</span>${x.note?`<p>${e(x.note)}</p>`:''}${x.feedback&&x.status==='changes'?`<p class="mh-fb"><b>ملاحظة المشرف:</b> ${e(x.feedback)}</p>`:''}</div><span class="mh-stamp">${logStatusAr[x.status]}</span>${x.status==='draft'||x.status==='changes'?`<button class="btn small" data-action="mh-log-submit" data-id="${x.id}">إرسال للمراجعة</button>`:''}</li>`;}).join('')}</ol></section>`;
}
function logForm(){return `<form class="mh-log-form" id="mh-log-form"><h2>نشاط سريري جديد</h2><div class="form-grid"><div class="field"><label for="lg-req">نوع النشاط</label><select id="lg-req" name="req">${MHC.requirements.map(r=>`<option value="${r.id}">${r.name} — ${r.en}</option>`).join('')}</select></div><div class="field"><label for="lg-date">التاريخ</label><input id="lg-date" name="date" type="date" value="${MH.today}" max="${MH.today}" required></div><div class="field"><label for="lg-dept">القسم</label><input id="lg-dept" name="dept" value="الباطنة 2" required maxlength="40"></div><fieldset class="field mh-levels"><legend>مستوى المشاركة</legend>${Object.entries(levelAr).map(([k,v],i)=>`<label><input type="radio" name="level" value="${k}" ${i===2?'checked':''}><span>${v}<small lang="en">${k}</small></span></label>`).join('')}</fieldset><div class="field full"><label for="lg-note">Reflection / ملاحظات تعليمية</label><textarea id="lg-note" name="note" rows="3" maxlength="400" placeholder="ماذا تعلمت؟ دون أي بيانات تعريفية للمريض."></textarea></div></div><div class="mh-form-actions"><button class="btn" name="submit" value="pending">إرسال للمشرف</button><button class="btn secondary" name="submit" value="draft">حفظ كمسودة</button><button type="button" class="text-button" data-action="mh-go" data-view="clinical-years" data-page="logbook">إلغاء</button></div></form>`;}
function clinicalSkills(){
 const lv=MHC.skillLevels;
 return `<section class="mh-skills"><h2>متابعة المهارات والكفاءات</h2><p class="mh-fine">الاعتماد يتم وفق متطلبات الجهة التعليمية بعد مراجعة الدليل.</p><table><thead><tr><th>المهارة</th>${lv.map(l=>`<th>${l}</th>`).join('')}</tr></thead><tbody>${MHC.skills.map(([en,ar,n])=>`<tr><th scope="row">${ar}<small lang="en">${en}</small></th>${lv.map((_,i)=>`<td><span class="mh-dot ${i<=n?'on':''} ${i===n?'cur':''}" aria-label="${i<=n?'منجز':'غير منجز'}"></span></td>`).join('')}</tr>`).join('')}</tbody></table></section>
 <section><h2>المتطلبات حسب الروتيشن</h2><table class="mh-req wide"><thead><tr><th>المتطلب</th><th>التقدم</th><th>مسجّل</th><th>بانتظار المشرف</th><th>معتمد</th><th>متبقٍ</th></tr></thead><tbody>${reqStats().map(r=>`<tr><th scope="row">${r.name}</th><td>${reqMeter(r)}</td><td>${r.logged}</td><td>${r.wait}</td><td>${r.ok}</td><td>${r.left}</td></tr>`).join('')}</tbody></table></section>`;
}
function osceLibrary(){
 const s=MHS.s,skills=[...new Set(MHC.osce.map(o=>o.skill))];
 return `<section class="mh-osce-lib"><h2>مكتبة محطات OSCE</h2>${skills.map(sk=>`<h3 lang="en">${sk}</h3><ul>${MHC.osce.filter(o=>o.skill===sk).map(o=>{const tries=o.attempts.concat(s.osceChecks[o.id+':tries']||[]);const best=tries.length?Math.max(...tries):null;return `<li><button data-action="mh-go" data-view="clinical-years" data-page="station" data-id="${o.id}"><span class="mh-door">${icon('timer')}<b>${o.min}</b><small>دقائق</small></span><span><strong>${o.name}</strong><small lang="en">${o.en}</small></span><span class="mh-ready">${best===null?'لم تتدرب بعد':`أفضل محاولة ${best}% · ${tries.length} محاولة`}</span>${s.osceFav.includes(o.id)?`<span class="mh-fav">${icon('bookmark')}</span>`:''}</button></li>`;}).join('')}</ul>`).join('')}</section>`;
}
function osceStation(o){
 const s=MHS.s,checks=s.osceChecks[o.id]||[],fav=s.osceFav.includes(o.id);
 return `<section class="mh-station"><div class="mh-station-brief"><h2>${o.name} <span lang="en">${o.en}</span></h2><h3>تعليمات المرشح</h3><p>${o.brief}</p><div class="mh-timer" id="mh-timer" data-sec="${o.min*60}"><b id="mh-timer-val">${o.min}:00</b><button class="btn" data-action="mh-timer">${icon('timer')} ابدأ المحطة</button></div><button class="text-button" data-action="mh-osce-fav" data-id="${o.id}">${icon('bookmark')} ${fav?'في المفضلة':'أضف للمفضلة'}</button></div>
 <div class="mh-station-check"><h3>قائمة التقييم</h3><ol>${o.checklist.map((c,i)=>`<li><label><input type="checkbox" data-osce="${o.id}" data-i="${i}" ${checks.includes(i)?'checked':''}><span>${c}</span></label></li>`).join('')}</ol><div class="mh-station-foot"><span id="mh-osce-score">${pctOf(checks.length,o.checklist.length)}% من البنود</span><button class="btn secondary small" data-action="mh-osce-save" data-id="${o.id}">حفظ المحاولة</button></div></div></section>`;
}
function clinicalTutor(){
 if(!mhTutor.case)return `<section class="mh-tutor-pick"><h2>المعلم السريري الافتراضي</h2><p>حالات افتراضية تعليمية: اسأل المريض، افحصه، اطلب الفحوصات، ثم قدّم تشخيصك واحصل على تغذية راجعة.</p><p class="mh-chat-note">${icon('info')} عرض توضيحي: الحالة مبرمجة مسبقًا وليست نموذج ذكاء اصطناعي، وجميع الحالات افتراضية.</p><div class="mh-seg" role="group" aria-label="الوضع"><button class="${mhTutor.mode==='guided'?'active':''}" data-action="mh-tmode" data-mode="guided">Guided OSCE</button><button class="${mhTutor.mode==='free'?'active':''}" data-action="mh-tmode" data-mode="free">Free Practice</button></div><ul class="mh-cases">${Object.entries(MH.tutorCases).map(([k,c])=>`<li><button data-action="mh-tcase" data-id="${k}"><strong>${c.name}</strong><small lang="en">${c.en}</small><span>${e(c.patient)}</span></button></li>`).join('')}</ul></section>`;
 const c=MH.tutorCases[mhTutor.case];
 const msgs=[`<div class="mh-msg bot"><b>${e(c.patient)}</b><br>${e(c.opening)}</div>`].concat(mhTutor.asked.map(i=>`<div class="mh-msg me">${e(c.history[i][0])}</div><div class="mh-msg bot">${e(c.history[i][1])}</div>`));
 const fb=mhTutor.ddx!==null?tutorFeedback(c):'';
 return `<section class="mh-tutor"><div class="mh-tutor-head"><h2>حالة: ${c.name}</h2><button class="text-button" data-action="mh-tcase" data-id="">${icon('refresh')} حالة أخرى</button></div>
 <div class="mh-tutor-grid"><div class="mh-chat"><div class="mh-chat-log">${msgs.join('')}</div><h3>اسأل المريض</h3><div class="mh-chips">${c.history.map((h,i)=>`<button data-action="mh-task" data-i="${i}" ${mhTutor.asked.includes(i)?'disabled':''}>${h[0]}</button>`).join('')}</div></div>
 <div class="mh-tutor-side"><h3>الفحص السريري</h3><ul class="mh-reveal">${c.exam.map((x,i)=>`<li>${mhTutor.examined.includes(i)?`<b>${x[0]}:</b> ${x[1]}`:`<button data-action="mh-texam" data-i="${i}">${x[0]}</button>`}</li>`).join('')}</ul>
 <h3>الفحوصات</h3><ul class="mh-reveal">${c.tests.map((x,i)=>`<li>${mhTutor.tested.includes(i)?`<b>${x[0]}:</b> ${x[1]}`:`<button data-action="mh-ttest" data-i="${i}">اطلب ${x[0]}</button>`}</li>`).join('')}</ul>
 <h3>التشخيص التفريقي الأرجح</h3><div class="mh-ddx">${c.ddx.map((d,i)=>`<button class="${mhTutor.ddx===i?(d[1]?'right':'wrong'):''}" data-action="mh-tddx" data-i="${i}" ${mhTutor.ddx!==null?'disabled':''}>${d[0]}</button>`).join('')}</div>${fb}</div></div></section>`;
}
function tutorFeedback(c){
 const askedKeys=mhTutor.asked.map(i=>c.history[i][2]),missed=c.key.filter(k=>!askedKeys.includes(k)).map(k=>c.history.find(h=>h[2]===k)[0]);
 const needTests=c.tests.filter(t=>t[2]).map(t=>t[0]),missedTests=needTests.filter(t=>!mhTutor.tested.includes(c.tests.findIndex(x=>x[0]===t)));
 const extra=mhTutor.tested.filter(i=>!c.tests[i][2]).map(i=>c.tests[i][0]);
 const right=c.ddx[mhTutor.ddx][1],score=Math.round(((c.key.length-missed.length)/c.key.length*50)+(right?35:0)+(missedTests.length?0:15));
 return `<div class="mh-feedback"><h3>Feedback · ${score}%</h3><p>${right?'تشخيصك صحيح.':'التشخيص الأرجح: '+c.ddx.find(d=>d[1])[0]+'.'}</p>${missed.length?`<p><b>أسئلة مهمة لم تسألها:</b> ${missed.join('، ')}</p>`:'<p>غطّيت أسئلة التاريخ المرضي الأساسية.</p>'}${missedTests.length?`<p><b>فحوصات لازمة لم تطلبها:</b> ${missedTests.join('، ')}</p>`:''}${extra.length?`<p><b>فحوصات غير ضرورية الآن:</b> ${extra.join('، ')}</p>`:''}${mhTutor.mode==='guided'?'<p class="mh-fine">قدّم الحالة بصوت عالٍ: المريض، الشكوى، النتائج الإيجابية والسلبية المهمة، التشخيص، والخطة.</p>':''}</div>`;
}
function clinicalAssess(){
 return `<section><h2>التقييمات والتغذية الراجعة</h2><table class="mh-assess"><thead><tr><th>النموذج</th><th>العنوان</th><th>التاريخ</th><th>النوع</th><th>الحالة</th></tr></thead><tbody>${MHC.assessments.map(a=>`<tr><td lang="en">${a.type}</td><td>${a.title}${a.feedback?`<small>ملاحظة المشرف: ${a.feedback}</small>`:''}</td><td>${arDate(a.date)}</td><td><em class="kind ${a.kind==='رسمي'?'formal':''}">${a.kind}</em></td><td>${a.status==='done'?`مكتمل · ${a.score}`:'قادم'}</td></tr>`).join('')}</tbody></table></section>
 <section class="mh-rubric"><h2>معيار Mini-CEX</h2><ol><li>أخذ التاريخ المرضي</li><li>الفحص السريري</li><li>الاحترافية</li><li>الحكم السريري</li><li>التواصل</li><li>التنظيم والكفاءة</li></ol><p class="mh-fine">يُقيَّم كل بند من 1 إلى 9. التقييمات التدريبية لا تدخل في الدرجة الرسمية.</p></section>`;
}
function clinicalPassport(){
 const log=clinicalLog(),ok=log.filter(x=>x.status==='approved');
 return `<section class="mh-passport"><header><span class="mh-passport-mark">${icon('passport')}</span><div><h2>الجواز السريري</h2><p>رحلتك من السنة الرابعة إلى السادسة · يرتبط بملفك الشخصي العام دون تكرار السجلات</p></div></header>
 <ol class="mh-stamps">${MHC.rotations.map(r=>`<li class="${r.status}"><strong>${r.name}</strong><small>${arDate(r.start,{month:'short',year:'numeric'})}</small><span>${{done:'مكتمل · معتمد',current:'جارٍ',next:'لم يبدأ'}[r.status]}</span></li>`).join('')}</ol>
 <dl class="mh-passport-stats"><div><dt>أنشطة معتمدة</dt><dd>${ok.length}</dd></div><div><dt>مهارات معتمدة</dt><dd>${MHC.skills.filter(x=>x[2]>=4).length} من ${MHC.skills.length}</dd></div><div><dt>تقييمات مكتملة</dt><dd>${MHC.assessments.filter(a=>a.status==='done').length}</dd></div></dl>
 <h3>الإنجازات</h3><ul class="mh-plain"><li>${icon('award')} شهادة BLS — <span class="src official">موثّق</span></li><li>${icon('award')} مشاركة في حملة التبرع بالدم — <span class="src student">أضافها الطالب</span></li></ul></section>`;
}
mhViews['clinical-years:after']=r=>{
 const f=$('#mh-log-form');f?.addEventListener('submit',ev=>{ev.preventDefault();const d=new FormData(f),status=ev.submitter?.value||'pending';const note=String(d.get('note')).trim();
  if(/\b\d{6,}\b/.test(note)){toast('يبدو أن الملاحظة تحتوي رقمًا تعريفيًا؛ احذفه قبل الحفظ.');return;}
  MHS.s.log.push({id:'lg-u'+Date.now(),req:d.get('req'),date:d.get('date'),dept:String(d.get('dept')).trim(),level:d.get('level'),note,status});MHS.save();mhRoute['clinical-years']={page:'logbook'};renderMH(true);toast(status==='draft'?'حُفظ النشاط كمسودة.':'أُرسل النشاط للمشرف.');});
 $$('[data-osce]').forEach(cb=>cb.addEventListener('change',()=>{const id=cb.dataset.osce,s=MHS.s;const set=new Set(s.osceChecks[id]||[]);cb.checked?set.add(+cb.dataset.i):set.delete(+cb.dataset.i);s.osceChecks[id]=[...set];MHS.save();const o=MHC.osce.find(x=>x.id===id);$('#mh-osce-score').textContent=pctOf(set.size,o.checklist.length)+'% من البنود';}));
};
let osceTimer=null;
document.addEventListener('click',ev=>{
 const b=ev.target.closest('[data-action]');if(!b)return;const a=b.dataset.action,s=MHS.s;
 if(a==='mh-log-submit'){s.logStatus[b.dataset.id]='pending';const u=s.log.find(x=>x.id===b.dataset.id);if(u)u.status='pending';MHS.save();renderMH();toast('أُرسل النشاط للمشرف.');}
 else if(a==='mh-osce-fav'){const id=b.dataset.id;s.osceFav=s.osceFav.includes(id)?s.osceFav.filter(x=>x!==id):[...s.osceFav,id];MHS.save();renderMH();}
 else if(a==='mh-osce-save'){const id=b.dataset.id,o=MHC.osce.find(x=>x.id===id),p=pctOf((s.osceChecks[id]||[]).length,o.checklist.length);s.osceChecks[id+':tries']=[...(s.osceChecks[id+':tries']||[]),p];s.osceChecks[id]=[];MHS.save();clearInterval(osceTimer);renderMH();toast(`حُفظت المحاولة: ${p}%`);}
 else if(a==='mh-timer'){const box=$('#mh-timer');let left=+box.dataset.sec;clearInterval(osceTimer);b.disabled=true;b.textContent='جارية…';osceTimer=setInterval(()=>{left--;const el=$('#mh-timer-val');if(!el){clearInterval(osceTimer);return;}el.textContent=`${Math.floor(left/60)}:${String(left%60).padStart(2,'0')}`;box.classList.toggle('late',left<=60);if(left<=0){clearInterval(osceTimer);el.textContent='انتهى الوقت';}},1000);}
 else if(a==='mh-tmode'){mhTutor.mode=b.dataset.mode;renderMH();}
 else if(a==='mh-tcase'){Object.assign(mhTutor,{case:b.dataset.id||null,asked:[],examined:[],tested:[],ddx:null});renderMH();}
 else if(a==='mh-task'){mhTutor.asked.push(+b.dataset.i);renderMH();$('.mh-chat-log')?.lastElementChild?.scrollIntoView({block:'nearest'});}
 else if(a==='mh-texam'){mhTutor.examined.push(+b.dataset.i);renderMH();}
 else if(a==='mh-ttest'){mhTutor.tested.push(+b.dataset.i);renderMH();}
 else if(a==='mh-tddx'){mhTutor.ddx=+b.dataset.i;renderMH();}
});
