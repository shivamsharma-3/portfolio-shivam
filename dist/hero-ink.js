// Fine charcoal fragments drift across the hero.
const ink=document.querySelector('#hero-ink');
if(ink){
const context=ink.getContext('2d'),hero=document.querySelector('.hero');
let width=1,height=1,heroTop=0,raf=0,phase=0,lastFrame=0,visible=true,reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const motes=Array.from({length:90},(_,i)=>({x:Math.abs((Math.sin(i*91.17)*43758.54)%1),y:Math.abs((Math.sin(i*23.81)*17761.8)%1),r:1+(i%4)*.65}));
function draw(){
 context.clearRect(0,0,width,height);const scroll=Math.max(0,scrollY-heroTop)/height;
 for(const [i,m]of motes.entries()){
  const x=m.x*width+Math.sin(phase*.3+i)*9,y=m.y*height+Math.cos(phase*.2+i)*14-scroll*(i%2?25:-25);
  context.globalAlpha=.10+Math.abs(m.x-.5)*.24;context.fillStyle=i%3?'#61636a':'#20242a';context.beginPath();context.ellipse(x,y,m.r,m.r*.5,Math.sin(i),0,Math.PI*2);context.fill();
 }
 context.globalAlpha=1;
}
function resize(){const r=hero.getBoundingClientRect();width=r.width;height=r.height;heroTop=r.top+scrollY;const d=Math.min(devicePixelRatio,innerWidth<900?1.25:1.5);ink.width=Math.round(width*d);ink.height=Math.round(height*d);context.setTransform(d,0,0,d,0,0);draw()}
new ResizeObserver(resize).observe(hero);
function tick(now){raf=0;if(reduced||!visible||document.hidden)return;const elapsed=now-lastFrame;if(elapsed>=(innerWidth<900?32:15)){phase+=Math.min(elapsed||16,50)*.0009;lastFrame=now;draw()}raf=requestAnimationFrame(tick)}
function start(){if(!raf&&!reduced&&visible&&!document.hidden)raf=requestAnimationFrame(tick)}
new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible){cancelAnimationFrame(raf);raf=0}else start()}).observe(hero);
matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',e=>{reduced=e.matches;if(reduced){cancelAnimationFrame(raf);raf=0;draw()}else start()});
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0}else start()});resize();start();
}
