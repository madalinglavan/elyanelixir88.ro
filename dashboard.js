const STORAGE_KEY="elyanMembershipCards";
const money=value=>new Intl.NumberFormat("ro-RO",{maximumFractionDigits:2}).format(value||0)+" Lei";
const dateLabel=value=>new Date(value).toLocaleDateString("ro-RO",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"});
const currentMonth=new Date().toISOString().slice(0,7);
let cards=[];
try{cards=JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]");if(!Array.isArray(cards))cards=[]}catch{cards=[]}
// Preserve the stored legacy registry; deduplicate its presentation and totals.
function uniqueCards(records){const seen=new Set();return records.filter(card=>{const signature=JSON.stringify([String(card.clientName||'').trim().toLocaleLowerCase('ro').replace(/\s+/g,' '),card.activationDate||card.startAt?.slice(0,10)||card.month,(card.items||[]).map(item=>[item.title,item.detail,item.quantity,item.price]).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)))]);if(seen.has(signature))return false;seen.add(signature);return true})}
cards=uniqueCards(cards);

document.querySelector("#today-label").textContent=new Date().toLocaleDateString("ro-RO",{weekday:"long",day:"numeric",month:"long",year:"numeric"});

function updateStats(){
  document.querySelector("#stat-cards").textContent=cards.length;
  const monthCount=cards.filter(card=>card.createdAt?.slice(0,7)===currentMonth).length;
  document.querySelector("#stat-month-cards").textContent=`${monthCount} ${monthCount===1?"luna aceasta":"luna aceasta"}`;
  document.querySelector("#stat-sessions").textContent=cards.reduce((sum,card)=>sum+(Number(card.sessionCount)||0),0);
  document.querySelector("#stat-value").textContent=money(cards.reduce((sum,card)=>sum+(Number(card.total)||0),0));
  document.querySelector("#stat-discounts").textContent=money(cards.reduce((sum,card)=>sum+(Number(card.discount)||0),0));
}

function renderCards(query=""){
  const normalized=query.trim().toLocaleLowerCase("ro");
  const filtered=cards.filter(card=>`${card.clientName} ${card.validityLabel||card.monthLabel}`.toLocaleLowerCase("ro").includes(normalized));
  const tbody=document.querySelector("#card-history"),empty=document.querySelector("#empty-dashboard");
  tbody.innerHTML=filtered.map(card=>{
    const tags=(card.items||[]).map(item=>{const detail=item.detail||"Serviciu selectat",quantity=Number(item.quantity)||1;return `<span><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(detail)} × ${quantity}</small></span>`}).join("");
    return `<tr><td data-label="Client"><strong>${escapeHtml(card.clientName)}</strong><small>${card.submissionStatus==='whatsapp_opened'?'WhatsApp deschis · livrare neconfirmată':'Card vechi · solicitare neconfirmată'}</small><small>${card.paymentStatus==='paid'?'Plată confirmată':'Neachitat / plată neconfirmată'}${card.paymentMethod==='cash'?' · cash la recepție':''}</small><small>${escapeHtml(card.id||'')}</small></td><td data-label="Valabilitate"><strong>${escapeHtml(card.validityLabel||card.monthLabel)}</strong></td><td data-label="Servicii"><div class="service-tags">${tags}</div></td><td data-label="Ședințe"><strong>${Number(card.sessionCount)||0}</strong></td><td data-label="Total" class="total-cell">${money(card.total)}</td><td data-label="Înregistrat">${dateLabel(card.createdAt)}</td></tr>`;
  }).join("");
  empty.classList.toggle("is-visible",filtered.length===0);
  document.querySelector("table").style.display=filtered.length?"table":"none";
}

function escapeHtml(value=""){const node=document.createElement("div");node.textContent=value;return node.innerHTML}
document.querySelector("#search-cards").addEventListener("input",event=>renderCards(event.target.value));
updateStats();renderCards();
window.addEventListener('storage',event=>{if(event.key!==STORAGE_KEY)return;try{const records=JSON.parse(event.newValue||'[]');cards=uniqueCards(Array.isArray(records)?records:[]);updateStats();renderCards(document.querySelector('#search-cards').value)}catch{}});
