// button.js
(function() {
  const button = document.getElementById('menuBtn');
  if (!button) {
    console.warn('لم يتم العثور على زر القائمة (menuBtn)');
    return;
  }

  // --- نظام التنقل الذكي (Smart Navigation History) ---
  let historyStack = [];

  function updateHistory(type, id = null, action = 'push') {
    if (action === 'push') {
      historyStack.push({ type, id });
      history.pushState({ type, id }, '');
    } else if (action === 'pop') {
      historyStack.pop();
    }
  }

  // إنشاء العناصر الأساسية
  const menu = document.createElement('div');
  menu.className = 'side-menu';
  menu.innerHTML = `
    <div class="side-menu-header">
      <div class="menu-title">القائمة الرئيسية</div>
      <button class="close-menu-btn" aria-label="إغلاق القائمة">✕</button>
    </div>
    <ul>
      <li><a href="#" data-popup="popup-delivery">التوصيل</a></li>
      <li><a href="#" data-popup="popup-faq">الأسئلة الشائعة</a></li>
      <li><a href="#" data-popup="popup-contact">تواصل معنا</a></li>
      <li><a href="#" data-popup="popup-about">من نحن</a></li>
    </ul>
  `;

  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  document.body.appendChild(menu);
  document.body.appendChild(overlay);

  const popupOverlay = document.createElement('div');
  popupOverlay.className = 'popup-overlay';
  document.body.appendChild(popupOverlay);

  // محتوى النوافذ
  const popupsContent = {
    'popup-delivery': { title: '🚚 سياسة التوصيل', content: '<div id="delivery" class="page"><h2>سياسة التوصيل</h2><div class="delivery-card"><div class="delivery-icon"><i class="fas fa-truck-fast"></i></div><div class="delivery-info"><p><i class="fas fa-tags"></i> <span class="highlight-price">600 دينار</span> رسوم التوصيل لجميع المشتريات (جميع ولايات الوطن)</p><p><i class="fas fa-home"></i> التوصيل إلى باب المنزل – مهني ومضمون</p><p><i class="fas fa-hand-holding-usd"></i> الدفع عند الإستلام</p></div><div class="delivery-zones" style="margin-top:20px; background:#fef9ef; border-radius:24px; padding:20px;"><h4><i class="fas fa-clock"></i> مدة التوصيل حسب المنطقة</h4><div><strong>⏱️ الولايات الكبرى:</strong> 24-48 ساعة<br><strong>⏱️ الهضاب العليا:</strong> 3-4 أيام<br><strong>⏱️ الجنوب الكبير:</strong> 5-7 أيام</div></div></div></div>' },
    'popup-faq': { title: '❓ الأسئلة الشائعة', content: `<div class="faq-page-container">
  <div class="brand-mini">
    🐾 <span>chaiti</span> · بيوت القطط الفاخرة
  </div>

  <div class="faq-card">
    <h2>
      <i class="fas fa-question-circle"></i> 
      الأسئلة الشائعة
    </h2>
    
    <div class="faq-container">
      <div class="faq-category">
        <h3><i class="fas fa-credit-card"></i> الدفع</h3>
        <div class="faq-item">
          <div class="faq-question">
            <i class="fas fa-angle-left"></i>
            <span>هل الدفع عند الإستلام ؟</span>
          </div>
          <div class="faq-answer">نعم، الدفع عند إستلام المنتج فقط.</div>
        </div>
        <div class="faq-item">
          <div class="faq-question">
            <i class="fas fa-angle-left"></i>
            <span>هل هناك دفع مسبق؟</span>
          </div>
          <div class="faq-answer">لا، لا نطلب أي دفع مسبق. الدفع يكون بعد معاينة المنتج عند التوصيل.</div>
        </div>
      </div>

      <div class="faq-category">
        <h3><i class="fas fa-couch"></i> المنتج</h3>
        <div class="faq-item">
          <div class="faq-question">
            <i class="fas fa-angle-left"></i>
            <span>هل المنتج مطابق لصور؟</span>
          </div>
          <div class="faq-answer">نعم، الصور حقيقية والمنتج مطابق تماماً للمعروض.</div>
        </div>
        <div class="faq-item">
          <div class="faq-question">
            <i class="fas fa-angle-left"></i>
            <span>هل يمكن معاينة المنتج قبل الدفع؟</span>
          </div>
          <div class="faq-answer">نعم، يمكنك معاينة المنتج عند الإستلام والتأكد منه قبل الدفع.</div>
        </div>
      </div>

      <div class="faq-category">
        <h3><i class="fas fa-exchange-alt"></i> الاسترجاع والرفض</h3>
        <div class="faq-item">
          <div class="faq-question">
            <i class="fas fa-angle-left"></i>
            <span>ماذا لو لم يعجبني المنتج؟</span>
          </div>
          <div class="faq-answer">يمكنك رفض الطلب عند الإستلام دون أي مشكلة أو دفع أي رسوم إضافية.</div>
        </div>
      </div>

      <div class="faq-category">
        <h3><i class="fas fa-shopping-cart"></i> الطلب</h3>
        <div class="faq-item">
          <div class="faq-question">
            <i class="fas fa-angle-left"></i>
            <span>كيف يمكنني الطلب؟</span>
          </div>
          <div class="faq-answer">حدد المنتج الذي تريد، ثم إضغط على إضافة إلى السلة. بعد إتمام إضافة المنتجات، إضغط على السلة الظاهرة فوق لمعاينة المشتريات، ثم إضغط على إتمام الطلب، إملأ الإستمارة. سنتصل بك لتأكيد الطلب.</div>
        </div>
      </div>
    </div>
  </div>
</div>` },
    'popup-contact': { title: '📞 تواصل معنا', content: '<div style="text-align:center; padding:20px;"><i class="fas fa-envelope" style="font-size:48px; color:#e9a84c; margin-bottom:15px;"></i><p>📧 البريد الإلكتروني: info@chaiti.com</p><p>📞 رقم الهاتف: +213 XX XXX XXX</p><p>📍 العنوان: الجزائر، الجزائر العاصمة</p></div>' },
    'popup-about': { title: '🏢 من نحن', content: '<div style="text-align:center; padding:20px;"><i class="fas fa-paw" style="font-size:48px; color:#e9a84c; margin-bottom:15px;"></i><p>نحن متخصصون في توفير بيوت قطط فاخرة وعالية الجودة، نسعى لتوفير الراحة والرفاهية لقططك الأليفة بأفضل التصاميم والمواد الآمنة.</p></div>' }
  };

  // إنشاء النوافذ
  for (const [id, data] of Object.entries(popupsContent)) {
    const popup = document.createElement('div');
    popup.className = 'popup-window';
    popup.id = id;
    popup.innerHTML = `<div class="popup-content"><div class="popup-header"><h3>${data.title}</h3><button class="popup-close">&times;</button></div><div class="popup-body">${data.content}</div></div>`;
    document.body.appendChild(popup);
    
    // عند الضغط على زر الإغلاق داخل النافذة، نستخدم الرجوع للخلف
    popup.querySelector('.popup-close').addEventListener('click', () => history.back());
  }

  // --- الدوال الأساسية ---

  function openPopup(popupId) {
    const popup = document.getElementById(popupId);
    if (popup) {
      popup.classList.add('show');
      popupOverlay.classList.add('show');
      updateHistory('popup', popupId, 'push');
      if (popupId === 'popup-faq') setTimeout(initFaqAccordion, 100);
    }
  }

  function closePopupUI() {
    const activePopup = document.querySelector('.popup-window.show');
    if (activePopup) {
      activePopup.classList.remove('show');
      popupOverlay.classList.remove('show');
    }
  }

  function toggleMenu() {
    if (!menu.classList.contains('open')) {
      menu.classList.add('open');
      overlay.classList.add('show');
      updateHistory('menu', 'main', 'push');
    } else {
      history.back();
    }
  }

  function closeMenuUI() {
    menu.classList.remove('open');
    overlay.classList.remove('show');
  }

  // --- معالجة زر الرجوع ---
  window.addEventListener('popstate', function(event) {
    const lastState = historyStack[historyStack.length - 1];
    
    if (lastState?.type === 'popup') {
      closePopupUI();
    } else if (lastState?.type === 'menu') {
      closeMenuUI();
    }
    updateHistory(null, null, 'pop');
  });

  // الروابط والأحداث
  button.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', () => history.back());
  menu.querySelector('.close-menu-btn').addEventListener('click', () => history.back());
  popupOverlay.addEventListener('click', () => history.back());
  
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openPopup(link.getAttribute('data-popup'));
    });
  });

  // دالة الأكورديون المحدثة للأسئلة الشائعة
  function initFaqAccordion() {
    setTimeout(() => {
      const faqPopup = document.getElementById('popup-faq');
      if (!faqPopup) return;
      
      const faqItems = faqPopup.querySelectorAll('.faq-item');
      
      faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (!question) return;
        
        // إزالة المستمعات القديمة وتجنب التكرار
        const newQuestion = question.cloneNode(true);
        question.parentNode.replaceChild(newQuestion, question);
        
        newQuestion.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          const parentItem = this.closest('.faq-item');
          const isActive = parentItem.classList.contains('active');
          
          // إغلاق جميع الأسئلة الأخرى
          faqItems.forEach(i => i.classList.remove('active'));
          
          // فتح السؤال الحالي إذا لم يكن مفتوحاً
          if (!isActive) {
            parentItem.classList.add('active');
          }
        });
      });
    }, 100);
  }
})();