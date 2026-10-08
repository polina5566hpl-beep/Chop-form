// lightbox.js - Lightbox avec navigation, zoom, et gestion intelligente de l'historique
(function() {
  let lightboxActive = false;
  let currentIndex = 0;
  let imagesList = [];
  let mainImgElement = null;
  const SWIPE_THRESHOLD = 50;
  let touchStartX = 0;

  function buildLightbox() {
    if (document.querySelector('.lightbox-overlay')) return;
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = `
      <div class="lightbox-container"><img class="lightbox-image" alt="Aperçu"></div>
      <button class="lightbox-close">✕</button>
      <div class="lightbox-counter"></div>
    `;
    document.body.appendChild(overlay);

    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeLightbox(); });
    overlay.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    
    // دعم التاتش
    const img = overlay.querySelector('.lightbox-image');
    img.addEventListener('touchstart', (e) => touchStartX = e.changedTouches[0].screenX);
    img.addEventListener('touchend', (e) => {
      let diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > SWIPE_THRESHOLD) navigateImage(diff > 0 ? 1 : -1);
    });

    // النقر المزدوج للتكبير
    img.addEventListener('dblclick', function(e) {
      e.stopPropagation();
      this.classList.toggle('zoomed');
    });
  }

  function updateLightboxContent(index) {
    const overlay = document.querySelector('.lightbox-overlay');
    const imgElement = overlay.querySelector('.lightbox-image');
    imgElement.src = imagesList[index];
    imgElement.classList.remove('zoomed'); // إعادة تعيين الزوم عند تغيير الصورة
    overlay.querySelector('.lightbox-counter').textContent = `${index+1} / ${imagesList.length}`;
    currentIndex = index;
  }

  function navigateImage(direction) {
    let newIndex = currentIndex + direction;
    if (newIndex < 0) newIndex = imagesList.length - 1;
    if (newIndex >= imagesList.length) newIndex = 0;
    updateLightboxContent(newIndex);
  }

  // الدوال المدمجة
  window.openLightbox = function(startIndex = 0) {
    if (!imagesList.length) return;
    buildLightbox();
    currentIndex = startIndex;
    updateLightboxContent(currentIndex);
    document.querySelector('.lightbox-overlay').classList.add('active');
    lightboxActive = true;
    document.body.style.overflow = 'hidden';
    window.history.pushState({ lightbox: 'open' }, "");
  };

  window.closeLightbox = function() {
    const overlay = document.querySelector('.lightbox-overlay');
    if (overlay && overlay.classList.contains('active')) {
      overlay.classList.remove('active');
      if (window.history.state && window.history.state.lightbox === 'open') {
        window.history.back();
      }
    }
    lightboxActive = false;
    document.body.style.overflow = '';
  };

  window.addEventListener('popstate', function() {
    if (lightboxActive) {
      document.querySelector('.lightbox-overlay').classList.remove('active');
      lightboxActive = false;
      document.body.style.overflow = '';
    }
  });

  function refreshImagesList() {
    const thumbs = document.querySelectorAll('.thumb');
    const newList = [];
    thumbs.forEach(thumb => {
      const src = thumb.getAttribute('data-src') || thumb.querySelector('img')?.src;
      if (src) newList.push(src);
    });
    imagesList = [...new Set(newList)];
  }

  function initLightbox() {
    mainImgElement = document.getElementById('mainImg');
    if (!mainImgElement) return;
    refreshImagesList();
    mainImgElement.addEventListener('click', (e) => { 
        e.preventDefault(); 
        refreshImagesList(); 
        openLightbox(0); 
    });
  }

  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', initLightbox) : initLightbox();
})();
