'use strict';
// Basic Years: curriculum strip, module hub, lecture hub, progress tracker, saved items.
const basicState={year:3,group:'week',quiz:null};
const specialtyAr={Anatomy:'التشريح',Physiology:'وظائف الأعضاء',Pathology:'علم الأمراض',Histology:'الأنسجة',Embryology:'الأجنة',Biochemistry:'الكيمياء الحيوية',Radiology:'الأشعة'};
function lectureRow(l){const s=MHS.s,done=s.done.includes(l.id),saved=s.saved.includes(l.id);
 return `<li class="mh-lec ${done?'is-done':''}"><button class="mh-check" data-action="mh-done" data-id="${l.id}" aria-pressed="${done}" aria-label="${done?'إلغاء الإنجاز':'تحديد كمكتملة'}: ${e(l.title)}">${icon('check')}</button><button class="mh-lec-main" data-action="mh-lecture" data-id="${l.id}"><strong lang="en">${e(l.title)}</strong><small>${e(l.doctor)} · ${specialtyAr[l.specialty]||l.specialty}</small></button><span class="mh-lec-meta">${l.recording?`<span title="تسجيل متاح">${icon('play')}</span>`:''}${l.mcq.length?`<span title="أسئلة تفاعلية">${l.mcq.length} MCQ</span>`:''}</span><button class="mh-save ${saved?'on':''}" data-action="mh-save" data-id="${l.id}" aria-pressed="${saved}" aria-label="حفظ">${icon('bookmark')}</button></li>`;}
mhViews['basic-years']=r=>{
 if(r.page==='module')return basicModule(moduleById(r.id)||moduleById('cns'));
 if(r.page==='lecture')return basicLecture(lectureById(r.id)||allLectures()[0]);
 if(r.page==='saved')return basicSaved();
 if(r.page==='quiz')return basicQuiz(moduleById(r.id));
 const y=r.page==='extra'?'extra':basicState.year;
 const tabs=[[1,'السنة الأولى'],[2,'السنة الثانية'],[3,'السنة الثالثة'],['extra','مقررات إضافية']];
 let body='';
 if(y===1)body=`<div class="mh-semesters">${MH.year1.semesters.map(sem=>`<section><h2>${sem.name}</h2><ol class="mh-toc">${sem.courses.map(c=>`<li><span>${c.name}<small lang="en">${c.en}</small></span><i></i><b>${c.count} محاضرة</b></li>`).join('')}</ol></section>`).join('')}</div><p class="mh-fine">محتوى السنة الأولى معروض كهيكل توضيحي؛ ملفات المحاضرات المرفقة في هذا النموذج تخص السنة الثالثة.</p>`;
 else if(y==='extra')body=`<section class="mh-extra"><h2>مقررات لا تتبع موديولًا</h2><ol class="mh-toc">${MH.extraCourses.map(c=>`<li><span>${c.name}<small lang="en">${c.en}</small></span><i></i><b>${c.count} محاضرة</b></li>`).join('')}</ol></section>`;
 else{const mods=MH.modules.filter(m=>m.year===y),total=mods.reduce((a,m)=>a+m.weeks,0);
  body=`<figure class="mh-strip" aria-label="مسار موديولات السنة"><div>${mods.map(m=>{const pr=moduleProgress(m);return `<button class="mh-strip-seg ${m.status}" style="flex:${m.weeks}" data-action="mh-go" data-view="basic-years" data-page="module" data-id="${m.id}" ${!m.lectures.length?'disabled':''}><span class="mh-strip-fill" style="width:${m.status==='done'?100:pr.p}%"></span><strong>${m.name}</strong><small lang="en">${m.en} · ${m.weeks} أسابيع</small>${m.status==='current'?`<em>الحالي · الأسبوع ${m.week}</em>`:m.status==='done'?'<em>سابق</em>':'<em>قادم</em>'}</button>`;}).join('')}</div><figcaption>${total} أسبوعًا · الامتلاء يمثل نسبة المحاضرات التي أنجزتها</figcaption></figure>
  <section class="mh-modlist"><h2>الموديولات</h2><table><thead><tr><th>الموديول</th><th>المنسق</th><th>المحاضرات</th><th>إنجازك</th></tr></thead><tbody>${mods.map(m=>{const pr=moduleProgress(m);return `<tr><td><button class="row-link" data-action="mh-go" data-view="basic-years" data-page="module" data-id="${m.id}" ${!m.lectures.length?'disabled':''}>${m.name} <small lang="en">${m.en}</small></button></td><td>${e(m.coordinator)}</td><td>${m.lectures.length||'—'}</td><td>${m.lectures.length?`${bar(pr.p)} <small>${pr.done}/${pr.total}</small>`:'<small>لم يبدأ</small>'}</td></tr>`;}).join('')}</tbody></table></section>`;}
 return `<div class="mh-basic"><header class="mh-head"><div><h1>السنوات الأساسية</h1><p>المحاضرات والموارد وتقدّمك الدراسي في السنوات الأولى إلى الثالثة.</p></div><div class="mh-head-actions"><button class="btn secondary" data-action="mh-go" data-view="basic-years" data-page="saved">${icon('bookmark')} المحفوظات</button><button class="btn" data-action="mh-search">${icon('search')} بحث أكاديمي</button></div></header>
 <div class="tabs mh-year-tabs" role="tablist">${tabs.map(([k,t])=>`<button class="tab ${k===y?'active':''}" role="tab" aria-selected="${k===y}" data-action="mh-year" data-year="${k}">${t}</button>`).join('')}</div>${body}</div>`;
};
function basicModule(m){
 const pr=moduleProgress(m),s=MHS.s,g=basicState.group;
 const groups=g==='week'?[...new Set(m.lectures.map(l=>l.week))].sort((a,b)=>a-b).map(w=>[`الأسبوع ${w}`,m.lectures.filter(l=>l.week===w),w]):[...new Set(m.lectures.map(l=>l.specialty))].map(sp=>[`${specialtyAr[sp]||sp} <small lang="en">${sp}</small>`,m.lectures.filter(l=>l.specialty===sp)]);
 const exams=MH.events.filter(ev=>ev.module===m.id&&['exam','deadline'].includes(ev.type));
 const mcqCount=m.lectures.reduce((a,l)=>a+l.mcq.length,0);
 return `<div class="mh-basic">${crumbs('basic-years',[['السنوات الأساسية','home'],[`السنة ${m.year}`,'home'],[m.name]])}
 <header class="mh-module-head"><div><h1>${m.name} <span lang="en">${m.en}</span></h1><p>${e(m.about)}</p><dl><div><dt>المنسق</dt><dd>${e(m.coordinator)}</dd></div><div><dt>المدة</dt><dd>${m.weeks} أسابيع${m.week?` · الأسبوع ${m.week} الآن`:''}</dd></div><div><dt>إنجازك</dt><dd>${pr.done} من ${pr.total} ${bar(pr.p)}</dd></div></dl></div></header>
 <div class="mh-tools"><button class="mh-tool" data-action="mh-go" data-view="basic-years" data-page="quiz" data-id="${m.id}" ${mcqCount?'':'disabled'}>${icon('checkCircle')}<span><b>بنك الأسئلة</b><small>${mcqCount} سؤال للمراجعة</small></span></button><button class="mh-tool" data-action="mh-demo" data-msg="دليل الدراسة يرفعه منسق الموديول؛ غير مرفق في هذا النموذج.">${icon('download')}<span><b>دليل الموديول</b><small>Study Guide</small></span></button>${exams[0]?`<button class="mh-tool" data-action="mh-go" data-view="student-calendar" data-page="event" data-id="${exams[0].id}">${icon('calendar')}<span><b>القادم: ${e(exams[0].title)}</b><small>${arDate(exams[0].date)}</small></span></button>`:''}</div>
 <div class="mh-module-body"><section class="mh-lectures"><div class="mh-sec-title"><h2>المحاضرات</h2><div class="mh-seg" role="group" aria-label="ترتيب المحاضرات"><button class="${g==='week'?'active':''}" data-action="mh-group" data-group="week">حسب الأسبوع</button><button class="${g==='spec'?'active':''}" data-action="mh-group" data-group="spec">حسب التخصص</button></div></div>
 ${groups.map(([title,ls,w])=>{const d=ls.filter(l=>s.done.includes(l.id)).length;return `<div class="mh-week ${w===m.week?'now':''}"><h3>${title}<span>${d}/${ls.length}${w===m.week?' · هذا الأسبوع':''}</span></h3><ol>${ls.map(lectureRow).join('')}</ol></div>`;}).join('')}</section>
 <details class="mh-about"><summary>عن الموديول: الجلسات العملية، التقييمات، والإعلانات</summary><div class="mh-about-body">
  <section><h3>الجلسات العملية</h3><ul class="mh-plain"><li>عملي الأنسجة — الأسبوع 2 و3، معمل 2</li><li>عملي التشريح — الأسبوع 4، قاعة التشريح</li></ul></section>
  <section><h3>التقييمات المعلنة</h3><ul class="mh-plain">${exams.map(ev=>`<li><b>${arDate(ev.date)}</b> ${e(ev.title)}</li>`).join('')||'<li>لا توجد تقييمات معلنة.</li>'}</ul></section>
  <section><h3>الإعلانات</h3><ul class="mh-plain">${MH.announcements.filter(a=>a.tag===m.id).map(a=>`<li><b>${arDate(a.date)}</b> ${e(a.text)}</li>`).join('')||'<li>لا إعلانات.</li>'}</ul></section>
 </div></details></div></div>`;
}
function basicLecture(l){
 const m=moduleById(l.module),s=MHS.s,ls=m.lectures,i=ls.indexOf(l),prev=ls[i-1],next=ls[i+1],done=s.done.includes(l.id),saved=s.saved.includes(l.id);
 if(s.recent[0]!==l.id){s.recent=[l.id,...s.recent.filter(x=>x!==l.id)].slice(0,8);MHS.save();}
 const tab=mhRoute['basic-years'].tab||'objectives';
 const tabs=[['objectives','الأهداف'],['mcq',`الأسئلة${l.mcq.length?` (${l.mcq.length})`:''}`],['notes','ملاحظاتي'],['assistant','المساعد الدراسي']];
 return `<div class="mh-basic mh-lecture">${crumbs('basic-years',[['السنوات الأساسية','home'],[m.name,'module',m.id],[l.title]])}
 <header class="mh-lecture-head"><div><h1 lang="en">${e(l.title)}</h1><p>${e(l.doctor)} · ${specialtyAr[l.specialty]||l.specialty} · الأسبوع ${l.week} · <span class="src official">رسمي</span></p></div>
 <div class="mh-lecture-actions"><button class="btn ${done?'':'secondary'}" data-action="mh-done" data-id="${l.id}" aria-pressed="${done}">${icon('check')} ${done?'مكتملة':'تحديد كمكتملة'}</button><button class="btn secondary" data-action="mh-save" data-id="${l.id}" aria-pressed="${saved}">${icon('bookmark')} ${saved?'محفوظة':'حفظ'}</button>${l.url?`<a class="btn secondary" href="${l.url}" download>${icon('download')} PDF</a>`:''}<button class="text-button" data-action="mh-report" data-type="ملف محاضرة" data-context="basic-years/lecture/${l.id}">${icon('alert')} مشكلة في الملف؟</button></div></header>
 <div class="mh-lecture-body"><section class="mh-reader"><div class="pdf-toolbar"><button class="btn secondary small" id="pdf-prev" disabled>السابق</button><span id="pdf-page-status" role="status">جارٍ تحميل المحاضرة…</span><button class="btn secondary small" id="pdf-next" disabled>التالي</button></div><div class="pdf-stage"><canvas id="pdf-canvas" aria-label="صفحة المحاضرة"></canvas></div>
 ${l.recording?`<div class="mh-recording">${icon('play')}<span><strong>تسجيل المحاضرة متاح</strong><small>58 دقيقة · يُعرض عبر منصة الجامعة</small></span><button class="btn secondary small" data-action="mh-demo" data-msg="التسجيلات تُعرض من منصة الجامعة؛ غير مرفقة في هذا النموذج.">تشغيل</button></div>`:''}</section>
 <section class="mh-panel"><div class="tabs" role="tablist">${tabs.map(([k,t])=>`<button class="tab ${k===tab?'active':''}" role="tab" aria-selected="${k===tab}" data-action="mh-ltab" data-tab="${k}">${t}</button>`).join('')}</div><div class="mh-panel-body">${lectureTab(l,tab)}</div></section></div>
 <nav class="mh-pager" aria-label="التنقل بين المحاضرات">${prev?`<button data-action="mh-lecture" data-id="${prev.id}">${icon('arrowRight')}<span><small>السابقة</small><b lang="en">${e(prev.title)}</b></span></button>`:'<span></span>'}${next?`<button data-action="mh-lecture" data-id="${next.id}"><span><small>التالية</small><b lang="en">${e(next.title)}</b></span>${icon('arrowLeft')}</button>`:''}</nav></div>`;
}
function lectureTab(l,tab){const s=MHS.s;
 if(tab==='objectives')return `<h2 class="sr-only">Learning Objectives</h2><ol class="mh-objectives">${l.objectives.map(o=>`<li>${e(o)}</li>`).join('')}</ol><h3>ملفات ومراجع إضافية</h3><ul class="mh-plain"><li>${icon('file')} ملخص الشرائح — قيد الرفع</li><li>${icon('book')} Kumar & Clark's Clinical Medicine — الفصل المرتبط</li></ul><h3>سجل التحديثات</h3><ol class="mh-history">${l.updates.map(u=>`<li><time>${arDate(u.date)}</time>${e(u.text)}</li>`).join('')}</ol>`;
 if(tab==='mcq')return l.mcq.length?l.mcq.map((q,qi)=>{const key=l.id+':'+qi,ans=s.answers[key];return `<fieldset class="mh-mcq"><legend>${e(q.q)}</legend>${q.o.map((o,oi)=>`<button class="${ans===undefined?'':oi===q.a?'right':oi===ans?'wrong':''}" data-action="mh-answer" data-key="${key}" data-i="${oi}" ${ans!==undefined?'disabled':''}>${e(o)}</button>`).join('')}${ans!==undefined?`<p class="mh-why"><b>${ans===q.a?'إجابة صحيحة.':'الإجابة الصحيحة: '+e(q.o[q.a])}</b> ${e(q.why)}</p>`:''}</fieldset>`;}).join('')+`<button class="text-button" data-action="mh-reset-mcq" data-id="${l.id}">${icon('refresh')} إعادة المحاولة</button>`:'<p class="mh-empty">لا توجد أسئلة لهذه المحاضرة بعد. اطلب من المساعد الدراسي إنشاء أسئلة مراجعة.</p>';
 if(tab==='notes')return `<label class="mh-notes-field"><span>ملاحظاتك الخاصة <small>تُحفظ في هذا المتصفح ولا يراها غيرك</small></span><textarea id="mh-note" rows="9" data-id="${l.id}" placeholder="اكتب ما تريد تذكره من المحاضرة…">${e(s.notes[l.id]||'')}</textarea></label><p class="mh-fine" id="mh-note-status">${s.notes[l.id]?'محفوظة':''}</p>`;
 if(tab==='assistant')return `<div class="mh-chat" id="mh-chat"><p class="mh-chat-note">${icon('info')} عرض توضيحي: الردود تُبنى من بيانات هذه المحاضرة داخل النموذج، ولا يتصل الموقع بنموذج ذكاء اصطناعي.</p><div class="mh-chat-log" id="mh-chat-log" aria-live="polite"></div><div class="mh-chips">${[['summary','لخّص المحاضرة'],['terms','بسّط المصطلحات'],['mcq','أنشئ أسئلة MCQ'],['recall','أسئلة Active Recall']].map(([k,t])=>`<button data-action="mh-ask" data-id="${l.id}" data-q="${k}">${t}</button>`).join('')}</div></div>`;
 return `<ol class="mh-history">${l.updates.map(u=>`<li><time>${arDate(u.date)}</time>${e(u.text)}</li>`).join('')}</ol>`;
}
function assistantReply(l,q){
 const src=`<cite>المصدر: الأهداف التعليمية لمحاضرة ${e(l.title)}</cite>`;
 if(q==='summary')return `<p>هذه أهم نقاط المحاضرة كما وردت في أهدافها:</p><ul>${l.objectives.map(o=>`<li>${e(o)}</li>`).join('')}</ul>${src}<p class="mh-extra-note"><b>شرح إضافي (من خارج المحاضرة):</b> ابدأ بالأهداف التي فيها «وصف» أو «تمييز»؛ غالبًا تأتي منها أسئلة الاختبار القصيرة.</p>`;
 if(q==='terms')return `<dl class="mh-terms"><dt lang="en">${e(l.specialty)}</dt><dd>${specialtyAr[l.specialty]||''}: التخصص الذي تتبع له المحاضرة.</dd><dt lang="en">Learning Objective</dt><dd>ما يُتوقع أن تستطيع فعله بعد المحاضرة، وهو أساس أسئلة التقييم.</dd></dl><p class="mh-extra-note"><b>شرح إضافي</b> — التعريفات عامة وليست من ملف المحاضرة.</p>`;
 if(q==='mcq')return l.mcq.length?`<p>جهّزت لك ${l.mcq.length} سؤالًا من بنك الأسئلة في تبويب «الأسئلة».</p>${src}`:`<p>سؤال مراجعة مبني على الهدف الأول:</p><p><b>أي مما يلي يحقق الهدف: «${e(l.objectives[0])}»؟</b></p><p class="mh-extra-note"><b>مولّد آليًا</b> — راجعه مع مصدر المحاضرة قبل الاعتماد عليه.</p>`;
 return `<ol>${l.objectives.map(o=>`<li>اشرح بصوت عالٍ دون النظر للشرائح: ${e(o.replace(/\.$/,''))}؟</li>`).join('')}</ol>${src}`;
}
function basicQuiz(m){
 const qs=m.lectures.flatMap(l=>l.mcq.map((q,qi)=>({...q,key:l.id+':'+qi,lec:l})));
 const s=MHS.s,answered=qs.filter(q=>s.answers[q.key]!==undefined),right=answered.filter(q=>s.answers[q.key]===q.a).length;
 return `<div class="mh-basic">${crumbs('basic-years',[['السنوات الأساسية','home'],[m.name,'module',m.id],['بنك الأسئلة']])}<header class="mh-head"><div><h1>بنك أسئلة ${m.name}</h1><p>${answered.length} من ${qs.length} أجبت عليها · ${right} صحيحة</p></div></header>
 <div class="mh-quiz">${qs.map(q=>{const ans=s.answers[q.key];return `<fieldset class="mh-mcq"><legend><small lang="en">${e(q.lec.title)}</small>${e(q.q)}</legend>${q.o.map((o,oi)=>`<button class="${ans===undefined?'':oi===q.a?'right':oi===ans?'wrong':''}" data-action="mh-answer" data-key="${q.key}" data-i="${oi}" ${ans!==undefined?'disabled':''}>${e(o)}</button>`).join('')}${ans!==undefined?`<p class="mh-why">${e(q.why)}</p>`:''}</fieldset>`;}).join('')}</div></div>`;
}
function basicSaved(){
 const s=MHS.s,q=(mhRoute['basic-years'].q||'').toLowerCase();
 const saved=s.saved.map(lectureById).filter(Boolean).filter(l=>!q||(l.title+l.specialty+l.doctor).toLowerCase().includes(q));
 const recent=s.recent.map(lectureById).filter(Boolean).slice(0,5);
 return `<div class="mh-basic">${crumbs('basic-years',[['السنوات الأساسية','home'],['المحفوظات']])}<header class="mh-head"><div><h1>المحفوظات</h1><p>المحاضرات التي حفظتها، وآخر ما فتحته.</p></div></header>
 <div class="mh-saved"><section><label class="search-field">${icon('search')}<input id="mh-saved-q" type="search" placeholder="ابحث داخل المحفوظات" value="${e(q)}"></label><ol class="mh-leclist">${saved.map(lectureRow).join('')||`<li class="mh-empty">${q?'لا نتائج.':'لم تحفظ أي محاضرة بعد. استخدم زر الحفظ بجانب أي محاضرة.'}</li>`}</ol></section>
 <aside><h2>زرتها مؤخرًا</h2><ol class="mh-plain">${recent.map(l=>`<li><button class="text-button" data-action="mh-lecture" data-id="${l.id}" lang="en">${e(l.title)}</button></li>`).join('')||'<li>لا شيء بعد.</li>'}</ol></aside></div></div>`;
}
mhViews['basic-years:after']=r=>{
 if(r.page==='lecture'){const l=lectureById(r.id);if(l?.url&&$('#pdf-canvas'))renderLecturePdf(l.url);
  const note=$('#mh-note');if(note){let t;note.addEventListener('input',()=>{clearTimeout(t);t=setTimeout(()=>{MHS.s.notes[note.dataset.id]=note.value;MHS.save();$('#mh-note-status').textContent='حُفظت '+new Date().toLocaleTimeString('ar-SA-u-nu-latn',{hour:'2-digit',minute:'2-digit'});},400);});}}
 if(r.page==='saved'){const i=$('#mh-saved-q');i?.addEventListener('input',()=>{mhRoute['basic-years'].q=i.value;renderMH();const n=$('#mh-saved-q');n.focus();n.setSelectionRange(n.value.length,n.value.length);});}
};
document.addEventListener('click',ev=>{
 const b=ev.target.closest('[data-action]');if(!b)return;const a=b.dataset.action,s=MHS.s;
 const toggle=(arr,id)=>arr.includes(id)?arr.filter(x=>x!==id):[...arr,id];
 if(a==='mh-year'){basicState.year=b.dataset.year==='extra'?3:+b.dataset.year;mhRoute['basic-years']={page:b.dataset.year==='extra'?'extra':'home'};renderMH();}
 else if(a==='mh-group'){basicState.group=b.dataset.group;renderMH();}
 else if(a==='mh-done'){s.done=toggle(s.done,b.dataset.id);MHS.save();renderMH();toast(s.done.includes(b.dataset.id)?'سُجّلت المحاضرة كمكتملة.':'أُلغي تسجيل الإنجاز.');}
 else if(a==='mh-save'){s.saved=toggle(s.saved,b.dataset.id);MHS.save();renderMH();toast(s.saved.includes(b.dataset.id)?'أُضيفت للمحفوظات.':'أُزيلت من المحفوظات.');}
 else if(a==='mh-ltab'){mhRoute['basic-years'].tab=b.dataset.tab;const l=lectureById(mhRoute['basic-years'].id);$('.mh-panel-body').innerHTML=lectureTab(l,b.dataset.tab);$$('.mh-panel .tab').forEach(t=>{const on=t===b;t.classList.toggle('active',on);t.setAttribute('aria-selected',on);});const note=$('#mh-note');if(note){let t;note.addEventListener('input',()=>{clearTimeout(t);t=setTimeout(()=>{s.notes[note.dataset.id]=note.value;MHS.save();$('#mh-note-status').textContent='محفوظة';},400);});}}
 else if(a==='mh-answer'){s.answers[b.dataset.key]=+b.dataset.i;MHS.save();if(mhRoute['basic-years'].page==='lecture'){const l=lectureById(mhRoute['basic-years'].id);$('.mh-panel-body').innerHTML=lectureTab(l,'mcq');}else renderMH();}
 else if(a==='mh-reset-mcq'){Object.keys(s.answers).filter(k=>k.startsWith(b.dataset.id+':')).forEach(k=>delete s.answers[k]);MHS.save();$('.mh-panel-body').innerHTML=lectureTab(lectureById(b.dataset.id),'mcq');}
 else if(a==='mh-ask'){const l=lectureById(b.dataset.id),log=$('#mh-chat-log');log.insertAdjacentHTML('beforeend',`<div class="mh-msg me">${e(b.textContent)}</div><div class="mh-msg bot typing"><span></span><span></span><span></span></div>`);log.scrollTop=log.scrollHeight;setTimeout(()=>{const t=log.querySelector('.typing');if(!t)return;t.classList.remove('typing');t.innerHTML=assistantReply(l,b.dataset.q);log.scrollTop=log.scrollHeight;},700);}
 else if(a==='mh-demo')toast(b.dataset.msg);
});
