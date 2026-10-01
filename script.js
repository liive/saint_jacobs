(() => {
  const english = document.documentElement.lang === 'en';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const slides = [...document.querySelectorAll('.hero-slide')];
  const buttons = [...document.querySelectorAll('[data-slide]')];
  const pause = document.querySelector('#pause');
  let index = 0, paused = reduced.matches, timer;
  const show = n => {
    index = (n + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
  };
  const sync = () => {
    clearInterval(timer);
    pause.textContent = english ? (paused ? 'Play' : 'Pause') : (paused ? 'Tęsti' : 'Pauzė');
    pause.setAttribute('aria-label', english ? (paused ? 'Play slideshow' : 'Pause slideshow') : (paused ? 'Tęsti nuotraukų kaitą' : 'Sustabdyti nuotraukų kaitą'));
    if (!paused && !document.hidden) timer = setInterval(() => show(index + 1), 6500);
  };
  buttons.forEach(button => button.addEventListener('click', () => {show(Number(button.dataset.slide));sync();}));
  pause.addEventListener('click', () => {paused = !paused;sync();});
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', () => {paused = reduced.matches;sync();});
  sync();
  if (!reduced.matches && 'IntersectionObserver' in window) {
    const blocks = document.querySelectorAll('.story-photo, .story-copy, .experience-title, .experience-grid article, .section-heading, .food-grid, .photo-pair figure, .visit > div');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {entry.target.classList.add('visible');observer.unobserve(entry.target);}
    }), {threshold: .08});
    blocks.forEach(el => {el.classList.add('reveal');observer.observe(el);});
    document.documentElement.classList.add('motion');
  }
  const progress = document.createElement('div');progress.className = 'scroll-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);
  let queued = false;
  const update = () => {const total = document.documentElement.scrollHeight - innerHeight;progress.style.width = (total > 0 ? scrollY / total * 100 : 0) + '%';queued = false;};
  addEventListener('scroll', () => {if (!queued) {queued = true;requestAnimationFrame(update);}}, {passive:true});
  update();
})();
