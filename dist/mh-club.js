'use strict';
// Student Club: structure, explore, recruitment, applications, my club, team workspace, admissions.
const CL=MH.club;
const catAr={exec:['اللجان التنفيذية','Executive Committees'],team:['الفرق التخصصية','Specialized Teams'],prog:['البرامج المستمرة','Continuous Programs']};
const appStatusAr={draft:'مسودة',submitted:'قيد المراجعة',screened:'اجتاز الفرز',interview:'مقابلة مجدولة',offer:'عرض عضوية',accepted:'عضوية مفعّلة',waitlist:'قائمة الانتظار',rejected:'لم يُقبل',withdrawn:'مسحوب'};
const clubTabs=[['home','النادي'],['positions','التقديم'],['mine','ناديي']];
const clubGroups={home:[['home','نظرة عامة'],['structure','الهيكل التنظيمي'],['explore','الفرق واللجان']],positions:[['positions','الفرص المفتوحة'],['apps','طلباتي']],mine:[['mine','عضوياتي ومهامي'],['workspace','مساحة الفريق'],['admissions','لجنة القبول']]};
const unitById=id=>CL.units.find(u=>u.id===id);
const posById=id=>CL.positions.find(p=>p.id===id);
const posState=p=>MH.today<p.opens?'upcoming':MH.today>p.closes?'closed':'open';
const posStateAr={open:'مفتوح',closed:'مغلق',upcoming:'قادم'};
function myApps(){const s=MHS.s;return CL.applications.concat(s.apps).map(a=>({...a,status:s.decisions[a.id]||a.status}));}
function activeMemberships(){const s=MHS.s;return CL.memberships.filter(m=>!m.past).concat(myApps().filter(a=>a.status==='accepted').map(a=>({unit:posById(a.pos).unit,role:posById(a.pos).title,since:'2026-11'})));}
mhViews['student-club']=r=>{
 const page=r.page==='unit'?'explore':r.page==='apply'?'positions':r.page;
 const body={home:clubHome,structure:clubStructure,explore:()=>r.page==='unit'?clubUnit(unitById(r.id)):clubExplore(),positions:()=>r.page==='apply'?clubApply(posById(r.id)):clubPositions(),apps:clubApps,mine:clubMine,workspace:clubWorkspace,admissions:clubAdmissions}[page]||clubHome;
 return `<div class="mh-club"><header class="mh-club-head"><div><h1>النادي الطلابي</h1></div></header>
 ${sectionNav('student-club',clubTabs,clubGroups,r.page==='unit'?'explore':r.page==='apply'?'positions':r.page)}${body()}</div>`;
};
function clubHome(){
 const open=CL.positions.filter(p=>posState(p)==='open'),apps=myApps().filter(a=>!['rejected','withdrawn'].includes(a.status));
 return `<p class="mh-lede">${e(CL.about)}</p><div class="mh-club-home"><section class="mh-club-lead"><h2>القيادة</h2><ul>${CL.leaders.map(([r,n])=>`<li><span class="avatar">${n[0]}</span><span><strong>${n}</strong><small>${r}</small></span></li>`).join('')}</ul></section>
 <section class="mh-club-news"><h2>الأخبار والإعلانات</h2><ul>${CL.news.map(n=>`<li class="${n.pinned?'pinned':''}"><time>${arDate(n.date)}</time><span>${n.pinned?'<b>مثبّت</b> ':''}${e(n.title)}</span></li>`).join('')}</ul></section>
 <section class="mh-club-open"><div class="mh-sec-title"><h2>فرص مفتوحة الآن</h2><button class="text-button" data-action="mh-go" data-view="student-club" data-page="positions">كل الفرص ${icon('arrowLeft')}</button></div><ul>${open.map(p=>`<li><button data-action="mh-go" data-view="student-club" data-page="apply" data-id="${p.id}"><strong>${p.title}</strong><span>${unitById(p.unit).name}</span><small>يغلق ${arDate(p.closes)} · ${p.seats} مقاعد</small></button></li>`).join('')}</ul></section>
 <section class="mh-club-mine"><h2>طلباتي النشطة</h2>${apps.length?`<ul>${apps.map(a=>`<li><strong>${posById(a.pos).title}</strong> · ${unitById(posById(a.pos).unit).name}<span class="mh-pill s-${a.status}">${appStatusAr[a.status]}</span></li>`).join('')}</ul>`:'<p>لا طلبات نشطة.</p>'}<button class="btn secondary small" data-action="mh-go" data-view="student-club" data-page="apps">متابعة طلباتي</button></section></div>`;
}
function clubStructure(){
 return `<figure class="mh-org" aria-label="الهيكل التنظيمي للنادي"><div class="mh-org-top"><div class="mh-org-node lead"><strong>رئاسة النادي</strong><small>${CL.leaders.map(l=>l[1]).join(' · ')}</small></div><div class="mh-org-centers">${CL.centers.map(c=>`<span>${c}</span>`).join('')}</div></div>
 <div class="mh-org-cats">${Object.entries(catAr).map(([k,[ar,en]])=>`<section class="mh-org-cat cat-${k}"><h2>${ar}<small lang="en">${en}</small></h2><ul>${CL.units.filter(u=>u.cat===k).map(u=>`<li><button data-action="mh-go" data-view="student-club" data-page="unit" data-id="${u.id}"><strong>${u.name}</strong><small>${u.lead}</small></button>${u.committees.length?`<ul class="mh-org-sub">${u.committees.map(c=>`<li>${c}</li>`).join('')}</ul>`:''}</li>`).join('')}</ul></section>`).join('')}</div>
 <figcaption>يمكن للطالب عضوية نشطة واحدة في كل فئة من الفئات الثلاث، ويمكنه العمل في أكثر من لجنة داخلية ضمن فريقه التخصصي نفسه.</figcaption></figure>`;
}
function clubExplore(){
 const f=mhRoute['student-club'].f||'all',q=(mhRoute['student-club'].q||'').toLowerCase();
 const list=CL.units.filter(u=>(f==='all'||u.cat===f)&&(!q||(u.name+u.about).toLowerCase().includes(q)));
 return `<div class="mh-explore-bar"><label class="search-field">${icon('search')}<input id="mh-club-q" type="search" placeholder="ابحث عن فريق أو لجنة أو برنامج" value="${e(q)}"></label><div class="mh-seg" role="group" aria-label="الفئة">${[['all','الكل'],['exec','لجان تنفيذية'],['team','فرق تخصصية'],['prog','برامج مستمرة']].map(([k,t])=>`<button class="${k===f?'active':''}" data-action="mh-club-f" data-f="${k}">${t}</button>`).join('')}</div></div>
 <ul class="mh-units">${list.map(u=>{const open=CL.positions.filter(p=>p.unit===u.id&&posState(p)==='open').length;return `<li class="cat-${u.cat}"><button data-action="mh-go" data-view="student-club" data-page="unit" data-id="${u.id}"><span class="mh-unit-mark">${u.name.replace(/^(لجنة|فريق|برنامج) /,'').slice(0,2)}</span><span><strong>${u.name}</strong><small>${catAr[u.cat][0]} · ${u.lead}</small><span>${u.about}</span></span>${open?`<em>${open} فرصة مفتوحة</em>`:''}</button></li>`;}).join('')||'<li class="mh-empty">لا نتائج.</li>'}</ul>`;
}
function clubUnit(u){
 const pos=CL.positions.filter(p=>p.unit===u.id);
 return `${crumbs('student-club',[['استكشف','explore'],[u.name]])}<section class="mh-unit-page cat-${u.cat}"><header><span class="mh-unit-mark big">${u.name.replace(/^(لجنة|فريق|برنامج) /,'').slice(0,2)}</span><div><h2>${u.name}</h2><p>${catAr[u.cat][0]} · الرئيس: ${u.lead}</p></div></header><p>${u.about}</p>
 ${u.committees.length?`<h3>اللجان الداخلية</h3><ul class="mh-tags">${u.committees.map(c=>`<li>${c}</li>`).join('')}</ul>`:''}
 <h3>المناصب والتقديم</h3>${pos.length?`<ul class="mh-plain">${pos.map(p=>`<li><b>${p.title}</b> — ${posStateAr[posState(p)]} · ${arDate(p.opens)} إلى ${arDate(p.closes)} ${posState(p)==='open'?`<button class="text-button" data-action="mh-go" data-view="student-club" data-page="apply" data-id="${p.id}">قدّم ${icon('arrowLeft')}</button>`:''}</li>`).join('')}</ul>`:'<p class="mh-fine">لا توجد فرص معلنة حاليًا.</p>'}
 <h3>الأنشطة المرتبطة</h3><p class="mh-fine">تظهر فعاليات الجهة في التقويم الموحد وقسم الأنشطة والمبادرات دون نسخ مكررة.</p></section>`;
}
function clubPositions(){
 const groups=['open','upcoming','closed'];
 return groups.map(g=>{const ps=CL.positions.filter(p=>posState(p)===g);return ps.length?`<section class="mh-positions ${g}"><h2>${{open:'مفتوحة للتقديم',upcoming:'تفتح قريبًا',closed:'مغلقة'}[g]}</h2><table><thead><tr><th>المنصب</th><th>الجهة</th><th>المقاعد</th><th>الفترة</th><th>مقابلة</th><th></th></tr></thead><tbody>${ps.map(p=>`<tr><td><strong>${p.title}</strong></td><td>${unitById(p.unit).name}</td><td>${p.seats}</td><td>${arDate(p.opens)} — ${arDate(p.closes)}</td><td>${p.interview?'نعم':'لا'}</td><td>${g==='open'?`<button class="btn small" data-action="mh-go" data-view="student-club" data-page="apply" data-id="${p.id}">قدّم</button>`:''}</td></tr>`).join('')}</tbody></table></section>`:'';}).join('');
}
function clubApply(p){
 const u=unitById(p.unit),s=MHS.s,draft=s.drafts[p.id]||{},existing=myApps().find(a=>a.pos===p.id&&!['withdrawn'].includes(a.status));
 const clash=activeMemberships().find(m=>unitById(m.unit).cat===u.cat&&m.unit!==u.id);
 if(existing)return `${crumbs('student-club',[['فرص التقديم','positions'],[p.title]])}<p class="mh-empty">قدّمت على هذا المنصب مسبقًا. <button class="text-button" data-action="mh-go" data-view="student-club" data-page="apps">تابع حالة الطلب</button></p>`;
 return `${crumbs('student-club',[['فرص التقديم','positions'],[p.title]])}<form class="mh-apply" id="mh-apply" data-id="${p.id}"><header><h2>${p.title}</h2><p>${u.name} · ${p.seats} مقاعد · يغلق ${arDate(p.closes)}${p.interview?' · تتضمن مقابلة':''}</p><p class="mh-fine">يُحال الطلب إلى: ${p.route}</p></header>
 <section><h3>المتطلبات</h3><ul class="mh-plain">${p.reqs.map(x=>`<li>${icon('check')} ${x}</li>`).join('')}</ul></section>
 ${clash?`<div class="mh-alert">${icon('alert')}<span>لديك عضوية نشطة في «${unitById(clash.unit).name}» ضمن الفئة نفسها. يُسمح بعضوية نشطة واحدة في كل فئة؛ عند القبول ستُراجَع العضوية الحالية.</span></div>`:''}
 ${p.questions.map((q,i)=>`<div class="field"><label for="q${i}">${q}</label><textarea id="q${i}" name="q${i}" rows="3" required maxlength="600">${e(draft['q'+i]||'')}</textarea></div>`).join('')}
 <div class="field"><label for="hours">التفرغ الأسبوعي المتوقع</label><select id="hours" name="hours">${['ساعتان','3–4 ساعات','5 ساعات فأكثر'].map(h=>`<option ${draft.hours===h?'selected':''}>${h}</option>`).join('')}</select></div>
 <fieldset class="field mh-share"><legend>مشاركة أجزاء من ملفك الشخصي (اختياري، بموافقتك)</legend>${[['memberships','عضوياتي السابقة'],['achievements','الإنجازات الموثقة'],['clinical','الجواز السريري']].map(([k,t])=>`<label><input type="checkbox" name="share" value="${k}" ${draft.share?.includes(k)?'checked':''}> ${t}</label>`).join('')}</fieldset>
 <button type="button" class="text-button" data-action="mh-report" data-type="استخدام قسم في المنصة" data-context="student-club/apply/${p.id}">${icon('alert')} مشكلة في التقديم؟</button><div class="mh-form-actions"><button class="btn" name="go" value="submit">إرسال الطلب</button><button class="btn secondary" name="go" value="draft">حفظ كمسودة</button></div></form>`;
}
function clubApps(){
 const steps=['submitted','screened','interview','offer','accepted'];
 const apps=myApps();
 return `<section class="mh-apps"><h2>طلباتي</h2><ol>${apps.map(a=>{const p=posById(a.pos),u=unitById(p.unit),i=steps.indexOf(a.status);return `<li class="s-${a.status}"><header><div><strong>${p.title}</strong><small>${u.name} · قُدّم ${arDate(a.date)}</small></div><span class="mh-pill s-${a.status}">${appStatusAr[a.status]}</span></header>
 ${i>=0?`<ol class="mh-steps" aria-label="مراحل الطلب">${steps.map((st,k)=>`<li class="${k<i?'done':k===i?'now':''}">${appStatusAr[st]}</li>`).join('')}</ol>`:''}
 ${a.interview&&a.status==='interview'?`<p class="mh-interview">${icon('calendar')} المقابلة: ${arDate(a.interview.date.slice(0,10),{weekday:'long',day:'numeric',month:'long'})} الساعة ${a.interview.date.slice(11)} · ${a.interview.place}</p>`:''}
 ${a.status==='offer'?`<div class="mh-offer"><p>${a.alt?'عُرض عليك منصب بديل: ':''}<b>${a.alt||p.title}</b>. وافق لتفعيل العضوية.</p><button class="btn small" data-action="mh-app" data-id="${a.id}" data-to="accepted">قبول العرض</button><button class="btn secondary small" data-action="mh-app" data-id="${a.id}" data-to="withdrawn">اعتذار</button></div>`:''}
 <details><summary>سجل الطلب</summary><ol class="mh-history">${(a.history||[[a.date,'قُدّم الطلب']]).map(([d,t])=>`<li><time>${arDate(d)}</time>${t}</li>`).join('')}</ol></details>
 ${['submitted','screened'].includes(a.status)?`<button class="text-button" data-action="mh-app" data-id="${a.id}" data-to="withdrawn">سحب الطلب</button>`:''}</li>`;}).join('')}</ol>
 ${Object.keys(MHS.s.drafts).length?`<h3>مسودات</h3><ul class="mh-plain">${Object.keys(MHS.s.drafts).map(id=>`<li>${posById(id).title} <button class="text-button" data-action="mh-go" data-view="student-club" data-page="apply" data-id="${id}">إكمال</button></li>`).join('')}</ul>`:''}</section>`;
}
function clubMine(){
 const ms=activeMemberships(),past=CL.memberships.filter(m=>m.past),tasks=clubTasks().filter(t=>t.owner==='أنت'&&t.status!=='done');
 return `<div class="mh-mine"><section><h2>عضوياتي</h2><ul class="mh-member">${ms.map(m=>{const u=unitById(m.unit);return `<li class="cat-${u.cat}"><span class="mh-unit-mark">${u.name.replace(/^(لجنة|فريق|برنامج) /,'').slice(0,2)}</span><span><strong>${u.name}</strong><small>${m.role} · منذ ${m.since}</small></span><button class="text-button" data-action="mh-go" data-view="student-club" data-page="workspace">مساحة العمل ${icon('arrowLeft')}</button></li>`;}).join('')}</ul>${past.length?`<p class="mh-fine">سابقًا: ${past.map(m=>`${unitById(m.unit).name} (${m.since} — ${m.until})`).join('، ')}</p>`:''}</section>
 <section><h2>مهامي من كل الجهات</h2><ul class="mh-tasklist">${tasks.map(t=>`<li class="p-${t.priority}"><strong>${t.title}</strong><small>${unitById(t.unit).name} · التسليم ${arDate(t.due)}</small><span class="mh-pill">${{new:'جديدة',progress:'قيد التنفيذ'}[t.status]}</span></li>`).join('')||'<li>لا مهام مفتوحة.</li>'}</ul></section>
 <section><h2>اجتماعات قادمة</h2><ul class="mh-plain">${MH.events.filter(ev=>ev.layer==='club'&&ev.date>=MH.today).map(ev=>`<li><b>${arDate(ev.date)} ${ev.start}</b> ${ev.title}</li>`).join('')}</ul><h2>ملفات جديدة</h2><ul class="mh-plain">${CL.files.map(([n,d])=>`<li>${icon('file')} ${n} <small>${arDate(d)}</small></li>`).join('')}</ul></section>
 <p class="mh-fine">تُربط العضويات والمناصب بملفك الشخصي، مع التفريق بين الموثّق وما أضفته بنفسك.</p></div>`;
}
function clubTasks(){const s=MHS.s;return CL.tasks.concat(s.myTasks).map(t=>({...t,status:s.taskStatus[t.id]||t.status}));}
function clubWorkspace(){
 const u=unitById('prog-volunteer'),tasks=clubTasks().filter(t=>t.unit===u.id),cols=[['new','جديدة'],['progress','قيد التنفيذ'],['done','مكتملة']];
 return `<section class="mh-ws"><header><div><h2>${u.name}</h2><p>مساحة عمل خاصة · ${u.lead} (الرئيس) · 14 عضوًا</p></div><button class="btn small" data-action="mh-task-new">${icon('plus')} مهمة</button></header>
 <div class="mh-kanban">${cols.map(([k,t])=>`<section class="mh-col col-${k}" aria-label="${t}"><h3>${t} <span>${tasks.filter(x=>x.status===k).length}</span></h3><ol>${tasks.filter(x=>x.status===k).map(x=>`<li class="p-${x.priority}"><strong>${e(x.title)}</strong><small>${e(x.owner)} · ${arDate(x.due)}${x.due<MH.today&&k!=='done'?' · <b class="late">متأخرة</b>':''}</small><span class="mh-move">${k!=='new'?`<button data-action="mh-move" data-id="${x.id}" data-to="${k==='done'?'progress':'new'}" aria-label="إرجاع">${icon('arrowRight')}</button>`:''}${k!=='done'?`<button data-action="mh-move" data-id="${x.id}" data-to="${k==='new'?'progress':'done'}" aria-label="تقديم">${icon('arrowLeft')}</button>`:`<button data-action="mh-move" data-id="${x.id}" data-to="progress" aria-label="إعادة فتح">${icon('refresh')}</button>`}</span></li>`).join('')}</ol></section>`).join('')}</div>
 <div class="mh-ws-side"><section><h3>الإعلانات الداخلية</h3><p><b>مثبّت:</b> اجتماع الأربعاء 7 مساءً لمراجعة خطة حملة السكري.</p></section><section><h3>الملفات المشتركة</h3><ul class="mh-plain">${CL.files.map(([n])=>`<li>${icon('file')} ${n}</li>`).join('')}</ul></section><section><h3>سجل النشاط</h3><ul class="mh-plain"><li>جود الصبحي رفعت «هوية الحملة.zip»</li><li>ريان الغامدي أسند إليك مهمة حجز القاعة</li></ul></section></div></section>`;
}
function clubAdmissions(){
 const s=MHS.s,p=posById('pos-5');
 return `<section class="mh-adm"><h2>لجنة القبول — فريق الطوارئ</h2><p>طلبات «${p.title}». تعرض هذه الصفحة لأنك عضو في لجنة القبول بالفريق.</p>
 <table><thead><tr><th>المتقدم</th><th>الإجابة</th><th>الحالة</th><th>القرار</th></tr></thead><tbody>${CL.candidates.map(c=>{const st=s.decisions[c.id]||c.status;return `<tr><td>${c.name}</td><td>${c.answers.join(' ')}</td><td><span class="mh-pill s-${st}">${{review:'قيد المراجعة',...appStatusAr}[st]}</span></td><td>${c.self?'<small class="mh-lock">'+icon('lock')+' لا يمكنك مراجعة طلبك</small>':st==='review'?`<div class="mh-decide"><button class="btn small" data-action="mh-decide" data-id="${c.id}" data-to="interview">جدولة مقابلة</button><button class="btn small secondary" data-action="mh-decide" data-id="${c.id}" data-to="offer">قبول</button><button class="btn small secondary" data-action="mh-decide" data-id="${c.id}" data-to="waitlist">انتظار</button><button class="btn small secondary" data-action="mh-decide" data-id="${c.id}" data-to="rejected">رفض</button></div>`:'<small>صدر القرار</small>'}</td></tr>`;}).join('')}</tbody></table>
 <p class="mh-fine">رئاسة الفرق التخصصية تُحال للجنة القبول المركزية، واللجان الداخلية للجنة قبول الفريق، واللجان التنفيذية والبرامج لجهة قبولها.</p></section>`;
}
mhViews['student-club:after']=r=>{
 const q=$('#mh-club-q');q?.addEventListener('input',()=>{mhRoute['student-club'].q=q.value;renderMH();const n=$('#mh-club-q');n.focus();n.setSelectionRange(n.value.length,n.value.length);});
 const f=$('#mh-apply');f?.addEventListener('submit',ev=>{ev.preventDefault();const d=new FormData(f),id=f.dataset.id,s=MHS.s,p=posById(id);
  const vals={hours:d.get('hours'),share:d.getAll('share')};p.questions.forEach((_,i)=>vals['q'+i]=String(d.get('q'+i)||'').trim());
  if(ev.submitter?.value==='draft'){s.drafts[id]=vals;MHS.save();toast('حُفظت المسودة.');return;}
  delete s.drafts[id];s.apps.push({id:'app-u'+Date.now(),pos:id,date:MH.today,status:'submitted',history:[[MH.today,'قُدّم الطلب وأُحيل إلى '+p.route]]});MHS.save();mhRoute['student-club']={page:'apps'};renderMH(true);toast('أُرسل طلبك.');});
};
document.addEventListener('click',ev=>{
 const b=ev.target.closest('[data-action]');if(!b)return;const a=b.dataset.action,s=MHS.s;
 if(a==='mh-club-f'){mhRoute['student-club'].f=b.dataset.f;renderMH();}
 else if(a==='mh-app'){s.decisions[b.dataset.id]=b.dataset.to;MHS.save();renderMH();toast(b.dataset.to==='accepted'?'فُعّلت عضويتك.':'تم تحديث الطلب.');}
 else if(a==='mh-move'){s.taskStatus[b.dataset.id]=b.dataset.to;MHS.save();renderMH();}
 else if(a==='mh-decide'){s.decisions[b.dataset.id]=b.dataset.to;MHS.save();renderMH();toast('سُجّل القرار وأُشعر المتقدم.');}
 else if(a==='mh-task-new'){const t=prompt('عنوان المهمة:');if(!t?.trim())return;s.myTasks.push({id:'t-u'+Date.now(),unit:'prog-volunteer',title:t.trim().slice(0,80),owner:'أنت',due:'2026-11-14',priority:'متوسطة',status:'new'});MHS.save();renderMH();toast('أُضيفت المهمة وأُشعر المسؤول.');}
});
