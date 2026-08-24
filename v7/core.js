"use strict";
const E=id=>document.getElementById(id),C=E("g"),X=C.getContext("2d"),TS=32,MW=42,MH=34;
let W=0,H=0,D=1,last=0,cam={x:0,y:0},face={x:0,y:1},started=false;
const P={x:19.5,y:18.5,money:0,bag:[],cap:8,caught:0,hp:100,focus:0,gadgets:[]};
const J={on:false,id:null,x:0,y:0};let fishing={phase:"idle"},battle=null,timing=null;
const FISH=[
{name:"Harbor Sardine",value:8,type:"fish",hp:34},{name:"Silver Herring",value:11,type:"fish",hp:38},{name:"Rock Goby",value:14,type:"fish",hp:42},
{name:"Blue Mackerel",value:18,type:"fish",hp:48},{name:"Green Crab",value:20,type:"crab",hp:52},{name:"Sand Shrimp",value:22,type:"crab",hp:45},
{name:"Red Snapper",value:32,type:"fish",hp:60},{name:"Sea Bass",value:38,type:"fish",hp:68},{name:"Moon Jelly",value:42,type:"jelly",hp:58}
];
const GADGETS=[
{name:"Driftwood Club",price:35,power:15,desc:"Wide timing window."},{name:"Hook Gloves",price:55,power:12,desc:"Fast close strike."},{name:"Weighted Net",price:75,power:5,desc:"Control move."},
{name:"Salt Flare",price:90,power:8,desc:"Burning utility."},{name:"Shock Tag",price:120,power:11,desc:"Perfect can stun."},{name:"Shell Guard",price:140,power:0,desc:"Improves parry."},
{name:"Rope Dart",price:180,power:24,desc:"Hard timing, high crit."},{name:"Chum Bomb",price:220,power:0,desc:"Weakens creature."},{name:"Stun Baton",price:300,power:28,desc:"Heavy perfect hit."},
{name:"Quick-Reel Module",price:360,power:0,desc:"Faster fishing drill."},{name:"Barbed Gauntlet",price:480,power:32,desc:"Brutal close strike."},{name:"Harpoon Sidearm",price:850,power:40,desc:"Ranged heavy attack."}
];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),rnd=(a,b)=>a+Math.random()*(b-a),hash=(a,b,m)=>Math.abs(((a*73856093)^(b*19349663))%m);
const LAND=Array.from({length:MH},()=>Array(MW).fill(false));
function fill(x1,y1,x2,y2){for(let y=y1;y<=y2;y++)for(let x=x1;x<=x2;x++)if(x>=0&&y>=0&&x<MW&&y<MH)LAND[y][x]=true}
fill(7,4,33,5);fill(5,6,35,8);fill(4,9,36,12);fill(3,13,37,17);fill(4,18,36,21);fill(6,22,34,24);fill(9,25,31,27);fill(13,28,27,29);
for(let y=20;y<=25;y++)for(let x=16;x<=24;x++)LAND[y][x]=false;
for(let y=21;y<=27;y++){LAND[y][13]=true;LAND[y][14]=true;LAND[y][26]=true;LAND[y][27]=true}
for(let x=13;x<=18;x++){LAND[27][x]=true}for(let x=22;x<=27;x++){LAND[27][x]=true}
const BUILDINGS=[
{x:8,y:7,w:6,h:4,name:"TACKLE & GOODS",roof:"#a84e3f",kind:"store"},
{x:26,y:7,w:7,h:4,name:"SHIPYARD",roof:"#526c79",kind:"yard"},
{x:8,y:15,w:5,h:4,name:"YOUR CABIN",roof:"#7b553e",kind:"home"},
{x:28,y:15,w:5,h:4,name:"LOCKED",roof:"#4d4645",kind:"locked"},
{x:17,y:8,w:5,h:4,name:"FISH HALL",roof:"#6c7d5c",kind:"hall"}
];
function resize(){D=Math.min(2,devicePixelRatio||1);W=innerWidth;H=innerHeight;C.width=W*D;C.height=H*D;X.setTransform(D,0,0,D,0,0)}
addEventListener("resize",resize);
function px(x,y,w,h,c){X.fillStyle=c;X.fillRect(Math.round(x),Math.round(y),w,h)}
function txt(t,x,y,c="#fff",z=11){X.font="900 "+z+"px monospace";X.fillStyle="#061018";X.fillText(t,x+1,y+1);X.fillStyle=c;X.fillText(t,x,y)}
function isLand(x,y){let tx=Math.floor(x),ty=Math.floor(y);return tx>=0&&ty>=0&&tx<MW&&ty<MH&&LAND[ty][tx]}
function blocked(x,y){const r=.34;for(const p of [[x-r,y-r],[x+r,y-r],[x-r,y+r],[x+r,y+r]])if(!isLand(p[0],p[1]))return true;for(const b of BUILDINGS){if(x+r>b.x&&x-r<b.x+b.w&&y+r>b.y&&y-r<b.y+b.h)return true}return false}
function waterAhead(){let x=P.x+face.x*.76,y=P.y+face.y*.76;return !isLand(x,y)}
function neighborWater(x,y,dx,dy){let nx=x+dx,ny=y+dy;return nx<0||ny<0||nx>=MW||ny>=MH||!LAND[ny][nx]}
