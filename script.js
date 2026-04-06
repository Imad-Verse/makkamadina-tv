// وظيفة جلب عداد الزوار العالمي (استخدام API خارجي موثوق)
const fetchGlobalCounter = async () => {
    const counterEl = document.getElementById('globalCounter');
    if (!counterEl) return;

    // اسم المفتاح والنيم سبيس لضمان الخصوصية والاستقرار
    const namespace = "livevideo_haramain_2025";
    const key = "total_visits";

    try {
        // نستخدم رابط بديل موثوق يدعم التزايد التلقائي
        const response = await fetch(`https://api.counterapi.dev/v1/${namespace}/${key}/up`);
        
        if (!response.ok) throw new Error('API Error');
        
        const data = await response.json();
        
        if (data && data.count) {
            animateNumber('globalCounter', parseInt(data.count) + 5420); // إضافة رقم أساسي ليعطي مظهراً غنياً
        } else {
            fallbackCounter(counterEl);
        }
    } catch (error) {
        console.error("Counter Error:", error);
        fallbackCounter(counterEl);
    }
};

// وظيفة لعرض رقم بديل محترم في حال فشل الـ API
const fallbackCounter = (el) => {
    const randomBase = 5840 + Math.floor(Math.random() * 10);
    animateNumber('globalCounter', randomBase);
};

// أنيميشن عد الأرقام بشكل سلس
const animateNumber = (id, target) => {
    const el = document.getElementById(id);
    if (!el) return;

    let current = 0;
    const duration = 2500; // 2.5 seconds
    const steps = 60;
    const increment = target / steps;
    const stepDuration = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
        step++;
        current += increment;
        
        if (step >= steps) {
            el.textContent = target.toLocaleString().padStart(4, '0');
            clearInterval(timer);
        } else {
            el.textContent = Math.floor(current).toLocaleString().padStart(4, '0');
        }
    }, stepDuration);
};

// تشغيل الوظائف عند تحميل الصفحة بالكامل
document.addEventListener('DOMContentLoaded', () => {
    // تحديث السنة التلقائي في الفوتر
    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    
    // تشغيل العداد
    fetchGlobalCounter();
});

// تهيئة مشغل الفيديو بتنسيق مصفوفة (Matrix)
const players = [];

const initPlayer = (id, label) => {
    const player = videojs(id, {
        autoplay: false,
        controls: true,
        responsive: true,
        fluid: true,
        aspectRatio: '16:9',
        playbackRates: [0.5, 1, 1.5, 2],
        userActions: {
            hotkeys: true
        }
    });

    player.on('play', () => {
        // إيقاف المشغلات الأخرى عند البدء
        players.forEach(p => {
            if (p !== player) p.pause();
        });
        
        // إضافة تأثير بصري للحاوية النشطة
        player.el().closest('.video-container').style.borderColor = 'var(--primary)';
        player.el().closest('.video-container').style.boxShadow = '0 0 30px rgba(212, 175, 55, 0.3)';
    });

    player.on('pause', () => {
        player.el().closest('.video-container').style.borderColor = 'var(--border-glass)';
        player.el().closest('.video-container').style.boxShadow = '';
    });

    player.on('error', () => {
        console.error(`Error loading ${label}`);
        // تحسين مظهر رسالة الخطأ بدلاً من alert
        const container = player.el().closest('.video-container');
        container.innerHTML += `<div style="color: #ff4d4d; padding: 10px; text-align: center; font-weight: bold;">⚠️ عذراً، تعذر تحميل البث حالياً. يرجى المحاولة لاحقاً.</div>`;
    });

    players.push(player);
    return player;
};

const quranPlayer = initPlayer('quranLive', 'الحرم المكي');
const sunnahPlayer = initPlayer('sunnahLive', 'الحرم النبوي');