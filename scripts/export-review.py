"""Export a self-contained review of all built portfolio routes."""
from pathlib import Path
from lxml import html
from io import BytesIO
from PIL import Image
import base64, hashlib, json, mimetypes, re, sys

SITE = Path(__file__).resolve().parents[1]
ROOT = Path(sys.argv[1]).resolve() if len(sys.argv)>1 else SITE.parent
BUILD = SITE/'dist/client'
def parse(s): return html.fromstring(s)
def serial(el): return html.tostring(el, encoding='unicode', method='html')
def cls(el,name): return el.xpath(".//*[contains(concat(' ',normalize-space(@class),' '),' "+name+" ')]")
def snapshot(path):
    doc=parse((BUILD/path).read_text())
    return {tag:parse(serial(doc.xpath('//'+tag)[0])) for tag in ['main','header','footer']}

home_snap=snapshot('index.html')
home=home_snap['main'];header=home_snap['header'];footer=home_snap['footer']
privacy=snapshot('privacy.html')['main'];privacy.set('id','privacy-main');privacy.set('hidden','hidden')
pages=[{'hash':'home','id':home.get('id'),'title':'David Alter | Data Analytics & BI'}]
roots=[home];decks=[]
for file in sorted((BUILD/'projects').glob('*.html')):
    slug=file.stem;page=snapshot('projects/'+file.name)['main']
    page.set('id','project-'+slug);page.set('hidden','hidden')
    title=' '.join(page.xpath('.//h1//text()')).strip().rstrip('.')
    pages.append({'hash':'project' if slug=='movie-investment' else 'project/'+slug,'id':page.get('id'),'title':title+' | David Alter'})
    roots.append(page)
    for contact in page.xpath('.//*[@id="contact"]'):contact.set('id',slug+'-contact')
    if slug=='movie-investment':
        for key,panel in zip(['comedy','drama'],page.xpath('.//*[@role="tabpanel"]')):
            panel.set('id','panel-'+key);panel.set('data-strategy',key);panel.set('aria-labelledby','tab-'+key)
            if key=='drama':panel.set('hidden','hidden');panel.set('data-state','inactive')
        for key,button in zip(['comedy','drama'],page.xpath('.//*[@role="tab"]')):
            button.set('id','tab-'+key);button.set('aria-controls','panel-'+key);button.set('data-strategy-select',key);button.set('tabindex','0' if key=='comedy' else '-1')
    for frame in cls(page,'slide-frame'):
        imgs=frame.xpath('.//img');titles=[im.get('alt') for im in imgs]
        if not titles:raise ValueError('Presentation has no slide images: '+slug)
        base=re.sub(r'/slide-\d+\.webp$','',imgs[0].get('src'))
        key='deck-'+str(len(decks));decks.append({'key':key,'base':base,'titles':titles})
        new=parse('<div class="slide-frame" role="region" tabindex="0"><img width="1600" height="900" alt=""><div class="slide-controls"><button type="button" data-slide-prev aria-label="Previous slide">←</button><span data-slide-count aria-live="polite"></span><button type="button" data-slide-enlarge>Enlarge slide ↗</button><button type="button" data-slide-next aria-label="Next slide">→</button></div></div>')
        new.set('data-review-deck',key);new.set('aria-label',frame.get('aria-label') or 'Project presentation')
        frame.getparent().replace(frame,new)
roots.append(privacy);pages.append({'hash':'privacy','id':'privacy-main','title':'Privacy | David Alter'})
assets={}
def asset(path):
    if path not in assets:
        full=SITE/'public'/path.lstrip('/');payload=full.read_bytes()
        if not payload:raise ValueError('Empty asset: '+path)
        mime=mimetypes.guess_type(str(full))[0] or 'application/octet-stream'
        if mime.startswith('image/'):
            with Image.open(BytesIO(payload)) as im:im.load()
        assets[path]={'mime':mime,'base64':base64.b64encode(payload).decode()}
    return path
for deck in decks:
    for number in range(1,len(deck['titles'])+1):asset(deck['base']+'/slide-'+str(number)+'.webp')
for root in roots+[header,footer]:
    for a in root.xpath('.//a[@href]'):
        href=a.get('href')
        if href.startswith('/files/'):
            a.set('data-asset',asset(href));a.set('href','#');a.set('download',Path(href).name)
        elif href.startswith('/projects/'):
            slug=href.split('/')[2];a.set('href','#project' if slug=='movie-investment' else '#project/'+slug)
        elif href.startswith('/privacy'):a.set('href','#privacy')
        elif href.startswith('/#'):a.set('href','#home-'+href[2:])
        elif href=='/':a.set('href','#home')
        elif href=='#main':a.set('href','#top')
        elif href=='#projects':a.set('href','#home-projects')
    for img in root.xpath('.//img[starts-with(@src,"/")]'):
        img.set('data-asset',asset(img.get('src')));img.attrib.pop('src')
    for script in root.xpath('.//script'):script.getparent().remove(script)
media=json.loads((SITE/'content/media.json').read_text())
build_home=parse((BUILD/'index.html').read_text())
css='\n'.join((BUILD/href.lstrip('/')).read_text() for href in build_home.xpath('//link[@rel="stylesheet"]/@href'))
extra='''[hidden]{display:none!important}.review-notice{padding:10px 20px;text-align:center;background:#173129;color:#c1e7dd;font-size:13px;line-height:1.6}.review-lightbox{padding:0;border:1px solid #3c575f;background:#091017;width:min(1200px,96vw);max-width:96vw;color:white;border-radius:8px}.review-lightbox::backdrop{background:#000d}.review-lightbox img{width:100%;display:block}.review-lightbox button{display:block;margin:10px 15px 10px auto;padding:8px 15px;border:1px solid #526773;border-radius:5px;cursor:pointer}button{cursor:pointer}'''
script='''const assets=ASSETS;const media=MEDIA;const decks=DECKS;const pages=PAGES;const urls={};
function assetURL(key){if(!urls[key]){const a=assets[key],b=atob(a.base64),bytes=new Uint8Array(b.length);for(let i=0;i<b.length;i++)bytes[i]=b.charCodeAt(i);urls[key]=URL.createObjectURL(new Blob([bytes],{type:a.mime}));}return urls[key];}
document.querySelectorAll('[data-asset]').forEach(el=>{if(el.tagName==='A')el.addEventListener('click',()=>el.href=assetURL(el.dataset.asset));else el.src=assetURL(el.dataset.asset);});
function route(){const hash=location.hash.slice(1);if(hash==='top'){window.scrollTo({top:0,behavior:'smooth'});return;}const page=pages.find(p=>p.hash===hash)||pages[0];pages.forEach(p=>document.getElementById(p.id).hidden=p!==page);document.title=page.title;if(hash.startsWith('home-'))document.getElementById(hash.slice(5))?.scrollIntoView();else window.scrollTo(0,0);}
window.addEventListener('hashchange',route);route();
const lightbox=document.getElementById('slide-dialog');lightbox.querySelector('button').onclick=()=>lightbox.close();
for(const deck of decks){const frame=document.querySelector('[data-review-deck="'+deck.key+'"]');let slide=0;function showSlide(n){slide=Math.max(0,Math.min(deck.titles.length-1,n));const img=frame.querySelector('img');img.src=assetURL(deck.base+'/slide-'+(slide+1)+'.webp');img.alt=deck.titles[slide];frame.querySelector('[data-slide-count]').textContent=(slide+1)+' / '+deck.titles.length;frame.querySelector('[data-slide-prev]').disabled=slide===0;frame.querySelector('[data-slide-next]').disabled=slide===deck.titles.length-1;}
frame.querySelector('[data-slide-prev]').onclick=()=>showSlide(slide-1);frame.querySelector('[data-slide-next]').onclick=()=>showSlide(slide+1);frame.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();showSlide(slide+(e.key==='ArrowRight'?1:-1));}});frame.querySelector('[data-slide-enlarge]').onclick=()=>{const img=lightbox.querySelector('img');img.src=assetURL(deck.base+'/slide-'+(slide+1)+'.webp');img.alt=deck.titles[slide];lightbox.showModal();};showSlide(0);}
function selectStrategy(key){document.querySelectorAll('[data-strategy-select]').forEach(b=>{const active=b.dataset.strategySelect===key;b.setAttribute('aria-selected',active);b.dataset.state=active?'active':'inactive';b.tabIndex=active?0:-1;});document.querySelectorAll('[data-strategy]').forEach(p=>{p.hidden=p.dataset.strategy!==key;p.dataset.state=p.hidden?'inactive':'active';});document.querySelectorAll('[data-actor-for]').forEach(p=>p.hidden=p.dataset.actorFor!==key);document.querySelector('.explorer').style.setProperty('--strategy-color',key==='comedy'?'#75e3c4':'#bda5fa');}
document.querySelectorAll('[data-strategy-select]').forEach(b=>{b.onclick=()=>selectStrategy(b.dataset.strategySelect);b.onkeydown=e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();const key=b.dataset.strategySelect==='comedy'?'drama':'comedy';selectStrategy(key);document.querySelector('[data-strategy-select="'+key+'"]').focus();}};});
const cover=document.querySelector('.video-cover');if(cover)cover.onclick=()=>{const iframe=document.createElement('iframe');iframe.className='embedded-video';iframe.src=media.videoEmbedSrc;iframe.title=media.videoTitle;iframe.allow='fullscreen; picture-in-picture';iframe.setAttribute('sandbox','allow-scripts allow-same-origin allow-presentation');iframe.referrerPolicy='no-referrer';iframe.allowFullscreen=true;cover.replaceWith(iframe);};
document.querySelectorAll('.genre-point').forEach(point=>{const readout=point.closest('.genre-plot').querySelector('.point-readout');if(readout){const show=()=>readout.textContent=point.getAttribute('aria-label');point.addEventListener('mouseenter',show);point.addEventListener('focus',show);}});
const featured=document.querySelector('[data-featured-carousel]');if(featured){const panels=[...featured.querySelectorAll('[data-featured-panel]')];let active=0;function moveFeatured(direction){active=(active+direction+panels.length)%panels.length;panels.forEach((panel,index)=>panel.hidden=index!==active);const position=featured.querySelector('[data-featured-position]');if(position)position.textContent=(active+1)+' / '+panels.length;}const previous=featured.querySelector('[data-featured-prev]'),next=featured.querySelector('[data-featured-next]');if(previous)previous.onclick=()=>moveFeatured(-1);if(next)next.onclick=()=>moveFeatured(1);featured.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();moveFeatured(e.key==='ArrowRight'?1:-1);}});}
const categorySelect=document.querySelector('[data-retail-select]');if(categorySelect)categorySelect.addEventListener('change',()=>document.querySelectorAll('[data-retail-panel]').forEach(panel=>panel.hidden=panel.dataset.retailPanel!==categorySelect.value));
'''
bindings={'ASSETS':assets,'MEDIA':media,'DECKS':decks,'PAGES':pages}
script=re.sub(r'\b(ASSETS|MEDIA|DECKS|PAGES)\b',lambda m:json.dumps(bindings[m.group(0)],separators=(',',':')),script).replace('</','<\\/')
csp="default-src 'none'; script-src 'sha256-"+base64.b64encode(hashlib.sha256(script.encode()).digest()).decode()+"'; script-src-attr 'none'; style-src 'unsafe-inline'; img-src data: blob:; frame-src https://drive.google.com; object-src 'none'; base-uri 'none'; form-action 'none'; connect-src 'none'; font-src 'none'; media-src blob:"
result='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="'+csp+'"><meta name="referrer" content="no-referrer"><meta name="viewport" content="width=device-width, initial-scale=1"><title>David Alter | Portfolio review</title><style>'+css+extra+'</style></head><body><div class="review-notice" dir="rtl">גרסת סקירה מעודכנת עם פרויקט SQL ו־Excel קבוצתי — טרם פורסם.</div><a class="skip-link" href="#top">Skip to content</a>'+serial(header)+''.join(serial(root) for root in roots)+serial(footer)+'<dialog id="slide-dialog" class="review-lightbox"><button type="button">Close ✕</button><img alt="Enlarged presentation slide"></dialog><script>'+script+'</script></body></html>'
ROOT.mkdir(exist_ok=True,parents=True);out=ROOT/'David-Alter-Portfolio-Review.html';out.write_text(result)
(ROOT/'inspection').mkdir(exist_ok=True);(ROOT/'inspection/review-script.js').write_text(script)
print(json.dumps({'file':str(out),'bytes':out.stat().st_size,'embedded_assets':len(assets),'presentations':[len(d['titles']) for d in decks],'pages':len(pages)}))
