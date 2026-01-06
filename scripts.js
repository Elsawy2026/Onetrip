// ==========================================
// OneTrip Express - Premium Edition
// Professional JavaScript
// ==========================================

// ===== PRELOADER =====
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('preloader').classList.add('hidden');
        // Start counter animations after preloader
        startCounterAnimations();
    }, 1200);
});

// ===== NAVIGATION =====
const nav = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav-link');
const navMenu = document.getElementById('navMenu');

// Scroll Effect
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
    
    updateActiveNav();
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
        const sectionTop = section.offsetTop - 150;
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
    
    html.setAttribute('lang', newLang);
    html.setAttribute('dir', newDir);
    
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
    
    // Update button text
    document.getElementById('langBtn').textContent = newLang === 'ar' ? 'EN' : 'AR';
    
    // Update CTA arrow direction
    document.querySelectorAll('.btn i.fa-arrow-left, .btn i.fa-arrow-right').forEach(icon => {
        if (newLang === 'en') {
            icon.classList.remove('fa-arrow-left');
            icon.classList.add('fa-arrow-right');
        } else {
            icon.classList.remove('fa-arrow-right');
            icon.classList.add('fa-arrow-left');
        }
    });
}

// Load saved language preference
window.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('lang');
    if (savedLang && savedLang !== document.documentElement.getAttribute('lang')) {
        toggleLanguage();
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

// ===== COUNTER ANIMATIONS =====
function animateCounter(element, target, suffix = '') {
    const duration = 2000;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out cubic
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easeProgress * target);
        
        element.textContent = current + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target + suffix;
        }
    }
    
    requestAnimationFrame(update);
}

function startCounterAnimations() {
    const counters = document.querySelectorAll('[data-count]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const target = parseInt(element.dataset.count);
                const suffix = element.dataset.suffix || '';
                
                animateCounter(element, target, suffix);
                observer.unobserve(element);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Show success modal
        showSuccessModal();
        
        // Reset form
        contactForm.reset();
        
        console.log('Form submitted:', data);
    });
}

// ===== SUCCESS MODAL =====
function showSuccessModal() {
    // Remove existing modal
    const existingModal = document.querySelector('.success-modal-overlay');
    if (existingModal) existingModal.remove();
    
    const isArabic = document.documentElement.lang === 'ar';
    
    const modalHTML = `
        <div class="success-modal-overlay">
            <div class="success-modal">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>${isArabic ? 'شكراً لك!' : 'Thank You!'}</h3>
                <p>${isArabic ? 'تم إرسال رسالتك بنجاح' : 'Your message has been sent successfully'}</p>
                <p class="success-subtitle">${isArabic ? 'سيتم التواصل معك في أقرب وقت ممكن' : 'We will contact you as soon as possible'}</p>
                <button class="success-btn" onclick="closeSuccessModal()">${isArabic ? 'حسناً' : 'OK'}</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add modal styles
    const style = document.createElement('style');
    style.id = 'modal-styles';
    style.textContent = `
        .success-modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        }
        
        .success-modal {
            background: linear-gradient(135deg, #1E2A4A 0%, #0F1628 100%);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 24px;
            padding: 48px;
            text-align: center;
            max-width: 400px;
            margin: 20px;
            animation: scaleIn 0.3s ease;
        }
        
        .success-icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #00D9A5 0%, #00FFB8 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 24px;
        }
        
        .success-icon i {
            font-size: 2.5rem;
            color: white;
        }
        
        .success-modal h3 {
            font-size: 1.75rem;
            color: white;
            margin-bottom: 12px;
        }
        
        .success-modal p {
            color: #94A3B8;
            margin-bottom: 8px;
        }
        
        .success-subtitle {
            font-size: 0.9rem;
            margin-bottom: 24px !important;
        }
        
        .success-btn {
            background: linear-gradient(135deg, #F7941D 0%, #FFB347 100%);
            color: white;
            border: none;
            padding: 14px 48px;
            border-radius: 50px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .success-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(247, 148, 29, 0.3);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes scaleIn {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
    `;
    
    if (!document.getElementById('modal-styles')) {
        document.head.appendChild(style);
    }
}

function closeSuccessModal() {
    const modal = document.querySelector('.success-modal-overlay');
    if (modal) {
        modal.style.animation = 'fadeIn 0.3s ease reverse';
        setTimeout(() => modal.remove(), 300);
    }
}

// ===== REVEAL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            revealObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements
document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll('.service-card, .partner-card, .about-card, .feature-item, .stat-item');
    
    elementsToAnimate.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `all 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
        revealObserver.observe(el);
    });
});

// ===== MARQUEE ANIMATION - GUARANTEED TO WORK =====
(function() {
    const marquee = document.querySelector('#marqueeContent');
    if (!marquee) return;
    
    let position = 0;
    let isPaused = false;
    let marqueeWidth = 0;
    let animationId = null;
    
    function initMarquee() {
        // Disable CSS animation
        marquee.classList.add('js-animated');
        
        // Calculate the width of one set (we have 4 sets, so divide by 4)
        const logos = marquee.querySelectorAll('.partner-logo');
        const firstSet = logos.length / 4;
        const firstLogo = logos[0];
        
        if (firstLogo) {
            const logoWidth = firstLogo.offsetWidth + 40; // width + padding
            marqueeWidth = logoWidth * firstSet;
        } else {
            marqueeWidth = marquee.scrollWidth / 4;
        }
        
        function animate() {
            if (isPaused) {
                animationId = requestAnimationFrame(animate);
                return;
            }
            
            position -= 1.5; // Smooth speed
            
            // Reset when we've moved one set (33.33% of total)
            if (Math.abs(position) >= marqueeWidth) {
                position = 0;
            }
            
            marquee.style.transform = `translate3d(${position}px, 0, 0)`;
            marquee.style.webkitTransform = `translate3d(${position}px, 0, 0)`;
            
            animationId = requestAnimationFrame(animate);
        }
        
        // Start animation
        animate();
        
        // Pause on hover (desktop only)
        if (window.innerWidth > 768) {
            marquee.addEventListener('mouseenter', () => {
                isPaused = true;
            });
            
            marquee.addEventListener('mouseleave', () => {
                isPaused = false;
            });
        }
    }
    
    // Wait for images to load
    const images = marquee.querySelectorAll('img');
    let loadedImages = 0;
    
    if (images.length > 0) {
        images.forEach(img => {
            if (img.complete) {
                loadedImages++;
            } else {
                img.addEventListener('load', () => {
                    loadedImages++;
                    if (loadedImages === images.length) {
                        setTimeout(initMarquee, 100);
                    }
                });
            }
        });
        
        if (loadedImages === images.length) {
            setTimeout(initMarquee, 200);
        }
    } else {
        setTimeout(initMarquee, 200);
    }
    
    // Fallback: start after 1 second regardless
    setTimeout(() => {
        if (!animationId) {
            initMarquee();
        }
    }, 1000);
})();

// ===== CONSOLE MESSAGE =====
console.log('%c🚀 OneTrip Express', 'font-size: 24px; font-weight: bold; color: #F7941D;');
console.log('%cشريكك اللوجستي الموثوق', 'font-size: 14px; color: #00D9A5;');
console.log('%cDeveloped with ❤️ for excellence', 'font-size: 12px; color: #64748B;');
