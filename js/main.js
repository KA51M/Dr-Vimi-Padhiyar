/**
 * DR. VIMI PADHIYAR - CLINICAL & AESTHETIC DERMATOLOGY
 * Interactive JavaScript Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileMenu();
  initCounterAnimations();
  initAppointmentModal();
  initVideoModal();
  initHeroParallax();
  initSmoothScrollLinks();
  initBentoBeforeAfterSlider();
});

/* --------------------------------------------------------------------------
   1. Navbar Scroll Effect
   -------------------------------------------------------------------------- */
function initNavbarScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   2. Mobile Drawer Navigation
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-nav-drawer');
  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
    
    // Animate hamburger lines
    const spans = toggleBtn.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'translateY(9px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-9px) rotate(-45deg)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });

  // Close when clicking a link
  drawer.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      const spans = toggleBtn.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    });
  });
}

/* --------------------------------------------------------------------------
   3. Animated Numerical Data Counters
   -------------------------------------------------------------------------- */
function initCounterAnimations() {
  const counters = document.querySelectorAll('.counter-val');
  if (!counters.length) return;

  let animated = false;

  const animateNumbers = () => {
    if (animated) return;
    animated = true;

    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const isDecimal = counter.getAttribute('data-decimal') === 'true';
      const duration = 1800; // ms
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out quad
        const easeOut = 1 - (1 - progress) * (1 - progress);
        const currentVal = easeOut * target;

        if (isDecimal) {
          counter.textContent = currentVal.toFixed(1);
        } else {
          counter.textContent = Math.floor(currentVal).toLocaleString();
        }

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          if (isDecimal) {
            counter.textContent = target.toFixed(1);
          } else {
            counter.textContent = target.toLocaleString();
          }
        }
      };

      requestAnimationFrame(updateCounter);
    });
  };

  // Trigger on load or when entering viewport
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateNumbers();
          observer.disconnect();
        }
      });
    }, { threshold: 0.2 });

    const statsWrap = document.querySelector('.hero-stats-wrap');
    if (statsWrap) {
      observer.observe(statsWrap);
    } else {
      animateNumbers();
    }
  } else {
    animateNumbers();
  }
}

/* --------------------------------------------------------------------------
   4. Appointment Booking Modal & Toast
   -------------------------------------------------------------------------- */
function initAppointmentModal() {
  const modal = document.getElementById('bookingModal');
  const openButtons = document.querySelectorAll('[data-open-modal="booking"]');
  const closeBtn = document.getElementById('closeBookingModal');
  const form = document.getElementById('appointmentForm');
  const toast = document.getElementById('appointmentToast');

  if (!modal) return;

  const openModal = () => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  openButtons.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  }));

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const patientName = document.getElementById('patientName').value || 'Patient';
      closeModal();
      form.reset();
      showToast(`Thank you, ${patientName}! Your consultation appointment request has been scheduled.`);
    });
  }

  function showToast(message) {
    if (!toast) return;
    const toastMsg = toast.querySelector('.toast-msg');
    if (toastMsg) toastMsg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }
}

/* --------------------------------------------------------------------------
   5. Video Modal
   -------------------------------------------------------------------------- */
function initVideoModal() {
  const modal = document.getElementById('videoModal');
  const openBtn = document.querySelector('[data-open-modal="video"]');
  const closeBtn = document.getElementById('closeVideoModal');
  const iframe = document.getElementById('videoIframe');

  if (!modal || !openBtn) return;

  const videoSrc = "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"; // placeholder medical intro

  const openModal = () => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    // If you wish to load video dynamically:
    if (iframe && !iframe.src) {
      iframe.src = "https://www.youtube-nocookie.com/embed/ScMzIvxBSi4?autoplay=1&mute=0";
    }
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    if (iframe) iframe.src = '';
  };

  openBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   6. Heart-Touching Smooth Hero Parallax
   -------------------------------------------------------------------------- */
function initHeroParallax() {
  const hero = document.querySelector('.hero-section');
  const archContainer = document.querySelector('.hero-arch-container');
  const badges = document.querySelectorAll('.floating-badge');
  if (!hero || !archContainer || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  if (window.innerWidth < 1024) return;

  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;
  let isMoving = false;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    targetX = x * 22; // subtle shift range
    targetY = y * 18;
    if (!isMoving) {
      isMoving = true;
      requestAnimationFrame(updateParallax);
    }
  });

  hero.addEventListener('mouseleave', () => {
    targetX = 0;
    targetY = 0;
  });

  function updateParallax() {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;

    archContainer.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

    badges.forEach((badge, idx) => {
      const factor = idx === 0 ? 1.5 : -1.3;
      badge.style.transform = `translate3d(${currentX * factor}px, ${currentY * factor}px, 0)`;
    });

    if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
      requestAnimationFrame(updateParallax);
    } else {
      isMoving = false;
    }
  }
}

/* --------------------------------------------------------------------------
   7. In-Page Smooth Scroll Links (e.g. Know More button)
   -------------------------------------------------------------------------- */
function initSmoothScrollLinks() {
  const knowMoreBtn = document.getElementById('aboutKnowMoreBtn');
  if (knowMoreBtn) {
    knowMoreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('about-story');
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  }
}

/* --------------------------------------------------------------------------
   8. Bento Before & After Interactive Slider (Smooth Drag & Reveal)
   -------------------------------------------------------------------------- */
function initBentoBeforeAfterSlider() {
  const card = document.querySelector('.bento-card--before-after');
  if (!card) return;

  const stage = card.querySelector('.ba-comparison-stage');
  const beforeLayer = card.querySelector('.ba-before-layer');
  const line = card.querySelector('.bento-slider-line');
  const rangeInput = card.querySelector('.ba-range-slider');
  if (!stage || !beforeLayer || !line) return;

  const setPosition = (percent) => {
    const clamped = Math.max(5, Math.min(95, percent));
    beforeLayer.style.clipPath = `inset(0 calc(100% - ${clamped}%) 0 0)`;
    line.style.left = `${clamped}%`;
    if (rangeInput && Math.abs(rangeInput.value - clamped) > 0.5) {
      rangeInput.value = clamped;
    }
  };

  // 1. Native Range Input (Accessible, Drag, Touch & Click)
  if (rangeInput) {
    rangeInput.addEventListener('input', (e) => {
      setPosition(parseFloat(e.target.value));
    });
  }

  // 2. Direct Stage Pointer Events (Smooth Mouse & Touch Drag)
  let isPointerDown = false;

  const handlePointer = (clientX) => {
    const rect = stage.getBoundingClientRect();
    if (rect.width <= 0) return;
    const x = clientX - rect.left;
    const percent = (x / rect.width) * 100;
    setPosition(percent);
  };

  stage.addEventListener('mousedown', (e) => {
    isPointerDown = true;
    handlePointer(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isPointerDown) return;
    handlePointer(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isPointerDown = false;
  });

  stage.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches[0]) {
      isPointerDown = true;
      handlePointer(e.touches[0].clientX);
    }
  }, { passive: true });

  stage.addEventListener('touchmove', (e) => {
    if (isPointerDown && e.touches && e.touches[0]) {
      handlePointer(e.touches[0].clientX);
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isPointerDown = false;
  });
}
