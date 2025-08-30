/**
 * Visual Thinking Animator - A creative visualization toolkit
 * Combines animation, visual metaphors, and interactive elements
 * to enhance cognitive processing and creative thinking.
 */

// Main initialization function
function initVisualThinkingAnimations() {
    // Check if anime.js is loaded
    if (typeof anime === 'undefined') {
        console.warn('anime.js is not loaded. Visual thinking animations disabled.');
        return;
    }

    // Visual Thinking Concepts Container
    const visualThinkingConcepts = [
        { name: "Divergence", color: "#FF6B6B", shape: "circle" },
        { name: "Patterns", color: "#4ECDC4", shape: "wave" },
        { name: "Abstraction", color: "#45B7D1", shape: "triangle" },
        { name: "Connection", color: "#FFBE0B", shape: "line" },
        { name: "Perspective", color: "#FB5607", shape: "cube" }
    ];

    // Create visual thinking elements if they don't exist
    createVisualThinkingElements(visualThinkingConcepts);

    // Animate the concepts in a mind-map style layout
    animateMindMap(visualThinkingConcepts);

    // Interactive thought bubbles
    setupThoughtBubbles();

    // Cognitive process visualization
    setupCognitiveProcessAnimation();

    // Idea connection lines animation
    setupIdeaConnections();

    // Visual metaphor animations
    setupVisualMetaphors();

    // Add scroll-triggered animations
    setupScrollAnimations();
}

// Create DOM elements for visual thinking concepts
function createVisualThinkingElements(concepts) {
    const container = document.createElement('div');
    container.className = 'visual-thinking-container';
    document.body.appendChild(container);

    concepts.forEach((concept, index) => {
        const conceptEl = document.createElement('div');
        conceptEl.className = `concept concept-${index}`;
        conceptEl.innerHTML = `<span>${concept.name}</span>`;
        conceptEl.dataset.shape = concept.shape;
        conceptEl.style.backgroundColor = concept.color;
        container.appendChild(conceptEl);
    });
}

// Animate concepts in a mind-map layout
function animateMindMap(concepts) {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const radius = Math.min(window.innerWidth, window.innerHeight) * 0.3;

    anime.timeline({
        easing: 'easeOutElastic',
        duration: 1000
    })
    .add({
        targets: '.visual-thinking-container',
        opacity: [0, 1],
        duration: 500
    })
    .add({
        targets: '.concept',
        opacity: [0, 1],
        scale: [0, 1],
        delay: anime.stagger(200),
        duration: 800,
        easing: 'easeOutBack',
        begin: function() {
            // Position elements in a circular layout
            document.querySelectorAll('.concept').forEach((el, i) => {
                const angle = (i * (2 * Math.PI / concepts.length)) - Math.PI/2;
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);
                
                el.style.position = 'absolute';
                el.style.left = `${x}px`;
                el.style.top = `${y}px`;
                el.style.transform = 'translate(-50%, -50%)';
            });
        }
    });

    // Add pulsing animation to show connections
    anime({
        targets: '.concept',
        scale: [1, 1.1],
        opacity: [1, 0.8],
        duration: 1500,
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutSine',
        delay: anime.stagger(300)
    });
}

// Interactive thought bubbles
function setupThoughtBubbles() {
    const bubbleContainer = document.createElement('div');
    bubbleContainer.className = 'thought-bubbles';
    document.body.appendChild(bubbleContainer);

    // Create initial bubbles
    for (let i = 0; i < 5; i++) {
        createThoughtBubble(bubbleContainer);
    }

    // Add new bubble on click
    document.addEventListener('click', (e) => {
        if (e.target.closest('.thought-bubble')) return;
        createThoughtBubble(bubbleContainer, e.clientX, e.clientY);
    });
}

function createThoughtBubble(container, x, y) {
    const bubble = document.createElement('div');
    bubble.className = 'thought-bubble';
    
    // Random position if not specified
    x = x || Math.random() * window.innerWidth;
    y = y || Math.random() * window.innerHeight;
    
    bubble.style.left = `${x}px`;
    bubble.style.top = `${y}px`;
    
    // Random size and content
    const size = 30 + Math.random() * 70;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    
    // Random shape variation
    const shapes = ['circle', 'rounded', 'cloud'];
    bubble.dataset.shape = shapes[Math.floor(Math.random() * shapes.length)];
    
    container.appendChild(bubble);
    
    // Animate appearance
    anime({
        targets: bubble,
        scale: [0, 1],
        opacity: [0, 0.7],
        duration: 800,
        easing: 'easeOutBack'
    });
    
    // Add hover effect
    bubble.addEventListener('mouseenter', () => {
        anime({
            targets: bubble,
            scale: 1.2,
            opacity: 1,
            duration: 300
        });
        
        // Show connection lines to nearby bubbles
        showBubbleConnections(bubble);
    });
    
    bubble.addEventListener('mouseleave', () => {
        anime({
            targets: bubble,
            scale: 1,
            opacity: 0.7,
            duration: 300
        });
        
        // Hide connection lines
        hideBubbleConnections();
    });
}

function showBubbleConnections(sourceBubble) {
    const bubbles = document.querySelectorAll('.thought-bubble');
    const sourceRect = sourceBubble.getBoundingClientRect();
    const sourceX = sourceRect.left + sourceRect.width/2;
    const sourceY = sourceRect.top + sourceRect.height/2;
    
    bubbles.forEach(bubble => {
        if (bubble === sourceBubble) return;
        
        const rect = bubble.getBoundingClientRect();
        const x = rect.left + rect.width/2;
        const y = rect.top + rect.height/2;
        
        // Calculate distance
        const distance = Math.sqrt(Math.pow(x - sourceX, 2) + Math.pow(y - sourceY, 2));
        
        if (distance < 300) { // Only connect nearby bubbles
            const line = document.createElement('div');
            line.className = 'thought-connection';
            
            // Position line between bubbles
            const angle = Math.atan2(y - sourceY, x - sourceX);
            const length = distance;
            
            line.style.width = `${length}px`;
            line.style.left = `${sourceX}px`;
            line.style.top = `${sourceY}px`;
            line.style.transform = `rotate(${angle}rad)`;
            line.style.transformOrigin = '0 0';
            
            document.body.appendChild(line);
            
            // Animate line drawing
            anime({
                targets: line,
                scaleX: [0, 1],
                duration: 500,
                easing: 'easeOutExpo'
            });
        }
    });
}

function hideBubbleConnections() {
    const connections = document.querySelectorAll('.thought-connection');
    connections.forEach(conn => {
        anime({
            targets: conn,
            opacity: 0,
            duration: 300,
            complete: () => conn.remove()
        });
    });
}

// Cognitive process visualization
function setupCognitiveProcessAnimation() {
    const processContainer = document.createElement('div');
    processContainer.className = 'cognitive-process';
    document.body.appendChild(processContainer);
    
    const stages = [
        { name: "Input", color: "#FF9F1C" },
        { name: "Process", color: "#2EC4B6" },
        { name: "Store", color: "#E71D36" },
        { name: "Output", color: "#011627" }
    ];
    
    stages.forEach((stage, i) => {
        const stageEl = document.createElement('div');
        stageEl.className = `stage stage-${i}`;
        stageEl.textContent = stage.name;
        stageEl.style.backgroundColor = stage.color;
        processContainer.appendChild(stageEl);
        
        // Position in a horizontal line
        stageEl.style.left = `${(i * 25) + 10}%`;
        
        // Animate flow between stages
        if (i > 0) {
            const arrow = document.createElement('div');
            arrow.className = 'process-arrow';
            processContainer.appendChild(arrow);
            
            arrow.style.left = `${(i * 25) + 2}%`;
            
            anime({
                targets: arrow,
                translateX: [20, 0],
                opacity: [0, 1],
                delay: i * 200,
                duration: 800
            });
        }
        
        anime({
            targets: stageEl,
            translateY: [50, 0],
            opacity: [0, 1],
            delay: i * 200,
            duration: 800,
            easing: 'easeOutBack'
        });
    });
    
    // Add pulsing animation to show the cyclical nature
    anime({
        targets: '.stage',
        scale: [1, 1.05],
        duration: 2000,
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutSine',
        delay: anime.stagger(500)
    });
}

// Idea connection lines animation
function setupIdeaConnections() {
    const ideas = [
        { id: 1, x: 20, y: 30, size: 60, color: '#FF6B6B' },
        { id: 2, x: 40, y: 60, size: 40, color: '#4ECDC4' },
        { id: 3, x: 70, y: 20, size: 50, color: '#45B7D1' },
        { id: 4, x: 60, y: 70, size: 30, color: '#FFBE0B' }
    ];
    
    const connections = [
        { from: 1, to: 2, strength: 0.8 },
        { from: 1, to: 3, strength: 0.5 },
        { from: 2, to: 4, strength: 0.7 },
        { from: 3, to: 4, strength: 0.9 }
    ];
    
    const container = document.createElement('div');
    container.className = 'idea-network';
    document.body.appendChild(container);
    
    // Create idea nodes
    ideas.forEach(idea => {
        const node = document.createElement('div');
        node.className = 'idea-node';
        node.dataset.id = idea.id;
        node.style.width = `${idea.size}px`;
        node.style.height = `${idea.size}px`;
        node.style.backgroundColor = idea.color;
        node.style.left = `${idea.x}%`;
        node.style.top = `${idea.y}%`;
        container.appendChild(node);
        
        // Add animation
        anime({
            targets: node,
            scale: [0, 1],
            rotate: [Math.random() * 360, 0],
            opacity: [0, 1],
            duration: 1000,
            easing: 'easeOutElastic'
        });
        
        // Make draggable
        makeDraggable(node);
    });
    
    // Create connections
    connections.forEach(conn => {
        const fromNode = document.querySelector(`.idea-node[data-id="${conn.from}"]`);
        const toNode = document.querySelector(`.idea-node[data-id="${conn.to}"]`);
        
        if (fromNode && toNode) {
            const line = document.createElement('div');
            line.className = 'idea-connection';
            line.dataset.strength = conn.strength;
            container.appendChild(line);
            
            updateConnectionLine(line, fromNode, toNode);
            
            // Animate connection
            anime({
                targets: line,
                opacity: [0, conn.strength],
                duration: 800
            });
        }
    });
    
    // Update connection lines when nodes move
    function updateConnectionLine(line, fromNode, toNode) {
        const fromRect = fromNode.getBoundingClientRect();
        const toRect = toNode.getBoundingClientRect();
        
        const fromX = fromRect.left + fromRect.width/2;
        const fromY = fromRect.top + fromRect.height/2;
        const toX = toRect.left + toRect.width/2;
        const toY = toRect.top + toRect.height/2;
        
        const angle = Math.atan2(toY - fromY, toX - fromX);
        const length = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
        
        line.style.width = `${length}px`;
        line.style.left = `${fromX}px`;
        line.style.top = `${fromY}px`;
        line.style.transform = `rotate(${angle}rad)`;
        line.style.transformOrigin = '0 0';
        line.style.opacity = line.dataset.strength;
    }
    
    function makeDraggable(element) {
        let isDragging = false;
        let offsetX, offsetY;
        
        element.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;
            element.style.cursor = 'grabbing';
            
            // Pulse animation when grabbed
            anime({
                targets: element,
                scale: 1.1,
                duration: 200
            });
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            
            // Convert to percentage for responsive positioning
            const percentX = (x / window.innerWidth) * 100;
            const percentY = (y / window.innerHeight) * 100;
            
            element.style.left = `${Math.max(0, Math.min(90, percentX))}%`;
            element.style.top = `${Math.max(0, Math.min(90, percentY))}%`;
            
            // Update all connections for this node
            const connections = document.querySelectorAll('.idea-connection');
            connections.forEach(conn => {
                const fromId = parseInt(conn.dataset.from) || parseInt(conn.parentElement.querySelector('.idea-node').dataset.id);
                const toId = parseInt(conn.dataset.to) || parseInt(conn.parentElement.querySelectorAll('.idea-node')[1]?.dataset.id);
                
                if (fromId === parseInt(element.dataset.id) {
                    const toNode = document.querySelector(`.idea-node[data-id="${toId}"]`);
                    if (toNode) updateConnectionLine(conn, element, toNode);
                }
                
                if (toId === parseInt(element.dataset.id)) {
                    const fromNode = document.querySelector(`.idea-node[data-id="${fromId}"]`);
                    if (fromNode) updateConnectionLine(conn, fromNode, element);
                }
            });
        });
        
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                element.style.cursor = 'grab';
                
                // Return to normal scale
                anime({
                    targets: element,
                    scale: 1,
                    duration: 200
                });
            }
        });
    }
}

// Visual metaphor animations
function setupVisualMetaphors() {
    const metaphors = [
        { name: "Lightbulb", emoji: "💡", color: "#FFD166" },
        { name: "Puzzle", emoji: "🧩", color: "#06D6A0" },
        { name: "Tree", emoji: "🌳", color: "#118AB2" },
        { name: "Bridge", emoji: "🌉", color: "#EF476F" }
    ];
    
    const container = document.createElement('div');
    container.className = 'visual-metaphors';
    document.body.appendChild(container);
    
    metaphors.forEach((metaphor, i) => {
        const metaphorEl = document.createElement('div');
        metaphorEl.className = 'metaphor';
        metaphorEl.innerHTML = `<span class="emoji">${metaphor.emoji}</span><span class="name">${metaphor.name}</span>`;
        metaphorEl.style.backgroundColor = metapor.color;
        container.appendChild(metaphorEl);
        
        // Position in a grid
        const row = Math.floor(i / 2);
        const col = i % 2;
        metaphorEl.style.left = `${10 + col * 40}%`;
        metaphorEl.style.top = `${20 + row * 30}%`;
        
        // Animate appearance
        anime({
            targets: metaphorEl,
            scale: [0, 1],
            rotate: [Math.random() * 90 - 45, 0],
            opacity: [0, 1],
            delay: i * 200,
            duration: 800,
            easing: 'easeOutBack'
        });
        
        // Add hover effect
        metaphorEl.addEventListener('mouseenter', () => {
            anime({
                targets: metaphorEl,
                scale: 1.1,
                rotate: Math.random() * 20 - 10,
                duration: 300
            });
            
            // Animate emoji
            anime({
                targets: metaphorEl.querySelector('.emoji'),
                translateY: [0, -10, 0],
                duration: 600,
                easing: 'easeInOutQuad'
            });
        });
        
        metaphorEl.addEventListener('mouseleave', () => {
            anime({
                targets: metaphorEl,
                scale: 1,
                rotate: 0,
                duration: 300
            });
        });
    });
}

// Scroll-triggered animations
function setupScrollAnimations() {
    // Create scroll progress indicator
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    // Animate on scroll
    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        
        // Update progress bar
        anime({
            targets: progressBar,
            width: `${scrollPercent}%`,
            duration: 100,
            easing: 'linear'
        });
        
        // Parallax effect for concepts
        document.querySelectorAll('.concept').forEach((el, i) => {
            const speed = 0.2 + (i * 0.05);
            const yPos = -window.scrollY * speed;
            anime.set(el, { translateY: yPos });
        });
    });
    
    // Create scroll-triggered elements
    const scrollContainer = document.createElement('div');
    scrollContainer.className = 'scroll-content';
    document.body.appendChild(scrollContainer);
    
    for (let i = 0; i < 10; i++) {
        const item = document.createElement('div');
        item.className = 'scroll-item';
        item.textContent = `Insight ${i + 1}`;
        scrollContainer.appendChild(item);
        
        // Set initial state
        anime.set(item, {
            opacity: 0,
            translateY: 50
        });
    }
    
    // Intersection Observer for scroll-triggered animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                anime({
                    targets: entry.target,
                    opacity: 1,
                    translateY: 0,
                    duration: 800,
                    easing: 'easeOutExpo'
                });
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.scroll-item').forEach(item => {
        observer.observe(item);
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initVisualThinkingAnimations);

// Add styles dynamically
const style = document.createElement('style');
style.textContent = `
    .visual-thinking-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 100;
    }
    
    .concept {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-family: Arial, sans-serif;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        cursor: pointer;
        pointer-events: auto;
    }
    
    .concept[data-shape="wave"] {
        border-radius: 10% 30% 50% 70%;
    }
    
    .concept[data-shape="triangle"] {
        clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
    }
    
    .concept[data-shape="line"] {
        width: 150px;
        height: 20px;
    }
    
    .concept[data-shape="cube"] {
        border-radius: 10px;
    }
    
    .thought-bubbles {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 90;
    }
    
    .thought-bubble {
        position: absolute;
        background-color: rgba(255,255,255,0.7);
        border-radius: 50%;
        pointer-events: auto;
        cursor: pointer;
        transition: transform 0.3s;
    }
    
    .thought-bubble[data-shape="rounded"] {
        border-radius: 25%;
    }
    
    .thought-bubble[data-shape="cloud"] {
        border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
    }
    
    .thought-connection {
        position: absolute;
        height: 2px;
        background: linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,0.8));
        transform-origin: 0 0;
        pointer-events: none;
    }
    
    .cognitive-process {
        position: fixed;
        bottom: 50px;
        left: 0;
        width: 100%;
        height: 100px;
        z-index: 80;
    }
    
    .stage {
        position: absolute;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-family: Arial, sans-serif;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }
    
    .process-arrow {
        position: absolute;
        width: 40px;
        height: 10px;
        background-color: white;
        top: 50%;
        transform: translateY(-50%);
    }
    
    .process-arrow::after {
        content: '';
        position: absolute;
        right: 0;
        top: 50%;
        width: 10px;
        height: 10px;
        border-right: 2px solid white;
        border-top: 2px solid white;
        transform: translateY(-50%) rotate(45deg);
    }
    
    .idea-network {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 70;
    }
    
    .idea-node {
        position: absolute;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        cursor: grab;
        pointer-events: auto;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }
    
    .idea-connection {
        position: absolute;
        height: 2px;
        background-color: rgba(255,255,255,0.5);
        transform-origin: 0 0;
        pointer-events: none;
    }
    
    .visual-metaphors {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 60;
    }
    
    .metaphor {
        position: absolute;
        width: 120px;
        height: 120px;
        border-radius: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-family: Arial, sans-serif;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        pointer-events: auto;
    }
    
    .metaphor .emoji {
        font-size: 40px;
        margin-bottom: 10px;
    }
    
    .scroll-progress {
        position: fixed;
        top: 0;
        left: 0;
        height: 4px;
        background: linear-gradient(to right, #FF6B6B, #4ECDC4, #45B7D1);
        z-index: 200;
    }
    
    .scroll-content {
        margin-top: 100vh;
        padding: 50px;
        display: flex;
        flex-direction: column;
        gap: 40px;
    }
    
    .scroll-item {
        background: rgba(255,255,255,0.1);
        backdrop-filter: blur(10px);
        padding: 30px;
        border-radius: 10px;
        max-width: 600px;
        margin: 0 auto;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
`;
document.head.appendChild(style);
/**
 * Portfolio-Specific Anime.js Animations
 * Optimized for Hitesh's portfolio website
 */

function initAnimeJSAnimations() {
    if (typeof anime === 'undefined') return;

    // 1. Hero Section Animations
    anime({
        targets: '.hero-title, .hero-subtitle, .hero-text, .hero-buttons',
        translateY: [30, 0],
        opacity: [0, 1],
        duration: 1000,
        delay: anime.stagger(200),
        easing: 'easeOutExpo'
    });

    // 2. Avatar Floating Animation
    anime({
        targets: '.avatar',
        translateY: {
            value: [-15, 15],
            duration: 3000,
            easing: 'easeInOutSine',
            loop: true,
            direction: 'alternate'
        },
        rotate: {
            value: [-5, 5],
            duration: 2000,
            easing: 'easeInOutSine',
            loop: true,
            direction: 'alternate'
        }
    });

    // 3. Skill Bars Animation
    document.querySelectorAll('.skill-progress').forEach(bar => {
        const width = bar.getAttribute('data-width');
        anime({
            targets: bar,
            width: ['0%', `${width}%`],
            duration: 1500,
            easing: 'easeOutExpo',
            delay: 500,
            scrollTrigger: {
                trigger: bar,
                start: 'top 80%'
            }
        });
    });

    // 4. Project Card Entrances
    anime({
        targets: '.project-card',
        translateY: [50, 0],
        opacity: [0, 1],
        duration: 800,
        easing: 'easeOutExpo',
        delay: anime.stagger(100),
        scrollTrigger: {
            trigger: '#projects',
            start: 'top 70%'
        }
    });

    // 5. Timeline Item Animations
    anime({
        targets: '.timeline-item',
        translateX: [-50, 0],
        opacity: [0, 1],
        duration: 800,
        delay: anime.stagger(150),
        scrollTrigger: {
            trigger: '#experience',
            start: 'top 80%'
        }
    });

    // 6. Course Card Hover Effects
    document.querySelectorAll('.course-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            anime({
                targets: card,
                scale: 1.03,
                duration: 300
            });
        });
        card.addEventListener('mouseleave', () => {
            anime({
                targets: card,
                scale: 1,
                duration: 300
            });
        });
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (typeof anime !== 'undefined') {
        initAnimeJSAnimations();
    }
});