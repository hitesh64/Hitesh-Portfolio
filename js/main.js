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
// ==========================================================================
// PURE PERFORMANCE 3D MATRIX AND GSAP INTEGRATION FOR PROJECTS V2
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    // 1. Core Hub Tab Switch Logic via GSAP
    const tabs = document.querySelectorAll(".tab-btn");
    const grids = document.querySelectorAll(".projects-grid-wrapper");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const targetId = tab.getAttribute("data-target");

            // Toggle Tab State Active Styling
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            // Clean Transition via GSAP Animate out then in
            grids.forEach(grid => {
                if (grid.classList.contains("active-grid")) {
                    gsap.to(grid, {
                        opacity: 0,
                        y: 20,
                        duration: 0.3,
                        onComplete: () => {
                            grid.classList.remove("active-grid");
                            
                            // Active Target Grid Setup
                            const targetGrid = document.getElementById(targetId);
                            targetGrid.classList.add("active-grid");
                            
                            // Trigger Entry Animation Stack
                            gsap.fromTo(targetGrid, 
                                { opacity: 0, y: 30 },
                                { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
                            );
                            
                            // Trigger inner elements cascade
                            gsap.from(targetGrid.querySelectorAll(".card-3d"), {
                                opacity: 0,
                                scale: 0.9,
                                y: 30,
                                duration: 0.4,
                                stagger: 0.08,
                                ease: "back.out(1.2)"
                            });
                        }
                    });
                }
            });
        });
    });

    // 2. High-Performance ThreeJS Mimicry (3D Tilt & Lighting Glow Map Tracking)
    const cards = document.querySelectorAll(".card-3d");

    cards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            
            // Mouse absolute position coordinates within bounds
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Compute center grid balancing vectors
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Rotation vectors map (Max rotation angle limit: 12 degrees)
            const rotateX = ((centerY - y) / centerY) * 12;
            const rotateY = ((x - centerX) / centerX) * 12;

            // Bind coordinate changes natively to hardware accelerated CSS variables
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);

            // Apply direct transform matrix interpolation via GSAP
            gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                transformPerspective: 1000,
                duration: 0.3,
                ease: "power2.out",
                overwrite: "auto"
            });
        });

        // Mouse Leave: Interpolate smoothly back to baseline state matrices
        card.addEventListener("mouseleave", () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.5,
                ease: "power2.out",
                overwrite: "auto"
            });
        });
    });

    // 3. ScrollTrigger Interaction Setup for Initial Page Entry
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        gsap.from(".project-tabs-container", {
            scrollTrigger: {
                trigger: ".projects-section-v2",
                start: "top 80%",
            },
            opacity: 0,
            y: -20,
            duration: 0.6,
            ease: "power3.out"
        });

        gsap.from(".active-grid .card-3d", {
            scrollTrigger: {
                trigger: ".active-grid",
                start: "top 75%",
            },
            opacity: 0,
            y: 40,
            scale: 0.95,
            duration: 0.6,
            stagger: 0.12,
            ease: "power4.out"
        });
    }
});
// ==========================================================================
// NEXT-GEN CYBER-FRAME: GSAP 3D TRACKING & ENTRANCE
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    // 1. Cyber Entrance Timeline
    if(typeof gsap !== 'undefined') {
        const cyberTl = gsap.timeline({ defaults: { ease: "expo.out" } });
        
        // Target elements
        const frame = document.querySelector('.cyber-shape-wrap');
        const img = document.querySelector('.cyber-img');
        const rings = document.querySelectorAll('.cyber-ring');
        const badges = document.querySelectorAll('.cyber-badge');

if(frame) {
            // Animate Shape Drawing effect
            cyberTl.from(frame, { 
                scale: 0.5, 
                opacity: 0, 
                clipPath: "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%)", 
                duration: 1.5 
            })
            
            // 🚨 यहाँ बदलाव किया गया है: .from की जगह .fromTo का इस्तेमाल
           .fromTo(img, 
                { opacity: 0.1, scale: 1.2 }, /* 0 की जगह 0.1 ताकि ब्राउज़र इसे "दिखता हुआ" माने */
                { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }, 
            "-=1.4")
            
            // Rings expand outwards
            .from(rings, { scale: 0, opacity: 0, duration: 1.5, stagger: 0.2 }, "-=1")
            // Badges slide in dynamically
            .from(badges, { 
                x: (i) => i === 0 ? 50 : -50, 
                opacity: 0, 
                duration: 1, 
                stagger: 0.2, 
                ease: "back.out(2)" 
            }, "-=1");
        }

        // 2. Advanced 3D Hover Tracking & Magnetic Badges
        const visualContainer = document.querySelector('.cyber-visuals');
        const card3D = document.getElementById('cyber-3d-card');
        const magItems = document.querySelectorAll('.magnetic-item');

        if (window.innerWidth > 991 && visualContainer && card3D) {
            
            visualContainer.addEventListener('mousemove', (e) => {
                const rect = visualContainer.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const moveX = e.clientX - centerX;
                const moveY = e.clientY - centerY;

                // 3D Tilt Effect on Main Frame
                gsap.to(card3D, {
                    rotateX: -(moveY / centerY) * 12, // Max 12 deg tilt
                    rotateY: (moveX / centerX) * 12,
                    transformPerspective: 1000,
                    duration: 0.4,
                    ease: "power2.out"
                });

                // Magnetic effect on Floating Badges (they move towards the mouse slightly)
                magItems.forEach(item => {
                    const itemRect = item.getBoundingClientRect();
                    const itemCenterX = itemRect.left + itemRect.width / 2;
                    const itemCenterY = itemRect.top + itemRect.height / 2;
                    
                    const distX = e.clientX - itemCenterX;
                    const distY = e.clientY - itemCenterY;

                    gsap.to(item, {
                        x: distX * 0.15,
                        y: distY * 0.15,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                });
            });

            // Smooth Reset on Mouse Leave
            visualContainer.addEventListener('mouseleave', () => {
                gsap.to(card3D, { rotateX: 0, rotateY: 0, duration: 1, ease: "elastic.out(1, 0.4)" });
                gsap.to(magItems, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.4)" });
            });
        }
    }
});