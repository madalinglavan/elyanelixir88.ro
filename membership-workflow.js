/* Local duplicate protection. A server and payment webhooks are required for
   cross-device registration and authoritative delivery/payment confirmation. */
const membershipWorkflow = (() => {
  const key = 'elyanMembershipCards';
  const status = document.getElementById('submission-status');
  const payment = () => document.querySelector('input[name="payment-method"]:checked')?.value;
  const fingerprint = record => JSON.stringify([
    record.clientName.trim().normalize('NFC').toLocaleLowerCase('ro').replace(/\s+/g,' '),
    record.activationDate || record.startAt?.slice(0,10) || record.month,
    (record.items || []).map(item => [item.title,item.detail,item.quantity,item.price]).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)))
  ]);
  function read() {
    const records = JSON.parse(localStorage.getItem(key) || '[]');
    if (!Array.isArray(records)) throw new Error('Registrul local nu este valid.');
    return records;
  }
  function snapshot() {
    const items = [...selections.values()].map(item=>({...item}));
    const validity = calculateValidity(monthInput.value);
    const count = items.filter(item=>item.qualifiesForMembership!==false).reduce((sum,item)=>sum+item.quantity,0);
    if (!clientNameInput.value.trim() || !validity || (!items.some(item=>item.fixedMonthly) && count<3)) throw new Error('Completează datele și selectează un abonament eligibil.');
    const subtotal = items.reduce((sum,item)=>sum+item.price*item.quantity,0);
    const discount = count>=3 ? items.filter(item=>item.discountable!==false).reduce((sum,item)=>sum+item.price*item.quantity,0)*.15 : 0;
    return {clientName:clientNameInput.value.trim(),activationDate:monthInput.value,startAt:validity.start.toISOString(),endAt:validity.end.toISOString(),validityLabel:validity.label,month:monthInput.value.slice(0,7),monthLabel:validity.label,sessionCount:items.reduce((sum,item)=>sum+item.quantity,0),subtotal,discount,total:subtotal-discount,items};
  }
  let busy = false;
  async function submit(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    if (busy) return;
    if (!payment()) { status.textContent='Alege mai întâi metoda de plată, în formularul abonamentului.'; return; }
    if (payment()!=='cash') { status.textContent='Plata online va fi disponibilă după conectarea Stripe. Nu s-a efectuat nicio plată.'; return; }
    busy=true;
    let popup;
    try {
      // Reserve a window during the user gesture so browser popup blocking does
      // not interfere with the asynchronous, cross-tab critical section.
      popup=window.open('about:blank','_blank');
      if (!popup) throw new Error('Permite deschiderea WhatsApp în browser, apoi încearcă din nou.');
      popup.opener=null;
      const commit = () => {
        const record=snapshot(), records=read(), signature=fingerprint(record);
        const previous=records.find(item=>item.submissionStatus && (item.fingerprint || fingerprint(item))===signature);
        if (previous) {
          popup.close();
          status.textContent=`Această solicitare (${record.sessionCount} selecții, activare ${record.activationDate}) a fost deja inițiată pe ${new Date(previous.createdAt).toLocaleString('ro-RO')}. Nu o înregistrăm din nou. WhatsApp nu confirmă automat livrarea; verifică mesajul în conversație sau contactează salonul.`;
          return;
        }
        record.id=crypto.randomUUID();record.fingerprint=signature;
        record.createdAt=new Date().toISOString();record.paymentMethod='cash';record.paymentStatus='unpaid';record.submissionStatus='whatsapp_opened';
        const url=new URL(orderButton.href);
        if (url.hostname!=='wa.me') throw new Error('Solicitarea nu este pregătită. Generează din nou cardul.');
        url.searchParams.set('text',url.searchParams.get('text')+`\n\nReferință solicitare: ${record.id}\nMetodă de plată: cash la recepție\nStare plată: neachitat. Solicit confirmarea salonului.`);
        localStorage.setItem(key,JSON.stringify([record,...records]));
        try { popup.location.href=url.href; } catch (error) {
          localStorage.setItem(key,JSON.stringify(records));throw error;
        }
        status.textContent=`WhatsApp a fost deschis pentru solicitarea ${record.id}. Apasă „Trimite” în WhatsApp. Livrarea și acceptarea nu sunt confirmate automat. Plata cash este neachitată.`;
      };
      if (navigator.locks) await navigator.locks.request('elyan-membership-submit',commit);
      else throw new Error('Browserul nu permite protecția sigură între file. Folosește o versiune actualizată de Chrome, Edge sau Safari.');
    } catch (error) {
      popup?.close();status.textContent=error.message+' Nu am înregistrat o solicitare nouă.';
    } finally { busy=false; }
  }
  orderButton.addEventListener('click',submit,true);
  document.querySelectorAll('input[name="payment-method"]').forEach(input=>input.addEventListener('change',()=>{
    document.getElementById('card-payment').textContent='Plată: cash la recepție · neachitat';
  }));
  return {fingerprint,payment};
})();
