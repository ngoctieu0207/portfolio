(() => {
  const panel = document.getElementById('panel');
  const pages = [...document.querySelectorAll('.page')];
  const tabs = [...document.querySelectorAll('.tab')];

  // Fill photo galleries (01.jpg, 02.jpg, ...)
  document.querySelectorAll('.photos').forEach((box) => {
    const folder = box.dataset.folder;
    const count = Number(box.dataset.count) || 0;
    for (let i = 1; i <= count; i++) {
      const img = document.createElement('img');
      img.loading = 'lazy';
      img.src = `${folder}/${String(i).padStart(2, '0')}.jpg`;
      img.alt = `${box.closest('.project').querySelector('.project__title').textContent} photo ${i}`;
      box.appendChild(img);
    }
  });

  // Lazy-load every image except the first page's
  document.querySelectorAll('.page:not(.page--home) img').forEach((img) => { img.loading = 'lazy'; });

  // Show a labelled placeholder when an asset hasn't been added yet
  const markMissing = (img) => {
    const name = img.dataset.fallback || img.getAttribute('src');
    const ph = document.createElement('div');
    ph.className = `missing ${img.className}`;
    ph.textContent = `assets/${name.replace(/^assets\//, '')}`;
    img.replaceWith(ph);
  };
  document.querySelectorAll('img').forEach((img) => {
    if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) markMissing(img);
    else img.addEventListener('error', () => markMissing(img), { once: true });
  });

  // Hash routing
  const show = () => {
    let route = location.hash.replace(/^#/, '') || 'home';
    if (!pages.some((p) => p.dataset.page === route)) route = 'home';
    const section = route.split('/')[0];

    pages.forEach((p) => p.classList.toggle('is-active', p.dataset.page === route));
    tabs.forEach((t) => {
      const on = t.getAttribute('href') === `#${section}`;
      t.classList.toggle('is-active', on);
      if (on) t.setAttribute('aria-current', 'page'); else t.removeAttribute('aria-current');
    });
    panel.dataset.theme = section;

    // pause videos on pages we left
    document.querySelectorAll('video').forEach((v) => { if (!v.closest('.is-active')) v.pause(); });

    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  };
  window.addEventListener('hashchange', show);
  show();

  // Lightbox for gallery & photo images
  const lb = document.getElementById('lightbox');
  const lbImg = lb.querySelector('img');
  document.addEventListener('click', (e) => {
    const img = e.target.closest('.gallery img, .photos img');
    if (!img) return;
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
    lb.hidden = false;
  });
  const close = () => { lb.hidden = true; lbImg.removeAttribute('src'); };
  lb.addEventListener('click', (e) => { if (e.target !== lbImg) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !lb.hidden) close(); });
})();
