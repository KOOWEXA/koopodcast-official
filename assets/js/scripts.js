/* ============================================
   KOOPODCAST - Premium Scripts v2.0
   Optimizaciones: PWA, Rendimiento, Accesibilidad
   ============================================ */

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

// Inicialización principal de la aplicación
function initializeApp() {
    // Elementos del DOM
    const body = document.body;
    const header = document.querySelector('.header');
    const themeButtons = document.querySelectorAll('.theme-btn');
    const videoCards = document.querySelectorAll('.video-card');
    const modal = document.getElementById('video-modal');
    const closeModal = document.getElementById('close-modal');
    const playerContainer = document.getElementById('player-container');
    const yearSpan = document.getElementById('year');

    // Establecer año actual
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- SISTEMA DE TEMAS ---
    initThemeSystem(body, themeButtons);

    // --- SISTEMA DE VIDEOS ---
    initVideoSystem(videoCards, modal, closeModal, playerContainer);

    // --- EFECTOS DE SCROLL ---
    initScrollEffects(header);

    // --- ACCESIBILIDAD ---
    initAccessibility(videoCards, closeModal, modal);

    // --- PWA Y SERVICE WORKER ---
    initPWA();

    // --- OPTIMIZACIONES DE RENDIMIENTO ---
    initPerformanceOptimizations();

    console.log('✓ KOOPODCAST Platform Initialized Successfully');
}

/* ============================================
   SISTEMA DE TEMAS
   ============================================ */

function initThemeSystem(body, themeButtons) {
    // Cargar tema guardado o usar el predeterminado
    const savedTheme = localStorage.getItem('koopodcast-theme') || 'standard';
    applyTheme(savedTheme, body, themeButtons);

    // Event listeners para botones de tema
    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const themeId = btn.getAttribute('data-theme-id');
            applyTheme(themeId, body, themeButtons);
        });
    });
}

function applyTheme(themeId, body, themeButtons) {
    // Aplicar tema al body
    body.setAttribute('data-theme', themeId);
    localStorage.setItem('koopodcast-theme', themeId);

    // Actualizar estado de botones
    themeButtons.forEach(btn => {
        const isActive = btn.getAttribute('data-theme-id') === themeId;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', isActive);
    });

    // Emitir evento personalizado
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: themeId } }));
}

/* ============================================
   SISTEMA DE VIDEOS
   ============================================ */

function initVideoSystem(videoCards, modal, closeModal, playerContainer) {
    // Event listeners para tarjetas de video
    videoCards.forEach(card => {
        card.addEventListener('click', () => playVideo(card, modal, playerContainer));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                playVideo(card, modal, playerContainer);
            }
        });
    });

    // Cerrar modal
    if (closeModal) {
        closeModal.addEventListener('click', () => closeVideo(modal, playerContainer));
    }

    // Cerrar modal al hacer clic fuera
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeVideo(modal, playerContainer);
            }
        });
    }

    // Cerrar con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeVideo(modal, playerContainer);
        }
    });
}

function playVideo(card, modal, playerContainer) {
    const videoId = card.getAttribute('data-video-id');
    if (!videoId) return;

    // Crear iframe con parámetros optimizados
    playerContainer.innerHTML = `
        <iframe 
            src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&fs=1&controls=1" 
            title="Reproductor de video de YouTube" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowfullscreen
            loading="lazy">
        </iframe>
    `;

    // Mostrar modal
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Enfocar el botón de cerrar para accesibilidad
    setTimeout(() => {
        document.getElementById('close-modal').focus();
    }, 100);
}

function closeVideo(modal, playerContainer) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    playerContainer.innerHTML = '';
    document.body.style.overflow = 'auto';
}

/* ============================================
   EFECTOS DE SCROLL
   ============================================ */

function initScrollEffects(header) {
    let lastScrollTop = 0;
    let scrollTimer = null;

    window.addEventListener('scroll', () => {
        // Debounce para mejorar rendimiento
        if (scrollTimer) clearTimeout(scrollTimer);

        scrollTimer = setTimeout(() => {
            const currentScroll = window.pageYOffset;

            // Efecto de sombra al hacer scroll
            if (currentScroll > 0) {
                header.style.boxShadow = '0 4px 12px rgba(15, 28, 63, 0.08)';
            } else {
                header.style.boxShadow = 'none';
            }

            lastScrollTop = currentScroll;
        }, 50);
    }, { passive: true });
}

/* ============================================
   ACCESIBILIDAD
   ============================================ */

function initAccessibility(videoCards, closeModal, modal) {
    // Asegurar que las tarjetas de video sean accesibles por teclado
    videoCards.forEach(card => {
        if (!card.hasAttribute('tabindex')) {
            card.setAttribute('tabindex', '0');
        }
    });

    // Mejorar navegación por teclado en el modal
    if (modal) {
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const focusableElements = modal.querySelectorAll('button, [href], iframe');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }

    // Anunciar cambios dinámicos a lectores de pantalla
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'aria-hidden') {
                const element = mutation.target;
                const isHidden = element.getAttribute('aria-hidden') === 'true';
                if (!isHidden) {
                    // Anunciar que el modal se abrió
                    announceToScreenReader('Modal de video abierto');
                }
            }
        });
    });

    if (modal) {
        observer.observe(modal, { attributes: true });
    }
}

function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);

    setTimeout(() => {
        announcement.remove();
    }, 1000);
}

/* ============================================
   PWA - PROGRESSIVE WEB APP
   ============================================ */

function initPWA() {
    // Registrar Service Worker si está disponible
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('✓ Service Worker registrado:', registration);
            })
            .catch(error => {
                console.log('Service Worker no disponible:', error);
            });
    }

    // Detectar instalación de PWA
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        // Aquí se podría mostrar un botón de instalación personalizado
        console.log('PWA lista para instalar');
    });

    // Detectar si la app fue instalada
    window.addEventListener('appinstalled', () => {
        console.log('✓ PWA instalada exitosamente');
    });
}

/* ============================================
   OPTIMIZACIONES DE RENDIMIENTO
   ============================================ */

function initPerformanceOptimizations() {
    // Lazy loading de imágenes
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Precargar recursos críticos
    preloadCriticalResources();

    // Monitorear Core Web Vitals
    monitorWebVitals();
}

function preloadCriticalResources() {
    // Precargar fuentes críticas
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap';
    document.head.appendChild(link);
}

function monitorWebVitals() {
    // Medir Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
        try {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    console.log('LCP:', entry.renderTime || entry.loadTime);
                }
            });
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
            console.log('PerformanceObserver no soportado');
        }
    }
}

/* ============================================
   SMOOTH SCROLL PARA ENLACES INTERNOS
   ============================================ */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/* ============================================
   UTILIDADES
   ============================================ */

// Detectar soporte de características
function checkBrowserSupport() {
    return {
        serviceWorker: 'serviceWorker' in navigator,
        intersectionObserver: 'IntersectionObserver' in window,
        customElements: 'customElements' in window,
        fetch: 'fetch' in window,
        localStorage: typeof(Storage) !== 'undefined'
    };
}

// Exportar para debugging
window.koopodcast = {
    checkBrowserSupport,
    applyTheme,
    playVideo,
    closeVideo
};
