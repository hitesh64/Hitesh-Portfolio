/**
 * Portfolio Visualization System
 * Combines GSAP animations with interactive elements for an engaging experience
 */

class PortfolioVisualizer {
  constructor() {
    this.init();
  }

  init() {
    // Check for required libraries
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP or ScrollTrigger not loaded. Some animations will not work.');
      return;
    }

    // Register plugins
    gsap.registerPlugin(ScrollTrigger);

    // Initialize systems
    this.initHeroAnimations();
    this.initSectionReveals();
    this.initSkillAnimations();
    this.initProjectInteractions();
    this.initTimelineEffects();
    this.initThemeVisuals();
    this.initMouseEffects();
    this.initDynamicBackground();
    this.initScrollProgress();
  }

  // Hero section animations with particle effects
  initHeroAnimations() {
    // Text animations
    const heroTL = gsap.timeline();
    heroTL.from('.hero-title', {
      duration: 1,
      y: 50,
      opacity: 0,
      ease: 'power3.out',
      delay: 0.3
    })
    .from('.hero-subtitle', {
      duration: 0.8,
      y: 40,
      opacity: 0,
      ease: 'power3.out'
    }, '-=0.5')
    .from('.hero-text', {
      duration: 0.8,
      y: 30,
      opacity: 0,
      ease: 'power3.out'
    }, '-=0.4')
    .from('.hero-buttons', {
      duration: 0.8,
      y: 20,
      opacity: 0,
      ease: 'power3.out'
    }, '-=0.3');

    // Avatar animations with floating effect
    gsap.from('.avatar', {
      duration: 1.5,
      scale: 0.5,
      opacity: 0,
      ease: 'elastic.out(1, 0.5)',
      delay: 0.5
    });

    // Continuous floating animation
    gsap.to('.avatar', {
      y: 15,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    // Avatar decoration with particle burst
    gsap.from('.avatar-decoration', {
      duration: 2,
      rotation: 360,
      opacity: 0,
      ease: 'power3.out',
      delay: 0.8,
      onComplete: this.createParticleBurst
    });

    // Add interactive glow on hover
    document.querySelector('.avatar-container').addEventListener('mouseenter', () => {
      gsap.to('.avatar', {
        duration: 0.5,
        boxShadow: '0 0 30px rgba(108, 99, 255, 0.6)',
        ease: 'power2.out'
      });
    });

    document.querySelector('.avatar-container').addEventListener('mouseleave', () => {
      gsap.to('.avatar', {
        duration: 0.5,
        boxShadow: '0 10px 20px var(--shadow-color)',
        ease: 'power2.out'
      });
    });
  }

  // Section reveal animations with parallax effects
  initSectionReveals() {
    // Animate all section titles
    gsap.utils.toArray('section').forEach(section => {
      const title = section.querySelector('.section-title');
      const content = section.querySelectorAll('.row > *');

      if (title) {
        gsap.from(title, {
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none'
          },
          duration: 0.8,
          y: 50,
          opacity: 0,
          ease: 'power3.out'
        });

        // Highlight animation
        const highlight = title.querySelector('.highlight');
        if (highlight) {
          gsap.from(highlight, {
            scrollTrigger: {
              trigger: title,
              start: 'top 80%',
              toggleActions: 'play none none none'
            },
            duration: 1,
            scale: 0.5,
            opacity: 0,
            ease: 'back.out(4)'
          });
        }
      }

      // Content animation with stagger
      if (content.length > 0) {
        gsap.from(content, {
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none'
          },
          duration: 0.8,
          y: 30,
          opacity: 0,
          stagger: 0.15,
          ease: 'power3.out'
        });
      }
    });
  }

  // Skill bars with interactive tooltips
  initSkillAnimations() {
    gsap.utils.toArray('.skill').forEach(skill => {
      const bar = skill.querySelector('.skill-progress');
      const width = bar.getAttribute('data-width');
      const tooltip = document.createElement('div');
      tooltip.className = 'skill-tooltip';
      tooltip.textContent = `${width}%`;
      skill.appendChild(tooltip);

      ScrollTrigger.create({
        trigger: skill,
        start: 'top 80%',
        onEnter: () => {
          // Animate the bar
          gsap.to(bar, {
            width: `${width}%`,
            duration: 1.5,
            ease: 'power3.out',
            onUpdate: () => {
              // Update tooltip position during animation
              const progress = gsap.getProperty(bar, 'width');
              tooltip.style.left = progress;
              tooltip.textContent = `${Math.round(parseInt(progress))}%`;
            }
          });

          // Show tooltip
          gsap.fromTo(tooltip,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.5 }
          );
        },
        onLeaveBack: () => {
          gsap.to(tooltip, { opacity: 0, duration: 0.3 });
        }
      });

      // Interactive hover effect
      skill.addEventListener('mouseenter', () => {
        gsap.to(bar, {
          duration: 0.3,
          backgroundColor: 'var(--secondary-color)',
          ease: 'power2.out'
        });
        gsap.to(tooltip, {
          duration: 0.3,
          backgroundColor: 'var(--secondary-color)',
          ease: 'power2.out'
        });
      });

      skill.addEventListener('mouseleave', () => {
        gsap.to(bar, {
          duration: 0.3,
          backgroundColor: 'var(--primary-color)',
          ease: 'power2.out'
        });
        gsap.to(tooltip, {
          duration: 0.3,
          backgroundColor: 'var(--primary-color)',
          ease: 'power2.out'
        });
      });
    });
  }

  // Project cards with 3D tilt effect
  initProjectInteractions() {
    gsap.utils.toArray('.project-card').forEach((card, i) => {
      // Initial reveal animation
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        duration: 0.8,
        y: 50,
        opacity: 0,
        ease: 'power3.out',
        delay: i * 0.1
      });

      // 3D tilt effect
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const angleX = (y - centerY) / 20;
        const angleY = (centerX - x) / 20;

        gsap.to(card, {
          duration: 0.5,
          rotateX: angleX,
          rotateY: angleY,
          ease: 'power2.out'
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          duration: 0.5,
          rotateX: 0,
          rotateY: 0,
          ease: 'elastic.out(1, 0.5)'
        });
      });

      // Enhanced hover effect for project links
      const links = card.querySelectorAll('.project-link');
      links.forEach(link => {
        link.addEventListener('mouseenter', () => {
          gsap.to(link, {
            duration: 0.3,
            scale: 1.2,
            boxShadow: '0 0 15px rgba(255, 101, 132, 0.6)',
            ease: 'power2.out'
          });
        });

        link.addEventListener('mouseleave', () => {
          gsap.to(link, {
            duration: 0.3,
            scale: 1,
            boxShadow: 'none',
            ease: 'power2.out'
          });
        });
      });
    });
  }

  // Timeline with connection lines and hover effects
  initTimelineEffects() {
    const timelineItems = gsap.utils.toArray('.timeline-item');
    
    timelineItems.forEach((item, i) => {
      // Initial animation
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        duration: 0.8,
        x: i % 2 === 0 ? -50 : 50,
        opacity: 0,
        ease: 'power3.out',
        delay: i * 0.15
      });

      // Hover effect
      item.addEventListener('mouseenter', () => {
        gsap.to(item.querySelector('.timeline-content'), {
          duration: 0.3,
          boxShadow: '0 5px 25px rgba(108, 99, 255, 0.3)',
          ease: 'power2.out'
        });
        
        // Pulse the date marker
        gsap.to(item.querySelector('.timeline-date'), {
          duration: 0.5,
          scale: 1.1,
          ease: 'elastic.out(1, 0.5)'
        });
      });

      item.addEventListener('mouseleave', () => {
        gsap.to(item.querySelector('.timeline-content'), {
          duration: 0.3,
          boxShadow: '0 3px 10px var(--shadow-color)',
          ease: 'power2.out'
        });
        
        gsap.to(item.querySelector('.timeline-date'), {
          duration: 0.3,
          scale: 1,
          ease: 'power2.out'
        });
      });
    });

    // Animate the timeline line
    ScrollTrigger.create({
      trigger: '.timeline',
      start: 'top center',
      end: 'bottom center',
      onUpdate: (self) => {
        gsap.to('.timeline::before', {
          height: `${self.progress * 100}%`,
          duration: 0.5,
          ease: 'power2.out'
        });
      }
    });
  }

  // Theme-specific visual effects
  initThemeVisuals() {
    const updateThemeEffects = () => {
      const isNeon = document.body.classList.contains('neon-theme');
      const isLight = document.body.classList.contains('light-theme');

      // Update all elements with theme-based animations
      gsap.to('[data-theme-effect]', {
        duration: 0.5,
        textShadow: isNeon ? '0 0 10px var(--primary-color)' : 'none',
        ease: 'power2.out'
      });

      // Special effects for neon theme
      if (isNeon) {
        gsap.to('.avatar-decoration', {
          duration: 0.5,
          boxShadow: '0 0 15px var(--primary-color), 0 0 30px rgba(15, 240, 252, 0.3)',
          ease: 'power2.out'
        });

        // Create floating particles
        this.createFloatingParticles();
      } else {
        // Remove neon effects
        gsap.to('.avatar-decoration', {
          duration: 0.5,
          boxShadow: 'none',
          ease: 'power2.out'
        });
        
        // Clear particles if any
        const particles = document.querySelectorAll('.particle');
        particles.forEach(p => p.remove());
      }

      // Light theme adjustments
      if (isLight) {
        gsap.to('.skill-progress', {
          duration: 0.5,
          background: 'linear-gradient(to right, var(--primary-color), #ff9a9e)',
          ease: 'power2.out'
        });
      }
    };

    // Watch for theme changes
    const observer = new MutationObserver(updateThemeEffects);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    // Initial setup
    updateThemeEffects();
  }

  // Mouse follower with interactive elements
  initMouseEffects() {
    const follower = document.createElement('div');
    follower.className = 'mouse-follower';
    document.body.appendChild(follower);

    // Position follower
    document.addEventListener('mousemove', (e) => {
      gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: 'power2.out'
      });
    });

    // Interactive elements effect
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        gsap.to(follower, {
          duration: 0.3,
          scale: 2,
          backgroundColor: 'var(--primary-color)',
          mixBlendMode: 'overlay',
          ease: 'power2.out'
        });
      });

      el.addEventListener('mouseleave', () => {
        gsap.to(follower, {
          duration: 0.3,
          scale: 1,
          backgroundColor: 'var(--secondary-color)',
          mixBlendMode: 'normal',
          ease: 'power2.out'
        });
      });
    });
  }

  // Dynamic background with subtle animated elements
  initDynamicBackground() {
    const bgElements = [];
    const colors = ['var(--primary-color)', 'var(--secondary-color)', 'var(--text-muted)'];
    
    // Create background elements
    for (let i = 0; i < 15; i++) {
      const el = document.createElement('div');
      el.className = 'bg-element';
      document.body.appendChild(el);
      
      // Random properties
      const size = Math.random() * 100 + 50;
      const duration = Math.random() * 20 + 20;
      const delay = Math.random() * 5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      gsap.set(el, {
        width: size,
        height: size,
        borderRadius: '50%',
        position: 'fixed',
        opacity: 0.1,
        backgroundColor: color,
        zIndex: -1,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight
      });
      
      // Animate
      gsap.to(el, {
        x: '+=200',
        y: '+=200',
        rotation: 360,
        duration: duration,
        delay: delay,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
      
      bgElements.push(el);
    }
  }

  // Scroll progress indicator
  initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    ScrollTrigger.create({
      onUpdate: (self) => {
        gsap.to(progressBar, {
          width: `${self.progress * 100}%`,
          duration: 0.5,
          ease: 'power2.out'
        });
      }
    });
  }

  // Particle effects for special moments
  createParticleBurst() {
    const container = document.querySelector('.avatar-container');
    const colors = ['var(--primary-color)', 'var(--secondary-color)', '#ffffff'];
    
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      container.appendChild(particle);
      
      const size = Math.random() * 10 + 5;
      const duration = Math.random() * 1 + 0.5;
      const delay = Math.random() * 0.5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      gsap.set(particle, {
        width: size,
        height: size,
        borderRadius: '50%',
        position: 'absolute',
        backgroundColor: color,
        x: '50%',
        y: '50%',
        zIndex: 3
      });
      
      gsap.to(particle, {
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 - 100,
        opacity: 0,
        duration: duration,
        delay: delay,
        ease: 'power2.out',
        onComplete: () => particle.remove()
      });
    }
  }

  createFloatingParticles() {
    const container = document.querySelector('body');
    const colors = ['var(--primary-color)', 'var(--secondary-color)', '#0ff0fc', '#ff00ff'];
    
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      container.appendChild(particle);
      
      const size = Math.random() * 8 + 4;
      const duration = Math.random() * 10 + 10;
      const delay = Math.random() * 5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const startX = Math.random() * window.innerWidth;
      const startY = Math.random() * window.innerHeight;
      
      gsap.set(particle, {
        width: size,
        height: size,
        borderRadius: '50%',
        position: 'fixed',
        backgroundColor: color,
        x: startX,
        y: startY,
        zIndex: -1,
        opacity: 0.6,
        filter: 'blur(1px)'
      });
      
      // Continuous floating animation
      gsap.to(particle, {
        y: startY - 100,
        x: startX + (Math.random() * 100 - 50),
        duration: duration,
        delay: delay,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const visualizer = new PortfolioVisualizer();
  
  // Add resize listener for responsive adjustments
  window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
  });
});

// Fallback for older browsers
if (!('IntersectionObserver' in window)) {
  console.warn('IntersectionObserver not supported. Some animations may not work.');
}