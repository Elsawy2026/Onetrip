// ==========================================
// OneTrip Express - Premium Edition
// Professional JavaScript
// ==========================================

// ===== PRELOADER =====
function hidePreloader() {
    const preloader = document.getElementById("preloader");
    if (preloader) {
        preloader.classList.add("hidden");
        preloader.style.opacity = "0";
        preloader.style.visibility = "hidden";
        preloader.style.pointerEvents = "none";
        setTimeout(() => { preloader.style.display = "none"; }, 500);
    }
}

window.addEventListener("load", () => {
    setTimeout(() => {
        hidePreloader();
        if (typeof startCounterAnimations === "function") {
            startCounterAnimations();
        }
    }, 800);
});

setTimeout(hidePreloader, 3000);
document.addEventListener("DOMContentLoaded", () => setTimeout(hidePreloader, 1500));

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
// Make toggleChat globally accessible
window.toggleChat = function() {
    const chatWidget = document.getElementById('chatWidget');
    const chatToggle = document.getElementById('chatToggle');
    const badge = document.querySelector('.chat-badge');
    
    console.log('toggleChat called', { chatWidget, chatToggle, badge });
    
    if (!chatWidget) {
        console.error('chatWidget not found!');
        return;
    }
    
    const isOpening = !chatWidget.classList.contains('active');
    chatWidget.classList.toggle('active');
    
    console.log('Chat toggled, isOpening:', isOpening, 'has active class:', chatWidget.classList.contains('active'));
    
    if (isOpening) {
        // عند الفتح أخفي البادج
        if (badge) badge.style.display = 'none';
    } else {
        // عند الإغلاق امسح المحادثة وارجع رسالة الترحيب فقط
        if (typeof resetChatConversation === 'function') {
            resetChatConversation();
        }
        if (badge) badge.style.display = 'flex';
    }
};

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
    
    // ===== بيانات الشركة الحقيقية =====
    const companyData = {
        drivers: 500,
        admins: 50,
        totalStaff: 550,
        cities: 25,
        dailyOrders: 10000,
        monthlyOrders: 300000,
        partners: 11,
        vehicles: 600,
        customerSatisfaction: 98.5,
        onTimeRate: 97,
        founded: 2020,
        headquarters: 'الرياض',
        branches: 5,
        branchNamesAr: ['الرياض (الفرع الرئيسي)', 'الدمام', 'القصيم', 'أبها', 'تبوك'],
        branchNamesEn: ['Riyadh (HQ)', 'Dammam', 'Qassim', 'Abha', 'Tabuk'],
        branchesDetail: [
            {
                key: 'riyadh',
                cityAr: 'الرياض',
                titleAr: 'الفرع الرئيسي - الرياض',
                descriptionAr: 'الفرع الرئيسي لإدارة وتشغيل عمليات OneTrip Express على مستوى المملكة.',
                mapsUrl: 'https://maps.app.goo.gl/ghVH2zxcGERUGZyp7',
                titleEn: 'Head Office - Riyadh',
                descriptionEn: 'Main hub for OneTrip Express operations across the Kingdom.'
            },
            {
                key: 'dammam',
                cityAr: 'الدمام',
                titleAr: 'فرع الدمام',
                descriptionAr: 'يغطي المنطقة الشرقية (الدمام، الخبر، الظهران وما حولها) بفرق تشغيل ومناديب ميدانيين.',
                mapsUrl: 'https://maps.google.com/?cid=319296445866694874&entry=gps&g_st=aw',
                titleEn: 'Dammam Branch',
                descriptionEn: 'Serving the Eastern Region (Dammam, Khobar, Dhahran and nearby areas).'
            },
            {
                key: 'qassim',
                cityAr: 'القصيم',
                titleAr: 'فرع القصيم',
                descriptionAr: 'يدير عمليات التوصيل داخل القصيم والمدن المجاورة بخدمة سريعة وموجهة للمتاجر والمطاعم.',
                mapsUrl: 'https://maps.app.goo.gl/xVCiq7yBMjZzVZjN6?g_st=aw',
                titleEn: 'Qassim Branch',
                descriptionEn: 'Handling deliveries across Qassim and nearby cities for stores and restaurants.'
            },
            {
                key: 'abha',
                cityAr: 'أبها',
                titleAr: 'فرع أبها',
                descriptionAr: 'يخدم المنطقة الجنوبية مع تركيز على المدن السياحية والمناطق الجبلية.',
                mapsUrl: 'https://maps.google.com', // placeholder
                titleEn: 'Abha Branch',
                descriptionEn: 'Serving the Southern region with focus on tourist and mountain areas.'
            },
            {
                key: 'tabuk',
                cityAr: 'تبوك',
                titleAr: 'فرع تبوك',
                descriptionAr: 'نقطة تشغيل رئيسية لخدمة منطقة تبوك والمدن المحيطة بها.',
                mapsUrl: 'https://www.google.com/maps/place/%D9%85%D8%B4%D9%88%D8%A7%D8%B1+%D9%88%D8%A7%D8%AD%D8%AF+%D9%84%D9%84%D8%AE%D8%AF%D9%85%D8%A7%D8%AA+%D8%A7%D9%84%D9%84%D9%88%D8%AC%D8%B3%D8%AA%D9%8A%D8%A9%E2%80%AD/@28.3891144,36.555895,17z/data=!3m1!4b1!4m6!3m5!1s0x15a9ad13398d743d:0xf42647b481f7750f!8m2!3d28.3891144!4d36.555895!16s%2Fg%2F11y6khw94f?entry=ttu',
                titleEn: 'Tabuk Branch',
                descriptionEn: 'Main operations point for Tabuk region and surrounding cities.'
            }
        ]
    };
    
    // ===== التحيات =====
    if (has(['hello', 'hi', 'hey', 'مرحبا', 'السلام', 'اهلا', 'هلا', 'صباح', 'مساء', 'كيفك', 'شخبارك', 'هاي'])) {
        const greetings = langIsArabic ? [
            'أهلاً وسهلاً! 😊 أنا مساعد OneTrip الذكي. كيف أقدر أساعدك اليوم؟',
            'هلا والله! نورت 🌟 معك فريق من ' + companyData.totalStaff + ' شخص جاهزين لخدمتك!',
            'مرحبا بك في OneTrip Express! 🚀 نوصّل أكثر من ' + companyData.dailyOrders.toLocaleString() + ' طلب يومياً، كيف نخدمك؟',
            'حياك الله! 💫 أنا هنا أساعدك على مدار الساعة. تفضل اسأل!'
        ] : [
            'Hi there! 😊 I\'m the OneTrip Smart Assistant. How can I help?',
            'Hello! Welcome to OneTrip Express 🚀 Serving ' + companyData.dailyOrders.toLocaleString() + '+ daily orders!',
            'Hey! Great to have you 💫 Ask me anything about our services!'
        ];
        return greetings[Math.floor(Math.random() * greetings.length)];
    }
    
    // ===== عدد المناديب والموظفين =====
    if (has(['مندوب', 'مناديب', 'سائق', 'سائقين', 'driver', 'drivers', 'عدد', 'كم عندكم', 'كم مندوب', 'فريق', 'team', 'موظف', 'موظفين', 'staff', 'employee'])) {
        return langIsArabic
            ? '👥 فريق OneTrip Express:\n\n🚴 ' + companyData.drivers + ' مندوب توصيل محترف\n👔 ' + companyData.admins + ' موظف إداري وتشغيلي\n🚗 ' + companyData.vehicles + ' مركبة متنوعة (دراجات، سيارات، فانات)\n\n📍 منتشرين في ' + companyData.cities + ' مدينة\n🏢 ' + companyData.branches + ' فرع تشغيلي\n\nكلهم مدربين على أعلى معايير الجودة والسلامة! 💪'
            : '👥 OneTrip Express Team:\n\n🚴 ' + companyData.drivers + ' Professional Drivers\n👔 ' + companyData.admins + ' Admin & Operations Staff\n🚗 ' + companyData.vehicles + ' Vehicles (bikes, cars, vans)\n\n📍 Operating in ' + companyData.cities + ' cities\n🏢 ' + companyData.branches + ' operational branches\n\nAll trained to the highest quality standards! 💪';
    }

    // ===== الفروع بالتفصيل (كل الفروع) =====
    if (has(['الفروع', 'فروعكم', 'وين فروعكم', 'وين فروع', 'فروع', 'فرع', 'branches', 'all branches', 'locations', 'المواقع', 'branch', 'location'])) {
        let responseAr = '🏢 فروع OneTrip Express (' + companyData.branches + ' فروع):\n\n';
        let responseEn = '🏢 OneTrip Express Branches (' + companyData.branches + ' branches):\n\n';
        
        companyData.branchesDetail.forEach((branch, index) => {
            responseAr += (index + 1) + '. ' + branch.titleAr + '\n';
            responseAr += '   ' + branch.descriptionAr + '\n';
            responseAr += '   📍 الموقع: ' + branch.mapsUrl + '\n\n';
            
            responseEn += (index + 1) + '. ' + branch.titleEn + '\n';
            responseEn += '   ' + branch.descriptionEn + '\n';
            responseEn += '   📍 Location: ' + branch.mapsUrl + '\n\n';
        });
        
        responseAr += '💡 يمكنك الضغط على أي رابط لفتح الموقع على الخريطة مباشرة!';
        responseEn += '💡 Click any link to open the location on the map!';
        
        return langIsArabic ? responseAr : responseEn;
    }
        return langIsArabic
            ? '🏢 فروع OneTrip Express الحالية (' + companyData.branches + ' فروع):\n\n' +
              listAr +
              '\n\n📍 الدمام (الخريطة): ' + companyData.branchesDetail.find(b => b.key === 'dammam').mapsUrl +
              '\n📍 القصيم (الخريطة): ' + companyData.branchesDetail.find(b => b.key === 'qassim').mapsUrl +
              '\n📍 تبوك (الخريطة): ' + companyData.branchesDetail.find(b => b.key === 'tabuk').mapsUrl +
              '\n\nاسألني عن أي فرع بالتحديد وأعطيك التفاصيل كاملة 😉'
            : '🏢 OneTrip Express Branches (' + companyData.branches + ' branches):\n\n' +
              listEn +
              '\n\n📍 Dammam map: ' + companyData.branchesDetail.find(b => b.key === 'dammam').mapsUrl +
              '\n📍 Qassim map: ' + companyData.branchesDetail.find(b => b.key === 'qassim').mapsUrl +
              '\n📍 Tabuk map: ' + companyData.branchesDetail.find(b => b.key === 'tabuk').mapsUrl +
              '\n\nAsk me about any specific branch for more details 😉';
    }

    // ===== فرع الدمام =====
    if (has(['فرع الدمام', 'الدمام', 'dammam'])) {
        const b = companyData.branchesDetail.find(x => x.key === 'dammam');
        return langIsArabic
            ? '📍 ' + b.titleAr + ':\n\n' +
              b.descriptionAr +
              '\n\n🌍 رابط الخريطة (Google Maps):\n' + b.mapsUrl +
              '\n\nتقدر تضغط على الرابط وتتنقل مباشرة للفرع 😉'
            : '📍 ' + b.titleEn + ':\n\n' +
              b.descriptionEn +
              '\n\n🌍 Google Maps link:\n' + b.mapsUrl;
    }

    // ===== فرع تبوك =====
    if (has(['فرع تبوك', 'تبوك', 'tabuk'])) {
        const b = companyData.branchesDetail.find(x => x.key === 'tabuk');
        return langIsArabic
            ? '📍 ' + b.titleAr + ':\n\n' +
              b.descriptionAr +
              '\n\n🌍 رابط الخريطة (Google Maps):\n' + b.mapsUrl +
              '\n\nموقع دقيق للفرع في تبوك ✅'
            : '📍 ' + b.titleEn + ':\n\n' +
              b.descriptionEn +
              '\n\n🌍 Google Maps link:\n' + b.mapsUrl;
    }

    // ===== فرع القصيم =====
    if (has(['فرع القصيم', 'القصيم', 'qassim'])) {
        const b = companyData.branchesDetail.find(x => x.key === 'qassim');
        return langIsArabic
            ? '📍 ' + b.titleAr + ':\n\n' +
              b.descriptionAr +
              '\n\n🌍 رابط الخريطة (Google Maps):\n' + b.mapsUrl +
              '\n\nتقدر تستخدم الرابط للوصول للفرع مباشرة 🚗'
            : '📍 ' + b.titleEn + ':\n\n' +
              b.descriptionEn +
              '\n\n🌍 Google Maps link:\n' + b.mapsUrl;
    }
    
    // ===== الإحصائيات والأرقام =====
    if (has(['احصائيات', 'ارقام', 'statistics', 'numbers', 'انجازات', 'achievements', 'حجم', 'volume', 'كم طلب', 'كم توصيل'])) {
        return langIsArabic
            ? '📊 إحصائيات OneTrip Express:\n\n📦 ' + companyData.dailyOrders.toLocaleString() + '+ طلب يومياً\n📈 ' + companyData.monthlyOrders.toLocaleString() + '+ طلب شهرياً\n⭐ ' + companyData.customerSatisfaction + '% رضا العملاء\n⏱️ ' + companyData.onTimeRate + '% التزام بالمواعيد\n🤝 ' + companyData.partners + ' شريك استراتيجي\n🏙️ ' + companyData.cities + ' مدينة مغطاة\n\nأرقام نفتخر فيها! 🏆'
            : '📊 OneTrip Express Statistics:\n\n📦 ' + companyData.dailyOrders.toLocaleString() + '+ daily orders\n📈 ' + companyData.monthlyOrders.toLocaleString() + '+ monthly orders\n⭐ ' + companyData.customerSatisfaction + '% customer satisfaction\n⏱️ ' + companyData.onTimeRate + '% on-time delivery\n🤝 ' + companyData.partners + ' strategic partners\n🏙️ ' + companyData.cities + ' cities covered\n\nNumbers we\'re proud of! 🏆';
    }
    
    // ===== الشركاء =====
    if (has(['شريك', 'شركاء', 'partner', 'partners', 'تعاون', 'collaboration', 'جاهز', 'هنقرستيشن', 'مرسول', 'كيتا', 'hungerstation', 'jahez', 'mrsool', 'keeta', 'نينجا', 'إيمايل', 'ninja', 'imile'])) {
        return langIsArabic
            ? '🤝 شركاؤنا في الريادة:\n\n✅ جاهز (Jahez): نقدم لها عمليات توصيل دقيقة تلبي توقعات ملايين المستخدمين\n✅ هنقرستيشن (HungerStation): نشاركهم في تقديم خدمة لوجستية موثوقة وعالية الجودة\n✅ كيتا (KEETA): نترجم التقنية والمرونة إلى تجربة توصيل مميزة\n✅ ذا شيفز (The Chefz): نُوصل الإبداع والمذاق الرفيع بدقة وأناقة\n✅ نينجا (Ninja): نعمل بسرعة ومرونة لنخدم هذا الكيان العصري بأعلى كفاءة\n✅ إيمايل (imile): نحقق التكامل بين التقنية والخدمة لضمان رضا عملائهم\n✅ مرسول (Mrsool)\n✅ تو يو (ToYou)\n✅ أرامكس (Aramex)\n✅ SMSA\n✅ ناقل (Naqel)\n\n' + companyData.partners + ' شركاء يثقون فينا! نقيس نجاحنا بمدى قوة العلاقات التي نبنيها مع شركائنا 💙'
            : '🤝 Our Partners in Leadership:\n\n✅ Jahez: Precise delivery operations meeting millions of users\' expectations\n✅ HungerStation: Reliable, high-quality logistics services\n✅ KEETA: Translating technology and flexibility into exceptional delivery\n✅ The Chefz: Delivering creativity and fine taste with precision\n✅ Ninja: Fast, flexible service for this modern entity\n✅ imile: Integrating technology and service for customer satisfaction\n✅ Mrsool\n✅ ToYou\n✅ Aramex\n✅ SMSA\n✅ Naqel\n\n' + companyData.partners + ' partners trust us! We measure success by the strength of relationships 💙';
    }
    
    // ===== تاريخ الشركة =====
    if (has(['تاريخ', 'بداية', 'متى تأسست', 'تأسيس', 'history', 'founded', 'started', 'beginning', 'قصة', 'story', 'نشأة'])) {
        return langIsArabic
            ? '📜 قصة OneTrip Express:\n\n🚀 تأسست عام ' + companyData.founded + ' في الرياض\n💡 بدأنا بـ 10 مناديب وحلم كبير\n📈 اليوم: ' + companyData.drivers + ' مندوب في ' + companyData.cities + ' مدينة!\n\n🎯 رؤيتنا: نكون الخيار الأول للتوصيل في المملكة\n💪 قيمنا: السرعة، الأمانة، الاحترافية\n\nمن شركة ناشئة إلى شريك لأكبر المنصات! هذي قصتنا وأنت جزء منها 🌟'
            : '📜 OneTrip Express Story:\n\n🚀 Founded in ' + companyData.founded + ' in Riyadh\n💡 Started with 10 drivers and a big dream\n📈 Today: ' + companyData.drivers + ' drivers across ' + companyData.cities + ' cities!\n\n🎯 Vision: Be the #1 delivery choice in KSA\n💪 Values: Speed, Trust, Professionalism\n\nFrom startup to major platform partner! 🌟';
    }
    
    // ===== التقنية والأنظمة =====
    if (has(['تقنية', 'نظام', 'تطبيق', 'سيستم', 'technology', 'tech', 'system', 'app', 'api', 'برنامج', 'software', 'ذكي', 'smart', 'ai'])) {
        return langIsArabic
            ? '🔧 تقنياتنا المتقدمة:\n\n📱 تطبيق ذكي للمناديب بـ GPS مباشر\n🗺️ نظام توزيع طلبات بالذكاء الاصطناعي\n📊 لوحة تحكم متقدمة للعملاء\n🔗 API للربط مع أي نظام\n📍 تتبع لحظي دقيق للشحنات\n📈 تقارير وتحليلات مفصلة\n\nنستثمر بقوة في التقنية عشان نقدم أفضل خدمة! 💡'
            : '🔧 Our Advanced Technology:\n\n📱 Smart driver app with live GPS\n🗺️ AI-powered order distribution\n📊 Advanced client dashboard\n🔗 API for system integration\n📍 Precise real-time tracking\n📈 Detailed reports & analytics\n\nWe invest heavily in tech for the best service! 💡';
    }
    
    // ===== المركبات والأسطول =====
    if (has(['سيارة', 'سيارات', 'مركبة', 'اسطول', 'دراجة', 'فان', 'vehicle', 'car', 'fleet', 'bike', 'van', 'شاحنة', 'truck'])) {
        return langIsArabic
            ? '🚗 أسطولنا المتنوع:\n\n🏍️ 300+ دراجة نارية للتوصيل السريع\n🚗 200+ سيارة للطلبات المتوسطة\n🚐 100+ فان للشحنات الكبيرة\n\n✨ كل المركبات:\n• مجهزة بـ GPS\n• مؤمنة بالكامل\n• صيانة دورية\n• نظيفة ومرتبة\n\nأسطول جاهز لأي نوع توصيل! 🚀'
            : '🚗 Our Diverse Fleet:\n\n🏍️ 300+ motorcycles for express delivery\n🚗 200+ cars for medium orders\n🚐 100+ vans for large shipments\n\n✨ All vehicles are:\n• GPS equipped\n• Fully insured\n• Regularly maintained\n• Clean & organized\n\nReady for any delivery type! 🚀';
    }
    
    // ===== الأسعار =====
    if (has(['سعر', 'الأسعار', 'التكلفة', 'كم سعر', 'بكم', 'تكلف', 'price', 'pricing', 'cost', 'rate', 'fee', 'رخيص', 'غالي', 'cheap', 'expensive'])) {
        return langIsArabic
            ? '💰 أسعارنا التنافسية:\n\n📍 داخل المدينة: من 15-35 ريال\n🏙️ بين المدن: من 45-150 ريال\n⚡ توصيل عاجل: +15 ريال\n🏢 عقود الشركات: خصم يصل 40%!\n\n🎁 عروض حالية:\n• أول طلب مجاني للشركات الجديدة\n• خصم 20% للطلبات فوق 50 شهرياً\n\nأخبرني عن احتياجك وأجهّزلك عرض خاص! 🎯'
            : '💰 Our Competitive Pricing:\n\n📍 Same-city: 15-35 SAR\n🏙️ Inter-city: 45-150 SAR\n⚡ Express delivery: +15 SAR\n🏢 Business contracts: Up to 40% off!\n\n🎁 Current offers:\n• First order free for new businesses\n• 20% off for 50+ monthly orders\n\nTell me your needs for a custom quote! 🎯';
    }
    
    // ===== مدة التوصيل =====
    if (has(['وقت', 'مدة', 'كم ساعه', 'كم يوم', 'متى يوصل', 'سريع', 'فوري', 'delivery time', 'how long', 'fast', 'quick', 'urgent', 'express', 'ساعة', 'يوم'])) {
        return langIsArabic
            ? '⚡ سرعة التوصيل (نلتزم فيها ' + companyData.onTimeRate + '% من الوقت!):\n\n🏃 توصيل عاجل: 30-60 دقيقة\n🚀 داخل المدينة: 1-4 ساعات\n🏙️ بين المدن القريبة: نفس اليوم\n📦 بين المدن البعيدة: 24-48 ساعة\n\n⏰ نلتزم بالموعد أو نعوّضك!\nهذا وعد من ' + companyData.totalStaff + ' شخص يعملون لأجلك 💪'
            : '⚡ Delivery Speed (' + companyData.onTimeRate + '% on-time rate!):\n\n🏃 Express: 30-60 minutes\n🚀 Same-city: 1-4 hours\n🏙️ Nearby cities: Same day\n📦 Far cities: 24-48 hours\n\n⏰ On time or we compensate!\nA promise from ' + companyData.totalStaff + ' team members 💪';
    }
    
    // ===== التتبع =====
    if (has(['تتبع', 'تراك', 'وين طلبي', 'وصل فين', 'tracking', 'track', 'where', 'status', 'شحنة', 'shipment'])) {
        return langIsArabic
            ? '📍 نظام التتبع الذكي:\n\n🗺️ خريطة حية لموقع المندوب\n🔔 إشعارات فورية بكل تحديث\n📱 رابط تتبع لك ولعميلك\n⏱️ وقت وصول متوقع دقيق\n📊 سجل كامل للشحنة\n\n🔗 للشركات: API للربط المباشر مع أنظمتكم\n\nشاركني رقم الطلب وأخبرك وين وصل! 🔍'
            : '📍 Smart Tracking System:\n\n🗺️ Live driver location map\n🔔 Instant status notifications\n📱 Tracking link for you & your customer\n⏱️ Accurate ETA\n📊 Complete shipment history\n\n🔗 For businesses: Direct API integration\n\nShare your order number to check status! 🔍';
    }
    
    // ===== الشركات والمطاعم =====
    if (has(['شركة', 'شركات', 'بيزنس', 'منشأة', 'مطعم', 'متجر', 'تطبيق', 'business', 'b2b', 'contract', 'restaurant', 'store', 'enterprise', 'corporate', 'عقد', 'اتفاقية', 'شراكة'])) {
        return langIsArabic
            ? '🏢 حلول الشركات (نخدم ' + companyData.partners + ' شركاء كبار!):\n\n✅ أسطول مخصص لشركتك\n✅ مدير حساب شخصي\n✅ لوحة تحكم وتقارير\n✅ تكامل API كامل\n✅ فواتير شهرية مرنة\n✅ أسعار خاصة (خصم 40%)\n✅ دعم فني 24/7\n\n🎯 نخدم: مطاعم، متاجر، منصات، شركات\n\nقولي عن نشاطك وأجهّزلك حل متكامل! 🤝'
            : '🏢 Business Solutions (Serving ' + companyData.partners + ' major partners!):\n\n✅ Dedicated fleet for your business\n✅ Personal account manager\n✅ Dashboard & reports\n✅ Full API integration\n✅ Flexible monthly billing\n✅ Special rates (40% off)\n✅ 24/7 support\n\n🎯 We serve: Restaurants, stores, platforms, companies\n\nTell me about your business! 🤝';
    }
    
    // ===== المدن والتغطية =====
    if (has(['مدينة', 'مدن', 'الرياض', 'جدة', 'مكة', 'الدمام', 'coverage', 'cities', 'area', 'region', 'تغطية', 'منطقة', 'نوصل', 'خميس', 'ابها', 'تبوك', 'الطائف'])) {
        return langIsArabic
            ? '🗺️ تغطيتنا (' + companyData.cities + ' مدينة!):\n\n🏙️ المنطقة الوسطى:\nالرياض، القصيم، حائل\n\n🌊 المنطقة الغربية:\nجدة، مكة، المدينة، الطائف\n\n🏖️ المنطقة الشرقية:\nالدمام، الخبر، الظهران، الأحساء\n\n🏔️ المنطقة الجنوبية:\nأبها، خميس مشيط، جازان\n\n🏜️ المنطقة الشمالية:\nتبوك، عرعر، سكاكا\n\nوتتوسع أسبوعياً! 📍'
            : '🗺️ Our Coverage (' + companyData.cities + ' cities!):\n\n🏙️ Central: Riyadh, Qassim, Hail\n🌊 Western: Jeddah, Makkah, Madinah, Taif\n🏖️ Eastern: Dammam, Khobar, Dhahran, Ahsa\n🏔️ Southern: Abha, Khamis, Jazan\n🏜️ Northern: Tabuk, Arar, Sakaka\n\nExpanding weekly! 📍';
    }
    
    // ===== الوظائف =====
    if (has(['وظيفة', 'توظيف', 'وظائف', 'شغل', 'عمل', 'career', 'job', 'join', 'hiring', 'work', 'راتب', 'salary'])) {
        return langIsArabic
            ? '💼 انضم لعائلة OneTrip (' + companyData.totalStaff + ' زميل!):\n\n🚴 مناديب توصيل:\n• راتب 4000-7000 ريال + حوافز\n• مرونة في الدوام\n• تأمين صحي\n\n👔 وظائف إدارية:\n• عمليات ومشرفين\n• خدمة عملاء\n• تقنية وتطوير\n• مبيعات وتسويق\n\n✨ مميزاتنا: بيئة عمل محفزة، فرص ترقي، تدريب مستمر\n\nقدّم الآن من صفحة الوظائف! 📄'
            : '💼 Join OneTrip Family (' + companyData.totalStaff + ' colleagues!):\n\n🚴 Delivery Drivers:\n• 4000-7000 SAR + bonuses\n• Flexible hours\n• Health insurance\n\n👔 Office Positions:\n• Operations & supervisors\n• Customer service\n• Tech & development\n• Sales & marketing\n\n✨ Benefits: Great culture, growth opportunities, continuous training\n\nApply through our Careers page! 📄';
    }
    
    // ===== التواصل =====
    if (has(['تواصل', 'رقم', 'تليفون', 'جوال', 'ايميل', 'بريد', 'contact', 'email', 'phone', 'number', 'call', 'اتصل', 'كلم', 'عنوان', 'address', 'موقع', 'location'])) {
        return langIsArabic
            ? '📞 بيانات التواصل:\n\n☎️ الهاتف: 920032104\n📧 البريد الإلكتروني: info@onetrip.sa\n💬 واتساب: متاح 24/7\n\n📍 العنوان:\nhttps://maps.app.goo.gl/ga8NvdxSEWAso8B7A?g_st=iw\n\n🕐 ساعات العمل:\nالدعم الفني: 24 ساعة / 7 أيام\nالإدارة: 8ص - 6م\n\nأو أكمل محادثتك معي هنا! أنا متاح دائماً 😊'
            : '📞 Contact Information:\n\n☎️ Phone: 920032104\n📧 Email: info@onetrip.sa\n💬 WhatsApp: Available 24/7\n\n📍 Address:\nhttps://maps.app.goo.gl/ga8NvdxSEWAso8B7A?g_st=iw\n\n🕐 Working Hours:\nSupport: 24/7\nOffice: 8AM - 6PM\n\nOr continue chatting here! Always available 😊';
    }
    
    // ===== الشكاوي والمشاكل =====
    if (has(['مشكلة', 'شكوى', 'تأخر', 'ضايع', 'مكسور', 'problem', 'issue', 'complaint', 'late', 'lost', 'damaged', 'broken', 'زعلان', 'غلط', 'خطأ'])) {
        return langIsArabic
            ? '😔 نأسف لأي إزعاج!\n\n⚡ سياستنا: حل المشكلة خلال 24 ساعة\n\nأخبرني بـ:\n• رقم الطلب\n• تفاصيل المشكلة\n• وقت الحدوث\n\n✅ ضماناتنا:\n• تعويض على التأخير\n• تعويض على التلف\n• استرداد كامل إذا لزم\n\nفريق من ' + companyData.admins + ' موظف جاهز يساعدك! 🙏'
            : '😔 Sorry for any inconvenience!\n\n⚡ Our policy: Resolve within 24 hours\n\nPlease share:\n• Order number\n• Issue details\n• When it happened\n\n✅ Our guarantees:\n• Compensation for delays\n• Compensation for damage\n• Full refund if needed\n\n' + companyData.admins + ' staff ready to help! 🙏';
    }
    
    // ===== الدفع =====
    if (has(['دفع', 'فلوس', 'كاش', 'فيزا', 'تحويل', 'payment', 'pay', 'cash', 'visa', 'card', 'مدى', 'apple pay', 'stc'])) {
        return langIsArabic
            ? '💳 طرق الدفع:\n\n💵 كاش عند الاستلام\n💳 مدى / فيزا / ماستركارد\n📱 Apple Pay\n📱 STC Pay\n🏦 تحويل بنكي (للشركات)\n📄 فواتير شهرية (للعقود)\n\n🔒 كل المعاملات مشفرة وآمنة\n✅ فواتير ضريبية معتمدة\n\nاختار الطريقة المناسبة لك! 💰'
            : '💳 Payment Methods:\n\n💵 Cash on delivery\n💳 Mada / Visa / Mastercard\n📱 Apple Pay\n📱 STC Pay\n🏦 Bank transfer (businesses)\n📄 Monthly invoices (contracts)\n\n🔒 All transactions encrypted & secure\n✅ Official tax invoices\n\nChoose what works for you! 💰';
    }
    
    // ===== طلب خدمة =====
    if (has(['طلب', 'اطلب', 'ابغى', 'عايز', 'محتاج', 'order', 'request', 'need', 'want', 'book', 'حجز'])) {
        return langIsArabic
            ? '📦 جاهزين نخدمك!\n\n🔹 طريقة الطلب:\n1️⃣ اضغط "اطلب خدمة" بالموقع\n2️⃣ حدد نوع التوصيل\n3️⃣ أدخل العناوين\n4️⃣ احصل على السعر والتأكيد!\n\n⚡ أو قولي مباشرة:\n• إيش تبغى توصّل؟\n• من وين لوين؟\n• متى تحتاجه؟\n\nوأساعدك أجهّز كل شيء! 🚀'
            : '📦 Ready to serve!\n\n🔹 How to order:\n1️⃣ Click "Request Service"\n2️⃣ Select delivery type\n3️⃣ Enter addresses\n4️⃣ Get price & confirmation!\n\n⚡ Or tell me directly:\n• What to deliver?\n• From where to where?\n• When needed?\n\nI\'ll help set everything up! 🚀';
    }
    
    // ===== من نحن =====
    if (has(['من نحن', 'من انتم', 'مين انتو', 'من هي', 'who are you', 'what is', 'about', 'onetrip', 'ون تريب', 'وان تريب', 'شركة', 'company'])) {
        return langIsArabic
            ? '🚀 OneTrip Express - التوصيل الذكي\n\nفي عالم لا يعرف التباطؤ، تبرز OneTrip Express كمزود لخدمة توصيل تجمع بين السرعة والدقة والاحترافية، مقدّمة لك تجربة استثنائية مدعومة بالتقنية الحديثة.\n\n📍 من نحن:\nنحن شركة سعودية تقدم خدمات توصيل داخل المدن وحلول لوجستية متكاملة للأفراد والشركات، معتمدة على تقنيات متقدمة وأنظمة تشغيل عالية الكفاءة.\n\n💡 فلسفتنا:\nلسنا مجرد وسيط بين النقطة (أ) والنقطة (ب)، بل نمثل امتدادًا لأعمالك، وواجهة تعبّر عن جودة خدماتك وتزيد من ثقة عملائك.\n\n📊 أرقامنا:\n👥 ' + companyData.totalStaff + ' موظف | 🚗 ' + companyData.vehicles + ' مركبة | 🏙️ ' + companyData.cities + ' مدينة | 📦 ' + companyData.dailyOrders.toLocaleString() + '+ طلب يومياً'
            : '🚀 OneTrip Express - Smart Delivery\n\nIn a world that knows no slowdown, OneTrip Express stands out as a delivery service provider combining speed, precision, and professionalism, offering an exceptional experience powered by modern technology.\n\n📍 Who We Are:\nA Saudi company providing city delivery services and integrated logistics solutions for individuals and businesses, relying on advanced technologies and highly efficient operating systems.\n\n💡 Our Philosophy:\nWe are not just an intermediary between point (A) and point (B), but rather an extension of your business, an interface that reflects the quality of your services and enhances your customers\' trust.\n\n📊 Our Numbers:\n👥 ' + companyData.totalStaff + ' staff | 🚗 ' + companyData.vehicles + ' vehicles | 🏙️ ' + companyData.cities + ' cities | 📦 ' + companyData.dailyOrders.toLocaleString() + '+ daily orders';
    }
    
    // ===== الرؤية والرسالة =====
    if (has(['رؤية', 'رؤيتكم', 'رؤيتنا', 'vision', 'رسالة', 'رسالتكم', 'mission', 'هدف', 'اهداف', 'goal', 'goals'])) {
        return langIsArabic
            ? '🎯 رؤيتنا:\nأن نكون الخيار الأول في مجال التوصيل داخل المدن، والاسم الذي يتبادر إلى الذهن عند البحث عن حلول توصيل ذكية، مرنة، وسريعة.\n\n💫 رسالتنا:\nنوفّر تجربة توصيل موثوقة وسلسة تدعم نمو أعمال شركائنا، تبدأ من لحظة الانطلاق وتنتهي عند باب العميل.\n\n🚀 هدفنا:\nنسعى للتوسع بخطى مدروسة لتغطية أكبر عدد من المدن والمناطق الحيوية، مع الحفاظ على أعلى درجات الكفاءة والاحتراف، من خلال اعتماد أحدث الأدوات والتقنيات التي تواكب متطلبات السوق المتغيرة.'
            : '🎯 Our Vision:\nTo be the first choice in city delivery, the name that comes to mind when looking for smart, flexible, and fast delivery solutions.\n\n💫 Our Mission:\nWe provide a reliable and seamless delivery experience that supports our partners\' business growth, from launch to customer doorstep.\n\n🚀 Our Goal:\nWe seek to expand carefully to cover the largest number of cities and vital areas, while maintaining the highest levels of efficiency and professionalism, through adopting the latest tools and technologies that keep pace with changing market requirements.';
    }
    
    // ===== القيم =====
    if (has(['قيم', 'قيمكم', 'قيمنا', 'values', 'مبادئ', 'principles'])) {
        return langIsArabic
            ? '💎 قيمنا:\n\n✅ الاعتمادية:\nنفي بوعودنا ونعمل بثقة.\n\n✅ الابتكار:\nنبحث دائمًا عن طرق جديدة لتحسين خدماتنا وتطوير أدواتنا.\n\n✅ الجودة:\nنضع معايير عالية في كل عملية توصيل.\n\n✅ الاحترافية:\nنتعامل مع كل طلب بأعلى درجات الالتزام لضمان تقديم نتائج ممتازة في كل مرة.'
            : '💎 Our Values:\n\n✅ Reliability:\nWe keep our promises and work with confidence.\n\n✅ Innovation:\nWe are always looking for new ways to improve our services and develop our tools.\n\n✅ Quality:\nWe set high standards in every delivery operation.\n\n✅ Professionalism:\nWe handle every order with the highest commitment to ensure excellent results every time.';
    }
    
    // ===== ماذا نقدم =====
    if (has(['ماذا نقدم', 'خدمات', 'خدماتكم', 'services', 'what do you offer', 'ماذا تقدمون', 'عروض', 'offers'])) {
        return langIsArabic
            ? '📦 ماذا نقدم؟\n\n⚡ توصيل فوري داخل المدن:\nحلول سريعة وآمنة للوصول إلى وجهتك دون تأخير.\n\n🏢 حلول لوجستية للمطاعم، المتاجر، والمنصات الرقمية:\nدعم تشغيلي يومي يعزز كفاءة أعمالك.\n\n🚗 إدارة وتشغيل أساطيل توصيل خاصة للشركات:\nخدمات مرنة ومتكاملة تساعدك على تقليل التكاليف ورفع الكفاءة.\n\n📋 عقود تشغيل مخصصة للشركاء التجاريين:\nشراكات مبنية على الأداء ونتائج قابلة للقياس.\n\n📊 تتبع مباشر، دعم متواصل، وتقارير مفصلة:\nشفافية تتيح لك الإشراف على كل خطوة في العملية.'
            : '📦 What We Offer:\n\n⚡ Instant City Delivery:\nFast and secure solutions to reach your destination without delay.\n\n🏢 Logistics Solutions for Restaurants, Stores, and Digital Platforms:\nDaily operational support that enhances your business efficiency.\n\n🚗 Management and Operation of Private Delivery Fleets for Companies:\nFlexible and integrated services that help reduce costs and increase efficiency.\n\n📋 Custom Operating Contracts for Business Partners:\nPartnerships based on performance and measurable results.\n\n📊 Live Tracking, Continuous Support, and Detailed Reports:\nTransparency that allows you to oversee every step of the process.';
    }
    
    // ===== لماذا OneTrip =====
    if (has(['لماذا', 'ليش', 'why', 'مميزات', 'advantages', 'benefits', 'مزايا', 'فوائد'])) {
        return langIsArabic
            ? '⭐ لماذا OneTrip Express؟\n\n🎯 واجهة مشرفة لعلامتك التجارية:\nنمثلك وكأننا جزء من فريقك.\n\n🤖 أنظمة تشغيل ذكية:\nتقنيات دقيقة تقلل الأخطاء وتسرّع الأداء.\n\n⏱️ التزام بالوقت والجودة:\nسرعة في الوصول ورضا مضمون لعملائك.\n\n🤝 شراكة طويلة الأمد:\nنهدف إلى بناء علاقات استراتيجية دائمة تعزز النمو المشترك.\n\n📈 تقارير أداء دقيقة:\nنمنحك بيانات واضحة تساعدك في تحسين عملياتك باستمرار.\n\n💪 كن جزءًا من التجربة:\nسواء كنت فردًا أو شركة، OneTrip Express هي خيارك الأمثل: سرعة، دقة، واحترافية.'
            : '⭐ Why OneTrip Express?\n\n🎯 Proud Interface for Your Brand:\nWe represent you as if we are part of your team.\n\n🤖 Smart Operating Systems:\nPrecise technologies that reduce errors and speed up performance.\n\n⏱️ Commitment to Time and Quality:\nFast delivery and guaranteed satisfaction for your customers.\n\n🤝 Long-term Partnership:\nWe aim to build lasting strategic relationships that enhance mutual growth.\n\n📈 Accurate Performance Reports:\nWe provide you with clear data that helps you continuously improve your operations.\n\n💪 Be Part of the Experience:\nWhether you are an individual or a company, OneTrip Express is your optimal choice: speed, precision, and professionalism.';
    }
    
    // ===== الجودة والضمان =====
    if (has(['جودة', 'ضمان', 'أمان', 'سلامة', 'quality', 'guarantee', 'safe', 'safety', 'secure', 'insurance', 'تأمين'])) {
        return langIsArabic
            ? '🛡️ معايير الجودة والأمان:\n\n✅ تأمين شامل على كل الشحنات\n✅ تدريب مستمر للمناديب\n✅ فحص دوري للمركبات\n✅ تغليف آمن للمنتجات الحساسة\n✅ سلسلة تبريد للمواد الغذائية\n✅ ' + companyData.customerSatisfaction + '% رضا العملاء\n✅ ' + companyData.onTimeRate + '% التزام بالمواعيد\n\nشحنتك بأمان معنا! 🔒'
            : '🛡️ Quality & Safety Standards:\n\n✅ Full insurance on all shipments\n✅ Continuous driver training\n✅ Regular vehicle inspection\n✅ Safe packaging for fragile items\n✅ Cold chain for food\n✅ ' + companyData.customerSatisfaction + '% customer satisfaction\n✅ ' + companyData.onTimeRate + '% on-time delivery\n\nYour shipment is safe with us! 🔒';
    }
    
    // ===== الشكر =====
    if (has(['شكر', 'شكراً', 'thanks', 'thank', 'مشكور', 'يعطيك', 'الله يعطيك', 'ممتاز', 'رائع', 'حلو', 'great', 'awesome', 'nice', 'good', 'perfect'])) {
        const thanks = langIsArabic ? [
            'العفو! سعيد إني قدرت أساعدك 😊 ' + companyData.totalStaff + ' شخص جاهزين لخدمتك دائماً!',
            'تسلم! نورتنا 🌟 لا تتردد ترجع في أي وقت!',
            'الشكر لك على ثقتك فينا! نعدك بأفضل خدمة دائماً 💙',
            'يسعدني خدمتك! أنت جزء من عائلة OneTrip الآن 🚀'
        ] : [
            'You\'re welcome! ' + companyData.totalStaff + ' team members always ready to help! 😊',
            'My pleasure! Come back anytime 🌟',
            'Thank YOU for trusting us! We promise the best service 💙',
            'Happy to help! You\'re part of the OneTrip family now 🚀'
        ];
        return thanks[Math.floor(Math.random() * thanks.length)];
    }
    
    // ===== الوداع =====
    if (has(['باي', 'مع السلامة', 'bye', 'goodbye', 'see you', 'الله معك', 'يلا', 'خلاص'])) {
        const bye = langIsArabic ? [
            'مع السلامة! 👋 ' + companyData.drivers + ' مندوب جاهزين لخدمتك أي وقت!',
            'الله معك! نتشرف بخدمتك دائماً 💙',
            'في أمان الله! شكراً لتواصلك مع OneTrip 🌟'
        ] : [
            'Goodbye! 👋 ' + companyData.drivers + ' drivers ready whenever you need!',
            'Take care! Always honored to serve you 💙',
            'Bye! Thanks for choosing OneTrip 🌟'
        ];
        return bye[Math.floor(Math.random() * bye.length)];
    }
    
    // ===== رد ذكي لأي سؤال آخر =====
    const questionWords = ['كيف', 'ليش', 'متى', 'وين', 'مين', 'كم', 'هل', 'إيش', 'شنو', 'ايش', 'how', 'why', 'when', 'where', 'who', 'what', 'which', 'can', 'do', 'is', 'are'];
    const isQuestion = questionWords.some(w => msg.includes(w)) || msg.includes('؟') || msg.includes('?');
    
    if (isQuestion) {
        return langIsArabic
            ? '🤔 سؤال ممتاز!\n\nأنا أعرف كل شيء عن OneTrip Express:\n• 👥 ' + companyData.totalStaff + ' موظف\n• 🚗 ' + companyData.vehicles + ' مركبة\n• 🏙️ ' + companyData.cities + ' مدينة\n• 📦 ' + companyData.dailyOrders.toLocaleString() + ' طلب يومياً\n\nممكن توضّحلي سؤالك أكثر؟ أو اسأل عن: الأسعار، التوصيل، الشركاء، الوظائف، أي شيء! 😊'
            : '🤔 Great question!\n\nI know everything about OneTrip Express:\n• 👥 ' + companyData.totalStaff + ' staff\n• 🚗 ' + companyData.vehicles + ' vehicles\n• 🏙️ ' + companyData.cities + ' cities\n• 📦 ' + companyData.dailyOrders.toLocaleString() + ' daily orders\n\nCould you clarify? Or ask about: pricing, delivery, partners, careers, anything! 😊';
    }
    
    // ===== رد افتراضي إبداعي =====
    const defaultReplies = langIsArabic ? [
        '👋 أهلاً! أنا مساعد OneTrip الذكي\n\n🔥 أرقامنا:\n• ' + companyData.drivers + ' مندوب\n• ' + companyData.cities + ' مدينة\n• ' + companyData.dailyOrders.toLocaleString() + ' طلب يومياً\n\nاسألني عن أي شيء! 🚀',
        '🌟 مرحباً بك في OneTrip!\n\nنحن فريق من ' + companyData.totalStaff + ' شخص نعمل لخدمتك.\n\nكيف أقدر أساعدك؟ اسأل عن الخدمات، الأسعار، التوظيف، أي شيء!',
        '😊 أهلاً!\n\nOneTrip Express - الشريك اللوجستي لـ ' + companyData.partners + ' شركات كبرى!\n\nقولي إيش تحتاج وأنا جاهز أساعدك 💪'
    ] : [
        '👋 Hi! I\'m the OneTrip Smart Assistant\n\n🔥 Our numbers:\n• ' + companyData.drivers + ' drivers\n• ' + companyData.cities + ' cities\n• ' + companyData.dailyOrders.toLocaleString() + ' daily orders\n\nAsk me anything! 🚀',
        '🌟 Welcome to OneTrip!\n\nA team of ' + companyData.totalStaff + ' working to serve you.\n\nHow can I help? Ask about services, pricing, careers, anything!',
        '😊 Hello!\n\nOneTrip Express - Logistics partner for ' + companyData.partners + ' major companies!\n\nTell me what you need 💪'
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
// Make all sections visible immediately on load
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');
    sections.forEach((section) => {
        section.classList.add('section-visible');
        section.style.opacity = '1';
        section.style.transform = 'translateY(0)';
    });
});

// IntersectionObserver for scroll animations (optional enhancement)
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('section-visible');
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.01 });

// Observe all sections
document.querySelectorAll('.section').forEach(section => {
    sectionObserver.observe(section);
});

// ===== CURSOR FOLLOWER =====
document.addEventListener('DOMContentLoaded', () => {
    const cursorFollower = document.getElementById('cursorFollower');
    if (!cursorFollower) return;
    
    const cursorDot = cursorFollower.querySelector('.cursor-dot');
    const cursorRing = cursorFollower.querySelector('.cursor-ring');
    
    if (!cursorDot || !cursorRing) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let isMoving = false;
    let animationFrameId = null;

    // Mouse move event
    const handleMouseMove = (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMoving = true;

        // Update dot immediately
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';

        // Show cursor
        cursorFollower.classList.add('active');
        cursorFollower.style.opacity = '1';
        
        if (!animationFrameId) {
            animateCursor();
        }
    };

    // Animate ring smoothly
    function animateCursor() {
        if (!isMoving) {
            cursorFollower.style.opacity = '0';
            animationFrameId = null;
            return;
        }

        // Smooth follow animation
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;

        cursorRing.style.left = cursorX + 'px';
        cursorRing.style.top = cursorY + 'px';

        animationFrameId = requestAnimationFrame(animateCursor);
    }

    document.addEventListener('mousemove', handleMouseMove);

    // Hide when mouse leaves window
    document.addEventListener('mouseleave', () => {
        cursorFollower.style.opacity = '0';
        isMoving = false;
        cursorFollower.classList.remove('active');
    });

    // Show when mouse enters
    document.addEventListener('mouseenter', () => {
        cursorFollower.style.opacity = '1';
        cursorFollower.classList.add('active');
    });

    // Expand on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .btn, input, textarea, select, .chat-toggle, .whatsapp-btn');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorRing.style.width = '60px';
            cursorRing.style.height = '60px';
            cursorRing.style.borderColor = 'rgba(247, 148, 29, 0.8)';
        });
        el.addEventListener('mouseleave', () => {
            cursorRing.style.width = '40px';
            cursorRing.style.height = '40px';
            cursorRing.style.borderColor = 'rgba(247, 148, 29, 0.5)';
        });
    });
});

// ===== ENSURE CHAT TOGGLE WORKS =====
document.addEventListener('DOMContentLoaded', () => {
    const chatToggle = document.getElementById('chatToggle');
    const chatWidget = document.getElementById('chatWidget');
    
    if (chatToggle) {
        chatToggle.style.visibility = 'visible';
        chatToggle.style.opacity = '1';
        chatToggle.style.display = 'flex';
    }
    
    if (chatWidget && typeof toggleChat === 'function') {
        // Make sure toggleChat is accessible
        window.toggleChat = toggleChat;
    }
});

// ===== CONSOLE MESSAGE =====
console.log('%c🚀 OneTrip Express v2026.01.07', 'font-size: 24px; font-weight: bold; color: #F7941D;');
console.log('%cشريكك اللوجستي الموثوق - AI Chat Enabled', 'font-size: 14px; color: #00D9A5;');
console.log('%cDeveloped with ❤️ for excellence', 'font-size: 12px; color: #64748B;');
