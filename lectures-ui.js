'use strict';
// One-time library migration keeps the visitor's other browser-local data intact.
if (!data.suppliedLecturesV1) {
 data.resources = [...suppliedLectures, ...data.resources.filter(r => r.custom || !/^r[1-8]$/.test(r.id))];
 data.suppliedLecturesV1 = true;
 try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (_) {}
}
const originalCard = resourceCard;
resourceCard = function(r) {
 if (!r.imported || r.custom) return originalCard(r);
 const saved = data.bookmarks.includes(r.id);
 const visual=courseVisual(r.course);
 return `<article class="lecture-card"><div class="lecture-visual ${visual.color}"><span class="lecture-visual-icon">${icon(visual.icon)}</span><span class="lecture-visual-label">${e(r.course)}</span><button class="bookmark ${saved?'saved':''}" data-action="bookmark" data-id="${e(r.id)}" aria-label="${saved?'إزالة من المحفوظات':'حفظ'}" aria-pressed="${saved}">${icon('bookmark')}</button><span class="lecture-visual-pdf">PDF</span></div><div class="lecture-card-content"><span class="lecture-course">${icon('file')} محاضرة · ${e(r.course)}</span><h3 dir="auto">${e(r.title)}</h3><span class="lecture-year">${e(years[r.year-1] || 'سنة غير محددة')} · تصنيف مبدئي</span><div class="lecture-card-actions"><button class="btn small" data-action="resource-preview" data-id="${e(r.id)}">${icon('book')} فتح المحاضرة</button><button class="icon-button" data-action="resource-download" data-id="${e(r.id)}" aria-label="تحميل ${e(r.title)}">${icon('download')}</button></div>${canEditResource(r)?`<div class="resource-management"><span>إدارة المحتوى</span><div><button class="mini-tool" data-action="edit-resource" data-id="${e(r.id)}">${icon('edit')} تعديل</button><button class="mini-tool danger" data-action="delete-resource" data-id="${e(r.id)}">${icon('trash')} حذف</button></div></div>`:''}</div></article>`;
};
const originalLibrary = renderLibrary;
renderLibrary = function() {
 originalLibrary();
 const note=main.querySelector('.demo-source');
 if(note) note.textContent='المحاضرات مرتبة حسب المادة، وتصنيف السنة الثانية مبدئي للعرض.';
};
const originalPreview = resourcePreview;
resourcePreview = function(id,page=0) {
 const r=data.resources.find(x=>x.id===id);
 if(!r?.imported || r.custom) return originalPreview(id,page);
 main.innerHTML=`<div class="lecture-view"><div class="lecture-view-top"><button class="text-button" data-action="lecture-back">${icon('arrowRight')} العودة للمحاضرات</button><span>${e(r.course)}</span></div><div class="lecture-view-heading"><div><span class="lecture-pdf">${icon('file')} ملف PDF</span><h1 dir="auto">${e(r.title)}</h1><p>تصفح المحاضرة مباشرة أو حمّلها على جهازك.</p></div><a class="btn" href="${e(r.url)}" download="${e(r.filename)}">${icon('download')} تحميل المحاضرة</a></div><div class="lecture-viewer"><div class="pdf-toolbar"><button class="btn secondary small" id="pdf-prev" disabled>السابق</button><span id="pdf-page-status" role="status">جارٍ تحميل المحاضرة…</span><button class="btn secondary small" id="pdf-next" disabled>التالي</button></div><div class="pdf-stage"><canvas id="pdf-canvas" aria-label="صفحة المحاضرة"></canvas></div></div><p class="lecture-view-help">إذا لم يظهر الملف على جهازك، <a href="${e(r.url)}" target="_blank" rel="noopener">افتحه في نافذة جديدة</a> أو حمّله.</p></div>`;
 renderLecturePdf(r.url);
 window.scrollTo({top:0,behavior:'smooth'});
};
async function renderLecturePdf(url) {
 const status=document.querySelector('#pdf-page-status'),canvas=document.querySelector('#pdf-canvas');
 try {
  const pdfjs=await import('./assets/pdfjs/pdf.min.mjs');pdfjs.GlobalWorkerOptions.workerSrc='./assets/pdfjs/pdf.worker.min.mjs';
  const pdf=await pdfjs.getDocument(url).promise;let pageNumber=1,rendering=false;
  const prev=document.querySelector('#pdf-prev'),next=document.querySelector('#pdf-next');if(!prev||!next||!canvas.isConnected)return;
  async function draw(){if(rendering||!canvas.isConnected)return;rendering=true;prev.disabled=next.disabled=true;status.textContent='جارٍ تحميل الصفحة…';try{const page=await pdf.getPage(pageNumber),base=page.getViewport({scale:1}),scale=Math.min(2,Math.max(1,(canvas.parentElement.clientWidth-32)/base.width)),viewport=page.getViewport({scale});canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);await page.render({canvasContext:canvas.getContext('2d'),viewport}).promise;status.textContent=`صفحة ${pageNumber} من ${pdf.numPages}`;}catch(_){status.textContent='تعذر عرض الصفحة؛ استخدم رابط التحميل.';}finally{rendering=false;prev.disabled=pageNumber<=1;next.disabled=pageNumber>=pdf.numPages;}}
  prev.onclick=()=>{if(pageNumber>1){pageNumber--;draw();}};next.onclick=()=>{if(pageNumber<pdf.numPages){pageNumber++;draw();}};await draw();
 }catch(err){console.error('PDF viewer:',err);if(status.isConnected)status.textContent='تعذر عرض الملف؛ استخدم رابط التحميل أدناه.';}
}
const originalDownload = resourceDownload;
resourceDownload = function(id,open=false) {
 const r=data.resources.find(x=>x.id===id);
 if(!r?.imported || r.custom) return originalDownload(id,open);
 const a=document.createElement('a');a.href=r.url;a.download=r.filename;document.body.append(a);a.click();a.remove();
};
document.addEventListener('click',event=>{if(event.target.closest('[data-action="lecture-back"]')){event.preventDefault();render();}});

// Course collections provide the same simple hierarchy in the library and study years.
Object.assign(paths,{
 flask:'<path d="M9 3h6M10 3v7l-5 8a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-8V3M8 16h8"/>',
 dna:'<path d="M7 3c0 7 10 7 10 18M17 3C17 10 7 10 7 21M8 6h8M8 18h8M9 12h6"/>',
 microscope:'<path d="m10 3 5 5-3 3-5-5zM12 11l2 2M6 21h14M8 17a6 6 0 0 0 10-5M5 17h8M7 20v-3"/>',
 bone:'<path d="M7 7a3 3 0 1 0-3 3l6 6a3 3 0 1 0 4 4l6-6a3 3 0 1 0-4-4l-6 6M7 7l3 3"/>',
 brain:'<path d="M12 5a4 4 0 0 0-7 3 4 4 0 0 0-1 7 4 4 0 0 0 5 5 3 3 0 0 0 3-2zM12 5a4 4 0 0 1 7 3 4 4 0 0 1 1 7 4 4 0 0 1-5 5 3 3 0 0 1-3-2zM7 10c2 0 3 1 3 3M17 10c-2 0-3 1-3 3M7 16h2m6 0h2"/>'
});
function courseVisual(name){return ({'الكيمياء الحيوية':{icon:'flask',color:'course-teal',english:'BIOCHEMISTRY'},'علم الأجنة':{icon:'dna',color:'course-plum',english:'EMBRYOLOGY'},'علم الأنسجة':{icon:'microscope',color:'course-blue',english:'HISTOLOGY'},'الأنسجة والتصوير':{icon:'microscope',color:'course-blue',english:'IMAGING'},'علم الأمراض':{icon:'brain',color:'course-rose',english:'PATHOLOGY'},'الجهاز العضلي الهيكلي':{icon:'bone',color:'course-gold',english:'MUSCULOSKELETAL'}})[name]||{icon:'book',color:'course-teal',english:'COURSE'};}
let studyCourse=null,libraryCourse=null,lastStudyYear=null;
function courseTiles(list,context){const names=[...new Set(list.map(r=>r.course))];return `<div class="course-intro"><div><span>مكتبتك الأكاديمية</span><h3>اختر المادة</h3><p>كل مادة تجمع محاضراتها في مكان واحد.</p></div><span class="course-total">${names.length} مواد</span></div><div class="course-grid">${names.map((name,i)=>{const v=courseVisual(name),count=list.filter(r=>r.course===name).length;return `<button class="course-tile ${v.color}" data-action="open-course-group" data-context="${context}" data-course="${e(name)}"><span class="course-tile-head"><span class="course-icon">${icon(v.icon)}</span><span class="course-number">${String(i+1).padStart(2,'0')}</span></span><span class="course-english">${v.english}</span><strong>${e(name)}</strong><span class="course-count">${icon('file')} ${count} محاضرة</span><span class="course-open">عرض المحاضرات ${icon('arrowLeft')}</span></button>`;}).join('')}</div>`;}
function courseContents(list,course,context){const selected=list.filter(r=>r.course===course);return `<div class="course-detail"><button class="text-button course-back" data-action="close-course-group" data-context="${context}">${icon('arrowRight')} جميع المواد</button><div class="course-detail-title"><span class="course-detail-icon ${courseVisual(course).color}">${icon(courseVisual(course).icon)}</span><div><span>محاضرات المادة</span><h3>${e(course)}</h3></div><span class="course-total">${selected.length} محاضرة</span></div><div class="library-grid">${selected.map(resourceCard).join('')}</div></div>`;}
const originalStudyYears=renderStudyYears;
renderStudyYears=function(clinical){originalStudyYears(clinical);if(lastStudyYear!==selectedStudyYear){studyCourse=null;lastStudyYear=selectedStudyYear;}if(studyTab!=='slides')return;const list=data.resources.filter(r=>r.year===selectedStudyYear),grid=main.querySelector('.library-grid');if(!grid||!list.length)return;const wrap=document.createElement('section');wrap.className='courses-section';wrap.innerHTML=studyCourse?courseContents(list,studyCourse,'study'):courseTiles(list,'study');grid.replaceWith(wrap);};
const originalLibraryResults=renderLibraryResults;
renderLibraryResults=function(){originalLibraryResults();const q=resourceSearch.trim().toLowerCase(),list=data.resources.filter(r=>(yearFilter==='all'||String(r.year)===yearFilter)&&(courseFilter==='all'||r.course===courseFilter)&&(!onlySaved||data.bookmarks.includes(r.id))&&(!onlyMine||r.ownerId===roleOwners[role])&&(!q||(r.title+' '+r.course+' '+r.english).toLowerCase().includes(q)));if(!list.length)return;const root=document.querySelector('#library-results');if(libraryCourse&&!list.some(r=>r.course===libraryCourse))libraryCourse=null;root.innerHTML=libraryCourse?courseContents(list,libraryCourse,'library'):courseTiles(list,'library');};
document.addEventListener('click',event=>{const button=event.target.closest('[data-action="open-course-group"],[data-action="close-course-group"]');if(!button)return;const isStudy=button.dataset.context==='study',value=button.dataset.action==='open-course-group'?button.dataset.course:null;if(isStudy){studyCourse=value;render();}else{libraryCourse=value;renderLibraryResults();}});
