/* ===========================================
   PORTFOLIO - DEVSITES
   Interações e animações
   =========================================== */

(function () {
    'use strict';

    // ============ HEADER SCROLL ============
    const header = document.getElementById('header');
    let lastScroll = 0;

    function handleScroll() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ============ MOBILE MENU ============
    const navToggle = document.querySelector('.nav-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuClose = mobileMenu.querySelector('.mobile-menu-close');
    const mobileLinks = mobileMenu.querySelectorAll('a');

    function setMobileMenu(open) {
        navToggle.classList.toggle('active', open);
        mobileMenu.classList.toggle('active', open);
        navToggle.setAttribute('aria-expanded', open);
        mobileMenu.setAttribute('aria-hidden', !open);
        document.body.style.overflow = open ? 'hidden' : '';
    }

    function toggleMobileMenu() {
        setMobileMenu(!mobileMenu.classList.contains('active'));
    }

    navToggle.addEventListener('click', toggleMobileMenu);

    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', () => setMobileMenu(false));
    }

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('active')) {
                setMobileMenu(false);
            }
        });
    });

    // ============ REVEAL ON SCROLL ============
    const reveals = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 80);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -60px 0px'
        });

        reveals.forEach(el => observer.observe(el));
    } else {
        reveals.forEach(el => el.classList.add('visible'));
    }

    // ============ COUNTER ANIMATION ============
    const counters = document.querySelectorAll('[data-count]');

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-count'), 10);
        const duration = 1800;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.floor(eased * target);
            el.textContent = value;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target;
            }
        }

        requestAnimationFrame(update);
    }

    if ('IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(c => counterObserver.observe(c));
    } else {
        counters.forEach(c => {
            c.textContent = c.getAttribute('data-count');
        });
    }

    // ============ SMOOTH SCROLL ============
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href.length < 2) return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============ CONTACT FORM ============
    const contactForm = document.getElementById('contactForm');
    const phoneInput = document.getElementById('phone');

    // Phone mask
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);

            if (value.length > 6) {
                value = value.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
            } else if (value.length > 2) {
                value = value.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2');
            } else if (value.length > 0) {
                value = value.replace(/^(\d{0,2}).*/, '($1');
            }

            e.target.value = value;
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const business = document.getElementById('business').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !phone || !message) {
                alert('Por favor, preencha os campos obrigatórios.');
                return;
            }

            const text = `Olá! Vim pelo seu site.%0A%0A` +
                         `*Nome:* ${name}%0A` +
                         `*WhatsApp:* ${phone}%0A` +
                         (business ? `*Negócio:* ${business}%0A` : '') +
                         `%0A*Mensagem:*%0A${message}`;

            const whatsappUrl = `https://wa.me/5511999038780?text=${text}`;
            window.open(whatsappUrl, '_blank');
        });
    }

    // ============ FOOTER YEAR ============
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // ============ PARALLAX SUBTLE EFFECT ============
    const glows = document.querySelectorAll('.glow');

    if (glows.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        let ticking = false;

        document.addEventListener('mousemove', (e) => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const x = (e.clientX / window.innerWidth - 0.5) * 20;
                    const y = (e.clientY / window.innerHeight - 0.5) * 20;

                    glows.forEach((glow, i) => {
                        const factor = i === 0 ? 1 : -1;
                        glow.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
                    });

                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // ============ KEYBOARD ESCAPE FOR MOBILE MENU ============
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            setMobileMenu(false);
        }
    });

})();
