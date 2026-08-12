(() => {
  const slides = [...document.querySelectorAll('.slide')];
  const progress = document.querySelector('#progress');
  let current = Math.max(0, Math.min(slides.length - 1, Number(location.hash.slice(1)) - 1 || 0));
  function show(index, updateHash = true) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === current));
    progress.textContent = `${String(current + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    document.title = `${slides[current].dataset.title} — Vax Family`;
    if (updateHash) history.replaceState(null, '', `#${current + 1}`);
  }
  document.querySelector('#prev').addEventListener('click', () => show(current - 1));
  document.querySelector('#next').addEventListener('click', () => show(current + 1));
  document.querySelector('#print').addEventListener('click', () => window.print());
  addEventListener('keydown', (event) => {
    if (['ArrowRight', 'PageDown', ' '].includes(event.key)) { event.preventDefault(); show(current + 1); }
    if (['ArrowLeft', 'PageUp'].includes(event.key)) { event.preventDefault(); show(current - 1); }
    if (event.key === 'Home') show(0);
    if (event.key === 'End') show(slides.length - 1);
  });
  addEventListener('hashchange', () => show(Number(location.hash.slice(1)) - 1, false));
  show(current, false);
})();
