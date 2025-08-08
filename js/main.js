document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize theme switcher
    initThemeSwitcher();
    
    // Initialize animations
    initAnimations();
    
    // Initialize contact form
    initContactForm();
    
    // Initialize back to top button
    initBackToTop();
    
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Debug logging
    console.log('Main initialization complete');
});

// Mobile Menu Functions
function initMobileMenu() {
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    let isMenuOpen = false;
    let bsCollapse;

    // Initialize Bootstrap collapse if available
    if (typeof bootstrap !== 'undefined' && navbarCollapse) {
        bsCollapse = new bootstrap.Collapse(navbarCollapse, {
            toggle: false
        });
        
        navbarCollapse.addEventListener('shown.bs.collapse', () => {
            isMenuOpen = true;
            document.body.classList.add('menu-open');
            addMenuOverlay();
            lockBodyScroll(true);
        });
        
        navbarCollapse.addEventListener('hidden.bs.collapse', () => {
            isMenuOpen = false;
            document.body.classList.remove('menu-open');
            removeMenuOverlay();
            lockBodyScroll(false);
        });
    }

    // Close menu when clicking menu options
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 992) {
                closeMobileMenuWithDelay(300);
            }
        });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (isMenuOpen && 
            !navbarCollapse.contains(e.target) && 
            e.target !== navbarToggler &&
            !e.target.closest('.menu-overlay')) {
            closeMobileMenu();
        }
    });

    // Close on orientation change
    let lastWidth = window.innerWidth;
    window.addEventListener('resize', () => {
        if (Math.abs(window.innerWidth - lastWidth) > 100) {
            closeMobileMenu();
        }
        lastWidth = window.innerWidth;
    });

    // Close with ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            closeMobileMenu();
        }
    });

    // Helper functions
    function addMenuOverlay() {
        if (document.querySelector('.menu-overlay')) return;
        
        const overlay = document.createElement('div');
        overlay.className = 'menu-overlay';
        overlay.onclick = closeMobileMenu;
        document.body.appendChild(overlay);
        
        // Trigger reflow for smooth animation
        void overlay.offsetWidth;
        overlay.classList.add('visible');
    }

    function removeMenuOverlay() {
        const overlay = document.querySelector('.menu-overlay');
        if (overlay) {
            overlay.classList.remove('visible');
            overlay.addEventListener('transitionend', () => {
                overlay.remove();
            }, { once: true });
        }
    }

    function closeMobileMenuWithDelay(delay) {
        setTimeout(closeMobileMenu, delay);
    }

    function lockBodyScroll(lock) {
        document.body.style.overflow = lock ? 'hidden' : '';
        document.documentElement.style.overflow = lock ? 'hidden' : '';
    }
}

function closeMobileMenu() {
    const navbarCollapse = document.querySelector('.navbar-collapse');
    if (!navbarCollapse) return;

    if (typeof bootstrap !== 'undefined') {
        const instance = bootstrap.Collapse.getInstance(navbarCollapse) || 
                       new bootstrap.Collapse(navbarCollapse, {toggle: false});
        instance.hide();
    } else {
        navbarCollapse.classList.remove('show');
        document.body.classList.remove('menu-open');
    }

    const navbarToggler = document.querySelector('.navbar-toggler');
    if (navbarToggler) {
        navbarToggler.classList.add('collapsed');
        navbarToggler.setAttribute('aria-expanded', 'false');
    }
}

// Animation Initialization
function initAnimations() {
    // Check if device is mobile
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    
    // Only run heavy animations on desktop
    if (!isMobile) {
        console.log('Initializing desktop animations');
        
        // Initialize GSAP animations if available
        if (typeof gsap !== 'undefined') {
            console.log('GSAP available - initializing animations');
            initGSAPAnimations();
        } else {
            console.warn('GSAP not loaded');
        }
        
        // Initialize Anime.js animations if available
        if (typeof anime !== 'undefined') {
            console.log('Anime.js available - initializing animations');
            initAnimeJSAnimations();
        } else {
            console.warn('Anime.js not loaded');
        }
        
        // Initialize PIXI.js effects if available
        if (typeof PIXI !== 'undefined') {
            console.log('PIXI.js available - initializing effects');
            initPIXIEffects();
        } else {
            console.warn('PIXI.js not loaded');
        }
        
        // Initialize Three.js effects if available
        if (typeof THREE !== 'undefined') {
            console.log('Three.js available - initializing effects');
            initThreeJSEffects();
        } else {
            console.warn('Three.js not loaded');
        }
    } else {
        console.log('Mobile device detected - skipping heavy animations');
    }
    
    // Initialize basic animations that work on all devices
    initBasicAnimations();
}

// Basic Animations (works on all devices)
function initBasicAnimations() {
    // Animate skill bars on scroll
    const skillBars = document.querySelectorAll('.skill-progress');
    
    if (skillBars.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const width = entry.target.getAttribute('data-width') || '100';
                    entry.target.style.width = width + '%';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        skillBars.forEach(bar => {
            observer.observe(bar);
        });
    }
    
    // Add hover effects to project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// Contact Form Handling
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            const btnText = submitBtn.querySelector('.btn-text');
            const btnIcon = submitBtn.querySelector('.btn-icon');
            
            // Show loading state
            submitBtn.disabled = true;
            btnText.textContent = 'Sending...';
            btnIcon.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
            // Simulate form submission (replace with actual form submission)
            setTimeout(() => {
                // Show success state
                btnText.textContent = 'Message Sent!';
                btnIcon.innerHTML = '<i class="fas fa-check"></i>';
                
                // Reset form
                this.reset();
                
                // Reset button after delay
                setTimeout(() => {
                    btnText.textContent = 'Send Message';
                    btnIcon.innerHTML = '<i class="fas fa-paper-plane"></i>';
                    submitBtn.disabled = false;
                }, 3000);
            }, 1500);
        });
    } else {
        console.warn('Contact form not found');
    }
}

// Back to Top Button
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        });
        
        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Theme Switcher
function initThemeSwitcher() {
    const themeBtns = document.querySelectorAll('.theme-btn');
    const body = document.body;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    body.classList.add(savedTheme + '-theme');
    
    // Set active button
    document.querySelector(`.theme-btn.${savedTheme}`)?.classList.add('active');
    
    // Handle theme switching
    themeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const theme = this.classList.contains('light') ? 'light' : 
                         this.classList.contains('dark') ? 'dark' : 'neon';
            
            // Remove all theme classes
            body.classList.remove('light-theme', 'dark-theme', 'neon-theme');
            
            // Add selected theme
            body.classList.add(theme + '-theme');
            
            // Save preference
            localStorage.setItem('portfolio-theme', theme);
            
            // Update active button
            themeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Add transition class for smooth change
            body.classList.add('theme-transition');
            setTimeout(() => {
                body.classList.remove('theme-transition');
            }, 500);
        });
    });
}

// Debug helper to check loaded libraries
function checkLoadedLibraries() {
    console.log('Checking loaded libraries:');
    console.log('GSAP:', typeof gsap !== 'undefined' ? 'Loaded' : 'Not loaded');
    console.log('Anime.js:', typeof anime !== 'undefined' ? 'Loaded' : 'Not loaded');
    console.log('PIXI.js:', typeof PIXI !== 'undefined' ? 'Loaded' : 'Not loaded');
    console.log('Three.js:', typeof THREE !== 'undefined' ? 'Loaded' : 'Not loaded');
    console.log('Bootstrap:', typeof bootstrap !== 'undefined' ? 'Loaded' : 'Not loaded');
}

// Run library check after a short delay
setTimeout(checkLoadedLibraries, 1000);