function action(){
 if(fishing.phase==="bite")return hook();if(fishing.phase==="fight")return;
 if(Math.hypot(P.x-20,P.y-17)<1.8)return seller();
 if(waterAhead())return startFishing();
 toast("Face Silas or stand at a water edge.")
}
function update(dt){
 if(battle||fishing.phase!=="idle"||!J.on)return;let nx=P.x+J.x*3.05*dt,ny=P.y+J.y*3.05*dt;
 if(!blocked(nx,P.y))P.x=nx;if(!blocked(P.x,ny))P.y=ny;
 if(Math.abs(J.x)>Math.abs(J.y)&&Math.abs(J.x)>.15)face={x:Math.sign(J.x),y:0};else if(Math.abs(J.y)>.15)face={x:0,y:Math.sign(J.y)}
}
function loop(t){let dt=Math.min(.035,(t-last)/1000||0);last=t;update(dt);updateFishing(dt);if(timing){timing.pos+=timing.dir*timing.speed*dt;if(timing.pos>=1){timing.pos=1;timing.dir=-1}else if(timing.pos<=0){timing.pos=0;timing.dir=1}E("needle").style.left=(timing.pos*100)+"%"}X.clearRect(0,0,W,H);renderWorld(t);drawPortraits();requestAnimationFrame(loop)}
const joy=E("joy"),knob=E("knob");
joy.addEventListener("pointerdown",e=>{e.preventDefault();J.on=true;J.id=e.pointerId;joy.setPointerCapture?.(e.pointerId)});
joy.addEventListener("pointermove",e=>{if(!J.on||e.pointerId!==J.id)return;let r=joy.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,dx=e.clientX-cx,dy=e.clientY-cy,l=Math.hypot(dx,dy),m=47;if(l>m){dx*=m/l;dy*=m/l}J.x=dx/m;J.y=dy/m;knob.style.transform="translate("+dx+"px,"+dy+"px)"});
function endJoy(){J.on=false;J.x=J.y=0;knob.style.transform="translate(0,0)"}joy.addEventListener("pointerup",endJoy);joy.addEventListener("pointercancel",endJoy);
E("act").addEventListener("pointerdown",e=>{e.preventDefault();if(fishing.phase==="fight")fishing.reel=true});
E("act").addEventListener("pointerup",e=>{e.preventDefault();if(fishing.phase==="fight")fishing.reel=false;else action()});
E("inv").onclick=inventory;E("battleA").addEventListener("pointerup",e=>{e.preventDefault();resolveTiming()});
function boot(e){if(e){e.preventDefault();e.stopPropagation()}if(started)return;started=true;E("boot").style.display="none";resize();hud();last=performance.now();requestAnimationFrame(loop)}
E("begin").addEventListener("pointerup",boot,{passive:false});E("begin").addEventListener("touchend",boot,{passive:false});E("begin").addEventListener("click",boot,{passive:false});
document.addEventListener("contextmenu",e=>e.preventDefault(),{passive:false});document.addEventListener("selectstart",e=>e.preventDefault(),{passive:false});
resize();hud();
