/* Presentation only: no requests, storage writes or payment state changes. */
(() => {
  const catalog=document.querySelector('#service-catalog');
  if(catalog){
    const refresh=()=>catalog.querySelectorAll('.category').forEach(category=>{
      let count=0;
      category.querySelectorAll('.option-row').forEach(row=>{
        const quantity=Number(row.querySelector('output')?.textContent)||0;
        row.classList.toggle('is-selected',quantity>0);count+=quantity;
        const minus=row.querySelector('[data-action="minus"]');if(minus)minus.disabled=quantity===0;
      });
      const title=category.querySelector('.category-button strong');
      let badge=title.querySelector('.atelier-category-count');
      if(!badge){badge=document.createElement('span');badge.className='atelier-category-count';title.append(badge)}
      badge.hidden=count===0;badge.textContent=String(count);badge.setAttribute('aria-label',`${count} selecții`);
    });
    catalog.querySelectorAll('output').forEach(output=>new MutationObserver(refresh).observe(output,{subtree:true,characterData:true,childList:true}));
    refresh();
  }
  const modal=document.querySelector('#card-modal');
  if(modal)modal.addEventListener('keydown',event=>{
    if(event.key!=='Tab'||!modal.classList.contains('is-open'))return;
    const focusables=[...modal.querySelectorAll('button:not(:disabled),a[href],input:not(:disabled)')].filter(element=>element.getClientRects().length);
    const first=focusables[0],last=focusables[focusables.length-1];if(!first)return;
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
  });
})();
