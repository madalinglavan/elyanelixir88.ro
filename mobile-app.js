(() => {
  const categories=[{id:'massage',label:'Masaj',icon:'spa'},{id:'fitness',label:'Fitness',icon:'dumbbell'},{id:'pedichiura',label:'Pedichiură',icon:'shoe-prints'},{id:'nails',label:'Healthy Nails',icon:'hand-sparkles'}];
  const isConfigurator=Boolean(document.querySelector('#service-catalog'));
  document.body.classList.add('elyan-app',isConfigurator?'app-configurator':'app-salon');
  const home=isConfigurator?'index.html#home':'#home';
  const services=isConfigurator?'index.html#massage':'#massage';
  const contact=isConfigurator?'index.html#contact':'#contact';
  const dock=document.createElement('nav');dock.className='app-dock';dock.setAttribute('aria-label','Navigare principală');
  dock.innerHTML=`<a href="${home}" data-tab="home"><i class="fa-solid fa-house"></i><span>Acasă</span></a><a href="${services}" data-tab="services"><i class="fa-solid fa-spa"></i><span>Servicii</span></a><a href="membership.html" data-tab="membership" class="${isConfigurator?'is-active':''}"><i class="fa-solid fa-crown"></i><span>Abonament</span></a><a href="${contact}" data-tab="contact"><i class="fa-regular fa-comment-dots"></i><span>Contact</span></a>`;
  document.body.append(dock);
  function activateCategory(id){categories.forEach(category=>document.getElementById(category.id)?.classList.toggle('app-category-active',category.id===id));document.querySelectorAll('.app-category-tabs a').forEach(link=>{const active=link.hash==='#'+id;link.classList.toggle('is-active',active);link.setAttribute('aria-current',active?'true':'false')})}
  function categoryForHash(hash){return categories.find(category=>{const section=document.getElementById(category.id),target=document.getElementById(hash.replace('#',''));return section&&(target===section||section.contains(target))})?.id}
  if(!isConfigurator){
    const tabs=document.createElement('nav');tabs.className='app-category-tabs';tabs.setAttribute('aria-label','Categorii de servicii');tabs.innerHTML=categories.map(category=>`<a href="#${category.id}"><i class="fa-solid fa-${category.icon}"></i><span>${category.label}</span></a>`).join('');document.getElementById('massage')?.before(tabs);
    activateCategory(categoryForHash(location.hash)||'massage');
    document.addEventListener('click',event=>{const anchor=event.target.closest('a[href^="#"]');if(!anchor)return;const id=categoryForHash(anchor.hash);if(id)activateCategory(id)},true);
    window.addEventListener('hashchange',()=>{const id=categoryForHash(location.hash);if(id)activateCategory(id)});
    const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;const tab=entry.target.id==='contact'?'contact':categories.some(category=>category.id===entry.target.id)?'services':entry.target.id==='membership'?'membership':'home';dock.querySelectorAll('a').forEach(link=>{const active=link.dataset.tab===tab;link.classList.toggle('is-active',active);if(active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current')})})},{rootMargin:'-15% 0px -65% 0px'});['home','membership','contact',...categories.map(category=>category.id)].forEach(id=>{const el=document.getElementById(id);if(el)observer.observe(el)});
  }else{
    const peek=document.createElement('button');peek.type='button';peek.className='app-checkout-peek';peek.innerHTML='<span><small>Abonamentul tău</small><strong>0 Lei</strong></span><span>Vezi selecția <i class="fa-solid fa-arrow-up"></i></span>';peek.addEventListener('click',()=>document.querySelector('.summary').scrollIntoView({behavior:'smooth',block:'start'}));document.body.append(peek);const total=document.getElementById('total');new MutationObserver(()=>peek.querySelector('strong').textContent=total.textContent).observe(total,{childList:true,subtree:true});
  }
  if(isConfigurator){const summary=document.querySelector('.summary');const peek=document.querySelector('.app-checkout-peek');if(summary&&peek)new IntersectionObserver(entries=>{peek.classList.toggle('is-summary-visible',entries[0].isIntersecting)},{threshold:0,rootMargin:'-80px 0px -180px 0px'}).observe(summary)}
  let installPrompt;const install=document.createElement('button');install.type='button';install.className='app-install';install.hidden=true;install.innerHTML='<i class="fa-solid fa-arrow-down"></i><span>Instalează Elyan</span>';(document.querySelector('.navbar')||document.querySelector('.membership-header'))?.append(install);
  const isIOS=/iPhone|iPad|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  const standalone=window.matchMedia('(display-mode: standalone)');
  const isInstalled=()=>standalone.matches||navigator.standalone===true;
  let iosDialog;
  if(isIOS){
    install.hidden=isInstalled();
    install.setAttribute('aria-haspopup','dialog');
    install.setAttribute('aria-controls','ios-install-dialog');
    iosDialog=document.createElement('dialog');iosDialog.id='ios-install-dialog';iosDialog.className='ios-install-dialog';iosDialog.setAttribute('aria-labelledby','ios-install-title');
    iosDialog.innerHTML='<button type="button" class="ios-install-close" aria-label="Închide instrucțiunile">×</button><div class="ios-install-icon"><i class="fa-solid fa-mobile-screen-button" aria-hidden="true"></i></div><span class="ios-install-eyebrow">ELYAN PE TELEFONUL TĂU</span><h2 id="ios-install-title">Instalează aplicația</h2><p>Pe iPhone sau iPad, instalarea se face din meniul <strong>Safari</strong>.</p><ol><li><strong>Deschide acest site în Safari.</strong><span>Dacă îl vezi în alt browser sau în Instagram/Facebook, copiază adresa și deschide-o în Safari.</span></li><li><strong>Apasă Partajare.</strong><span>Este pictograma cu un pătrat și o săgeată în sus. În unele versiuni se află în meniul „Mai multe”.</span></li><li><strong>Alege „Adaugă pe ecranul principal”.</strong><span>Dacă opțiunea lipsește, caută în „Editează acțiunile”.</span></li><li><strong>Confirmă cu „Adaugă”.</strong><span>Lasă activ „Deschide ca aplicație web”, dacă apare. Găsești apoi Elyan pe ecranul principal.</span></li></ol><button type="button" class="ios-install-done">Am înțeles <i class="fa-solid fa-check" aria-hidden="true"></i></button>';
    document.body.append(iosDialog);
    const closeInstructions=()=>iosDialog.close();
    iosDialog.querySelector('.ios-install-close').addEventListener('click',closeInstructions);
    iosDialog.querySelector('.ios-install-done').addEventListener('click',closeInstructions);
    iosDialog.addEventListener('click',event=>{if(event.target!==iosDialog)return;const rect=iosDialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)closeInstructions()});
    iosDialog.addEventListener('close',()=>install.focus());
  }
  window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;install.hidden=isInstalled()});
  install.addEventListener('click',async()=>{
    if(isInstalled())return;
    if(isIOS){iosDialog.showModal();return}
    if(!installPrompt)return;
    const prompt=installPrompt;installPrompt=null;
    try{await prompt.prompt();const choice=await prompt.userChoice;if(choice.outcome==='accepted')install.hidden=true}catch{install.hidden=true}
  });
  window.addEventListener('appinstalled',()=>{install.hidden=true;if(iosDialog?.open)iosDialog.close()});
  standalone.addEventListener('change',()=>{if(isInstalled())install.hidden=true;else if(isIOS)install.hidden=false});
  if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
})();
