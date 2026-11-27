{
const {deck}=window.DA;
window.DA.deckDialog({button:[document.getElementById('deckOpen'),document.getElementById('deckOpen2')],dialog:document.getElementById('deckDlg'),opts:{n:20,src:i=>`../assets/retail/slide-${i}.webp`,title:'the Customer Shopping Behavior and Promotion Effectiveness presentation',w:1537,h:864}});

const P={All:[59.279,1677,60.130,2223],Clothing:[59.752,731,60.224,1006],Footwear:[61.799,259,59.079,340],Outerwear:[55.319,144,58.656,180],Accessories:[58.490,543,60.890,697]};
const $=id=>document.getElementById(id);
const fmt=v=>'$'+v.toFixed(2);
function show(c){
  const [y,ny,n,nn]=P[c],d=(y/n-1)*100;
  $('vYes').textContent=fmt(y);$('vNo').textContent=fmt(n);
  $('bYes').style.width=(y/70*100)+'%';$('bNo').style.width=(n/70*100)+'%';
  $('nYes').textContent=ny.toLocaleString('en-US')+' purchases';$('nNo').textContent=nn.toLocaleString('en-US')+' purchases';
  $('vDiff').textContent=(d>0?'+':'')+d.toFixed(1)+'%';
}
const btns=[...document.querySelectorAll('.cats button')];
btns.forEach(b=>b.addEventListener('click',()=>{btns.forEach(x=>x.setAttribute('aria-pressed',x===b));show(b.dataset.c)}));
show('All');
}
