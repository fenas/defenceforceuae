document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     GLOBAL HELPER: DETECT VISIBILITY / VIEWPORT
     ========================================================================== */
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  /* ==========================================================================
     1. STICKY HEADER & SCROLL PROGRESS
     ========================================================================== */
  const header = document.getElementById('header');
  const progressBar = document.getElementById('scroll-progress');

  window.addEventListener('scroll', () => {
    // Sticky Header Scroll State
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll Progress Calculation
    const windowScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (windowScroll / height) * 100;
    if (progressBar) {
      progressBar.style.width = scrolled + '%';
    }
  });

  /* ==========================================================================
     2. MOBILE MENU NAVIGATION TOGGLE
     ========================================================================== */
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('open');
      navMenu.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', !isOpen);
    });

    // Close menu when clicking link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ==========================================================================
     3. ACTIVE NAVIGATION HIGHLIGHTING (SCROLL MONITOR)
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');
  
  const highlightNavigation = () => {
    const scrollY = window.scrollY;
    
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120; // offset header
      const sectionId = current.getAttribute('id');
      const activeLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);
      
      if (activeLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach(link => link.classList.remove('active'));
          activeLink.classList.add('active');
        }
      }
    });
  };

  window.addEventListener('scroll', highlightNavigation);

  /* ==========================================================================
     4. AMBIENT GLOW MOUSE FOLLOWER (HERO)
     ========================================================================== */
  const heroSection = document.getElementById('hero');
  const heroGlow = document.getElementById('hero-glow');

  if (heroSection && heroGlow) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position inside container
      const y = e.clientY - rect.top;  // y position inside container
      
      // Smoothly move the glow to coordinates
      heroGlow.style.transform = `translate(${x - 300}px, ${y - 300}px)`;
    });
  }



  /* ==========================================================================
     6. SCROLL REVEAL ANIMATIONS
     ========================================================================== */
  const revealElements = [
    '.section-header', 
    '.bento-card', 
    '.process-step', 
    '.feature-card', 
    '.grid-2-col > div',
    '.contact-wrapper',
    '.gallery-item',
    '.map-container'
  ];

  // Dynamically assign 'reveal' class to DOM elements
  revealElements.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add('reveal');
    });
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // trigger animation once
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });

  /* ==========================================================================
     7. VETTING EXPERTISE Progress Meters Animation
     ========================================================================== */
  const meterSection = document.querySelector('.expertise-section');
  const meterFills = document.querySelectorAll('.meter-fill');

  const meterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        meterFills.forEach(fill => {
          fill.classList.add('animated');
        });
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  if (meterSection) {
    meterObserver.observe(meterSection);
  }

  /* ==========================================================================
     8. DYNAMIC STATISTICS COUNTER ANIMATION
     ========================================================================== */
  const statNumbers = document.querySelectorAll('.stat-num');

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 2000; // 2 seconds animation duration
    const stepTime = Math.abs(Math.floor(duration / target));
    let current = 0;

    const timer = setInterval(() => {
      current += Math.ceil(target / 100);
      if (current >= target) {
        el.textContent = target + (target === 100 ? '%' : '+');
        clearInterval(timer);
      } else {
        el.textContent = current + (target === 100 ? '%' : '+');
      }
    }, Math.max(stepTime, 20));
  };

  const statObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  statNumbers.forEach(num => {
    statObserver.observe(num);
  });

  /* ==========================================================================
     9. PHOTO GALLERY INTERACTIVE FILTERING
     ========================================================================== */
  const galleryFilterBtns = document.querySelectorAll('.gallery-tabs .btn');
  const galleryItems = document.querySelectorAll('.gallery-grid .gallery-item');

  galleryFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      galleryFilterBtns.forEach(b => b.classList.remove('active'));
      // Add active class to current button
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'block';
          // Smooth fade in
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  /* ==========================================================================
     10. CONSULTATION FORM SUBMIT
     ========================================================================== */
  const contactForm = document.getElementById('consultation-form');
  const formFeedback = document.getElementById('form-feedback');
  const formSubmitBtn = document.getElementById('form-submit');

  if (contactForm && formFeedback && formSubmitBtn) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Visual feedback submit
      formSubmitBtn.disabled = true;
      formSubmitBtn.textContent = 'Processing Guard Placement Request...';
      
      // Simulate API submit delay
      setTimeout(() => {
        formFeedback.style.display = 'block';
        formFeedback.textContent = '✓ SECURE TRANSMISSION COMPLETED. Our tactical dispatch team will coordinate contact within 2 hours.';
        formFeedback.className = 'form-feedback success';
        contactForm.reset();
        
        formSubmitBtn.disabled = false;
        formSubmitBtn.textContent = 'Submit Guard Placement Request';
        
        // Clear message after 8 seconds
        setTimeout(() => {
          formFeedback.style.display = 'none';
        }, 8000);
      }, 1500);
    });
  }
});
