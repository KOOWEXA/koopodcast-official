document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos del DOM ---
    const body = document.body;
    const header = document.querySelector('.header');
    const themeButtons = document.querySelectorAll('.theme-btn');
    const videoCards = document.querySelectorAll('.video-card');
    const modal = document.getElementById('video-modal');
    const closeModal = document.getElementById('close-modal');
    const playerContainer = document.getElementById('player-container');

    // --- Lógica de Temas ---
    const savedTheme = localStorage.getItem('koopodcast-theme') || 'standard';
    setTheme(savedTheme);

    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const themeId = btn.getAttribute('data-theme-id');
            setTheme(themeId);
        });
    });

    function setTheme(themeId) {
        body.setAttribute('data-theme', themeId);
        localStorage.setItem('koopodcast-theme', themeId);
        themeButtons.forEach(btn => {
            const isActive = btn.getAttribute('data-theme-id') === themeId;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-pressed', isActive);
        });
    }

    // --- Lógica de Video Modal ---
    videoCards.forEach(card => {
        card.addEventListener('click', () => {
            const videoId = card.getAttribute('data-video-id');
            openVideo(videoId);
        });
    });

    function openVideo(videoId) {
        playerContainer.innerHTML = `
            <iframe 
                src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1" 
                title="YouTube video player" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
        `;
        modal.style.display = 'flex';
        body.style.overflow = 'hidden';
    }

    function closeVideo() {
        modal.style.display = 'none';
        playerContainer.innerHTML = '';
        body.style.overflow = 'auto';
    }

    if (closeModal) closeModal.addEventListener('click', closeVideo);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeVideo();
        });
    }

    // --- Efecto de Header al Scroll ---
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll <= 0) {
            header.style.boxShadow = 'none';
        } else {
            header.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
        }
        lastScroll = currentScroll;
    });

    // --- Accesibilidad y Teclado ---
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
            closeVideo();
        }
    });

    // --- SEO & Performance ---
    console.log('KOOPODCAST Platform Optimized Loaded');
});
