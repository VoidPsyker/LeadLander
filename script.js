// ===== Navbar Scroll Effect =====
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
});

// ===== Mobile Menu Toggle =====
const mobileToggle = document.getElementById('mobile-toggle');
const navLinks = document.getElementById('nav-links');

mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const spans = mobileToggle.querySelectorAll('span');
    if (navLinks.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close mobile menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const spans = mobileToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// ===== Smooth Scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===== Form Submissions =====
const modal = document.getElementById('success-modal');
const modalClose = document.getElementById('modal-close');

function showModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

modalClose.addEventListener('click', hideModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) hideModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) hideModal();
});

// Hero form
document.getElementById('hero-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('hero-email').value;
    if (email) {
        showModal();
        this.reset();
    }
});

// CTA form
document.getElementById('cta-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('cta-email').value;
    if (email) {
        showModal();
        this.reset();
    }
});

// ===== FAQ Accordion =====
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const item = button.parentElement;
        const isActive = item.classList.contains('active');

        // Close all
        document.querySelectorAll('.faq-item').forEach(faq => {
            faq.classList.remove('active');
            faq.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        });

        // Open clicked if it wasn't active
        if (!isActive) {
            item.classList.add('active');
            button.setAttribute('aria-expanded', 'true');
        }
    });
});

// ===== Stats Counter Animation =====
function animateCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');

    statNumbers.forEach(stat => {
        const target = parseFloat(stat.dataset.target);
        const isDecimal = target % 1 !== 0;
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = target * ease;

            if (isDecimal) {
                stat.textContent = current.toFixed(1);
            } else {
                stat.textContent = Math.floor(current).toLocaleString();
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                if (isDecimal) {
                    stat.textContent = target.toFixed(1);
                } else {
                    stat.textContent = target.toLocaleString();
                }
            }
        }

        requestAnimationFrame(update);
    });
}

// ===== Scroll Reveal =====
function setupReveal() {
    const revealElements = document.querySelectorAll(
        '.feature-card, .step-card, .stat-item, .testimonial-card, .pricing-card, .faq-item, .section-header'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Start counter animation when stats section is visible
                if (entry.target.classList.contains('stat-item')) {
                    animateCounters();
                }
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}

// ===== Card Mouse Glow Effect =====
function setupCardGlow() {
    const cards = document.querySelectorAll('.feature-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mouse-x', x + '%');
            card.style.setProperty('--mouse-y', y + '%');
        });
    });
}

// ===== Staggered Reveal Delay =====
function setupStaggerDelay() {
    const grids = document.querySelectorAll('.features-grid, .steps-grid, .testimonials-grid, .pricing-grid');
    grids.forEach(grid => {
        const children = grid.querySelectorAll('.reveal');
        children.forEach((child, index) => {
            child.style.transitionDelay = `${index * 0.1}s`;
        });
    });
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    setupReveal();
    setupCardGlow();
    setupStaggerDelay();
});
