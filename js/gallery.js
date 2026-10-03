// Photo galleries: any element with [data-gallery] gets a full-screen lightbox
// with captions, previous/next, keyboard (← → Esc) and swipe support.
(function () {
  const galleries = [...document.querySelectorAll('[data-gallery]')];
  if (!galleries.length) return;

  const box = document.createElement('div');
  box.className = 'lightbox';
  box.hidden = true;
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.innerHTML = `
    <div class="lb-backdrop" data-lb-close></div>
    <figure class="lb-stage">
      <img class="lb-img" alt="">
      <figcaption class="lb-cap"><span class="lb-count"></span><strong class="lb-title"></strong><span class="lb-desc"></span></figcaption>
    </figure>
    <button type="button" class="lb-btn lb-prev" aria-label="Previous photo">‹</button>
    <button type="button" class="lb-btn lb-next" aria-label="Next photo">›</button>
    <button type="button" class="lb-btn lb-close" data-lb-close aria-label="Close">✕</button>`;
  document.body.appendChild(box);

  const img = box.querySelector('.lb-img');
  const title = box.querySelector('.lb-title');
  const desc = box.querySelector('.lb-desc');
  const count = box.querySelector('.lb-count');
  let items = [], index = 0, lastFocus = null, galleryName = '';

  const show = i => {
    index = (i + items.length) % items.length;
    const fig = items[index];
    const src = fig.querySelector('img');
    box.classList.remove('lb-in'); void img.offsetWidth;
    img.src = src.currentSrc || src.src;
    img.alt = src.alt;
    title.textContent = fig.querySelector('figcaption strong')?.textContent || '';
    desc.textContent = fig.querySelector('figcaption span')?.textContent || '';
    count.textContent = `${galleryName} · ${index + 1} / ${items.length}`;
    box.classList.add('lb-in');
    const single = items.length < 2;
    box.querySelector('.lb-prev').hidden = single;
    box.querySelector('.lb-next').hidden = single;
  };

  const open = (gallery, i) => {
    items = [...gallery.querySelectorAll('figure')];
    galleryName = gallery.dataset.gallery;
    box.setAttribute('aria-label', `${galleryName} photos`);
    lastFocus = document.activeElement;
    box.hidden = false;
    document.documentElement.classList.add('lightbox-open');
    requestAnimationFrame(() => box.classList.add('open'));
    show(i);
    box.querySelector('.lb-close').focus();
  };
  const close = () => {
    box.classList.remove('open');
    document.documentElement.classList.remove('lightbox-open');
    setTimeout(() => { box.hidden = true; }, 250);
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  };

  // Equipment cards: switch between real photos and the 3D model
  document.querySelectorAll('.has-photos').forEach(card => {
    const slides = [...card.querySelectorAll('.pi-slide')];
    const tabs = [...card.querySelectorAll('.pi-tab')];
    tabs.forEach(tab => tab.addEventListener('click', e => {
      e.stopPropagation();
      const i = +tab.dataset.slide;
      slides.forEach((s, k) => s.classList.toggle('active', k === i));
      tabs.forEach((t, k) => { t.classList.toggle('active', k === i); t.setAttribute('aria-pressed', k === i); });
    }));
  });

  galleries.forEach(g => {
    g.querySelectorAll('figure').forEach((fig, i) => {
      fig.querySelector('.g-open').addEventListener('click', () => open(g, i));
    });
  });
  box.querySelectorAll('[data-lb-close]').forEach(el => el.addEventListener('click', close));
  box.querySelector('.lb-prev').addEventListener('click', () => show(index - 1));
  box.querySelector('.lb-next').addEventListener('click', () => show(index + 1));

  document.addEventListener('keydown', e => {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(index - 1);
    else if (e.key === 'ArrowRight') show(index + 1);
    else if (e.key === 'Tab') {
      const f = [...box.querySelectorAll('button')].filter(b => !b.hidden);
      const at = f.indexOf(document.activeElement);
      e.preventDefault();
      f[(at + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
    }
  });

  // swipe on touch screens
  let startX = null;
  box.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', e => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
    startX = null;
  });
})();
