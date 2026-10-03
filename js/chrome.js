// Shared header / theme / menu behaviour for the inner pages (service.html, detail.html).
window.initPageChrome = function (opts) {
  const $ = id => document.getElementById(id);
  $('year').textContent = new Date().getFullYear();
  const header = $('header'), hero = $(opts.heroId);
  const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark';
  const onScroll = () => {
    header.classList.toggle('on-dark', isDark() || window.scrollY < hero.offsetHeight - 80);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    $('scrollProgress').style.setProperty('--progress', max > 0 ? window.scrollY / max : 0);
    $('toTop').classList.toggle('show', window.scrollY > window.innerHeight * 0.6);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const themeToggle = $('themeToggle');
  const syncTheme = () => themeToggle.setAttribute('aria-label', isDark() ? 'Switch to light mode' : 'Switch to dark mode');
  themeToggle.addEventListener('click', () => {
    const t = isDark() ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem('airking-theme', t); } catch (e) {}
    syncTheme(); onScroll();
  });
  syncTheme();

  const nav = $('nav'), toggle = $('navToggle'), dropdown = $('equipDropdown'), ddToggle = dropdown.querySelector('.dropdown-toggle');
  const setMenu = o => { nav.classList.toggle('open', o); toggle.setAttribute('aria-expanded', o); };
  const setDD = o => { dropdown.classList.toggle('open', o); ddToggle.setAttribute('aria-expanded', o); };
  toggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  ddToggle.addEventListener('click', () => setDD(!dropdown.classList.contains('open')));
  document.addEventListener('click', e => { if (!dropdown.contains(e.target)) setDD(false); if (!header.contains(e.target)) setMenu(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { setDD(false); setMenu(false); } });
  // the section this page belongs to stays highlighted in the nav
  const svcLink = nav.querySelector(`[href="${opts.activeHref}"], [data-section="${opts.activeHref.split('#')[1]}"]`);
  if (svcLink) { svcLink.classList.add('active'); svcLink.setAttribute('aria-current', 'page'); }
  const bubble = $('navBubble');
  const placeBubble = () => {
    if (!svcLink || getComputedStyle(bubble).display === 'none') return;
    // measure against the nav itself (the Equipment link sits inside the dropdown wrapper)
    const n = nav.getBoundingClientRect(), r = svcLink.getBoundingClientRect();
    bubble.style.width = r.width + 'px'; bubble.style.height = r.height + 'px';
    bubble.style.top = (r.top - n.top) + 'px'; bubble.style.transform = `translateX(${r.left - n.left}px)`;
    bubble.style.opacity = 1;
  };
  window.addEventListener('load', placeBubble); window.addEventListener('resize', placeBubble); placeBubble();
};
