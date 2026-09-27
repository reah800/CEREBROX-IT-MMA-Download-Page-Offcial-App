// Mindanao Mission Academy — Official School App Interactions

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      // Non-fatal — site still works without offline caching.
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Allow tablet users to opt into the existing responsive page layout.
  const layoutSwitch = document.getElementById('layoutSwitch');
  const layoutOptions = layoutSwitch?.querySelectorAll('[data-layout]') ?? [];
  let savedLayout = null;
  try {
    savedLayout = localStorage.getItem('mma-page-layout');
  } catch (_) {
    // The toggle still works for this visit if browser storage is unavailable.
  }
  const setLayout = (layout) => {
    const isMobileLayout = layout === 'mobile';
    document.body.classList.toggle('mobile-layout', isMobileLayout);
    layoutOptions.forEach((option) => {
      const selected = option.dataset.layout === layout;
      option.classList.toggle('is-selected', selected);
      option.setAttribute('aria-pressed', String(selected));
    });
  };

  setLayout(savedLayout === 'mobile' ? 'mobile' : 'tablet');
  layoutOptions.forEach((option) => {
    option.addEventListener('click', () => {
      const layout = option.dataset.layout;
      setLayout(layout);
      try {
        localStorage.setItem('mma-page-layout', layout);
      } catch (_) {
        // Keep the selected mode for this page even when storage is unavailable.
      }
    });
  });

  // 1. Navbar Scroll Effect & Active Section Tracking
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Update active nav link based on scroll position
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });

  // 2. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      mobileToggle.classList.toggle('is-open', isOpen);
    });

    // Close menu when clicking a link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        mobileToggle.classList.remove('is-open');
      });
    });
  }



  // 4. Download Buttons Handler
  const downloadButtons = document.querySelectorAll('.download-btn');
  const configPlayUrl = typeof APP_CONFIG !== 'undefined' ? APP_CONFIG.playStoreUrl : null;

  downloadButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const platform = btn.getAttribute('data-platform');
      
      if (platform === 'google-play' && configPlayUrl) {
        window.open(configPlayUrl, '_blank', 'noopener');
        e.preventDefault();
      }
    });
  });
});
