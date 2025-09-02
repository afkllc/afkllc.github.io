// Fade-in on scroll for sections
document.addEventListener("DOMContentLoaded", function() {
  const faders = document.querySelectorAll(".fade-in-section");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  faders.forEach(section => {
    observer.observe(section);
  });

  // Login modal
  const loginBtn = document.getElementById("loginBtn");
  const loginModal = document.getElementById("loginModal");
  const closeBtn = document.querySelector(".close");

  loginBtn.addEventListener("click", function(e) {
    e.preventDefault();
    loginModal.classList.add("active");
  });
  closeBtn.addEventListener("click", () => loginModal.classList.remove("active"));
  loginModal.addEventListener("click", (e) => {
    if (e.target === loginModal) {
      loginModal.classList.remove("active");
    }
  });

  // Signup form submission
  const joinForm = document.getElementById("join-form");
  joinForm.addEventListener("submit", function(e) {
    e.preventDefault();
    alert("Thank you! You have been added to the waitlist. We’ll send you an email soon.");
    joinForm.reset();
  });
});
