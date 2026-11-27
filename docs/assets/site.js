document.documentElement.classList.add('js');
window.DA=(()=>{
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

  // mobile menu
  const btn=document.querySelector('.menu-btn'),sheet=document.getElementById('sheet');
  const setMenu=o=>{sheet.classList.toggle('open',o);btn.setAttribute('aria-expanded',o);btn.setAttribute('aria-label',o?'Close menu':'Open menu');document.body.style.overflow=o?'hidden':''};
  if(btn&&sheet){
    btn.addEventListener('click',()=>setMenu(!sheet.classList.contains('open')));
    sheet.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
    addEventListener('keydown',e=>{if(e.key==='Escape'&&sheet.classList.contains('open'))setMenu(false)});
  }

  // count a figure up to its value
  function count(el,to,suffix='',dur=1100,dec=1,prefix=''){
    const out=v=>prefix+v.toFixed(dec)+suffix;
    if(reduce){el.textContent=out(to);return}
    const t0=performance.now();
    const step=t=>{const p=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-p,4);el.textContent=out(to*e);if(p<1)requestAnimationFrame(step)};
    requestAnimationFrame(step);
  }

  // .armed blocks fill their bars and count [data-count] when first seen
  const io=new IntersectionObserver(es=>es.forEach(e=>{
    if(!e.isIntersecting)return;
    io.unobserve(e.target);
    const go=()=>{e.target.classList.add('go');e.target.querySelectorAll('[data-count]').forEach(n=>count(n,+n.dataset.count,n.dataset.suffix??'%',1300,+(n.dataset.dec??1),n.dataset.prefix??''))};
    reduce?go():setTimeout(go,+(e.target.dataset.delay||150));
  }),{threshold:.35});
  document.querySelectorAll('.armed').forEach(n=>io.observe(n));

  // slide viewer: native scroll-snap deck with buttons, thumbnails and arrow keys
  function deck({root,n,src,title,w=1921,h=1080}){
    const d=root.querySelector('.deck'),th=root.querySelector('.thumbs'),ctr=root.querySelector('.counter');
    d.innerHTML=Array.from({length:n},(_,i)=>`<figure aria-label="Slide ${i+1} of ${n}"><img src="${src(i+1)}" alt="Slide ${i+1} of ${title}" width="${w}" height="${h}" ${i>1?'loading="lazy"':''}></figure>`).join('');
    th.innerHTML=Array.from({length:n},(_,i)=>`<button type="button" aria-label="Slide ${i+1}" aria-current="${i===0}"><img src="${src(i+1)}" alt="" loading="lazy"></button>`).join('');
    const slides=[...d.children],tb=[...th.children];let cur=0;
    const go=i=>{i=Math.max(0,Math.min(n-1,i));d.scrollTo({left:slides[i].offsetLeft-d.offsetLeft,behavior:reduce?'auto':'smooth'})};
    const set=i=>{cur=i;ctr.textContent=`${i+1} / ${n}`;tb.forEach((b,j)=>b.setAttribute('aria-current',j===i));const b=tb[i];th.scrollTo({left:b.offsetLeft-th.offsetLeft-th.clientWidth/2+b.clientWidth/2,behavior:reduce?'auto':'smooth'})};
    root.querySelector('.d-prev').addEventListener('click',()=>go(cur-1));
    root.querySelector('.d-next').addEventListener('click',()=>go(cur+1));
    tb.forEach((b,i)=>b.addEventListener('click',()=>go(i)));
    d.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();go(cur+1)}if(e.key==='ArrowLeft'){e.preventDefault();go(cur-1)}});
    let raf;d.addEventListener('scroll',()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{const i=Math.round(d.scrollLeft/d.clientWidth);if(i!==cur&&i>=0&&i<n)set(i)})},{passive:true});
  }

  // presentation dialog: builds the deck on first open
  function deckDialog({button,dialog,opts}){
    let built=false;
    const open=()=>{if(!built){deck({...opts,root:dialog.querySelector('.viewer')});built=true}dialog.showModal();dialog.querySelector('.deck').focus()};
    [].concat(button).forEach(b=>b.addEventListener('click',open));
    dialog.querySelector('.dlg-close').addEventListener('click',()=>dialog.close());
    dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
  }

  // AI tool data: loads the tool's own data.js and summary.js, so every preview
  // is calculated by the same functions the comparison tool uses.
  let aiPromise=null;
  function aiData(base){
    if(aiPromise)return aiPromise;
    const load=src=>new Promise((ok,fail)=>{const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=()=>fail(new Error('Could not load '+src));document.head.append(s)});
    aiPromise=load(base+'data.js').then(()=>load(base+'summary.js')).then(()=>{
      const d=window.YEDAVIO_DATA;
      const brand={openai:'OpenAI',anthropic:'Anthropic',google:'Google',perplexity:'Perplexity'};
      const product=id=>d.products.find(p=>p.id===id);
      const dateOf=iso=>new Date(iso+'T00:00:00Z').toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'});
      // full ranking with the exact formula categoryLeaders uses (its top entries are the leaders)
      const ranking=task=>{
        const groups=d.evidence.category_groups[task]||[],w=d.model_comparison.weights,total=groups.reduce((n,g)=>n+w[g],0);
        return d.model_comparison.models.filter(m=>groups.length&&groups.every(g=>Number.isFinite(m.scores[g]?.percentile)))
          .map(model=>({model,score:groups.reduce((n,g)=>n+model.scores[g].percentile*w[g],0)/total})).sort((a,b)=>b.score-a.score);
      };
      const tasks=d.categories.map(c=>{
        const leaders=categoryLeaders(d,c.id),free=freeSuggestions(d,c.id),groups=d.evidence.category_groups[c.id]||[];
        const ev=d.evidence.groups.filter(g=>groups.includes(g.id));
        const features=c.features.map(f=>{const st=[...new Set(free.map(r=>r.plan.capabilities[f]?.status||'unknown'))];return {id:f,status:st.length===1?st[0]:'varies'}});
        return {id:c.id,name:c.name.en,leaders,top:ranking(c.id).slice(0,3),
          leaderBrand:[...new Set(leaders.map(r=>brand[r.model.provider.toLowerCase()]||r.model.provider))].join(', '),
          free:free.map(r=>product(r.plan.product_id).name),freeTied:free.length>1,features,
          overlap:ev.some(g=>g.top_interval_overlaps),published:ev.map(g=>g.published_on).sort().pop()};
      });
      const dates=d.evidence.groups.map(g=>g.published_on).sort();
      return {d,tasks,dateOf,products:d.products.length,plans:d.plans.length,models:d.model_comparison.models.length,
        benchFrom:dates[0],benchTo:dates[dates.length-1],planReview:d.reviewed_on};
    });
    return aiPromise;
  }
  const featureName={file_uploads:'File uploads',coding_workspace:'Coding workspace',image_generation:'Image generation',image_editing:'Image editing',research_mode:'Research mode'};
  const statusWord={available:'Included',limited:'Limited',not_included:'Not included',unknown:'Unknown',varies:'Varies by plan'};
  const statusClass={available:'ok',limited:'lim',not_included:'no',unknown:'unk',varies:'unk'};
  const statusIcon={ok:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5L20 7"/></svg>',
    lim:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 8v5M12 16.5v.5"/><circle cx="12" cy="12" r="9"/></svg>',
    no:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    unk:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5M12 16.5v.5"/></svg>'};
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function badge(status){const k=statusClass[status]||'unk';return `<span class="badge ${k}">${statusIcon[k]}${statusWord[status]||esc(status)}</span>`}

  return {reduce,count,deck,deckDialog,aiData,featureName,badge,esc};
})();
