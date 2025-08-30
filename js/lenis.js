// premium-lenis.js - Advanced Smooth Scroll Implementation for Portfolio
class PremiumPortfolioLenis {
  constructor() {
    this.lenis = null;
    this.scrollEffects = [];
    this.lastScrollY = 0;
    this.scrollDirection = 'down';
    this.scrollVelocity = 0;
    this.lastScrollTime = Date.now();
    this.isMobile = window.innerWidth < 768;
    this.currentSection = null;
    this.scrollTarget = null;
    this.init();
  }

  init() {
    this.setupLenis();
    this.setupScrollEffects();
    this.setupEventListeners();
    this.animate();
    
    // Initialize GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    this.lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      this.lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  setupLenis() {
    this.lenis = new Lenis({
      lerp: 0.07,
      smoothWheel: true,
      smoothTouch: true,
      infinite: false,
      gestureOrientation: 'both',
      touchMultiplier: 1.5,
      wheelMultiplier: 1.2,
      syncTouch: true,
      touchInertiaMultiplier: 1.5,
      duration: 1.2
    });

    this.lenis.on('scroll', (e) => {
      this.handleScroll(e);
    });

    // Handle anchor links
    this.lenis.on('scroll', () => {
      this.handleAnchorLinks();
    });
  }

  setupScrollEffects() {
    // Section reveal effects with parallax
    document.querySelectorAll('section').forEach((section, index) => {
      this.scrollEffects.push({
        element: section,
        threshold: 0.15,
        effect: () => this.sectionRevealEffect(section, index)
      });
      
      // Add parallax to background elements
      const bgElements = section.querySelectorAll('.parallax-bg');
      bgElements.forEach(el => {
        gsap.to(el, {
          yPercent: 15,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            scrub: 0.5
          }
        });
      });
    });

    // Project card effects
    this.setupProjectCards();

    // Custom cursor with velocity effects
    this.setupCustomCursor();

    // Text reveal animations
    this.setupTextReveals();

    // Image hover distortions
    this.setupImageDistortions();

    // Skill bar animations
    this.setupSkillBars();

    // Timeline animations
    this.setupTimeline();

    // Contact form animations
    this.setupContactForm();
  }

  setupEventListeners() {
    window.addEventListener('resize', () => this.handleResize());
    
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.addEventListener('click', () => this.handleThemeChange(btn));
    });
    
    // Mouse wheel velocity detection
    window.addEventListener('wheel', (e) => {
      this.scrollVelocity = Math.abs(e.deltaY);
    }, { passive: true });

    // Navigation click handlers
    document.querySelectorAll('nav a').forEach(link => {
      link.addEventListener('click', (e) => {
        if (link.hash) {
          e.preventDefault();
          this.scrollToSection(link.hash);
        }
      });
    });

    // Back to top button
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
      backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        this.lenis.scrollTo('top', { duration: 1.5 });
      });
    }
  }

  handleScroll(e) {
    const now = Date.now();
    const deltaTime = now - this.lastScrollTime;
    this.lastScrollTime = now;
    
    // Calculate scroll velocity
    if (deltaTime > 0) {
      const deltaY = Math.abs(e.scroll - this.lastScrollY);
      this.scrollVelocity = deltaY / deltaTime * 1000;
    }
    
    this.scrollDirection = e.scroll > this.lastScrollY ? 'down' : 'up';
    this.lastScrollY = e.scroll;

    this.updateCursorPosition();
    this.runScrollEffects();
    this.navbarScrollEffect();
    this.scrollIndicatorEffect();
    this.applyScrollVelocityEffects();
    this.updateActiveSection();
    this.updateBackToTop();
  }

  applyScrollVelocityEffects() {
    // Apply effects based on scroll velocity
    const velocityNormalized = Math.min(this.scrollVelocity / 100, 1);
    
    // Add blur effect to images when scrolling fast
    document.querySelectorAll('.velocity-blur').forEach(img => {
      img.style.filter = `blur(${velocityNormalized * 3}px)`;
      img.style.transition = 'filter 0.3s ease-out';
    });
    
    // Add scale effect to decorative elements
    document.querySelectorAll('.velocity-scale').forEach(el => {
      const scale = 1 + (velocityNormalized * 0.1);
      el.style.transform = `scale(${scale})`;
    });

    // Add effect to cursor based on velocity
    if (!this.isMobile) {
      const cursor = document.querySelector('.cursor');
      const follower = document.querySelector('.cursor-follower');
      const scale = 1 + (velocityNormalized * 0.3);
      
      gsap.to([cursor, follower], {
        scale: scale,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }

  sectionRevealEffect(section, index) {
    const rect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const triggerPoint = viewportHeight * 0.15;
    const isInView = rect.top < viewportHeight - triggerPoint && rect.bottom > triggerPoint;

    if (isInView) {
      section.style.opacity = '1';
      section.style.transform = 'translateY(0)';
      section.style.pointerEvents = 'auto';

      // Special effects for each section
      switch(index) {
        case 0: // Hero section
          this.animateHeroElements();
          break;
        case 1: // About section
          this.animateAboutElements();
          break;
        case 2: // Skills section
          this.animateSkillBars();
          break;
        case 3: // Projects section
          this.animateProjectCards();
          break;
        case 4: // Experience section
          this.animateTimelineItems();
          break;
        case 5: // Courses section
          this.animateCourseCards();
          break;
        case 6: // Contact section
          this.animateContactElements();
          break;
      }
    } else {
      section.style.pointerEvents = 'none';
      if (this.scrollDirection === 'down') {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
      } else {
        section.style.opacity = '0';
        section.style.transform = 'translateY(-30px)';
      }
    }
  }

  animateHeroElements() {
    const title = document.querySelector('.hero-title');
    const subtitle = document.querySelector('.hero-subtitle');
    const text = document.querySelector('.hero-text');
    const buttons = document.querySelector('.hero-buttons');
    const avatar = document.querySelector('.avatar-container');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    // Reset animations if they already exist
    gsap.killTweensOf([title, subtitle, text, buttons, avatar, scrollIndicator]);

    // Staggered animation with custom eases
    gsap.fromTo(title, 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'back.out(1.2)' }
    );
    
    gsap.fromTo(subtitle, 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: 'power3.out' }
    );
    
    gsap.fromTo(text, 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, delay: 0.4, ease: 'power3.out' }
    );
    
    gsap.fromTo(buttons, 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, delay: 0.6, ease: 'power3.out' }
    );
    
    gsap.fromTo(avatar, 
      { scale: 0.8, opacity: 0, rotation: -5 },
      { 
        scale: 1, 
        opacity: 1, 
        rotation: 0, 
        duration: 1.2, 
        delay: 0.4, 
        ease: 'elastic.out(1, 0.5)',
        onComplete: () => {
          // Continuous subtle animation
          gsap.to(avatar, {
            y: 10,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
          });
        }
      }
    );
    
    // Animate scroll indicator
    gsap.fromTo(scrollIndicator, 
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6, delay: 1 }
    );
    
    // Animate each dot in the scroll indicator with a stagger
    gsap.fromTo(scrollIndicator.querySelectorAll('span'), 
      { y: -10, opacity: 0 },
      { 
        y: 0, 
        opacity: 0.6, 
        duration: 0.4, 
        stagger: 0.1, 
        delay: 1.2,
        ease: 'back.out(1.7)'
      }
    );
  }

  setupProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    // Initial animation when entering view
    gsap.fromTo(projectCards,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        scrollTrigger: {
          trigger: '#projects',
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );
    
    // Hover effects
    projectCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        this.projectCardHoverEffect(card, true);
      });
      
      card.addEventListener('mouseleave', () => {
        this.projectCardHoverEffect(card, false);
      });
      
      // Add subtle continuous animation
      gsap.to(card, {
        y: -3,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    });
  }

  projectCardHoverEffect(card, isHovering) {
    if (isHovering) {
      gsap.to(card, {
        y: -15,
        scale: 1.05,
        duration: 0.4,
        ease: 'power2.out',
        boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
        zIndex: 10
      });
      
      // Tilt effect
      card.addEventListener('mousemove', (e) => {
        this.handleCardTilt(card, e);
      });
      
      // Animate project links
      const links = card.querySelectorAll('.project-link');
      gsap.to(links, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        stagger: 0.1
      });
    } else {
      gsap.to(card, {
        y: 0,
        scale: 1,
        duration: 0.4,
        ease: 'power2.out',
        boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
        zIndex: 1
      });
      
      // Reset tilt
      gsap.to(card, {
        rotationY: 0,
        rotationX: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)'
      });
      
      // Hide project links
      const links = card.querySelectorAll('.project-link');
      gsap.to(links, {
        opacity: 0,
        y: 10,
        duration: 0.2
      });
    }
  }

  handleCardTilt(card, e) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const angleX = (y - centerY) / 15;
    const angleY = (centerX - x) / 15;
    
    // Calculate glow position
    const glowX = (x / rect.width) * 100;
    const glowY = (y / rect.height) * 100;

    gsap.to(card, {
      rotationX: angleX,
      rotationY: angleY,
      transformPerspective: 1000,
      transformOrigin: "center center",
      duration: 0.5,
      ease: 'power2.out',
      onUpdate: () => {
        // Add dynamic glow effect
        card.style.setProperty('--glow-x', `${glowX}%`);
        card.style.setProperty('--glow-y', `${glowY}%`);
      }
    });
  }

  setupCustomCursor() {
    if (this.isMobile) return;

    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    // Initial state
    gsap.set([cursor, follower], { 
      xPercent: -50, 
      yPercent: -50,
      opacity: 0
    });
    
    // Fade in cursor
    gsap.to([cursor, follower], {
      opacity: 1,
      duration: 0.8,
      delay: 1
    });
    
    // Position cursor
    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;
    let angle = 0;
    let lastMouseMoveTime = 0;
    
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      lastMouseMoveTime = Date.now();
      
      // Immediate cursor position
      gsap.to(cursor, {
        x: mouseX,
        y: mouseY,
        duration: 0.1
      });
    });
    
    // Animate follower with physics-based movement
    const follow = () => {
      // Calculate distance and angle
      const dx = mouseX - followerX;
      const dy = mouseY - followerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Only update if mouse has moved recently
      if (Date.now() - lastMouseMoveTime < 1000) {
        // Apply easing based on distance
        const ease = distance > 100 ? 0.2 : 0.1;
        followerX += dx * ease;
        followerY += dy * ease;
        
        // Apply rotation based on movement direction
        if (distance > 5) {
          angle = Math.atan2(dy, dx) * 180 / Math.PI;
        }
        
        // Scale based on velocity
        const scale = 1 + Math.min(distance / 500, 0.5);
        
        gsap.to(follower, {
          x: followerX,
          y: followerY,
          rotation: angle,
          scale: scale,
          duration: 0.6,
          ease: 'power2.out'
        });
      }
      
      requestAnimationFrame(follow);
    };
    
    follow();
    
    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .project-card, .course-card, .social-link');
    
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        gsap.to(cursor, { 
          scale: 0.3,
          backgroundColor: 'rgba(255,255,255,0.8)',
          duration: 0.3 
        });
        
        gsap.to(follower, { 
          scale: 3,
          backgroundColor: 'rgba(100, 200, 255, 0.2)',
          borderColor: 'rgba(100, 200, 255, 0.5)',
          duration: 0.4 
        });
      });
      
      el.addEventListener('mouseleave', () => {
        gsap.to(cursor, { 
          scale: 1,
          backgroundColor: 'rgba(255,255,255,0.9)',
          duration: 0.3 
        });
        
        gsap.to(follower, { 
          scale: 1,
          backgroundColor: 'rgba(100, 200, 255, 0.1)',
          borderColor: 'rgba(100, 200, 255, 0.3)',
          duration: 0.4 
        });
      });
    });
    
    // Click effect
    document.addEventListener('mousedown', () => {
      gsap.to(cursor, { scale: 0.7, duration: 0.1 });
      gsap.to(follower, { scale: 0.7, duration: 0.1 });
    });
    
    document.addEventListener('mouseup', () => {
      gsap.to(cursor, { scale: 1, duration: 0.3 });
      gsap.to(follower, { scale: 1, duration: 0.3 });
    });
  }

  updateCursorPosition() {
    if (this.isMobile) return;
    
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    // Add subtle effect based on scroll direction
    if (this.scrollDirection === 'down') {
      gsap.to(follower, { y: '+=3', duration: 0.5, ease: 'power2.out' });
    } else {
      gsap.to(follower, { y: '-=3', duration: 0.5, ease: 'power2.out' });
    }
    
    // Add effect based on scroll velocity
    const velocityEffect = Math.min(this.scrollVelocity / 200, 0.5);
    gsap.to(follower, {
      scale: 1 + velocityEffect,
      duration: 0.3
    });
  }

  setupTextReveals() {
    // Animate headings with a fancy reveal
    document.querySelectorAll('.section-title').forEach(title => {
      const chars = title.textContent.split('');
      title.innerHTML = '';
      
      chars.forEach(char => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? ' ' : char;
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        span.style.transform = 'translateY(50%) rotateX(90deg)';
        title.appendChild(span);
      });
      
      ScrollTrigger.create({
        trigger: title,
        start: 'top 80%',
        onEnter: () => {
          gsap.to(title.querySelectorAll('span'), {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 0.6,
            stagger: 0.03,
            ease: 'back.out(1.7)'
          });
        }
      });
    });
  }

  setupImageDistortions() {
    // Add subtle distortion effect to images on hover
    document.querySelectorAll('.distort-image').forEach(img => {
      img.addEventListener('mousemove', (e) => {
        const rect = img.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Calculate distortion based on mouse position
        const dx = (x - centerX) / centerX;
        const dy = (y - centerY) / centerY;
        
        // Apply distortion transform
        img.style.transform = `
          perspective(1000px)
          rotateX(${dy * 5}deg)
          rotateY(${-dx * 5}deg)
          scale(1.03)
        `;
        
        // Add glow effect
        img.style.filter = `
          drop-shadow(${-dx * 10}px ${dy * 10}px 10px rgba(100, 200, 255, 0.3))
        `;
      });
      
      img.addEventListener('mouseleave', () => {
        img.style.transform = '';
        img.style.filter = '';
      });
    });
  }

  navbarScrollEffect() {
    const navbar = document.querySelector('.navbar');
    const logo = document.querySelector('.navbar-brand');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (window.scrollY > 50) {
      gsap.to(navbar, { 
        backgroundColor: 'var(--navbar-scroll-bg)',
        padding: '10px 0',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 30px rgba(0,0,0,0.1)',
        duration: 0.3
      });
      
      gsap.to(logo, {
        fontSize: '1.2rem',
        duration: 0.3
      });
      
      gsap.to(navLinks, {
        padding: '0.5rem 1rem',
        duration: 0.3
      });
    } else {
      gsap.to(navbar, { 
        backgroundColor: 'transparent',
        padding: '20px 0',
        backdropFilter: 'blur(0px)',
        boxShadow: 'none',
        duration: 0.3
      });
      
      gsap.to(logo, {
        fontSize: '1.5rem',
        duration: 0.3
      });
      
      gsap.to(navLinks, {
        padding: '0.8rem 1.5rem',
        duration: 0.3
      });
    }
  }

  scrollIndicatorEffect() {
    const indicators = document.querySelectorAll('.scroll-indicator span');
    const scrollPercentage = (this.lastScrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    
    indicators.forEach((indicator, index) => {
      const active = scrollPercentage > (index * 33);
      
      gsap.to(indicator, {
        opacity: active ? 1 : 0.5,
        scale: active ? 1.3 : 1,
        backgroundColor: active ? 'var(--highlight-color)' : 'currentColor',
        duration: 0.3
      });
      
      // Add pulse effect when crossing threshold
      if (active && !indicator._active) {
        indicator._active = true;
        gsap.to(indicator, {
          scale: 1.6,
          duration: 0.3,
          yoyo: true,
          repeat: 1
        });
      } else if (!active) {
        indicator._active = false;
      }
    });
  }

  handleResize() {
    this.isMobile = window.innerWidth < 768;
    this.lenis.resize();
    
    // Adjust animations for mobile
    if (this.isMobile) {
      document.querySelectorAll('.cursor, .cursor-follower').forEach(el => {
        el.style.display = 'none';
      });
    }
  }

  handleThemeChange(btn) {
    const theme = btn.classList[1];
    document.body.className = `${theme}-theme`;
    
    // Animate theme switch with a ripple effect
    const ripple = document.createElement('div');
    ripple.className = 'theme-ripple';
    ripple.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--highlight-color');
    document.body.appendChild(ripple);
    
    const rect = btn.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    gsap.fromTo(ripple,
      { 
        x: x,
        y: y,
        scale: 0,
        opacity: 1
      },
      {
        scale: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        onComplete: () => ripple.remove()
      }
    );
    
    // Update active button
    document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Add subtle animation to all sections
    document.querySelectorAll('section').forEach(section => {
      gsap.fromTo(section,
        { opacity: 0.8, y: 10 },
        { opacity: 1, y: 0, duration: 0.5 }
      );
    });
  }

  runScrollEffects() {
    this.scrollEffects.forEach(effect => {
      const rect = effect.element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const triggerPoint = viewportHeight * effect.threshold;
      
      if (rect.top < viewportHeight - triggerPoint && rect.bottom > triggerPoint) {
        effect.effect();
      }
    });
  }

  scrollToSection(selector) {
    const target = document.querySelector(selector);
    if (target) {
      this.scrollTarget = selector;
      this.lenis.scrollTo(target, {
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        onComplete: () => {
          this.scrollTarget = null;
        }
      });
    }
  }

  updateActiveSection() {
    const sections = document.querySelectorAll('section');
    let newActiveSection = null;
    
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 100 && rect.bottom >= 100) {
        newActiveSection = section.id;
      }
    });
    
    if (newActiveSection && newActiveSection !== this.currentSection) {
      this.currentSection = newActiveSection;
      this.updateNavLinks();
    }
  }

  updateNavLinks() {
    document.querySelectorAll('nav a').forEach(link => {
      if (link.getAttribute('href') === `#${this.currentSection}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  updateBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
      if (window.scrollY > window.innerHeight) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  }

  handleAnchorLinks() {
    if (this.scrollTarget) return;
    
    const hash = window.location.hash;
    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        const rect = target.getBoundingClientRect();
        if (Math.abs(rect.top) > 50) {
          this.scrollToSection(hash);
        }
      }
    }
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.lenis.raf();
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PremiumPortfolioLenis();
});