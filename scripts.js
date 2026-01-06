// ==========================================
// OneTrip Express - Ultimate Edition
// Clean, Modern, Professional JavaScript
// ==========================================

// ===== PRELOADER =====
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('preloader').classList.add('hidden');
    }, 1500);
});

// ===== NAVIGATION =====
const nav = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav-link');
const navMenu = document.getElementById('navMenu');

// Scroll Effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
    
    // Active Navigation on Scroll
    updateActiveNav();
    
    // Back to Top Button
    updateBackTop();
});

// Toggle Mobile Navigation
function toggleNav() {
    navMenu.classList.toggle('active');
}

// Close nav on link click (mobile)
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Update Active Navigation
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 120;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            document.querySelector(`.nav-link[href="#${sectionId}"]`)?.classList.add('active');
        }
    });
}

// ===== LANGUAGE TOGGLE =====
function toggleLanguage() {
    const html = document.documentElement;
    const currentLang = html.getAttribute('lang');
    const newLang = currentLang === 'ar' ? 'en' : 'ar';
    const newDir = newLang === 'ar' ? 'rtl' : 'ltr';
    
    // Update HTML attributes
    html.setAttribute('lang', newLang);
    html.setAttribute('dir', newDir);
    
    // Save to localStorage
    localStorage.setItem('lang', newLang);
    localStorage.setItem('dir', newDir);
    
    // Update all bilingual elements
    document.querySelectorAll('[data-ar], [data-en]').forEach(el => {
        const arText = el.dataset.ar;
        const enText = el.dataset.en;
        
        if (newLang === 'ar' && arText) {
            el.innerHTML = arText;
        } else if (newLang === 'en' && enText) {
            el.innerHTML = enText;
        }
    });
    
    // Update placeholders
    document.querySelectorAll('[data-ar-placeholder], [data-en-placeholder]').forEach(el => {
        if (newLang === 'ar' && el.dataset.arPlaceholder) {
            el.placeholder = el.dataset.arPlaceholder;
        } else if (newLang === 'en' && el.dataset.enPlaceholder) {
            el.placeholder = el.dataset.enPlaceholder;
        }
    });
    
    // Update button text
    document.getElementById('langBtn').textContent = newLang === 'ar' ? 'EN' : 'AR';
}

// Load saved language preference
window.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('lang');
    const savedDir = localStorage.getItem('dir');
    
    if (savedLang && savedDir) {
        const html = document.documentElement;
        if (html.getAttribute('lang') !== savedLang) {
            toggleLanguage();
        }
    }
});

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== BACK TO TOP BUTTON =====
const backTop = document.getElementById('backTop');

function updateBackTop() {
    if (window.pageYOffset > 500) {
        backTop.classList.add('visible');
    } else {
        backTop.classList.remove('visible');
    }
}

backTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Show success notification
    showNotification('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً', 'success');
    
    // Reset form
    contactForm.reset();
    
    // In production, send to backend
    console.log('Form submitted:', data);
});

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 24px;
        background: ${type === 'success' ? '#00D9A5' : '#F7941D'};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
        font-weight: 500;
    `;
    
    // RTL support
    if (document.dir === 'rtl') {
        notification.style.right = 'auto';
        notification.style.left = '24px';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .social-links {
        display: flex;
        gap: 12px;
        margin-top: 24px;
    }
    
    .social-link {
        width: 40px;
        height: 40px;
        background: rgba(247, 148, 29, 0.1);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--primary);
        text-decoration: none;
        transition: all 0.3s;
    }
    
    .social-link:hover {
        background: var(--primary);
        color: white;
        transform: translateY(-3px);
    }
    
    .scroll-indicator {
        position: absolute;
        bottom: 40px;
        left: 50%;
        transform: translateX(-50%);
        animation: bounce 2s infinite;
        opacity: 0.6;
    }
    
    .mouse {
        width: 24px;
        height: 36px;
        border: 2px solid var(--gray-400);
        border-radius: 12px;
        position: relative;
    }
    
    .wheel {
        width: 3px;
        height: 8px;
        background: var(--primary);
        border-radius: 2px;
        position: absolute;
        top: 8px;
        left: 50%;
        transform: translateX(-50%);
        animation: scroll 1.5s infinite;
    }
    
    @keyframes scroll {
        0% { transform: translateX(-50%) translateY(0); opacity: 1; }
        100% { transform: translateX(-50%) translateY(12px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ===== REVEAL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements
document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll('.service-card, .value-card, .partner-card, .about-card');
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
});

// ===== COUNTER ANIMATION =====
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + (element.dataset.suffix || '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + (element.dataset.suffix || '');
        }
    }, 16);
}

// Animate stats on scroll
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const value = entry.target.querySelector('.hero-stat-value');
            const target = value.textContent.replace(/[^0-9]/g, '');
            const suffix = value.textContent.replace(/[0-9]/g, '');
            
            value.dataset.suffix = suffix;
            animateCounter(value, parseInt(target));
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.hero-stat').forEach(stat => {
    statsObserver.observe(stat);
});

// ===== CONSOLE MESSAGE =====
console.log('%c🚀 OneTrip Express', 'font-size: 20px; font-weight: bold; color: #F7941D;');
console.log('%cالتوصيل كما ينبغي أن يكون', 'font-size: 14px; color: #1E2A4A;');
console.log('%cDeveloped with ❤️ for excellence', 'font-size: 12px; color: #00D9A5;');
