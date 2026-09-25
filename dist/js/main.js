/* ── Hero Slider ─────────────────────────────────────────── */
(function () {
  const slider  = document.getElementById('hero-slider');
  if (!slider) return;

  const slides  = Array.from(slider.querySelectorAll('.hero-slide'));
  const dots    = Array.from(slider.querySelectorAll('.slider-dot'));
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');
  let current   = 0;
  let timer     = null;
  const DELAY   = 5500;

  function goTo(n) {
    const prev = current;
    current = (n + slides.length) % slides.length;

    slides[prev].classList.add('opacity-0');
    slides[prev].setAttribute('aria-hidden', 'true');
    slides[current].classList.remove('opacity-0');
    slides[current].setAttribute('aria-hidden', 'false');

    dots.forEach((d, i) => {
      const active = i === current;
      d.setAttribute('aria-selected', String(active));
      d.classList.toggle('bg-white/15', active);
      d.classList.toggle('border-white/25', active);
      d.classList.toggle('bg-white/10', !active);
      d.classList.toggle('border-white/15', !active);
      const dot = d.querySelector('.dot-indicator');
      const label = d.querySelector('span:last-child');
      if (dot) { dot.classList.toggle('bg-white', active); dot.classList.toggle('bg-white/50', !active); }
      if (label) { label.classList.toggle('text-white', active); label.classList.toggle('text-white/70', !active); }
    });
  }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), DELAY);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); startAuto(); });
  dots.forEach(d => d.addEventListener('click', () => { goTo(Number(d.dataset.target)); startAuto(); }));

  slider.addEventListener('mouseenter', () => clearInterval(timer));
  slider.addEventListener('mouseleave', startAuto);

  startAuto();
})();
/* ── End Hero Slider ─────────────────────────────────────── */

'use strict';

const params = new URLSearchParams(location.search);
const navbar = document.querySelector('#navbar');
const menuButton = document.querySelector('#menu-button');
const menu = document.querySelector('#mobile-menu');

const solidNav = () => {
  if (!navbar) return;
  const menuOpen = menu && !menu.classList.contains('hidden');
  const solid = window.scrollY > 20 || document.body.dataset.home !== 'true' || menuOpen;
  navbar.classList.toggle('bg-[#FAF8F5]/95', solid);
  navbar.classList.toggle('backdrop-blur-md', solid);
  navbar.classList.toggle('text-[#1F1918]', solid);
  navbar.classList.toggle('shadow-sm', solid);
  navbar.classList.toggle('border-b', solid);
  navbar.classList.toggle('border-[#E7E0D8]', solid);
  navbar.classList.toggle('text-white', !solid);
  if (menuButton) {
    menuButton.classList.toggle('text-[#1F1918]', solid);
    menuButton.classList.toggle('text-white', !solid);
  }
};
solidNav();
window.addEventListener('scroll', solidNav, { passive: true });

function closeMenu() {
  if (!menu) return;
  menu.classList.add('hidden');
  if (menuButton) {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    menuButton.innerHTML = '☰';
  }
  document.body.classList.remove('overflow-hidden');
  solidNav();
}

if (menuButton && menu) {
  menuButton.addEventListener('click', () => {
    const open = menu.classList.toggle('hidden') === false;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    menuButton.innerHTML = open ? '✕' : '☰';
    document.body.classList.toggle('overflow-hidden', open);
    solidNav();
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  window.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
}

// Date inputs & URL query sync
const today = new Date();
today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
const todayISO = today.toISOString().slice(0, 10);

document.querySelectorAll('form').forEach(form => {
  for (const key of ['q', 'where', 'checkin', 'checkout', 'guests', 'property']) {
    const f = form.elements.namedItem(key);
    if (f && params.has(key)) {
      f.value = params.get(key);
      if (f.tagName === 'SELECT' && f.selectedIndex < 0) f.selectedIndex = 0;
    }
  }
  const ci = form.elements.namedItem('checkin');
  const co = form.elements.namedItem('checkout');
  if (ci && co) {
    ci.min = todayISO;
    co.min = todayISO;
    const dates = () => {
      co.setCustomValidity('');
      if (ci.value) {
        const d = new Date(ci.value + 'T12:00:00');
        d.setDate(d.getDate() + 1);
        co.min = d.toISOString().slice(0, 10);
      }
      if (ci.value && co.value && co.value <= ci.value) {
        co.setCustomValidity('Check-out date must follow check-in.');
      }
      if (form.id === 'search') {
        ci.required = !!co.value;
        co.required = !!ci.value;
      }
    };
    ci.addEventListener('change', dates);
    co.addEventListener('change', dates);
    dates();
  }
});

// Search & Destination Filter on collection page
function filter() {
  const cards = [...document.querySelectorAll('[data-property]')];
  if (!document.querySelector('#property-grid')) return;
  const where = (params.get('where') || '').toLowerCase();
  const query = (params.get('q') || '').trim().toLowerCase();
  let count = 0;
  cards.forEach(c => {
    const match = (!where || c.dataset.location.toLowerCase().includes(where)) && (!query || c.textContent.toLowerCase().includes(query));
    c.hidden = !match;
    c.classList.toggle('hidden', !match);
    if (match) count++;
  });
  const rc = document.querySelector('#result-count');
  if (rc) rc.textContent = `${count} curated propert${count === 1 ? 'y' : 'ies'}`;
  const noRes = document.querySelector('#no-results');
  if (noRes) noRes.classList.toggle('hidden', count !== 0);
}
filter();

// Preserve dates and stay across links
for (const a of document.querySelectorAll('a[href^="contact.html?property="], a[href^="property.html?id="]')) {
  try {
    const u = new URL(a.href, window.location.origin);
    for (const key of ['checkin', 'checkout', 'guests']) {
      if (params.has(key)) u.searchParams.set(key, params.get(key));
    }
    a.href = u.pathname.split('/').pop() + u.search;
  } catch (err) {}
}

// Direct Concierge Enquiry submission via WhatsApp
document.querySelector('#enquiry')?.addEventListener('submit', e => {
  e.preventDefault();
  const f = e.currentTarget;
  if (!f.reportValidity()) return;
  const d = new FormData(f);
  const selection = f.elements.property;
  const name = selection ? selection.options[selection.selectedIndex].text : 'A Vilstay Property';
  const message = `Hello Vilstay Concierge,\n\nI would like to enquire about reserving ${name}.\n\nGuest Name: ${d.get('name')}\nEmail: ${d.get('email')}\nCheck-in: ${d.get('checkin')}\nCheck-out: ${d.get('checkout')}\nGuests: ${d.get('guests')}\nSpecial Requests: ${d.get('message') || 'None'}\n\nPlease share current tariffs and availability.`;
  location.href = 'https://wa.me/919947584947?text=' + encodeURIComponent(message);
});

// Property Detail dynamic page with professional luxury styling
const detail = document.querySelector('#property-detail');
if (detail) {
  fetch('js/data.json')
    .then(r => {
      if (!r.ok) throw Error('load');
      return r.json();
    })
    .then(stays => {
      const p = stays.find(p => p.id === ((params.get('id') === 'kalani-3bhk' ? 'edakkal-village' : params.get('id')) || 'manikarnika'));
      if (!p) {
        detail.innerHTML = '<section class="max-w-4xl mx-auto px-6 pt-36 pb-24 text-center"><h1 class="font-serif text-4xl">Property Not Found</h1><p class="mt-4 text-stone-600">The requested residence is currently unavailable.</p><a href="properties.html" class="inline-block mt-6 px-8 py-3 bg-[#B1493E] text-white rounded-full text-xs uppercase tracking-wider font-semibold hover:bg-[#8E342B] transition">Explore Collection</a></section>';
        return;
      }
      document.title = `${p.name} | Vilstay Private Collection`;
      const booking = new URLSearchParams({ property: p.id });
      for (const key of ['checkin', 'checkout', 'guests']) {
        if (params.has(key)) booking.set(key, params.get(key));
      }

      detail.innerHTML = `
<section class="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 pt-24 sm:pt-36 pb-24 sm:pb-16">
  <nav aria-label="Breadcrumb" class="text-xs uppercase tracking-wider text-stone-500 truncate mb-6">
    <a href="index.html" class="hover:text-[#B1493E] transition">Home</a>
    <span class="mx-2 text-stone-400">/</span>
    <a href="properties.html" class="hover:text-[#B1493E] transition">Collection</a>
    <span class="mx-2 text-stone-400">/</span>
    <span class="text-[#1F1918] font-semibold">${p.name}</span>
  </nav>

  <div class="flex flex-wrap justify-between gap-4 items-end pb-6 border-b border-[#E7E0D8]">
    <div>
      <span class="text-xs font-semibold uppercase tracking-[.25em] text-[#B1493E]">${p.location}</span>
      <h1 class="font-serif text-3xl sm:text-5xl md:text-6xl mt-2 leading-[1.15] text-[#1F1918] font-normal">${p.name}</h1>
      <p class="text-stone-600 text-sm sm:text-base mt-2">${p.category}</p>
    </div>
    <div class="hidden sm:block text-right">
      <span class="text-xs uppercase tracking-wider text-stone-500 block">Reservation Status</span>
      <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full mt-1">Available for Direct Enquiry</span>
    </div>
  </div>

  <figure class="mt-8 overflow-hidden rounded-2xl shadow-sm border border-[#E7E0D8]">
    <img src="${p.image}" alt="${p.name}" class="w-full aspect-[4/3] md:aspect-[2.2/1] object-cover" fetchpriority="high">
  </figure>

  <div class="grid lg:grid-cols-[1.5fr_1fr] gap-10 lg:gap-16 py-10 sm:py-16">
    <div>
      <span class="text-xs uppercase tracking-[.25em] text-[#B1493E] font-semibold">About This Residence</span>
      <h2 class="font-serif text-2xl sm:text-4xl mt-2 font-normal text-[#1F1918]">A Sanctuary of Character & Comfort</h2>
      <p class="text-stone-700 leading-relaxed sm:leading-8 mt-5 text-base sm:text-lg font-normal">${p.description}</p>
      <p class="text-stone-600 leading-relaxed sm:leading-7 mt-4 text-sm sm:text-base">Experience the peaceful rhythm of ${p.location} at your own pace. With tailored on-site hosting, authentic regional meals, and personal concierge assistance, your stay is designed around genuine relaxation.</p>

      <div class="mt-12 pt-10 border-t border-[#E7E0D8]">
        <h3 class="font-serif text-2xl font-normal text-[#1F1918]">Amenities & Inclusions</h3>
        <ul class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-6">
          ${p.facilities.map(f => `<li class="border border-[#E7E0D8] bg-white p-4 rounded-xl flex items-center gap-3 text-sm text-stone-800"><span class="w-5 h-5 rounded-full bg-[#B1493E]/10 text-[#B1493E] flex items-center justify-center font-bold text-xs shrink-0">•</span><span>${f}</span></li>`).join('')}
        </ul>
      </div>

      <div class="mt-12 pt-10 border-t border-[#E7E0D8]">
        <h3 class="font-serif text-2xl font-normal text-[#1F1918]">Reservation Notes</h3>
        <p class="text-stone-600 leading-relaxed mt-3 text-sm">Our reservations team confirms check-in parameters, occupancy limits, dietary preferences, and seasonal rates directly with guests prior to arrival.</p>
      </div>

      <div class="mt-8 pt-6 border-t border-[#E7E0D8]">
        <a href="properties.html" class="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#B1493E] hover:underline underline-offset-4">
          ← Return to All Residences
        </a>
      </div>
    </div>

    <!-- Booking / Concierge Card -->
    <aside class="bg-white p-6 sm:p-8 rounded-2xl h-fit lg:sticky lg:top-28 border border-[#E7E0D8] shadow-sm">
      <span class="text-[11px] tracking-[.25em] uppercase text-[#B1493E] font-semibold block">Direct Reservations</span>
      <h3 class="font-serif text-2xl sm:text-3xl mt-1 font-normal text-[#1F1918]">Plan Your Stay</h3>
      <p class="mt-2 text-stone-600 text-xs sm:text-sm leading-relaxed">Connect directly with our Kerala concierge team to check room availability and secure direct booking rates.</p>

      <div class="flex flex-col gap-3 mt-6">
        <a href="contact.html?${booking.toString()}#enquiry" class="flex items-center justify-center gap-2 bg-[#B1493E] text-white px-6 py-4 rounded-xl text-xs uppercase tracking-widest font-semibold hover:bg-[#8E342B] transition shadow-sm btn-press">
          Enquire on WhatsApp ↗
        </a>
        <a href="tel:+919947584947" class="flex items-center justify-center gap-2 bg-transparent border border-stone-300 text-[#1F1918] px-6 py-3.5 rounded-xl text-xs uppercase tracking-widest font-semibold hover:border-[#B1493E] hover:text-[#B1493E] transition btn-press">
          Call +91 99475 84947
        </a>
      </div>

      <div class="mt-6 pt-5 border-t border-stone-100 flex flex-col gap-2 text-[11px] text-stone-500">
        <div class="flex items-center gap-2">
          <span class="text-[#B1493E]">✓</span>
          <span>Best direct tariff guaranteed</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-[#B1493E]">✓</span>
          <span>No automated card charges or hidden fees</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-[#B1493E]">✓</span>
          <span>Personalised local travel guidance</span>
        </div>
      </div>
    </aside>
  </div>
</section>
      `;
    })
    .catch(() => {
      detail.innerHTML = '<section class="px-6 pt-44 pb-24 text-center"><h1 class="font-serif text-3xl">Unable to Load Residence</h1><p class="mt-2 text-stone-600">Please check your connection or return to our property index.</p><a href="properties.html" class="inline-block mt-6 px-6 py-3 bg-[#B1493E] text-white rounded-full text-xs uppercase tracking-wider font-semibold">Browse Residences</a></section>';
    });
}

// Scroll animation
if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 500, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.05 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// Category filter interaction with luxury styling
const categoryMap = {
  all: [],
  heritage: ['manikarnika', 'panthalaza'],
  mountain: ['kalani-vythiri', 'hill-view'],
  lakefront: ['panthalaza'],
  private: ['manikarnika'],
  city: ['malabar']
};

document.querySelectorAll('[data-category]').forEach(button => {
  button.addEventListener('click', () => {
    const value = button.dataset.category;
    document.querySelectorAll('[data-category]').forEach(b => {
      const active = b === button;
      b.setAttribute('aria-pressed', String(active));
      b.classList.toggle('bg-[#B1493E]', active);
      b.classList.toggle('text-white', active);
      b.classList.toggle('border-[#B1493E]', active);
      b.classList.toggle('bg-white', !active);
      b.classList.toggle('text-stone-700', !active);
      b.classList.toggle('border-[#E7E0D8]', !active);
    });
    let count = 0;
    document.querySelectorAll('[data-property]').forEach(c => {
      const show = value === 'all' || categoryMap[value].includes(c.dataset.property);
      c.hidden = !show;
      c.classList.toggle('hidden', !show);
      if (show) count++;
    });
    const countEl = document.querySelector('#home-result-count');
    if (countEl) countEl.textContent = `${count} curated propert${count === 1 ? 'y' : 'ies'}`;
  });
});
