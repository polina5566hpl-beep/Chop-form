const cartPanel = document.getElementById('cartPanel');

// دالة الفتح
function openCart() {
  cartPanel.classList.add('open');
  
  // نضيف حالة جديدة للسجل، وهذا يجعل المتصفح يظن أننا انتقلنا لصفحة جديدة
  history.pushState({ cartOpen: true }, 'Cart');
}

// دالة الإغلاق
function closeCart() {
  cartPanel.classList.remove('open');
}

// مراقبة حدث الرجوع
window.addEventListener('popstate', (event) => {
  // إذا كانت السلة مفتوحة، نغلقها ونمنع الخروج
  if (cartPanel.classList.contains('open')) {
    closeCart();
  } else {
    // إذا كانت مغلقة، اترك المتصفح يقوم بعمله الطبيعي (الرجوع للصفحة السابقة)
  }
});

// ربط زر الفتح
document.querySelector('.cart-btn').addEventListener('click', (e) => {
  e.preventDefault();
  openCart();
});

// لمنع حدوث تضارب إذا قام المستخدم بإغلاق السلة يدوياً (بدون زر الرجوع)
// يجب أن نقوم بحذف حالة السلة من الـ History لكي لا يبقى السجل "متسخاً"
const closeBtn = document.querySelector('.close-cart-btn'); // تأكد من وضع الكلاس الصحيح لزر الإغلاق لديك
if (closeBtn) {
  closeBtn.addEventListener('click', () => {
    closeCart();
    // إذا أغلقنا السلة يدوياً، نعود خطوة للخلف في التاريخ لضبط الحالة
    if (history.state && history.state.cartOpen) {
      history.back();
    }
  });
}
