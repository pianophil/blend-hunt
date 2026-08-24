function renderWorld(t){
 cam.x=clamp(P.x*TS-W/2,0,MW*TS-W);cam.y=clamp(P.y*TS-H/2,0,MH*TS-H);
 for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){let sx=x*TS-cam.x,sy=y*TS-cam.y;LAND[y][x]?tileGround(sx,sy,x,y):tileWater(sx,sy,x,y,t)}
 const road=[[15,13,25,14],[17,14,21,20],[10,13,15,14],[25,13,31,14]];
 for(const r of road)for(let y=r[1];y<=r[3];y++)for(let x=r[0];x<=r[2];x++)if(LAND[y]?.[x]){let sx=x*TS-cam.x,sy=y*TS-cam.y;px(sx,sy,TS+1,TS+1,(x+y)%2?"#b9a66b":"#c5b174");px(sx,sy+TS-3,TS,3,"#8e7f5522")}
 [[5,10],[6,15],[7,20],[34,11],[35,16],[31,22],[10,5],[29,5],[12,23]].forEach(a=>tree(a[0]*TS-cam.x,a[1]*TS-cam.y));
 [[8,22],[33,20],[11,6]].forEach(a=>palm(a[0]*TS-cam.x,a[1]*TS-cam.y));
 BUILDINGS.forEach(building);dock();fishStall();lamp(16*TS-cam.x,14*TS-cam.y);lamp(25*TS-cam.x,14*TS-cam.y);
 barrel(23*TS-cam.x,17*TS-cam.y);crate(24*TS-cam.x,17*TS-cam.y);crate(25*TS-cam.x,17*TS-cam.y);
 npc(20,17,"SILAS","#d3a04e");npc(15,13,"MIRA","#a05b72");player();
}
function toast(s){let e=E("toast");e.textContent=s;e.style.opacity=1;clearTimeout(toast.t);toast.t=setTimeout(()=>e.style.opacity=0,1150)}
function hud(){E("money").textContent=P.money;E("bag").textContent=P.bag.length;E("bagmax").textContent=P.cap;E("quest").textContent="QUEST: Secure "+Math.min(3,P.caught)+"/3 harbor creatures."}
