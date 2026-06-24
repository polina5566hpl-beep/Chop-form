  // عند فتح السلة، نضيف حالة للتاريخ
  function handleCartHistory() {
    const cartPanel = document.getElementById('cartPanel');
    if (cartPanel.classList.contains('open')) {
      window.history.pushState({ cartOpen: true }, "");
    }
  }

  // مراقبة الضغط على زر الرجوع
  window.addEventListener('popstate', function(event) {
    const cartPanel = document.getElementById('cartPanel');
    if (cartPanel.classList.contains('open')) {
      closeCart(); // إغلاق السلة فقط
    }
  });

  // لا نعدل على الدوال، فقط نربط الفتح بحالة التاريخ
  const cartBtn = document.querySelector('.cart-btn');
  cartBtn.addEventListener('click', () => {
    setTimeout(handleCartHistory, 100); // تأخير بسيط لضمان فتح السلة أولاً
  });
