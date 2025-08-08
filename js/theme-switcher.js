function initThemeSwitcher() {
    const themeButtons = document.querySelectorAll('.theme-btn');
    const body = document.body;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
    body.className = savedTheme + '-theme';
    
    // Set active button based on current theme
    themeButtons.forEach(btn => {
        if (btn.classList.contains(savedTheme)) {
            btn.classList.add('active');
        }
    });

    // Theme switcher functionality
    themeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const theme = this.classList.contains('light') ? 'light' :
                         this.classList.contains('dark') ? 'dark' : 'neon';
            
            // Remove all theme classes
            body.className = '';
            // Add selected theme class
            body.classList.add(theme + '-theme');
            
            // Save to localStorage
            localStorage.setItem('portfolio-theme', theme);
            
            // Update active button
            themeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
}