/* KOOPODCAST - Scripts Oficiales */

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');
    const currentYear = document.getElementById('currentYear');
    const profileCards = document.querySelectorAll('.profile-card');

    // Set current year
    if (currentYear) currentYear.textContent = new Date().getFullYear();

    // Menu Toggle Logic
    const toggleMenu = () => {
        navLinks.classList.toggle('active');
        const expanded = navLinks.classList.contains('active');
        menuToggle.setAttribute('aria-expanded', expanded);
        const icon = menuToggle.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
    };

    const closeMenu = () => {
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        const icon = menuToggle.querySelector('i');
        if (icon) {
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        }
    };

    // Smooth Scroll
    const initSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    if (navLinks.classList.contains('active')) closeMenu();
                }
            });
        });
    };

    // Intersection Observer for Animations
    const initIntersectionObserver = () => {
        if (!('IntersectionObserver' in window)) return;
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        profileCards.forEach(card => observer.observe(card));
    };

    // Scroll Header Effect
    const initScrollHeader = () => {
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            const header = document.querySelector('.header');
            if (!header) return;

            if (currentScroll <= 0) {
                header.style.boxShadow = 'none';
                header.style.transform = 'translateY(0)';
            } else if (currentScroll > lastScroll && currentScroll > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
                header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
            }
            lastScroll = currentScroll;
        });
    };

    // Security Features
    const initSecurity = () => {
        // Prevent right click
        document.addEventListener('contextmenu', e => {
            e.preventDefault();
            return false;
        });

        // Prevent some keyboard shortcuts
        document.addEventListener('keydown', e => {
            // F12 or Ctrl+Shift+I
            if ((e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) || (e.key === 'F12')) {
                e.preventDefault();
                return false;
            }
            // Ctrl+U (View Source) or Ctrl+Shift+J (Console)
            if ((e.ctrlKey && (e.key === 'U' || e.key === 'u')) || (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j'))) {
                e.preventDefault();
                return false;
            }
        });

        // Prevent image dragging
        document.addEventListener('dragstart', e => {
            if (e.target.tagName === 'IMG') {
                e.preventDefault();
                return false;
            }
        });
    };

    // Theme Detection
    const initThemeDetection = () => {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        const setTheme = (isDark) => {
            document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        };
        setTheme(prefersDark.matches);
        prefersDark.addEventListener('change', e => setTheme(e.matches));
    };

    // Initialization calls
    if (menuToggle) menuToggle.addEventListener('click', toggleMenu);
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    initSmoothScroll();
    initIntersectionObserver();
    initScrollHeader();
    initSecurity();
    initThemeDetection();

    console.log('KOOPODCAST plataforma cargada y optimizada');
});
