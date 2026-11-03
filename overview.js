'use strict';
const previousOverview=renderOverview;
renderOverview=function(){
 previousOverview();
 const existing=document.createElement('details');existing.className='hub-personal';
 const summary=document.createElement('summary');summary.innerHTML=icon('grid')+' <span>عرض تفاصيل مساحتي والمؤشرات</span>';existing.append(summary);
 while(main.firstChild)existing.append(main.firstChild);
 const sections=role==='student'?[
 ['book','السنوات الأساسية','الموديولات، المحاضرات، التسجيلات والأدلة.','basic-years'],
 ['health','السنوات السريرية','التدريب السريري، السجل والمهارات.','clinical-years'],
 ['calendar','التقويم الموحد','المواعيد الأكاديمية والشخصية للطالب.','student-calendar'],
 ['book','مكتبة السلايدات','تصفح المحاضرات حسب السنة والمقرر.','library'],
 ['ticket','الخدمات والطلبات','قدّم طلبًا وتابع حالته مع الجهة المسؤولة.','tickets'],
 ['bookmark','المحفوظات','ارجع إلى المحاضرات التي حفظتها.','saved-library']
 ]:role==='faculty'?[
 ['book','مقرراتي والسلايدات','أدر ملفات مقرراتك وتصفح المكتبة.','my-resources'],
 ['inbox','التذاكر المحالة إليّ','تابع الطلبات الواردة وأضف ردودك.','faculty-incoming'],
 ['upload','رفع السلايدات','أضف محتوى إلى مقرراتك المسندة.','upload-resource'],
 ['ticket','طلباتي الشخصية','قدّم طلبًا وتابع خدمات الكلية.','my-tickets'],
 ['bookmark','المحفوظات','ارجع إلى ملفاتك المحفوظة.','saved-library'],
 ]:[
 ['book','المكتبة الأكاديمية','تصفح المحتوى الدراسي وأدر الملفات.','library'],
 ['ticket','التذاكر والطلبات','تابع طلبات المستفيدين وحالاتها.','tickets'],
 ['flag','الأنشطة والمبادرات','تابع المهام والنتائج ومواعيد الإنجاز.','initiatives'],
 ['chart','التقارير والمؤشرات','استعرض ملخص الأداء وصدّر التقارير.','reports'],
 ['shield','الأدوار والصلاحيات','تعرّف على الصلاحيات المتاحة لكل دور.','permissions'],
 ...(role==='admin'?[['settings','إدارة البوابة','عدّل محتوى البوابة والخدمات والمقررات.','settings']]:[['upload','إضافة ملف','أضف محتوى للمكتبة الأكاديمية.','upload-resource']])
 ];
 const container=document.createElement('div');container.className='hub-home fade-in';
 const lede=role==='student'?'كل ما تحتاجه من المحاضرة إلى الخدمة الإلكترونية، في مكان واحد.':role==='faculty'?'مقرراتك وسلايداتك وطلبات المستفيدين، في مساحة واضحة ومتكاملة.':'خدمات الكلية ومبادراتها ومؤشراتها، في لوحة واحدة.';
 container.innerHTML=`<section class="hub-hero"><div class="hub-copy"><span class="hub-role">${icon(roleDescriptions[role].icon)} ${roleDescriptions[role].title}</span><h1>${e(data.settings.heroTitle)}</h1><p>${lede}</p><div class="hub-hero-actions"><button class="btn hub-gold" data-action="hub-explore">أقسام البوابة ${icon('arrowLeft')}</button><button class="btn hub-white" data-action="hub-open" data-target="tickets">${icon('ticket')} الخدمات والطلبات</button></div></div><canvas class="hub-scene" data-pulse-scene="compact" aria-hidden="true"></canvas></section><div class="hub-section-header" id="hub-sections"><h2>أقسام البوابة</h2><span>${sections.length} أقسام متاحة لك</span></div><nav class="hub-grid" aria-label="أقسام البوابة">${sections.map(([ico,title,desc,target])=>`<button class="hub-card" data-action="hub-open" data-target="${target}"><span class="hub-card-icon">${icon(ico)}</span><span class="hub-card-text"><strong>${title}</strong><span class="hub-card-desc">${desc}</span></span><span class="hub-card-link">${icon('arrowLeft')}</span></button>`).join('')}</nav><p class="hub-bottom-note">${icon('info')} نموذج تفاعلي للعرض؛ البيانات تجريبية ومحفوظة في هذا المتصفح.</p>`;
 main.append(container,existing);
};
document.addEventListener('click',event=>{const button=event.target.closest('[data-action]');if(!button)return;
 if(button.dataset.action==='hub-explore')document.querySelector('#hub-sections')?.scrollIntoView({behavior:'smooth',block:'start'});
 if(button.dataset.action==='hub-open'){const target=button.dataset.target;if(['library','tickets','initiatives','reports','permissions','settings','basic-years','clinical-years','student-calendar'].includes(target)){if(allowedViews().includes(target))go(target);return;}document.querySelector(`[data-action="${target}"]`)?.click();}
});
