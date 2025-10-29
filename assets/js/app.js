// Mobile menu toggle
document.getElementById('menu-toggle').addEventListener('click', () => {
  document.getElementById('mobile-menu').classList.toggle('hidden');
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    // only intercept if target exists
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
    // close mobile
    document.getElementById('mobile-menu').classList.add('hidden');
  });
});

// Active nav highlighter
function updateActiveNav() {
  const sections = document.querySelectorAll('section');
  const y = window.scrollY + 100;

  sections.forEach(section => {
    const top = section.offsetTop;
    const h = section.offsetHeight;
    const id = section.getAttribute('id');

    if (y >= top && y < top + h) {
      // reset
      document.querySelectorAll('nav a').forEach(n => {
        n.classList.remove('text-[#9B87F5]', 'bg-[#F5EEFF]');
        n.classList.add('text-gray-600');
      });
      document.querySelectorAll('#mobile-menu a').forEach(n => {
        n.classList.remove('text-[#9B87F5]', 'bg-[#F5EEFF]');
        n.classList.add('text-gray-600');
      });

      // set for current
      const desktop = document.getElementById(`${id}-nav`);
      const mobile  = document.getElementById(`mobile-${id}-nav`);
      desktop?.classList.add('text-[#9B87F5]', 'bg-[#F5EEFF]');
      mobile?.classList.add('text-[#9B87F5]', 'bg-[#F5EEFF]');
    }
  });
}
window.addEventListener('load', updateActiveNav);
window.addEventListener('scroll', updateActiveNav);

// Slider (desktop transform; mobile uses native scroll-snap)
function initSlider({ sliderId, prevId, nextId }) {
  const slider = document.getElementById(sliderId);
  const prev   = document.getElementById(prevId);
  const next   = document.getElementById(nextId);
  const cards  = Array.from(slider.children);

  const isMobile = () => window.innerWidth < 640;

  let perView = 1;
  function computePerView() {
    perView = 1;
    slider.style.display = 'flex';
    slider.style.flexWrap = 'nowrap';
    slider.style.transition = isMobile() ? 'none' : 'transform 0.5s ease';

    cards.forEach(c => { if (!isMobile()) c.style.flex = '0 0 100%'; });
    update();
  }

  function stepPx() {
    const gap = parseFloat(getComputedStyle(slider).gap) || 0;
    const w = cards[0].getBoundingClientRect().width;
    return w + gap;
  }

  let index = 0;
  function update() {
    if (isMobile()) {
      prev.style.display = 'none';
      next.style.display = 'none';
      return;
    }
    prev.style.display = 'flex';
    next.style.display = 'flex';
    slider.style.transform = `translateX(${-index * stepPx()}px)`;
    const maxIndex = Math.max(0, cards.length - perView);
    prev.style.opacity = index === 0 ? '0.5' : '1';
    prev.style.pointerEvents = index === 0 ? 'none' : 'auto';
    next.style.opacity = index >= maxIndex ? '0.5' : '1';
    next.style.pointerEvents = index >= maxIndex ? 'none' : 'auto';
  }

  prev.addEventListener('click', () => { if (!isMobile() && index > 0) { index--; update(); }});
  next.addEventListener('click', () => {
    if (isMobile()) return;
    const maxIndex = Math.max(0, cards.length - perView);
    if (index < maxIndex) { index++; update(); }
  });

  window.addEventListener('resize', computePerView);
  computePerView();
}

// Initialize the ML slider
initSlider({ sliderId: 'slider-ml', prevId: 'prev-ml', nextId: 'next-ml' });

// Contact form (Formspree) + success popup
(function () {
  const form = document.getElementById('contactForm');
  const popup = document.getElementById('success-popup');
  const closeBtn = document.getElementById('close-popup');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      });
      if (res.ok) {
        form.reset();
        popup.classList.remove('hidden');
        popup.classList.add('flex');
      } else {
        alert('Oops! Something went wrong. Please try again.');
      }
    } catch {
      alert('Network error. Please try again.');
    }
  });

  closeBtn.addEventListener('click', () => popup.classList.add('hidden'));
  popup.addEventListener('click', (e) => { if (e.target === popup) popup.classList.add('hidden'); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') popup.classList.add('hidden'); });
})();
