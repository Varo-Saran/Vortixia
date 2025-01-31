(function () {
     // Add setupHamburgerMenu function
     function setupHamburgerMenu() {
        const hamburger = document.querySelector('.hamburger');
        const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
        const submenuTriggers = document.querySelectorAll('.mobile-submenu-trigger');
        const backButtons = document.querySelectorAll('.mobile-back-button');
        const mobileThemeToggle = document.querySelector('.mobile-theme-toggle');

        // Use passive event listeners for better performance
        hamburger?.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileNavOverlay?.classList.toggle('active');
            document.body.style.overflow = hamburger.classList.contains('active') ? 'hidden' : '';
            
            if (!hamburger.classList.contains('active')) {
                document.querySelectorAll('.mobile-nav-right.active, .mobile-submenu.active')
                    .forEach(el => el.classList.remove('active'));
            }
        }, { passive: true });

        // Use event delegation for submenu triggers
        document.addEventListener('click', (e) => {
            // Close on overlay click
            if (e.target === mobileNavOverlay) {
                hamburger?.classList.remove('active');
                mobileNavOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }

            // Submenu trigger handling
            if (e.target.closest('.mobile-submenu-trigger')) {
                const trigger = e.target.closest('.mobile-submenu-trigger');
                const submenuId = trigger.getAttribute('data-submenu');
                const targetSubmenu = document.querySelector(`.mobile-submenu[data-submenu="${submenuId}"]`);
                const mobileNavRight = document.querySelector('.mobile-nav-right');

                if (targetSubmenu && mobileNavRight) {
                    mobileNavRight.classList.add('active');
                    document.querySelectorAll('.mobile-submenu.active')
                        .forEach(el => el.classList.remove('active'));
                    targetSubmenu.classList.add('active');
                }
            }

            // Back button handling
            if (e.target.closest('.mobile-back-button')) {
                const button = e.target.closest('.mobile-back-button');
                const currentSubmenu = button.closest('.mobile-submenu');
                const mobileNavRight = document.querySelector('.mobile-nav-right');
                
                if (currentSubmenu) {
                    currentSubmenu.classList.remove('active');
                    const parentTrigger = document.querySelector(`[data-submenu="${currentSubmenu.getAttribute('data-submenu')}"]`);
                    const parentSubmenu = parentTrigger?.closest('.mobile-submenu');
                    
                    if (parentSubmenu) {
                        parentSubmenu.classList.add('active');
                    } else {
                        mobileNavRight?.classList.remove('active');
                    }
                }
            }
        }, { passive: true });

        // ESC key handler
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNavOverlay?.classList.contains('active')) {
                hamburger?.classList.remove('active');
                mobileNavOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Theme toggle sync
        mobileThemeToggle?.addEventListener('click', () => {
            document.querySelector('.theme-toggle')?.click();
        }, { passive: true });
    }

    // Throttle function to limit the rate at which a function can fire
    function throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
        };
    }

    // Optimize scroll events
    function optimizeScroll() {
        const scrollHandler = throttle(() => {
            const scrollY = window.scrollY;

            // Use requestAnimationFrame for smoother animations
            requestAnimationFrame(() => {
                // Parallax effect for hero section
                const heroContent = document.querySelector('.hero .container');
                if (heroContent) {
                    heroContent.style.transform = `translateY(${scrollY * 0.5}px)`;
                }

                // Animate navigation on scroll
                const nav = document.querySelector('.glassy-nav');
                if (nav) {
                    if (window.lastScrollY < scrollY) {
                        gsap.to(nav, { y: '-100%', duration: 0.3 });
                    } else {
                        gsap.to(nav, { y: '0%', duration: 0.3 });
                    }
                    window.lastScrollY = scrollY;
                }
            });
        }, 16); // ~60fps

        window.addEventListener('scroll', scrollHandler, { passive: true });
    }

    // Optimize GSAP animations
    function optimizeGSAPAnimations() {
        ScrollTrigger.config({ limitCallbacks: true });
        ScrollTrigger.clearMatchMedia();
    }

    // Defer non-critical operations
    function deferOperations() {
        // Defer AOS initialization
        setTimeout(() => {
            AOS.init({
                duration: 1000,
                once: true,
                offset: 100,
                disable: 'mobile', // Disable AOS on mobile for better performance
            });
        }, 100);

        // Defer zoom setup (if needed)
        setTimeout(setupZoom, 200);
    }

    // Optimize circle creation
    function optimizeCircles() {
        const createCircles = throttle(() => {
            const heroBackground = document.querySelector('.hero-background');
            if (heroBackground && !heroBackground.querySelector('.circles')) {
                const circlesContainer = document.createElement('div');
                circlesContainer.classList.add('circles');
                const fragment = document.createDocumentFragment();

                // Use a more efficient loop
                const circleCount = window.innerWidth <= 768 ? 8 : 15;
                for (let i = 0; i < circleCount; i++) {
                    const circle = document.createElement('div');
                    const size = Math.random() * (window.innerWidth <= 768 ? 40 : 60) + 10;
                    circle.style.cssText = `
                        width: ${size}px;
                        height: ${size}px;
                        left: ${Math.random() * 100}%;
                        animation-duration: ${Math.random() * 10 + 5}s;
                        animation-delay: ${Math.random() * 5}s;
                    `;
                    fragment.appendChild(circle);
                }

                circlesContainer.appendChild(fragment);
                heroBackground.appendChild(circlesContainer);
            }
        }, 100);

        createCircles();
        window.addEventListener('resize', createCircles, { passive: true });
    }

    // Zoom functionality (if needed)
    function setupZoom() {
        const zoomableElements = document.querySelectorAll('.service-card, .project-card, .hero h1, .hero p');
        const overlay = document.createElement('div');
        overlay.classList.add('overlay');
        document.body.appendChild(overlay);

        zoomableElements.forEach((element) => {
            element.classList.add('zoomable');
            element.addEventListener('click', () => {
                if (!element.classList.contains('zoomed')) {
                    element.classList.add('zoomed');
                    overlay.style.display = 'block';
                } else {
                    element.classList.remove('zoomed');
                    overlay.style.display = 'none';
                }
            });
        });

        overlay.addEventListener('click', () => {
            const zoomedElement = document.querySelector('.zoomed');
            if (zoomedElement) {
                zoomedElement.classList.remove('zoomed');
                overlay.style.display = 'none';
            }
        });
    }

    // Main optimization function
    function runOptimizations() {
        setupHamburgerMenu();
        optimizeScroll();
        optimizeGSAPAnimations();
        deferOperations();
        optimizeCircles();
    }

    // Run optimizations when the page is loaded
    if (document.readyState === 'complete') {
        runOptimizations();
    } else {
        window.addEventListener('load', runOptimizations);
    }
})();