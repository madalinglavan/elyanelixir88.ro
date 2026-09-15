const categoryMeta={massage:{label:"Masaj",icon:"fa-spa",note:"Relaxare și recuperare"},fitness:{label:"Acces Fitness",icon:"fa-dumbbell",note:"Utilizare autonomă a aparatelor"},medicalPedicure:{label:"Pedichiură Medicală",icon:"fa-shoe-prints",note:"Îngrijire specializată"},nails:{label:"Healthy Nails",icon:"fa-hand-sparkles",note:"Sănătatea unghiilor"}};
const selections=new Map();
const catalog=document.querySelector("#service-catalog");
const summaryItems=document.querySelector("#summary-items");
const subtotalEl=document.querySelector("#subtotal");
const discountEl=document.querySelector("#discount");
const totalEl=document.querySelector("#total");
const generateButton=document.querySelector("#generate-card");
const orderButton=document.querySelector("#whatsapp-order");
const modal=document.querySelector("#card-modal");
const clientNameInput=document.querySelector("#client-name");
const monthInput=document.querySelector("#membership-month");
const formMessage=document.querySelector("#form-message");
const eligibilityMessage=document.querySelector("#eligibility-message");
const money=value=>new Intl.NumberFormat("ro-RO",{maximumFractionDigits:2}).format(value)+" Lei";
const itemUnit=item=>item.quantity===1?item.unit:item.unit==="utilizare"?"utilizări":item.unit==="abonament"?"abonamente":"ședințe";
const pad=value=>String(value).padStart(2,"0");
const toLocalDate=date=>`${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}`;
const initialActivation=new Date();monthInput.min=toLocalDate(initialActivation);monthInput.value=toLocalDate(initialActivation);
const calculateValidity=value=>{if(!value)return null;const [year,month,day]=value.split("-").map(Number),start=new Date(year,month-1,day,12);if(Number.isNaN(start.getTime()))return null;const originalDay=start.getDate(),end=new Date(start);end.setDate(1);end.setMonth(end.getMonth()+1);const lastDay=new Date(end.getFullYear(),end.getMonth()+1,0).getDate();end.setDate(Math.min(originalDay,lastDay));const dateOptions={day:"numeric",month:"long",year:"numeric"},shortOptions={day:"2-digit",month:"short",year:"numeric"};return{start,end,label:`${start.toLocaleDateString("ro-RO",dateOptions)} – ${end.toLocaleDateString("ro-RO",dateOptions)} inclusiv`,shortLabel:`${start.toLocaleDateString("ro-RO",shortOptions)} – ${end.toLocaleDateString("ro-RO",shortOptions)}`}};

Object.entries(window.services).forEach(([categoryKey,services],categoryIndex)=>{
  const meta=categoryMeta[categoryKey];
  const section=document.createElement("section");
  section.className="category"+(categoryIndex===0?" open":"");
  const button=document.createElement("button");
  button.className="category-button";button.type="button";button.setAttribute("aria-expanded",String(categoryIndex===0));
  button.innerHTML=`<i class="fa-solid ${meta.icon}"></i><span><strong>${meta.label}</strong><small>${meta.note}</small></span><i class="fa-solid fa-chevron-down chevron"></i>`;
  const content=document.createElement("div");content.className="category-content";
  Object.entries(services).filter(([,service])=>!service.hidden).forEach(([serviceKey,service])=>service.options.forEach((option,optionIndex)=>{
    const id=`${categoryKey}-${serviceKey}-${optionIndex}`;
    const row=document.createElement("div");row.className="option-row";
    const detail=[option.duration?`${option.duration} minute`:null,option.label].filter(Boolean).join(" · ");
    row.innerHTML=`<div class="option-title"><strong>${service.title}</strong><span>${detail}</span></div><div class="option-price">${money(option.price)}</div><div class="stepper"><button type="button" data-action="minus" aria-label="Scade numărul de ședințe pentru ${service.title}">−</button><output aria-live="polite">0</output><button type="button" data-action="plus" aria-label="Adaugă o ședință pentru ${service.title}">+</button></div>`;
    const output=row.querySelector("output");
    row.querySelectorAll("button").forEach(control=>control.addEventListener("click",()=>{
      const current=selections.get(id)?.quantity||0;
      const requested=Math.max(0,current+(control.dataset.action==="plus"?1:-1));
      const quantity=Math.min(option.maxQuantity||Infinity,requested);
      if(quantity===0)selections.delete(id);else selections.set(id,{title:service.title,detail,price:option.price,quantity,unit:option.unit||"ședință",fixedMonthly:Boolean(option.fixedMonthly),discountable:option.discountable!==false,qualifiesForMembership:option.qualifiesForMembership!==false});
      output.textContent=quantity;row.querySelector('[data-action="plus"]').disabled=quantity>=(option.maxQuantity||Infinity);updateSummary();
    }));
    content.appendChild(row);
  }));
  button.addEventListener("click",()=>{const open=section.classList.toggle("open");button.setAttribute("aria-expanded",String(open))});
  section.append(button,content);catalog.appendChild(section);
});

function updateSummary(){
  const items=[...selections.values()];
  const subtotal=items.reduce((sum,item)=>sum+item.price*item.quantity,0);
  const qualifyingCount=items.filter(item=>item.qualifiesForMembership!==false).reduce((sum,item)=>sum+item.quantity,0);
  const hasFixedMembership=items.some(item=>item.fixedMonthly);
  const discountableSubtotal=items.filter(item=>item.discountable!==false).reduce((sum,item)=>sum+item.price*item.quantity,0);
  const discount=qualifyingCount>=3?discountableSubtotal*.15:0;
  const total=subtotal-discount;
  const sessionCount=items.reduce((sum,item)=>sum+item.quantity,0);
  summaryItems.innerHTML=items.length?items.map(item=>`<div class="summary-item"><div><strong>${item.title}</strong><span>${item.detail} × ${item.quantity}</span></div><b>${money(item.price*item.quantity)}</b></div>`).join(""):`<div class="empty-state"><i class="fa-regular fa-heart"></i><p>Serviciile selectate vor apărea aici.</p></div>`;
  subtotalEl.textContent=money(subtotal);discountEl.textContent="− "+money(discount);totalEl.textContent=money(total);
  const remainingSessions=Math.max(0,3-qualifyingCount),canGenerate=hasFixedMembership||qualifyingCount>=3;
  eligibilityMessage.classList.toggle("is-ready",canGenerate);
  eligibilityMessage.innerHTML=hasFixedMembership&&qualifyingCount<3?`<i class="fa-solid fa-circle-check"></i><span>Abonamentul Fitness este eligibil la prețul fix de 60 Lei/lună.</span>`:remainingSessions?`<i class="fa-solid fa-lock"></i><span>Mai adaugă ${remainingSessions} ${remainingSessions===1?"ședință":"ședințe"} pentru a activa reducerea Membership.</span>`:`<i class="fa-solid fa-circle-check"></i><span>Abonament eligibil — reducerea de 15% este activă pentru serviciile selectate.</span>`;
  const clientName=clientNameInput.value.trim(),validity=calculateValidity(monthInput.value),month=validity?.label||"",isComplete=canGenerate&&clientName&&month;
  if(!isComplete){generateButton.classList.add("is-disabled");generateButton.disabled=true;orderButton.href="#";return}
  const lines=["Bună ziua! Doresc abonamentul Elyan Membership:","",`Client: ${clientName}`,`Valabilitate: ${month}`,"",...items.map(item=>`• ${item.title} — ${item.detail} × ${item.quantity}: ${money(item.price*item.quantity)}`),"",`Total servicii: ${money(subtotal)}`,`Reducere Membership (15%): − ${money(discount)}`,`TOTAL DE PLATĂ: ${money(total)}`,"","Îmi puteți confirma disponibilitatea?"];
  orderButton.href="https://wa.me/40769729403?text="+encodeURIComponent(lines.join("\n"));generateButton.classList.remove("is-disabled");generateButton.disabled=false;formMessage.classList.remove("is-visible");formMessage.textContent="";
}

[clientNameInput,monthInput].forEach(input=>input.addEventListener("input",updateSummary));

generateButton.addEventListener("click",()=>{
  const items=[...selections.values()],sessionCount=items.reduce((sum,item)=>sum+item.quantity,0),qualifyingCount=items.filter(item=>item.qualifiesForMembership!==false).reduce((sum,item)=>sum+item.quantity,0),hasFixedMembership=items.some(item=>item.fixedMonthly),clientName=clientNameInput.value.trim(),validity=calculateValidity(monthInput.value),month=validity?.label||"";
  if(!clientName||!month||(!hasFixedMembership&&qualifyingCount<3)){formMessage.textContent="Completează numele și data activării, apoi alege abonamentul Fitness sau minimum 3 ședințe.";formMessage.classList.add("is-visible");(!clientName?clientNameInput:!month?monthInput:null)?.focus();return}
  const subtotal=items.reduce((sum,item)=>sum+item.price*item.quantity,0),discountableSubtotal=items.filter(item=>item.discountable!==false).reduce((sum,item)=>sum+item.price*item.quantity,0),discount=qualifyingCount>=3?discountableSubtotal*.15:0,total=subtotal-discount;
  document.querySelector("#digital-card-items").innerHTML=items.map(item=>`<div class="digital-card__item"><div><strong>${item.title}</strong><span>${item.detail} × ${item.quantity} ${itemUnit(item)}/lună</span></div><b>${money(item.price*item.quantity)}</b></div>`).join("");
  document.querySelector("#card-subtotal").textContent=money(subtotal);document.querySelector("#card-discount").textContent="− "+money(discount);document.querySelector("#card-total").textContent=money(total);
  document.querySelector("#card-client-name").textContent=clientName;document.querySelector("#card-month").textContent=month;
  modal.classList.add("is-open");modal.setAttribute("aria-hidden","false");document.body.classList.add("modal-open");modal.querySelector(".modal-close").focus();
});

function closeModal(){modal.classList.remove("is-open");modal.setAttribute("aria-hidden","true");document.body.classList.remove("modal-open");generateButton.focus()}
modal.querySelectorAll("[data-close-modal]").forEach(el=>el.addEventListener("click",closeModal));
document.addEventListener("keydown",event=>{if(event.key==="Escape"&&modal.classList.contains("is-open"))closeModal()});

document.querySelector("#download-card").addEventListener("click",()=>{
  const items=[...selections.values()],sessionCount=items.reduce((sum,item)=>sum+item.quantity,0),qualifyingCount=items.filter(item=>item.qualifiesForMembership!==false).reduce((sum,item)=>sum+item.quantity,0),hasFixedMembership=items.some(item=>item.fixedMonthly),clientName=clientNameInput.value.trim(),validity=calculateValidity(monthInput.value),month=validity?.label||"";if((!hasFixedMembership&&qualifyingCount<3)||!clientName||!month)return;
  const subtotal=items.reduce((sum,item)=>sum+item.price*item.quantity,0),discountableSubtotal=items.filter(item=>item.discountable!==false).reduce((sum,item)=>sum+item.price*item.quantity,0),discount=qualifyingCount>=3?discountableSubtotal*.15:0,total=subtotal-discount;
  const canvas=document.createElement("canvas"),width=1080,rowHeight=88,height=630+items.length*rowHeight;canvas.width=width;canvas.height=height;
  const ctx=canvas.getContext("2d"),gradient=ctx.createLinearGradient(0,0,width,height);gradient.addColorStop(0,"#0f6a4d");gradient.addColorStop(1,"#032a20");ctx.fillStyle=gradient;ctx.fillRect(0,0,width,height);
  ctx.strokeStyle="rgba(212,175,55,.55)";ctx.lineWidth=3;ctx.strokeRect(34,34,width-68,height-68);
  ctx.fillStyle="#efd477";ctx.font="700 30px Georgia";ctx.fillText("ELYAN ELIXIR 88",76,105);ctx.font="600 18px Arial";ctx.fillText("MEMBERSHIP  •  ABONAMENT LUNAR",76,140);
  ctx.fillStyle="#ffffff";ctx.font="700 54px Georgia";ctx.fillText("Experiențe alese pentru tine",76,224);
  ctx.fillStyle="rgba(255,255,255,.07)";ctx.fillRect(68,256,width-136,88);ctx.fillStyle="rgba(255,255,255,.58)";ctx.font="600 15px Arial";ctx.fillText("PREGĂTIT PENTRU",88,284);ctx.fillText("VALABILITATE",500,284);ctx.fillStyle="#fff";ctx.font="700 25px Arial";ctx.fillText(clientName.slice(0,30),88,320);ctx.fillStyle="#efd477";ctx.font="700 19px Arial";ctx.fillText(validity.shortLabel,500,320);
  let y=402;items.forEach(item=>{ctx.fillStyle="rgba(255,255,255,.075)";ctx.fillRect(68,y-38,width-136,70);ctx.fillStyle="#fff";ctx.font="600 21px Arial";ctx.fillText(item.title.slice(0,52),88,y-8);ctx.fillStyle="rgba(255,255,255,.62)";ctx.font="17px Arial";ctx.fillText(`${item.detail} × ${item.quantity} ${itemUnit(item)}/lună`,88,y+19);ctx.fillStyle="#efd477";ctx.font="700 21px Arial";ctx.textAlign="right";ctx.fillText(money(item.price*item.quantity),width-88,y+3);ctx.textAlign="left";y+=rowHeight});
  y+=12;ctx.strokeStyle="rgba(255,255,255,.2)";ctx.beginPath();ctx.moveTo(76,y);ctx.lineTo(width-76,y);ctx.stroke();
  ctx.fillStyle="rgba(255,255,255,.72)";ctx.font="20px Arial";ctx.fillText("Total servicii",76,y+48);ctx.textAlign="right";ctx.fillText(money(subtotal),width-76,y+48);ctx.fillStyle="#efd477";ctx.fillText(`Reducere Membership (15%): − ${money(discount)}`,width-76,y+86);ctx.fillStyle="#fff";ctx.font="700 28px Arial";ctx.fillText("TOTAL DE PLATĂ",width-350,y+140);ctx.fillStyle="#efd477";ctx.font="700 42px Georgia";ctx.fillText(money(total),width-76,y+140);ctx.textAlign="left";
  ctx.fillStyle="rgba(255,255,255,.45)";ctx.font="16px Arial";ctx.fillText("Relaxare  •  Sănătate  •  Frumusețe",76,height-72);
  const safeName=clientName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
  const cardRecord={id:`${Date.now()}-${Math.random().toString(36).slice(2,8)}`,clientName,startAt:validity.start.toISOString(),endAt:validity.end.toISOString(),validityLabel:month,month:monthInput.value.slice(0,7),monthLabel:month,createdAt:new Date().toISOString(),sessionCount,subtotal,discount,total,items:items.map(item=>({...item}))};
  try{const history=JSON.parse(localStorage.getItem("elyanMembershipCards")||"[]");history.unshift(cardRecord);localStorage.setItem("elyanMembershipCards",JSON.stringify(history.slice(0,500)))}catch(error){console.warn("Cardul nu a putut fi înregistrat în dashboard.",error)}
  const link=document.createElement("a");link.download=`elyan-membership-${safeName||"client"}-${monthInput.value.slice(0,10)}.png`;link.href=canvas.toDataURL("image/png",1);link.click();
});
