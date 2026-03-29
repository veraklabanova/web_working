// =============================================================================
// DEPLOY CHECKLIST – před nahráním na Wedos zkontrolovat:
//
// 1. SSL (Let's Encrypt) – aktivovat v administraci Wedosu pro verklab.cz
// 2. _next URL – ve všech 5 formulářích změnit na https://verklab.cz/dekuji.html
//    (index.html, case-study.html, case-study2.html, case-study3.html, case-study4.html)
// 3. Formsubmit.co e-mail – až pojede info@verklab.cz (MX záznamy na Wedosu),
//    změnit action ve formulářích z ve.ra@seznam.cz na info@verklab.cz
// 4. Google Analytics – nahradit GA_ID 'G-XXXXXXXXXX' reálným Measurement ID
// =============================================================================

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('is-active');
    navLinks.classList.toggle('is-open');
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('is-active');
      navLinks.classList.remove('is-open');
    });
  });
}

// Dot grid – irregular, blurred dots with staggered fade-in
document.querySelectorAll('.hero__dot-grid, .cs-header__dot-grid').forEach(container => {
  const w = container.offsetWidth;
  const h = container.offsetHeight;
  const dotCount = container.classList.contains('hero__dot-grid') ? 35 : 22;

  for (let i = 0; i < dotCount; i++) {
    const dot = document.createElement('span');
    dot.className = 'dot';
    // Random position – keep 40px margin from edges so glow doesn't clip
    const margin = 40;
    const x = margin + Math.random() * (w - 2 * margin);
    const y = margin + Math.random() * (h - 2 * margin);
    // Random size 3–9px
    const size = 3 + Math.random() * 6;
    // ~20% of dots glow brighter (0.5–0.75), rest softer (0.12–0.4)
    const isBright = Math.random() < 0.2;
    const opacity = isBright
      ? 0.5 + Math.random() * 0.25
      : 0.12 + Math.random() * 0.28;
    // All dots launch simultaneously
    const delay = 0;
    // Each dot fades in at its own pace 2.5–5s
    const duration = 2.5 + Math.random() * 2.5;

    dot.style.left = x + 'px';
    dot.style.top = y + 'px';
    dot.style.width = size + 'px';
    dot.style.height = size + 'px';
    dot.style.setProperty('--dot-opacity', opacity);
    dot.style.setProperty('--dot-duration', duration + 's');
    dot.style.animationDelay = delay + 's';
    // Warp effect: translate offset so dot starts at canvas centre and flies outward
    dot.style.setProperty('--tx', (w / 2 - x) + 'px');
    dot.style.setProperty('--ty', (h / 2 - y) + 'px');

    container.appendChild(dot);
  }

  // Pick exactly 3–4 random dots to get the full glow effect
  const allDots = Array.from(container.querySelectorAll('.dot'));
  const glowCount = 3 + Math.floor(Math.random() * 2);
  const shuffled = allDots.sort(() => Math.random() - 0.5).slice(0, glowCount);
  // First one is the "hero" glow (biggest, scale 8, opacity 0.5)
  // Rest get smaller random glow
  shuffled.forEach((dot, idx) => {
    dot.classList.add('dot--glow');
    const baseDelay = parseFloat(dot.style.animationDelay) || 0;
    const baseDuration = parseFloat(dot.style.getPropertyValue('--dot-duration')) || 3.5;
    // Smaller glows start during the flight, always before the flight ends
    const glowDelay = baseDelay + Math.random() * baseDuration * 0.4;
    const glowDuration = 3 + Math.random() * 5;
    dot.style.setProperty('--glow-delay', glowDelay + 's');
    dot.style.setProperty('--glow-duration', glowDuration + 's');

    if (idx === 0) {
      // Hero glow – starts immediately and grows throughout the entire flight
      dot.style.setProperty('--glow-scale', '8');
      dot.style.setProperty('--glow-end-opacity', '0.5');
      dot.style.setProperty('--glow-delay', '0s');
      dot.style.setProperty('--glow-duration', baseDuration + 's');
      dot.classList.add('dot--hero');
    } else {
      // Smaller random glow
      const scale = 3 + Math.random() * 3; // 3–6
      const endOpacity = 0.15 + Math.random() * 0.15; // 0.15–0.3
      dot.style.setProperty('--glow-scale', scale.toFixed(1));
      dot.style.setProperty('--glow-end-opacity', endOpacity.toFixed(2));
    }
  });
});

// Blueprint cards – stagger fade-in při scrollu do viewportu
const blueprintCards = document.querySelectorAll('.blueprint__card');
if (blueprintCards.length > 0 && 'IntersectionObserver' in window) {
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const index = Array.from(blueprintCards).indexOf(card);
        setTimeout(() => card.classList.add('is-visible'), index * 100);
        cardObserver.unobserve(card);
      }
    });
  }, { threshold: 0.1 });

  blueprintCards.forEach(card => cardObserver.observe(card));
}

// File upload validation
document.querySelectorAll('.kontakt__file-input').forEach(input => {
  const wrapper = input.closest('.kontakt__file-wrapper');
  const nameEl = wrapper.querySelector('.kontakt__file-name');
  const errorEl = wrapper.querySelector('.kontakt__file-error');
  const MAX_SIZE = 5 * 1024 * 1024; // 5 MB (Formsubmit.co limit)
  const ALLOWED = ['application/pdf', 'image/jpeg', 'image/png'];

  input.addEventListener('change', () => {
    nameEl.textContent = '';
    errorEl.textContent = '';

    const file = input.files[0];
    if (!file) return;

    if (!ALLOWED.includes(file.type)) {
      errorEl.textContent = 'Povolené formáty jsou PDF, JPG a PNG. Maximální velikost souboru je 5 MB.';
      input.value = '';
      return;
    }

    if (file.size > MAX_SIZE) {
      errorEl.textContent = 'Povolené formáty jsou PDF, JPG a PNG. Maximální velikost souboru je 5 MB.';
      input.value = '';
      return;
    }

    nameEl.textContent = file.name;
  });
});

// Sticky nav shadow on scroll
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      nav.style.boxShadow = '0 2px 16px rgba(0,0,0,0.1)';
    } else {
      nav.style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)';
    }
  });
}

// =========================================
// COOKIE CONSENT + GOOGLE ANALYTICS
// =========================================
(function() {
  const GA_ID = 'G-XXXXXXXXXX'; // TODO: replace with real GA4 Measurement ID
  const bar = document.getElementById('cookieBar');
  const acceptBtn = document.getElementById('cookieAccept');
  const rejectBtn = document.getElementById('cookieReject');

  if (!bar) return;

  const consent = localStorage.getItem('cookie_consent');

  // If already decided, don't show bar – but load GA if accepted
  if (consent === 'accepted') {
    loadGA();
    return;
  }
  if (consent === 'rejected') {
    return;
  }

  // Show bar with a slight delay for smooth entrance
  setTimeout(() => bar.classList.add('is-visible'), 600);

  acceptBtn.addEventListener('click', () => {
    localStorage.setItem('cookie_consent', 'accepted');
    bar.classList.remove('is-visible');
    loadGA();
  });

  rejectBtn.addEventListener('click', () => {
    localStorage.setItem('cookie_consent', 'rejected');
    bar.classList.remove('is-visible');
  });

  function loadGA() {
    if (GA_ID === 'G-XXXXXXXXXX') return; // skip if placeholder

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(script);

    script.onload = function() {
      window.dataLayer = window.dataLayer || [];
      function gtag(){ window.dataLayer.push(arguments); }
      gtag('js', new Date());
      gtag('config', GA_ID);
    };
  }
})();
