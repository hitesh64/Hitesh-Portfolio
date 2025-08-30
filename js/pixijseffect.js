class ParticleVisualizer {
  constructor() {
    this.themes = {
      bubbles: { shape: 'circle', connectionStyle: 'curved', palette: [0x3498db, 0xe74c3c, 0x2ecc71, 0xf1c40f, 0x9b59b6] },
      squares: { shape: 'square', connectionStyle: 'straight', palette: [0x1abc9c, 0x34495e, 0xe67e22, 0x16a085, 0xc0392b] },
      hexagons: { shape: 'hexagon', connectionStyle: 'dashed', palette: [0x8e44ad, 0x27ae60, 0xd35400, 0x2980b9, 0xf39c12] },
      triangles: { shape: 'triangle', connectionStyle: 'zigzag', palette: [0xe74c3c, 0x2ecc71, 0xf1c40f, 0x3498db, 0x9b59b6] }
    };
    this.themeKeys = Object.keys(this.themes);
    this.currentThemeIndex = 0;
    this.currentTheme = this.themeKeys[this.currentThemeIndex];
    this.particles = [];
    this.config = {
      particleCount: Math.floor(window.innerWidth * window.innerHeight / 10000),
      maxSpeed: 0.5,
      mouseRadius: 150,
      connectionDistance: 100,
      particleSize: { min: 1, max: 3 },
      connectionWidth: 0.5,
      themeChangeInterval: 8000
    };
    this.mouse = { x: 0, y: 0 };
    this.init();
  }

  init() {
    if (typeof PIXI === 'undefined') {
      console.error('PIXI.js is not loaded');
      return;
    }

    this.container = document.createElement('div');
    this.container.className = 'particle-container';
    Object.assign(this.container.style, {
      position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: '0', overflow: 'hidden'
    });
    document.body.appendChild(this.container);

    this.app = new PIXI.Application({
      width: window.innerWidth, height: window.innerHeight,
      backgroundColor: 0x000000, backgroundAlpha: 0,
      transparent: true, antialias: true,
      resolution: window.devicePixelRatio || 1, autoDensity: true
    });
    this.container.appendChild(this.app.view);
    this.graphics = new PIXI.Graphics();
    this.app.stage.addChild(this.graphics);

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    this.createParticles();
    this.setupAnimationLoop();
    this.setupResizeHandler();
    this.setupThemeCycle();
  }

  createParticles() {
    const theme = this.themes[this.currentTheme];
    for (let i = 0; i < this.config.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.app.screen.width,
        y: Math.random() * this.app.screen.height,
        vx: Math.random() * this.config.maxSpeed * 2 - this.config.maxSpeed,
        vy: Math.random() * this.config.maxSpeed * 2 - this.config.maxSpeed,
        size: Math.random() * (this.config.particleSize.max - this.config.particleSize.min) + this.config.particleSize.min,
        color: theme.palette[Math.floor(Math.random() * theme.palette.length)],
        alpha: Math.random() * 0.5 + 0.3,
        targetColor: theme.palette[Math.floor(Math.random() * theme.palette.length)],
        colorChangeSpeed: Math.random() * 0.01 + 0.005,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02
      });
    }
  }

  setupAnimationLoop() {
    this.app.ticker.add(() => {
      this.graphics.clear();
      const theme = this.themes[this.currentTheme];
      this.particles.forEach((p, i) => {
        this.updateParticlePosition(p);
        this.drawParticle(p, theme.shape);
        this.drawConnections(p, i, theme.connectionStyle);
      });
    });
  }

  updateParticlePosition(p) {
    const dx = this.mouse.x - p.x;
    const dy = this.mouse.y - p.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < this.config.mouseRadius) {
      const angle = Math.atan2(dy, dx);
      const force = (this.config.mouseRadius - distance) / this.config.mouseRadius;
      p.vx -= Math.cos(angle) * force * 0.2;
      p.vy -= Math.sin(angle) * force * 0.2;
    }

    p.x += p.vx;
    p.y += p.vy;
    p.rotation += p.rotationSpeed;

    if (p.x < 0 || p.x > this.app.screen.width) {
      p.vx *= -0.9;
      p.x = p.x < 0 ? 0 : this.app.screen.width;
    }
    if (p.y < 0 || p.y > this.app.screen.height) {
      p.vy *= -0.9;
      p.y = p.y < 0 ? 0 : this.app.screen.height;
    }

    if (Math.random() < 0.005) {
      p.targetColor = this.themes[this.currentTheme].palette[
        Math.floor(Math.random() * this.themes[this.currentTheme].palette.length)
      ];
    }
    const currentColor = PIXI.utils.hex2rgb(p.color);
    const targetColor = PIXI.utils.hex2rgb(p.targetColor);
    currentColor[0] += (targetColor[0] - currentColor[0]) * p.colorChangeSpeed;
    currentColor[1] += (targetColor[1] - currentColor[1]) * p.colorChangeSpeed;
    currentColor[2] += (targetColor[2] - currentColor[2]) * p.colorChangeSpeed;
    p.color = PIXI.utils.rgb2hex(currentColor);
  }

  drawParticle(p, shape) {
    this.graphics.beginFill(p.color, p.alpha);
    switch (shape) {
      case 'square':
        this.graphics.drawRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size);
        break;
      case 'hexagon':
        this.drawPolygon(p.x, p.y, p.size, p.rotation, 6);
        break;
      case 'triangle':
        this.drawPolygon(p.x, p.y, p.size, p.rotation, 3);
        break;
      default:
        this.graphics.drawCircle(p.x, p.y, p.size);
    }
    this.graphics.endFill();
  }

  drawPolygon(x, y, size, rotation, sides) {
    const angle = (Math.PI * 2) / sides;
    this.graphics.moveTo(x + size * Math.cos(rotation), y + size * Math.sin(rotation));
    for (let i = 1; i <= sides; i++) {
      this.graphics.lineTo(
        x + size * Math.cos(rotation + angle * i),
        y + size * Math.sin(rotation + angle * i)
      );
    }
  }

  drawConnections(p, index, style) {
    for (let j = index + 1; j < this.particles.length; j++) {
      const other = this.particles[j];
      const dx = other.x - p.x;
      const dy = other.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < this.config.connectionDistance) {
        const lineAlpha = 1 - dist / this.config.connectionDistance;
        this.graphics.lineStyle(this.config.connectionWidth, 0xFFFFFF, lineAlpha * 0.2);
        this.graphics.moveTo(p.x, p.y);
        this.graphics.lineTo(other.x, other.y);
      }
    }
  }

  changeTheme(themeName) {
    this.currentTheme = themeName;
    this.particles.forEach(p => {
      p.targetColor = this.themes[themeName].palette[
        Math.floor(Math.random() * this.themes[themeName].palette.length)
      ];
    });
  }

  setupThemeCycle() {
    setInterval(() => {
      this.currentThemeIndex = (this.currentThemeIndex + 1) % this.themeKeys.length;
      this.changeTheme(this.themeKeys[this.currentThemeIndex]);
    }, this.config.themeChangeInterval);
  }

  setupResizeHandler() {
    window.addEventListener('resize', () => {
      this.app.renderer.resize(window.innerWidth, window.innerHeight);
      const newCount = Math.floor(window.innerWidth * window.innerHeight / 10000);
      if (newCount > this.particles.length) {
        const theme = this.themes[this.currentTheme];
        for (let i = this.particles.length; i < newCount; i++) {
          this.particles.push({
            x: Math.random() * this.app.screen.width,
            y: Math.random() * this.app.screen.height,
            vx: Math.random() * this.config.maxSpeed * 2 - this.config.maxSpeed,
            vy: Math.random() * this.config.maxSpeed * 2 - this.config.maxSpeed,
            size: Math.random() * (this.config.particleSize.max - this.config.particleSize.min) + this.config.particleSize.min,
            color: theme.palette[Math.floor(Math.random() * theme.palette.length)],
            alpha: Math.random() * 0.5 + 0.3,
            targetColor: theme.palette[Math.floor(Math.random() * theme.palette.length)],
            colorChangeSpeed: Math.random() * 0.01 + 0.005,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.02
          });
        }
      } else if (newCount < this.particles.length) {
        this.particles.length = newCount;
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  if (typeof PIXI === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://pixijs.download/v7.2.4/pixi.min.js';
    script.onload = () => new ParticleVisualizer();
    script.onerror = () => console.error('Failed to load PIXI.js');
    document.head.appendChild(script);
  } else {
    new ParticleVisualizer();
  }
});