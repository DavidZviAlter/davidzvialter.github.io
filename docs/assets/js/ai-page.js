{
const {reduce}=window.DA;
const {aiData,featureName,badge,esc}=window.DA;
const $=id=>document.getElementById(id);
let AI=null;
function show(t){
  if(!AI)return;
  const d=AI.tasks.find(x=>x.id===t);
  $('bLeader').textContent=d.leaders.map(r=>r.model.name).join(' / ')||'More evidence needed';
  $('bWho').textContent=d.leaderBrand+(d.leaders.length?' · score '+d.leaders[0].score.toFixed(1)+' / 100':'');
  $('bTop').innerHTML=d.top.map((r,i)=>`<li><span>${i+1}</span><span>${esc(r.model.name)}</span><b class="num">${r.score.toFixed(1)}</b></li>`).join('');
  $('bOv').textContent=d.overlap?'The top results overlap within their confidence intervals: treat them as close.':'';
  $('fName').textContent=d.free.length?d.free.join(' or ')+' Free':'None documented';
  $('fWho').textContent=d.freeTied?'Tied on features for this task':'Most features included for this task';
  $('fRows').innerHTML=d.features.map((f,i)=>`<li><span>${i+1}</span><span>${esc(featureName[f.id]||f.id)}</span>${badge(f.status)}</li>`).join('');
  $('fNote').textContent='Chosen by documented access to these features. Access, not quality.';
  $('bDate').textContent='Leaderboard published '+AI.dateOf(d.published);
  $('board').dataset.task=t;
}
aiData('../ai-tool-comparison/').then(ai=>{
  AI=ai;
  $('fCov').textContent=`${ai.products} products · ${ai.plans} plans`;
  $('fModels').textContent=ai.models;
  $('fBench').textContent=ai.benchFrom===ai.benchTo?ai.dateOf(ai.benchTo):`${ai.dateOf(ai.benchFrom).replace(/ \d{4}$/,'')} – ${ai.dateOf(ai.benchTo)}`;
  $('fPlans').textContent=ai.dateOf(ai.planReview);
  show(document.querySelector('.board-tabs button[aria-pressed=true]').dataset.t);
},()=>{$('bLeader').textContent='Open the comparison tool';$('bWho').textContent='The live data could not be loaded here.'});
const btns=[...document.querySelectorAll('.board-tabs button')],body=$('boardBody');
btns.forEach(b=>b.addEventListener('click',()=>{
  btns.forEach(x=>x.setAttribute('aria-pressed',x===b));
  if(reduce){show(b.dataset.t);return}
  body.classList.add('fade');setTimeout(()=>{show(b.dataset.t);body.classList.remove('fade')},180);
}));
}
