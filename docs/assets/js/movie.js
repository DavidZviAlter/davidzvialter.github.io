{
const {reduce,count}=window.DA;

/* recorded presentation: the Google player loads only on play */
{
  const dlg=document.getElementById('videoDlg'),box=document.getElementById('videoBox');
  const stop=()=>{const f=box.querySelector('iframe');if(f){f.remove();document.getElementById('videoPlay').hidden=false}};
  document.getElementById('videoOpen').addEventListener('click',()=>dlg.showModal());
  dlg.querySelector('.dlg-close').addEventListener('click',()=>dlg.close());
  dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});
  dlg.addEventListener('close',stop);
  document.getElementById('videoPlay').addEventListener('click',e=>{
    const f=document.createElement('iframe');
    f.src='https://drive.google.com/file/d/1Z4xiTkKxc28MgvfqtZTwG4dOG2NbIrb8/preview';
    f.title='Investing in Movies, recorded presentation';
    f.setAttribute('sandbox','allow-scripts allow-same-origin allow-presentation');
    f.referrerPolicy='no-referrer';f.allow='fullscreen; autoplay';f.allowFullscreen=true;
    e.currentTarget.hidden=true;box.append(f);f.focus();
  });
}
/* slide viewer */
window.DA.deckDialog({button:[document.getElementById('deckOpen'),document.getElementById('deckOpen2')],dialog:document.getElementById('deckDlg'),opts:{n:23,src:i=>`../assets/movie/slide-${i}.webp`,title:'the Investing in Movies presentation'}});

/* genre scatter */
const G=[["Drama",126.7,742.9,"var(--drama)"],["Comedy",76.6,234.2,"var(--comedy)"],["Biography",68.7,238.0],["Adventure",29.1,121.9],["Action",9.2,112.1],["Crime",6.9,116.2]];
document.getElementById('genreRows').innerHTML=G.map(g=>`<tr><th>${g[0]}</th><td class="r num">${g[1].toFixed(1)}%</td><td class="r num">${g[2].toFixed(1)} pp</td></tr>`).join('');
const fig=document.getElementById('scatter'),svg=document.getElementById('scatterSvg'),tip=document.getElementById('tip');
function drawScatter(){
  const W=fig.clientWidth,H=fig.clientHeight,small=W<420;
  const m={l:small?40:52,r:small?14:24,t:14,b:42};
  const x=v=>m.l+(v/800)*(W-m.l-m.r),y=v=>H-m.b-(v/150)*(H-m.t-m.b);
  const xt=small?[0,400,800]:[0,200,400,600,800],yt=[0,50,100,150];
  let s='';
  yt.forEach(t=>s+=`<line x1="${m.l}" x2="${W-m.r}" y1="${y(t)}" y2="${y(t)}" stroke="#1f1f1f"/><text x="${m.l-10}" y="${y(t)+4}" class="m" fill="#8f8f8f" font-size="11" text-anchor="end">${t}%</text>`);
  xt.forEach(t=>s+=`<text x="${x(t)}" y="${H-m.b+20}" class="m" fill="#8f8f8f" font-size="11" text-anchor="middle">${t}</text>`);
  s+=`<text x="${W-m.r}" y="${H-4}" fill="#a1a1a1" font-size="12" text-anchor="end">Volatility, pp →</text>`;
  s+=`<text x="${m.l}" y="${m.t-2}" fill="#a1a1a1" font-size="12" dy="-2">Average ROI ↑</text>`;
  const P={Drama:['end',-12,4],Comedy:['start',12,4],Biography:['start',10,14],Adventure:['start',10,4],Action:['end',-10,-2],Crime:['start',10,12]};
  G.forEach((g,i)=>{
    const cx=x(g[2]),cy=y(g[1]),c=g[3]||'#5c5c5c',lab=g[3]||W>=360,[an,dx,dy]=P[g[0]];
    s+=`<g class="pt" data-i="${i}" tabindex="0" role="img" aria-label="${g[0]}: ${g[1]}% average ROI, ${g[2]} pp volatility"><circle cx="${cx}" cy="${cy}" r="18" fill="transparent"/><circle cx="${cx}" cy="${cy}" r="${g[3]?7:5}" fill="${c}" stroke="#0a0a0a" stroke-width="2"/>${lab?`<text x="${cx+dx}" y="${cy+dy}" fill="${g[3]?'#ededed':'#a1a1a1'}" font-size="12" text-anchor="${an}">${g[0]}</text>`:''}</g>`;
  });
  svg.innerHTML=s;
  svg.querySelectorAll('.pt').forEach(p=>{
    const show=()=>{const g=G[p.dataset.i];tip.innerHTML=`<b style="font-weight:500">${g[0]}</b><br><span class="num">${g[1].toFixed(1)}% ROI · ${g[2].toFixed(1)} pp</span>`;const c=p.querySelector('circle');let l=+c.getAttribute('cx')+14,t=+c.getAttribute('cy')-48;tip.style.opacity=1;const tw=tip.offsetWidth;if(l+tw>W)l=+c.getAttribute('cx')-tw-14;tip.style.left=l+'px';tip.style.top=Math.max(0,t)+'px'};
    const hide=()=>tip.style.opacity=0;
    p.addEventListener('pointerenter',show);p.addEventListener('pointerleave',hide);p.addEventListener('focus',show);p.addEventListener('blur',hide);
  });
}
const sro=new ResizeObserver(drawScatter);sro.observe(fig);

/* scroll moment */
const moment=document.querySelector('.moment'),pin=document.querySelector('.moment-pin');
const bars=[...moment.querySelectorAll('[data-bar]')],vals=[...moment.querySelectorAll('.hb b')],steps=[...moment.querySelectorAll('#steps li')],verdict=document.getElementById('verdict');
const pinned=()=>getComputedStyle(pin).position==='sticky';
let counted=[false,false];
function stage(s,p){
  bars.forEach(b=>{const g=+b.dataset.bar;b.style.setProperty('--p',(g<s?1:g===s?p:0).toFixed(3))});
  vals.forEach((v,i)=>{const g=i<2?0:1;v.style.opacity=g<=s?1:.6;if(g<=s&&!counted[g]&&(g<s||p>.6)){counted[g]=true;vals.slice(g*2,g*2+2).forEach(x=>count(x,+x.dataset.to,x.dataset.suffix,900))}});
  steps.forEach((li,i)=>li.classList.toggle('on',i<=s));
  verdict.style.setProperty('--v',s>=2?1:0);verdict.style.visibility=s>=2?'visible':'hidden';
}
if(reduce){stage(2,1)}
else if(!pinned()){
  stage(2,1);
  const vio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){vio.unobserve(e.target);count(e.target,+e.target.dataset.to,e.target.dataset.suffix,1000)}}),{threshold:.6});
  vals.forEach(v=>{v.textContent='0.0'+v.dataset.suffix;vio.observe(v)});
}else{
  stage(0,0);vals.forEach(v=>v.textContent='0.0'+v.dataset.suffix);
  const onScroll=()=>{
    if(!pinned()){stage(2,1);return}
    const r=moment.getBoundingClientRect(),total=moment.offsetHeight-innerHeight,p=Math.min(1,Math.max(0,-r.top/total));
    const s=p<.38?0:p<.72?1:2,local=s===0?p/.38:s===1?(p-.38)/.34:1;
    stage(s,Math.min(1,local*1.6));
  };
  addEventListener('scroll',onScroll,{passive:true});onScroll();
}

/* strategy explorer */
const S={
  comedy:{title:'Prioritising return relative to risk.',desc:'Comedy anchors the conservative strategy because its returns varied less than drama’s. Within comedy, I compared options by average ROI divided by its standard deviation.',color:'var(--comedy)',
    budgets:[['Low budget',115.3],['Medium budget',73.5],['High budget',28.3],['Blockbuster',-79.3]],
    actor:'Steve Carell',actorNote:'2.32 average ROI over standard deviation, across 3 films. Joseph Gordon-Levitt had the higher average (461.6% against 432.9%), but Carell’s lower variability gave the stronger ratio.',
    dir:'Seth Gordon',dirNote:'1.54 average ROI over standard deviation, across 3 films.'},
  drama:{title:'Pursuing higher returns.',desc:'Drama had the higher average ROI with much larger variation. A few exceptional films can move this result a long way.',color:'var(--drama)',
    budgets:[['Low budget',307.1],['Medium budget',47.5],['High budget',-8.9],['Blockbuster',-34.0]],
    actor:'Ryan Gosling',actorNote:'229.96% average ROI with a 53.94 pp standard deviation, across 3 films. High returns with a more consistent record.',
    dir:'Alex Kendrick',dirNote:'Very high average return and volatility, across 3 films.'}
};
const lo=-100,hi=350,pos=v=>(v-lo)/(hi-lo)*100,z=pos(0);
const budRows=document.getElementById('budRows');
budRows.innerHTML=S.comedy.budgets.map(b=>`<div class="bud"><span>${b[0]}</span><div class="lane"><i class="zero" style="left:${z}%"></i><span></span></div><b class="num"></b></div>`).join('');
const bRows=[...budRows.children];
function setStrategy(k){
  const d=S[k];
  document.getElementById('exTitle').textContent=d.title;
  document.getElementById('exDesc').textContent=d.desc;
  d.budgets.forEach((b,i)=>{const v=b[1],sp=bRows[i].querySelector('.lane span'),from=Math.min(z,pos(v)),w=Math.abs(pos(v)-z);sp.style.left=from+'%';sp.style.width=w+'%';sp.style.background=v<0?'#5c5c5c':d.color;bRows[i].querySelector('b').textContent=(v>0?'+':'')+v.toFixed(1)+'%'});
  document.getElementById('exActor').textContent=d.actor;document.getElementById('exActorNote').textContent=d.actorNote;
  document.getElementById('exDir').textContent=d.dir;document.getElementById('exDirNote').textContent=d.dirNote;
}
const segBtns=[...document.querySelectorAll('.seg button')],swaps=[...document.querySelectorAll('.swap')];
segBtns.forEach(b=>b.addEventListener('click',()=>{
  if(b.getAttribute('aria-pressed')==='true')return;
  segBtns.forEach(x=>x.setAttribute('aria-pressed',x===b));
  if(reduce){setStrategy(b.dataset.s);return}
  document.getElementById('exPeople').classList.add('fade');
  setStrategy(b.dataset.s);
  setTimeout(()=>document.getElementById('exPeople').classList.remove('fade'),200);
}));
setStrategy('comedy');
}
