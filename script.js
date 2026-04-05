// تحديث السنة التلقائي في الفوتر
document.getElementById('currentYear').textContent = new Date().getFullYear();

// وظيفة جلب عداد الزوار العالمي (استخدام API خارجي بسيط)
const fetchGlobalCounter = async () => {
    try {
        const namespace = "livevideo_haramain_pro_v1";
        const response = await fetch(`https://api.counterapi.dev/v1/${namespace}/counter/up`);
        const data = await response.json();
        
        if (data && data.count) {
            animateNumber('globalCounter', data.count);
        }
    } catch (error) {
        console.error("Error fetching global counter:", error);
        document.getElementById('globalCounter').textContent = "---";
    }
};

// أنيميشن عد الأرقام
const animateNumber = (id, target) => {
    const el = document.getElementById(id);
    let current = 0;
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;
    const increment = target / steps;
    
    const interval = setInterval(() => {
        current += increment;
        if (current >= target) {
            el.textContent = target.toString().padStart(4, '0');
            clearInterval(interval);
        } else {
            el.textContent = Math.floor(current).toString().padStart(4, '0');
        }
    }, stepDuration);
};

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

// تشغيل العداد
fetchGlobalCounter();