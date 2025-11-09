//  ADVANCED VISUAL EFFECTS & ANIMATIONS
// Interactive Cursor, Parallax, Particles, Page Transitions

class VisualEffects {
    constructor() {
        this.cursor = { x: 0, y: 0 };
        this.trails = [];
        this.particles = [];
        this.isLoading = true;
        this.scrollY = 0;
        this.init();
    }

    init() {
        this.createCustomCursor();
        this.createLoadingScreen();
        this.createMorphingBackground();
        this.createParticleSystem();
        this.initParallax();
        this.initScrollReveal();
        this.initMicroInteractions();
        this.initPageTransitions();
        this.bindEvents();
    }

    createCustomCursor() {
        // Create custom cursor
        const cursor = document.createElement("div");
        cursor.className = "custom-cursor";
        document.body.appendChild(cursor);

        this.cursorElement = cursor;

        // Track mouse movement
        document.addEventListener("mousemove", (e) => {
            this.cursor.x = e.clientX;
            this.cursor.y = e.clientY;
            
            cursor.style.left = e.clientX + "px";
            cursor.style.top = e.clientY + "px";

            this.createCursorTrail();
            this.updateHoverParticles(e);
        });

        // Handle hover states
        document.addEventListener("mouseenter", (e) => {
            if (e.target.matches("a, button, .clickable, .stat-card, .chart-container")) {
                cursor.classList.add("hover");
            }
        });

        document.addEventListener("mouseleave", (e) => {
            if (e.target.matches("a, button, .clickable, .stat-card, .chart-container")) {
                cursor.classList.remove("hover");
            }
        });

        // Handle click effects
        document.addEventListener("mousedown", () => {
            cursor.classList.add("click");
            this.createRippleEffect(this.cursor.x, this.cursor.y);
        });

        document.addEventListener("mouseup", () => {
            cursor.classList.remove("click");
        });
    }

    createCursorTrail() {
        const trail = document.createElement("div");
        trail.className = "cursor-trail";
        trail.style.left = this.cursor.x + "px";
        trail.style.top = this.cursor.y + "px";
        
        document.body.appendChild(trail);

        setTimeout(() => {
            if (trail.parentNode) {
                trail.parentNode.removeChild(trail);
            }
        }, 500);
    }

    createRippleEffect(x, y) {
        const ripple = document.createElement("div");
        ripple.className = "ripple";
        ripple.style.left = x - 25 + "px";
        ripple.style.top = y - 25 + "px";
        ripple.style.width = "50px";
        ripple.style.height = "50px";
        
        document.body.appendChild(ripple);

        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    updateHoverParticles(e) {
        const hoverElements = document.querySelectorAll(".hover-particles");
        hoverElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            element.style.setProperty("--x", x + "%");
            element.style.setProperty("--y", y + "%");
        });
    }

    createLoadingScreen() {
        const loadingScreen = document.createElement("div");
        loadingScreen.className = "loading-screen";
        loadingScreen.innerHTML = `
            <div class="loading-logo"> INUSUAL</div>
            <div class="loading-progress">
                <div class="loading-bar"></div>
            </div>
            <div class="loading-text">Loading amazing experience...</div>
        `;
        
        document.body.appendChild(loadingScreen);

        // Simulate loading progress
        setTimeout(() => {
            loadingScreen.classList.add("hidden");
            this.isLoading = false;
            setTimeout(() => {
                if (loadingScreen.parentNode) {
                    loadingScreen.parentNode.removeChild(loadingScreen);
                }
            }, 500);
        }, 3000);
    }

    createMorphingBackground() {
        const morphingBg = document.createElement("div");
        morphingBg.className = "morphing-background";
        document.body.appendChild(morphingBg);
    }

    createParticleSystem() {
        const particleSystem = document.createElement("div");
        particleSystem.className = "particle-system";
        document.body.appendChild(particleSystem);

        this.particleContainer = particleSystem;
        this.generateParticles();

                // Generate particles every 6 seconds
        setInterval(() => {
            if (this.particles.length < 8) { // Límite reducido
                this.generateParticles();
            }
        }, 6000);
    }

    generateParticles() {
        for (let i = 0; i < 3; i++) { // Menos partículas por generación
            const particle = document.createElement("div");
            particle.className = "particle";
            
            const size = Math.random() * 4 + 2;
            particle.style.width = size + "px";
            particle.style.height = size + "px";
            particle.style.left = Math.random() * 100 + "%";
            particle.style.animationDelay = Math.random() * 2 + "s";
            particle.style.animationDuration = (Math.random() * 4 + 4) + "s";
            
            this.particleContainer.appendChild(particle);
            this.particles.push(particle);

            // Remove particle after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                    this.particles = this.particles.filter(p => p !== particle);
                }
            }, 8000);
        }
    }

    initParallax() {
        const parallaxElements = document.querySelectorAll(".parallax-element");
        
        window.addEventListener("scroll", () => {
            this.scrollY = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(this.scrollY * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });

            // Update CSS custom property for parallax
            document.documentElement.style.setProperty("--scroll-y", this.scrollY);
        });
    }

    initScrollReveal() {
        const revealElements = document.querySelectorAll(".scroll-reveal, .scroll-reveal-left, .scroll-reveal-right");
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("revealed");
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        });

        revealElements.forEach(element => {
            observer.observe(element);
        });
    }

    initMicroInteractions() {
        // Add micro-interaction classes to interactive elements
        const interactiveElements = document.querySelectorAll("button, .btn, .nav-links a, .stat-card");
        
        interactiveElements.forEach(element => {
            if (!element.classList.contains("micro-bounce")) {
                element.classList.add("micro-bounce");
            }
        });

        // Add magnetic effect to specific elements
        const magneticElements = document.querySelectorAll(".chart-container, .login-card");
        
        magneticElements.forEach(element => {
            element.classList.add("magnetic");
            
            element.addEventListener("mousemove", (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.02)`;
            });

            element.addEventListener("mouseleave", () => {
                element.style.transform = "translate(0px, 0px) scale(1)";
            });
        });
    }

    initPageTransitions() {
        // Create page transition overlay
        const transition = document.createElement("div");
        transition.className = "page-transition";
        transition.innerHTML = `<div class="transition-loader"></div>`;
        document.body.appendChild(transition);

        this.transitionElement = transition;

        // Handle page transitions for navigation
        const navLinks = document.querySelectorAll(".nav-links a");
        
        navLinks.forEach(link => {
            link.addEventListener("click", (e) => {
                if (link.href && link.href !== window.location.href) {
                    e.preventDefault();
                    this.triggerPageTransition(link.href);
                }
            });
        });
    }

    triggerPageTransition(url) {
        this.transitionElement.classList.add("active");
        
        setTimeout(() => {
            window.location.href = url;
        }, 500);
    }

    bindEvents() {
        // Handle window resize
        window.addEventListener("resize", () => {
            this.handleResize();
        });

        // Handle visibility change
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                this.pauseAnimations();
            } else {
                this.resumeAnimations();
            }
        });

        // Handle theme changes
        const themeToggle = document.getElementById("theme-toggle");
        if (themeToggle) {
            themeToggle.addEventListener("click", () => {
                this.handleThemeChange();
            });
        }
    }

    handleResize() {
        // Recalculate particle positions and parallax on resize
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            this.disableMobileEffects();
        } else {
            this.enableDesktopEffects();
        }
    }

    disableMobileEffects() {
        // Disable resource-intensive effects on mobile
        if (this.cursorElement) {
            this.cursorElement.style.display = "none";
        }
        
        const parallaxElements = document.querySelectorAll(".parallax-element");
        parallaxElements.forEach(element => {
            element.style.transform = "none";
        });
    }

    enableDesktopEffects() {
        if (this.cursorElement) {
            this.cursorElement.style.display = "block";
        }
    }

    pauseAnimations() {
        document.body.style.animationPlayState = "paused";
    }

    resumeAnimations() {
        document.body.style.animationPlayState = "running";
    }

    handleThemeChange() {
        // Add theme transition effects
        document.body.classList.add("theme-switching");
        
        setTimeout(() => {
            document.body.classList.remove("theme-switching");
        }, 600);
    }

    // Text animation effects
    animateTextShimmer(element) {
        element.classList.add("text-shimmer");
        
        setTimeout(() => {
            element.classList.remove("text-shimmer");
        }, 2000);
    }

    animateTextGlow(element) {
        element.classList.add("text-glow");
        
        setTimeout(() => {
            element.classList.remove("text-glow");
        }, 4000);
    }

    // Public methods for external use
    createExplosion(x, y) {
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement("div");
            particle.style.position = "fixed";
            particle.style.left = x + "px";
            particle.style.top = y + "px";
            particle.style.width = "6px";
            particle.style.height = "6px";
            particle.style.background = "#00D9A3";
            particle.style.borderRadius = "50%";
            particle.style.pointerEvents = "none";
            particle.style.zIndex = "9999";
            
            const angle = (i / 12) * Math.PI * 2;
            const velocity = 100 + Math.random() * 50;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            document.body.appendChild(particle);
            
            let opacity = 1;
            let posX = x;
            let posY = y;
            
            const animate = () => {
                posX += vx * 0.016;
                posY += vy * 0.016;
                opacity -= 0.02;
                
                particle.style.left = posX + "px";
                particle.style.top = posY + "px";
                particle.style.opacity = opacity;
                
                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }
            };
            
            animate();
        }
    }

    pulseElement(element) {
        element.style.transform = "scale(1.1)";
        element.style.transition = "transform 0.2s ease";
        
        setTimeout(() => {
            element.style.transform = "scale(1)";
        }, 200);
    }

    // Cleanup method
    destroy() {
        if (this.cursorElement && this.cursorElement.parentNode) {
            this.cursorElement.parentNode.removeChild(this.cursorElement);
        }
        
        if (this.particleContainer && this.particleContainer.parentNode) {
            this.particleContainer.parentNode.removeChild(this.particleContainer);
        }
        
        if (this.transitionElement && this.transitionElement.parentNode) {
            this.transitionElement.parentNode.removeChild(this.transitionElement);
        }
    }
}

// Initialize visual effects when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    window.visualEffects = new VisualEffects();
});

// Export for external use
window.VisualEffects = VisualEffects;
