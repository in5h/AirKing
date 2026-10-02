// Address that receives website queries.
const SALES_EMAIL = 'sales@nextexpk.com';

const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.getElementById('year').textContent = new Date().getFullYear();

// ---------- Header: glass tint over the hero, hide on scroll down, scroll progress, back-to-top ----------
const header = document.getElementById('header');
const hero = document.getElementById('home');
const progress = document.getElementById('scrollProgress');
const toTop = document.getElementById('toTop');
let lastY = window.scrollY;

const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark';

const onScroll = () => {
  const y = window.scrollY;
  header.classList.toggle('on-dark', isDark() || y < hero.offsetHeight - 80);
  const menuOpen = nav.classList.contains('open') || dropdown.classList.contains('open');
  header.classList.toggle('hide', y > lastY && y > 300 && !menuOpen);
  lastY = y;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.setProperty('--progress', max > 0 ? y / max : 0);
  toTop.classList.toggle('show', y > window.innerHeight);
};

// ---------- Light / dark mode ----------
const themeToggle = document.getElementById('themeToggle');
const syncThemeLabel = () => themeToggle.setAttribute('aria-label', isDark() ? 'Switch to light mode' : 'Switch to dark mode');
themeToggle.addEventListener('click', () => {
  const next = isDark() ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  try { localStorage.setItem('airking-theme', next); } catch (e) {}
  syncThemeLabel();
  onScroll();
  moveBubble(activeLink);
});
syncThemeLabel();

// ---------- Mobile menu ----------
const toggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');
const setMenu = open => {
  nav.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', open);
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
};
toggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));

// ---------- Equipment dropdown: click/tap to open (hover also opens it on desktop via CSS) ----------
const dropdown = document.getElementById('equipDropdown');
const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
const setDropdown = open => {
  dropdown.classList.toggle('open', open);
  dropdownToggle.setAttribute('aria-expanded', open);
};
dropdownToggle.addEventListener('click', () => setDropdown(!dropdown.classList.contains('open')));
document.addEventListener('click', e => {
  if (!dropdown.contains(e.target)) setDropdown(false);
  if (!header.contains(e.target)) setMenu(false);
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') { setDropdown(false); setMenu(false); } });

nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  setMenu(false);
  setDropdown(false);
}));

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---------- iOS-style bubble: sits under the active section's link and follows the pointer ----------
const bubble = document.getElementById('navBubble');
const navLinks = [...nav.querySelectorAll('.nav-link')];
const linkFor = id => navLinks.find(l => (l.dataset.section || (l.getAttribute('href') || '').slice(1)) === id);
let activeLink = null;

const moveBubble = link => {
  if (!link || getComputedStyle(bubble).display === 'none') { bubble.style.opacity = 0; return; }
  bubble.style.width = link.offsetWidth + 'px';
  bubble.style.height = link.offsetHeight + 'px';
  bubble.style.top = link.offsetTop + 'px';
  bubble.style.transform = `translateX(${link.offsetLeft}px)`;
  bubble.style.opacity = 1;
};
const setActive = link => {
  if (link === activeLink) return;
  navLinks.forEach(l => l.classList.toggle('active', l === link));
  if (link) link.setAttribute('aria-current', 'true');
  if (activeLink) activeLink.removeAttribute('aria-current');
  activeLink = link;
  moveBubble(link);
};
if (canHover) {
  navLinks.forEach(l => l.addEventListener('pointerenter', () => moveBubble(l)));
  nav.addEventListener('pointerleave', () => moveBubble(activeLink));
}
window.addEventListener('resize', () => moveBubble(activeLink));

// Scrollspy: the section crossing a line 35% down the viewport is the active one
const spySections = ['about', 'services', 'history', 'equipment', 'control', 'clients', 'team', 'contact']
  .map(id => document.getElementById(id)).filter(Boolean);
const spy = () => {
  const line = window.innerHeight * 0.35;
  let current = null;
  spySections.forEach(sec => { if (sec.getBoundingClientRect().top <= line) current = sec.id; });
  // sections without their own link (why/results/industries) keep the previous link lit
  if (!current) return setActive(null);
  let link = linkFor(current);
  if (!link) {
    const idx = spySections.findIndex(s => s.id === current);
    for (let i = idx; i >= 0 && !link; i--) link = linkFor(spySections[i].id);
  }
  setActive(link || null);
};
window.addEventListener('scroll', spy, { passive: true });
window.addEventListener('load', spy);
spy();

// Customer tabs
const tabs = document.querySelectorAll('.tab');
tabs.forEach(tab => tab.addEventListener('click', () => {
  tabs.forEach(t => {
    const active = t === tab;
    t.classList.toggle('active', active);
    t.setAttribute('aria-selected', active);
    document.getElementById(t.dataset.tab).classList.toggle('active', active);
  });
}));

// Reveal sections and count up stats when they scroll into view
const revealTargets = document.querySelectorAll('.section-head, .pillar, .svc-card, .about-grid > *, .timeline-item, .division-title, .card, .control-grid > *, .why, .reason-box, .saving-card, .industry, .table-wrap, .member, .contact-grid > *');
revealTargets.forEach(el => {
  el.classList.add('reveal');
  // stagger siblings in grids so cards cascade in
  const i = [...el.parentElement.children].indexOf(el);
  if (el.parentElement.children.length > 2) el.style.transitionDelay = `${Math.min(i, 8) * 70}ms`;
});

const countUp = el => {
  const target = Number(el.dataset.count);
  const start = performance.now();
  const step = now => {
    const t = Math.min((now - start) / 1400, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3))).toLocaleString('en-US');
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      entry.target.querySelectorAll('[data-count]').forEach(countUp);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.15 });
  revealTargets.forEach(el => io.observe(el));
} else {
  revealTargets.forEach(el => el.classList.add('visible'));
}

// Query form: validates, then opens the visitor's email app with the query pre-filled.
const form = document.getElementById('queryForm');
const status = document.getElementById('formStatus');

form.addEventListener('submit', e => {
  e.preventDefault();
  let valid = true;
  form.querySelectorAll('[required]').forEach(field => {
    const ok = field.value.trim() !== '' && (field.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value));
    field.classList.toggle('invalid', !ok);
    if (!ok) valid = false;
  });
  if (!valid) {
    status.className = 'form-status err';
    status.textContent = 'Please fill in your name, a valid email and your query.';
    return;
  }

  const d = Object.fromEntries(new FormData(form));
  const subject = `Website query: ${d.product} – ${d.name}`;
  const body = [
    `Name: ${d.name}`,
    `Company: ${d.company || '-'}`,
    `Email: ${d.email}`,
    `Phone: ${d.phone || '-'}`,
    `Interested in: ${d.product}`,
    '',
    d.message,
  ].join('\n');

  window.location.href = `mailto:${SALES_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  status.className = 'form-status ok';
  status.textContent = 'Thank you! Your email app has opened with your query — just press Send.';
  form.reset();
});

// ---------- Interactive cards: 3D tilt + cursor spotlight ----------
if (canHover && !reduceMotion) {
  document.querySelectorAll('.card, .svc-card, .member, .saving-card, .pillar, .why, .industry, .hero-stat').forEach(card => {
    card.classList.add('tilt');
    const max = card.classList.contains('card') || card.classList.contains('svc-card') ? 7 : 10;
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      card.style.setProperty('--mx', `${px * 100}%`);
      card.style.setProperty('--my', `${py * 100}%`);
      card.classList.add('tilting');
      card.style.transitionDelay = '0ms';
      card.style.transform = `perspective(900px) rotateX(${(0.5 - py) * max}deg) rotateY(${(px - 0.5) * max}deg) translateY(-6px)`;
    });
    card.addEventListener('pointerleave', () => {
      card.classList.remove('tilting');
      card.style.transform = '';
    });
  });

  // ---------- Magnetic buttons ----------
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('pointermove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
  });
}
