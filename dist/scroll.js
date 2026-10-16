// Scroll choreography: native input, time-based visual damping, cached layout.
(()=>{
const sheet=document.querySelector('#motion-styles');
const work=document.querySelector('.work'),track=document.querySelector('.projects'),hero=document.querySelector('.hero');
const pin=document.createElement('div');pin.className='work-pin';while(work.firstChild)pin.append(work.firstChild);work.append(pin);
const meter=document.createElement('div');meter.className='work-meter';meter.innerHTML='<span>SCROLL TO EXPLORE</span><i><b></b></i><span class="work-count">01 / 04</span>';pin.append(meter);
const count=meter.querySelector('.work-count'),cards=[...track.children];
cards.forEach(card=>card.style.setProperty('--shot-ratio',1280/720));
const processPanel=document.querySelector('.process-panel'),processIntro=document.querySelector('.process-intro'),steps=[...document.querySelectorAll('.process-steps article')],processPin=document.createElement('div');processPin.className='process-pin';while(processPanel.firstChild)processPin.append(processPanel.firstChild);processPanel.append(processPin);
const sections=[...document.querySelectorAll('main>section,#about>.approach')];
const targets=[...document.querySelectorAll('.dimension-copy h2,.dimension-copy>p,.intelligence-map,.approach-grid>h2,.approach-grid>div,.skill-grid>div,.journey-grid>div:first-child,.timeline article,.certifications,.contact-main,.contact-email,.contact-base')];
targets.forEach((el,i)=>{el.classList.add('motion-item');el.classList.remove('scroll-shot');el.style.setProperty('--delay',i%4*.06+'s')});
cards.forEach(el=>el.classList.remove('scroll-shot'));
const timeline=document.querySelector('.timeline');let processTop=0,processHeight=1,cached=[],sectionCache=[],cardCache=[],timelineTop=0,timelineHeight=1,workTop=0,workTravel=1,trackTravel=0,heroHeight=1,pageHeight=1,vh=innerHeight,raf=0,last=0,visual=scrollY,dirty=true,paused=document.body.classList.contains('paused'),desktop=false,processAnimated=true,lastInput=scrollY,scrollDirection=0;
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
// Only commit changed values. Settled and off-screen chapters do no DOM work.
const painted=new WeakMap(),round=value=>Math.round(value*1000)/1000;
function paint(el,key,value){let state=painted.get(el);if(!state){state={};painted.set(el,state)}value=String(value);if(state[key]===value)return;state[key]=value;el.style.setProperty(key,value)}
function measure(){vh=innerHeight;desktop=innerWidth>=900&&!paused;processAnimated=!paused&&!(innerWidth<900&&vh<=480);document.body.classList.toggle('cinematic',desktop);document.body.classList.toggle('process-motion',processAnimated);const y=scrollY;
 cached=targets.map(el=>({el,top:el.getBoundingClientRect().top+y-(new DOMMatrixReadOnly(getComputedStyle(el).transform)).m42,height:el.offsetHeight,exits:el.matches('.approach-grid>h2')}));
 processTop=processPanel.getBoundingClientRect().top+y;processHeight=processPanel.offsetHeight;
 sectionCache=sections.map(el=>({el,top:el.getBoundingClientRect().top+y,height:el.offsetHeight}));
 cardCache=cards.map(el=>({el,top:el.getBoundingClientRect().top+y-(new DOMMatrixReadOnly(getComputedStyle(el).transform)).m42}));timelineTop=timeline.getBoundingClientRect().top+y;timelineHeight=timeline.offsetHeight;
 workTop=work.getBoundingClientRect().top+y;workTravel=Math.max(1,work.offsetHeight-vh);trackTravel=Math.max(0,track.scrollWidth-track.clientWidth);heroHeight=hero.offsetHeight;pageHeight=document.documentElement.scrollHeight;dirty=false;}
function draw(now){raf=0;if(document.hidden)return;if(dirty)measure();const dt=Math.min(64,now-(last||now-16));last=now;const actual=scrollY;visual+= (actual-visual)*(1-Math.exp(-dt/190));if(Math.abs(actual-visual)<.1)visual=actual;
 const y=paused?actual:visual,hp=clamp(y/heroHeight),delta=actual-lastInput;if(Math.abs(delta)>.25)scrollDirection=delta<0?-1:1;lastInput=actual;hero.classList.toggle('scroll-return',scrollDirection<0);paint(hero,'--hero-y',paused?'0px':round(hp*65)+'px');paint(hero,'--name-y',paused?'0px':round(hp*-30)+'px');paint(hero,'--hero-scale',paused?1:round(1+hp*.055));paint(hero,'--hero-opacity',paused?1:round(1-hp*.5));
 const atEnd=actual+vh>=pageHeight-3;
 cached.forEach(({el,top,height,exits})=>{const p=paused||atEnd?1:clamp((y+vh*.96-top)/(vh*(desktop?.45:.36)));const ease=p*p*(3-2*p);const exit=paused?0:exits?clamp((y-top-height*.45)/(vh*.4)):0;paint(el,'opacity',round(((desktop?.16:.35)+ease*(desktop?.84:.65))*(1-exit)));paint(el,'transform','translate3d(0,'+round((1-ease)*(desktop?30:22))+'px,0)');});
 paint(processIntro,'opacity',1);
 const pp=clamp((y-processTop)/Math.max(1,processHeight-vh)),phase=pp*3,current=Math.min(2,Math.floor(phase)),fraction=phase-current,out=clamp((fraction-.38)/.58),incoming=clamp((fraction-.58)/.42),fadeOut=out*out*(3-2*out),fadeIn=incoming*incoming*(3-2*incoming),travel=Math.min(180,vh*.22);
 steps.forEach((step,i)=>{const opacity=!processAnimated?1:i===current?(current===2?1:1-fadeOut):i===current+1?fadeIn:0,shift=!processAnimated?0:i===current?(current===2?0:-fadeOut*travel):i===current+1?(1-fadeIn)*travel:travel;paint(step,'--step-shift',round(shift)+'px');paint(step,'opacity',round(opacity));paint(step,'visibility',opacity>.001?'visible':'hidden');paint(step,'pointer-events',opacity>.5?'auto':'none');const hidden=opacity<.5?'true':'false';if(step.getAttribute('aria-hidden')!==hidden)step.setAttribute('aria-hidden',hidden)});
 sectionCache.forEach(({el,top,height})=>{const p=clamp((y+vh-top)/(vh+height));paint(el,'--chapter',round(p));paint(el,'--drift',paused?'0px':round((p-.5)*32)+'px');});
 const wp=desktop?clamp(((y-workTop)/workTravel-.045)/.90):0;
 paint(track,'transform',desktop?'translate3d('+round(-wp*trackTravel)+'px,0,0)':'none');
 paint(meter.querySelector('b'),'transform','scaleX('+round(wp)+')');const index=Math.min(3,Math.round(wp*3)),label='0'+(index+1)+' / 04';if(count.textContent!==label)count.textContent=label;
 cards.forEach((card,i)=>{const focus=desktop?1-clamp(Math.abs(wp*3-i)):1;paint(card,'--focus',round(focus))});
 cardCache.forEach(({el,top})=>{const p=desktop||paused?1:clamp((y+vh-top)/(vh*.28));paint(el,'opacity',round(.35+.65*p));paint(el,'--mobile-rise',round((1-p)*24)+'px')});
 paint(timeline,'--timeline-fill',paused?1:round(clamp((y+vh*.8-timelineTop)/timelineHeight)));
 window.dispatchEvent(new CustomEvent('portfolio-scroll',{detail:{dimension:clamp((y+vh-(sectionCache[1]?.top||0))/(vh+(sectionCache[1]?.height||1)))}}));
 if(Math.abs(actual-visual)>.1)raf=requestAnimationFrame(draw);}
function queue(){if(!raf){last=performance.now();raf=requestAnimationFrame(draw)}}
addEventListener('scroll',queue,{passive:true});addEventListener('resize',()=>{dirty=true;queue()},{passive:true});addEventListener('motionchange',e=>{paused=e.detail.paused;dirty=true;queue()});
document.addEventListener('visibilitychange',()=>{if(!document.hidden){visual=scrollY;queue()}});
// Only the eyelids animate; portrait geometry stays fixed for scroll and pointer input.
const portrait=hero.querySelector('.hero-composition'),blink=portrait.cloneNode(false);blink.classList.add('hero-blink');blink.src='assets/hero-eyes-closed.webp';blink.alt='';blink.setAttribute('aria-hidden','true');portrait.after(blink);
let blinkTimer=0,heroVisible=true;
function scheduleBlink(){clearTimeout(blinkTimer);if(paused||document.hidden||!heroVisible)return;blinkTimer=setTimeout(()=>{blink.animate([{opacity:0},{opacity:1,offset:.40},{opacity:1,offset:.52},{opacity:0}],{duration:310+Math.random()*50,easing:'cubic-bezier(.37,0,.45,1)'});scheduleBlink()},3800+Math.random()*2700)}
new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;hero.classList.toggle('is-offscreen',!heroVisible);scheduleBlink()}).observe(hero);
document.addEventListener('visibilitychange',scheduleBlink);addEventListener('motionchange',scheduleBlink);blink.addEventListener('load',scheduleBlink);

// Reveal colour locally without moving or replacing the portrait.
portrait.classList.add('hero-portrait-base');
const colour=portrait.cloneNode(false);colour.className='hero-composition hero-colour';colour.src='assets/hero-portrait-white-shirt.webp';colour.alt='';colour.setAttribute('aria-hidden','true');blink.before(colour);
let colourFrame=0,lastColourPointer=null;
function hideColour(){colour.classList.remove('is-revealed')}
function revealColour(clientX,clientY){const r=portrait.getBoundingClientRect(),x=clientX-r.left,y=clientY-r.top;if(x<0||x>r.width||y<0||y>r.height){hideColour();return}colour.style.setProperty('--colour-x',x+'px');colour.style.setProperty('--colour-y',y+'px');colour.style.setProperty('--colour-radius',Math.max(65,Math.min(115,r.width*.07))+'px');if(colour.complete&&colour.naturalWidth)colour.classList.add('is-revealed')}
hero.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;lastColourPointer={x:e.clientX,y:e.clientY};if(!colourFrame)colourFrame=requestAnimationFrame(()=>{colourFrame=0;revealColour(lastColourPointer.x,lastColourPointer.y)})},{passive:true});
hero.addEventListener('pointerleave',()=>{lastColourPointer=null;hideColour()});hero.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'&&!e.target.closest('a'))revealColour(e.clientX,e.clientY)},{passive:true});hero.addEventListener('pointerup',e=>{if(e.pointerType==='touch')hideColour()},{passive:true});hero.addEventListener('pointercancel',hideColour);addEventListener('scroll',hideColour,{passive:true});addEventListener('resize',hideColour,{passive:true});
colour.addEventListener('load',()=>{if(lastColourPointer)revealColour(lastColourPointer.x,lastColourPointer.y)});
const colourControl=hero.querySelector('.portrait-stage');colourControl.removeAttribute('aria-hidden');colourControl.tabIndex=0;colourControl.setAttribute('role','button');colourControl.setAttribute('aria-label','Preview portrait colour');
function focusColour(){const r=portrait.getBoundingClientRect();revealColour(r.left+r.width*.495,r.top+r.height*.39)}
colourControl.addEventListener('focus',focusColour);colourControl.addEventListener('blur',()=>{if(lastColourPointer)revealColour(lastColourPointer.x,lastColourPointer.y);else hideColour()});colourControl.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();focusColour()}});
document.addEventListener('focusin',e=>{const card=e.target.closest('.project');if(!card||!desktop)return;const i=cards.indexOf(card);window.scrollTo({top:workTop+workTravel*(.045+.90*i/3),behavior:paused?'instant':'smooth'})});
sheet.addEventListener('load',()=>{dirty=true;queue()});document.fonts.ready.then(()=>{dirty=true;queue()});addEventListener('load',()=>{dirty=true;queue()});measure();queue();
})();

