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
  initScrollRevealAnimations();
  initServicesFilter();
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
   3. Animated Numerical Data Counters (High-Performance Zero-Lag)
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
      const duration = 1200; // Snappy 1.2s duration to prevent scroll-drag stalls
      const startTime = performance.now();
      let lastVal = '';

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Quartic ease out: snappy ramp up, buttery smooth deceleration
        const easeOut = 1 - Math.pow(1 - progress, 4);
        const currentVal = easeOut * target;

        // Throttled DOM updates: only mutate DOM when the formatted text changes
        const displayVal = isDecimal 
          ? currentVal.toFixed(1) 
          : Math.floor(currentVal).toLocaleString();

        if (displayVal !== lastVal) {
          counter.textContent = displayVal;
          lastVal = displayVal;
        }

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          // Guarantee exact target value
          counter.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString();
        }
      };

      requestAnimationFrame(updateCounter);

      // Safety fallback: if scrolling or gesture throttling pauses rAF, guarantee completion
      setTimeout(() => {
        counter.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString();
      }, duration + 150);
    });
  };

  // Immediate start if hero is already in viewport on page load
  if (window.scrollY < 400) {
    setTimeout(animateNumbers, 250);
    return;
  }

  // Trigger when entering viewport
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateNumbers();
          observer.disconnect();
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px 50px 0px' });

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
  const WHATSAPP_PHONE = '917990623774';

  const openWhatsAppDirect = (customMsg) => {
    const defaultMsg = 'Hello Dr. Vimi Padhiyar, I would like to book a consultation appointment.';
    const msg = customMsg || defaultMsg;
    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const openModal = () => {
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeModal = () => {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  // If any button has data-open-modal="booking", redirect directly to WhatsApp with appropriate message
  openButtons.forEach(btn => btn.addEventListener('click', (e) => {
    // If it's an anchor with an href pointing to wa.me, allow native navigation
    if (btn.tagName === 'A' && btn.getAttribute('href') && btn.getAttribute('href').includes('wa.me')) {
      return;
    }
    e.preventDefault();
    const serviceName = btn.getAttribute('data-service');
    const msg = serviceName 
      ? `Hello Dr. Vimi Padhiyar, I would like to book an appointment for ${serviceName}.`
      : 'Hello Dr. Vimi Padhiyar, I would like to book a consultation appointment.';
    openWhatsAppDirect(msg);
  }));

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const patientName = document.getElementById('patientName')?.value?.trim() || '';
      const patientPhone = document.getElementById('patientPhone')?.value?.trim() || '';
      const patientEmail = document.getElementById('patientEmail')?.value?.trim() || '';
      const treatmentSelect = document.getElementById('treatmentCategory');
      const treatment = treatmentSelect && treatmentSelect.selectedIndex > 0 ? treatmentSelect.options[treatmentSelect.selectedIndex].text : '';
      const appointmentDate = document.getElementById('appointmentDate')?.value?.trim() || '';
      const patientNotes = document.getElementById('patientNotes')?.value?.trim() || '';

      let text = 'Hello Dr. Vimi Padhiyar, I would like to book a consultation appointment.';
      if (patientName) text += `\nName: ${patientName}`;
      if (patientPhone) text += `\nPhone: ${patientPhone}`;
      if (patientEmail) text += `\nEmail: ${patientEmail}`;
      if (treatment) text += `\nConcern: ${treatment}`;
      if (appointmentDate) text += `\nPreferred Date: ${appointmentDate}`;
      if (patientNotes) text += `\nNotes: ${patientNotes}`;

      closeModal();
      form.reset();
      showToast(`Thank you, ${patientName || 'Patient'}! Redirecting to WhatsApp to complete your booking.`);
      openWhatsAppDirect(text);
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

  if (window.innerWidth < 1024 || 'ontouchstart' in window || navigator.maxTouchPoints > 0) return;

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

/* --------------------------------------------------------------------------
   Scroll Reveal Animations (IntersectionObserver with unobserve for zero lag)
   -------------------------------------------------------------------------- */
function initScrollRevealAnimations() {
  const reveals = document.querySelectorAll('.reveal-on-scroll, .reveal-scale');
  if (!reveals.length) return;

  // Graceful fallback if IntersectionObserver is not supported
  if (!('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target); // Detach immediately for 60-120fps buttery performance
      }
    });
  }, {
    root: null,
    threshold: 0.02,
    rootMargin: '0px 0px 40px 0px' // Pre-triggers 40px ahead of viewport for zero mobile lag
  });

  reveals.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   Services Catalog: Dynamic Real-Time Search & Category Filtering
   -------------------------------------------------------------------------- */
function initServicesFilter() {
  const searchInput = document.getElementById('serviceSearchInput');
  const searchClear = document.getElementById('serviceSearchClear');
  const filterBtns = document.querySelectorAll('.service-filter-btn');
  const cards = document.querySelectorAll('.service-card');
  const emptyState = document.getElementById('servicesEmptyState');
  const resetBtn = document.getElementById('btnResetFilters');

  if (!cards.length) return;

  let activeCategory = 'all';
  let searchQuery = '';

  function applyFilter() {
    let visibleCount = 0;
    const q = searchQuery.toLowerCase().trim();

    cards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      const keywords = (card.getAttribute('data-keywords') || '').toLowerCase();
      const title = (card.querySelector('.service-card-title')?.textContent || '').toLowerCase();
      const desc = (card.querySelector('.service-card-desc')?.textContent || '').toLowerCase();

      const matchesCategory = (activeCategory === 'all' || cardCategory === activeCategory);
      const matchesSearch = !q || keywords.includes(q) || title.includes(q) || desc.includes(q);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        card.classList.add('is-revealed');
        card.style.opacity = '1';
        card.style.transform = 'translate3d(0, 0, 0)';
        visibleCount++;
      } else {
        card.style.display = 'none';
        card.style.opacity = '0';
        card.style.transform = 'translate3d(0, 8px, 0)';
      }
    });

    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  // Live Search Input Listener
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      if (searchClear) {
        searchClear.style.display = searchQuery.length > 0 ? 'flex' : 'none';
      }
      applyFilter();
    });

    // Clear Search on Escape
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchInput.value = '';
        searchQuery = '';
        if (searchClear) searchClear.style.display = 'none';
        applyFilter();
      }
    });
  }

  // Clear Button Click
  if (searchClear) {
    searchClear.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      searchQuery = '';
      searchClear.style.display = 'none';
      applyFilter();
    });
  }

  // Category Filter Buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      activeCategory = btn.getAttribute('data-category') || 'all';
      applyFilter();
    });
  });

  // Reset All Filters Button
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      searchQuery = '';
      if (searchClear) searchClear.style.display = 'none';
      activeCategory = 'all';

      filterBtns.forEach(b => {
        const isAll = b.getAttribute('data-category') === 'all';
        b.classList.toggle('active', isAll);
        b.setAttribute('aria-selected', isAll ? 'true' : 'false');
      });

      applyFilter();
      if (searchInput) searchInput.focus();
    });
  }
}


