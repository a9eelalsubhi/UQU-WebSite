'use strict';
// Curriculum identity: one glyph and one colour per subject, module and rotation, plus the demo lectures that fill every module.
const GLYPHS={
 anatomy:'<path d="M17 10c.7-.7 1.69 0 2.5 0a2.5 2.5 0 1 0 0-5 .5.5 0 0 1-.5-.5 2.5 2.5 0 1 0-5 0c0 .81.7 1.8 0 2.5l-7 7c-.7.7-1.69 0-2.5 0a2.5 2.5 0 0 0 0 5c.28 0 .5.22.5.5a2.5 2.5 0 1 0 5 0c0-.81-.7-1.8 0-2.5Z"/>',
 histology:'<path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/>',
 embryology:'<circle cx="12" cy="12" r="9.5"/><circle cx="9.6" cy="9.6" r="2.4"/><circle cx="14.4" cy="9.6" r="2.4"/><circle cx="9.6" cy="14.4" r="2.4"/><circle cx="14.4" cy="14.4" r="2.4"/>',
 biochemistry:'<path d="M12 2.8 19.8 7.4v9.2L12 21.2l-7.8-4.6V7.4Z"/><path d="M12 7.5v-4.7M12 21.2v-4.7"/><circle cx="12" cy="12" r="3.2"/>',
 pharmacology:'<path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/>',
 pathology:'<rect x="2" y="7" width="20" height="10" rx="2"/><path d="M8.5 10.6c1.6-1.3 3.4.4 5 .1s2.6 1.6.9 2.7-3.9.6-5.4.2-1.8-2.2-.5-3Z"/><path d="M18 9.5v5"/>',
 microbiology:'<rect x="4.5" y="8.5" width="15" height="7" rx="3.5" transform="rotate(-35 12 12)"/><circle cx="10" cy="13" r=".9"/><circle cx="13.6" cy="10.6" r=".9"/><path d="M17.6 6.2c1-.8 1.6-2 2.9-2.2M6.4 17.8c-1 .8-1.6 2-2.9 2.2"/>',
 parasitology:'<path d="M4 17.5c1.8-3.4 4-3.4 5.2-.8s3.4 2.6 4.6-.6 1.4-6.2 3.8-7.6"/><circle cx="19" cy="7.5" r="2.2"/><path d="M5.6 14.4l1 1.6M9.4 19l.4-1.8M13.6 16.8l-1.6-.6"/>',
 immunology:'<path d="M12 21.5v-8.5"/><path d="M12 13 6.2 7.2"/><path d="M12 13l5.8-5.8"/><path d="M3.3 9.6 8.4 4.5"/><path d="M15.6 4.5l5.1 5.1"/>',
 hematology:'<path d="M12 2.5S5.5 9.5 5.5 14a6.5 6.5 0 0 0 13 0C18.5 9.5 12 2.5 12 2.5Z"/><path d="M9 14.5a3 3 0 0 0 3 3"/>',
 radiology:'<path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M12 6.5v11M8.4 9h7.2M7.8 12h8.4M8.4 15h7.2"/>',
 // modules
 lungs:'<path d="M12 3.5v8.5M12 12l-2.6 2M12 12l2.6 2"/><path d="M8.8 6.8C6.2 6.8 4 11 4 16.2 4 18.3 5 19.5 6.6 19.5S9.4 18.2 9.4 16V9.6"/><path d="M15.2 6.8c2.6 0 4.8 4.2 4.8 9.4 0 2.1-1 3.3-2.6 3.3S14.6 18.2 14.6 16V9.6"/>',
 stomach:'<path d="M8.5 2.5V6c0 2.2 1.4 3.6 3.6 3.6 3.8 0 7.4 2.4 7.4 6.4 0 3.4-2.8 5.5-6.4 5.5C8 21.5 4.5 18.4 4.5 13.6"/><path d="M12.5 13.5c1.6.4 2.8 1.2 3.3 2.6"/>',
 kidney:'<path d="M15.2 3c-3 0-5.2 2.4-5.2 5 0 1.6 1.4 2.2 1.4 3.8S10 14.3 10 16c0 2.8 2.2 5 5.2 5 3.6 0 5.8-3.8 5.8-9S18.8 3 15.2 3Z"/><path d="M11 12H7.2C5.4 12 4 13.4 4 15.2V21"/>',
 joint:'<path d="M9 2.5v6.2a3 3 0 0 0 6 0V2.5"/><path d="M9 21.5v-6.2a3 3 0 0 1 6 0v6.2"/><path d="M7 12h10"/>',
 brain:'<path d="M12 5a3 3 0 0 0-5.8 1A3 3 0 0 0 4 10.5a3 3 0 0 0 1 5.3A3.5 3.5 0 0 0 12 18Z"/><path d="M12 5a3 3 0 0 1 5.8 1A3 3 0 0 1 20 10.5a3 3 0 0 1-1 5.3A3.5 3.5 0 0 1 12 18Z"/><path d="M12 5v15M8.5 9.5c1 .2 1.8.9 2 2M15.5 9.5c-1 .2-1.8.9-2 2"/>',
 gland:'<path d="M12 6.5v11"/><path d="M12 9c-1-3-6-4-7-1s0 9 3 9 4-2 4-4"/><path d="M12 9c1-3 6-4 7-1s0 9-3 9-4-2-4-4"/>',
 // year one + companion courses
 flask:'<path d="M10 2v7.5L4.7 20.5a1 1 0 0 0 .9 1.5h12.8a1 1 0 0 0 .9-1.5L14 9.5V2"/><path d="M8.5 2h7M7 16h10"/>',
 cell:'<path d="M12 3c5 0 9 3.6 9 8.6S17.2 21 12 21 3 17.4 3 12.4 7 3 12 3Z"/><circle cx="12.5" cy="11.5" r="3"/><circle cx="7.5" cy="15.5" r=".9"/><circle cx="16.5" cy="7" r=".9"/>',
 stethoscope:'<path d="M11 2v2M5 2v2M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"/><path d="M8 15a6 6 0 0 0 12 0v-3"/><circle cx="20" cy="10" r="2"/>',
 atom:'<circle cx="12" cy="12" r="1.5"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>',
 dna:'<path d="M7 2c0 5 10 5 10 10S7 17 7 22M17 2c0 5-10 5-10 10s10 5 10 10"/><path d="M8.5 5.5h7M8.5 18.5h7M10 9h4M10 15h4"/>',
 research:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h5"/><path d="M14 2v6h6v3"/><circle cx="16.5" cy="16.5" r="3.5"/><path d="m21.5 21.5-2.5-2.5"/>',
 badge:'<circle cx="12" cy="9" r="6"/><path d="m8.5 13.8-1.5 7.7 5-3 5 3-1.5-7.7"/><path d="m9.8 9 1.6 1.6 3-3"/>',
 language:'<path d="m5 8 6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6"/>',
 chart:'<path d="M3 3v18h18"/><path d="M7 16V11M11.5 16V7M16 16v-3.5M20 16V9"/>',
 // rotations
 baby:'<circle cx="12" cy="8.5" r="4.5"/><path d="M10.2 8.4h.01M13.8 8.4h.01M10.8 10.6c.7.5 1.7.5 2.4 0"/><path d="M5.5 21.5v-1.2a6.5 6.5 0 0 1 13 0v1.2"/>',
 scalpel:'<path d="M3 21 12.5 11.5"/><path d="M12.5 11.5 18.6 5.4a2.1 2.1 0 0 1 3 3l-6.1 6.1-3-3Z"/><path d="M8 21h4"/>',
 mother:'<circle cx="11" cy="5" r="2.8"/><path d="M8 21.5V14c0-2.6 1.2-5.2 3.4-5.6 2.4-.4 3.9 1.4 3.9 3.6"/><path d="M15.3 12c2.2.3 3.7 2 3.7 4.1 0 2.5-2.2 4-4.6 4"/>',
 // activities
 megaphone:'<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
 poster:'<rect x="3" y="3" width="18" height="13" rx="1.5"/><path d="M12 16v5M8 21h8M7 7.5h6M7 10.5h10"/>',
 scales:'<path d="M12 3v18M7 21h10M5 6.5h14"/><path d="m5 6.5-3 7a3.2 3.2 0 0 0 6 0Z"/><path d="m19 6.5-3 7a3.2 3.2 0 0 0 6 0Z"/>',
 code:'<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/><path d="m14 4-4 16"/>',
 glucose:'<rect x="6" y="2.5" width="12" height="19" rx="3"/><rect x="8.5" y="5.5" width="7" height="5" rx="1"/><path d="M12 13.5s-2 2.2-2 3.4a2 2 0 0 0 4 0c0-1.2-2-3.4-2-3.4Z"/>'
};
function glyph(n,cls=''){return `<svg class="glyph ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${GLYPHS[n]||GLYPHS.cell}</svg>`;}

const SUBJECTS={
 anatomy:{ar:'التشريح',en:'Anatomy',c:'#c8553d',doc:'د. سامي الحربي'},
 histology:{ar:'الأنسجة',en:'Histology',c:'#c03f7c',doc:'د. عبدالله المالكي'},
 embryology:{ar:'الأجنة',en:'Embryology',c:'#1f8f86',doc:'د. هالة بخاري'},
 biochemistry:{ar:'الكيمياء الحيوية',en:'Biochemistry',c:'#a87a06',doc:'د. منى الغامدي'},
 pharmacology:{ar:'علم الأدوية',en:'Pharmacology',c:'#7356cf',doc:'د. إيمان الصاعدي'},
 pathology:{ar:'علم الأمراض',en:'Pathology',c:'#a3324a',doc:'د. ياسر الشهري'},
 microbiology:{ar:'الأحياء الدقيقة',en:'Microbiology',c:'#3b8a4c',doc:'د. طارق الأنصاري'},
 parasitology:{ar:'علم الطفيليات',en:'Parasitology',c:'#8a6236',doc:'د. رهام القحطاني'},
 immunology:{ar:'علم المناعة',en:'Immunology',c:'#2f68bd',doc:'د. بندر العمري'},
 hematology:{ar:'علم الدم',en:'Hematology',c:'#cf3a3a',doc:'د. سمر الجدعاني'},
 radiology:{ar:'الأشعة',en:'Radiology',c:'#52677a',doc:'د. خالد السلمي'}
};
const subjOf=sp=>(sp||'').toLowerCase();
const subjectByEn=sp=>SUBJECTS[subjOf(sp)];
const MODULE_LOOK={git:{g:'lungs',c:'#c4543f'},renal:{g:'stomach',c:'#c27a1e'},endo:{g:'kidney',c:'#7a58b8'},msk:{g:'joint',c:'#2f78a8'},cns:{g:'brain',c:'#0b7a70'},cvs:{g:'gland',c:'#b24b7d'}};
const ROTATION_LOOK={peds:{g:'baby',c:'#d07a2a'},'jr-im':{g:'stethoscope',c:'#0b7a70'},surg:{g:'scalpel',c:'#2f68bd'},obgyn:{g:'mother',c:'#b24b7d'}};
const EVENT_LOOK={'ev-diab':{g:'glucose',c:'#2f68bd'},'ev-poster':{g:'poster',c:'#7356cf'},'ev-ethics':{g:'scales',c:'#8a6236'},'ev-blood':{g:'hematology',c:'#cf3a3a'},'ev-hack':{g:'code',c:'#0b7a70'}};

(()=>{
 // Demo lectures (no files) so every module carries its full set of subjects.
 const plan={
  git:{start:'2025-09-07',weeks:6,items:[['anatomy','Thoracic Wall and Mediastinum',1],['anatomy','Anatomy of the Lungs and Pleura',2],['histology','Histology of the Respiratory Tract',2],['histology','Histology of Blood Vessels',3],['embryology','Development of the Heart',1],['biochemistry','Lipoprotein Metabolism',3],['pharmacology','Antihypertensive Drugs',4],['pharmacology','Bronchodilators and Asthma Drugs',5],['pathology','Atherosclerosis',4],['pathology','Pathology of Pneumonia',5],['microbiology','Respiratory Tract Pathogens',5],['immunology','Asthma and Hypersensitivity',6],['hematology','Red Cell Physiology and Anemia',3],['radiology','Chest X-ray Basics',6]]},
  renal:{start:'2025-10-26',weeks:4,items:[['anatomy','Anterior Abdominal Wall',1],['anatomy','Peritoneum and the Abdominal Organs',1],['histology','Histology of the GI Tract',2],['embryology','Development of the Gut',1],['biochemistry','Digestion and Absorption',2],['pharmacology','Drugs for Peptic Ulcer',3],['pathology','Liver Cirrhosis',3],['microbiology','Enteric Bacteria',3],['parasitology','Intestinal Protozoa',4],['parasitology','Helminths of the Gut',4],['radiology','Abdominal Imaging',4]]},
  endo:{start:'2025-11-30',weeks:4,items:[['anatomy','Kidney and Ureter',1],['histology','Histology of the Nephron',1],['embryology','Development of the Urinary System',1],['biochemistry','Acid–Base Balance',2],['pharmacology','Diuretics',2],['pathology','Glomerulonephritis',3],['microbiology','Urinary Tract Infections',3],['parasitology','Schistosomiasis',3],['immunology','Immune-Mediated Kidney Disease',4],['hematology','Erythropoietin and Renal Anemia',4],['radiology','Renal Imaging',4]]},
  msk:{items:[['histology','Bone and Cartilage Histology',1],['histology','Skeletal Muscle Histology',1],['embryology','Limb Development',1],['biochemistry','Collagen Synthesis',2],['pharmacology','NSAIDs',2],['pharmacology','Drugs for Gout',4],['pathology','Osteomyelitis',4],['pathology','Bone Tumors',5],['microbiology','Septic Arthritis Organisms',3],['immunology','Rheumatoid Arthritis',3],['radiology','Imaging of Fractures',2]]},
  cns:{items:[['anatomy','Neuroanatomy: The Brainstem',1],['anatomy','Cranial Nerves',2],['pharmacology','Antiepileptic Drugs',3],['pharmacology','Drugs for Parkinsonism',5],['microbiology','Meningitis Pathogens',4],['parasitology','Neurocysticercosis',5],['immunology','Immunology of Multiple Sclerosis',4],['hematology','Cerebral Venous Thrombosis and Coagulation',5]]},
  cvs:{items:[['anatomy','Pelvic Anatomy',1],['histology','Histology of the Endocrine Glands',1],['embryology','Development of the Reproductive System',2],['biochemistry','Steroid Hormone Synthesis',1],['pharmacology','Insulin and Oral Hypoglycemics',3],['pharmacology','Thyroid Drugs',4],['pathology','Thyroid Pathology',3],['immunology','Autoimmune Thyroid Disease',4],['radiology','Thyroid Ultrasound',5]]}
 };
 MH.modules.forEach(m=>{
  const p=plan[m.id]||{items:[]},look=MODULE_LOOK[m.id]||{};Object.assign(m,look);
  p.items.forEach(([s,title,week],i)=>{const S=SUBJECTS[s];m.lectures.push({id:`${m.id}-d${i+1}`,title,doctor:S.doc,specialty:S.en,week,url:null,module:m.id,demo:true,objectives:['تحديد المفاهيم الأساسية في عنوان المحاضرة.','ربط المحتوى بالتطبيق السريري.','مراجعة المصطلحات الإنجليزية الرئيسية.'],mcq:[],updates:[{date:'2026-10-29',text:'أُضيفت المحاضرة لخطة الموديول'}]});});
  m.lectures.sort((a,b)=>a.week-b.week);
  m.subjects=Object.keys(SUBJECTS).filter(k=>m.lectures.some(l=>subjOf(l.specialty)===k));
  if(!m.about)m.about={git:'تشريح ووظائف القلب والرئتين وأمراضهما وعلاجها، من التكوين الجنيني إلى صورة الصدر.',renal:'القناة الهضمية والكبد: البنية والهضم والامتصاص والعدوى والطفيليات المعوية.',endo:'الكلية والمسالك البولية: النيفرون، توازن السوائل والحموض، والأمراض والعدوى.'}[m.id]||'';
 });
 Object.assign(MH.modules.find(m=>m.id==='cvs'),{about:'الغدد الصماء والجهاز التناسلي: الهرمونات وتنظيمها وأمراضها وعلاجها.',starts:'2026-11-22'});
 // Year one and the companion courses now live inside their year.
 const Y1G={'General Chemistry':'flask','Cell Biology':'cell','Introduction to Medicine':'stethoscope','Organic Chemistry':'biochemistry','Medical Physics':'atom','Genetics':'dna'},Y1C={'General Chemistry':'#a87a06','Cell Biology':'#3b8a4c','Introduction to Medicine':'#0b7a70','Organic Chemistry':'#c8553d','Medical Physics':'#2f68bd','Genetics':'#7356cf'};
 MH.year1.semesters.forEach(s=>s.courses.forEach(c=>{c.g=Y1G[c.en];c.c=Y1C[c.en];}));
 const extraLook={'Research Methods':['research','#52677a',2],'Professionalism':['badge','#0b7a70',1],'Medical English':['language','#2f68bd',1]};
 MH.extraCourses.forEach(c=>{const [g,col,y]=extraLook[c.en]||['badge','#52677a',3];Object.assign(c,{g,c:col,year:y});});
 MH.extraCourses.push({name:'الإحصاء الحيوي',en:'Biostatistics',count:8,g:'chart',c:'#a3324a',year:3});
 // Each specialty carries its own weekly schedule.
 const wk=(...days)=>days.map(d=>d.split('|'));
 const sched={
  peds:wk('جولة 7:30|عيادة الأطفال 10:00','جولة 7:30|حديثو الولادة 11:00','جولة 7:30|CbD 10:00','جولة 7:30|طوارئ الأطفال 12:00','تقييم أسبوعي 9:00'),
  'jr-im':wk('جولة 7:30|CbD 10:00|القسم 12:00','جولة 7:30|عيادة 9:00|القسم 12:00','جولة 7:30|CbD 10:00|عيادة الصدرية 12:30','جولة 7:30|عيادة 9:00|القسم 12:00','جولة 7:00|تقييم أسبوعي 10:00'),
  surg:wk('جولة 6:30|غرفة العمليات 8:00','جولة 6:30|عيادة الجراحة 9:00','جولة 6:30|غرفة العمليات 8:00','جولة 6:30|مهارات الخياطة 11:00','جولة 6:30|تقييم أسبوعي 10:00'),
  obgyn:wk('جولة 7:00|غرفة الولادة 9:00','جولة 7:00|عيادة الحوامل 10:00','جولة 7:00|CbD 11:00','جولة 7:00|عمليات النساء 8:30','تقييم أسبوعي 9:00')
 };
 MH.clinical.rotations.forEach(r=>Object.assign(r,ROTATION_LOOK[r.id]||{},{schedule:sched[r.id]}));
 MH.clinical.rotations.forEach(r=>{if(!r.weeks)r.weeks=Math.round((new Date(r.end)-new Date(r.start))/6048e5);});
})();
