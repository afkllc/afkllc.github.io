// main.js
document.addEventListener('DOMContentLoaded', function () {
  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-question');
    if (q) {
      q.addEventListener('click', () => {
        item.classList.toggle('active');
      });
    }
  });

  // Intersection Observer for scroll animations and stat animation (only once per stat)
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const animatedStats = new WeakSet();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        // Animate stat only once per element
        if (entry.target.classList.contains('stat-number') && !animatedStats.has(entry.target)) {
          animateValue(entry.target, 0, parseInt(entry.target.textContent), 2000);
          animatedStats.add(entry.target);
        }
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll, .stagger-child, .stat-number').forEach(el => {
    observer.observe(el);
  });

  // Number animation function for stats
  function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = Math.floor(progress * (end - start) + start);
      element.textContent = value.toLocaleString();
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  // Enhanced header behavior and parallax effect on scroll (combined for performance)
  let lastScrollTop = 0;
  const header = document.querySelector('header');
  const scrollThreshold = 100;

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Header hide/show
    if (header) {
      if (scrollTop > scrollThreshold) {
        if (scrollTop > lastScrollTop) {
          // Scrolling down
          header.classList.add('hidden');
        } else {
          // Scrolling up
          header.classList.remove('hidden');
        }
      } else {
        header.classList.remove('hidden');
      }
    }
    lastScrollTop = scrollTop;

    // Parallax effect
    const parallaxElements = document.querySelectorAll('.parallax');
    parallaxElements.forEach(el => {
      const speed = parseFloat(el.getAttribute('data-parallax-speed')) || 0.5;
      el.style.transform = `translateY(${scrollTop * speed}px)`;
    });
  });

  // Enhanced hover effects for service cards
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const angleY = (x - centerX) / 25;
      const angleX = (centerY - y) / 25;
      this.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale(1.05)`;
    });
    card.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
  });

  // Advanced effects stub
  initAdvancedEffects();
  function initAdvancedEffects() {
    // Place advanced effect initializers here if needed
  }

  // Smooth scrolling for internal anchors
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const targetEl = document.querySelector(href);
      if (!targetEl) return;
      e.preventDefault();
      const top = targetEl.getBoundingClientRect().top + window.pageYOffset - 84;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // Formspree handler with feedback
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xvgbdwob';

  // Robust Formspree handler (replace your existing handler block)
(function(){
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (!contactForm) return;

  // Defensive: ensure the form doesn't open in a new tab
  try { contactForm.target = '_self'; } catch(e){ /* ignore */ }

  // Use the form's action as endpoint (fallback if you move IDs)
  const endpoint = contactForm.getAttribute('action') || 'https://formspree.io/f/xvgbdwob';

  // Capture-phase listener — runs before bubbling listeners and is harder for other code to override
  document.addEventListener('submit', async function(ev) {
    if (!ev.target || ev.target.id !== 'contactForm') return;

    // Prevent default native submit/navigation and stop other listeners
    ev.preventDefault();
    ev.stopImmediatePropagation();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add('sending');
    }
    if (formStatus) {
      formStatus.style.color = '';
      formStatus.textContent = 'Sending…';
    }

    // Simple honeypot check
    const gotcha = contactForm.querySelector('input[name="_gotcha"]');
    if (gotcha && gotcha.value) {
      // silent drop for bots
      if (submitBtn) { submitBtn.disabled = false; submitBtn.classList.remove('sending'); }
      if (formStatus) formStatus.textContent = '';
      return;
    }

    const data = new FormData(contactForm);

    try {
      const resp = await fetch(endpoint, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' } // ensures JSON reply and prevents navigation
      });

      if (resp.ok) {
        if (formStatus) {
          formStatus.style.color = '';
          formStatus.textContent = 'Thanks — message sent! 🎉';
        }
        contactForm.reset();
      } else {
        const json = await resp.json().catch(()=>null);
        if (formStatus) {
          formStatus.style.color = 'crimson';
          formStatus.textContent = json?.error || 'Sorry — something went wrong. Please try again later.';
        }
      }
    } catch (err) {
      console.error('Form submit error:', err);
      if (formStatus) {
        formStatus.style.color = 'crimson';
        formStatus.textContent = 'Network error. Please try again later.';
      }
    } finally {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.classList.remove('sending'); }
    }
  }, true); // <<< NOTE the "true" (capture phase)
})();

  // Mobile nav toggle using CSS class for state
  const mobileToggle = document.getElementById('mobileToggle');
  const nav = document.querySelector('nav ul');
  if (mobileToggle && nav) {
    mobileToggle.addEventListener('click', () => {
      nav.classList.toggle('mobile-open');
    });

    // Reset nav styles on resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 940) {
        nav.classList.remove('mobile-open');
      }
    });
  }
});
