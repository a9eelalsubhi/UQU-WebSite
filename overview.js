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
 container.innerHTML=`<div class="hub-heading"><div><span class="hub-kicker">مبادرة التحول الرقمي · كلية الطب</span><h1>${role==='student'?'كلية الطب... بمنصة واحدة':role==='faculty'?'مساحتك الأكاديمية، بمنصة واحدة':'كلية الطب... برؤية موحدة'}</h1><p>${role==='student'?'كل ما تحتاجه من المحاضرة إلى الخدمة الإلكترونية في مكان واحد.':role==='faculty'?'مقرراتك وسلايداتك وطلبات المستفيدين، في مساحة واضحة ومتكاملة.':'خدمات الكلية ومبادراتها ومؤشراتها في لوحة واحدة.'}</p></div><span class="hub-role">${icon(roleDescriptions[role].icon)} ${roleDescriptions[role].title}</span></div><section class="hub-hero"><div class="hub-copy"><span class="hub-hero-label">ONE PLATFORM. ONE JOURNEY.</span><h2>${e(data.settings.heroTitle)}</h2><p>منصة تجمع المحتوى الأكاديمي والخدمات ومتابعة المبادرات، بتجربة مصممة لكل منسوبي الكلية.</p><div class="hub-hero-actions"><button class="btn hub-gold" data-action="hub-explore">استكشف أقسام المنصة ${icon('arrowLeft')}</button><button class="btn hub-white" data-action="hub-open" data-target="tickets">${icon('ticket')} الخدمات والطلبات</button></div></div><div class="hub-illustration" aria-hidden="true"><div>${icon('health')}</div></div></section><div class="hub-section-header" id="hub-sections"><div><h2>استكشف أقسام البوابة</h2><p>اختر القسم الذي يناسب احتياجك للانتقال إليه مباشرة.</p></div><span>${sections.length} أقسام متاحة</span></div><div class="hub-grid">${sections.map(([ico,title,desc,target],i)=>`<button class="hub-card" data-action="hub-open" data-target="${target}"><span class="hub-card-top"><span class="hub-card-icon">${icon(ico)}</span><span class="hub-card-number">${String(i+1).padStart(2,'0')}</span></span><strong>${title}</strong><span class="hub-card-desc">${desc}</span><span class="hub-card-link">استكشف ${icon('arrowLeft')}</span></button>`).join('')}</div><div class="hub-bottom-note">${icon('info')} نموذج تفاعلي للعرض؛ البيانات تجريبية ومحفوظة في هذا المتصفح.</div>`;
 main.append(container,existing);
};
document.addEventListener('click',event=>{const button=event.target.closest('[data-action]');if(!button)return;
 if(button.dataset.action==='hub-explore')document.querySelector('#hub-sections')?.scrollIntoView({behavior:'smooth',block:'start'});
 if(button.dataset.action==='hub-open'){const target=button.dataset.target;if(['library','tickets','initiatives','reports','permissions','settings','basic-years','clinical-years','student-calendar'].includes(target)){if(allowedViews().includes(target))go(target);return;}document.querySelector(`[data-action="${target}"]`)?.click();}
});
