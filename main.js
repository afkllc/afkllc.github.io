// main.js (with subtle animated background parallax)
// existing functionality preserved (nav toggle, reveal, stat counters, form handler, etc.)

document.addEventListener('DOMContentLoaded', () => {
  // --- existing code parts (nav toggle, intersection observer, stats, tilt, FAQ, smooth scroll, form handler)
  // For brevity I'm including only the new background code plus the essentials previously present.
  // If you already have the previous main.js, simply append the new background code below it.
  
  // -------------------------
  // Subtle background parallax
  // -------------------------
  const animatedBg = document.querySelector('.animated-bg');
  const bgSvg = animatedBg ? animatedBg.querySelector('svg, img') : null;

  // Respect reduced motion
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (animatedBg && bgSvg && !reduceMotion) {
    // mouse movement parallax (very subtle)
    let lastX = 0, lastY = 0;
    let raf = null;
    const damp = 0.08; // lower = smoother/slower
    const maxTranslate = 18; // px (very small)

    function onMove(e){
      const w = window.innerWidth;
      const h = window.innerHeight;
      // normalized -0.5..0.5
      const nx = (e.clientX / w) - 0.5;
      const ny = (e.clientY / h) - 0.5;
      const targetX = nx * maxTranslate;
      const targetY = ny * maxTranslate * 0.6;

      // animate with requestAnimationFrame (smooth)
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        lastX += (targetX - lastX) * damp;
        lastY += (targetY - lastY) * damp;
        bgSvg.style.transform = `translate(calc(-50% + ${lastX}px), calc(-48% + ${lastY}px))`;
      });
    }

    // slow vertical scroll parallax
    function onScroll(){
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY || window.pageYOffset;
        // small upward drift as you scroll down
        const scrollOffset = Math.min(60, y * 0.03);
        bgSvg.style.transform = bgSvg.style.transform.replace(/translate\([^\)]+\)/, `translate(calc(-50% + ${lastX}px), calc(-48% + ${lastY - scrollOffset}px))`);
      });
    }

    // limit listener frequency for performance
    let lastMove = 0;
    window.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (now - lastMove > 16) { // ~60fps cap
        onMove(e); lastMove = now;
      }
    }, { passive: true });

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // --- rest of your existing main.js functionality should follow here ---
  // If you replaced the whole main.js earlier with the "revamp" script I provided,
  // then append the above code near the end (after DOM-based initialization).
});
