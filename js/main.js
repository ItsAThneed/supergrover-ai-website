/**
 * Executive Biography Website - Main JavaScript
 * Handles core functionality, smooth scrolling, and user interactions
 */

(function() {
    'use strict';

    // ====================================
    // Global Variables
    // ====================================
    
    let isScrolling = false;
    let currentSection = 'home';
    
    // ====================================
    // DOM Ready Initialization
    // ====================================
    
    document.addEventListener('DOMContentLoaded', function() {
        initializeWebsite();
    });

    // ====================================
    // Main Initialization Function
    // ====================================
    
    function initializeWebsite() {
        try {
            setupSmoothScrolling();
            setupNavigation();
            setupScrollIndicator();
            setupFormHandling();
            setupPerformanceOptimizations();
            setupAccessibility();
            
            // Initialize animations after a brief delay to ensure DOM is fully rendered
            setTimeout(() => {
                initializeScrollAnimations();
                initializeCounterAnimations();
            }, 100);
            
            console.log('Executive Biography Website initialized successfully');
        } catch (error) {
            console.error('Error initializing website:', error);
            // Graceful degradation - basic functionality should still work
        }
    }

    // ====================================
    // Smooth Scrolling Implementation
    // ====================================
    
    function setupSmoothScrolling() {
        const smoothScrollLinks = document.querySelectorAll('.smooth-scroll');
        
        smoothScrollLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    scrollToElement(targetElement);
                    updateActiveNavLink(targetId);
                }
            });
        });
    }

    function scrollToElement(element) {
        if (isScrolling) return;
        
        isScrolling = true;
        const offsetTop = element.offsetTop - 80; // Account for fixed navbar
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
        
        // Reset scrolling flag after animation completes
        setTimeout(() => {
            isScrolling = false;
        }, 1000);
    }

    // ====================================
    // Navigation Management
    // ====================================
    
    function setupNavigation() {
        const navbar = document.querySelector('.navbar');
        let lastScrollTop = 0;
        
        // Handle navbar background on scroll
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add/remove background based on scroll position
            if (scrollTop > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Update active navigation based on section in view
            updateActiveNavOnScroll();
            
            lastScrollTop = scrollTop;
        }, { passive: true });
        
        // Handle mobile menu close on link click
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                }
            });
        });
    }

    function updateActiveNavLink(targetId) {
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === targetId) {
                link.classList.add('active');
            }
        });
        
        currentSection = targetId.substring(1); // Remove # from targetId
    }

    function updateActiveNavOnScroll() {
        if (isScrolling) return;
        
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 150; // Offset for better detection
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                if (currentSection !== sectionId) {
                    updateActiveNavLink('#' + sectionId);
                }
            }
        });
    }

    // ====================================
    // Scroll Indicator Management
    // ====================================
    
    function setupScrollIndicator() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', function() {
                const aboutSection = document.querySelector('#about');
                if (aboutSection) {
                    scrollToElement(aboutSection);
                }
            });
            
            // Hide scroll indicator after user scrolls
            let hideTimer;
            window.addEventListener('scroll', function() {
                clearTimeout(hideTimer);
                hideTimer = setTimeout(() => {
                    if (window.scrollY > 200) {
                        scrollIndicator.style.opacity = '0';
                        scrollIndicator.style.pointerEvents = 'none';
                    }
                }, 100);
            }, { passive: true });
        }
    }

    // ====================================
    // Form Handling (Future Enhancement)
    // ====================================
    
    function setupFormHandling() {
        // Contact form handling - ready for future implementation
        const contactLinks = document.querySelectorAll('a[href^="mailto:"]');
        
        contactLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Track contact attempts (analytics placeholder)
                trackEvent('contact', 'email_click', this.href);
            });
        });
        
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
        
        phoneLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Track contact attempts (analytics placeholder)
                trackEvent('contact', 'phone_click', this.href);
            });
        });
    }

    // ====================================
    // Performance Optimizations
    // ====================================
    
    function setupPerformanceOptimizations() {
        // Lazy loading for images (if any are added later)
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.add('loaded');
                            observer.unobserve(img);
                        }
                    }
                });
            });
            
            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => imageObserver.observe(img));
        }
        
        // Preload critical assets
        preloadCriticalAssets();
    }

    function preloadCriticalAssets() {
        const criticalAssets = [
            'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Source+Sans+Pro:wght@300;400;600&display=swap'
        ];
        
        criticalAssets.forEach(asset => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = asset;
            document.head.appendChild(link);
        });
    }

    // ====================================
    // Accessibility Enhancements
    // ====================================
    
    function setupAccessibility() {
        // Keyboard navigation support
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', function() {
            document.body.classList.remove('keyboard-navigation');
        });
        
        // Skip link functionality
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link sr-only';
        skipLink.textContent = 'Skip to main content';
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const mainContent = document.querySelector('#about') || document.querySelector('main');
            if (mainContent) {
                mainContent.focus();
                scrollToElement(mainContent);
            }
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Enhanced focus indicators
        const focusableElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
        
        focusableElements.forEach(element => {
            element.addEventListener('focus', function() {
                this.classList.add('focused');
            });
            
            element.addEventListener('blur', function() {
                this.classList.remove('focused');
            });
        });
    }

    // ====================================
    // Utility Functions
    // ====================================
    
    function debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
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
    
    function trackEvent(category, action, label) {
        // Analytics tracking placeholder
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label
            });
        }
        
        console.log(`Event tracked: ${category} - ${action} - ${label}`);
    }

    // ====================================
    // Error Handling and Fallbacks
    // ====================================
    
    window.addEventListener('error', function(e) {
        console.error('JavaScript error:', e.error);
        // Implement error reporting here if needed
    });
    
    // Fallback for browsers without smooth scroll support
    if (!('scrollBehavior' in document.documentElement.style)) {
        // Polyfill or alternative implementation
        console.warn('Smooth scrolling not supported, using fallback');
    }
    
    // ====================================
    // Public API (if needed for external integration)
    // ====================================
    
    window.ExecutiveBio = {
        scrollToSection: function(sectionId) {
            const section = document.querySelector(sectionId);
            if (section) {
                scrollToElement(section);
                updateActiveNavLink(sectionId);
            }
        },
        
        getCurrentSection: function() {
            return currentSection;
        },
        
        trackEvent: trackEvent
    };

})();

// ====================================
// Additional CSS for JavaScript enhancements
// ====================================

// Add dynamic styles for enhanced interactions
const dynamicStyles = `
    <style>
        .skip-link {
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-color);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 1000;
            transition: top 0.3s;
        }
        
        .skip-link:focus {
            top: 6px;
        }
        
        .keyboard-navigation *:focus {
            outline: 3px solid var(--accent-color) !important;
            outline-offset: 2px !important;
        }
        
        .focused {
            box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.3) !important;
        }
        
        .navbar.scrolled {
            background-color: rgba(44, 62, 80, 0.95) !important;
            backdrop-filter: blur(10px);
        }
        
        img.loaded {
            opacity: 1;
            transition: opacity 0.3s ease;
        }
        
        img[data-src] {
            opacity: 0;
        }
        
        @media (prefers-reduced-motion: reduce) {
            .skip-link {
                transition: none;
            }
        }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', dynamicStyles);
