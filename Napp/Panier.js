// دالة فتح السلة مع تسجيل حالة في المتصفح
window.openCart = function() { 
  const cartPanel = document.getElementById('cartPanel');
  const cartOverlay = document.getElementById('cartOverlay');
  
  cartPanel.classList.add('open'); 
  cartOverlay.classList.add('open');
  
  // إضافة حالة للسجل لكي يتمكن زر الرجوع من إغلاق السلة
  window.history.pushState({ cartOpen: true }, "Cart");
};

// دالة إغلاق السلة
window.closeCart = function() { 
  const cartPanel = document.getElementById('cartPanel');
  const cartOverlay = document.getElementById('cartOverlay');
  
  // إذا كانت السلة مفتوحة بالفعل، نتحقق من حالة الـ History قبل الرجوع
  if (cartPanel.classList.contains('open')) {
    cartPanel.classList.remove('open'); 
    cartOverlay.classList.remove('open');
    
    // إذا كانت الحالة موجودة في السجل، نعود للخلف لإزالتها
    if (window.history.state && window.history.state.cartOpen) {
      window.history.back();
    }
  }
};

// مراقبة حدث الرجوع (Popstate)
window.addEventListener('popstate', function(event) {
  const cartPanel = document.getElementById('cartPanel');
  const cartOverlay = document.getElementById('cartOverlay');
  
  // إذا كانت السلة مفتوحة، نغلقها فقط ونمنع خروج المتصفح
  if (cartPanel.classList.contains('open')) {
    cartPanel.classList.remove('open'); 
    cartOverlay.classList.remove('open');
  }
});
