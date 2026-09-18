(() => {
  let timer;
  let navigationLoader = document.getElementById('loader');
  if (!navigationLoader) {
    navigationLoader = document.createElement('div');
    navigationLoader.id = 'navigation-loader';
    navigationLoader.innerHTML = '<div class="loader-content"><img src="images/logo.png" alt=""><div class="loader-line"></div></div>';
    document.body.append(navigationLoader);
  }
  navigationLoader.setAttribute('role', 'status');
  navigationLoader.setAttribute('aria-label', 'Se deschide secțiunea dorită');
  const style = document.createElement('style');
  style.textContent = '#navigation-loader{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;background:#073b2d;opacity:0;visibility:hidden;pointer-events:none}#loader.navigation-visible,#navigation-loader.navigation-visible{opacity:1!important;visibility:visible!important;pointer-events:auto!important;transition:none!important}html.navigation-jump{scroll-behavior:auto!important}';
  document.head.append(style);
  function show() {
    clearTimeout(timer);
    navigationLoader.classList.add('navigation-visible');
    navigationLoader.setAttribute('aria-hidden', 'false');
    document.body.setAttribute('aria-busy', 'true');
  }
  function hide() {
    navigationLoader.classList.remove('navigation-visible');
    navigationLoader.setAttribute('aria-hidden', 'true');
    document.body.removeAttribute('aria-busy');
  }
  function sectionNavigation(url, updateHistory) {
    let target;
    try { target = document.getElementById(decodeURIComponent(url.hash.slice(1))); } catch { return false; }
    if (!target) return false;
    show();
    document.querySelector('.burger')?.classList.remove('active');
    document.querySelector('.burger')?.setAttribute('aria-expanded', 'false');
    document.querySelector('.mobile-menu')?.classList.remove('active');
    document.querySelector('.mobile-menu')?.setAttribute('aria-hidden', 'true');
    document.querySelector('.mobile-overlay')?.classList.remove('active');
    document.body.classList.remove('menu-open');
    if (updateHistory) history.pushState(null, '', url.hash);
    // Activate hidden mobile service categories before measuring the destination.
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    timer = setTimeout(() => {
      document.documentElement.classList.add('navigation-jump');
      const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 90;
      window.scrollTo({top: Math.max(0, target.getBoundingClientRect().top + scrollY - offset), behavior: 'instant'});
      const focusTarget = target.querySelector('h1,h2,h3') || target;
      if (!focusTarget.hasAttribute('tabindex')) focusTarget.setAttribute('tabindex', '-1');
      focusTarget.focus({preventScroll:true});
      timer = setTimeout(() => {
        document.documentElement.classList.remove('navigation-jump');
        hide();
      }, 220);
    }, 120);
    return true;
  }
  window.addEventListener('click', event => {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const anchor = event.target.closest('a[href]');
    if (!anchor || anchor.hasAttribute('download') || (anchor.target && anchor.target !== '_self')) return;
    const url = new URL(anchor.href, location.href);
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.search === location.search) {
      if (!url.hash || !sectionNavigation(url, true)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    } else if (/\.html$/.test(url.pathname)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      show();
      timer = setTimeout(() => location.assign(url.href), 120);
    }
  }, true);
  window.addEventListener('popstate', () => { if (location.hash) sectionNavigation(new URL(location.href), false); });
  window.addEventListener('pageshow', hide);
})();
