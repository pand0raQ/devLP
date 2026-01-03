// Global Scripts
import './style.css';


// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    setupScrollAnimations();
    setupGlassEffects();
});

/**
 * Setup intersection observer for fade-in animations on scroll
 */
function setupScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Elements to animate
    const animatedElements = document.querySelectorAll('.animate-fade-in');
    animatedElements.forEach(el => observer.observe(el));
}

/**
 * Add subtle hover effects or dynamic glass positioning if needed
 */
function setupGlassEffects() {
    const cards = document.querySelectorAll('.glass-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Optional: localized spotlight effect via CSS variables if wanted later
            // card.style.setProperty('--mouse-x', `${x}px`);
            // card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}
