// Lightbox JavaScript - ملف منفصل (مع التمرير باللمس والتنقل الذكي)
(function() {
    // --- Smart Navigation History ---
    const sectionName = 'lightbox';
    
    // دالة مساعدة لإضافة/إزالة الهاش
    function addLightboxHash() {
        if (window.location.hash !== '#' + sectionName) {
            window.location.hash = sectionName;
        }
    }
    
    function removeLightboxHash() {
        if (window.location.hash === '#' + sectionName) {
            window.history.back();
        }
    }
    
    // إنشاء عناصر الـ Lightbox (بدون أزرار التنقل ودون الصور المصغرة)
    const lightboxHTML = `
    <div class="lightbox" id="lightbox">
        <button class="lightbox-close"><i class="fas fa-times"></i></button>
        <div class="lightbox-counter-top">1 / 1</div>
        <div class="lightbox-content">
            <img class="lightbox-img" alt="صورة مكبرة">
        </div>
        <div class="lightbox-counter-bottom"></div>
    </div>
    `;
    
    // إضافة الـ Lightbox للصفحة
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    
    // المتغيرات
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.querySelector('.lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxCounterTop = document.querySelector('.lightbox-counter-top');
    const lightboxCounterBottom = document.querySelector('.lightbox-counter-bottom');
    
    let currentImages = [];
    let currentIndex = 0;
    
    // --- متغيرات التمرير باللمس ---
    let touchStartX = 0;
    let touchEndX = 0;
    const minSwipeDistance = 50;
    
    // متغير لتتبع حالة الـ Lightbox
    let isLightboxOpen = false;
    
    // دالة فتح الـ Lightbox
    window.openLightbox = function(images, index) {
        currentImages = images;
        currentIndex = index;
        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        isLightboxOpen = true;
        addLightboxHash(); // إضافة الهاش عند الفتح
    };
    
    // تحديث الصورة الرئيسية والعداد
    function updateLightboxImage() {
        lightboxImg.src = currentImages[currentIndex];
        const counterText = `${currentIndex + 1} / ${currentImages.length}`;
        lightboxCounterTop.textContent = counterText;
        lightboxCounterBottom.textContent = counterText;
    }
    
    // --- وظائف التمرير باللمس ---
    function nextImage() {
        currentIndex = (currentIndex + 1) % currentImages.length;
        updateLightboxImage();
    }
    
    function prevImage() {
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        updateLightboxImage();
    }
    
    // مستمعات أحداث اللمس
    function handleTouchStart(e) {
        touchStartX = e.changedTouches[0].screenX;
    }
    
    function handleTouchEnd(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipeGesture();
    }
    
    function handleSwipeGesture() {
        const swipeDistance = touchEndX - touchStartX;
        
        if (swipeDistance < -minSwipeDistance) {
            nextImage();
        }
        else if (swipeDistance > minSwipeDistance) {
            prevImage();
        }
        
        touchStartX = 0;
        touchEndX = 0;
    }
    
    // إغلاق الـ Lightbox
    function closeLightbox() {
        if (!isLightboxOpen) return;
        
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        isLightboxOpen = false;
        
        // إزالة الهاش إذا كان موجوداً
        if (window.location.hash === '#' + sectionName) {
            window.history.back();
        }
    }
    
    lightbox.addEventListener('click', (e) => {
        // إذا ضغط على زر الإغلاق → أغلق
        if (e.target.closest('.lightbox-close')) {
            closeLightbox();
            return;
        }

        // إذا ضغط داخل محتوى الصورة → لا تفعل شيء
        if (e.target.closest('.lightbox-content')) {
            return;
        }

        // أي ضغط على الخلفية → لا يغلق (تم تجاهله)
    });
    
    // ربط أحداث اللمس
    lightbox.addEventListener('touchstart', handleTouchStart, false);
    lightbox.addEventListener('touchend', handleTouchEnd, false);
    
    // --- الاستماع لزر الرجوع في المتصفح ---
    window.addEventListener('hashchange', function() {
        if (window.location.hash !== '#' + sectionName && isLightboxOpen) {
            // المستخدم ضغط زر الرجوع والخروج من اللايت بوكس
            closeLightbox();
        }
    });
    
    // ربط الـ Lightbox مع الصور الرئيسية
    document.addEventListener('DOMContentLoaded', () => {
        const mainImages = document.querySelectorAll('.main-img');
        
        mainImages.forEach((img) => {
            img.addEventListener('click', () => {
                const card = img.closest('.card');
                const thumbnails = card.querySelectorAll('.thumbnail');
                const productImages = Array.from(thumbnails).map(thumb => thumb.getAttribute('data-img'));
                const activeIndex = Array.from(thumbnails).findIndex(thumb => thumb.classList.contains('active'));
                
                openLightbox(productImages, activeIndex);
            });
        });
    });
})();