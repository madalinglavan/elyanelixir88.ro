(() => {
  const button=document.getElementById('share-card-image');
  const status=document.getElementById('image-share-status');
  let busy=false;
  button.addEventListener('click',async()=>{
    if(busy)return;
    try {
      const records=JSON.parse(localStorage.getItem('elyanMembershipCards')||'[]');
      const signature=membershipWorkflow.fingerprint({clientName:clientNameInput.value,activationDate:monthInput.value,items:[...selections.values()]});
      const record=records.find(item=>item.submissionStatus && item.fingerprint===signature);
      if(!record){status.textContent='Solicită mai întâi abonamentul prin butonul WhatsApp, apoi trimite imaginea în aceeași conversație.';return;}
      if(record.imageShareHandedOffAt){status.textContent='Cardul acestei solicitări a fost deja predat meniului de partajare pe '+new Date(record.imageShareHandedOffAt).toLocaleString('ro-RO')+'. Verifică în WhatsApp dacă l-ai trimis salonului. Livrarea nu este confirmată automat.';return;}
      const image=createMembershipCardImage();if(!image)return;
      const bytes=Uint8Array.from(atob(image.dataUrl.split(',')[1]),char=>char.charCodeAt(0));
      const file=new File([bytes],image.filename,{type:'image/png'});
      if(!navigator.share || !navigator.canShare?.({files:[file]})){
        status.textContent='Acest browser nu poate partaja imaginea direct. Apasă „Descarcă imaginea”, apoi atașează fișierul în WhatsApp la Elyan Elixir 88, 0769 729 403. Nu înregistrăm o solicitare nouă.';
        return;
      }
      busy=true;button.disabled=true;
      status.textContent='Alege WhatsApp, apoi conversația Elyan Elixir 88 (0769 729 403) și confirmă trimiterea imaginii.';
      await navigator.share({files:[file],title:'Card Elyan Membership',text:`Card abonament pentru ${record.clientName}. Referință: ${record.id}. ${record.validityLabel}. Cash la recepție, neachitat.`});
      // A completed share promise is not proof of WhatsApp delivery/payment.
      const latest=JSON.parse(localStorage.getItem('elyanMembershipCards')||'[]');
      const existing=latest.find(item=>item.id===record.id);
      if(existing){existing.imageShareHandedOffAt=new Date().toISOString();localStorage.setItem('elyanMembershipCards',JSON.stringify(latest));}
      status.textContent='Cardul a fost predat meniului de partajare. Verifică în conversația WhatsApp că imaginea a ajuns la salon. Nu am adăugat un abonament nou și nu am confirmat plata.';
    } catch(error){
      status.textContent=error.name==='AbortError'?'Partajarea a fost anulată. Poți încerca din nou.':'Imaginea nu a putut fi partajată sau starea locală nu a putut fi salvată. Verifică WhatsApp; poți descărca și atașa imaginea manual.';
    } finally{busy=false;button.disabled=false;}
  });
})();
