const gallery = document.querySelector('.personal-gallery');
if (gallery) {
  const slides = [...gallery.querySelectorAll('.personal-slide')];
  const thumbs = [...gallery.querySelectorAll('.photo-thumb')];
  const status = gallery.querySelector('.photo-status');
  let current = 0;
  let timer;
  let paused = false;
  const pause = document.createElement('button');
  pause.type = 'button';
  pause.className = 'photo-pause';
  pause.textContent = 'Pause';
  pause.setAttribute('aria-label', 'Pause slideshow');
  gallery.querySelector('.photo-arrows').prepend(pause);
  function schedule() {
    clearTimeout(timer);
    if (!paused && !document.hidden) timer = setTimeout(() => show(current + 1), 7500);
  }
  function show(index) {
    const restoreFocus = slides[current].contains(document.activeElement);
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => { slide.hidden = i !== current; });
    thumbs.forEach((button, i) => button.setAttribute('aria-pressed', String(i === current)));
    const caption = slides[current].querySelector('.photo-title').textContent;
    status.replaceChildren(document.createTextNode(caption + ' '));
    const count = document.createElement('span');
    count.textContent = `${current + 1} / ${slides.length}`;
    status.append(count);
    slides[current].querySelector('img').loading = 'eager';
    slides[(current + 1) % slides.length].querySelector('img').loading = 'eager';
    if (restoreFocus) slides[current].querySelector('.photo-advance').focus({preventScroll:true});
    schedule();
  }
  pause.addEventListener('click', () => {
    paused = !paused;
    pause.textContent = paused ? 'Play' : 'Pause';
    pause.setAttribute('aria-label', paused ? 'Play slideshow' : 'Pause slideshow');
    status.setAttribute('aria-live', paused ? 'polite' : 'off');
    schedule();
  });
  document.addEventListener('visibilitychange', schedule);
  status.setAttribute('aria-live', 'off');
  gallery.classList.add('is-ready');
  gallery.querySelector('.photo-controls').hidden = false;
  const thumbnails = gallery.querySelector('.photo-thumbnails');
  if (thumbnails) thumbnails.hidden = false;
  gallery.querySelectorAll('[data-photo-step]').forEach(button => {
    button.addEventListener('click', () => show(current + Number(button.dataset.photoStep)));
  });
  thumbs.forEach((button, index) => button.addEventListener('click', () => show(index)));
  gallery.querySelectorAll('.photo-advance').forEach(button => button.addEventListener('click', () => show(current + 1)));
  gallery.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      show(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  const frames = gallery.querySelector('.personal-frames');
  let touchStart = null;
  let suppressClick = false;
  frames.addEventListener('touchstart', event => {
    touchStart = event.touches.length === 1 ? {x:event.touches[0].clientX,y:event.touches[0].clientY} : null;
    suppressClick = false;
  }, {passive:true});
  frames.addEventListener('touchend', event => {
    if (!touchStart) return;
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      show(current + (dx < 0 ? 1 : -1));
      suppressClick = true;
    }
    touchStart = null;
  }, {passive:true});
  frames.addEventListener('touchcancel', () => { touchStart = null; });
  frames.addEventListener('click', event => {
    if (suppressClick) { event.preventDefault();event.stopPropagation();suppressClick=false; }
  }, true);
  show(0);
}
