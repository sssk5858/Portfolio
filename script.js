/**
 * Portfolio Interactive & Animation Controller
 * Vanilla JS (ES6+)
 */

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initTypewriter();
    initScrollReveals();
    initSkillBars();
    initNavScrollSpy();
    initMobileMenu();
    initBackToTop();
    initCvDownload();
    initProjectFilters();
});

/* ==========================================================================
   1. THEME SWITCHER (DARK / LIGHT MODE)
   ========================================================================== */
function initThemeToggle() {
    const themeBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-toggle-icon');
    if (!themeBtn || !themeIcon) return;

    // Check stored theme or system preference
    const savedTheme = localStorage.getItem('portfolio-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let currentTheme = savedTheme ? savedTheme : (systemPrefersDark ? 'dark' : 'light');

    // Apply theme
    applyTheme(currentTheme);

    themeBtn.addEventListener('click', () => {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('portfolio-theme', currentTheme);
        applyTheme(currentTheme);
    });

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-sun text-amber-400';
            themeBtn.setAttribute('aria-label', 'Switch to light mode');
        } else {
            themeIcon.className = 'fas fa-moon text-[var(--accent-color)]';
            themeBtn.setAttribute('aria-label', 'Switch to dark mode');
        }
    }
}

/* ==========================================================================
   2. HERO TYPEWRITER ANIMATION
   ========================================================================== */
function initTypewriter() {
    const typewriterElement = document.getElementById('typewriter-text');
    if (!typewriterElement) return;

    const phrases = [
        "Java Full-Stack Developer",
        "Enterprise AI Applications Engineer",
        "Spring Boot & Microservices Specialist",
        "RAG, Vector DB & AI Agent Developer"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 80;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 40;
        } else {
            typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 80;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            typeSpeed = 2200;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 400;
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

/* ==========================================================================
   3. SCROLL REVEAL ANIMATIONS (Intersection Observer)
   ========================================================================== */
function initScrollReveals() {
    const revealElements = document.querySelectorAll('.reveal');
    if (!revealElements.length) return;

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.12,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   4. ANIMATED SKILL PROGRESS BARS & CHIPS
   ========================================================================== */
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    if (!skillBars.length) return;

    const skillObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetWidth = entry.target.getAttribute('data-progress') || '0%';
                entry.target.style.width = targetWidth;
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    skillBars.forEach(bar => skillObserver.observe(bar));
}

/* ==========================================================================
   5. NAVIGATION SCROLL SPY & SMOOTH SCROLL
   ========================================================================== */
function initNavScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    if (!sections.length || !navLinks.length) return;

    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.35
    });

    sections.forEach(section => spyObserver.observe(section));

    // Smooth Scroll Click Handler
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu && mobileMenu.classList.contains('open')) {
                    mobileMenu.classList.remove('open');
                }

                window.scrollTo({
                    top: targetElement.offsetTop - 75,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ==========================================================================
   6. PROJECT CATEGORY FILTERS
   ========================================================================== */
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.project-filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    if (!filterBtns.length || !projectItems.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterValue = btn.getAttribute('data-filter');

            // Update active filter button state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter project cards
            projectItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                if (filterValue === 'all' || itemCategory === filterValue || itemCategory.includes(filterValue)) {
                    item.classList.remove('hidden-project');
                } else {
                    item.classList.add('hidden-project');
                }
            });
        });
    });
}

/* ==========================================================================
   7. MOBILE MENU TRANSITION
   ========================================================================== */
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (!menuToggle || !mobileMenu) return;

    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
        const isOpen = mobileMenu.classList.contains('open');
        menuToggle.setAttribute('aria-expanded', isOpen);
    });
}

/* ==========================================================================
   8. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 350) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ==========================================================================
   9. DOWNLOAD CV FUNCTIONALITY
   ========================================================================== */
function initCvDownload() {
    const downloadBtn = document.getElementById('download-cv-btn');
    if (!downloadBtn) return;

    downloadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const link = document.createElement('a');
        link.href = 'cv.pdf';
        link.download = 'Sai_Siva_Kumar_Sunkara_CV.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}
