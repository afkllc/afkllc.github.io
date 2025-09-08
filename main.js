// main.js (BBC Bitesize revamp)
// - Smooth animations on scroll
// - Mobile nav toggle
// - Stat counters (parse numbers from DOM)
// - Card tilt
// - FAQ accordion
// - Formspree handler (preserves your form but keeps UX)

document.addEventListener('DOMContentLoaded', () => {

  /* ===========================
     Mobile nav toggle
     =========================== */
  const mobileToggle = document.getElementById('mobileToggle');
  const navList = document.querySelector('.nav-list');

  if (mobileToggle && navList) {
    mobileToggle.addEventListener('click', () => {
      const open = navList.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      
      // Animate hamburger icon
      const icon = mobileToggle.querySelector('i');
      if (open) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });

    // close on link click (mobile)
    navList.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      if (navList.classList.contains('open')) {
        navList.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        const icon = mobileToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    }));
  }

  /* ===========================
     Intersection Observer: reveal elements and stats
     =========================== */
  const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
  const revealed = new WeakSet();

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // stat counters
        if (entry.target.classList.contains('stat-box') || entry.target.matches('.stat-box *')) {
          const stat = entry.target.querySelector ? entry.target.querySelector('.stat-number') : null;
          if (stat && !revealed.has(stat)) {
            startCount(stat);
            revealed.add(stat);
          }
        }
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach(el => io.observe(el));
  document.querySelectorAll('.stat-box').forEach(el => io.observe(el));

  /* ===========================
     Stat counter
     - reads data-target attr or parses numeric text
     =========================== */
  function startCount(el) {
    const text = el.getAttribute('data-target') || el.textContent || '';
    const numMatch = String(text).match(/\d+/);
    if (!numMatch) return;
    const end = parseInt(numMatch[0], 10);
    const duration = 2000;
    let start = null;
    
    // Get any suffix (%, +, etc.)
    const suffix = text.replace(/\d+/g, '') || '';
    
    function step(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      
      // Use easing function for smoother animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const val = Math.floor(easeOutQuart * end);
      
      el.textContent = val.toLocaleString() + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = end.toLocaleString() + suffix;
      }
    }
    requestAnimationFrame(step);
  }

  /* ===========================
     Card tilt for elements with class 'tilt'
     =========================== */
  document.querySelectorAll('.tilt').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = (x - cx) / cx;
      const dy = (y - cy) / cy;
      
      // Reduced tilt amount for more subtle effect
      const tiltX = (dy * 4).toFixed(2);
      const tiltY = (dx * -4).toFixed(2);
      
      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.03)`;
      card.style.transition = 'transform 150ms ease-out';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 500ms cubic-bezier(.2,.9,.3,1)';
    });
  });

  /* ===========================
     FAQ accordion
     =========================== */
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;
    
    btn.addEventListener('click', () => {
      const isOpen = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      
      // Animate chevron icon
      const icon = btn.querySelector('i');
      if (isOpen) {
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
      } else {
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
      }
    });
  });

  /* ===========================
     Smooth internal anchor scroll
     =========================== */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      
      e.preventDefault();
      const headerHeight = document.querySelector('.site-header').offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Update URL without scrolling
      history.pushState(null, null, href);
    });
  });

  /* ===========================
     Preserve your Formspree handler (kept robust)
     - uses capture-phase submit listener to prevent navigation
     =========================== */
  (function(){
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    if (!contactForm) return;

    try { contactForm.target = '_self'; } catch(e){}

    const endpoint = contactForm.getAttribute('action') || '';

    document.addEventListener('submit', async function(ev) {
      if (!ev.target || ev.target.id !== 'contactForm') return;
      ev.preventDefault();
      ev.stopImmediatePropagation();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) { 
        submitBtn.disabled = true; 
        submitBtn.classList.add('sending');
        submitBtn.textContent = 'Sending...';
      }
      
      if (formStatus) { 
        formStatus.style.color = ''; 
        formStatus.textContent = 'Sending…'; 
      }

      // honeypot
      const gotcha = contactForm.querySelector('input[name="_gotcha"]');
      if (gotcha && gotcha.value) {
        if (submitBtn) { 
          submitBtn.disabled = false; 
          submitBtn.classList.remove('sending');
          submitBtn.textContent = 'Send Message';
        }
        if (formStatus) formStatus.textContent = '';
        return;
      }

      const data = new FormData(contactForm);
      try {
        const resp = await fetch(endpoint, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });

        if (resp.ok) {
          if (formStatus) { 
            formStatus.style.color = 'var(--bb-green)'; 
            formStatus.textContent = 'Thanks — message sent! 🎉'; 
          }
          contactForm.reset();
        } else {
          const json = await resp.json().catch(()=>null);
          if (formStatus) {
            formStatus.style.color = 'var(--bb-red)';
            formStatus.textContent = json?.error || 'Sorry — something went wrong. Please try again later.';
          }
        }
      } catch (err) {
        console.error('Form submit error:', err);
        if (formStatus) {
          formStatus.style.color = 'var(--bb-red)';
          formStatus.textContent = 'Network error. Please try again later.';
        }
      } finally {
        if (submitBtn) { 
          submitBtn.disabled = false; 
          submitBtn.classList.remove('sending');
          submitBtn.textContent = 'Send Message';
        }
      }
    }, true);
  })();

  /* ===========================
     Header hide on scroll (improves focus)
     =========================== */
  let lastScroll = 0;
  const header = document.querySelector('.site-header');
  const headerHeight = header ? header.offsetHeight : 0;
  
  window.addEventListener('scroll', () => {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    if (!header) return;
    
    if (st > lastScroll && st > headerHeight) {
      header.style.transform = 'translateY(-100%)';
    } else {
      header.style.transform = '';
    }
    lastScroll = st <= 0 ? 0 : st;
  }, { passive: true });

  /* ===========================
     Add animation to newsletter form
     =========================== */
  const newsletterForm = document.querySelector('.newsletter');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const input = this.querySelector('input[type="email"]');
      const button = this.querySelector('button');
      
      if (input.value) {
        // Visual feedback
        button.textContent = 'Subscribed!';
        button.style.background = 'var(--bb-green)';
        
        setTimeout(() => {
          alert('Subscribed — welcome! 💌');
          input.value = '';
          button.textContent = 'Subscribe';
          button.style.background = '';
        }, 800);
      }
    });
  }

});
