'use strict';
// Ties sections 06–09 into routing, the calendar, search and notifications.
navItems.push(['activities','flag','الأنشطة والمبادرات'],['training','award','المهارات والتدريب'],['portfolio','passport','ملفي الشخصي'],['services','info','الخدمات والدعم']);
Object.assign(mhRoute,{activities:{page:'home'},training:{page:'home'},services:{page:'home'},portfolio:{page:'home'}});
{const prev=allowedViews;allowedViews=function(){const v=prev().filter(x=>!['activities','training','portfolio','services'].includes(x));if(role==='student')v.push('activities','training','portfolio','services');else if(role)v.push('services');return v;};}
// Things the student signed up for appear in the unified calendar.
window.mhExtraEvents=()=>{
 const out=[];
 actRegs().filter(r=>['accepted','offer'].includes(r.status)).forEach(r=>{const ev=evById(r.event);out.push({id:'act-'+ev.id,date:ev.date,start:ev.start,end:ev.end,title:ev.title,type:'event',layer:'club',place:ev.place});});
 (MHS.s.actShifts||[]).map(shiftById).forEach(sh=>{const ev=evById(MH2.volunteer.event);out.push({id:'shift-'+sh.id,date:ev.date,start:sh.start,end:sh.end,title:'شفت تطوع: '+sh.role,type:'event',layer:'club',place:ev.place});});
 bookings().filter(b=>b.status==='confirmed').forEach(b=>{const c=courseById(b.course),s=c.sessions.find(x=>x.id===b.session),[a,z]=s.time.split(/[–\s]/);out.push({id:'bk-'+b.id,date:s.date,start:a,end:z||a,title:'دورة: '+c.ar,type:'event',layer:'personal',place:s.place});});
 return out;
};
{const prev=searchIndex;searchIndex=function(){return prev().concat(
 MH2.events.map(ev=>({kind:'فعالية',title:ev.title,sub:`${arDate(ev.date)} · ${ev.org.join('، ')}`,go:['activities','event',ev.id],text:ev.title+ev.org.join('')+ev.about})),
 MH2.courses.map(c=>({kind:'دورة',title:c.ar,sub:c.title,go:['training','course',c.id],text:c.ar+c.title+c.trainer})),
 MH2.services.map(s=>({kind:'خدمة',title:s.name,sub:s.provider,go:['services','service',s.id],text:s.name+s.about})),
 MH2.faq.map(f=>({kind:'سؤال شائع',title:f.q,sub:'المساعدة',go:['services','help'],text:f.q+f.a.join('')})),
 achievements().map(a=>({kind:'إنجاز',title:a.title,sub:a.org,go:['portfolio','item',a.id],text:a.title+a.org})));};}
window.mhExtraNotes=()=>[
 {id:'n7',icon:'timer',text:'توفر لك مقعد في ورشة الخياطة الجراحية؛ اقبل قبل 5 نوفمبر 6 م.',when:'2026-11-03',go:['training','home']},
 {id:'n8',icon:'flag',text:'عرض مقعد في ندوة أخلاقيات الممارسة الطبية.',when:'2026-11-03',go:['activities','regs']},
 {id:'n9',icon:'inbox',text:'فريق الدعم ينتظر ردك على الطلب MHS-1021.',when:'2026-11-02',go:['services','ticket','MHS-1021']},
 {id:'n10',icon:'checkCircle',text:'اعتُمدت ساعاتك التطوعية في حملة التبرع بالدم.',when:'2026-10-25',go:['portfolio','item','a-2']}];
