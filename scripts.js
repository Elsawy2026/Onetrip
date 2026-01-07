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
    const msgAr = message;
    
    // دالة للبحث عن كلمات مفتاحية
    const has = (keywords) => keywords.some(k => msg.includes(k) || msgAr.includes(k));
    
    // ===== التحيات =====
    if (has(['hello', 'hi', 'hey', 'مرحبا', 'السلام', 'اهلا', 'هلا', 'صباح', 'مساء', 'كيفك', 'شخبارك', 'هاي'])) {
        const greetings = langIsArabic ? [
            'أهلاً وسهلاً! 😊 كيف أقدر أساعدك اليوم؟',
            'هلا والله! نورت 🌟 كيف أخدمك؟',
            'مرحبا بك! أنا هنا لمساعدتك في كل ما تحتاجه عن خدمات التوصيل 🚀',
            'حياك الله! سعيد بتواصلك معنا 💫 تفضل اسأل عن أي شيء!'
        ] : [
            'Hi there! 😊 How can I help you today?',
            'Hello! Welcome to OneTrip Express 🚀 What can I do for you?',
            'Hey! Great to have you here 💫 Ask me anything!'
        ];
        return greetings[Math.floor(Math.random() * greetings.length)];
    }
    
    // ===== الأسعار =====
    if (has(['سعر', 'الأسعار', 'التكلفة', 'كم سعر', 'بكم', 'تكلف', 'price', 'pricing', 'cost', 'rate', 'fee', 'رخيص', 'غالي', 'cheap', 'expensive'])) {
        return langIsArabic
            ? '💰 تسعيرنا مرن وتنافسي:\n\n• توصيل داخل المدينة: يبدأ من 15 ريال\n• بين المدن: حسب المسافة والوزن\n• عقود الشركات: خصومات تصل 40%\n\nأخبرني نوع نشاطك وحجم الطلبات الشهري وأجهّزلك عرض خاص! 🎯'
            : '💰 Our pricing is flexible & competitive:\n\n• Same-city delivery: Starting 15 SAR\n• Inter-city: Based on distance & weight\n• Business contracts: Up to 40% discount\n\nTell me your business type and monthly volume for a custom quote! 🎯';
    }
    
    // ===== مدة التوصيل =====
    if (has(['وقت', 'مدة', 'كم ساعه', 'كم يوم', 'متى يوصل', 'سريع', 'فوري', 'delivery time', 'how long', 'fast', 'quick', 'urgent', 'express', 'ساعة', 'يوم'])) {
        return langIsArabic
            ? '⚡ سرعة التوصيل:\n\n• داخل المدينة: 1-4 ساعات\n• توصيل عاجل: خلال ساعة واحدة!\n• بين المدن: 24-48 ساعة\n• طلبات الشركات: جداول مخصصة\n\nنلتزم بالموعد أو نعوّضك! 💪'
            : '⚡ Delivery Speed:\n\n• Same-city: 1-4 hours\n• Express/Urgent: Within 1 hour!\n• Inter-city: 24-48 hours\n• Business orders: Custom schedules\n\nWe deliver on time or compensate you! 💪';
    }
    
    // ===== التتبع =====
    if (has(['تتبع', 'تراك', 'وين طلبي', 'وصل فين', 'tracking', 'track', 'where', 'status', 'شحنة', 'shipment'])) {
        return langIsArabic
            ? '📍 نظام التتبع المباشر:\n\n• تتبع لحظي على الخريطة\n• إشعارات تلقائية بكل تحديث\n• رابط تتبع خاص لكل شحنة\n• إمكانية الربط مع أنظمتك\n\nشاركني رقم الطلب وأخبرك بحالته فوراً! 🔍'
            : '📍 Real-time Tracking System:\n\n• Live map tracking\n• Auto notifications on updates\n• Unique tracking link per shipment\n• API integration available\n\nShare your order number and I\'ll check the status! 🔍';
    }
    
    // ===== الشركات والمطاعم =====
    if (has(['شركة', 'شركات', 'بيزنس', 'منشأة', 'مطعم', 'متجر', 'تطبيق', 'business', 'b2b', 'contract', 'restaurant', 'store', 'enterprise', 'corporate', 'عقد', 'اتفاقية', 'شراكة'])) {
        return langIsArabic
            ? '🏢 حلول الشركات المتكاملة:\n\n• إدارة أساطيل توصيل مخصصة\n• لوحة تحكم وتقارير مفصّلة\n• عقود مرنة (شهري/سنوي)\n• مدير حساب مخصص لك\n• تكامل API مع أنظمتك\n\nنخدم جاهز، هنقرستيشن، مرسول وغيرهم! قولي عن نشاطك وأجهّزلك حل مناسب 🤝'
            : '🏢 Complete Business Solutions:\n\n• Dedicated delivery fleet management\n• Dashboard & detailed reports\n• Flexible contracts (monthly/yearly)\n• Dedicated account manager\n• API integration\n\nWe serve Jahez, HungerStation, Mrsool & more! Tell me about your business 🤝';
    }
    
    // ===== المدن والتغطية =====
    if (has(['مدينة', 'مدن', 'الرياض', 'جدة', 'مكة', 'الدمام', 'coverage', 'cities', 'area', 'region', 'تغطية', 'منطقة', 'نوصل', 'خميس', 'ابها', 'تبوك', 'الطائف'])) {
        return langIsArabic
            ? '🗺️ تغطيتنا في المملكة:\n\n✅ الرياض وضواحيها\n✅ جدة ومكة المكرمة\n✅ الدمام والمنطقة الشرقية\n✅ القصيم وحائل\n✅ أبها وخميس مشيط\n✅ تبوك والطائف\n\nوتتوسع يومياً! قولي مدينتك وأتأكد من التغطية 📍'
            : '🗺️ Our Coverage in KSA:\n\n✅ Riyadh & surroundings\n✅ Jeddah & Makkah\n✅ Dammam & Eastern Province\n✅ Qassim & Hail\n✅ Abha & Khamis Mushait\n✅ Tabuk & Taif\n\nExpanding daily! Tell me your city 📍';
    }
    
    // ===== الوظائف =====
    if (has(['وظيفة', 'توظيف', 'وظائف', 'شغل', 'عمل', 'career', 'job', 'join', 'hiring', 'work', 'سائق', 'driver', 'مندوب', 'راتب', 'salary'])) {
        return langIsArabic
            ? '💼 انضم لفريق OneTrip!\n\n• سائقين ومناديب توصيل\n• مشرفين عمليات\n• خدمة عملاء\n• مبيعات وتسويق\n\n✨ مميزاتنا: رواتب تنافسية، تأمين صحي، حوافز، مرونة في الدوام\n\nقدّم الآن من صفحة الوظائف أو أرسلي سيرتك الذاتية! 📄'
            : '💼 Join the OneTrip Team!\n\n• Delivery drivers\n• Operations supervisors\n• Customer service\n• Sales & marketing\n\n✨ Benefits: Competitive salary, health insurance, bonuses, flexible hours\n\nApply now through our Careers page! 📄';
    }
    
    // ===== التواصل =====
    if (has(['تواصل', 'رقم', 'تليفون', 'جوال', 'ايميل', 'بريد', 'contact', 'email', 'phone', 'number', 'call', 'اتصل', 'كلم'])) {
        return langIsArabic
            ? '📞 طرق التواصل:\n\n• الهاتف: 920032104\n• البريد: info@onetrip.sa\n• واتساب: متاح 24/7\n• العنوان: حي اليرموك، الرياض\n\nأو أكمل محادثتك معي هنا! أنا متاح على مدار الساعة 🕐'
            : '📞 Contact Us:\n\n• Phone: 920032104\n• Email: info@onetrip.sa\n• WhatsApp: Available 24/7\n• Address: Al-Yarmouk, Riyadh\n\nOr continue chatting with me here! I\'m available 24/7 🕐';
    }
    
    // ===== الشكاوي والمشاكل =====
    if (has(['مشكلة', 'شكوى', 'تأخر', 'ضايع', 'مكسور', 'problem', 'issue', 'complaint', 'late', 'lost', 'damaged', 'broken', 'زعلان', 'غلط', 'خطأ'])) {
        return langIsArabic
            ? '😔 آسف جداً على أي إزعاج!\n\nأخبرني بالتفاصيل:\n• رقم الطلب إذا متوفر\n• طبيعة المشكلة\n• التاريخ والوقت\n\nفريقنا يعطي أولوية قصوى للشكاوى وسنحلها بأسرع وقت! نقدّر ثقتك فينا 🙏'
            : '😔 So sorry for any inconvenience!\n\nPlease share:\n• Order number if available\n• Nature of the issue\n• Date and time\n\nOur team prioritizes complaints and will resolve it ASAP! We value your trust 🙏';
    }
    
    // ===== الدفع =====
    if (has(['دفع', 'فلوس', 'كاش', 'فيزا', 'تحويل', 'payment', 'pay', 'cash', 'visa', 'card', 'مدى', 'apple pay', 'stc'])) {
        return langIsArabic
            ? '💳 طرق الدفع المتاحة:\n\n• كاش عند الاستلام\n• مدى / فيزا / ماستركارد\n• Apple Pay\n• STC Pay\n• تحويل بنكي للشركات\n\nكل الطرق آمنة ومضمونة! 🔒'
            : '💳 Payment Methods:\n\n• Cash on delivery\n• Mada / Visa / Mastercard\n• Apple Pay\n• STC Pay\n• Bank transfer for businesses\n\nAll methods are secure! 🔒';
    }
    
    // ===== طلب خدمة =====
    if (has(['طلب', 'اطلب', 'ابغى', 'عايز', 'محتاج', 'order', 'request', 'need', 'want', 'book', 'حجز'])) {
        return langIsArabic
            ? '📦 جاهز لخدمتك!\n\nلطلب خدمة توصيل:\n1️⃣ اضغط على "اطلب خدمة" في الموقع\n2️⃣ حدد نوع الخدمة والتفاصيل\n3️⃣ احصل على تأكيد فوري!\n\nأو قولي:\n• إيش تبغى توصّل؟\n• من وين لوين؟\n• متى تحتاجه؟\n\nوأساعدك أجهّز الطلب 🚀'
            : '📦 Ready to serve you!\n\nTo request delivery:\n1️⃣ Click "Request Service" on the website\n2️⃣ Choose service type & details\n3️⃣ Get instant confirmation!\n\nOr tell me:\n• What do you need delivered?\n• From where to where?\n• When do you need it?\n\nAnd I\'ll help set it up 🚀';
    }
    
    // ===== أسئلة عن الشركة =====
    if (has(['من انتم', 'مين انتو', 'ايش', 'شنو', 'who', 'what is', 'about', 'onetrip', 'ون تريب', 'وان تريب'])) {
        return langIsArabic
            ? '🚀 نحن OneTrip Express!\n\nشركة سعودية رائدة في التوصيل والحلول اللوجستية.\n\n✨ خدماتنا:\n• توصيل سريع داخل المدن\n• شحن بين المدن\n• حلول متكاملة للشركات\n• إدارة أساطيل التوصيل\n\nشركاؤنا: جاهز، هنقرستيشن، مرسول، كيتا وغيرهم!\n\nشعارنا: التوصيل كما ينبغي أن يكون! 💫'
            : '🚀 We are OneTrip Express!\n\nA leading Saudi logistics & delivery company.\n\n✨ Our Services:\n• Fast same-city delivery\n• Inter-city shipping\n• Complete business solutions\n• Fleet management\n\nPartners: Jahez, HungerStation, Mrsool, Keeta & more!\n\nOur motto: Delivery as it should be! 💫';
    }
    
    // ===== الشكر =====
    if (has(['شكر', 'شكراً', 'thanks', 'thank', 'مشكور', 'يعطيك', 'الله يعطيك', 'ممتاز', 'رائع', 'حلو', 'great', 'awesome', 'nice', 'good', 'perfect'])) {
        const thanks = langIsArabic ? [
            'العفو! سعيد إني قدرت أساعدك 😊 لو تحتاج أي شيء ثاني، أنا هنا!',
            'تسلم! نورتنا بسؤالك 🌟 لا تتردد ترجع في أي وقت!',
            'الشكر لك على ثقتك فينا! 💙 موفق!',
            'يسعدني خدمتك! نتمنى نشوفك عميل دائم عندنا 🚀'
        ] : [
            'You\'re welcome! Happy to help 😊',
            'My pleasure! Come back anytime 🌟',
            'Thank YOU for choosing us! 💙',
            'Glad I could help! See you soon 🚀'
        ];
        return thanks[Math.floor(Math.random() * thanks.length)];
    }
    
    // ===== الوداع =====
    if (has(['باي', 'مع السلامة', 'bye', 'goodbye', 'see you', 'الله معك', 'يلا', 'خلاص'])) {
        const bye = langIsArabic ? [
            'مع السلامة! 👋 نتشرف بخدمتك في أي وقت',
            'الله معك! لو تحتاج شيء، راجعنا على طول 💙',
            'في أمان الله! شكراً لتواصلك معنا 🌟'
        ] : [
            'Goodbye! 👋 Always here to help',
            'Take care! Come back anytime 💙',
            'Bye! Thanks for chatting with us 🌟'
        ];
        return bye[Math.floor(Math.random() * bye.length)];
    }
    
    // ===== أسئلة عامة - رد ذكي =====
    // تحليل السؤال ومحاولة الرد بشكل إبداعي
    const questionWords = ['كيف', 'ليش', 'متى', 'وين', 'مين', 'كم', 'هل', 'إيش', 'شنو', 'how', 'why', 'when', 'where', 'who', 'what', 'which', 'can', 'do', 'is', 'are'];
    const isQuestion = questionWords.some(w => msg.includes(w)) || msg.includes('؟') || msg.includes('?');
    
    if (isQuestion) {
        return langIsArabic
            ? '🤔 سؤال جميل!\n\nأنا متخصص في خدمات التوصيل، لكن دايماً أحاول أساعد.\n\nلو سؤالك عن:\n• 📦 التوصيل والشحن\n• 💰 الأسعار والعروض\n• 🏢 حلول الشركات\n• 💼 فرص العمل\n\nاسأل وأنا جاهز! أو وضّحلي أكثر عن اللي تحتاجه 😊'
            : '🤔 Great question!\n\nI specialize in delivery services, but always try to help.\n\nIf you\'re asking about:\n• 📦 Delivery & shipping\n• 💰 Pricing & offers\n• 🏢 Business solutions\n• 💼 Job opportunities\n\nAsk away! Or tell me more about what you need 😊';
    }
    
    // ===== رد افتراضي إبداعي للكلام العام =====
    const defaultReplies = langIsArabic ? [
        '👋 أنا مساعد OneTrip الذكي!\n\nممكن أساعدك في:\n• معرفة الأسعار\n• أوقات التوصيل\n• تتبع الشحنات\n• حلول الشركات\n• فرص التوظيف\n\nجرّب تسألني أي شيء! 🚀',
        '🌟 أهلاً بك!\n\nأخبرني كيف أقدر أخدمك اليوم؟\n\nأقدر أساعدك في كل ما يخص التوصيل والشحن داخل المملكة. اسأل بحرية!',
        '😊 نورت!\n\nاكتبلي سؤالك أو استفسارك وأنا جاهز أساعدك.\n\nمثلاً: "كم سعر التوصيل داخل الرياض؟" أو "أبغى أعرف عن حلول الشركات"'
    ] : [
        '👋 I\'m the OneTrip Smart Assistant!\n\nI can help with:\n• Pricing info\n• Delivery times\n• Shipment tracking\n• Business solutions\n• Job opportunities\n\nTry asking me anything! 🚀',
        '🌟 Welcome!\n\nHow can I help you today?\n\nI can assist with all delivery & logistics questions across Saudi Arabia!',
        '😊 Hi there!\n\nType your question and I\'ll do my best to help.\n\nFor example: "How much for delivery in Riyadh?" or "Tell me about business solutions"'
    ];
    
    return defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
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
