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
  let installPrompt;const install=document.createElement('button');install.type='button';install.className='app-install';install.hidden=true;install.innerHTML='<i class="fa-solid fa-arrow-down"></i><span>Instalează Elyan</span>';(document.querySelector('.navbar')||document.querySelector('.membership-header'))?.append(install);
  window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;install.hidden=false});install.addEventListener('click',async()=>{if(!installPrompt)return;await installPrompt.prompt();installPrompt=null;install.hidden=true});window.addEventListener('appinstalled',()=>install.hidden=true);
  if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
})();
