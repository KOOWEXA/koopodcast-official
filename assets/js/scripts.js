/* KOOPODCAST - Scripts Oficiales (Videos Edition) */

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');
    const currentYear = document.getElementById('currentYear');
    const videosGrid = document.getElementById('videosGrid');
    const videoModal = document.getElementById('videoModal');
    const youtubePlayer = document.getElementById('youtubePlayer');
    const closeButton = document.querySelector('.close-button');

    // Video Data (IDs from KOOPODCAST Channel)
    const videoIds = [
        { id: 'etdrUJ50qOs', title: 'KOOPODCAST Episode 4 with EDW Offensive Linemen' },
        { id: 'Tvu_rUX1IRY', title: 'KOOPODCAST Ep3 with Hacksaw Diedrich' },
        { id: 'TjxD6OjLQ78', title: 'KOOPODCAST Episode 2 with Jake Passman' },
        { id: 'NN2BSydj2_Q', title: 'KOOPODCAST 1st Podcast, No Guest' }
    ];

    // Set current year
    if (currentYear) currentYear.textContent = new Date().getFullYear();

    // Render Videos
    const renderVideos = () => {
        if (!videosGrid) return;
        videosGrid.innerHTML = videoIds.map(video => `
            <div class="video-card" onclick="openVideo('${video.id}')">
                <div class="video-thumbnail" style="background-image: url('https://img.youtube.com/vi/${video.id}/mqdefault.jpg')">
                    <div class="play-overlay">
                        <i class="fas fa-play play-icon"></i>
                    </div>
                </div>
                <div class="video-info">
                    <h3 class="video-title">${video.title}</h3>
                </div>
            </div>
        `).join('');
    };

    // Video Modal Functions
    window.openVideo = (videoId) => {
        if (!videoModal || !youtubePlayer) return;
        youtubePlayer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
        videoModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    };

    const closeVideo = () => {
        if (!videoModal || !youtubePlayer) return;
        youtubePlayer.src = ''; // Stop video
        videoModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    };

    // Event Listeners
    if (closeButton) closeButton.addEventListener('click', closeVideo);
    
    window.addEventListener('click', (event) => {
        if (event.target === videoModal) closeVideo();
    });

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

    // Initialization calls
    if (menuToggle) menuToggle.addEventListener('click', toggleMenu);
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    renderVideos();
    initSmoothScroll();
    initScrollHeader();

    console.log('KOOPODCAST Videos plataforma cargada');
});
