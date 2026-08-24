function pickFish(){return FISH[Math.floor(Math.random()*6)]}
function startFishing(){
 if(P.bag.length>=P.cap)return toast("Pack full.");
 if(!waterAhead())return toast("Stand fully on land and face the water.");
 fishing={phase:"waiting",fish:pickFish(),wait:rnd(.8,1.8),distance:.98,tension:.26,reel:false};
 E("fishOverlay").style.display="block";E("fishTitle").textContent="CASTING";E("fishMsg").textContent="Wait for a bite..."
}
function hook(){fishing.phase="fight";E("fishTitle").textContent=fishing.fish.name.toUpperCase();E("fishMsg").textContent="HOOKED — HOLD A TO REEL"}
function updateFishing(dt){
 if(fishing.phase==="idle")return;
 if(fishing.phase==="waiting"){fishing.wait-=dt;if(fishing.wait<=0){fishing.phase="bite";fishing.wait=1.1;E("fishMsg").textContent="BITE! TAP A";toast("BITE!")}}
 else if(fishing.phase==="bite"){fishing.wait-=dt;if(fishing.wait<=0){fishing={phase:"idle"};E("fishOverlay").style.display="none";toast("Too slow.")}}
 else if(fishing.phase==="fight"){
   let pull=.26+Math.abs(Math.sin(performance.now()/380))*.54;
   if(fishing.reel){fishing.distance-=dt*(P.gadgets.includes("Quick-Reel Module")?.27:.22);fishing.tension+=dt*(.34+pull*.32)}else{fishing.distance+=dt*.028;fishing.tension-=dt*.30}
   fishing.tension=clamp(fishing.tension,.04,1.2);E("tensionBar").style.width=(Math.min(1,fishing.tension)*100)+"%";E("tensionBar").style.background=fishing.tension>.86?"#d85f53":fishing.tension>.64?"#e3c65d":"#6fbd72";
   E("distanceBar").style.width=(Math.min(1,fishing.distance)*100)+"%";E("distanceBar").style.background="#6aa5cb";
   if(fishing.tension>1.02){E("fishOverlay").style.display="none";fishing={phase:"idle"};toast("SNAP!")}
   else if(fishing.distance<=.02){let f=fishing.fish;E("fishOverlay").style.display="none";fishing={phase:"idle"};beginBattle(f)}
 }
}
function moves(){
 let a=[{name:"FISTS",power:8,desc:"Reliable strike"}];
 for(const g of GADGETS)if(P.gadgets.includes(g.name)&&g.power>0&&a.length<4)a.push({name:g.name.toUpperCase(),power:g.power,desc:g.desc});
 return a
}
function beginBattle(f){
 battle={fish:f,hp:f.hp,max:f.hp,turn:"player"};E("battle").style.display="block";E("worldButtons").style.display="none";E("joy").style.display="none";
 E("ename").textContent=f.name.toUpperCase();renderMoves();battleUI();E("msg").textContent="CREATURE ON DECK — YOUR TURN"
}
function renderMoves(){E("moves").innerHTML="";for(const m of moves()){let b=document.createElement("button");b.className="move";b.innerHTML="<strong>"+m.name+"</strong><small>"+m.desc+"</small>";b.onclick=()=>attack(m);E("moves").appendChild(b)}}
function attack(m){if(!battle||battle.turn!=="player"||timing)return;battle.turn="timing";timing={mode:"attack",move:m,pos:0,dir:1,speed:1.55};E("timing").style.display="block";E("battleA").classList.add("pulse");E("msg").textContent=m.name+" — TIME YOUR HIT"}
function enemyTurn(){battle.turn="enemy";timing={mode:"defense",pos:0,dir:1,speed:1.72};E("timing").style.display="block";E("battleA").classList.add("pulse");E("msg").textContent="ENEMY ATTACK — PARRY"}
function resolveTiming(){
 if(!timing)return;let q=Math.abs(timing.pos-.5),quality=q<.045?"perfect":q<.16?"good":"miss",t=timing;timing=null;E("timing").style.display="none";E("battleA").classList.remove("pulse");
 if(t.mode==="attack"){let d=quality==="perfect"?Math.round(t.move.power*2.15):quality==="good"?Math.round(t.move.power*1.15):Math.max(1,Math.round(t.move.power*.35));battle.hp-=d;P.focus=clamp(P.focus+(quality==="perfect"?18:6),0,100);E("msg").textContent=(quality==="perfect"?"CRITICAL PERFECT! ":"")+d+" DAMAGE";battleUI();if(battle.hp<=0)return winBattle();setTimeout(enemyTurn,650)}
 else{let damage=quality==="perfect"?0:quality==="good"?4:12;P.hp-=damage;E("msg").textContent=quality==="perfect"?"PERFECT PARRY!":"HIT −"+damage+" HP";battleUI();if(P.hp<=0){P.hp=100;E("msg").textContent="KNOCKED DOWN — IT ESCAPED";return setTimeout(endBattle,900)}setTimeout(()=>{battle.turn="player";E("msg").textContent="YOUR TURN"},600)}
}
function battleUI(){E("php").textContent=Math.round(P.hp);E("pbar").style.width=P.hp+"%";E("focus").textContent=P.focus;E("ehp").textContent=Math.max(0,Math.round(battle.hp));E("ehpmax").textContent=Math.round(battle.max);E("ebar").style.width=(100*Math.max(0,battle.hp)/battle.max)+"%"}
function winBattle(){P.bag.push(battle.fish);P.caught++;E("msg").textContent="SECURED! "+battle.fish.name+" ADDED TO CATCH";hud();setTimeout(endBattle,950)}
function endBattle(){battle=null;timing=null;E("battle").style.display="none";E("worldButtons").style.display="grid";E("joy").style.display="block"}
function drawPortraits(){
 if(!battle)return;let y=E("yp").getContext("2d"),f=E("fp").getContext("2d"),t=performance.now(),b=Math.sin(t/360)*1.5;y.clearRect(0,0,128,128);f.clearRect(0,0,128,128);
 y.fillStyle="#07151b";y.fillRect(12,108,104,8);y.fillStyle="#193f5a";y.fillRect(20,67+b,86,41);y.fillStyle="#2f6888";y.fillRect(31,72+b,65,9);y.fillStyle="#d9aa80";y.fillRect(36,26+b,55,45);y.fillStyle="#efc296";y.fillRect(42,32+b,42,31);y.fillStyle="#9d3932";y.fillRect(26,17+b,73,16);y.fillStyle="#efd46d";y.fillRect(88,21+b,17,6);y.fillStyle="#292625";y.fillRect(48,45+b,6,6);y.fillRect(72,45+b,6,6);
 let m=Math.sin(t/280)*3;
 if(battle.fish.type==="crab"){f.fillStyle="#d87762";f.fillRect(30+m,49,62,38);f.fillRect(10+m,59,23,14);f.fillRect(89+m,59,23,14);f.fillStyle="#8d4a40";f.fillRect(9+m,47,16,15);f.fillRect(103+m,47,16,15);f.fillStyle="#111";f.fillRect(47+m,52,5,5);f.fillRect(72+m,52,5,5)}
 else if(battle.fish.type==="jelly"){f.fillStyle="#9c88cf";f.beginPath();f.moveTo(31+m,61);f.quadraticCurveTo(64+m,21,98+m,61);f.lineTo(98+m,73);f.lineTo(31+m,73);f.fill();for(let i=0;i<6;i++)f.fillRect(35+i*11+m,72,5,39-(i%2)*8)}
 else{f.fillStyle="#65b5c7";f.beginPath();f.moveTo(14+m,66);f.lineTo(36+m,43);f.lineTo(91+m,43);f.lineTo(108+m,66);f.lineTo(91+m,90);f.lineTo(36+m,90);f.closePath();f.fill();f.fillStyle="#376a78";f.beginPath();f.moveTo(93+m,46);f.lineTo(126+m,31);f.lineTo(119+m,101);f.lineTo(93+m,87);f.fill();f.fillStyle="#afdfe0";f.fillRect(45+m,48,34,8);f.fillStyle="#111";f.fillRect(38+m,61,5,5)}
 txt(battle.fish.name.toUpperCase(),7,122,"#f5dc7a",8)
}
