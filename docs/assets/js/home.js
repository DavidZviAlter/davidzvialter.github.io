{
  const track=document.getElementById("workTrack"),cards=[...track.children],tabs=[...document.querySelectorAll('.work-tabs button')];
  const prev=document.getElementById('workPrev'),next=document.getElementById('workNext'),counter=document.getElementById('workCount');
  let cur=0;
  const go=i=>{i=Math.max(0,Math.min(cards.length-1,i));track.scrollTo({left:cards[i].offsetLeft-track.offsetLeft,behavior:window.DA.reduce?'auto':'smooth'})};
  const set=i=>{cur=i;counter.textContent=`${i+1} / ${cards.length}`;cards.forEach((c,j)=>{c.classList.toggle('current',j===i)});tabs.forEach((t,j)=>t.setAttribute('aria-selected',j===i));prev.disabled=i===0;next.disabled=i===cards.length-1};
  prev.addEventListener('click',()=>go(cur-1));next.addEventListener('click',()=>go(cur+1));
  tabs.forEach((t,i)=>t.addEventListener('click',()=>go(i)));
  track.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();go(cur+1)}if(e.key==='ArrowLeft'){e.preventDefault();go(cur-1)}});
  let raf;track.addEventListener('scroll',()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{const x=track.scrollLeft;let best=0,d=1e9;cards.forEach((c,j)=>{const dd=Math.abs(c.offsetLeft-track.offsetLeft-x);if(dd<d){d=dd;best=j}});if(best!==cur)set(best)})},{passive:true});
  cards.forEach((c,j)=>c.addEventListener('click',e=>{if(j!==cur){e.preventDefault();go(j)}}));
  set(0);
}
{
  const {aiData,esc}=window.DA;
  const short={everyday:'Everyday work',coding:'Coding',images:'Images',research:'Research'};
  const icons={
    everyday:'<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
    coding:'<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16"/>',
    images:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/>',
    research:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>'};
  /* the same product names the comparison tool's shortlist uses */
  const product={openai:'OpenAI',anthropic:'Claude',google:'Gemini',perplexity:'Perplexity'};
  const render=ai=>{
    document.getElementById('aiTiles').innerHTML=ai.tasks.map(t=>{
      const brand=[...new Set(t.leaders.map(r=>product[r.model.provider.toLowerCase()]||r.model.provider))].join(' / ')||'More evidence needed';
      const model=t.leaders.map(r=>r.model.name).join(' / ');
      return `<div class="ai-tile" data-task="${esc(t.id)}">
        <div class="ai-task"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[t.id]||''}</svg>${short[t.id]||esc(t.name)}</div>
        <div class="ai-lead"><span class="ai-brand">${esc(brand)}</span>${t.leaders.length?`<span class="ai-rank">${t.leaders.length>1?'Joint #1':'#1'}</span>`:''}</div>
        <span class="ai-model">${esc(model)}</span>
        <span class="ai-free">Free: <b>${esc(t.free.length?t.free.join(' or '):'none documented')}</b></span>
      </div>`}).join('');
    document.getElementById('aiDates').textContent=`Benchmarks ${ai.dateOf(ai.benchTo)} · plans reviewed ${ai.dateOf(ai.planReview)}`;
  };
  const fail=()=>{document.getElementById('aiTiles').innerHTML='<p class="ai-wait">Open the project to see the comparison.</p>'};
  const card=document.querySelector('a.win[href="projects/ai-tool.html"]');
  const io=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){io.disconnect();aiData('ai-tool-comparison/').then(render,fail)}},{rootMargin:'600px'});
  io.observe(document.getElementById('workTrack'));
}
