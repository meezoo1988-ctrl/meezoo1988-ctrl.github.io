'use strict';
// Supplemental dashboard uses a curated public snapshot, never credentials.
const intelligence=document.createElement('section');
intelligence.className='card';intelligence.style.marginTop='24px';
const heading=document.createElement('h2');heading.textContent='غرفة مراجعة الجلسة والتطوير';intelligence.append(heading);
const intro=document.createElement('p');intro.className='muted';intro.textContent='لقطة محفوظة • مراجعة السوق والنتائج • ذاكرة تجارب قابلة للاختبار';intelligence.append(intro);
const grid=document.createElement('div');grid.className='layout';intelligence.append(grid);
document.querySelector('footer').before(intelligence);
function panel(title){const div=document.createElement('div');div.className='card';const h=document.createElement('h2');h.textContent=title;div.append(h);grid.append(div);return div}
function line(root,text){const p=document.createElement('p');p.textContent=text;root.append(p)}
const survey=panel('آخر جلسة: أين صعد السوق وأين هبط؟');
const evolution=panel('CEO: قوة، ضعف، وتجارب تطوير');
const teamPanel=panel('فريق النماذج والتحليل');
const evidencePanel=panel('المدير مقابل التعلم الآلي والسوق');
fetch('dashboard.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error();return r.json()}).then(d=>{
 intro.textContent='آخر لقطة: '+d.generated_at+' • حالة المحفظة: '+d.shadow_state+' • لا اتصال مباشر بالوسيط';
 const review=d.review;
 line(survey,'جلسة '+review.session_date+' • '+review.coverage.received+' من '+review.coverage.requested+' صناديق مؤشرات وقطاعات. هذه عينة واسعة للسوق وليست جميع أسهمه.');
 for(const r of review.market.changes){const p=document.createElement('p');p.textContent=r.symbol+'  '+r.change_pct+'%';p.className=r.change_pct>=0?'good':'bad';survey.append(p)}
 const director=d.studies.find(s=>s.strategy==='director'),bench=d.studies.find(s=>s.strategy==='benchmark');
 line(evolution,'نقطة قوة تاريخية: تراجع المدير '+director.max_drawdown_pct+'% مقابل '+bench.max_drawdown_pct+'% للسلة.');
 line(evolution,'نقطة ضعف: عائد المدير '+director.net_return_pct+'% مقابل '+bench.net_return_pct+'% للسلة. هذه نتائج تاريخية، وليست أرباح اليوم.');
 const goals={execution_parity:'توحيد التنفيذ والمخاطر بين التاريخي والورقي',untouched_forward:'جمع جلسات ورقية مستقبلية جديدة',cost_robustness:'اختبار حساسية الرسوم وفروق الأسعار',diverse_universe:'اختبار أسهم جديدة وأحداث الشركات'};
 for(const e of review.experiments)line(evolution,(goals[e.id]||e.goal)+' — '+e.status);
 line(evolution,'التطوير التلقائي الحالي: مراجعة وتوثيق وقائمة تجارب؛ تعديل الاستراتيجية واعتمادها ليس تلقائيًا.');
 line(teamPanel,'حالة مراجعي LLM: '+review.ai_council.status+' • الردود الناجحة: '+review.ai_council.reviews.filter(r=>r.status==='REVIEWED').length);
 for(const r of d.roles)line(teamPanel,r.name_ar);
 line(teamPanel,'المدير الحالي سياسة مبرمجة. المصنف متدرّب. مراجعو LLM اختياريون وبالتوازي، ولا يملكون صلاحية تداول أو تغيير الكود.');
 const wrap=document.createElement('div');wrap.className='scroll';evidencePanel.append(wrap);const table=document.createElement('table');wrap.append(table);
 for(const s of d.studies){const tr=document.createElement('tr');for(const value of [s.strategy,'عائد '+s.net_return_pct+'%','تراجع '+s.max_drawdown_pct+'%',s.closed_trades+' صفقة مغلقة']){const td=document.createElement('td');td.textContent=value;tr.append(td)}table.append(tr)}
 line(evidencePanel,'240 جلسة خارج التدريب. اعتماد الأموال الحقيقية: مرفوض. اللقطة العامة لا تتزامن تلقائيًا مع تحديث التقارير الخاصة.');
}).catch(()=>line(survey,'تقرير المراجعة غير متاح؛ لا نعرض بيانات اصطناعية.'));
