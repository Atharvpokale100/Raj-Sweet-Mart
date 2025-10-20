// Global variables
let isMenuOpen = false;
let isThemeAnimating = false; // Flag to prevent multiple theme animations

// Mobile menu functionality
function toggleMobileMenu() {
    console.log('toggleMobileMenu called, current isMenuOpen:', isMenuOpen);
    isMenuOpen = !isMenuOpen;
    const mobileNav = document.getElementById('mobile-nav');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
    const menuIcon = document.getElementById('menu-icon');
    const body = document.body;

    console.log('Elements found:', { mobileNav, mobileNavOverlay, menuIcon, body });

    if (isMenuOpen) {
        console.log('Opening mobile menu');
        mobileNav.classList.add('active');
        mobileNavOverlay.classList.add('active');
        body.classList.add('mobile-menu-open');
        menuIcon.textContent = '✕';
        menuIcon.classList.remove('pop');
        void menuIcon.offsetWidth; // force reflow to restart animation
        menuIcon.classList.add('pop');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
        console.log('Closing mobile menu');
        mobileNav.classList.remove('active');
        mobileNavOverlay.classList.remove('active');
        body.classList.remove('mobile-menu-open');
        menuIcon.textContent = '☰';
        menuIcon.classList.remove('pop');
        void menuIcon.offsetWidth;
        menuIcon.classList.add('pop');
        document.body.style.overflow = ''; // Restore scrolling
    }

    console.log('Menu state after toggle:', isMenuOpen);
}

// Set active navigation item based on current page
function setActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-button, .mobile-nav-link');

    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPage = link.getAttribute('href').split('/').pop();

        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Navbar scroll effect
function handleNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Create floating particles
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return; // Only create particles if container exists

    const particleCount = 20;

    // Clear existing particles
    particlesContainer.innerHTML = '';

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // Random positioning
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';

        // Random animation delay and duration
        particle.style.animationDelay = Math.random() * 3 + 's';
        particle.style.animationDuration = (3 + Math.random() * 4) + 's';

        particlesContainer.appendChild(particle);
    }
}

// Close mobile menu when clicking on links
function handleMobileNavClick() {
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) {
                toggleMobileMenu();
            }
        });
    });
}

// Initialize application
function initializeApp() {
    // Set active navigation
    setActiveNavigation();

    // Create particles (only on home page)
    createParticles();

    // Add scroll event listener for navbar
    window.addEventListener('scroll', handleNavbarScroll);

    // Handle mobile navigation clicks
    handleMobileNavClick();

    // Add keyboard navigation support
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && isMenuOpen) {
            toggleMobileMenu();
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function (e) {
        const mobileNav = document.getElementById('mobile-nav');
        const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');

        if (isMenuOpen && mobileNav && mobileMenuBtn &&
            !mobileNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            toggleMobileMenu();
        }

        // Close menu when clicking on overlay
        if (isMenuOpen && mobileNavOverlay && e.target === mobileNavOverlay) {
            toggleMobileMenu();
        }
    });
}

// Utility functions
const utils = {
    // Debounce function for performance optimization
    debounce: function (func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Check if element is in viewport
    isInViewport: function (element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Animate elements on scroll (optional enhancement)
    animateOnScroll: function () {
        const cards = document.querySelectorAll('.card, .feature-card');
        cards.forEach(card => {
            if (utils.isInViewport(card)) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }
        });
    }
};

// Enhanced scroll handler with debouncing
const debouncedScrollHandler = utils.debounce(function () {
    handleNavbarScroll();
    utils.animateOnScroll();
}, 10);

// Monitor theme changes to identify triggers
function monitorThemeChanges() {
    // Create a MutationObserver to watch for theme class changes
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                if (mutation.target.classList.contains('dark-theme')) {
                    console.log('Dark theme detected - Trigger:', new Error().stack);
                } else {
                    console.log('Light theme detected - Trigger:', new Error().stack);
                }
            }
        });
    });

    // Start observing the body element
    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
    });
}

// Unified theme toggle logic
function initializeThemeToggle() {
    const themeBtn = document.getElementById('themeToggleBtn');
    const body = document.body;
    const html = document.documentElement;

    // Load saved theme on page load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        html.classList.add('dark-theme');
        setThemeIcon(true);
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const isDark = !body.classList.contains('dark-theme');
            
            // Toggle classes on both html and body
            body.classList.toggle('dark-theme');
            html.classList.toggle('dark-theme');
            
            // Save theme preference
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            
            // Update icon
            setThemeIcon(isDark);
            
            // Apply theme animation
            applyTheme(isDark);
        });
    }
}

// Update the theme icon function
function setThemeIcon(isDark) {
    const btn = document.getElementById('themeToggleBtn');
    if (!btn) return;
    
    // Clear existing content and add new icon
    btn.innerHTML = isDark 
        ? '<i class="fas fa-sun"></i>' 
        : '<i class="fas fa-moon"></i>';
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded, initializing...');

    // Initialize theme toggle first
    initializeThemeToggle();

    // Monitor theme changes
    monitorThemeChanges();

    initializeApp();

    // Initialize scroll handling separately
    handleScrollEvents();

    // HOMEPAGE SEARCH FUNCTIONALITY
    const searchInput = document.getElementById('navSearchInput');
    const sweetItems = document.querySelectorAll('.sweet-item');
    if (searchInput && sweetItems.length > 0) {
        searchInput.addEventListener('input', function () {
            const query = this.value.trim().toLowerCase();
            sweetItems.forEach(item => {
                const name = item.dataset.name ? item.dataset.name.toLowerCase() : '';
                if (name.includes(query)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    console.log('Initialization complete');
});

// Handle window resize for responsive behavior
window.addEventListener('resize', utils.debounce(function () {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 767 && isMenuOpen) {
        toggleMobileMenu();
    }

    // Recreate particles on resize (only if particles container exists)
    if (document.getElementById('particles')) {
        createParticles();
    }
}, 250));

// Export functions for potential external use
window.RajSweetMart = {
    toggleMobileMenu,
    createParticles,
    setActiveNavigation,
    utils
};

// THEME TOGGLE LOGIC
function applyTheme(isDark) {
    // Prevent multiple theme animations
    if (isThemeAnimating) {
        console.log('Theme animation already in progress, ignoring...');
        return;
    }

    // Additional check to ensure this is a deliberate theme change
    if (!document.body.classList.contains('dark-theme') && !isDark) {
        console.log('Already in light theme, ignoring...');
        return;
    }

    if (document.body.classList.contains('dark-theme') && isDark) {
        console.log('Already in dark theme, ignoring...');
        return;
    }

    console.log('Starting theme animation:', isDark ? 'dark' : 'light');
    isThemeAnimating = true;

    // Get button position for animation origin
    const themeBtn = document.getElementById('themeToggleBtn');
    let mouseX = '50%';
    let mouseY = '50%';

    if (themeBtn) {
        const rect = themeBtn.getBoundingClientRect();
        mouseX = rect.left + rect.width / 2;
        mouseY = rect.top + rect.height / 2;
    }

    // Create or get transition overlay
    let overlay = document.querySelector('.theme-transition-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'theme-transition-overlay';
        document.body.appendChild(overlay);
    }

    // Set animation origin
    overlay.style.setProperty('--mouse-x', mouseX + 'px');
    overlay.style.setProperty('--mouse-y', mouseY + 'px');

    // Get all elements that will be affected by the wave
    const waveElements = document.querySelectorAll('.sweet-item, .contact-card, .testimonial-card, .faq-item, h1, h2, h3, h4, h5, h6, p, .sweet-name, .sweet-price, .sweet-description');

    // Calculate distances from click point for staggered animation
    waveElements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const elementCenterX = rect.left + rect.width / 2;
        const elementCenterY = rect.top + rect.height / 2;

        const distance = Math.sqrt(
            Math.pow(elementCenterX - mouseX, 2) +
            Math.pow(elementCenterY - mouseY, 2)
        );

        // Add wave effect class and set delay based on distance
        element.classList.add('wave-effect');
        const delay = Math.min(distance / 1000, 1.2); // Max 1.2s delay
        element.style.transitionDelay = delay + 's';
        // Temporarily change opacity during wave
        setTimeout(() => {
            element.style.opacity = '0.3';
            element.style.transform = 'scale(0.95)';
        }, delay * 1000);

        // Restore element after wave passes
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
            element.style.transitionDelay = '0s';
        }, (delay + 0.6) * 1000);
    });

    // Start animation
    if (isDark) {
        overlay.className = 'theme-transition-overlay dark';
    } else {
        overlay.className = 'theme-transition-overlay light';
    }

    // Apply theme after animation starts
    setTimeout(() => {
        document.body.classList.toggle('dark-theme', isDark);
        setThemeIcon(isDark);
    }, 200);

    // Remove overlay and clean up after animation completes
    setTimeout(() => {
        if (overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }

        // Clean up wave effects
        waveElements.forEach(element => {
            element.classList.remove('wave-effect');
            element.style.transitionDelay = '';
            element.style.opacity = '';
            element.style.transform = '';
        });

        // Reset animation flag
        isThemeAnimating = false;
        console.log('Theme animation completed');
    }, 1400);
}

// Smooth scrolling
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for navbar height

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Smooth scroll to top functionality
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top-btn';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #ff6b6b, #ff8e53);
        color: white;
        border: none;
        cursor: pointer;
        font-size: 1.2rem;
        box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
        transition: all 0.3s ease;
        opacity: 0;
        visibility: hidden;
        z-index: 1000;
    `;

    document.body.appendChild(scrollToTopBtn);

    // Show/hide scroll to top button
    window.addEventListener('scroll', function () {
        if (window.scrollY > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    });

    // Scroll to top functionality
    scrollToTopBtn.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Enhanced scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animateElements = document.querySelectorAll('.sweet-item, .contact-card, .testimonial-card, .faq-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Smooth scroll function
function smoothScroll(target, duration = 800) {
    const targetElement = document.querySelector(target);
    if (!targetElement) return;

    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    // Easing function
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

// Apply smooth scroll to all internal links
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            smoothScroll(target);
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('backgroundVideo');
    const videoControl = document.getElementById('videoControl');
    const videoLoading = document.getElementById('videoLoading');
    
    if (!video) return;
    
    // Video loading states
    video.addEventListener('loadstart', function() {
        videoLoading.classList.remove('hidden');
    });
    
    video.addEventListener('canplay', function() {
        videoLoading.classList.add('hidden');
    });
    
    video.addEventListener('error', function() {
        console.log('Video failed to load, using fallback background');
        videoLoading.classList.add('hidden');
        // Fallback background will be visible
    });
    
    // Play/Pause control
    videoControl.addEventListener('click', function() {
        if (video.paused) {
            video.play().then(() => {
                videoControl.innerHTML = '<i class="fas fa-pause"></i>';
                videoControl.title = 'Pause Video';
            }).catch(e => {
                console.log('Play failed:', e);
            });
        } else {
            video.pause();
            videoControl.innerHTML = '<i class="fas fa-play"></i>';
            videoControl.title = 'Play Video';
        }
    });
    
    // Handle page visibility change
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            video.pause();
        } else if (!video.paused) {
            video.play().catch(e => {
                console.log('Auto-play prevented:', e);
            });
        }
    });
    
    // Intersection Observer for performance
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (video.paused) {
                    video.play().catch(e => {
                        console.log('Auto-play prevented:', e);
                    });
                }
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.1 });
    
    observer.observe(video);
    
    // Auto-hide control after 5 seconds
    setTimeout(function() {
        videoControl.style.opacity = '0.3';
    }, 5000);
    
    // Show control on hover
    videoControl.addEventListener('mouseenter', function() {
        this.style.opacity = '1';
    });
    
    videoControl.addEventListener('mouseleave', function() {
        setTimeout(() => {
            this.style.opacity = '0.3';
        }, 2000);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.bg-slide');
    let currentSlide = 0;
    
    function nextSlide() {
        // Remove active class from current slide
        slides[currentSlide].classList.remove('active');
        
        // Move to next slide
        currentSlide = (currentSlide + 1) % slides.length;
        
        // Add active class to new slide
        slides[currentSlide].classList.add('active');
        
        // Apply Ken Burns effect
        slides[currentSlide].style.animation = 'kenBurns 8s ease-in-out forwards';
    }

    // Set first slide as active
    slides[0].classList.add('active');
    
    // Change slide every 5 seconds
    setInterval(nextSlide, 5000);
});