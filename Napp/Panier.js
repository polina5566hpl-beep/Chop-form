// دالة لفتح السلة
function openCart() {
  const cartPanel = document.getElementById('cartPanel');
  cartPanel.classList.add('open');
  
  // إضافة حالة للسجل عند فتح السلة
  window.history.pushState({ cartOpen: true }, "");
}

// دالة لإغلاق السلة
function closeCart() {
  const cartPanel = document.getElementById('cartPanel');
  cartPanel.classList.remove('open');
}

// مراقبة زر الرجوع
window.addEventListener('popstate', function(event) {
  const cartPanel = document.getElementById('cartPanel');
  
  // إذا كانت السلة مفتوحة، أغلقها وامنعه من الخروج
  if (cartPanel.classList.contains('open')) {
    closeCart();
  }
});

// ربط زر الفتح
const cartBtn = document.querySelector('.cart-btn');
cartBtn.addEventListener('click', (e) => {
  e.preventDefault(); // منع أي سلوك افتراضي
  openCart();
});
