// Site search (Spotlight-style overlay) and card links.
(function () {
  const flash = el => {
    el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
    setTimeout(() => el.classList.remove('flash'), 1600);
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
  document.querySelectorAll('.prod-link').forEach(c => push({
    cat: 'Products', title: text(c.querySelector('span')), desc: text(c.closest('.prod-col').querySelector('.prod-head')).replace(/^\d+/, ''),
    img: c.querySelector('img').getAttribute('src'), target: c, keywords: 'equipment product', url: c.getAttribute('href'),
  }));
  document.querySelectorAll('.member').forEach(m => push({
    cat: 'Team', title: text(m.querySelector('h3')), desc: text(m.querySelector('p')), target: m, icon: '👤',
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

  const SUGGEST = ['Air Washer', 'Rotary Air Filtration System', 'Axial Fan', 'Measured energy savings', 'Tex-Auto automation', 'Pakistan Office'];

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
        if (it.cat === 'Products' || it.cat === 'Services') score += 1;
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
      list.innerHTML = `<p class="search-empty">No results for “${esc(q)}”.<br><a class="search-ask" href="mailto:sales@nextexpk.com?subject=${encodeURIComponent(q)}">Ask our team about it →</a></p>`;
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
    document.getElementById('searchOpen').setAttribute('aria-label', 'Search the site (⌘K)');
  }
})();
