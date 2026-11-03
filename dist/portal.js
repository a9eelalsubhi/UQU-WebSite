'use strict';
// The selectable roles are a local presentation model. Production authorization belongs on the server.
Object.assign(paths,{
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
 moon:'<path d="M20.5 14A9 9 0 0 1 10 3.5 9 9 0 1 0 20.5 14z"/>',
 settings:'<path d="m9 3-1 3-3 1-2 4 2 2v4l4 2 2-1 3 1 4-2v-3l3-2-1-4-3-1-1-3z"/><circle cx="12" cy="12" r="3"/>',
 edit:'<path d="m15 4 5 5M4 20l5-1L21 7a2 2 0 0 0-5-5L4 14zM12 20h9"/>',
 trash:'<path d="M4 6h16M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7m4-7v7"/>',
 lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4M12 14v3"/>',
 logout:'<path d="M10 3H4v18h6M10 12h11m-4-4 4 4-4 4"/>',
 inbox:'<path d="M3 13 6 4h12l3 9v7H3zM3 13h5l2 3h4l2-3h5"/>',
 briefcase:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V3h8v4M3 12q9 6 18 0M10 14h4"/>'
});
let onlyMine=false,facultyTicketScope='incoming';
const roleDescriptions={
 admin:{title:'مدير النظام',tag:'Admin',icon:'settings',color:'gold',desc:'إدارة البوابة والمحتوى والخدمات والمبادرات، والتحكم بجميع الطلبات.',chips:['إضافة وتعديل المحتوى','الأدوار والصلاحيات','التقارير والإعدادات']},
 faculty:{title:'عضو هيئة التدريس',tag:'Faculty',icon:'graduation',color:'green',desc:'مساحتك الأكاديمية لرفع سلايدات مقرراتك ومتابعة التذاكر المحالة إليك.',chips:['مقرراتي وسلايداتي','التذاكر المحالة إليّ','الرد وتحديث الحالة']},
 student:{title:'الطالب',tag:'Student',icon:'book',color:'blue',desc:'محاضراتك وخدماتك في مكان واحد؛ قدّم طلبك وتابع كل خطوة.',chips:['مكتبة المقررات','تقديم الطلبات','متابعة طلباتي']},
 employee:{title:'موظف الخدمات',tag:'Staff',icon:'briefcase',color:'purple',desc:'استقبال الطلبات وتوجيهها والرد عليها ومتابعة إنجازها.',chips:['إدارة التذاكر','الردود والمتابعة','التقارير']}
};
const defaults={portalName:'بوابة كلية الطب',tagline:'منظومة الخدمات والمبادرات',heroTitle:'كل خدمات الكلية، في مكان واحد.',announcement:'مرحبًا بكم في نموذج مبادرة التحول الرقمي بكلية الطب.',studentYear:3,facultyCourses:['التشريح','وظائف الأعضاء']};
function upgradeData(state){
 state.settings={...defaults,...state.settings};
 if(!Array.isArray(state.settings.facultyCourses)||!state.settings.facultyCourses.length)state.settings.facultyCourses=[...defaults.facultyCourses];
 state.roleBookmarks??={student:[...(state.bookmarks||[])],faculty:[],admin:[],employee:[]};
 state.tickets.forEach(t=>{if(!t.assignee)t.assignee=defaultAssignee(t.service,t.owner);});
 state.resources.forEach(r=>{if(!r.ownerId)r.ownerId=r.custom?(r.owner===roleNames.faculty?'demo_faculty':'demo_admin'):['r1','r2','r7'].includes(r.id)?'demo_faculty':'other_faculty';});
 if(!state.serviceCatalog)state.serviceCatalog=services.map(s=>({...s}));
 return state;
}
function defaultAssignee(service,owner){return owner==='demo_faculty'?'demo_employee':['content','academic'].includes(service)?'demo_faculty':'demo_employee';}
function assigneeName(owner){return {demo_faculty:'عضو هيئة التدريس · منسق المقرر',demo_employee:'فريق خدمات الكلية',demo_admin:'مدير النظام'}[owner]||'فريق خدمات الكلية';}
function canManageTicket(ticket){return !!role&&(isStaff()||(role==='faculty'&&ticket.assignee==='demo_faculty'));}
function canEditResource(resource){return role==='admin'||(role==='faculty'&&resource.ownerId==='demo_faculty');}
function facultyCourses(){return data.settings.facultyCourses;}
function allowedViews(){return role==='admin'?navItems.map(n=>n[0]):role==='employee'?['overview','tickets','library','initiatives','reports','permissions']:role==='faculty'?['overview','tickets','library','permissions']:['overview','tickets','library','permissions'];}
function syncTheme(){
 const dark=document.documentElement.dataset.theme==='dark';
 $$('[data-action="toggle-theme"]').forEach(button=>{button.setAttribute('aria-pressed',String(dark));button.setAttribute('aria-label',dark?'تفعيل الوضع الفاتح':'تفعيل الوضع الداكن');button.title=dark?'تفعيل الوضع الفاتح':'تفعيل الوضع الداكن';button.innerHTML=icon(dark?'sun':'moon')+`<span class="theme-label">${dark?'الوضع الفاتح':'الوضع الداكن'}</span>`;});
 $('meta[name="theme-color"]').content=dark?'#101c1b':'#06403d';
}
function toggleTheme(){const next=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=next;try{localStorage.setItem('colmed-theme',next);}catch{}syncTheme();}
function showRoleEntry(){
 if(dialog.open)closeDialog();closeMenu();role=null;document.body.classList.add('selecting-role');
 history.replaceState(null,'','#choose-role');
 $('.skip-link').href='#role-entry';
 const roleOrder=['student','faculty','employee','admin'];
 $('#role-entry').innerHTML=`<div class="gate2"><section class="gate2-brand"><img class="gate2-logo" src="assets/college-logo.webp" alt="جامعة أم القرى، كلية الطب" width="360" height="360"><div class="gate2-copy"><h1 id="gate-title">${e(data.settings.portalName)}</h1><p>المحاضرات والتدريب والأنشطة والخدمات، في منصة واحدة لكل من يدرس ويعمل في كلية الطب.</p></div>${pillarArch()}</section><section class="gate2-panel" aria-labelledby="gate-choose"><header class="gate2-top"><a class="gate-official" href="https://uqu.edu.sa/colmedsc" target="_blank" rel="noopener">موقع الكلية ${icon('external')}</a><button class="theme-toggle" data-action="toggle-theme"></button></header><div class="gate2-body"><h2 id="gate-choose">كيف تريد الدخول؟</h2><p class="gate2-hint">اختر دورك لتظهر لك الأقسام والصلاحيات المناسبة.</p><div class="gate2-roles">${roleOrder.map(key=>{const r=roleDescriptions[key];return `<button class="gate2-role ${r.color}" data-action="enter-role" data-role="${key}"><span class="gate2-icon">${icon(r.icon)}</span><strong>${r.title}</strong><span class="gate2-desc">${r.desc}</span><span class="gate2-go">دخول ${icon('arrowLeft')}</span></button>`;}).join('')}</div></div><footer class="gate2-foot">${icon('info')} نموذج للعرض؛ اختيار الدور يحاكي الصلاحيات، والبيانات محفوظة في هذا المتصفح.</footer></section></div>`;
 syncTheme();window.scrollTo({top:0,behavior:'instant'});
}
function resetFilters(){ticketFilter='all';ticketSearch='';serviceFilter='all';resourceSearch='';yearFilter='all';courseFilter='all';onlySaved=false;initiativeFilter='all';facultyTicketScope='incoming';}
function enterRole(next,destination='overview'){
 if(!roleDescriptions[next])return;role=next;resetFilters();onlyMine=role==='faculty';data.bookmarks=[...(data.roleBookmarks[role]||[])];
 document.body.classList.remove('selecting-role');$('#role-entry').innerHTML='';view=allowedViews().includes(destination)?destination:'overview';
 $('.skip-link').href='#main';
 history.replaceState(null,'','#'+view);render();syncTheme();$('#main').focus();window.scrollTo({top:0,behavior:'instant'});
}
navItems.push(['permissions','shield','صلاحياتي'],['settings','settings','إدارة البوابة']);
renderNav=function(){
 $('#nav').innerHTML=navItems.filter(n=>allowedViews().includes(n[0])).map(([id,ico,label])=>{const title=id==='overview'?(role==='admin'?'لوحة الإدارة':'مساحتي'):id==='tickets'&&role==='faculty'?'التذاكر والطلبات':id==='library'&&role==='faculty'?'مقرراتي والسلايدات':id==='permissions'&&role==='admin'?'الأدوار والصلاحيات':label;return `<a href="#${id}" class="nav-item ${view===id?'active':''}" ${view===id?'aria-current="page"':''}>${icon(ico)}<span>${title}</span>${id==='tickets'?`<span class="nav-count">${visibleTickets().filter(t=>t.status!=='done').length}</span>`:''}</a>`;}).join('');
 $('#breadcrumb').textContent=view==='overview'?role==='admin'?'لوحة الإدارة':'مساحتي':navItems.find(n=>n[0]===view)?.[2]||'مساحتي';
 $('#sidebar-role').textContent=roleDescriptions[role].title;$('#active-role-label').textContent=roleDescriptions[role].title;
 $('.sidebar-user .avatar').innerHTML=icon(roleDescriptions[role].icon);
 $('.portal-name').innerHTML=e(data.settings.portalName)+`<span>${e(data.settings.tagline)}</span>`;
};
const baseOverview=renderOverview;
function addAnnouncement(){const message=document.createElement('div');message.className='portal-announcement';message.innerHTML=icon('bell')+`<span>${e(data.settings.announcement)}</span>`;$('.page-heading',main).after(message);}
renderOverview=function(){
 if(role==='admin'||role==='employee'){
  baseOverview();$('h1',main).textContent=role==='admin'?'لوحة إدارة الكلية':'مساحة خدمات الكلية';
  $('.hero h2',main).textContent=data.settings.heroTitle;
  const actions=document.createElement('div');actions.className='role-quick-actions';
  actions.innerHTML=(role==='admin'?[["upload-resource","upload","إضافة سلايدات","نظّم محتوى المكتبة"],["new-initiative","flag","إضافة مبادرة","حوّل الفكرة إلى خطة"],["new-ticket","ticket","إنشاء طلب","وجّه الطلب وتابع تنفيذه"],["go-settings","settings","إدارة البوابة","عدّل المحتوى والخدمات"]]:[["new-ticket","ticket","طلب جديد","ابدأ طلبًا وتابع خطواته"],["go-tickets","inbox","قائمة العمل","عالج الطلبات الواردة"]]).map(([action,ico,title,desc])=>`<button class="quick-action" data-action="${action}"><span class="quick-icon">${icon(ico)}</span><span><strong>${title}</strong><small>${desc}</small></span>${icon('chevronLeft')}</button>`).join('');
  $('.hero',main).after(actions);addAnnouncement();return;
 }
 const faculty=role==='faculty',own=data.tickets.filter(t=>t.owner===roleOwners[role]),incoming=data.tickets.filter(t=>t.assignee==='demo_faculty'),mine=data.resources.filter(r=>r.ownerId==='demo_faculty'),forYear=data.resources.filter(r=>r.year===Number(data.settings.studentYear));
 const list=faculty?mine:forYear;
 main.innerHTML=heading(faculty?'مساحة عضو هيئة التدريس':'مساحة الطالب',faculty?'مقرراتك وطلبات المستفيدين؛ نظرة واحدة تساعدك على الإنجاز.':`${years[data.settings.studentYear-1]} · محاضراتك وطلباتك في مساحة واحدة.`,faculty?`<button class="btn" data-action="upload-resource">${icon('upload')} رفع سلايدات</button>`:newButton())+
 `<section class="role-welcome"><div><span class="role-welcome-label">${icon(faculty?'graduation':'book')}${faculty?'تعليم متصل، أثر ممتد':'رحلتك الأكاديمية، أقرب إليك'}</span><h2>${faculty?'كل ما تحتاجه لمقرراتك وطلابك.':'من محاضرتك، إلى إنجاز طلبك.'}</h2><p>${faculty?'ارفع المحتوى الدراسي، وحدّث ملفاتك، وتابع التذاكر المحالة إليك.':'تصفح سلايدات مقرراتك، واحفظ ما تحتاجه، وتابع طلباتك بكل وضوح.'}</p></div><button class="btn outline-light" data-action="go-permissions">${icon('shield')} صلاحياتي</button></section>`+
 metrics(faculty?[
 {label:'التذاكر المحالة إليّ',value:incoming.filter(t=>t.status!=='done').length,icon:'inbox',sub:'بانتظار ردك أو متابعتك'},
 {label:'ملفات سلايداتي',value:mine.length,icon:'upload',sub:'يمكنك تعديل ملفاتك وإدارتها'},
 {label:'المقررات المسندة',value:facultyCourses().length,icon:'book',sub:'مقررات يمكنك رفع محتواها'},
 {label:'طلباتي الشخصية',value:own.length,icon:'ticket',sub:'طلباتك الموجهة لخدمات الكلية'}
 ]:[{label:'طلباتي المفتوحة',value:own.filter(t=>t.status!=='done').length,icon:'ticket',sub:'تابع الحالة وتواصل مع المسؤول'},
 {label:'طلباتي المكتملة',value:own.filter(t=>t.status==='done').length,icon:'checkCircle',sub:'سجل واضح للخدمات المنجزة'},
 {label:'ملفات سنتي الدراسية',value:forYear.length,icon:'book',sub:years[data.settings.studentYear-1]},
 {label:'المحاضرات المحفوظة',value:data.bookmarks.length,icon:'bookmark',sub:'ارجع إلى مراجعك بسرعة'}])+
 `<div class="role-quick-actions ${faculty?'three':''}">${(faculty?[
 ['faculty-incoming','inbox','التذاكر المحالة إليّ','استعرض الطلبات الواردة ورد عليها'],['my-resources','upload','إدارة سلايداتي','ارفع وعدّل محتوى مقرراتك'],['my-tickets','ticket','طلباتي الشخصية','تابع طلباتك لدى خدمات الكلية']
 ]:[['new-ticket','plus','قدّم طلبك','خدمة محددة وجهة مسؤولة واضحة'],['student-library','book','سلايدات سنتي','محتوى مرتب حسب السنة والمقرر'],['saved-library','bookmark','المحفوظات','كل المحاضرات التي حفظتها']]).map(([action,ico,title,desc])=>`<button class="quick-action" data-action="${action}"><span class="quick-icon">${icon(ico)}</span><span><strong>${title}</strong><small>${desc}</small></span>${icon('arrowLeft')}</button>`).join('')}</div>`+
 `<div class="dashboard-grid"><section class="panel"><div class="panel-header"><div><h2>${faculty?'التذاكر المحالة إليّ':'آخر طلباتي'}</h2><p>${faculty?'طلبات موجّهة إلى حساب عضو هيئة التدريس':'تحديثات الطلب وسجل المحادثة في مكان واحد'}</p></div><button class="text-button" data-action="${faculty?'faculty-incoming':'my-tickets'}">عرض الكل ${icon('arrowLeft')}</button></div>${ticketTable((faculty?incoming:own).slice(0,4),true)}</section><section class="panel"><div class="panel-header"><div><h2>${faculty?'المقررات المسندة إليّ':'سنتي الدراسية'}</h2><p>${faculty?'إدارة المحتوى ضمن مقرراتك فقط':'اختيارك يرتّب المحتوى المقترح لك'}</p></div>${icon('graduation')}</div><div class="course-list">${faculty?facultyCourses().map(course=>`<button class="course-row" data-action="course-library" data-course="${e(course)}"><span class="course-symbol">${icon('book')}</span><span><strong>${e(course)}</strong><small>${mine.filter(r=>r.course===course).length} ملفات ضمن مقرراتك</small></span>${icon('chevronLeft')}</button>`).join(''):`<label class="field"><span>السنة الدراسية</span><select id="student-year" aria-label="اختيار سنتي الدراسية">${years.map((y,i)=>`<option value="${i+1}" ${Number(data.settings.studentYear)===i+1?'selected':''}>${y}</option>`).join('')}</select></label><p class="personal-note">يمكنك تصفح بقية السنوات من المكتبة، مع الاحتفاظ بسنتك لاقتراح المحتوى المناسب.</p><button class="btn secondary" data-action="student-library">${icon('book')} استعرض مقرراتي</button>`}</div></section></div>`+
 `<div class="section-heading"><div><h2>${faculty?'سلايداتي ومحتوى مقرراتي':'محاضرات من سنتك الدراسية'}</h2><p>${faculty?'التعديل متاح لملفاتك، والقراءة متاحة لجميع المقررات':'مواد توضيحية لتجربة المكتبة'}</p></div><button class="text-button" data-action="${faculty?'my-resources':'student-library'}">فتح المكتبة ${icon('arrowLeft')}</button></div><div class="library-grid">${list.slice(0,3).map(resourceCard).join('')||`<div class="empty">${icon('book')}<strong>لا توجد ملفات بعد</strong><p>${faculty?'ارفع أول ملف ضمن مقرراتك.':'جرّب اختيار سنة أخرى أو تصفح المكتبة.'}</p></div>`}</div>`;
 addAnnouncement();
};
const baseRenderTickets=renderTickets,baseTicketResults=renderTicketResults;
renderTickets=function(){baseRenderTickets();if(role==='faculty'){
 const scopes=document.createElement('div');scopes.className='faculty-scopes';scopes.innerHTML=[['incoming','inbox','المحالة إليّ'],['own','ticket','طلباتي الشخصية'],['all','grid','الكل']].map(([key,ico,label])=>`<button class="scope-button ${facultyTicketScope===key?'active':''}" data-action="faculty-scope" data-scope="${key}" aria-pressed="${facultyTicketScope===key}">${icon(ico)}${label}</button>`).join('');
 $('.service-strip',main).replaceWith(scopes);$('.page-heading p',main).textContent='عالج التذاكر المحالة إليك، وتابع طلباتك الشخصية بشكل منفصل.';renderTicketResults();
  }};
renderTicketResults=function(){if(role!=='faculty'){baseTicketResults();return;}const q=ticketSearch.trim().toLowerCase();const scoped=visibleTickets().filter(t=>facultyTicketScope==='all'||facultyTicketScope==='incoming'&&t.assignee==='demo_faculty'||facultyTicketScope==='own'&&t.owner==='demo_faculty');const rows=scoped.filter(t=>(ticketFilter==='all'||t.status===ticketFilter)&&(serviceFilter==='all'||t.service===serviceFilter)&&(!q||(t.subject+' '+t.id+' '+t.name).toLowerCase().includes(q)));$('#ticket-results').innerHTML=ticketTable(rows);$$('[data-action="ticket-filter"]',main).forEach(tab=>{const key=tab.dataset.filter;$('span',tab).textContent=key==='all'?scoped.length:scoped.filter(t=>t.status===key).length;});};
const baseResourceCard=resourceCard;
resourceCard=function(resource){let html=baseResourceCard(resource);if(canEditResource(resource))html=html.replace('</article>',`<div class="resource-management"><span>${resource.ownerId===roleOwners[role]?'ملفاتي · أملك صلاحية التعديل':'إدارة المحتوى'}</span><div><button class="mini-tool" data-action="edit-resource" data-id="${resource.id}" aria-label="تعديل ${e(resource.title)}">${icon('edit')} تعديل</button><button class="mini-tool danger" data-action="delete-resource" data-id="${resource.id}" aria-label="حذف ${e(resource.title)}">${icon('trash')} حذف</button></div></div></article>`);return html;};
const baseRenderLibrary=renderLibrary;
renderLibrary=function(){baseRenderLibrary();if(role==='faculty'){
 $('h1',main).textContent='مقرراتي والسلايدات';$('.page-heading p',main).textContent='ارفع وأدر سلايدات مقرراتك، أو تصفح محتوى المكتبة.';
 const mineButton=document.createElement('button');mineButton.className='filter-toggle '+(onlyMine?'active':'');mineButton.dataset.action='mine-filter';mineButton.setAttribute('aria-pressed',String(onlyMine));mineButton.innerHTML=icon('upload')+' ملفاتي';$('.filters',main).append(mineButton);
 }};
const baseUploadResource=uploadResource;
uploadResource=function(){baseUploadResource();if(!dialog.open)return;if(role==='faculty'){
 const input=$('#resource-course');const select=document.createElement('select');select.id=input.id;select.name=input.name;select.required=true;select.innerHTML=facultyCourses().map(c=>`<option>${e(c)}</option>`).join('');input.replaceWith(select);
 const note=document.createElement('div');note.className='service-info';note.innerHTML=icon('shield')+' يمكنك رفع الملفات ضمن المقررات المسندة إليك، وستظهر في المكتبة للطلبة.';$('.dialog-body',dialog).prepend(note);
 }};
function editResource(id){const resource=data.resources.find(r=>r.id===id);if(!resource||!canEditResource(resource))return;
 openDialog(dialogHeader('تعديل بيانات السلايدات',e(resource.title))+`<form id="edit-resource-form" data-id="${id}"><div class="dialog-body"><div class="form-grid"><div class="field full"><label for="edit-resource-title">عنوان المحاضرة</label><input id="edit-resource-title" name="title" value="${e(resource.title)}" required maxlength="100"></div><div class="field"><label for="edit-resource-year">السنة الدراسية</label><select id="edit-resource-year" name="year">${years.map((y,i)=>`<option value="${i+1}" ${resource.year===i+1?'selected':''}>${y}</option>`).join('')}</select></div><div class="field"><label for="edit-resource-course">المقرر</label>${role==='faculty'?`<select id="edit-resource-course" name="course">${facultyCourses().map(c=>`<option ${resource.course===c?'selected':''}>${e(c)}</option>`).join('')}</select>`:`<input id="edit-resource-course" name="course" value="${e(resource.course)}" required maxlength="60">`}</div>${role==='admin'?`<div class="field full"><label for="edit-resource-owner">المسؤول عن الملف</label><select id="edit-resource-owner" name="ownerId">${[['demo_faculty','عضو هيئة التدريس التجريبي'],['demo_admin','مدير النظام'],['other_faculty','منسق مقرر آخر']].map(([value,label])=>`<option value="${value}" ${resource.ownerId===value?'selected':''}>${label}</option>`).join('')}</select></div>`:''}<div class="field full"><label for="replace-resource-file">استبدال ملف PDF (اختياري)</label><input id="replace-resource-file" type="file" accept="application/pdf,.pdf"><small>حد أقصى ٢ ميجابايت. اتركه فارغًا للاحتفاظ بالملف الحالي.</small></div></div></div><div class="dialog-footer"><small>يُحفظ التعديل في بيانات هذا المتصفح.</small><button class="btn" type="submit">${icon('check')} حفظ التعديلات</button></div></form>`);
}
function askDelete(kind,id){const item=(kind==='resource'?data.resources:data.initiatives).find(x=>x.id===id);if(!item||(kind==='resource'?!canEditResource(item):role!=='admin'))return;openDialog(dialogHeader('حذف '+(kind==='resource'?'الملف':'المبادرة'),e(item.title))+`<div class="dialog-body"><p class="guide-intro">هل تريد إزالة ${kind==='resource'?'هذا الملف من المكتبة':'هذه المبادرة ومهامها'}؟ يمكنك إلغاء العملية الآن.</p></div><div class="dialog-footer"><button class="btn secondary" data-action="close">إلغاء</button><button class="btn danger-button" data-action="confirm-delete" data-kind="${kind}" data-id="${id}">${icon('trash')} تأكيد الحذف</button></div>`);}
const permissionSets={
 admin:[['grid','إدارة البوابة','تعديل اسم البوابة والرسائل والإعدادات والخدمات.'],['ticket','إدارة جميع الطلبات','الرد وتحديث الحالات وتغيير إحالة الطلب.'],['book','التحكم بالمكتبة','رفع وتعديل وحذف الملفات وإسناد ملكيتها.'],['flag','إدارة المبادرات','إنشاء وتعديل وحذف المبادرات وتحديث المهام والمواعيد.'],['chart','التقارير والمؤشرات','الاطلاع على جميع المؤشرات والتصدير والطباعة.']],
 faculty:[['upload','رفع سلايدات مقرراتي','إضافة ملفات PDF ضمن المقررات المسندة إليك.'],['edit','إدارة ملفاتي','تعديل بيانات سلايداتك واستبدال ملفاتها وحذفها.'],['inbox','معالجة التذاكر المحالة إليّ','قراءة الطلب والرد عليه وتحديث حالته عندما يكون محالًا إليك.'],['ticket','طلباتي الشخصية','تقديم طلب ومتابعة ردود الجهة المسؤولة.'],['book','تصفح المكتبة','قراءة ومعاينة وتحميل وحفظ ملفات المقررات.']],
 student:[['book','الوصول للمحتوى الأكاديمي','تصفح السنوات والمقررات ومعاينة السلايدات وتنزيلها.'],['bookmark','المحفوظات الشخصية','حفظ المحاضرات والرجوع إليها داخل مساحتك.'],['ticket','تقديم الطلبات','إنشاء تذكرة وإرفاق ملف وتوجيهها للجهة المختصة.'],['send','متابعة طلباتي والرد','الاطلاع على طلباتك وإضافة توضيحات للفريق.']],
 employee:[['inbox','معالجة طلبات الخدمات','استقبال الطلبات والرد عليها وتحديث الحالات.'],['upload','إضافة ملفات للمكتبة','رفع المحتوى التجريبي لخدمة منسوبي الكلية.'],['flag','متابعة مهام المبادرات','تحديث حالة المهام والمواعيد المستهدفة.'],['chart','متابعة التقارير','عرض مؤشرات الطلبات والمبادرات وتصديرها.']]
};
function renderPermissions(){main.innerHTML=heading(role==='admin'?'الأدوار والصلاحيات':'صلاحياتي','تعرف على الأدوات المتاحة لك في مساحة العمل.')+`<section class="permission-banner"><span class="permission-emblem">${icon('shield')}</span><div><h2>${roleDescriptions[role].title}</h2><p>${roleDescriptions[role].desc}</p></div><span class="demo-badge">صلاحيات العرض التجريبي</span></section><div class="permission-grid">${permissionSets[role].map(([ico,title,desc])=>`<article class="permission-card"><span class="permission-icon">${icon(ico)}</span><div><h3>${title}</h3><p>${desc}</p></div><span class="permission-check">${icon('checkCircle')}</span></article>`).join('')}</div>${role==='admin'?`<section class="panel permission-matrix"><div class="panel-header"><div><h2>ملخص الأدوار</h2><p>حدود الأدوات المتاحة في كل مساحة</p></div>${icon('users')}</div><div class="table-wrap"><table><thead><tr><th>الدور</th><th>السلايدات</th><th>الطلبات</th><th>المبادرات والإعدادات</th></tr></thead><tbody><tr><td>مدير النظام</td><td>إضافة وتعديل وحذف الجميع</td><td>إدارة الجميع والإحالة</td><td>تحكم كامل</td></tr><tr><td>عضو هيئة التدريس</td><td>إدارة ملفاته وقراءة الجميع</td><td>طلباته والمحالة إليه</td><td>غير متاحة</td></tr><tr><td>الطالب</td><td>تصفح وتنزيل وحفظ</td><td>طلباته الشخصية فقط</td><td>غير متاحة</td></tr><tr><td>موظف الخدمات</td><td>رفع وتصفح</td><td>معالجة الطلبات</td><td>متابعة المهام والتقارير</td></tr></tbody></table></div></section>`:`<div class="scope-note">${icon('lock')} ${role==='student'?'إدارة الملفات وطلبات الآخرين وإعدادات البوابة متاحة للأدوار المسؤولة فقط.':role==='faculty'?'تعديل ملفات الآخرين وإحالة التذاكر وإعدادات البوابة متاحة لمدير النظام.':'تعديل إعدادات البوابة وحذف المحتوى متاح لمدير النظام.'}</div>`}<div class="prototype-note">هذه محاكاة لعرض تجربة كل دور. التشغيل الرسمي يحتاج مصادقة جامعية والتحقق من الصلاحيات على الخادم.</div>`;}
function renderSettings(){if(role!=='admin')return;main.innerHTML=heading('إدارة البوابة','عدّل محتوى البوابة والخدمات والمقررات المسندة من مكان واحد.')+`<form id="settings-form" class="panel settings-panel"><div class="panel-header"><div><h2>هوية البوابة والمحتوى</h2><p>تنعكس التغييرات على صفحات العرض مباشرة</p></div>${icon('edit')}</div><div class="settings-body form-grid"><div class="field"><label for="setting-name">اسم البوابة</label><input id="setting-name" name="portalName" required maxlength="60" value="${e(data.settings.portalName)}"></div><div class="field"><label for="setting-tagline">الوصف المختصر</label><input id="setting-tagline" name="tagline" required maxlength="90" value="${e(data.settings.tagline)}"></div><div class="field full"><label for="setting-hero">عنوان الواجهة الرئيسية</label><input id="setting-hero" name="heroTitle" required maxlength="100" value="${e(data.settings.heroTitle)}"></div><div class="field full"><label for="setting-announcement">رسالة البوابة</label><textarea id="setting-announcement" name="announcement" required maxlength="300">${e(data.settings.announcement)}</textarea></div><div class="field full"><label for="setting-courses">المقررات المسندة لعضو هيئة التدريس، كل مقرر في سطر</label><textarea id="setting-courses" name="facultyCourses" required maxlength="600">${data.settings.facultyCourses.map(e).join('\n')}</textarea><small>يرتبط بهذه القائمة نطاق رفع السلايدات من مساحة عضو هيئة التدريس.</small></div></div><div class="settings-footer"><button class="btn" type="submit">${icon('check')} حفظ إعدادات البوابة</button></div></form><section class="panel service-settings"><div class="panel-header"><div><h2>دليل الخدمات</h2><p>أضف خدمة وعدّل اسمها وجهتها والمدة التقديرية</p></div><button class="btn small" data-action="edit-service">${icon('plus')} إضافة خدمة</button></div><div class="settings-service-list">${services.map(s=>`<div class="settings-service"><span class="service-icon">${icon(s.icon)}</span><span><strong>${e(s.name)}</strong><small>${e(s.unit)} · ${e(s.time)}</small></span><button class="mini-tool" data-action="edit-service" data-id="${s.id}">${icon('edit')} تعديل</button></div>`).join('')}</div></section><div class="prototype-note">تُحفظ جميع إعدادات النموذج محليًا. الإعدادات لا تغيّر هوية الموقع المستضاف أو جمهور الوصول إليه.</div>`;}
function editService(id){if(role!=='admin')return;const s=services.find(s=>s.id===id)||{name:'',unit:'',time:'',icon:'ticket'};openDialog(dialogHeader(id?'تعديل الخدمة':'إضافة خدمة','حدد معلومات الخدمة التي يراها المستفيدون.')+`<form id="service-form" data-id="${id||''}"><div class="dialog-body form-grid"><div class="field full"><label for="service-name">اسم الخدمة</label><input id="service-name" name="name" required maxlength="70" value="${e(s.name)}"></div><div class="field"><label for="service-unit">الجهة المسؤولة</label><input id="service-unit" name="unit" required maxlength="70" value="${e(s.unit)}"></div><div class="field"><label for="service-time">زمن الخدمة التقديري</label><input id="service-time" name="time" required maxlength="50" placeholder="مثال: يوما عمل" value="${e(s.time)}"></div><div class="field full"><label for="service-icon">الأيقونة</label><select id="service-icon" name="icon">${[['ticket','تذكرة'],['graduation','تخرج'],['book','مقرر'],['file','وثيقة'],['upload','رفع ملفات'],['info','استفسار']].map(([value,label])=>`<option value="${value}" ${s.icon===value?'selected':''}>${label}</option>`).join('')}</select></div></div><div class="dialog-footer"><small>تُوجّه الخدمات الجديدة إلى فريق خدمات الكلية.</small><button type="submit" class="btn">حفظ الخدمة</button></div></form>`);}
function editInitiative(id){if(role!=='admin')return;const i=data.initiatives.find(i=>i.id===id);if(!i)return;openDialog(dialogHeader('تعديل المبادرة',e(i.title))+`<form id="edit-initiative-form" data-id="${id}"><div class="dialog-body form-grid"><div class="field full"><label for="edit-i-title">اسم المبادرة</label><input id="edit-i-title" name="title" value="${e(i.title)}" maxlength="100" required></div><div class="field full"><label for="edit-i-description">الهدف</label><textarea id="edit-i-description" name="description" maxlength="500" required>${e(i.description)}</textarea></div><div class="field"><label for="edit-i-owner">الفريق المسؤول</label><input id="edit-i-owner" name="owner" required maxlength="80" value="${e(i.owner)}"></div><div class="field"><label for="edit-i-due">الموعد المستهدف</label><input id="edit-i-due" name="due" type="date" required value="${i.due}"></div><div class="field full"><label for="edit-i-tasks">المهام، كل مهمة في سطر</label><textarea id="edit-i-tasks" name="tasks" required maxlength="1500">${i.tasks.map(t=>e(t[0])).join('\n')}</textarea><small>تُحفظ حالة إنجاز المهام التي لم يتغير اسمها، حتى ١٠ مهام.</small></div></div><div class="dialog-footer"><button class="mini-tool danger" type="button" data-action="delete-initiative" data-id="${id}">${icon('trash')} حذف المبادرة</button><button class="btn" type="submit">حفظ التعديلات</button></div></form>`);}
const baseInitiativeDetail=initiativeDetail;
initiativeDetail=function(id){baseInitiativeDetail(id);if(role==='admin'&&dialog.open){const footer=$('.dialog-footer',dialog);const edit=document.createElement('button');edit.className='btn secondary small';edit.dataset.action='edit-initiative';edit.dataset.id=id;edit.innerHTML=icon('edit')+' تعديل المبادرة';footer.prepend(edit);}};
function assignTicket(id){if(role!=='admin')return;const t=data.tickets.find(t=>t.id===id);if(!t)return;openDialog(dialogHeader('إحالة الطلب',e(t.subject))+`<form id="assignment-form" data-id="${id}"><div class="dialog-body"><div class="field"><label for="ticket-assignee">المسؤول عن متابعة الطلب</label><select id="ticket-assignee" name="assignee">${['demo_faculty','demo_employee','demo_admin'].map(value=>`<option value="${value}" ${t.assignee===value?'selected':''}>${assigneeName(value)}</option>`).join('')}</select></div></div><div class="dialog-footer"><small>ستظهر التذكرة في مساحة الدور المحال إليه.</small><button type="submit" class="btn">حفظ الإحالة</button></div></form>`);}
function showAnnouncement(){openDialog(dialogHeader('رسالة البوابة','مبادرة التحول الرقمي')+`<div class="dialog-body"><p class="announcement-text">${e(data.settings.announcement)}</p></div><div class="dialog-footer"><button class="btn secondary" data-action="close">إغلاق</button></div>`);}
document.addEventListener('click',event=>{
 const button=event.target.closest('[data-action]');if(!button)return;const d=button.dataset;
 switch(d.action){
 case 'enter-role':enterRole(d.role);break;
 case 'choose-role':showRoleEntry();history.replaceState(null,'','#choose-role');break;
 case 'toggle-theme':toggleTheme();break;
 case 'go-permissions':go('permissions');break;
 case 'go-settings':if(role==='admin')go('settings');break;
 case 'my-tickets':facultyTicketScope='own';go('tickets');break;
 case 'faculty-incoming':facultyTicketScope='incoming';go('tickets');break;
 case 'faculty-scope':facultyTicketScope=d.scope;renderTickets();break;
 case 'my-resources':onlyMine=true;onlySaved=false;courseFilter='all';yearFilter='all';go('library');break;
 case 'student-library':onlyMine=false;onlySaved=false;yearFilter=String(data.settings.studentYear);courseFilter='all';go('library');break;
 case 'saved-library':onlyMine=false;onlySaved=true;yearFilter='all';courseFilter='all';go('library');break;
 case 'course-library':onlyMine=true;onlySaved=false;courseFilter=d.course;yearFilter='all';go('library');break;
 case 'mine-filter':onlyMine=!onlyMine;renderLibrary();break;
 case 'clear-resource-filters':onlyMine=false;renderLibrary();break;
 case 'edit-resource':editResource(d.id);break;
 case 'delete-resource':askDelete('resource',d.id);break;
 case 'edit-initiative':editInitiative(d.id);break;
 case 'delete-initiative':askDelete('initiative',d.id);break;
 case 'edit-service':editService(d.id);break;
 case 'assign-ticket':assignTicket(d.id);break;
 case 'announcement':showAnnouncement();break;
 case 'confirm-delete':{
  const list=d.kind==='resource'?data.resources:data.initiatives,item=list.find(x=>x.id===d.id);if(!item||(d.kind==='resource'?!canEditResource(item):role!=='admin'))return;
  if(update(next=>{if(d.kind==='resource'){next.resources=next.resources.filter(r=>r.id!==d.id);Object.keys(next.roleBookmarks).forEach(key=>{next.roleBookmarks[key]=next.roleBookmarks[key].filter(id=>id!==d.id);});next.bookmarks=next.bookmarks.filter(id=>id!==d.id);}else next.initiatives=next.initiatives.filter(i=>i.id!==d.id);})){closeDialog();render();toast('تم الحذف من بيانات النموذج.');}break;
 }
 }
});
document.addEventListener('change',event=>{if(event.target.id==='student-year'&&role==='student'){if(update(next=>next.settings.studentYear=Number(event.target.value)))render();}});
document.addEventListener('submit',async event=>{
 const form=event.target;if(!['settings-form','edit-resource-form','service-form','edit-initiative-form','assignment-form'].includes(form.id))return;event.preventDefault();const f=new FormData(form),id=form.dataset.id;
 if(form.id==='settings-form'&&role==='admin'){
  if(['portalName','tagline','heroTitle','announcement'].some(key=>!String(f.get(key)).trim())){toast('أكمل حقول المحتوى قبل الحفظ.');return;}
  const courses=String(f.get('facultyCourses')).split(/\r?\n/).map(s=>s.trim()).filter(Boolean).slice(0,20);if(!courses.length){toast('أضف مقررًا واحدًا على الأقل.');return;}
  if(update(next=>{for(const key of ['portalName','tagline','heroTitle','announcement'])next.settings[key]=String(f.get(key)).trim();next.settings.facultyCourses=[...new Set(courses)];})){render();toast('تم حفظ إعدادات البوابة.');}
 }
 if(form.id==='service-form'&&role==='admin'){
  const service={id:id||'svc-'+Date.now(),name:String(f.get('name')).trim(),unit:String(f.get('unit')).trim(),time:String(f.get('time')).trim(),icon:String(f.get('icon'))};if(!service.name||!service.unit||!service.time)return;
  if(update(next=>{const index=next.serviceCatalog.findIndex(s=>s.id===id);if(index>=0)next.serviceCatalog[index]=service;else next.serviceCatalog.push(service);})){services.splice(0,services.length,...data.serviceCatalog.map(s=>({...s})));closeDialog();renderSettings();toast('تم حفظ الخدمة في دليل البوابة.');}
 }
 if(form.id==='edit-resource-form'){
  const current=data.resources.find(r=>r.id===id);if(!current||!canEditResource(current))return;const course=String(f.get('course')).trim(),title=String(f.get('title')).trim();if(!course||!title)return;if(role==='faculty'&&!facultyCourses().includes(course))return;
  const file=$('#replace-resource-file').files[0];if(file&&(file.type!=='application/pdf'||file.size>2*1024*1024)){toast('اختر ملف PDF بحجم لا يتجاوز ٢ ميجابايت.');return;}
  const submit=$('button[type="submit"]',form);submit.disabled=true;
  try{const fileContent=file?await fileData(file):null;if(update(next=>{const r=next.resources.find(r=>r.id===id);Object.assign(r,{title,course,year:Number(f.get('year')),updated:now()});if(role==='admin'){r.ownerId=String(f.get('ownerId'));r.owner=r.ownerId==='demo_faculty'?roleNames.faculty:r.ownerId==='demo_admin'?roleNames.admin:'منسق مقرر آخر';}if(file){r.file=fileContent;r.filename=file.name;r.custom=true;}})){closeDialog();render();toast('تم تحديث ملف السلايدات.');}}catch{toast('تعذر قراءة الملف.');}finally{submit.disabled=false;}
 }
 if(form.id==='edit-initiative-form'&&role==='admin'){
  if(['title','description','owner','due'].some(key=>!String(f.get(key)).trim())){toast('أكمل بيانات المبادرة قبل الحفظ.');return;}
  const tasks=String(f.get('tasks')).split(/\r?\n/).map(t=>t.trim()).filter(Boolean).slice(0,10);if(!tasks.length){toast('أضف مهمة واحدة على الأقل.');return;}
  if(update(next=>{const i=next.initiatives.find(i=>i.id===id),done=new Map(i.tasks);for(const key of ['title','description','owner','due'])i[key]=String(f.get(key)).trim();i.tasks=tasks.map(t=>[t,done.get(t)||false]);})){closeDialog();render();toast('تم حفظ تعديلات المبادرة.');}
 }
 if(form.id==='assignment-form'&&role==='admin'){
  if(update(next=>{const t=next.tickets.find(t=>t.id===id);t.assignee=String(f.get('assignee'));t.replies.push({author:roleNames.admin,text:'أُحيل الطلب إلى: '+assigneeName(t.assignee),staff:true,time:now()});})){render();ticketDetail(id);toast('تم تحديث إحالة الطلب.');}
 }
});
// Each role enters from the selection screen on a fresh visit; previous content remains intact.
upgradeData(data);services.splice(0,services.length,...data.serviceCatalog.map(s=>({...s})));showRoleEntry();syncTheme();
