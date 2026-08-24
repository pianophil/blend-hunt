function tileWater(sx,sy,tx,ty,t){
 let q=Math.sin(t*.0024+tx*.7+ty*.27)+Math.cos(t*.0017+tx*.18-ty*.6);
 px(sx,sy,TS+1,TS+1,q>.65?"#3c91a8":q<-.55?"#1f627d":"#28748d");
 px(sx,sy,TS+1,3,"#55a9b924");
 if(hash(tx+(t/600|0),ty,9)===0){px(sx+5,sy+9,13,2,"#d9ffff3a");px(sx+10,sy+12,10,2,"#c8f6f522")}
}
function tileGround(sx,sy,tx,ty){
 const coastal=neighborWater(tx,ty,1,0)||neighborWater(tx,ty,-1,0)||neighborWater(tx,ty,0,1)||neighborWater(tx,ty,0,-1);
 if(coastal){px(sx,sy,TS+1,TS+1,(tx+ty)%2?"#d3c17d":"#decf8c");px(sx,sy,TS+1,4,"#f1dda1")}
 else{px(sx,sy,TS+1,TS+1,(tx*3+ty)%5?"#6da454":"#7db563");px(sx,sy,TS+1,3,"#a0cf7d22")}
 if(hash(tx,ty,17)===0&&!coastal){px(sx+8,sy+11,2,9,"#316f43");px(sx+13,sy+8,2,12,"#8bc36a")}
 if(hash(tx,ty,31)===0&&!coastal){px(sx+21,sy+7,3,3,"#f1d477");px(sx+24,sy+9,2,2,"#e59664")}
 if(neighborWater(tx,ty,0,1)){px(sx,sy+TS-5,TS,5,"#ead99a");px(sx+3,sy+TS-2,TS-6,2,"#eef7df")}
 if(neighborWater(tx,ty,0,-1)){px(sx,sy,TS,5,"#ead99a");px(sx+3,sy,1,TS-6,2,"#eef7df")}
 if(neighborWater(tx,ty,1,0)){px(sx+TS-5,sy,5,TS,"#ead99a");px(sx+TS-2,sy+3,2,TS-6,"#eef7df")}
 if(neighborWater(tx,ty,-1,0)){px(sx,sy,5,TS,"#ead99a");px(sx+1,sy+3,2,TS-6,"#eef7df")}
}
function tree(x,y){px(x+13,y+34,8,16,"#4c3427");px(x+5,y+17,30,20,"#194836");px(x+2,y+23,35,14,"#215c3d");px(x+8,y+11,25,18,"#39764b");px(x+14,y+5,15,15,"#5e9c60");px(x+18,y+4,7,7,"#93cb79")}
function palm(x,y){px(x+14,y+18,5,28,"#8a6038");for(let i=0;i<5;i++){X.strokeStyle=i%2?"#4d9259":"#276544";X.lineWidth=4;X.beginPath();X.moveTo(x+16,y+15);X.lineTo(x+16+(i-2)*9,y+4+i*2);X.stroke()}}
function barrel(x,y){px(x,y+4,15,18,"#6d462e");px(x+2,y,11,22,"#9d673e");px(x+1,y+5,13,2,"#383b36");px(x+1,y+16,13,2,"#383b36")}
function crate(x,y){px(x,y,20,19,"#845836");px(x+2,y+2,16,15,"#b17642");X.strokeStyle="#664229";X.lineWidth=2;X.beginPath();X.moveTo(x+3,y+3);X.lineTo(x+17,y+16);X.moveTo(x+17,y+3);X.lineTo(x+3,y+16);X.stroke()}
function lamp(x,y){px(x+5,y+7,4,28,"#28383b");px(x,y,14,10,"#435156");px(x+2,y+2,10,5,"#f4d56c")}
function building(b){
 let x=b.x*TS-cam.x,y=b.y*TS-cam.y,w=b.w*TS,h=b.h*TS;
 px(x+8,y+h-4,w,12,"#0005");px(x,y+TS,w,h-TS,"#d2bf96");
 for(let yy=y+TS+10;yy<y+h;yy+=13)px(x+4,yy,w-8,2,"#8b724e");
 px(x-7,y+5,w+14,TS+13,"#3a2d29");px(x-4,y,w+8,TS+12,b.roof);
 for(let q=0;q<w;q+=20)px(x+q,y+6,14,5,"#ffffff12");
 px(x+w/2-13,y+h-34,26,34,"#4a3028");px(x+w/2-8,y+h-29,16,25,"#6a4530");px(x+w/2+4,y+h-18,4,4,"#efd36a");
 for(const wx of [18,w-42]){px(x+wx,y+TS+18,22,18,"#456d76");px(x+wx+2,y+TS+20,18,14,"#9ecfd0");px(x+wx+10,y+TS+20,2,14,"#edf0df")}
 px(x+18,y+TS-6,w-36,14,"#203a3e");txt(b.name,x+24,y+TS+5,b.kind==="locked"?"#aaa":"#f3d46d",9)
}
function npc(tx,ty,name,col){
 let x=tx*TS-cam.x,y=ty*TS-cam.y,t=performance.now(),fr=Math.floor(t/450)%2,b=fr?-1:0;
 px(x+4,y+38,28,5,"#0005");px(x+8,y+19+b,20,21,col);px(x+5,y+21+b,5,16,col);px(x+27,y+21+b,5,16,col);
 px(x+10,y+5+b,16,14,"#e2bb91");px(x+9,y+3+b,18,6,name==="SILAS"?"#735139":"#4d3548");px(x+13,y+11+b,2,2,"#292625");px(x+21,y+11+b,2,2,"#292625");
 if(name==="SILAS"){px(x+4,y+17+b,29,5,"#d3a24e");px(x+30,y+26+b,6,12,"#5a3b2b")}
 txt(name,x-2,y-5,"#ffe27b",10)
}
function player(){
 let x=P.x*TS-cam.x,y=P.y*TS-cam.y,t=performance.now(),moving=J.on&&(Math.abs(J.x)+Math.abs(J.y)>.15),fr=moving?Math.floor(t/105)%4:0,b=fr%2?-1:0,la=fr===1?3:fr===3?-2:0,lb=-la;
 px(x+1,y+41,34,5,"#0005");px(x+5,y+20+b,7,19,"#634432");
 px(x+9+la,y+36+b,7,10,"#26343c");px(x+22+lb,y+36+b,7,10,"#26343c");px(x+8+la,y+44+b,9,3,"#141d23");px(x+21+lb,y+44+b,9,3,"#141d23");
 px(x+8,y+20+b,22,18,"#1b4261");px(x+11,y+23+b,16,7,"#32688a");px(x+5,y+22+b,5,15,"#1b4261");px(x+29,y+22+b,5,15,"#1b4261");
 px(x+12,y+6+b,16,15,"#dfb48a");px(x+10,y+2+b,21,7,"#a63832");px(x+25,y+3+b,9,4,"#efd069");
 if(face.y>=0){px(x+15,y+13+b,2,2,"#292625");px(x+23,y+13+b,2,2,"#292625");px(x+18,y+18+b,6,2,"#b77558")}
}
function dock(){
 for(let y=21;y<=27;y++)for(const x of [13,14,26,27]){let sx=x*TS-cam.x,sy=y*TS-cam.y;px(sx,sy,TS+1,TS+1,"#6a472f");px(sx+3,sy+4,TS-6,12,"#a87547");px(sx+4,sy+22,TS-8,4,"#4c3427")}
 for(let x=13;x<=18;x++){let sx=x*TS-cam.x,sy=27*TS-cam.y;px(sx,sy,TS+1,TS+1,"#6a472f");px(sx+3,sy+4,TS-6,12,"#a87547")}
 for(let x=22;x<=27;x++){let sx=x*TS-cam.x,sy=27*TS-cam.y;px(sx,sy,TS+1,TS+1,"#6a472f");px(sx+3,sy+4,TS-6,12,"#a87547")}
 barrel(14*TS-cam.x+8,24*TS-cam.y+8);crate(27*TS-cam.x+7,23*TS-cam.y+7)
}
function fishStall(){
 let x=18*TS-cam.x,y=18*TS-cam.y;px(x,y+20,4*TS,6,"#5f412c");px(x+8,y,4*TS-16,10,"#b44c3e");px(x+10,y+10,4*TS-20,6,"#f1d16f");px(x+16,y+22,4*TS-32,30,"#8b6a43");txt("SILAS' CATCH",x+19,y+37,"#fff",9)
}
