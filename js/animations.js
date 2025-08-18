/**
 * Executive Biography Website - Animation Controller
 * Handles scroll-triggered animations, counters, and visual effects
 */

(function() {
    'use strict';

    // ====================================
    // Animation Configuration
    // ====================================
    
    const animationConfig = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
        counterSpeed: 2000, // Duration for counter animations in ms
        staggerDelay: 100, // Delay between staggered animations in ms
    };

    let animationObserver = null;
    let counterObserver = null;
    let hasReducedMotion = false;

    // ====================================
    // Initialize Animations
    // ====================================
    
    function initializeScrollAnimations() {
        // Check for reduced motion preference
        hasReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (hasReducedMotion) {
            // Show all elements immediately for users who prefer reduced motion
            showAllElements();
            return;
        }

        setupIntersectionObserver();
        setupCounterObserver();
        setupParallaxEffects();
        setupHoverEffects();
        
        console.log('Scroll animations initialized');
    }

    // ====================================
    // Intersection Observer Setup
    // ====================================
    
    function setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) {
            // Fallback for browsers without IntersectionObserver
            showAllElements();
            return;
        }

        animationObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Add staggered delay for multiple elements
                    setTimeout(() => {
                        triggerAnimation(entry.target);
                    }, index * animationConfig.staggerDelay);
                    
                    // Unobserve element after animation to improve performance
                    animationObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: animationConfig.threshold,
            rootMargin: animationConfig.rootMargin
        });

        // Observe all elements that should animate on scroll
        const elementsToAnimate = document.querySelectorAll('.fade-in-on-scroll');
        elementsToAnimate.forEach(element => {
            animationObserver.observe(element);
        });
    }

    // ====================================
    // Counter Animation Observer
    // ====================================
    
    function setupCounterObserver() {
        if (!('IntersectionObserver' in window)) {
            return;
        }

        counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    animateCounter(counter);
                    counterObserver.unobserve(counter);
                }
            });
        }, {
            threshold: 0.5
        });

        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    // ====================================
    // Animation Triggers
    // ====================================
    
    function triggerAnimation(element) {
        element.classList.add('visible');
        
        // Add custom animation classes based on element type
        if (element.classList.contains('timeline-item')) {
            element.style.animationDelay = '0s';
            element.style.animation = 'slideInFromLeft 0.8s ease forwards';
        } else if (element.classList.contains('achievement-card')) {
            element.style.animation = 'bounceInUp 0.6s ease forwards';
        } else if (element.classList.contains('philosophy-card')) {
            element.style.animation = 'fadeInScale 0.7s ease forwards';
        }
        
        // Trigger any custom animations
        triggerCustomAnimations(element);
    }

    function triggerCustomAnimations(element) {
        // Handle special animation cases
        if (element.querySelector('.achievement-icon')) {
            const icon = element.querySelector('.achievement-icon');
            setTimeout(() => {
                icon.style.animation = 'pulse 1s ease-in-out';
            }, 300);
        }
        
        if (element.querySelector('.philosophy-icon')) {
            const icon = element.querySelector('.philosophy-icon');
            setTimeout(() => {
                icon.style.animation = 'rotate360 1s ease-in-out';
            }, 400);
        }
    }

    // ====================================
    // Counter Animations
    // ====================================
    
    function animateCounter(counterElement) {
        const target = parseInt(counterElement.dataset.target);
        const duration = animationConfig.counterSpeed;
        const startTime = performance.now();
        const startValue = 0;

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Use easing function for smooth animation
            const easedProgress = easeOutCubic(progress);
            const currentValue = Math.floor(startValue + (target - startValue) * easedProgress);
            
            counterElement.textContent = formatNumber(currentValue);
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counterElement.textContent = formatNumber(target);
                // Add final animation effect
                counterElement.style.animation = 'countComplete 0.3s ease-in-out';
            }
        }

        requestAnimationFrame(updateCounter);
    }

    // ====================================
    // Parallax Effects
    // ====================================
    
    function setupParallaxEffects() {
        if (hasReducedMotion) return;

        const parallaxElements = document.querySelectorAll('.hero-section, .executive-photo');
        
        if (parallaxElements.length === 0) return;

        const throttledParallax = throttle(() => {
            const scrollTop = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.parallaxSpeed || 0.5;
                const transform = `translateY(${scrollTop * speed}px)`;
                element.style.transform = transform;
            });
        }, 16); // ~60fps

        window.addEventListener('scroll', throttledParallax, { passive: true });
    }

    // ====================================
    // Hover Effects
    // ====================================
    
    function setupHoverEffects() {
        if (hasReducedMotion) return;

        // Enhanced card hover effects
        const cards = document.querySelectorAll('.achievement-card, .philosophy-card, .timeline-content');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.animation = 'cardHover 0.3s ease forwards';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.animation = 'cardHoverOut 0.3s ease forwards';
            });
        });

        // Button ripple effect
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                createRipple(e, this);
            });
        });
    }

    // ====================================
    // Utility Functions
    // ====================================
    
    function createRipple(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    function showAllElements() {
        const elements = document.querySelectorAll('.fade-in-on-scroll, .fade-in, .fade-in-delay');
        elements.forEach(element => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }

    function formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        }
        return num.toString();
    }

    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ====================================
    // Counter Animation Completion Effect
    // ====================================
    
    function initializeCounterAnimations() {
        // This function is called from main.js
        // Counter setup is handled in setupCounterObserver
    }

    // ====================================
    // Dynamic CSS for Animations
    // ====================================
    
    function injectAnimationStyles() {
        const animationStyles = `
            <style>
                @keyframes slideInFromLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes bounceInUp {
                    0% {
                        opacity: 0;
                        transform: translateY(50px) scale(0.8);
                    }
                    60% {
                        opacity: 1;
                        transform: translateY(-10px) scale(1.05);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                
                @keyframes fadeInScale {
                    from {
                        opacity: 0;
                        transform: scale(0.8);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                
                @keyframes pulse {
                    0%, 100% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.1);
                    }
                }
                
                @keyframes rotate360 {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
                
                @keyframes countComplete {
                    0% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.1);
                    }
                    100% {
                        transform: scale(1);
                    }
                }
                
                @keyframes cardHover {
                    to {
                        transform: translateY(-10px) scale(1.02);
                        box-shadow: 0 20px 40px rgba(0,0,0,0.2);
                    }
                }
                
                @keyframes cardHoverOut {
                    to {
                        transform: translateY(0) scale(1);
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    }
                }
                
                @keyframes ripple {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
                
                /* Smooth transitions for all animated elements */
                .fade-in-on-scroll {
                    transition: opacity 0.6s ease, transform 0.6s ease;
                }
                
                .counter {
                    font-variant-numeric: tabular-nums;
                }
                
                /* Ensure animations respect reduced motion preferences */
                @media (prefers-reduced-motion: reduce) {
                    * {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                    }
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', animationStyles);
    }

    // ====================================
    // Performance Monitoring
    // ====================================
    
    function monitorAnimationPerformance() {
        if ('performance' in window && 'PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (entry.duration > 16) {
                        console.warn(`Animation frame took ${entry.duration}ms (should be <16ms)`);
                    }
                });
            });
            
            observer.observe({entryTypes: ['measure']});
        }
    }

    // ====================================
    // Cleanup and Memory Management
    // ====================================
    
    function cleanup() {
        if (animationObserver) {
            animationObserver.disconnect();
        }
        if (counterObserver) {
            counterObserver.disconnect();
        }
    }

    // ====================================
    // Public API
    // ====================================
    
    window.AnimationController = {
        init: initializeScrollAnimations,
        initCounters: initializeCounterAnimations,
        cleanup: cleanup,
        triggerAnimation: triggerAnimation,
        animateCounter: animateCounter
    };

    // ====================================
    // Auto-initialization
    // ====================================
    
    // Inject animation styles immediately
    injectAnimationStyles();
    
    // Monitor performance in development
    if (window.location.hostname === 'localhost' || window.location.hostname.includes('replit')) {
        monitorAnimationPerformance();
    }
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', cleanup);

})();

// ====================================
// Export for module systems (if needed)
// ====================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeScrollAnimations,
        initializeCounterAnimations
    };
}
