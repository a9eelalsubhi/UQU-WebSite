'use strict';
// MedHub demo dataset. Lecture files 1–16 are the real attached PDFs; everything else is illustrative demo content.
const MH=(()=>{
 const L=(id,title,doctor,specialty,week,file,extra={})=>({id,title,doctor,specialty,week,url:file?`assets/lectures/lecture-${String(file).padStart(2,'0')}.pdf`:null,...extra});
 const cnsObjectives={
  'cns-1':['وصف مصادر الطاقة الرئيسية للدماغ في حالتي الشبع والصيام.','شرح دور الأجسام الكيتونية أثناء الصيام الطويل.','ربط اضطرابات سكر الدم بالأعراض العصبية.'],
  'cns-2':['تتبّع مراحل تكوّن الأنبوب العصبي.','تمييز الحويصلات الدماغية الأولية والثانوية.','ربط عيوب انغلاق الأنبوب العصبي بمظاهرها السريرية.'],
  'cns-5':['تمييز أنواع الخلايا العصبية والدبقية تحت المجهر.','وصف بنية العصب الطرفي وأغلفته.','مقارنة المادة الرمادية بالبيضاء نسيجيًا.'],
  'cns-6':['تعداد استجابات الخلية العصبية للأذى.','وصف الوذمة الدماغية وأنواعها.','شرح علامات ارتفاع الضغط داخل القحف.'],
  'cns-7':['تصنيف النوبات الصرعية.','ربط أنواع الصرع بآلياتها المرضية.','تحديد مبادئ تقييم المريض بعد النوبة الأولى.']
 };
 const mcq={
  'cns-1':[
   {q:'ما المصدر الأساسي للطاقة في الدماغ بعد ثلاثة أسابيع من الصيام؟',o:['الجلوكوز','الأجسام الكيتونية','الأحماض الدهنية الحرة','اللاكتات'],a:1,why:'مع الصيام الطويل ترتفع الكيتونات في الدم ويتكيف الدماغ لاستخدامها، فتنخفض حاجته للجلوكوز.'},
   {q:'لماذا لا يستخدم الدماغ الأحماض الدهنية الحرة مباشرة كمصدر طاقة رئيسي؟',o:['لأنها لا تعبر الحاجز الدموي الدماغي بكفاءة','لأن الدماغ يفتقد الميتوكوندريا','لأنها سامة للخلايا العصبية دائمًا','لأنها تتحول إلى جلوكوز'],a:0,why:'ارتباطها بالألبومين وطبيعة الحاجز الدموي الدماغي يحدّان من دخولها بكميات كافية.'}],
  'cns-6':[
   {q:'أي نوع من الوذمة الدماغية يرافق الاحتشاء الحاد مبكرًا؟',o:['وذمة وعائية المنشأ','وذمة سامة للخلايا (Cytotoxic)','وذمة خلالية','وذمة تناضحية فقط'],a:1,why:'فشل مضخات الأيونات بسبب نقص الطاقة يسبب انتفاخ الخلايا مبكرًا.'}],
  'cns-7':[
   {q:'النوبة التي تبدأ في نصف كرة مخية واحد دون فقدان الوعي تُصنَّف:',o:['نوبة معممة','نوبة بؤرية مع الحفاظ على الوعي','نوبة غياب','نوبة رمعية عضلية'],a:1,why:'التصنيف يعتمد على منشأ النوبة ومستوى الوعي.'}]
 };
 const modules=[
  {id:'msk',year:3,name:'الجهاز العضلي الهيكلي',en:'Musculoskeletal',status:'done',weeks:5,coordinator:'د. فهد العتيبي',
   about:'بنية العظام والمفاصل والعضلات في الأطراف والعمود الفقري، مع الأساس التشريحي للإصابات الشائعة.',
   lectures:[L('msk-7','Lower Limb Bones and Joints','د. سامي الحربي','Anatomy',3,10),L('msk-8','Lower Limb Muscles','د. سامي الحربي','Anatomy',3,11),L('msk-9','Lower Limb Vessels','د. سامي الحربي','Anatomy',4,12),L('msk-10','Lower Limb Nerves','د. سامي الحربي','Anatomy',4,13),L('msk-12','Introduction to the Vertebral Column','د. ريم القرشي','Anatomy',5,14),L('msk-13','Vertebral Column: The Neck','د. ريم القرشي','Anatomy',5,15),L('msk-14','Vertebral Column: Low Back','د. ريم القرشي','Anatomy',5,16)]},
  {id:'cns',year:3,name:'العلوم العصبية والسلوك',en:'Neuroscience & Behavior',status:'current',week:3,weeks:5,coordinator:'د. نوال الزهراني',
   about:'الأساس البنيوي والوظيفي والمرضي للجهاز العصبي المركزي والطرفي، من التكوّن الجنيني إلى أمراض الميالين.',
   lectures:[L('cns-2','CNS Development','د. هالة بخاري','Embryology',1,2,{recording:true}),L('cns-1','Metabolic Integration of the CNS','د. منى الغامدي','Biochemistry',1,1,{recording:true}),L('cns-5','Histology of the Nervous System','د. عبدالله المالكي','Histology',2,5),L('cns-3','Head and Neck Development','د. هالة بخاري','Embryology',2,3),L('cns-4','Radiological Imaging of the PNS','د. خالد السلمي','Radiology',2,4),L('cns-6','Patterns of Injury in the Nervous System','د. ياسر الشهري','Pathology',3,6,{recording:true}),L('cns-7','Epilepsy','د. ياسر الشهري','Pathology',3,7),L('cns-8','Diseases of Myelin','د. ياسر الشهري','Pathology',4,8),L('cns-9','Demyelination Disorders','د. ياسر الشهري','Pathology',4,9)]},
  {id:'cvs',year:3,name:'الغدد والتكاثر',en:'Endocrine & Reproduction',status:'next',weeks:5,coordinator:'د. ماجد باوزير',about:'يبدأ بعد نهاية موديول العلوم العصبية.',lectures:[]},
  {id:'git',year:2,name:'القلب والجهاز التنفسي',en:'Cardiorespiratory',status:'done',weeks:6,coordinator:'د. سلوى الحازمي',about:'',lectures:[]},
  {id:'renal',year:2,name:'الجهاز الهضمي',en:'Gastrointestinal',status:'done',weeks:4,coordinator:'د. عمر الجهني',about:'',lectures:[]},
  {id:'endo',year:2,name:'الكلى والمسالك',en:'Renal',status:'done',weeks:4,coordinator:'د. ليلى فلمبان',about:'',lectures:[]}
 ];
 modules.forEach(m=>m.lectures.forEach(l=>{l.module=m.id;l.objectives=cnsObjectives[l.id]||['تحديد المفاهيم الأساسية في عنوان المحاضرة.','ربط المحتوى بالتطبيق السريري.','مراجعة المصطلحات الإنجليزية الرئيسية.'];l.mcq=mcq[l.id]||[];l.updates=[{date:'2026-10-29',text:'رُفع ملف المحاضرة'}].concat(l.id==='cns-6'?[{date:'2026-11-01',text:'تحديث الشريحة 14 (تصحيح صورة الفتق الدماغي)'}]:[]);}));
 const year1={semesters:[
  {name:'الفصل الأول',courses:[{name:'الكيمياء العامة',en:'General Chemistry',count:18},{name:'الأحياء الخلوية',en:'Cell Biology',count:22},{name:'مقدمة في الطب',en:'Introduction to Medicine',count:9}]},
  {name:'الفصل الثاني',courses:[{name:'الكيمياء العضوية',en:'Organic Chemistry',count:16},{name:'الفيزياء الطبية',en:'Medical Physics',count:14},{name:'علم الوراثة',en:'Genetics',count:12}]}]};
 const extraCourses=[{name:'منهجية البحث العلمي',en:'Research Methods',count:8},{name:'الاحترافية الطبية',en:'Professionalism',count:6},{name:'اللغة الإنجليزية الطبية',en:'Medical English',count:10}];
 const announcements=[
  {date:'2026-11-02',from:'منسق موديول العلوم العصبية',text:'اختبار منتصف موديول العلوم العصبية يوم الأحد 8 نوفمبر، الساعة 9 صباحًا، القاعة 3.',tag:'cns'},
  {date:'2026-11-01',from:'د. ياسر الشهري',text:'حُدّثت شرائح محاضرة Patterns of Injury؛ راجعوا الشريحة 14.',tag:'cns'},
  {date:'2026-10-30',from:'وكالة الشؤون الأكاديمية',text:'فتح التسجيل في مقرر منهجية البحث العلمي للفصل القادم.',tag:'extra'}];

 // Clinical (demo profile: year 5)
 const clinical={
  profile:{year:5,group:'المجموعة C',rotation:'jr-im',supervisor:'د. عبدالرحمن الفاسي',site:'مستشفى الملك عبدالعزيز — مكة',today:[['07:30','جولة الصباح','الباطنة 2'],['10:00','Case-Based Discussion','قاعة التعليم'],['12:30','عيادة الصدرية','العيادات الخارجية'],['14:00','مذاكرة ذاتية — ECG','—']]},
  rotations:[
   {id:'peds',name:'طب الأطفال',en:'Pediatrics',start:'2026-08-30',end:'2026-10-08',site:'مستشفى الولادة والأطفال',status:'done'},
   {id:'jr-im',name:'الباطنة',en:'Internal Medicine',start:'2026-10-11',end:'2026-11-26',site:'مستشفى الملك عبدالعزيز',status:'current',week:4,weeks:7,objectives:['أخذ تاريخ مرضي كامل ومنظم لمرضى الباطنة.','عرض الحالة بشكل منظم خلال الجولة.','تفسير ECG وتحاليل الدم الأساسية.','المشاركة في خطة العلاج تحت الإشراف.']},
   {id:'surg',name:'الجراحة العامة',en:'General Surgery',start:'2026-11-29',end:'2027-01-14',site:'مستشفى النور التخصصي',status:'next'},
   {id:'obgyn',name:'النساء والولادة',en:'OB/GYN',start:'2027-01-24',end:'2027-03-11',site:'مستشفى الولادة والأطفال',status:'next'}],
  requirements:[{id:'hx',name:'تاريخ مرضي كامل',en:'Full History',need:8},{id:'pe',name:'فحص سريري موجّه',en:'Focused Examination',need:8},{id:'pres',name:'عرض حالة في الجولة',en:'Case Presentation',need:4},{id:'ecg',name:'تفسير ECG',en:'ECG Interpretation',need:6},{id:'cann',name:'تركيب كانيولا',en:'IV Cannulation',need:3}],
  logbook:[
   {id:'lg-1',req:'hx',date:'2026-10-13',dept:'الباطنة 2',level:'Performed Under Supervision',note:'حالة ضيق تنفس؛ تعلمت التمييز بين الأسباب القلبية والرئوية.',status:'approved'},
   {id:'lg-2',req:'hx',date:'2026-10-15',dept:'الباطنة 2',level:'Performed Under Supervision',note:'',status:'approved'},
   {id:'lg-3',req:'pe',date:'2026-10-15',dept:'الباطنة 2',level:'Assisted',note:'فحص البطن لمريض تليف كبدي.',status:'approved'},
   {id:'lg-4',req:'ecg',date:'2026-10-20',dept:'الطوارئ',level:'Observed',note:'',status:'approved'},
   {id:'lg-5',req:'pres',date:'2026-10-22',dept:'الباطنة 2',level:'Performed Under Supervision',note:'عرض حالة التهاب رئوي.',status:'changes',feedback:'أضف خطة العلاج والتشخيص التفريقي بشكل أوضح.'},
   {id:'lg-6',req:'hx',date:'2026-10-27',dept:'الباطنة 2',level:'Performed Under Supervision',note:'',status:'pending'},
   {id:'lg-7',req:'cann',date:'2026-10-28',dept:'الطوارئ',level:'Assisted',note:'',status:'pending'},
   {id:'lg-8',req:'ecg',date:'2026-11-01',dept:'الباطنة 2',level:'Performed Under Supervision',note:'رجفان أذيني.',status:'draft'}],
  skills:[['History Taking','أخذ التاريخ المرضي',4],['Physical Examination','الفحص السريري',3],['Clinical Communication','التواصل السريري',3],['Clinical Reasoning','الاستدلال السريري',2],['Patient Safety','سلامة المريض',2],['Clinical Documentation','التوثيق السريري',1],['Procedural Skills','المهارات الإجرائية',1]],
  skillLevels:['لم يبدأ','تدرّب','قدّم دليلًا','رُوجع','اعتُمد'],
  osce:[
   {id:'os-1',name:'ألم الصدر',en:'Chest Pain History',skill:'History Taking',min:8,brief:'رجل عمره 54 سنة يشكو من ألم في الصدر منذ ساعتين. خذ التاريخ المرضي.',checklist:['يعرّف بنفسه ويأخذ الإذن','يسأل عن بداية الألم وطبيعته (SOCRATES)','يسأل عن الأعراض المصاحبة','يسأل عن عوامل الخطورة القلبية','يسأل عن الأدوية والحساسية','يلخّص ويطرح تشخيصًا تفريقيًا'],attempts:[62,78]},
   {id:'os-2',name:'فحص الجهاز التنفسي',en:'Respiratory Exam',skill:'Physical Examination',min:8,brief:'افحص الجهاز التنفسي لمريضة تشكو من سعال مزمن.',checklist:['غسل اليدين والتعريف','الفحص العام واليدين','فحص القصبة الهوائية','التمدد والقرع','التسمّع في جميع المناطق','تلخيص النتائج'],attempts:[70]},
   {id:'os-3',name:'إبلاغ خبر سيئ',en:'Breaking Bad News',skill:'Clinical Communication',min:10,brief:'أبلغ المريض بنتيجة خزعة تؤكد وجود ورم. استخدم إطار SPIKES.',checklist:['تهيئة المكان','معرفة ما يعرفه المريض','طلب الإذن بالمعلومة','تقديم المعلومة بوضوح','التعامل مع المشاعر','خطة المتابعة'],attempts:[]},
   {id:'os-4',name:'تفسير ECG',en:'ECG Interpretation',skill:'Clinical Reasoning',min:5,brief:'فسّر تخطيط القلب المرفق لمريض يشكو من خفقان.',checklist:['يتأكد من بيانات المريض','يحدد المعدل','يحدد النظم','يحدد المحور','يصف الموجات والفترات','يذكر التشخيص'],attempts:[85]}],
  assessments:[{type:'Mini-CEX',title:'تقييم أخذ التاريخ — مريض ضيق تنفس',date:'2026-10-21',kind:'تدريبي',status:'done',score:'جيد جدًا',feedback:'تسلسل ممتاز؛ ركّز على أسئلة الأدوية.'},{type:'CbD',title:'مناقشة حالة التهاب رئوي',date:'2026-11-05',kind:'تدريبي',status:'upcoming'},{type:'DOPS',title:'تركيب كانيولا وريدية',date:'2026-11-12',kind:'رسمي',status:'upcoming'},{type:'OSCE',title:'اختبار نهاية الروتيشن',date:'2026-11-24',kind:'رسمي',status:'upcoming'}],
  announcements:[{date:'2026-11-02',from:'منسق روتيشن الباطنة',text:'جولة الخميس تبدأ 7:00 بدل 7:30 بسبب زيارة الاعتماد.'}]
 };
 const tutorCases={
  chest:{name:'ألم الصدر',en:'Chest Pain',patient:'أبو محمد، 54 سنة، معلم متقاعد',opening:'دكتور، عندي ألم في صدري من ساعتين وما راح.',
   history:[['متى بدأ الألم؟ وكيف بدأ؟','بدأ فجأة وأنا أطلع الدرج، قبل ساعتين تقريبًا.','onset'],['صف لي الألم','كأن أحد جالس على صدري… ضغط ثقيل.','character'],['هل ينتقل الألم لمكان ثاني؟','إيه، لذراعي اليسار وفكي.','radiation'],['هل معه أعراض ثانية؟','عرقت كثير وحسيت بغثيان.','assoc'],['هل عندك أمراض مزمنة؟','عندي سكر وضغط من عشر سنين، وأدخن.','risk'],['هل تاخذ أدوية؟','ميتفورمين وأملوديبين.','meds'],['هل صار لك شي مثله قبل؟','أحيانًا ألم خفيف مع المجهود ويروح بالراحة.','prior']],
   exam:[['العلامات الحيوية','النبض 104، الضغط 150/92، التشبع 95%، الحرارة 37.0'],['الفحص العام','متعرّق، قلق، شاحب'],['فحص القلب','أصوات القلب طبيعية، لا توجد نفخات'],['فحص الصدر','دخول هواء متساوٍ، لا توجد أصوات إضافية']],
   tests:[['ECG','ارتفاع مقطع ST في V1–V4',true],['Troponin','مرتفع',true],['أشعة الصدر','طبيعية',false],['D-dimer','غير مطلوب في هذه المرحلة',false]],
   ddx:[['متلازمة الشريان التاجي الحادة — STEMI',true],['انسداد رئوي',false],['تسلخ الأبهر',false],['ارتجاع المريء',false]],
   key:['onset','character','radiation','assoc','risk']},
  abdo:{name:'ألم البطن',en:'Abdominal Pain',patient:'سارة، 22 سنة، طالبة',opening:'بطني يوجعني من أمس وصار أقوى اليوم.',history:[['أين يتركز الألم؟','بدأ حول السرة وبعدين انتقل لتحت يمين.','onset'],['هل معه حرارة أو ترجيع؟','حرارة خفيفة وترجعت مرة.','assoc'],['هل عندك شهية؟','لا، ما أقدر آكل شي.','anorexia'],['متى آخر دورة شهرية؟','قبل أسبوعين.','gyn']],exam:[['العلامات الحيوية','النبض 98، الحرارة 38.1'],['فحص البطن','ألم عند نقطة ماكبرني مع ألم ارتدادي']],tests:[['CBC','ارتفاع كريات الدم البيضاء',true],['اختبار الحمل','سلبي',true],['أشعة صوتية','زائدة دودية متضخمة',true]],ddx:[['التهاب الزائدة الدودية',true],['حمل خارج الرحم',false],['التهاب المسالك البولية',false]],key:['onset','assoc','anorexia','gyn']},
  head:{name:'الصداع',en:'Headache',patient:'خالد، 35 سنة، مهندس',opening:'عندي صداع قوي جدًا جاني فجأة.',history:[['كيف بدأ الصداع؟','فجأة، كأنها ضربة على راسي، أقوى صداع بحياتي.','onset'],['هل معه تيبس في الرقبة؟','إيه، رقبتي مشدودة.','assoc'],['هل أغمي عليك؟','للحظات بس.','loc']],exam:[['العلامات الحيوية','الضغط 168/98'],['الفحص العصبي','تيبس رقبة، لا يوجد ضعف بؤري']],tests:[['CT Head','دم في المسافة تحت العنكبوتية',true],['بزل قطني','غير مطلوب بعد نتيجة الأشعة',false]],ddx:[['نزيف تحت العنكبوتية',true],['الشقيقة',false],['التهاب السحايا',false]],key:['onset','assoc','loc']}
 };

 // Student club
 const club={
  about:'نادي طلاب كلية الطب بجامعة أم القرى: مساحة لتطوير القادة والعلماء وصنّاع الأثر من طلاب الطب.',
  leaders:[['رئيس النادي','عمر باعشن'],['نائب الرئيس','رهف الثقفي'],['الأمين العام','يوسف الشريف']],
  centers:['مركز الجودة والتطوير','مركز الشراكات','المركز الإعلامي'],
  units:[
   {id:'exec-events',cat:'exec',name:'لجنة الفعاليات',lead:'لمى العمري',about:'تخطيط وتنفيذ فعاليات النادي الكبرى.',committees:[]},
   {id:'exec-media',cat:'exec',name:'لجنة الإعلام',lead:'فيصل بنجر',about:'الهوية والمحتوى وتغطية الأنشطة.',committees:[]},
   {id:'exec-pr',cat:'exec',name:'لجنة العلاقات العامة',lead:'دانة المطيري',about:'التواصل مع الجهات والرعاة.',committees:[]},
   {id:'team-surgery',cat:'team',name:'فريق الجراحة',lead:'عبدالعزيز الحارثي',about:'ورش مهارات جراحية، مسابقات خياطة، وأيام تعريفية بالتخصص.',committees:['اللجنة العلمية','لجنة التنظيم واللوجستيات','لجنة القبول','اللجنة الإعلامية']},
   {id:'team-research',cat:'team',name:'فريق البحث العلمي',lead:'نورة الزهراني',about:'إرشاد بحثي، نادي قراءة، ودعم النشر.',committees:['اللجنة العلمية','لجنة القبول','لجنة الإرشاد البحثي']},
   {id:'team-emergency',cat:'team',name:'فريق الطوارئ',lead:'ماجد اللحياني',about:'دورات الإسعافات الأولية ومحاكاة الطوارئ.',committees:['اللجنة العلمية','لجنة التدريب','لجنة القبول']},
   {id:'prog-mentor',cat:'prog',name:'برنامج الإرشاد الأكاديمي',lead:'سارة القحطاني',about:'طلاب السنوات العليا يرشدون الطلاب الجدد طوال العام.',committees:[]},
   {id:'prog-volunteer',cat:'prog',name:'برنامج التطوع الصحي',lead:'ريان الغامدي',about:'حملات توعوية وتطوع في المستشفيات.',committees:[]}],
  positions:[
   {id:'pos-1',unit:'team-surgery',title:'عضو اللجنة العلمية',seats:6,opens:'2026-10-25',closes:'2026-11-10',interview:true,reqs:['طالب في السنة الثانية فما فوق','الالتزام بساعتين أسبوعيًا'],questions:['لماذا تهتم بالجراحة؟','اذكر نشاطًا علميًا شاركت فيه.'],route:'لجنة القبول في فريق الجراحة'},
   {id:'pos-2',unit:'team-research',title:'رئيس فريق البحث العلمي',seats:1,opens:'2026-11-01',closes:'2026-11-15',interview:true,reqs:['بحث منشور أو قيد النشر','خبرة قيادية سابقة'],questions:['ما رؤيتك للفريق خلال عام؟','كيف ستقيس أثر الفريق؟'],route:'لجنة القبول المركزية للنادي'},
   {id:'pos-3',unit:'prog-mentor',title:'مرشد أكاديمي',seats:20,opens:'2026-11-08',closes:'2026-11-22',interview:false,reqs:['طالب في السنة الثالثة فما فوق'],questions:['ما المواد التي تستطيع الإرشاد فيها؟'],route:'جهة القبول في برنامج الإرشاد'},
   {id:'pos-4',unit:'exec-media',title:'مصمم محتوى',seats:3,opens:'2026-10-01',closes:'2026-10-20',interview:true,reqs:['ملف أعمال'],questions:['أرفق رابط ملف أعمالك'],route:'جهة القبول في لجنة الإعلام'},
   {id:'pos-5',unit:'team-emergency',title:'عضو لجنة التدريب',seats:5,opens:'2026-10-28',closes:'2026-11-12',interview:false,reqs:['اجتياز دورة BLS'],questions:['متى اجتزت دورة BLS؟'],route:'لجنة القبول في فريق الطوارئ'}],
  applications:[
   {id:'app-1',pos:'pos-4',date:'2026-10-12',status:'rejected',history:[['2026-10-12','قُدّم الطلب'],['2026-10-24','لم يتم القبول هذه الدورة']]},
   {id:'app-2',pos:'pos-1',date:'2026-10-27',status:'interview',interview:{date:'2026-11-06 13:00',place:'قاعة النادي — المبنى 4'},history:[['2026-10-27','قُدّم الطلب'],['2026-11-01','اجتاز الفرز الأولي'],['2026-11-02','حُدّد موعد المقابلة']]}],
  memberships:[{unit:'prog-volunteer',role:'عضو',since:'2025-09'},{unit:'team-emergency',role:'عضو لجنة القبول',since:'2026-02'},{unit:'exec-events',role:'عضو',since:'2026-01',past:true,until:'2026-06'}],
  candidates:[{id:'c-1',name:'ليان الحربي',pos:'pos-5',answers:['اجتزت BLS في سبتمبر 2026'],status:'review'},{id:'c-2',name:'محمد الأنصاري',pos:'pos-5',answers:['في مايو 2026'],status:'review'},{id:'c-3',name:'أنت',pos:'pos-5',answers:['—'],status:'review',self:true}],
  tasks:[
   {id:'t-1',unit:'prog-volunteer',title:'إعداد محتوى حملة التوعية بالسكري',owner:'أنت',due:'2026-11-09',priority:'عالية',status:'progress'},
   {id:'t-2',unit:'prog-volunteer',title:'حجز قاعة ورشة الإسعافات',owner:'أنت',due:'2026-11-05',priority:'متوسطة',status:'new'},
   {id:'t-3',unit:'prog-volunteer',title:'قائمة المتطوعين لمعرض الصحة',owner:'ريان الغامدي',due:'2026-11-12',priority:'متوسطة',status:'new'},
   {id:'t-4',unit:'prog-volunteer',title:'تقرير حملة التبرع بالدم',owner:'هتان المحمدي',due:'2026-10-30',priority:'منخفضة',status:'done'},
   {id:'t-5',unit:'prog-volunteer',title:'تصميم منشور الحملة',owner:'جود الصبحي',due:'2026-11-07',priority:'عالية',status:'progress'}],
  news:[{date:'2026-11-02',title:'فتح التقديم على رئاسة فريق البحث العلمي',pinned:true},{date:'2026-10-29',title:'نتائج مسابقة الخياطة الجراحية',pinned:false},{date:'2026-10-25',title:'إطلاق برنامج الإرشاد الأكاديمي للعام الجديد',pinned:false}],
  files:[['خطة حملة السكري.pdf','2026-11-01'],['قائمة المتطوعين.xlsx','2026-10-30'],['هوية الحملة.zip','2026-10-28']]
 };

 // Calendar: layer = official | org | personal | club
 const events=[
  ['e1','2026-11-03','08:00','09:00','Patterns of Injury in the Nervous System','lecture','official','القاعة 3','cns','cns-6'],
  ['e2','2026-11-03','10:00','12:00','عملي الأنسجة — العلوم العصبية','practical','official','معمل 2','cns'],
  ['e3','2026-11-03','13:00','14:00','جلسة مراجعة Embryology','review','org','القاعة 5','cns'],
  ['e4','2026-11-03','13:30','15:00','مذاكرة: Epilepsy','study','personal','المكتبة','cns','cns-7'],
  ['e5','2026-11-04','08:00','09:00','Epilepsy','lecture','official','القاعة 3','cns','cns-7'],
  ['e6','2026-11-04','19:00','20:00','اجتماع برنامج التطوع الصحي','club','club','عن بعد'],
  ['e7','2026-11-05','08:00','09:00','Diseases of Myelin','lecture','official','القاعة 3','cns','cns-8',{changed:'تغيّرت القاعة من 1 إلى 3'}],
  ['e8','2026-11-05','11:00','12:00','تسليم واجب Neuroanatomy','deadline','official','منصة المقرر','cns'],
  ['e9','2026-11-06','13:00','13:30','مقابلة فريق الجراحة','club','club','قاعة النادي — المبنى 4'],
  ['e10','2026-11-08','09:00','11:00','اختبار منتصف موديول العلوم العصبية','exam','official','القاعة 3','cns'],
  ['e11','2026-11-09','08:00','09:00','Demyelination Disorders','lecture','official','القاعة 3','cns','cns-9'],
  ['e12','2026-11-10','16:00','18:00','ورشة الإسعافات الأولية','event','club','مركز المهارات'],
  ['e13','2026-11-11','10:00','11:00','محاضرة ملغاة: Neurophysiology','lecture','official','القاعة 3','cns',null,{cancelled:true}],
  ['e14','2026-11-12','20:00','21:30','مذاكرة جماعية — Pathology','study','personal','غرفة الدراسة'],
  ['e15','2026-11-02','08:00','09:00','Head and Neck Development','lecture','official','القاعة 3','cns','cns-3'],
  ['e16','2026-11-17','09:00','12:00','اختبار نهاية الموديول','exam','official','القاعة الكبرى','cns']
 ].map(([id,date,start,end,title,type,layer,place,module,lecture,extra])=>({id,date,start,end,title,type,layer,place,module,lecture,...extra}));
 const layers={official:['الرسمي','أعضاء هيئة التدريس والمنسقون'],org:['التنظيمي','قائد الدفعة'],personal:['الشخصي','لا يراه غيرك'],club:['النادي والفعاليات','عضوياتك وتسجيلاتك']};
 const types={lecture:'محاضرة',practical:'عملي',review:'مراجعة',study:'مذاكرة',exam:'اختبار',deadline:'تسليم',club:'اجتماع',event:'فعالية'};
 return {modules,year1,extraCourses,announcements,clinical,tutorCases,club,events,layers,types,today:'2026-11-03'};
})();
