const categoryMeta={massage:{label:"Masaj",icon:"fa-spa",note:"Relaxare și recuperare"},fitness:{label:"Fitness",icon:"fa-dumbbell",note:"Mișcare și energie"},medicalPedicure:{label:"Pedichiură Medicală",icon:"fa-shoe-prints",note:"Îngrijire specializată"},nails:{label:"Healthy Nails",icon:"fa-hand-sparkles",note:"Sănătatea unghiilor"}};
const selections=new Map();
const catalog=document.querySelector("#service-catalog");
const summaryItems=document.querySelector("#summary-items");
const subtotalEl=document.querySelector("#subtotal");
const discountEl=document.querySelector("#discount");
const totalEl=document.querySelector("#total");
const orderButton=document.querySelector("#whatsapp-order");
const money=value=>new Intl.NumberFormat("ro-RO",{maximumFractionDigits:2}).format(value)+" Lei";

Object.entries(window.services).forEach(([categoryKey,services],categoryIndex)=>{
  const meta=categoryMeta[categoryKey];
  const section=document.createElement("section");
  section.className="category"+(categoryIndex===0?" open":"");
  const button=document.createElement("button");
  button.className="category-button";button.type="button";button.setAttribute("aria-expanded",String(categoryIndex===0));
  button.innerHTML=`<i class="fa-solid ${meta.icon}"></i><span><strong>${meta.label}</strong><small>${meta.note}</small></span><i class="fa-solid fa-chevron-down chevron"></i>`;
  const content=document.createElement("div");content.className="category-content";
  Object.entries(services).forEach(([serviceKey,service])=>service.options.forEach((option,optionIndex)=>{
    const id=`${categoryKey}-${serviceKey}-${optionIndex}`;
    const row=document.createElement("div");row.className="option-row";
    const detail=[option.duration?`${option.duration} minute`:null,option.label].filter(Boolean).join(" · ");
    row.innerHTML=`<div class="option-title"><strong>${service.title}</strong><span>${detail}</span></div><div class="option-price">${money(option.price)}</div><div class="stepper"><button type="button" data-action="minus" aria-label="Scade numărul de ședințe pentru ${service.title}">−</button><output aria-live="polite">0</output><button type="button" data-action="plus" aria-label="Adaugă o ședință pentru ${service.title}">+</button></div>`;
    const output=row.querySelector("output");
    row.querySelectorAll("button").forEach(control=>control.addEventListener("click",()=>{
      const current=selections.get(id)?.quantity||0;
      const quantity=Math.max(0,current+(control.dataset.action==="plus"?1:-1));
      if(quantity===0)selections.delete(id);else selections.set(id,{title:service.title,detail,price:option.price,quantity});
      output.textContent=quantity;updateSummary();
    }));
    content.appendChild(row);
  }));
  button.addEventListener("click",()=>{const open=section.classList.toggle("open");button.setAttribute("aria-expanded",String(open))});
  section.append(button,content);catalog.appendChild(section);
});

function updateSummary(){
  const items=[...selections.values()];
  const subtotal=items.reduce((sum,item)=>sum+item.price*item.quantity,0);
  const discount=subtotal*.15;
  const total=subtotal-discount;
  summaryItems.innerHTML=items.length?items.map(item=>`<div class="summary-item"><div><strong>${item.title}</strong><span>${item.detail} × ${item.quantity}</span></div><b>${money(item.price*item.quantity)}</b></div>`).join(""):`<div class="empty-state"><i class="fa-regular fa-heart"></i><p>Serviciile selectate vor apărea aici.</p></div>`;
  subtotalEl.textContent=money(subtotal);discountEl.textContent="− "+money(discount);totalEl.textContent=money(total);
  if(!items.length){orderButton.classList.add("is-disabled");orderButton.setAttribute("aria-disabled","true");orderButton.href="#";return}
  const lines=["Bună ziua! Doresc abonamentul Elyan Membership:","",...items.map(item=>`• ${item.title} — ${item.detail} × ${item.quantity}: ${money(item.price*item.quantity)}`),"",`Total servicii: ${money(subtotal)}`,`Reducere Membership (15%): − ${money(discount)}`,`TOTAL DE PLATĂ: ${money(total)}`,"","Îmi puteți confirma disponibilitatea?"];
  orderButton.href="https://wa.me/40769729403?text="+encodeURIComponent(lines.join("\n"));orderButton.classList.remove("is-disabled");orderButton.removeAttribute("aria-disabled");orderButton.target="_blank";orderButton.rel="noopener noreferrer";
}
