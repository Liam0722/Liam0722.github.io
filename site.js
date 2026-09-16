const dialog = document.querySelector('#image-dialog');
if (dialog && typeof dialog.showModal === 'function') {
  let previousFocus;
  document.querySelectorAll('a.zoom').forEach(link => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    previousFocus = link;
    const source = link.querySelector('img');
    const image = dialog.querySelector('img');
    image.src = link.href;
    image.alt = source.alt;
    dialog.querySelector('p').textContent = link.closest('figure').querySelector('figcaption')?.textContent || source.alt;
    dialog.showModal();
    document.body.classList.add('modal-open');
  }));
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
  dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); previousFocus?.focus(); });
}
