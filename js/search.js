// Site search (Spotlight-style overlay) and the dynamic, context-aware call-to-action.
(function () {
  // ======================================================================
  // Dynamic CTA
  // ======================================================================
  const form = document.getElementById('queryForm');
  const productSelect = form.querySelector('select[name="product"]');
  const message = form.querySelector('textarea[name="message"]');

  // Form "Interested in" options, by key
  const OPT = {
    general: 'General enquiry',
    plant: 'New textile AC plant (turn-key)',
    upgrade: 'Upgrade of existing AC plant',
    controls: 'Automation & controls',
    washer: 'Air washer equipment',
    fans: 'Fans, dampers & louvres',
    filtration: 'Filtration & dust handling',
    service: 'Service & spare parts',
  };

  // What the CTA says (and pre-selects) while each part of the page is on screen
  const CONTEXT = {
    home: { label: 'Get a Quote', opt: 'general' },
    about: { label: 'Get a Quote', opt: 'general' },
    services: { label: 'Plan Your Project', opt: 'plant' },
    history: { label: 'Talk to an Engineer', opt: 'general' },
    'div-automation': { label: 'Quote Controls', opt: 'controls' },
    'div-washer': { label: 'Quote Air Washer', opt: 'washer' },
    'div-airhandling': { label: 'Quote Fans & Dampers', opt: 'fans' },
    'div-filtration': { label: 'Quote Filtration', opt: 'filtration' },
    equipment: { label: 'Quote Equipment', opt: 'general' },
    control: { label: 'Upgrade My Controls', opt: 'controls' },
    why: { label: 'Upgrade My Plant', opt: 'upgrade' },
    results: { label: 'Get an Energy Audit', opt: 'upgrade' },
    industries: { label: 'Discuss My Mill', opt: 'general' },
    clients: { label: 'Join Our Clients', opt: 'plant' },
    team: { label: 'Contact Our Team', opt: 'general' },
    contact: { label: 'Write Your Query', opt: null },
  };

  // Ordered list of watched elements (later ones win when several are past the line)
  const watched = ['home', 'about', 'services', 'history', 'equipment', 'div-automation', 'div-washer',
    'div-airhandling', 'div-filtration', 'control', 'why', 'results', 'industries', 'clients', 'team', 'contact']
    .map(id => document.getElementById(id)).filter(Boolean);

  const ctas = [...document.querySelectorAll('[data-cta]')];
  const floatCta = document.getElementById('floatCta');
  const contactSec = document.getElementById('contact');
  let ctx = CONTEXT.home, ctxId = 'home';

  const setLabel = (el, text) => {
    const label = el.querySelector('.cta-label');
    if (label.textContent === text) return;
    el.classList.add('cta-swap');
    setTimeout(() => { label.textContent = text; el.classList.remove('cta-swap'); }, 180);
  };

  const updateContext = () => {
    const line = window.innerHeight * 0.4;
    let id = 'home';
    watched.forEach(el => { if (el.getBoundingClientRect().top <= line) id = el.id; });
    // leaving the equipment area: drop the division-specific label
    const eq = document.getElementById('equipment').getBoundingClientRect();
    if (id.startsWith('div-') && eq.bottom < line) id = 'equipment';
    if (id !== ctxId) {
      ctxId = id; ctx = CONTEXT[id] || CONTEXT.home;
      ctas.forEach(el => setLabel(el, ctx.label));
    }
    const c = contactSec.getBoundingClientRect();
    const contactInView = c.top < window.innerHeight * 0.8 && c.bottom > 0;
    floatCta.classList.toggle('show', window.scrollY > window.innerHeight * 0.7 && !contactInView);
  };
  window.addEventListener('scroll', updateContext, { passive: true });
  window.addEventListener('resize', updateContext);
  updateContext();

  const flash = el => {
    el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
    setTimeout(() => el.classList.remove('flash'), 1600);
  };

  // Go to the form with the right option (and optionally a message) filled in
  const openForm = (optKey, text) => {
    if (optKey && OPT[optKey]) productSelect.value = OPT[optKey];
    if (text && !message.value.trim()) message.value = text;
    contactSec.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      form.querySelector('input[name="name"]').focus({ preventScroll: true });
      flash(form);
    }, 650);
  };

  const params = new URLSearchParams(location.search);
  if (params.get('interest') && OPT[params.get('interest')]) {
    productSelect.value = OPT[params.get('interest')];
    if (params.get('about') && !message.value) message.value = `I'm interested in: ${params.get('about')}.\n\n`;
    if (location.hash === '#contact') setTimeout(() => { flash(form); form.querySelector('input[name="name"]').focus({ preventScroll: true }); }, 700);
  }

  ctas.forEach(el => el.addEventListener('click', e => {
    e.preventDefault();
    openForm(ctx.opt);
  }));

  // "Enquire" buttons on every equipment and service card
  const divisionOpt = { 'div-automation': 'controls', 'div-washer': 'washer', 'div-airhandling': 'fans', 'div-filtration': 'filtration' };
  const serviceOpt = { 'Design & Engineering': 'plant', 'Installation': 'plant', 'Commissioning': 'plant',
    'Automation & Control': 'controls', 'Dust Handling': 'filtration', 'AC Plant Upgrade': 'upgrade' };

  const addEnquire = (body, title, optKey) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'card-cta';
    b.innerHTML = 'Enquire <span aria-hidden="true">→</span>';
    b.setAttribute('aria-label', `Enquire about ${title}`);
    b.addEventListener('click', () => openForm(optKey, `I'm interested in: ${title}.\n\n`));
    body.appendChild(b);
  };
  // a whole card opens its detail page; buttons and links inside keep their own action
  const cardLink = (card, url) => card.addEventListener('click', e => {
    if (!e.target.closest('a, button')) window.location.href = url;
  });
  const moreLink = (parent, url, title) => {
    const a = document.createElement('a');
    a.className = 'card-more'; a.href = url;
    a.innerHTML = 'Learn more <span aria-hidden="true">→</span>';
    a.setAttribute('aria-label', `Learn more about ${title}`);
    parent.appendChild(a);
  };
  document.querySelectorAll('.card.product').forEach(card => {
    const div = card.closest('.division');
    const title = card.querySelector('h3').textContent.trim();
    const url = `detail.html?eq=${card.id.replace(/^eq-/, '')}`;
    const actions = document.createElement('div');
    actions.className = 'card-actions';
    card.querySelector('.card-body').appendChild(actions);
    addEnquire(actions, title, divisionOpt[div && div.id] || 'general');
    moreLink(actions, url, title);
    card.dataset.url = url;
    cardLink(card, url);
  });
  document.querySelectorAll('.industry').forEach(card => {
    const img = card.querySelector('.ind-img img');
    const slug = img ? img.getAttribute('src').split('/').pop().replace('.jpg', '') : '';
    if (!slug) return;
    const url = `detail.html?ind=${slug}`;
    const title = card.querySelector('h3').textContent.trim();
    moreLink(card.querySelector('.ind-body'), url, title);
    card.dataset.url = url;
    cardLink(card, url);
  });
  document.querySelectorAll('.svc-card').forEach(card => {
    const title = card.querySelector('h3').textContent.trim();
    const link = card.querySelector('.svc-link');
    const actions = document.createElement('div');
    actions.className = 'svc-actions';
    card.querySelector('.svc-body').appendChild(actions);
    addEnquire(actions, title, serviceOpt[title] || 'general');
    const more = document.createElement('a');
    more.className = 'svc-more'; more.href = link.getAttribute('href');
    more.innerHTML = 'Learn more <span aria-hidden="true">→</span>';
    more.setAttribute('aria-label', `Learn more about ${title}`);
    actions.appendChild(more);
    // the whole card opens the detail page (buttons and links inside keep their own action)
    card.addEventListener('click', e => { if (!e.target.closest('a, button')) window.location.href = link.getAttribute('href'); });
  });

  // ======================================================================
  // Search
  // ======================================================================
  const overlay = document.getElementById('searchOverlay');
  const input = document.getElementById('searchInput');
  const list = document.getElementById('searchResults');
  const text = el => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');

  // Build the index from the page itself, so it stays in sync with the content
  const index = [];
  const push = (o) => index.push(Object.assign({ desc: '', img: '', icon: '', keywords: '' }, o));

  document.querySelectorAll('main section[id], body > section[id]').forEach(sec => {
    const h = sec.querySelector('h2'); if (!h) return;
    push({ cat: 'Sections', title: text(h), desc: text(sec.querySelector('.section-head p:not(.eyebrow)')) || text(sec.querySelector('.eyebrow')), target: sec, icon: '§' });
  });
  document.querySelectorAll('.svc-card').forEach(c => push({
    cat: 'Services', title: text(c.querySelector('h3')), desc: text(c.querySelector('.svc-body p')),
    img: c.querySelector('img') && c.querySelector('img').getAttribute('src'), target: c,
    url: c.querySelector('.svc-link') && c.querySelector('.svc-link').getAttribute('href'),
  }));
  document.querySelectorAll('.card.product').forEach(c => {
    const div = c.closest('.division');
    push({
      cat: 'Equipment', title: text(c.querySelector('h3')), desc: text(c.querySelector('.card-body p')),
      img: c.querySelector('img') && c.querySelector('img').getAttribute('src'), target: c,
      keywords: div ? text(div.querySelector('.division-title')) : '', url: `detail.html?eq=${c.id.replace(/^eq-/, '')}`,
    });
  });
  document.querySelectorAll('.gallery[data-gallery] figure').forEach(f => push({
    cat: f.closest('[data-gallery]').dataset.gallery, title: text(f.querySelector('figcaption strong')), desc: text(f.querySelector('figcaption span')),
    img: f.querySelector('img').getAttribute('src'), target: f, keywords: 'factory photo gallery',
  }));
  document.querySelectorAll('.timeline-item').forEach(t => push({
    cat: 'History', title: `${text(t.querySelector('.timeline-year'))} · ${text(t.querySelector('h3'))}`,
    desc: text(t.querySelector('p')), target: t, icon: '◷',
  }));
  document.querySelectorAll('.feature-list li, #control .checklist li').forEach(li => push({
    cat: 'Control System', title: text(li), desc: 'Tex-Auto AirKing automation', target: document.getElementById('control'), icon: '⚙',
  }));
  document.querySelectorAll('.why').forEach(w => push({ cat: 'Why AirKing', title: text(w), target: w, icon: '★' }));
  document.querySelectorAll('.industry').forEach(i => push({
    cat: 'Industries', title: text(i.querySelector('h3')), desc: text(i.querySelector('p')), target: i, icon: i.querySelector('.ind-img').dataset.icon,
    img: i.querySelector('.ind-img img') ? i.querySelector('.ind-img img').getAttribute('src') : '',
    url: i.querySelector('.ind-img img') ? `detail.html?ind=${i.querySelector('.ind-img img').getAttribute('src').split('/').pop().replace('.jpg', '')}` : '',
  }));
  document.querySelectorAll('.tab-panel').forEach(panel => {
    const tab = document.querySelector(`.tab[data-tab="${panel.id}"]`);
    panel.querySelectorAll('tbody tr').forEach(tr => {
      const cells = [...tr.cells].map(text);
      push({ cat: 'Clients', title: cells[0], desc: `${text(tab)} · ${cells.slice(1).join(' · ')}`, target: tr, tab, icon: '◆' });
    });
  });
  document.querySelectorAll('.contact-list li').forEach(li => push({
    cat: 'Contact', title: text(li.querySelector('strong')), desc: text(li.querySelector('div')).replace(text(li.querySelector('strong')), '').trim(),
    target: li, icon: text(li.querySelector('.ci')),
  }));
  index.forEach(it => {
    it.hay = `${it.title} ${it.desc} ${it.cat} ${it.keywords}`.toLowerCase();
    it.words = it.hay.split(/[^a-z0-9%]+/).filter(Boolean);
  });

  // light stemming so "filter" finds "filtration", "fans" finds "fan", "controlling" finds "control"
  const stem = t => (t.length > 4 ? t.replace(/(ations?|ing|ers?|ions?|es|s)$/, '') : t);
  const matches = (it, t) => {
    if (it.hay.includes(t)) return 2;
    const st = stem(t);
    return st.length >= 3 && it.words.some(w => w.startsWith(st)) ? 1 : 0;
  };

  const SUGGEST = ['Air Washer', 'Rotary Air Filtration System', 'Supply & Return Air Fan', 'Measured energy savings', 'Tex-Auto automation', 'Pakistan Office'];

  const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const highlight = (s, terms) => {
    let out = esc(s);
    terms.map(t => (s.toLowerCase().includes(t) ? t : stem(t))).forEach(t => { if (t && t.length >= 2) out = out.replace(new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig'), '<mark>$1</mark>'); });
    return out;
  };

  let results = [], active = 0;

  const search = q => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) {
      return SUGGEST.map(t => index.find(it => it.title === t || it.title.endsWith(t))).filter(Boolean);
    }
    return index
      .filter(it => terms.every(t => matches(it, t)))
      .map(it => {
        const tl = it.title.toLowerCase();
        let score = 0;
        terms.forEach(t => {
          const st = stem(t);
          score += tl.startsWith(t) ? 6 : tl.includes(t) ? 4 : tl.includes(st) ? 3 : it.desc.toLowerCase().includes(t) ? 1 : 0.5;
        });
        if (it.cat === 'Equipment' || it.cat === 'Services') score += 1;
        return { it, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 30)
      .map(r => r.it);
  };

  const render = () => {
    const q = input.value.trim();
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    results = search(q);
    active = 0;
    if (!results.length) {
      list.innerHTML = `<p class="search-empty">No results for “${esc(q)}”.<br><button type="button" class="search-ask">Ask our team about it →</button></p>`;
      list.querySelector('.search-ask').addEventListener('click', () => { close(); openForm('general', `${q}\n\n`); });
      return;
    }
    let html = q ? '' : '<p class="search-group">Suggestions</p>', lastCat = null;
    results.forEach((it, i) => {
      if (q && it.cat !== lastCat) { html += `<p class="search-group">${esc(it.cat)}</p>`; lastCat = it.cat; }
      const thumb = it.img ? `<img src="${esc(it.img)}" alt="" loading="lazy" onerror="this.remove()">` : `<span class="search-icon">${esc(it.icon || '•')}</span>`;
      html += `<div class="search-item" role="option" id="sr-${i}" data-i="${i}" aria-selected="false">
        <span class="search-thumb">${thumb}</span>
        <span class="search-text"><span class="search-title">${highlight(it.title, terms)}</span>${it.desc ? `<span class="search-desc">${highlight(it.desc, terms)}</span>` : ''}</span>
        <span class="search-cat">${esc(it.cat)}</span>
      </div>`;
    });
    list.innerHTML = html;
    setActive(0);
  };

  const setActive = i => {
    const items = list.querySelectorAll('.search-item');
    if (!items.length) return;
    active = (i + items.length) % items.length;
    items.forEach((el, k) => el.setAttribute('aria-selected', k === active));
    items[active].scrollIntoView({ block: 'nearest' });
    input.setAttribute('aria-activedescendant', `sr-${active}`);
  };

  const go = it => {
    close();
    if (it.url) { window.location.href = it.url; return; }
    if (it.tab) it.tab.click();
    // open the section's hidden reveal state immediately so the target is visible on arrival
    it.target.classList.add('visible');
    setTimeout(() => {
      it.target.scrollIntoView({ behavior: 'smooth', block: it.target.tagName === 'SECTION' ? 'start' : 'center' });
      setTimeout(() => flash(it.target), 500);
    }, 60);
  };

  let lastFocus = null;
  const open = (prefill = '') => {
    lastFocus = document.activeElement;
    overlay.hidden = false;
    document.documentElement.classList.add('search-open');
    requestAnimationFrame(() => overlay.classList.add('open'));
    input.value = prefill;
    render();
    setTimeout(() => input.focus(), 30);
  };
  const close = () => {
    overlay.classList.remove('open');
    document.documentElement.classList.remove('search-open');
    setTimeout(() => { overlay.hidden = true; }, 250);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  };

  document.getElementById('searchOpen').addEventListener('click', () => open());
  document.getElementById('heroSearch').addEventListener('click', () => open());
  overlay.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', close));
  input.addEventListener('input', render);
  list.addEventListener('click', e => {
    const item = e.target.closest('.search-item');
    if (item) go(results[+item.dataset.i]);
  });
  list.addEventListener('mousemove', e => {
    const item = e.target.closest('.search-item');
    if (item && +item.dataset.i !== active) setActive(+item.dataset.i);
  });
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
    else if (e.key === 'Enter') { e.preventDefault(); if (results[active]) go(results[active]); }
    else if (e.key === 'Escape') { e.preventDefault(); close(); }
  });
  // keep keyboard focus inside the dialog
  overlay.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const f = [...overlay.querySelectorAll('input, button')].filter(el => el.offsetParent);
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  });
  // Ctrl/⌘+K or "/" opens search from anywhere
  document.addEventListener('keydown', e => {
    const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
    if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !typing)) {
      e.preventDefault();
      overlay.hidden ? open() : close();
    }
  });
  // show ⌘ on Macs
  if (/Mac|iPhone|iPad/.test(navigator.platform)) {
    document.querySelectorAll('.hero-search kbd').forEach(k => { k.textContent = '⌘ K'; });
    document.getElementById('searchOpen').setAttribute('aria-label', 'Search the site (⌘K)');
  }
})();
