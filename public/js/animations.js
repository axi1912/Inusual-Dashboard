//  GLASSMORPHISM ANIMATIONS & COUNTERS
// Advanced JavaScript for Visual Upgrades

document.addEventListener('DOMContentLoaded', function() {
    // Animated Counter Function
    function animateCounter(element, finalValue, duration = 2000) {
        const startValue = 0;
        const startTime = Date.now();
        
        function updateCounter() {
            const currentTime = Date.now();
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(startValue + (finalValue - startValue) * easeOutQuart);
            
            element.textContent = currentValue.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = finalValue.toLocaleString();
            }
        }
        
        updateCounter();
    }
    
    // Initialize counters for stat cards
    function initCounters() {
        const counters = document.querySelectorAll('.stat-card h3');
        
        counters.forEach((counter, index) => {
            const finalValue = parseInt(counter.textContent) || 0;
            counter.textContent = '0';
            
            // Stagger the animations
            setTimeout(() => {
                animateCounter(counter, finalValue, 2000 + (index * 200));
            }, 500 + (index * 100));
        });
    }
    
    // Progress Bar Animation
    function animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar');
        
        progressBars.forEach((bar, index) => {
            const width = bar.getAttribute('data-width') || '0%';
            bar.style.width = '0%';
            
            setTimeout(() => {
                bar.style.transition = 'width 1.5s cubic-bezier(0.25, 0.8, 0.25, 1)';
                bar.style.width = width;
            }, 1000 + (index * 200));
        });
    }
    
    // Floating Animation for Elements
    function addFloatingAnimation() {
        const floatingElements = document.querySelectorAll('.stat-card');
        
        floatingElements.forEach((element, index) => {
            element.style.animationDelay = `${index * 0.2}s`;
            element.classList.add('floating-animation');
        });
    }
    
    // Glassmorphism Intersection Observer
    function initIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Observe all stat cards and glass elements
        const elementsToObserve = document.querySelectorAll('.stat-card, .table-container, .glass-hover');
        elementsToObserve.forEach(el => observer.observe(el));
    }
    
    // Smooth Loading Effects
    function initLoadingEffects() {
        // Add shimmer effect to loading elements
        const loadingElements = document.querySelectorAll('[data-loading="true"]');
        loadingElements.forEach(el => {
            el.classList.add('stat-loading');
            
            // Remove loading after random delay
            setTimeout(() => {
                el.classList.remove('stat-loading');
                el.removeAttribute('data-loading');
            }, 1000 + Math.random() * 2000);
        });
    }
    
    // Enhanced Table Row Hover Effects
    function initTableEffects() {
        const tableRows = document.querySelectorAll('.table tbody tr');
        
        tableRows.forEach(row => {
            row.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.02) translateZ(0)';
                this.style.boxShadow = '0 10px 25px rgba(0, 217, 163, 0.1)';
            });
            
            row.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1) translateZ(0)';
                this.style.boxShadow = 'none';
            });
        });
    }
    
    // Dynamic Background Particles
    function createBackgroundParticles() {
        const particleContainer = document.createElement('div');
        particleContainer.className = 'background-particles';
        particleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            overflow: hidden;
        `;
        
        // Create floating particles
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 6 + 2}px;
                height: ${Math.random() * 6 + 2}px;
                background: radial-gradient(circle, rgba(0, 217, 163, 0.6), rgba(0, 217, 163, 0.1));
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: floatParticle ${15 + Math.random() * 10}s ease-in-out infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            
            particleContainer.appendChild(particle);
        }
        
        document.body.appendChild(particleContainer);
    }
    
    // Theme Toggle Animation
    function initThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', function() {
                document.body.style.transition = 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)';
                
                // Add rotation animation to toggle button
                this.style.transform = 'rotate(360deg)';
                setTimeout(() => {
                    this.style.transform = 'rotate(0deg)';
                }, 500);
            });
        }
    }
    
    // Real-time Data Update Animation
    function animateDataUpdate(element) {
        element.classList.add('data-update-pulse');
        setTimeout(() => {
            element.classList.remove('data-update-pulse');
        }, 1000);
    }
    
    // Initialize all animations
    function initializeAll() {
        initCounters();
        animateProgressBars();
        addFloatingAnimation();
        initIntersectionObserver();
        initLoadingEffects();
        initTableEffects();
        createBackgroundParticles();
        initThemeToggle();
        
        // Add entrance animations
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 100);
    }
    
    // Start all animations
    initializeAll();
    
    // Expose functions globally for dynamic updates
    window.GlassAnimations = {
        animateCounter,
        animateDataUpdate,
        initTableEffects
    };
});

// Additional CSS animations via JavaScript
const additionalStyles = `
    <style>
        .floating-animation {
            animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
        
        @keyframes floatParticle {
            0%, 100% { 
                transform: translateY(0px) translateX(0px) rotate(0deg);
                opacity: 0.3;
            }
            25% { 
                transform: translateY(-20px) translateX(10px) rotate(90deg);
                opacity: 0.6;
            }
            50% { 
                transform: translateY(-40px) translateX(-5px) rotate(180deg);
                opacity: 0.8;
            }
            75% { 
                transform: translateY(-20px) translateX(-15px) rotate(270deg);
                opacity: 0.4;
            }
        }
        
        .animate-in {
            animation: slideInUp 0.8s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .data-update-pulse {
            animation: updatePulse 1s ease-in-out;
        }
        
        @keyframes updatePulse {
            0%, 100% { 
                background: rgba(255, 255, 255, 0.06);
                transform: scale(1);
            }
            50% { 
                background: rgba(0, 217, 163, 0.1);
                transform: scale(1.02);
            }
        }
        
        body.loaded {
            opacity: 1;
        }
        
        body {
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
        }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', additionalStyles);
