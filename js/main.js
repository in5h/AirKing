// Address that receives website queries.
const SALES_EMAIL = 'sales@nextexpk.com';

document.getElementById('year').textContent = new Date().getFullYear();

// Header shadow on scroll
const header = document.getElementById('header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile menu
const toggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
}));

// Reveal sections and count up stats when they scroll into view
const revealTargets = document.querySelectorAll('.section-head, .about-grid > *, .timeline-item, .card, .industry, .member, .contact-grid > *');
revealTargets.forEach(el => el.classList.add('reveal'));

const countUp = el => {
  const target = Number(el.dataset.count);
  const start = performance.now();
  const step = now => {
    const t = Math.min((now - start) / 1400, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3)));
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
  document.querySelectorAll('[data-count]').forEach(el => { el.textContent = el.dataset.count; });
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
