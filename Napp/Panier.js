const cartPanel = document.getElementById('cartPanel');

// دالة لفتح السلة
function openCart() {
  cartPanel.classList.add('open');
  // نضيف حالة جديدة للسجل، المتصفح الآن يظن أننا "دخلنا" صفحة جديدة
  window.history.pushState({ cartOpen: true }, "");
}

// دالة لإغلاق السلة
function closeCart() {
  cartPanel.classList.remove('open');
}

// مراقبة الرجوع
window.addEventListener('popstate', (event) => {
  // إذا كان السجل يحتوي على حالة السلة، أغلقها فقط
  if (cartPanel.classList.contains('open')) {
    closeCart();
  } else {
    // إذا لم تكن السلة مفتوحة، اسمح للمتصفح بالرجوع للصفحة السابقة (الخروج)
    // لا تفعل شيئاً هنا، اترك السلوك الافتراضي يحدث
  }
});

// هذا هو الجزء الأهم: التأكد من أن السلة لا تمنع المتصفح من الرجوع للصفحة السابقة إذا كانت مغلقة
// نقوم بإضافة "مستمع" لزر الفتح يتأكد من الحالة
document.querySelector('.cart-btn').addEventListener('click', (e) => {
  e.preventDefault();
  openCart();
});
