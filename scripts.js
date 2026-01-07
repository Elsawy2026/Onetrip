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

// Scroll Effect with Progress Bar
const scrollProgress = document.getElementById('scrollProgress');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
    
    updateActiveNav();
    updateBackTop();
    updateScrollProgress();
});

// Update Scroll Progress
function updateScrollProgress() {
    if (scrollProgress) {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';
    }
}

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
            if (el.tagName === 'OPTION') {
                el.textContent = arText;
            } else {
                el.innerHTML = arText;
            }
        } else if (newLang === 'en' && enText) {
            if (el.tagName === 'OPTION') {
                el.textContent = enText;
            } else {
                el.innerHTML = enText;
            }
        }
    });
    
    // Update select options
    document.querySelectorAll('select option').forEach(option => {
        const arText = option.dataset.ar;
        const enText = option.dataset.en;
        
        if (newLang === 'ar' && arText) {
            option.textContent = arText;
        } else if (newLang === 'en' && enText) {
            option.textContent = enText;
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

// ===== LIVE CHAT =====
function toggleChat() {
    const chatWidget = document.getElementById('chatWidget');
    const chatToggle = document.getElementById('chatToggle');
    const badge = document.querySelector('.chat-badge');
    
    if (!chatWidget) return;
    
    const isOpening = !chatWidget.classList.contains('active');
    chatWidget.classList.toggle('active');
    
    if (isOpening) {
        // عند الفتح أخفي البادج
        if (badge) badge.style.display = 'none';
    } else {
        // عند الإغلاق امسح المحادثة وارجع رسالة الترحيب فقط
        resetChatConversation();
        if (badge) badge.style.display = 'flex';
    }
}

function sendQuickReply(type) {
    const shortcuts = {
        pricing: 'ما هي أسعار خدمات التوصيل؟',
        delivery: 'كم متوسط مدة التوصيل داخل المدينة وبين المدن؟',
        order: 'أريد معرفة طريقة طلب خدمة توصيل من OneTrip.',
        track: 'كيف أقدر أتتبع شحنتي؟'
    };
    
    const text = shortcuts[type] || '';
    if (text) {
        handleUserMessage(text);
    }
}

// ===== SIMPLE AI CHAT LOGIC (ON-PAGE ONLY) =====
const chatMessagesEl = document.getElementById('chatMessages');
const chatInputEl = document.getElementById('chatInput');

function appendMessage(text, sender = 'bot') {
    if (!chatMessagesEl || !text) return;
    
    const wrapper = document.createElement('div');
    wrapper.className = `chat-message ${sender}`;
    
    const span = document.createElement('span');
    span.textContent = text;
    wrapper.appendChild(span);
    
    const time = document.createElement('span');
    time.className = 'chat-message-time';
    const now = new Date();
    time.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    wrapper.appendChild(time);
    
    chatMessagesEl.appendChild(wrapper);
    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
}

function sendChatMessage(event) {
    event.preventDefault();
    if (!chatInputEl) return;
    
    const text = chatInputEl.value.trim();
    if (!text) return;
    
    handleUserMessage(text);
    chatInputEl.value = '';
}

function handleUserMessage(text) {
    appendMessage(text, 'user');
    
    setTimeout(() => {
        const reply = generateBotReply(text);
        appendMessage(reply, 'bot');
    }, 400);
}

function generateBotReply(message) {
    const langIsArabic = document.documentElement.lang === 'ar';
    const msg = message.toLowerCase();
    
    // كلمات مفتاحية عربية وإنجليزية
    const has = (keywords) => keywords.some(k => msg.includes(k));
    
    if (has(['سعر', 'الأسعار', 'التكلفة', 'price', 'pricing'])) {
        return langIsArabic
            ? 'نقدّم تسعير مرن حسب نوع الخدمة (توصيل فوري، بين المدن، شركات). للطلبات المتكررة أو العقود الشهرية نوفر أسعار خاصة. شاركنا تفاصيل نشاطك وسيتم تجهيز عرض مناسب لك.'
            : 'We offer flexible pricing based on the service type (instant delivery, inter-city, corporate). For recurring orders and monthly contracts we provide special rates. Share your business details and we’ll tailor an offer.';
    }
    
    if (has(['وقت', 'مدة', 'توصيل', 'كم ساعه', 'delivery time', 'how long'])) {
        return langIsArabic
            ? 'داخل المدينة غالباً يتم التوصيل خلال ساعات قليلة حسب حجم الطلب والمنطقة. بين المدن يكون خلال 24–72 ساعة في العادة مع إمكانية تتبع الشحنة لحظياً.'
            : 'Within the city, deliveries are usually completed within a few hours depending on area and volume. Between cities it’s typically 24–72 hours with real‑time tracking.';
    }
    
    if (has(['تتبع', 'تراك', 'tracking', 'track'])) {
        return langIsArabic
            ? 'نوفر نظام تتبع لحظي للطلبات مع تحديثات حالة الشحنة من الاستلام حتى التسليم. يمكنك ربط نظامك معنا أو استلام روابط تتبع جاهزة لعملائك.'
            : 'We provide real‑time shipment tracking from pickup to delivery. You can integrate our tracking into your systems or share ready tracking links with your customers.';
    }
    
    if (has(['شركة', 'شركات', 'بيزنس', 'منشأة', 'business', 'b2b', 'contract'])) {
        return langIsArabic
            ? 'لدينا حلول متكاملة للشركات والمتاجر (مطاعم، متاجر إلكترونية، منصات رقمية) مع عقود تشغيل مرنة، تقارير أداء، وإدارة أساطيل خاصة. أرسل لنا نوع نشاطك وحجم الطلبات التقريبي لنرشّح لك الأنسب.'
            : 'We provide end‑to‑end logistics for businesses (restaurants, e‑commerce, digital platforms) with flexible contracts, performance dashboards and private fleet management. Tell us your industry and volume for a tailored proposal.';
    }
    
    if (has(['مدينة', 'مدن', 'الرياض', 'جدة', 'coverage', 'cities'])) {
        return langIsArabic
            ? 'نغطي حالياً أبرز مدن ومناطق المملكة مع خطة توسع مستمرة. شاركني مدينتك أو مسار الشحن المطلوب وأخبرك بإمكانية الخدمة والمدة المتوقعة.'
            : 'We currently cover the main cities and regions in Saudi Arabia with continuous expansion. Tell me your city or route and I’ll let you know availability and ETA.';
    }
    
    if (has(['وظيفة', 'توظيف', 'وظائف', 'career', 'job', 'join'])) {
        return langIsArabic
            ? 'للانضمام إلى فريق OneTrip يمكنك التقديم من قسم الوظائف في الموقع، تعبئة النموذج ورفع السيرة الذاتية، وسيتم التواصل معك في حال توفر شاغر مناسب.'
            : 'To join the OneTrip team, please apply through the Careers section, fill in the form and upload your CV. Our team will contact you when a matching position is available.';
    }
    
    if (has(['تواصل', 'رقم', 'واتساب', 'contact', 'email', 'phone'])) {
        return langIsArabic
            ? 'يمكنك التواصل معنا مباشرة على الرقم 920032104 أو البريد info@onetrip.sa، أو تكملة استفساراتك هنا في الشات وسنساعدك قدر المستطاع.'
            : 'You can contact us directly at 920032104 or info@onetrip.sa, or simply continue asking here and we’ll help as much as possible.';
    }
    
    if (has(['hello', 'مرحبا', 'السلام', 'hi', 'hey'])) {
        return langIsArabic
            ? 'أهلاً وسهلاً! 😊 كيف أقدر أساعدك اليوم؟ هل تهتم بالخدمات، الأسعار، أو شراكة للشركات؟'
            : 'Hi there! 😊 How can I help you today? Are you interested in services, pricing, or a business partnership?';
    }
    
    // رد افتراضي ذكي
    return langIsArabic
        ? 'فهمت سؤالك 👌 لكن لأعطيك إجابة أدق، حاول توضح لي: هل سؤالك عن الأسعار، مدة التوصيل، التغطية داخل المملكة، أو حلول للشركات؟'
        : 'Got it 👌 To give you a precise answer, can you tell me if your question is about pricing, delivery time, coverage inside KSA, or business solutions?';
}

function resetChatConversation() {
    if (!chatMessagesEl) return;
    
    chatMessagesEl.innerHTML = '';
    const isArabic = document.documentElement.lang === 'ar';
    const initial = document.createElement('div');
    initial.className = 'chat-message bot';
    initial.innerHTML = `
        <span>${isArabic
            ? 'مرحباً! 👋 أنا مساعد OneTrip الذكي. اسألني عن الخدمات، الأسعار، مواعيد التوصيل أو أي استفسار يهمك.'
            : 'Hello! 👋 I\'m the OneTrip smart assistant. Ask me about services, pricing, delivery times or anything you need.'}</span>
        <span class="chat-message-time">Now</span>
    `;
    chatMessagesEl.appendChild(initial);
}

// ===== TESTIMONIALS SLIDER =====
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial-card');
const dots = document.querySelectorAll('.testimonial-dots .dot');

function showTestimonial(index) {
    testimonials.forEach((t, i) => {
        t.classList.remove('active');
        dots[i]?.classList.remove('active');
    });
    
    testimonials[index]?.classList.add('active');
    dots[index]?.classList.add('active');
    currentTestimonial = index;
}

// Auto-rotate testimonials
setInterval(() => {
    if (testimonials.length > 0) {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }
}, 5000);

// ===== ORDER FORM =====
const orderForm = document.getElementById('orderForm');

if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(orderForm);
        const data = Object.fromEntries(formData);
        
        // Show success modal
        const isArabic = document.documentElement.lang === 'ar';
        showSuccessModal(
            isArabic ? 'تم إرسال طلبك!' : 'Request Submitted!',
            isArabic ? 'سيتم التواصل معك خلال دقائق' : 'We will contact you within minutes',
            isArabic ? 'رقم الطلب: #' + Math.floor(Math.random() * 10000) : 'Order #: ' + Math.floor(Math.random() * 10000)
        );
        
        // Reset form
        orderForm.reset();
        
        console.log('Order submitted:', data);
    });
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

// ===== CAREERS FORM =====
const careersForm = document.getElementById('careersForm');
const resumeFile = document.getElementById('resumeFile');
const fileName = document.getElementById('fileName');

if (resumeFile && fileName) {
    resumeFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const isArabic = document.documentElement.lang === 'ar';
            fileName.textContent = isArabic ? `تم اختيار: ${file.name}` : `Selected: ${file.name}`;
            fileName.style.color = 'var(--primary)';
        } else {
            const isArabic = document.documentElement.lang === 'ar';
            fileName.textContent = isArabic ? 'لم يتم اختيار ملف' : 'No file chosen';
            fileName.style.color = 'var(--text-muted)';
        }
    });
}

if (careersForm) {
    careersForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(careersForm);
        
        // Show success modal with careers message
        const isArabic = document.documentElement.lang === 'ar';
        showSuccessModal(
            isArabic ? 'شكراً لتقديمك!' : 'Thank You for Applying!',
            isArabic ? 'تم إرسال طلب التوظيف بنجاح' : 'Your job application has been sent successfully',
            isArabic ? 'سيتم مراجعة طلبك والاتصال بك قريباً' : 'We will review your application and contact you soon'
        );
        
        // Reset form
        careersForm.reset();
        if (fileName) {
            const isArabic = document.documentElement.lang === 'ar';
            fileName.textContent = isArabic ? 'لم يتم اختيار ملف' : 'No file chosen';
            fileName.style.color = 'var(--text-muted)';
        }
        
        console.log('Careers form submitted');
    });
}

// ===== SUCCESS MODAL =====
function showSuccessModal(title, message, subtitle) {
    // Remove existing modal
    const existingModal = document.querySelector('.success-modal-overlay');
    if (existingModal) existingModal.remove();
    
    const isArabic = document.documentElement.lang === 'ar';
    
    const modalTitle = title || (isArabic ? 'شكراً لك!' : 'Thank You!');
    const modalMessage = message || (isArabic ? 'تم إرسال رسالتك بنجاح' : 'Your message has been sent successfully');
    const modalSubtitle = subtitle || (isArabic ? 'سيتم التواصل معك في أقرب وقت ممكن' : 'We will contact you as soon as possible');
    
    const modalHTML = `
        <div class="success-modal-overlay">
            <div class="success-modal">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>${modalTitle}</h3>
                <p>${modalMessage}</p>
                <p class="success-subtitle">${modalSubtitle}</p>
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

// Observe elements with BOOM effect
document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll('.service-card, .partner-card, .about-card, .feature-item, .stat-item, .value-card, .benefit-item, .contact-item');
    
    elementsToAnimate.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px) scale(0.9)';
        el.style.transition = `all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) ${index * 0.1}s`;
        revealObserver.observe(el);
    });
    
    // Add magnetic effect to icons
    addMagneticEffect();
    
    // Add parallax to hero
    addParallaxEffect();
    
    // Add ripple effect to buttons
    addRippleEffect();
});

// Magnetic effect for icons
function addMagneticEffect() {
    const magneticElements = document.querySelectorAll('.about-card-icon, .value-icon, .contact-icon, .benefit-icon');
    
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.1)`;
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0, 0) scale(1)';
        });
    });
}

// Parallax effect for hero
function addParallaxEffect() {
    const hero = document.querySelector('.hero');
    const heroIllustration = document.querySelector('.hero-main-illustration');
    
    if (hero && heroIllustration) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            if (scrolled < window.innerHeight) {
                heroIllustration.style.transform = `translateY(${scrolled * 0.15}px)`;
            }
        });
    }
}

// Ripple effect for buttons
function addRippleEffect() {
    const buttons = document.querySelectorAll('.btn-primary, .submit-btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.className = 'ripple-effect';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            btn.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

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
        
        // Calculate the width of one set (we have 8 sets, so divide by 8)
        const logos = marquee.querySelectorAll('.partner-logo');
        const totalLogos = logos.length;
        const logosPerSet = totalLogos / 8;
        
        // Calculate width of one complete set
        let setWidth = 0;
        for (let i = 0; i < logosPerSet; i++) {
            if (logos[i]) {
                setWidth += logos[i].offsetWidth + 40; // width + padding
            }
        }
        
        marqueeWidth = setWidth;
        
        function animate() {
            if (isPaused) {
                animationId = requestAnimationFrame(animate);
                return;
            }
            
            position -= 2; // Smooth speed
            
            // Reset when we've moved one set (12.5% of total = 1/8)
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

// ===== TILT EFFECT FOR CARDS =====
function addTiltEffect() {
    const cards = document.querySelectorAll('.about-card, .service-card, .partner-card, .value-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
}

// ===== GLOWING CURSOR EFFECT =====
function addGlowingCursor() {
    const glowCursor = document.createElement('div');
    glowCursor.className = 'glow-cursor';
    document.body.appendChild(glowCursor);
    
    document.addEventListener('mousemove', (e) => {
        glowCursor.style.left = e.clientX + 'px';
        glowCursor.style.top = e.clientY + 'px';
    });
}

// ===== TYPING EFFECT FOR HERO =====
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// ===== COUNTER WITH BOOM EFFECT =====
function animateCounterBoom(element, target, suffix = '') {
    const duration = 2500;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Elastic easing for BOOM effect
        const c4 = (2 * Math.PI) / 3;
        const easeProgress = progress === 1 
            ? 1 
            : Math.pow(2, -10 * progress) * Math.sin((progress * 10 - 0.75) * c4) + 1;
        
        const current = Math.floor(easeProgress * target);
        element.textContent = current + suffix;
        
        // Add scale effect
        const scale = 1 + (1 - progress) * 0.2;
        element.style.transform = `scale(${scale})`;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target + suffix;
            element.style.transform = 'scale(1)';
            
            // BOOM flash effect
            element.classList.add('counter-boom');
            setTimeout(() => element.classList.remove('counter-boom'), 500);
        }
    }
    
    requestAnimationFrame(update);
}

// Initialize all effects
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        addTiltEffect();
        addMagneticButtons();
        addTextRevealEffect();
        // addGlowingCursor(); // Uncomment for cursor effect
    }, 1500);
});

// ===== MAGNETIC BUTTONS =====
function addMagneticButtons() {
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-secondary, .submit-btn');
    
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

// ===== TEXT REVEAL EFFECT =====
function addTextRevealEffect() {
    const titles = document.querySelectorAll('.section-title, .hero-title');
    
    titles.forEach(title => {
        title.style.opacity = '1';
        title.style.transform = 'translateY(0)';
    });
}

// ===== PARTICLE BURST ON CLICK =====
function createParticleBurst(x, y) {
    const colors = ['#F7941D', '#FF6B35', '#FFAA40', '#FFD700'];
    
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${x}px;
            top: ${y}px;
        `;
        document.body.appendChild(particle);
        
        const angle = (Math.PI * 2 * i) / 15;
        const velocity = 100 + Math.random() * 100;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        let posX = x;
        let posY = y;
        let opacity = 1;
        
        function animate() {
            posX += vx * 0.02;
            posY += vy * 0.02 + 2;
            opacity -= 0.02;
            
            particle.style.left = posX + 'px';
            particle.style.top = posY + 'px';
            particle.style.opacity = opacity;
            particle.style.transform = `scale(${opacity})`;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        }
        
        requestAnimationFrame(animate);
    }
}

// Add particle burst to buttons
document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', (e) => {
        createParticleBurst(e.clientX, e.clientY);
    });
});

// ===== SMOOTH SECTION REVEALS =====
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('section-visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.section').forEach(section => {
    sectionObserver.observe(section);
});

// ===== CONSOLE MESSAGE =====
console.log('%c🚀 OneTrip Express v2026.01.07', 'font-size: 24px; font-weight: bold; color: #F7941D;');
console.log('%cشريكك اللوجستي الموثوق - AI Chat Enabled', 'font-size: 14px; color: #00D9A5;');
console.log('%cDeveloped with ❤️ for excellence', 'font-size: 12px; color: #64748B;');
