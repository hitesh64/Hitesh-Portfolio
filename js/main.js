document.addEventListener('DOMContentLoaded', function() {
    // 1. Initialize core features
    initThemeSwitcher();
    initMobileMenu();
    initCustomCursor(); // Added missing cursor logic
    initBackToTop();
    initContactForm();
    
    // 2. Initialize Visuals & Animations
    initScrollAnimations();
    initSkillBars();
    initProjectScroll();
    
    // 3. Initialize Interactive Features (Voice/Counter)
    // Note: Browsers often block auto-audio. This usually works after the user interacts with the page once.
    initWelcomeFeatures();

    // Set Footer Year
    const yearSpan = document.getElementById('year');
    if(yearSpan) yearSpan.textContent = new Date().getFullYear();

    console.log('Hitesh Portfolio Initialized Successfully');
});

/* =========================================
   1. Theme Switcher
   ========================================= */
function initThemeSwitcher() {
    const themeBtns = document.querySelectorAll('.theme-btn');
    const body = document.body;
    
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    body.className = `${savedTheme}-theme`; // Reset classes and add saved one
    
    // Set active button visual state
    themeBtns.forEach(btn => {
        if(btn.classList.contains(savedTheme)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Handle click events
    themeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Determine theme from button class
            let theme = 'dark';
            if (this.classList.contains('light')) theme = 'light';
            if (this.classList.contains('neon')) theme = 'neon';
            
            // Apply theme
            body.className = `${theme}-theme`;
            body.classList.add('theme-transition'); // Add transition for smooth switch
            
            // Update storage
            localStorage.setItem('portfolio-theme', theme);
            
            // Update buttons
            themeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Remove transition class after animation
            setTimeout(() => {
                body.classList.remove('theme-transition');
            }, 500);
        });
    });
}

/* =========================================
   2. Mobile Navigation (Fixed)
   ========================================= */
function initMobileMenu() {
    const navbarCollapse = document.getElementById('navbarCollapse');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // 1. Button click par menu kholne/band karne ka code (Ye missing tha)
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', function(e) {
            e.preventDefault();
            navbarCollapse.classList.toggle('show');
        });
    }

    // 2. Link click karne par menu band karne ka code
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                navbarCollapse.classList.remove('show');
            }
        });
    });

    // 3. Bahar click karne par menu band karne ka code (Optional but good)
    document.addEventListener('click', (e) => {
        if (navbarCollapse.classList.contains('show') && 
            !navbarCollapse.contains(e.target) && 
            !navbarToggler.contains(e.target)) {
            navbarCollapse.classList.remove('show');
        }
    });

    // 4. Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/* =========================================
   3. Custom Cursor (Added Logic)
   ========================================= */
function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    // Only activate on desktop devices
    if (window.innerWidth > 991 && cursor && follower) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            // Add a slight delay to the follower for a smooth effect
            setTimeout(() => {
                follower.style.left = e.clientX + 'px';
                follower.style.top = e.clientY + 'px';
            }, 100);
        });

        // Hover effects for links and buttons
        const interactables = document.querySelectorAll('a, button, .project-card, .skill-item');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('active');
                follower.classList.add('active');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('active');
                follower.classList.remove('active');
            });
        });
    }
}

/* =========================================
   4. Scroll Animations (IntersectionObserver)
   ========================================= */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Trigger Animate.css classes if present
                if (entry.target.classList.contains('animate__animated')) {
                    entry.target.style.visibility = 'visible';
                    entry.target.style.opacity = '1';
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe sections and cards
    const elementsToAnimate = document.querySelectorAll('.project-card, .timeline-item, .course-card, .about-content, .hero-title');
    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in-up'); // Ensure you have CSS for this or rely on Animate.css
        observer.observe(el);
    });
}

function initSkillBars() {
    const skillSection = document.getElementById('skills');
    const progressBars = document.querySelectorAll('.skill-progress');
    
    if (!skillSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                progressBars.forEach(bar => {
                    const width = bar.getAttribute('data-width');
                    bar.style.width = width + '%';
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    observer.observe(skillSection);
}

/* =========================================
   5. Project Horizontal Scroll
   ========================================= */
function initProjectScroll() {
    const container = document.querySelector('.projects-scroll-container');
    
    if (container) {
        // Convert vertical scroll to horizontal scroll when hovering the container
        container.addEventListener('wheel', (e) => {
            if (window.innerWidth > 991) {
                e.preventDefault();
                container.scrollLeft += e.deltaY;
            }
        });
    }
}

/* =========================================
   6. Contact Form Handling
   ========================================= */
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnIcon = submitBtn.querySelector('.btn-icon');
            const originalText = btnText.textContent;
            
            // Loading state
            submitBtn.disabled = true;
            btnText.textContent = 'Sending...';
            btnIcon.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
            // Simulate API call
            setTimeout(() => {
                // Success state
                btnText.textContent = 'Message Sent!';
                btnIcon.innerHTML = '<i class="fas fa-check"></i>';
                submitBtn.classList.add('btn-success');
                
                // Reset form
                form.reset();
                
                // Restore button after delay
                setTimeout(() => {
                    btnText.textContent = originalText;
                    btnIcon.innerHTML = '<i class="fas fa-paper-plane"></i>';
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('btn-success');
                }, 3000);
            }, 1500);
        });
    }
}

/* =========================================
   7. Back To Top
   ========================================= */
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        });
        
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}
// js/main.js ke sabse niche add karein

document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('heroVideo');
    const soundBtn = document.getElementById('soundBtn');
    const btnIcon = soundBtn ? soundBtn.querySelector('i') : null;
    const btnText = soundBtn ? soundBtn.querySelector('span') : null;

    if (video && soundBtn) {
        soundBtn.addEventListener('click', function() {
            if (video.muted) {
                // Unmute
                video.muted = false;
                btnIcon.className = 'fas fa-volume-up';
                btnText.textContent = 'Sound On';
                soundBtn.style.background = 'var(--primary-color)';
            } else {
                // Mute
                video.muted = true;
                btnIcon.className = 'fas fa-volume-mute';
                btnText.textContent = 'Tap for Sound';
                soundBtn.style.background = 'rgba(0, 0, 0, 0.6)';
            }
        });
    }
});
