/* ================================================================
   CONSTANT ALANKPOKINTO — PORTFOLIO v3 (CORRECTED)
   ================================================================ */

document.addEventListener("DOMContentLoaded", () => {

  /* ============ PARTICLES ============ */
  const canvas = document.getElementById("particles");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let W, H, particles = [];

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    resize();

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.r = Math.random() * 1.5 + 0.3;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.alpha = Math.random() * 0.4 + 0.1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < -10 || this.x > W + 10 || this.y < -10 || this.y > H + 10) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,229,255,${this.alpha})`;
        ctx.fill();
      }
    }

    const count = Math.min(80, Math.floor((W * H) / 16000));
    for (let i = 0; i < count; i++) particles.push(new Particle());

    function animateParticles() {
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) { p.update(); p.draw(); }

      // Draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 14400) { // 120^2
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,229,255,${0.08 * (1 - Math.sqrt(distSq) / 120)})`;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  /* ============ NAV SCROLL (FIX: was missing) ============ */
  const nav = document.getElementById("navbar");
  if (nav) {
    window.addEventListener("scroll", () => {
      nav.classList.toggle("scrolled", window.scrollY > 60);
    });
  }

  /* ============ MOBILE MENU (FIX: "n toggleMenu" → proper function) ============ */
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", function () {
      navLinks.classList.toggle("open");
      hamburger.classList.toggle("open");
    });

    // Close mobile menu on link click
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        navLinks.classList.remove("open");
        hamburger.classList.remove("open");
      });
    });
  }

  // Also expose toggleMenu globally for backward compat (in case onclick is used)
  window.toggleMenu = function () {
    if (navLinks && hamburger) {
      navLinks.classList.toggle("open");
      hamburger.classList.toggle("open");
    }
  };

  /* ============ SCROLL REVEAL ============ */
  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
  );

  document.querySelectorAll(".reveal").forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ============ SKILL BAR ANIMATION ============ */
  const skillObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll(".skill-bar-fill").forEach(function (bar, i) {
            setTimeout(function () {
              bar.style.width = bar.dataset.width;
            }, i * 120);
          });
          skillObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.25 }
  );

  document.querySelectorAll(".skill-category").forEach(function (el) {
    skillObserver.observe(el);
  });

  /* ============ ACTIVE NAV LINK ============ */
  const sections = document.querySelectorAll("section[id]");
  const navAnchors = document.querySelectorAll(".nav-links a[href^='#']");

  window.addEventListener("scroll", function () {
    let current = "";
    sections.forEach(function (s) {
      if (window.scrollY >= s.offsetTop - 130) {
        current = s.getAttribute("id");
      }
    });
    navAnchors.forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("href") === "#" + current);
    });
  });

  /* ============ TYPING EFFECT (NEW) ============ */
  const typingEl = document.getElementById("typing-text");
  if (typingEl) {
    const words = [
      "Réseaux & Cybersécurité",
      "Développement Web & Mobile",
      "Administration Système",
      "Support Informatique"
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function typeLoop() {
      const current = words[wordIndex];

      if (!deleting) {
        typingEl.textContent = current.slice(0, charIndex + 1);
        charIndex++;
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(typeLoop, 2200);
          return;
        }
        setTimeout(typeLoop, 65);
      } else {
        typingEl.textContent = current.slice(0, charIndex);
        charIndex--;
        if (charIndex < 0) {
          deleting = false;
          charIndex = 0;
          wordIndex = (wordIndex + 1) % words.length;
          setTimeout(typeLoop, 400);
          return;
        }
        setTimeout(typeLoop, 35);
      }
    }

    setTimeout(typeLoop, 800);
  }

  /* ============ CONTACT FORM ============ */
  window.sendForm = async function () {
    const name = document.getElementById("formName").value.trim();
    const email = document.getElementById("formEmail").value.trim();
    const msg = document.getElementById("formMsg").value.trim();
    const btn = document.querySelector(".btn-submit");

    if (!name || !email || !msg) {
      showToast("⚠ Veuillez remplir tous les champs.", "warning");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast("⚠ Adresse email invalide.", "warning");
      return;
    }

    btn.disabled = true;
    btn.textContent = "Envoi en cours...";

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message: msg }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast("✓ Message envoyé avec succès !", "success");
        document.getElementById("formName").value = "";
        document.getElementById("formEmail").value = "";
        document.getElementById("formMsg").value = "";
      } else {
        showToast("⚠ " + (data.error || "Erreur lors de l'envoi."), "warning");
      }
    } catch (err) {
      showToast("⚠ Impossible de contacter le serveur.", "warning");
    } finally {
      btn.disabled = false;
      btn.textContent = "Envoyer le message →";
    }
  };

  /* ============ TOAST NOTIFICATION (NEW) ============ */
  function showToast(message, type) {
    var toast = document.getElementById("toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "toast";
      toast.className = "toast";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.borderColor = type === "warning" ? "rgba(255,138,60,.4)" : "rgba(0,255,157,.3)";
    toast.style.color = type === "warning" ? "#ff8a3c" : "#00ff9d";
    toast.classList.add("show");
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(function () {
      toast.classList.remove("show");
    }, 3500);
  }

  /* ============ AVATAR SLIDESHOW ============ */
  var slides = document.querySelectorAll(".avatar-slideshow .slide");
  if (slides.length > 0) {
    var current = 0;
    setInterval(function () {
      slides[current].classList.remove("active");
      current = (current + 1) % slides.length;
      slides[current].classList.add("active");
    }, 5000);
  }

});
