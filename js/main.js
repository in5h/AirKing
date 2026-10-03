// Address that receives website queries.
const SALES_EMAIL = 'sales@nextexpk.com';

const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.getElementById('year').textContent = new Date().getFullYear();

// ---------- Header: glass tint over the hero, scroll progress, back-to-top ----------
const header = document.getElementById('header');
const hero = document.getElementById('home');
const progress = document.getElementById('scrollProgress');
const toTop = document.getElementById('toTop');

const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark';

const onScroll = () => {
  const y = window.scrollY;
  header.classList.toggle('on-dark', isDark() || y < hero.offsetHeight - 80);
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

// ---------- Dropdown menus (Services, Equipment, Control): click/tap to open, hover also opens them on desktop via CSS ----------
const dropdowns = [...document.querySelectorAll('.nav .dropdown')];
const setDropdown = (dd, open) => {
  dd.classList.toggle('open', open);
  dd.querySelector('.dropdown-toggle').setAttribute('aria-expanded', open);
};
const closeDropdowns = (except) => dropdowns.forEach(dd => { if (dd !== except) setDropdown(dd, false); });
dropdowns.forEach(dd => dd.querySelector('.dropdown-toggle').addEventListener('click', () => {
  closeDropdowns(dd);
  setDropdown(dd, !dd.classList.contains('open'));
}));
document.addEventListener('click', e => {
  if (!e.target.closest('.nav .dropdown')) closeDropdowns();
  if (!header.contains(e.target)) setMenu(false);
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeDropdowns(); setMenu(false); } });

nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  setMenu(false);
  closeDropdowns();
}));

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---------- iOS-style bubble: sits under the active section's link and follows the pointer ----------
const bubble = document.getElementById('navBubble');
const navLinks = [...nav.querySelectorAll('.nav-link')];
// only links that are actually shown (the "Contact" link exists only in the phone menu)
const linkFor = id => navLinks.find(l => (l.dataset.section || (l.getAttribute('href') || '').slice(1)).split(' ').includes(id) && l.getClientRects().length);
let activeLink = null;
let bubbleTarget = null;   // the link the bubble is on right now (hovered or active)

const moveBubble = link => {
  bubbleTarget = link;
  if (!link || getComputedStyle(bubble).display === 'none') { bubble.style.opacity = 0; return; }
  // measure against the nav itself (dropdown toggles sit inside a wrapper)
  const n = nav.getBoundingClientRect(), r = link.getBoundingClientRect();
  const wasHidden = getComputedStyle(bubble).opacity === '0';
  if (wasHidden) bubble.style.transition = 'none';   // appear in place instead of sliding in from the left
  bubble.style.width = r.width + 'px';
  bubble.style.height = r.height + 'px';
  bubble.style.top = (r.top - n.top) + 'px';
  bubble.style.transform = `translateX(${r.left - n.left}px)`;
  if (wasHidden) { void bubble.offsetWidth; bubble.style.transition = ''; }
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
// the links shift whenever the bar's contents change size (e.g. the quote button's wording
// changes per section) — keep the bubble locked to its link when that happens
const realign = () => { if (bubbleTarget) moveBubble(bubbleTarget); };
window.addEventListener('resize', realign);
if ('ResizeObserver' in window) {
  const ro = new ResizeObserver(realign);
  [nav, document.querySelector('.nav-shell'), document.querySelector('.nav-cta')].forEach(el => el && ro.observe(el));
}
document.fonts && document.fonts.ready.then(realign);

// Scrollspy: the section crossing a line 35% down the viewport is the active one
const spySections = ['about', 'services', 'history', 'factory', 'equipment', 'control', 'why', 'results', 'industries', 'clients', 'team', 'contact']
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
const revealTargets = document.querySelectorAll('.section-head, .pillar, .svc-card, .g-item, .about-grid > *, .timeline-item, .division-title, .card, .control-grid > *, .why, .reason-box, .saving-card, .industry, .table-wrap, .member, .contact-grid > *');
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

// ---------- Quotation form: emailed to the sales team via FormSubmit (no backend needed) ----------
// The first submission sends a one-time activation email to SALES_EMAIL; after that, every request arrives as an email.
const FORM_ENDPOINT = `https://formsubmit.co/ajax/${SALES_EMAIL}`;
const form = document.getElementById('queryForm');
const status = document.getElementById('formStatus');
const submitBtn = document.getElementById('formSubmit');
const formFields = [...form.children];

const validate = () => {
  let valid = true, first = null;
  form.querySelectorAll('[required]').forEach(field => {
    const ok = field.value.trim() !== '' && (field.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim()));
    field.classList.toggle('invalid', !ok);
    field.setAttribute('aria-invalid', !ok);
    if (!ok) { valid = false; first = first || field; }
  });
  if (first) first.focus();
  return valid;
};
form.querySelectorAll('[required]').forEach(f => f.addEventListener('input', () => f.classList.remove('invalid')));

const mailtoLink = d => {
  const body = [`Name: ${d.name}`, `Company: ${d.company || '-'}`, `Email: ${d.email}`, `Phone: ${d.phone || '-'}`, `Interested in: ${d.product}`, '', d.message].join('\n');
  return `mailto:${SALES_EMAIL}?subject=${encodeURIComponent(`Quotation request: ${d.product} – ${d.name}`)}&body=${encodeURIComponent(body)}`;
};

const showSuccess = d => {
  formFields.forEach(el => { el.hidden = true; });
  const box = document.createElement('div');
  box.className = 'form-success';
  box.setAttribute('role', 'status');
  box.innerHTML = `<span class="tick" aria-hidden="true">✓</span>
    <h3>Quotation request sent!</h3>
    <p>Thank you${d.name ? ', ' + d.name.split(' ')[0].replace(/[<>&"]/g, '') : ''}. Our sales team has received your request and will reply to <strong></strong> shortly.</p>
    <button type="button" class="btn btn-sm">Send another request</button>`;
  box.querySelector('strong').textContent = d.email;
  box.querySelector('button').addEventListener('click', () => {
    box.remove();
    formFields.forEach(el => { el.hidden = false; });
    form.reset(); status.textContent = ''; status.className = 'form-status';
    form.querySelector('input[name="name"]').focus();
  });
  form.appendChild(box);
  box.querySelector('button').focus({ preventScroll: true });
};

form.addEventListener('submit', async e => {
  e.preventDefault();
  if (!validate()) {
    status.className = 'form-status err';
    status.textContent = 'Please fill in your name, a valid email and your query.';
    return;
  }
  const d = Object.fromEntries(new FormData(form));
  if (d._honey) return; // bot

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner" aria-hidden="true"></span>Sending…';
  status.className = 'form-status'; status.textContent = '';

  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        _subject: `Quotation request: ${d.product} – ${d.name}${d.company ? ' (' + d.company + ')' : ''}`,
        _template: 'table',
        _captcha: 'false',
        _replyto: d.email,
        Name: d.name,
        Company: d.company || '-',
        Email: d.email,
        Phone: d.phone || '-',
        'Interested in': d.product,
        Message: d.message,
        Page: location.href,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || String(data.success) !== 'true') throw new Error(data.message || `HTTP ${res.status}`);
    showSuccess(d);
  } catch (err) {
    status.className = 'form-status err';
    status.innerHTML = 'Sorry, your request could not be sent right now. <a href="#">Send it by email instead</a> or call 0327 6889999.';
    status.querySelector('a').href = mailtoLink(d);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Quotation Request';
  }
});

// ---------- Interactive cards: 3D tilt + cursor spotlight ----------
if (canHover && !reduceMotion) {
  document.querySelectorAll('.card, .svc-card, .saving-card, .pillar, .why, .industry, .hero-stat').forEach(card => {
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
