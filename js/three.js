/**
 * Innovative Visual Thinking Experience with Three.js
 * Features dynamic, interactive visualizations that respond to user behavior
 * while maintaining excellent performance across devices.
 */

class VisualThinkingExperience {
  constructor() {
    this.init();
  }

  async init() {
    // Check for WebGL support and device capability
    if (!this.checkWebGLSupport() || !this.isDeviceCapable()) {
      console.log('Three.js effects disabled for this device');
      return;
    }

    // Load Three.js dynamically if not already loaded
    if (typeof THREE === 'undefined') {
      await this.loadThreeJS();
    }

    // Initialize all visual effects
    this.initHeroParticles();
    this.initSkillsShapes();
    this.initInteractiveOrbit();
    this.initScrollEffects();
  }

  checkWebGLSupport() {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch (e) {
      return false;
    }
  }

  isDeviceCapable() {
    // More sophisticated capability detection
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isLowPower = navigator.hardwareConcurrency < 4 || 
                      (navigator.deviceMemory && navigator.deviceMemory < 4);
    
    // Enable on desktop or high-performance mobile devices
    return !isMobile || (isMobile && !isLowPower);
  }

  loadThreeJS() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.min.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  initHeroParticles() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    // Scene setup
    this.particleScene = new THREE.Scene();
    this.particleCamera = new THREE.PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    this.particleCamera.position.z = 30;

    // Performance-optimized renderer
    this.particleRenderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "low-power"
    });
    this.particleRenderer.setSize(window.innerWidth, window.innerHeight);
    this.particleRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    // Create container
    const container = this.createThreeContainer(heroSection, 'hero-particles');
    container.appendChild(this.particleRenderer.domElement);

    // Create innovative particle system
    this.createInnovativeParticles();

    // Animation loop with delta time for smoothness
    this.animateParticles = (time = 0) => {
      requestAnimationFrame(this.animateParticles);
      
      const delta = Math.min(time - (this.lastParticleTime || 0), 100) / 1000;
      this.lastParticleTime = time;

      if (this.particleSystem) {
        this.particleSystem.rotation.y += 0.2 * delta;
        this.particleSystem.rotation.x += 0.05 * delta;
        
        // Dynamic size adjustment based on time
        const sizes = this.particleSystem.geometry.attributes.size.array;
        for (let i = 0; i < sizes.length; i++) {
          sizes[i] = 1 + Math.sin(time * 0.001 + i * 0.1) * 0.5;
        }
        this.particleSystem.geometry.attributes.size.needsUpdate = true;
      }

      this.particleRenderer.render(this.particleScene, this.particleCamera);
    };

    this.animateParticles();

    // Responsive handling
    window.addEventListener('resize', this.debounce(() => {
      this.particleCamera.aspect = window.innerWidth / window.innerHeight;
      this.particleCamera.updateProjectionMatrix();
      this.particleRenderer.setSize(window.innerWidth, window.innerHeight);
    }, 100));
  }

  createInnovativeParticles() {
    const particleCount = 800; // Balanced between visual impact and performance
    
    // Use a custom geometry for more interesting patterns
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);

    // Color palette
    const primaryColor = new THREE.Color(0x4361ee);
    const secondaryColor = new THREE.Color(0x3a0ca3);
    const accentColor = new THREE.Color(0x4cc9f0);

    // Create a spiral pattern with varying sizes and colors
    for (let i = 0; i < particleCount; i++) {
      // Spiral distribution
      const radius = Math.sqrt(i / particleCount) * 100;
      const angle = (i % 20) * Math.PI * 2 / 20 + (Math.floor(i / 20) * 0.2;
      
      positions[i * 3] = radius * Math.cos(angle);
      positions[i * 3 + 1] = radius * Math.sin(angle);
      positions[i * 3 + 2] = (i % 10) * 2 - 10;

      // Varying sizes
      sizes[i] = 1 + Math.random() * 2;

      // Color gradient
      let particleColor;
      const t = i / particleCount;
      if (t < 0.3) {
        particleColor = primaryColor.clone().lerp(secondaryColor, t * 3);
      } else {
        particleColor = secondaryColor.clone().lerp(accentColor, (t - 0.3) * 1.4);
      }
      
      colors[i * 3] = particleColor.r;
      colors[i * 3 + 1] = particleColor.g;
      colors[i * 3 + 2] = particleColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    this.particleSystem = new THREE.Points(geometry, material);
    this.particleScene.add(this.particleSystem);

    // Add subtle ambient light
    const ambientLight = new THREE.AmbientLight(0x404040);
    this.particleScene.add(ambientLight);
  }

  initSkillsShapes() {
    const skillsSection = document.querySelector('.skills');
    if (!skillsSection) return;

    // Scene setup
    this.skillsScene = new THREE.Scene();
    this.skillsCamera = new THREE.PerspectiveCamera(
      75, 
      skillsSection.offsetWidth / skillsSection.offsetHeight, 
      0.1, 
      1000
    );
    this.skillsCamera.position.z = 50;

    // Renderer
    this.skillsRenderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "low-power"
    });
    this.skillsRenderer.setSize(skillsSection.offsetWidth, skillsSection.offsetHeight);
    this.skillsRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    // Container
    const container = this.createThreeContainer(skillsSection, 'skills-shapes');
    container.appendChild(this.skillsRenderer.domElement);

    // Create interactive 3D shapes
    this.createInteractiveShapes();

    // Animation loop
    this.animateShapes = (time = 0) => {
      requestAnimationFrame(this.animateShapes);
      
      const delta = Math.min(time - (this.lastShapeTime || 0), 100) / 1000;
      this.lastShapeTime = time;

      if (this.shapes && this.shapes.length) {
        this.shapes.forEach((shape, index) => {
          // Animate position
          shape.position.x += shape.userData.speedX * delta * 60;
          shape.position.y += shape.userData.speedY * delta * 60;
          shape.position.z += shape.userData.speedZ * delta * 60;
          
          // Animate rotation
          shape.rotation.x += shape.userData.rotationX * delta * 60;
          shape.rotation.y += shape.userData.rotationY * delta * 60;
          
          // Bounce off boundaries with some randomness
          const boundsX = 40 + Math.sin(time * 0.001 + index) * 5;
          const boundsY = 20 + Math.cos(time * 0.001 + index) * 3;
          const boundsZ = 40;
          
          if (Math.abs(shape.position.x) > boundsX) {
            shape.userData.speedX *= -0.9 + Math.random() * 0.2;
          }
          if (Math.abs(shape.position.y) > boundsY) {
            shape.userData.speedY *= -0.9 + Math.random() * 0.2;
          }
          if (Math.abs(shape.position.z) > boundsZ) {
            shape.userData.speedZ *= -0.9 + Math.random() * 0.2;
          }
          
          // Pulsing effect
          shape.scale.setScalar(1 + Math.sin(time * 0.002 + index) * 0.1);
        });
        
        this.skillsRenderer.render(this.skillsScene, this.skillsCamera);
      }
    };

    this.animateShapes();

    // Responsive handling
    window.addEventListener('resize', this.debounce(() => {
      this.skillsCamera.aspect = skillsSection.offsetWidth / skillsSection.offsetHeight;
      this.skillsCamera.updateProjectionMatrix();
      this.skillsRenderer.setSize(skillsSection.offsetWidth, skillsSection.offsetHeight);
    }, 100));
  }

  createInteractiveShapes() {
    this.shapes = [];
    
    // Different geometries for variety
    const geometries = [
      new THREE.IcosahedronGeometry(1.8, 0),
      new THREE.OctahedronGeometry(2),
      new THREE.TorusGeometry(1.5, 0.4, 8, 12),
      new THREE.BoxGeometry(2.5, 2.5, 2.5),
      new THREE.DodecahedronGeometry(1.7)
    ];
    
    // Color palette
    const colors = [
      0x4361ee, 0x3a0ca3, 0x4cc9f0, 0x4895ef, 0x560bad
    ];
    
    // Create 7 shapes (odd number for better composition)
    for (let i = 0; i < 7; i++) {
      const geometry = geometries[i % geometries.length];
      const material = new THREE.MeshPhongMaterial({
        color: colors[i % colors.length],
        transparent: true,
        opacity: 0.7,
        specular: 0x111111,
        shininess: 30,
        wireframe: Math.random() > 0.7 // Some shapes as wireframes
      });
      
      const shape = new THREE.Mesh(geometry, material);
      
      // Position with some initial clustering
      const cluster = Math.floor(i / 2);
      shape.position.x = (Math.random() - 0.5) * 60 + (cluster % 2 === 0 ? -15 : 15);
      shape.position.y = (Math.random() - 0.5) * 30;
      shape.position.z = (Math.random() - 0.5) * 60;
      
      // Movement properties
      shape.userData = {
        speedX: Math.random() * 0.02 - 0.01,
        speedY: Math.random() * 0.02 - 0.01,
        speedZ: Math.random() * 0.02 - 0.01,
        rotationX: Math.random() * 0.01,
        rotationY: Math.random() * 0.01,
        originalZ: shape.position.z
      };
      
      this.skillsScene.add(shape);
      this.shapes.push(shape);
    }
    
    // Add directional light for better 3D perception
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    this.skillsScene.add(directionalLight);
    
    const ambientLight = new THREE.AmbientLight(0x404040);
    this.skillsScene.add(ambientLight);
  }

  initInteractiveOrbit() {
    // Only enable orbit controls on desktop
    if (!/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      this.initOrbitControls();
    }
  }

  initOrbitControls() {
    // Dynamically load orbit controls
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/controls/OrbitControls.min.js';
    script.onload = () => {
      if (typeof THREE.OrbitControls !== 'undefined' && this.particleCamera) {
        this.controls = new THREE.OrbitControls(this.particleCamera, this.particleRenderer.domElement);
        this.controls.enableZoom = false;
        this.controls.enablePan = false;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 0.5;
        
        // Update controls in animation loop
        const originalAnimate = this.animateParticles.bind(this);
        this.animateParticles = (time) => {
          originalAnimate(time);
          if (this.controls) this.controls.update();
        };
      }
    };
    document.head.appendChild(script);
  }

  initScrollEffects() {
    // Add scroll-based animations to shapes
    window.addEventListener('scroll', this.debounce(() => {
      if (!this.shapes) return;
      
      const scrollY = window.scrollY || window.pageYOffset;
      const scrollFactor = Math.min(scrollY / 1000, 1);
      
      this.shapes.forEach((shape, index) => {
        // Adjust z-position based on scroll
        shape.position.z = shape.userData.originalZ + scrollFactor * 20 * (index % 2 === 0 ? 1 : -1);
        
        // Adjust opacity
        if (shape.material) {
          shape.material.opacity = 0.7 - scrollFactor * 0.3;
        }
      });
    }, 50));
  }

  createThreeContainer(parentElement, className) {
    const container = document.createElement('div');
    container.className = `three-container ${className}`;
    container.style.position = 'absolute';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '-1';
    parentElement.appendChild(container);
    return container;
  }

  debounce(func, wait) {
    let timeout;
    return function() {
      const context = this, args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }
}

// Initialize the visual thinking experience when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new VisualThinkingExperience();
});