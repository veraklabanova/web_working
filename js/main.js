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
    // Longer stagger 0–5s for a slower wave
    const delay = Math.random() * 5;
    // Each dot fades in at its own pace 2.5–5s
    const duration = 2.5 + Math.random() * 2.5;

    dot.style.left = x + 'px';
    dot.style.top = y + 'px';
    dot.style.width = size + 'px';
    dot.style.height = size + 'px';
    dot.style.setProperty('--dot-opacity', opacity);
    dot.style.setProperty('--dot-duration', duration + 's');
    dot.style.animationDelay = delay + 's';

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
    // Each dot glows at its own random time and pace
    const glowDelay = baseDelay + baseDuration + 1 + Math.random() * 5;
    const glowDuration = 3 + Math.random() * 5;
    dot.style.setProperty('--glow-delay', glowDelay + 's');
    dot.style.setProperty('--glow-duration', glowDuration + 's');

    if (idx === 0) {
      // Hero glow – the biggest one, dot itself grows ~2%
      dot.style.setProperty('--glow-scale', '8');
      dot.style.setProperty('--glow-end-opacity', '0.5');
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

// Form submit – show confirmation
document.querySelectorAll('.kontakt__form').forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // TODO: replace with actual form submission (e.g. fetch to backend/Formspree)
    // For now, simulate success after a brief delay
    const success = form.parentElement.querySelector('.kontakt__success');
    if (success) {
      form.style.display = 'none';
      success.classList.add('is-visible');
    }
  });
});

// File upload validation
document.querySelectorAll('.kontakt__file-input').forEach(input => {
  const wrapper = input.closest('.kontakt__file-wrapper');
  const nameEl = wrapper.querySelector('.kontakt__file-name');
  const errorEl = wrapper.querySelector('.kontakt__file-error');
  const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
  const ALLOWED = ['application/pdf', 'image/jpeg', 'image/png'];

  input.addEventListener('change', () => {
    nameEl.textContent = '';
    errorEl.textContent = '';

    const file = input.files[0];
    if (!file) return;

    if (!ALLOWED.includes(file.type)) {
      errorEl.textContent = 'Povolené formáty jsou PDF, JPG a PNG. Maximální velikost souboru je 10 MB.';
      input.value = '';
      return;
    }

    if (file.size > MAX_SIZE) {
      errorEl.textContent = 'Povolené formáty jsou PDF, JPG a PNG. Maximální velikost souboru je 10 MB.';
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
