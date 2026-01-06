/* OneTrip Express - Premium Scripts */

// ========== Language Management ==========
let currentLang = localStorage.getItem('language') || 'ar';

function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    localStorage.setItem('language', currentLang);
    updateLanguage();
}

function updateLanguage() {
    const html = document.documentElement;
    const langBtn = document.getElementById('langBtn');
    
    html.lang = currentLang;
    html.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    
    if (langBtn) {
        langBtn.textContent = currentLang === 'ar' ? 'EN' : 'AR';
    }
    
    // Update text content
    document.querySelectorAll('[data-ar][data-en]').forEach(el => {
        const text = currentLang === 'ar' ? el.getAttribute('data-ar') : el.getAttribute('data-en');
        if (text && text.includes('<span>')) {
            el.innerHTML = text;
        } else if (text) {
            el.textContent = text;
        }
    });
    
    // Update placeholders
    document.querySelectorAll('[data-ar-placeholder][data-en-placeholder]').forEach(input => {
        input.placeholder = currentLang === 'ar' 
            ? input.getAttribute('data-ar-placeholder') 
            : input.getAttribute('data-en-placeholder');
    });
    
    // Update select options
    document.querySelectorAll('select option[data-ar][data-en]').forEach(option => {
        const text = currentLang === 'ar' ? option.getAttribute('data-ar') : option.getAttribute('data-en');
        if (text) option.textContent = text;
    });
}

// ========== Main Initialization ==========
document.addEventListener('DOMContentLoaded', () => {
    // Initialize language
    updateLanguage();
    
    // Preloader
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 2000);
    });

    // Navigation Scroll Effect
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Mobile Navigation
    window.toggleNav = function() {
        document.getElementById('navMenu').classList.toggle('active');
    };

    // Close nav on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            document.getElementById('navMenu').classList.remove('active');
        });
    });

    // Active Navigation on Scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Counter Animation
    const counters = document.querySelectorAll('.stat-number');
    let counterAnimated = false;

    function animateCounters() {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2500;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            updateCounter();
        });
    }

    // Intersection Observer for Counters
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !counterAnimated) {
                    animateCounters();
                    counterAnimated = true;
                }
            });
        }, { threshold: 0.3 });
        observer.observe(statsSection);
    }

    // Back to Top Button
    const backTop = document.getElementById('backTop');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backTop.classList.add('visible');
        } else {
            backTop.classList.remove('visible');
        }
    });

    backTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Form Handling
    const careersForm = document.getElementById('careersForm');
    const contactForm = document.getElementById('contactForm');

    function validateForm(form) {
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = '#ef4444';
                setTimeout(() => {
                    input.style.borderColor = '';
                }, 3000);
            }
        });
        
        return isValid;
    }

    if (careersForm) {
        careersForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateForm(careersForm)) {
                showNotification(
                    currentLang === 'ar' 
                        ? 'تم إرسال طلبك بنجاح! سنتواصل معك قريباً' 
                        : 'Application submitted successfully! We will contact you soon',
                    'success'
                );
                careersForm.reset();
            } else {
                showNotification(
                    currentLang === 'ar' 
                        ? 'يرجى ملء جميع الحقول المطلوبة' 
                        : 'Please fill all required fields',
                    'error'
                );
            }
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateForm(contactForm)) {
                showNotification(
                    currentLang === 'ar' 
                        ? 'تم إرسال رسالتك بنجاح!' 
                        : 'Message sent successfully!',
                    'success'
                );
                contactForm.reset();
            } else {
                showNotification(
                    currentLang === 'ar' 
                        ? 'يرجى ملء جميع الحقول المطلوبة' 
                        : 'Please fill all required fields',
                    'error'
                );
            }
        });
    }

    // File Upload Visual
    const fileInput = document.getElementById('cvFile');
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const fileName = e.target.files[0]?.name;
            const label = fileInput.nextElementSibling;
            if (fileName && label) {
                label.querySelector('span').textContent = fileName;
            }
        });
    }

    // Notification Function
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        `;
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '120px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#F7941D',
            color: 'white',
            padding: '18px 32px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            fontSize: '1rem',
            fontWeight: '600',
            boxShadow: '0 16px 48px rgba(0,0,0,0.2)',
            zIndex: '10000',
            animation: 'slideDown 0.5s ease'
        });
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideUp 0.5s ease forwards';
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    }

    // Add notification animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from { transform: translateX(-50%) translateY(-100px); opacity: 0; }
            to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
        @keyframes slideUp {
            from { transform: translateX(-50%) translateY(0); opacity: 1; }
            to { transform: translateX(-50%) translateY(-100px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Reveal Animations
    const revealElements = document.querySelectorAll('.service-card, .about-card, .benefit-card, .stat-card, .info-card, .partner-logo');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 80);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        revealObserver.observe(el);
    });

    // Initialize 3D Globe
    initGlobe();

    console.log('🚀 OneTrip Express - Premium Edition Ready!');
});

// ========== 3D Globe Animation ==========
function initGlobe() {
    const canvas = document.getElementById('globeCanvas');
    if (!canvas || typeof THREE === 'undefined') return;
    
    const container = document.getElementById('globeContainer');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Create globe
    const geometry = new THREE.SphereGeometry(2, 64, 64);
    
    const material = new THREE.MeshPhongMaterial({
        color: 0x1E2A4A,
        transparent: true,
        opacity: 0.9,
        shininess: 80
    });
    
    const globe = new THREE.Mesh(geometry, material);
    scene.add(globe);
    
    // Add wireframe
    const wireframeGeometry = new THREE.WireframeGeometry(new THREE.SphereGeometry(2.02, 32, 32));
    const wireframeMaterial = new THREE.LineBasicMaterial({ 
        color: 0xF7941D, 
        transparent: true, 
        opacity: 0.2 
    });
    const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
    globe.add(wireframe);
    
    // Add glow
    const glowGeometry = new THREE.SphereGeometry(2.3, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xF7941D,
        transparent: true,
        opacity: 0.1,
        side: THREE.BackSide
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glow);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    const pointLight1 = new THREE.PointLight(0xF7941D, 0.8, 15);
    pointLight1.position.set(4, 4, 4);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x00D9A5, 0.6, 15);
    pointLight2.position.set(-4, -4, 4);
    scene.add(pointLight2);
    
    // Add location markers
    const markerGeometry = new THREE.SphereGeometry(0.08, 16, 16);
    const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xF7941D });
    
    const locations = [
        { lat: 24.7, lon: 46.7 },  // Riyadh
        { lat: 21.4, lon: 39.8 },  // Jeddah
        { lat: 26.4, lon: 50.1 },  // Dammam
        { lat: 21.5, lon: 39.2 },  // Mecca
        { lat: 24.5, lon: 39.6 },  // Medina
    ];
    
    locations.forEach(loc => {
        const marker = new THREE.Mesh(markerGeometry, markerMaterial);
        const phi = (90 - loc.lat) * (Math.PI / 180);
        const theta = (loc.lon + 180) * (Math.PI / 180);
        
        marker.position.x = -2.1 * Math.sin(phi) * Math.cos(theta);
        marker.position.y = 2.1 * Math.cos(phi);
        marker.position.z = 2.1 * Math.sin(phi) * Math.sin(theta);
        
        globe.add(marker);
    });
    
    camera.position.z = 5;
    
    // Mouse interaction
    let mouseX = 0, mouseY = 0;
    let targetRotationY = 0;
    
    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        targetRotationY = mouseX * 0.3;
    });
    
    container.addEventListener('mouseleave', () => {
        targetRotationY = 0;
    });
    
    // Animation
    function animate() {
        requestAnimationFrame(animate);
        
        // Auto rotation
        globe.rotation.y += 0.003;
        
        // Mouse interaction
        globe.rotation.y += (targetRotationY - globe.rotation.y * 0.1) * 0.1;
        
        // Animate lights
        pointLight1.position.x = Math.sin(Date.now() * 0.001) * 4;
        pointLight1.position.y = Math.cos(Date.now() * 0.001) * 4;
        
        renderer.render(scene, camera);
    }
    
    // Handle resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
    
    animate();
}

// Make functions globally available
window.toggleLanguage = toggleLanguage;
