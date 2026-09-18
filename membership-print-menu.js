(() => {
  const button=document.getElementById('print-card-menu');
  const options=document.getElementById('print-card-options');
  button.addEventListener('click',()=>{
    options.hidden=!options.hidden;
    button.setAttribute('aria-expanded',String(!options.hidden));
    if(!options.hidden)document.getElementById('whatsapp-order').focus({preventScroll:true});
  });
  generateButton.addEventListener('click',()=>{options.hidden=true;button.setAttribute('aria-expanded','false');});
})();
