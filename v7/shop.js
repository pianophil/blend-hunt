function seller(){
 let total=P.bag.reduce((a,f)=>a+f.value,0),h="<h2>SILAS — CATCH BUYER</h2><p>Today's offer: <b>$"+total+"</b></p><button onclick='sellAll()'>SELL ALL CATCH</button><p>Starter combat gadgets</p><div class='grid'>";
 for(const g of GADGETS){let own=P.gadgets.includes(g.name);h+="<div class='item'><b>"+g.name+"</b>$"+g.price+"<br><small>"+g.desc+"</small><button "+(own?"disabled":"")+" onclick='buyGadget("+JSON.stringify(g.name)+")'>"+(own?"OWNED":"BUY")+"</button></div>"}h+="</div>";modal(h)
}
window.sellAll=function(){let total=P.bag.reduce((a,f)=>a+f.value,0);P.money+=total;P.bag=[];closeModal();hud();toast("Sold catch for $"+total)}
window.buyGadget=function(name){let g=GADGETS.find(x=>x.name===name);if(P.money<g.price)return toast("Not enough money.");P.money-=g.price;P.gadgets.push(name);closeModal();hud();toast("Unlocked "+name)}
function inventory(){let a=(P.gadgets.length?P.gadgets:["Fists"]).map(n=>"<div class='item'><b>"+n+"</b></div>").join(""),b=P.bag.map(f=>"<div class='item'><b>"+f.name+"</b>$"+f.value+"</div>").join("");modal("<h2>PACK</h2><p>Combat gear</p><div class='grid'>"+a+"</div><p>Secured catch</p><div class='grid'>"+(b||"<div class='item'>Empty</div>")+"</div>")}
function modal(h){E("modal").innerHTML=h+"<button class='close' onclick='closeModal()'>CLOSE</button>";E("mw").style.display="flex"}window.closeModal=function(){E("mw").style.display="none"}
