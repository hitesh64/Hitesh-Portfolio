// Enhanced curtains.js WebGL Visual Effects
document.addEventListener('DOMContentLoaded', function() {
    // Check if curtains.js is loaded
    if (typeof Curtains === 'undefined') {
        console.error('curtains.js library not loaded');
        return;
    }

    // Initialize curtains.js with enhanced settings
    const curtains = new Curtains({
        container: "webgl-canvas",
        pixelRatio: Math.min(1.5, window.devicePixelRatio),
        premultipliedAlpha: false, // Better transparency handling
        antialias: true, // Smoother edges
        autoRender: false // Manual control for better performance
    });

    // Set up requestAnimationFrame for manual rendering
    let lastTime = 0;
    const fps = 60;
    const frameInterval = 1000 / fps;

    // Wait for curtains to be ready
    curtains.onReady(() => {
        const gl = curtains.gl;
        
        // Optimize WebGL settings
        gl.disable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        
        // Create a displacement texture for advanced effects
        const displacementTexture = new curtains.Texture(curtains, {
            sampler: "uDisplacementTexture",
            fromTexture: curtains.createTexture()
        });

        // Get all images with class "webgl-item"
        const webglItems = document.querySelectorAll(".webgl-item");
        const planes = [];
        
        // Create planes with advanced effects
        webglItems.forEach((item, index) => {
            const plane = new curtains.Plane(curtains, item, {
                vertexShaderID: "advanced-vs",
                fragmentShaderID: "advanced-fs",
                uniforms: {
                    time: {
                        name: "uTime",
                        type: "1f",
                        value: 0
                    },
                    displacementStrength: {
                        name: "uDisplacementStrength",
                        type: "1f",
                        value: 0.5
                    },
                    waveSpeed: {
                        name: "uWaveSpeed",
                        type: "1f",
                        value: 0.5 + Math.random() * 0.5
                    },
                    hoverEffect: {
                        name: "uHoverEffect",
                        type: "1f",
                        value: 0
                    },
                    themeColor: {
                        name: "uThemeColor",
                        type: "3f",
                        value: [0.3, 0.6, 0.9] // Default blue-ish
                    },
                    displacementTexture: {
                        name: "uDisplacementTexture",
                        type: "1i",
                        value: 0
                    }
                },
                texturesOptions: {
                    minFilter: gl.LINEAR_MIPMAP_LINEAR // Better quality
                }
            });

            // Only proceed if plane was created
            if (plane) {
                planes.push(plane);
                
                // Set displacement texture
                plane.textures.push(displacementTexture);
                
                // Enhanced hover effects
                item.addEventListener("mouseenter", () => {
                    gsap.to(plane.uniforms.hoverEffect, {
                        value: 1,
                        duration: 0.5,
                        ease: "power2.out"
                    });
                    gsap.to(plane.uniforms.displacementStrength, {
                        value: 1.2,
                        duration: 0.8,
                        ease: "elastic.out(1, 0.5)"
                    });
                });
                
                item.addEventListener("mouseleave", () => {
                    gsap.to(plane.uniforms.hoverEffect, {
                        value: 0,
                        duration: 0.7,
                        ease: "power2.out"
                    });
                    gsap.to(plane.uniforms.displacementStrength, {
                        value: 0.5,
                        duration: 1.2,
                        ease: "elastic.out(1, 0.3)"
                    });
                });

                // Click effect
                item.addEventListener("click", () => {
                    gsap.to(plane.uniforms.displacementStrength, {
                        value: 2.0,
                        duration: 0.3,
                        yoyo: true,
                        repeat: 1
                    });
                });
            }
        });

        // Animation loop with controlled FPS
        function render(time) {
            // Control frame rate
            if (time - lastTime < frameInterval) {
                requestAnimationFrame(render);
                return;
            }
            lastTime = time;

            // Update uniforms for all planes
            planes.forEach(plane => {
                if (plane) {
                    plane.uniforms.time.value = time / 1000;
                }
            });

            // Render the scene
            curtains.render();
            requestAnimationFrame(render);
        }

        // Start the animation loop
        requestAnimationFrame(render);

        // Handle theme changes
        const themeButtons = document.querySelectorAll('.theme-btn');
        themeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const theme = this.classList.contains('light') ? 'light' : 
                             this.classList.contains('neon') ? 'neon' : 'dark';
                
                // Update theme colors for all planes
                planes.forEach(plane => {
                    if (plane) {
                        let color;
                        switch(theme) {
                            case 'light':
                                color = [0.26, 0.44, 0.93]; // blue
                                break;
                            case 'neon':
                                color = [0.97, 0.15, 0.52]; // pink
                                break;
                            default: // dark
                                color = [0.3, 0.79, 0.94]; // teal
                        }
                        gsap.to(plane.uniforms.themeColor, {
                            value: color,
                            duration: 1.0,
                            ease: "power2.inOut"
                        });
                    }
                });
            });
        });
    });

    // Enhanced resize handling with debounce
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            curtains.resize();
            curtains.restoreContext();
        }, 100);
    });

    // Handle visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            curtains.restoreContext();
        }
    });
});