'use strict';
// Academic & Digital Services: directory, guides, help, and the MedHub support desk.
const svTabs=[['home','الخدمات'],['guides','الأدلة والنماذج'],['help','المساعدة'],['support','الدعم']];
const svGroups={support:[['support','طلباتي'],['new','طلب جديد'],['team','لوحة فريق الدعم']]};
function supTickets(){const ov=st('supOv',{});return st('supNew',[]).concat(MH2.support).map(t=>({...t,status:ov[t.id]||t.status,log:t.log.concat(st('supLog',{})[t.id]||[])}));}
const kindBadge=k=>`<span class="mh-kind k-${MH2.serviceKinds[k][1]}">${MH2.serviceKinds[k][0]}</span>`;
mhViews.services=r=>{
 const tabPage={service:'home',guide:'guides',ticket:'support'}[r.page]||r.page;
 const body={home:svHome,guides:svGuides,help:svHelp,support:svMine,new:()=>svNew(r.id),team:svTeam,service:()=>svService(MH2.services.find(s=>s.id===r.id)),guide:()=>svGuide(MH2.guides.find(g=>g.id===r.id)),ticket:()=>svTicket(supTickets().find(t=>t.id===r.id))}[r.page]||svHome;
 return `<div class="mh-serv"><header class="mh-head"><div><h1>الخدمات والدعم</h1></div><div class="mh-head-actions"><button class="btn" data-action="mh-go" data-view="services" data-page="new">${icon('plus')} طلب دعم</button></div></header>${sectionNav('services',svTabs,svGroups,tabPage)}${body()}</div>`;
};
function svHome(){
 const q=st('svQ',''),cat=st('svCat','all'),list=MH2.services.filter(s=>(cat==='all'||s.cat===cat)&&(!q||(s.name+s.about+s.provider).includes(q)));
 const mine=supTickets().filter(t=>!['closed','resolved'].includes(t.status));
 return `${mine.length?`<div class="mh-offer-band soft">${icon('inbox')}<span><strong>${mine.length===1?'لديك طلب دعم مفتوح':`لديك ${mine.length} طلبات دعم مفتوحة`}</strong><small>${mine.map(t=>`${t.id}: ${MH2.supStatus[t.status]}`).join(' · ')}</small></span><button class="btn secondary" data-action="mh-go" data-view="services" data-page="support">متابعة</button></div>`:''}
 <div class="mh-filterbar"><label class="search-field">${icon('search')}<input id="sv-q" type="search" placeholder="ابحث عن خدمة" value="${e(q)}"></label><select id="sv-cat" aria-label="التصنيف"><option value="all">كل التصنيفات</option>${Object.entries(MH2.serviceCats).map(([k,v])=>`<option value="${k}" ${cat===k?'selected':''}>${v}</option>`).join('')}</select></div>
 <ul class="mh-svlist">${list.map(s=>`<li><button data-action="mh-go" data-view="services" data-page="service" data-id="${s.id}"><span><strong>${s.name}</strong><small>${s.about}</small></span>${kindBadge(s.kind)}</button></li>`).join('')||'<li class="mh-empty">لا خدمات تطابق البحث.</li>'}</ul>
 <p class="mh-fine">وجود رابط لخدمة جامعية لا يعني أنها تُنفَّذ داخل MedHub.</p>`;
}
function svService(s){
 return `${crumbs('services',[['الخدمات','home'],[s.name]])}<article class="mh-svpage"><header><h2>${s.name}</h2>${kindBadge(s.kind)}</header><p class="mh-big">${s.about}</p><dl class="mh-dl"><div><dt>الجهة المقدمة</dt><dd>${s.provider}</dd></div><div><dt>التصنيف</dt><dd>${MH2.serviceCats[s.cat]}</dd></div><div><dt>آخر مراجعة</dt><dd>${s.reviewed?arDate(s.reviewed,{day:'numeric',month:'long',year:'numeric'}):'لم تُراجع'}</dd></div></dl>
 ${s.steps.length?`<h3>خطوات الوصول</h3><ol class="mh-objectives">${s.steps.map(x=>`<li>${x}</li>`).join('')}</ol>`:''}
 <div class="mh-head-actions">${s.kind==='internal'?`<button class="btn" data-action="mh-go" data-view="services" data-page="new">افتح طلب دعم</button>`:s.link?`<a class="btn" href="${s.link}" target="_blank" rel="noopener">فتح الخدمة ${icon('external')}</a>`:''}<button class="text-button" data-action="mh-report" data-type="رابط معطل" data-context="services/service/${s.id}">${icon('alert')} الإبلاغ عن رابط معطل أو معلومة قديمة</button></div></article>`;
}
function svGuides(){
 return `<ul class="mh-svlist">${MH2.guides.map(g=>`<li><button data-action="mh-go" data-view="services" data-page="guide" data-id="${g.id}"><span><strong>${g.title}</strong><small>${g.topic} · ${g.lang} · الإصدار ${g.version} · حُدّث ${arDate(g.updated,{month:'short',year:'numeric'})} · ${g.for}</small></span>${g.old?'<span class="mh-kind k-draft">قديم — قيد التحديث</span>':g.form?'<span class="mh-kind k-guide">نموذج</span>':'<span class="mh-kind k-ok">دليل معتمد</span>'}</button></li>`).join('')}</ul>`;
}
function svGuide(g){
 return `${crumbs('services',[['الأدلة والنماذج','guides'],[g.title]])}<article class="mh-svpage"><header><h2>${g.title}</h2></header><dl class="mh-dl"><div><dt>اللغة</dt><dd>${g.lang}</dd></div><div><dt>الإصدار</dt><dd>${g.version}</dd></div><div><dt>آخر تحديث</dt><dd>${arDate(g.updated,{day:'numeric',month:'long',year:'numeric'})}</dd></div><div><dt>لمن</dt><dd>${g.for}</dd></div></dl>
 ${g.old?`<div class="mh-alert">${icon('alert')}<span>هذا الإصدار قديم وقد لا يعكس الإجراءات الحالية.</span></div>`:''}${g.form?`<p class="mh-alert soft">${icon('info')} تنزيل النموذج لا يعني تقديمه؛ يُقدَّم رسميًا عبر الجهة المختصة.</p>`:''}
 <div class="mh-head-actions"><button class="btn" data-action="mh-demo" data-msg="الملف الأصلي ترفعه الجهة المسؤولة؛ غير مرفق في هذا النموذج.">${icon('file')} عرض الملف</button><button class="btn secondary" data-action="mh-demo" data-msg="الملف الأصلي ترفعه الجهة المسؤولة؛ غير مرفق في هذا النموذج.">${icon('download')} تنزيل</button></div>
 <h3>سجل الإصدارات</h3><ol class="mh-history">${g.versions.map(([v,d,why])=>`<li><time>${v} · ${arDate(d,{month:'short',year:'numeric'})}</time>${why}</li>`).join('')}</ol><button class="text-button" data-action="mh-report" data-type="عرض الموارد" data-context="services/guide/${g.id}">${icon('alert')} الإبلاغ عن معلومة غير صحيحة</button></article>`;
}
function svHelp(){
 const q=st('faqQ',''),votes=st('faqVote',{}),list=MH2.faq.map((f,i)=>({...f,i})).filter(f=>!q||(f.q+f.a.join('')).includes(q));
 return `<div class="mh-help"><section><label class="search-field">${icon('search')}<input id="faq-q" type="search" placeholder="ابحث في الأسئلة الشائعة" value="${e(q)}"></label>
 <div class="mh-faq">${list.map(f=>`<details><summary>${f.q}</summary><ol>${f.a.map(x=>`<li>${x}</li>`).join('')}</ol><p class="mh-fine">رُوجعت ${arDate(f.reviewed)}</p><div class="mh-vote">${votes[f.i]?`<span>شكرًا لتقييمك.</span>`:`<span>هل أفادتك الإجابة؟</span><button class="btn small secondary" data-action="faq-vote" data-i="${f.i}" data-v="yes">نعم</button><button class="btn small secondary" data-action="faq-vote" data-i="${f.i}" data-v="no">لا</button>`}</div>${votes[f.i]==='no'?`<button class="text-button" data-action="mh-go" data-view="services" data-page="new">افتح طلب دعم ${icon('arrowLeft')}</button>`:''}</details>`).join('')||'<p class="mh-empty">لا نتائج. جرّب المساعد أو افتح طلب دعم.</p>'}</div></section>
 <section class="mh-chat"><h2>مساعد الخدمات</h2><p class="mh-chat-note">${icon('info')} عرض توضيحي: يجيب من الأسئلة الشائعة المنشورة فقط، ولا ينفّذ معاملات جامعية.</p><div class="mh-chat-log" id="sv-log"></div><div class="mh-chips">${MH2.faq.map((f,i)=>`<button data-action="sv-ask" data-i="${i}">${f.q}</button>`).join('')}<button data-action="sv-ask" data-i="-1">كيف أعدّل جدولي الرسمي؟</button></div></section></div>`;
}
function svMine(){
 const T=supTickets();
 return `<ul class="mh-svlist">${T.map(t=>`<li><button data-action="mh-go" data-view="services" data-page="ticket" data-id="${t.id}"><span><strong>${e(t.subject)}</strong><small><bdi dir="ltr">${t.id}</bdi> · ${t.type} · ${arDate(t.date)}${t.lastReply?` · آخر رد: ${e(t.lastReply)}`:''}</small></span><span class="mh-pill s-${t.status}">${MH2.supStatus[t.status]}</span></button></li>`).join('')}</ul><p class="mh-fine">هذا الدعم خاص بمنصة MedHub، ولا يمثل خدمة شؤون الطلاب أو الجهات الإدارية الرسمية.</p>`;
}
function svTicket(t){
 const can=['student','team','progress','triaged','submitted','reopened'].includes(t.status),closed=['closed','resolved'].includes(t.status);
 return `${crumbs('services',[['طلباتي','support'],[t.id]])}<article class="mh-svpage"><header><h2>${e(t.subject)}</h2><span class="mh-pill s-${t.status}">${MH2.supStatus[t.status]}</span></header><p class="mh-fine"><bdi dir="ltr">${t.id}</bdi> · ${t.type} · ${arDate(t.date)}${t.context?` · مرتبط بـ <button class="text-button" data-action="sv-ctx" data-ctx="${t.context}">الصفحة الأصلية</button>`:''}</p>
 ${t.status==='student'?`<div class="mh-alert soft">${icon('info')}<span><strong>الفريق ينتظر ردك:</strong> ${e(t.lastReply)}</span></div>`:''}
 <h3>سجل الطلب</h3><ol class="mh-history">${t.log.map(([d,x])=>`<li><time>${arDate(d)}</time>${e(x)}</li>`).join('')}</ol>
 ${can?`<form id="sv-reply" data-id="${t.id}" class="mh-reply"><label for="sv-r">إضافة رد أو معلومات</label><textarea id="sv-r" rows="3" required maxlength="500"></textarea><button class="btn">إرسال</button></form>`:''}${closed?`<button class="btn secondary" data-action="sv-reopen" data-id="${t.id}">إعادة فتح الطلب</button>`:''}</article>`;
}
function svNew(ctx){
 const pre=st('svPre',{});
 return `<form class="mh-apply" id="sv-form"><header><h2>طلب دعم جديد</h2><p>صف المشكلة وسنعطيك رقمًا مرجعيًا لمتابعتها.</p></header><div class="field"><label for="sv-type">نوع المشكلة</label><select id="sv-type" name="type">${MH2.supTypes.map(t=>`<option ${pre.type===t?'selected':''}>${t}</option>`).join('')}</select></div>${pre.context?`<p class="mh-alert soft">${icon('clip')} سيُربط الطلب بالصفحة: <bdi dir="ltr">${e(pre.context)}</bdi></p>`:''}<div class="field"><label for="sv-sub">عنوان مختصر</label><input id="sv-sub" name="subject" required maxlength="90"></div><div class="field"><label for="sv-desc">الوصف</label><textarea id="sv-desc" name="desc" rows="4" required maxlength="800" placeholder="ماذا حدث؟ وعلى أي جهاز؟"></textarea></div><div class="field"><label for="sv-file">لقطة شاشة (اختياري)</label><input id="sv-file" name="file" type="file" accept="image/png,image/jpeg"></div><div class="mh-form-actions"><button class="btn" name="go" value="submit">مراجعة وإرسال</button><button class="btn secondary" name="go" value="draft">حفظ كمسودة</button></div></form>`;
}
function svTeam(){
 const T=supTickets(),c=k=>T.filter(t=>k.includes(t.status)).length;
 return `<p class="mh-lede">معاينة دور فريق الدعم. الملاحظات الداخلية لا تظهر للطالب.</p><dl class="mh-stats"><div><dt>جديدة</dt><dd>${c(['submitted'])}</dd></div><div><dt>مفتوحة</dt><dd>${c(['submitted','triaged','progress','student','team','reopened'])}</dd></div><div><dt>بانتظار الطالب</dt><dd>${c(['student'])}</dd></div><div><dt>مغلقة</dt><dd>${c(['closed','resolved'])}</dd></div><div><dt>متوسط أول رد</dt><dd>6 ساعات</dd></div></dl>
 <table><thead><tr><th>الطلب</th><th>النوع</th><th>الحالة</th><th>تحديث</th></tr></thead><tbody>${T.map(t=>`<tr><td><bdi dir="ltr">${t.id}</bdi> ${e(t.subject)}</td><td>${t.type}</td><td>${MH2.supStatus[t.status]}</td><td><select data-sup="${t.id}" aria-label="تحديث الحالة">${Object.entries(MH2.supStatus).map(([k,v])=>`<option value="${k}" ${t.status===k?'selected':''}>${v}</option>`).join('')}</select></td></tr>`).join('')}</tbody></table>`;
}
function faqAnswer(i){if(i<0)return `<p>لم أجد إجابة منشورة عن هذا. تعديل الجدول الرسمي تقوم به الجهة الأكاديمية المختصة؛ افتح <b>تذاكر الكلية الرسمية</b> من دليل الخدمات.</p>`;const f=MH2.faq[i];return `<ol>${f.a.map(x=>`<li>${x}</li>`).join('')}</ol><cite>المصدر: الأسئلة الشائعة — رُوجعت ${arDate(f.reviewed)}</cite>`;}
mhViews['services:after']=r=>{
 const bindQ=(id,k)=>{const el=$('#'+id);el?.addEventListener(el.tagName==='SELECT'?'change':'input',()=>{MHS.s[k]=el.value;MHS.save();renderMH();if(el.type==='search'){const n=$('#'+id);n.focus();n.setSelectionRange(n.value.length,n.value.length);}});};
 bindQ('sv-q','svQ');bindQ('sv-cat','svCat');bindQ('faq-q','faqQ');
 $('#sv-form')?.addEventListener('submit',x=>{x.preventDefault();const d=new FormData(x.target),pre=st('svPre',{});const id='MHS-'+(1030+st('supNew',[]).length);const draft=x.submitter?.value==='draft';
  if(!draft&&!confirm(`مراجعة الطلب قبل الإرسال:\n${d.get('type')} — ${d.get('subject')}`))return;
  MHS.s.supNew.unshift({id,type:d.get('type'),subject:String(d.get('subject')).trim(),context:pre.context||'',date:MH.today,status:draft?'draft':'submitted',log:[[MH.today,draft?'حُفظ كمسودة':'أُرسل الطلب']]});MHS.s.svPre={};MHS.save();mhRoute.services={page:'ticket',id};renderMH(true);toast(draft?'حُفظت المسودة.':`أُرسل طلبك. الرقم المرجعي ${id}`);});
 $('#sv-reply')?.addEventListener('submit',x=>{x.preventDefault();const id=x.target.dataset.id,log=st('supLog',{});(log[id]=log[id]||[]).push([MH.today,'ردك: '+$('#sv-r').value.trim()]);st('supOv',{})[id]='triaged';MHS.save();renderMH();toast('أُضيف ردك وأُشعر الفريق.');});
 $$('[data-sup]').forEach(s=>s.addEventListener('change',()=>{st('supOv',{})[s.dataset.sup]=s.value;MHS.save();renderMH();toast('تم تحديث الحالة وأُشعر الطالب.');}));
};
document.addEventListener('click',ev=>{
 const b=ev.target.closest('[data-action]');if(!b)return;const a=b.dataset.action;
 if(a==='mh-report'){MHS.s.svPre={type:b.dataset.type,context:b.dataset.context};MHS.save();if(dialog.open)closeDialog();mhRoute.services={page:'new'};view==='services'?renderMH(true):go('services');}
 else if(a==='faq-vote'){st('faqVote',{})[b.dataset.i]=b.dataset.v;MHS.save();renderMH();}
 else if(a==='sv-ask'){const log=$('#sv-log'),i=+b.dataset.i;log.insertAdjacentHTML('beforeend',`<div class="mh-msg me">${e(b.textContent)}</div><div class="mh-msg bot">${faqAnswer(i)}</div>`);log.scrollTop=log.scrollHeight;}
 else if(a==='sv-reopen'){st('supOv',{})[b.dataset.id]='reopened';(st('supLog',{})[b.dataset.id]=MHS.s.supLog[b.dataset.id]||[]).push([MH.today,'أعدت فتح الطلب']);MHS.save();renderMH();}
 else if(a==='sv-ctx'){const [v,p,id]=b.dataset.ctx.split('/');mhRoute[v]={page:p||'home',id};go(v);}
});
