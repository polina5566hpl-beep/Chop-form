/**
 * Lightbox JS - نسخة نظيفة وموحدة
 */
(function() {
    let images = [];
    let currentIndex = 0;
    let isOpen = false;
    let lightboxElement = null;
    let touchStartX = 0;
    let touchEndX = 0;
    let isZoomed = false;

    function createLightbox() {
        if (document.getElementById('lightboxOverlay')) return;
        const html = `
            <div id="lightboxOverlay">
                <div class="lightbox-container">
                    <button id="lightboxClose">✕</button>
                    <img id="lightboxImage" src="" alt="">
                    <div id="lightboxCounter"></div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);
        lightboxElement = document.getElementById('lightboxOverlay');
        
        document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
        lightboxElement.addEventListener('click', function(e) { if (e.target === lightboxElement) closeLightbox(); });
        
        // إعدادات الصورة (Touch/Zoom)
        const img = document.getElementById('lightboxImage');
        img.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; e.stopPropagation(); });
        img.addEventListener('touchend', (e) => {
            const diff = touchStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) { diff > 0 ? showNext() : showPrev(); }
            e.stopPropagation();
        });
        
        img.addEventListener('dblclick', function(e) {
            e.stopPropagation();
            if (!isZoomed) {
                img.style.transform = `scale(2)`;
                img.style.cursor = 'zoom-out';
                isZoomed = true;
            } else {
                img.style.transform = 'scale(1)';
                img.style.cursor = 'grab';
                isZoomed = false;
            }
        });
    }

    function resetZoom() {
        const img = document.getElementById('lightboxImage');
        if (img) {
            img.style.transform = 'scale(1)';
            isZoomed = false;
        }
    }

    function showCurrentImage() {
        const img = document.getElementById('lightboxImage');
        const counter = document.getElementById('lightboxCounter');
        if (!images[currentIndex]) return;
        resetZoom();
        img.src = images[currentIndex].src;
        counter.textContent = images.length > 1 ? `${currentIndex + 1} / ${images.length}` : '';
    }

    function showPrev() { currentIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1; showCurrentImage(); }
    function showNext() { currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0; showCurrentImage(); }

    // --- الدوال الموحدة (الفتح والإغلاق مع History) ---
    function openLightbox(index) {
        if (!lightboxElement) createLightbox();
        currentIndex = index;
        showCurrentImage();
        lightboxElement.classList.add('active');
        isOpen = true;
        document.body.style.overflow = 'hidden';
        window.history.pushState({ lightboxOpen: true }, ""); // تسجيل الحالة
    }

    function closeLightbox() {
        if (!lightboxElement) return;
        lightboxElement.classList.remove('active');
        isOpen = false;
        document.body.style.overflow = '';
        resetZoom();
        if (window.history.state && window.history.state.lightboxOpen) {
            window.history.back(); // العودة للخلف
        }
    }

    // مراقب زر الرجوع
    window.addEventListener('popstate', function(event) {
        if (isOpen) {
            lightboxElement.classList.remove('active');
            isOpen = false;
            document.body.style.overflow = '';
            resetZoom();
        }
    });

    // دالة التجميع
    function collectImages() {
        images = [];
        const mainImg = document.querySelector('#mainImageEl img');
        if (mainImg) images.push({ src: mainImg.src });
        document.querySelectorAll('.thumb img').forEach(t => {
            if (!images.some(i => i.src === t.src)) images.push({ src: t.src });
        });
    }

    function init() {
        createLightbox();
        collectImages();
        const main = document.getElementById('mainImageEl');
        if (main) main.addEventListener('click', () => { collectImages(); openLightbox(0); });
    }

    document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
})();
