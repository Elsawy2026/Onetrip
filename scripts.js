/* OneTrip Express - Scripts */
let currentLang = 'ar';
const preloader = document.getElementById('preloader');
const navbar = document.getElementById('navbar');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const langSwitch = document.getElementById('langSwitch');
const backToTopBtn = document.getElementById('backToTop');
const careersForm = document.getElementById('careersForm');
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

window.addEventListener('load', () => { setTimeout(() => { preloader.classList.add('hidden'); document.body.style.overflow = 'auto'; }, 2000); });

document.addEventListener('DOMContentLoaded', () => {
    AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true, offset: 100, disable: 'mobile' });
    initNavbar(); initSmoothScroll(); initStatsCounter(); initFileUpload(); initForms(); createParticles();
});

function initNavbar() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) { navbar.classList.add('scrolled'); } else { navbar.classList.remove('scrolled'); }
        if (window.scrollY > 500) { backToTopBtn.classList.add('show'); } else { backToTopBtn.classList.remove('show'); }
        updateActiveNavLink();
    });
}

function toggleMenu() { navMenu.classList.toggle('active'); document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto'; }

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => { link.classList.remove('active'); if (link.getAttribute('href') === `#${sectionId}`) { link.classList.add('active'); } });
        }
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    });
    backToTopBtn.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
}

function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.body.classList.toggle('en', currentLang === 'en');
    langSwitch.textContent = currentLang === 'ar' ? 'EN' : 'عربي';
    document.querySelectorAll('[data-ar][data-en]').forEach(el => {
        const text = currentLang === 'ar' ? el.dataset.ar : el.dataset.en;
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') { el.placeholder = text; }
        else if (el.tagName === 'OPTION') { el.textContent = text; }
        else if (el.querySelector('span')) { el.querySelector('span').textContent = text; }
        else { el.textContent = text; }
    });
    AOS.refresh();
}

function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimated = false;
    const animateStats = () => {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.dataset.target);
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            const updateNumber = () => { current += increment; if (current < target) { stat.textContent = Math.floor(current); requestAnimationFrame(updateNumber); } else { stat.textContent = target; } };
            updateNumber();
        });
    };
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting && !hasAnimated) { hasAnimated = true; animateStats(); } }); }, { threshold: 0.5 });
        observer.observe(statsSection);
    }
}

function initFileUpload() {
    const fileInput = document.getElementById('cvUpload');
    const fileName = document.getElementById('fileName');
    const fileLabel = document.querySelector('.file-label');
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                const file = e.target.files[0];
                const maxSize = 5 * 1024 * 1024;
                if (file.size > maxSize) { alert(currentLang === 'ar' ? 'حجم الملف كبير جداً. الحد الأقصى 5MB' : 'File size is too large. Maximum is 5MB'); fileInput.value = ''; fileName.textContent = ''; return; }
                fileName.textContent = file.name;
                fileLabel.style.borderColor = 'var(--primary)';
                fileLabel.style.background = 'rgba(0,71,171,0.05)';
            }
        });
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => { fileLabel.addEventListener(eventName, (e) => { e.preventDefault(); e.stopPropagation(); }, false); });
        ['dragenter', 'dragover'].forEach(eventName => { fileLabel.addEventListener(eventName, () => { fileLabel.style.borderColor = 'var(--secondary)'; fileLabel.style.background = 'rgba(255,107,53,0.1)'; }); });
        ['dragleave', 'drop'].forEach(eventName => { fileLabel.addEventListener(eventName, () => { fileLabel.style.borderColor = ''; fileLabel.style.background = ''; }); });
        fileLabel.addEventListener('drop', (e) => { const dt = e.dataTransfer; const files = dt.files; fileInput.files = files; if (files.length > 0) { fileName.textContent = files[0].name; } });
    }
}

function initForms() {
    if (careersForm) {
        careersForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(careersForm);
            const submitBtn = careersForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i><span>${currentLang === 'ar' ? 'جاري الإرسال...' : 'Submitting...'}</span>`;
            try {
                await simulateFormSubmission(formData);
                careersForm.style.display = 'none';
                formSuccess.classList.add('show');
                careersForm.reset();
                document.getElementById('fileName').textContent = '';
            } catch (error) {
                alert(currentLang === 'ar' ? 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.' : 'An error occurred while submitting. Please try again.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `<i class="fas fa-paper-plane"></i><span>${currentLang === 'ar' ? 'إرسال الطلب' : 'Submit Application'}</span>`;
            }
        });
    }
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i><span>${currentLang === 'ar' ? 'جاري الإرسال...' : 'Sending...'}</span>`;
            try {
                await simulateFormSubmission(formData);
                alert(currentLang === 'ar' ? 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.' : 'Your message has been sent successfully! We will contact you soon.');
                contactForm.reset();
            } catch (error) {
                alert(currentLang === 'ar' ? 'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.' : 'An error occurred while sending. Please try again.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `<i class="fas fa-paper-plane"></i><span>${currentLang === 'ar' ? 'إرسال الطلب' : 'Send Message'}</span>`;
            }
        });
    }
}

function simulateFormSubmission(formData) {
    return new Promise((resolve, reject) => {
        console.log('Form Data:');
        for (let [key, value] of formData.entries()) { console.log(`${key}: ${value}`); }
        setTimeout(() => { if (Math.random() > 0.1) { resolve({ success: true }); } else { reject(new Error('Network error')); } }, 1500);
    });
}

function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    const particleCount = 30;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `position: absolute; width: ${Math.random() * 4 + 2}px; height: ${Math.random() * 4 + 2}px; background: rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1}); border-radius: 50%; top: ${Math.random() * 100}%; left: ${Math.random() * 100}%; animation: particleFloat ${Math.random() * 10 + 10}s ease-in-out infinite; animation-delay: ${Math.random() * 5}s;`;
        particlesContainer.appendChild(particle);
    }
    const style = document.createElement('style');
    style.textContent = `@keyframes particleFloat { 0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; } 25% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(1.2); opacity: 0.8; } 50% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(0.8); opacity: 0.3; } 75% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(1.1); opacity: 0.6; } }`;
    document.head.appendChild(style);
}

function initGlobeAnimation() {
    const globe = document.querySelector('.globe');
    const orbits = document.querySelectorAll('.orbit');
    if (!globe) return;
    document.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const xPercent = (clientX / innerWidth - 0.5) * 20;
        const yPercent = (clientY / innerHeight - 0.5) * 20;
        orbits.forEach((orbit, index) => {
            const factor = (index + 1) * 0.5;
            orbit.style.transform = `translate(-50%, -50%) rotateX(${70 + yPercent * factor}deg) rotateZ(${index * 30 + xPercent * factor}deg)`;
        });
    });
}
document.addEventListener('DOMContentLoaded', initGlobeAnimation);

console.log('%c OneTrip Express ', 'background: linear-gradient(135deg, #0047AB, #003380); color: white; font-size: 24px; font-weight: bold; padding: 10px 20px; border-radius: 5px;');
console.log('%c التوصيل كما ينبغي أن يكون | Delivery as it should be ', 'color: #FF6B35; font-size: 14px; font-weight: bold;');

