/**
 * سلة التسوق الجانبية
 * سعر التوصيل الثابت: 600 دج
 */

class ShoppingCart {
    constructor() {
        this.items = [];
        this.shippingCost = 600;
        this.isOpen = false;
        this.init();
    }
    
    init() {
        this.createCartElements();
        this.attachEventListeners();
        this.renderCart();
        this.updateCartCount();
    }
    
    formatPrice(price) {
        let numericPrice = typeof price === 'string' ? parseFloat(price) : price;
        if (isNaN(numericPrice)) return '0';
        return numericPrice.toLocaleString('en-US');
    }
    
    createCartElements() {
        // منع إنشاء العناصر بشكل مكرر
        if (document.querySelector('.cart-toggle-btn')) return;
        
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'cart-toggle-btn';
        toggleBtn.innerHTML = '<i class="fas fa-shopping-cart"></i><span class="cart-count">0</span>';
        document.body.appendChild(toggleBtn);
        
        const overlay = document.createElement('div');
        overlay.className = 'cart-overlay';
        document.body.appendChild(overlay);
        
        const sidebar = document.createElement('div');
        sidebar.className = 'cart-sidebar';
        sidebar.innerHTML = `
            <div class="cart-header">
                <h2><i class="fas fa-shopping-bag"></i> سلة التسوق</h2>
                <button class="close-cart"><i class="fas fa-times"></i></button>
            </div>
            <div class="cart-body"></div>
            <div class="cart-footer"></div>
        `;
        document.body.appendChild(sidebar);
        
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = '<i class="fas fa-check-circle"></i><span></span>';
        document.body.appendChild(notification);
        
        this.toggleBtn = toggleBtn;
        this.overlay = overlay;
        this.sidebar = sidebar;
        this.notification = notification;
        this.cartBody = sidebar.querySelector('.cart-body');
        this.cartFooter = sidebar.querySelector('.cart-footer');
    }
    
    attachEventListeners() {
        if (!this.toggleBtn) return;
        
        this.toggleBtn.addEventListener('click', () => this.openCart());
        
        const closeBtn = this.sidebar?.querySelector('.close-cart');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeCart());
        }
        
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.closeCart());
        }
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeCart();
            }
        });
    }
    
    openCart() {
        this.isOpen = true;
        if (this.sidebar) this.sidebar.classList.add('open');
        if (this.overlay) this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        // إضافة الهاش عند فتح السلة
        if (typeof window.openSection === 'function') {
            window.openSection();
        }
    }
    
    closeCart() {
        this.isOpen = false;
        if (this.sidebar) this.sidebar.classList.remove('open');
        if (this.overlay) this.overlay.classList.remove('active');
        document.body.style.overflow = '';
        // العودة عند إغلاق السلة
        if (typeof window.closeSection === 'function') {
            window.closeSection();
        }
    }
    
    showNotification(message, isSuccess = true) {
        if (!this.notification) return;
        
        const span = this.notification.querySelector('span');
        const icon = this.notification.querySelector('i');
        
        if (span) span.textContent = message;
        if (icon) icon.className = isSuccess ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
        
        this.notification.classList.add('show');
        
        setTimeout(() => {
            if (this.notification) this.notification.classList.remove('show');
        }, 2000);
    }
    
    addItem(productId, productName, productPrice, productImage) {
        let price = typeof productPrice === 'string' ? parseFloat(productPrice) : productPrice;
        
        if (price < 100 && price > 0) {
            price = price * 1000;
        }
        
        if (isNaN(price) || price <= 0) {
            console.error('سعر غير صحيح:', productPrice);
            return;
        }
        
        const existingItem = this.items.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity++;
            this.showNotification(`✓ تم تحديث كمية ${productName}`);
        } else {
            this.items.push({
                id: productId,
                name: productName,
                price: price,
                image: productImage,
                quantity: 1
            });
            this.showNotification(`✓ تم إضافة ${productName} إلى السلة`);
        }
        
        this.renderCart();
        this.updateCartCount();
        this.dispatchCartUpdateEvent();
    }
    
    removeItem(productId) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            this.items = this.items.filter(item => item.id !== productId);
            this.showNotification(`✓ تم إزالة ${item.name} من السلة`);
            this.renderCart();
            this.updateCartCount();
            this.dispatchCartUpdateEvent();
        }
    }
    
    updateQuantity(productId, newQuantity) {
        if (newQuantity < 1) {
            this.removeItem(productId);
            return;
        }
        
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            this.renderCart();
            this.updateCartCount();
            this.dispatchCartUpdateEvent();
        }
    }
    
    dispatchCartUpdateEvent() {
        const event = new CustomEvent('cartUpdated', {
            detail: {
                products: this.items,
                subtotal: this.getSubtotal(),
                total: this.getTotal(),
                shippingCost: this.shippingCost
            }
        });
        window.dispatchEvent(event);
    }
    
    getSubtotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    getTotal() {
        const subtotal = this.getSubtotal();
        if (subtotal === 0) return 0;
        return subtotal + this.shippingCost;
    }
    
    updateCartCount() {
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        const countSpan = this.toggleBtn?.querySelector('.cart-count');
        if (countSpan) {
            countSpan.textContent = totalItems;
        }
    }
    
    renderCart() {
        if (!this.cartBody) return;
        
        const subtotal = this.getSubtotal();
        const total = this.getTotal();
        const hasItems = this.items.length > 0;
        
        if (!hasItems) {
            this.cartBody.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-shopping-bag"></i>
                    <p>سلتك فارغة</p>
                    <small>أضف بعض المنتجات المميزة!</small>
                </div>
            `;
            this.cartFooter.innerHTML = '';
            return;
        }
        
        this.cartBody.innerHTML = this.items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${this.formatPrice(item.price)} دج</div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                        <span class="cart-item-quantity">${item.quantity}</span>
                        <button class="quantity-btn increase" data-id="${item.id}">+</button>
                        <button class="remove-item" data-id="${item.id}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                    <div class="cart-item-total">
                        المجموع: ${this.formatPrice(item.price * item.quantity)} دج
                    </div>
                </div>
            </div>
        `).join('');
        
        this.cartFooter.innerHTML = `
            <div class="cart-subtotal">
                <span>المجموع الفرعي:</span>
                <span>${this.formatPrice(subtotal)} دج</span>
            </div>
            <div class="cart-shipping">
                <span>رسوم التوصيل:</span>
                <span>${subtotal > 0 ? this.formatPrice(this.shippingCost) : 0} دج</span>
            </div>
            <div class="cart-total">
                <span>الإجمالي:</span>
                <span>${this.formatPrice(total)} دج</span>
            </div>
            <button class="checkout-btn">
                <i class="fas fa-credit-card"></i> إتمام الشراء
            </button>
        `;
        
        this.attachItemEvents();
    }
    
    attachItemEvents() {
        if (!this.cartBody) return;
        
        this.cartBody.querySelectorAll('.decrease').forEach(btn => {
            btn.removeEventListener('click', this.handleDecrease);
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                const item = this.items.find(i => i.id === id);
                if (item) {
                    this.updateQuantity(id, item.quantity - 1);
                }
            });
        });
        
        this.cartBody.querySelectorAll('.increase').forEach(btn => {
            btn.removeEventListener('click', this.handleIncrease);
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                const item = this.items.find(i => i.id === id);
                if (item) {
                    this.updateQuantity(id, item.quantity + 1);
                }
            });
        });
        
        this.cartBody.querySelectorAll('.remove-item').forEach(btn => {
            btn.removeEventListener('click', this.handleRemove);
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                this.removeItem(id);
            });
        });
        
        const checkoutBtn = this.cartFooter?.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.removeEventListener('click', this.handleCheckout);
            checkoutBtn.addEventListener('click', () => {
                if (this.items.length > 0) {
                    this.closeCart();
                    this.showNotification('🛍️ جاري التوجه لاستمارة الطلب...');
                    
                    setTimeout(() => {
                        // ✅ استدعاء دالة فتح الاستمارة من order.js
                        if (typeof window.openOrderForm === 'function') {
                            window.openOrderForm(this.items, this.getTotal(), this.shippingCost);
                        } else {
                            // تخزين بيانات السلة في localStorage كحل بديل
                            localStorage.setItem('tempCartItems', JSON.stringify(this.items));
                            localStorage.setItem('tempTotal', this.getTotal());
                            localStorage.setItem('tempShippingCost', this.shippingCost);
                            this.showNotification('⚠️ يرجى التأكد من تحميل order.js', false);
                        }
                    }, 300);
                } else {
                    this.showNotification('⚠️ سلتك فارغة! أضف بعض المنتجات أولاً', false);
                }
            });
        }
    }
    
    clearCart() {
        this.items = [];
        this.renderCart();
        this.updateCartCount();
        this.showNotification('✓ تم تفريغ السلة');
        this.dispatchCartUpdateEvent();
    }
    
    getCartItems() {
        return [...this.items];
    }
}

// ربط السلة بأزرار "أضف إلى السلة"
function initAddToCartButtons(cart) {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach((card, index) => {
        if (card.querySelector('.add-to-cart-btn')) return;
        
        const productName = card.querySelector('.card-info h3')?.innerText;
        const priceElement = card.querySelector('.price-value');
        
        let priceText = priceElement?.innerText || '0';
        let cleanPrice = parseFloat(priceText.replace(/,/g, ''));
        
        if (priceText.includes(',') && cleanPrice < 100) {
            cleanPrice = cleanPrice * 1000;
        }
        
        const productImage = card.querySelector('.main-img')?.src;
        
        const addBtn = document.createElement('button');
        addBtn.className = 'add-to-cart-btn';
        addBtn.innerHTML = '<i class="fas fa-cart-plus"></i> أضف إلى السلة';
        addBtn.style.cssText = `
            margin-top: 0.75rem;
            width: 100%;
            padding: 0.5rem;
            background: linear-gradient(135deg, #e9a84c 0%, #c97d3a 45%, #c25e3a 80%, #9e3a3a 100%);
            border: none;
            border-radius: 40px;
            color: white;
            font-weight: 600;
            font-size: 0.85rem;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: 'Cairo', sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        `;
        
        addBtn.addEventListener('mouseenter', () => {
            addBtn.style.transform = 'translateY(-2px)';
            addBtn.style.boxShadow = '0 4px 12px rgba(201, 125, 58, 0.4)';
        });
        addBtn.addEventListener('mouseleave', () => {
            addBtn.style.transform = 'translateY(0)';
            addBtn.style.boxShadow = 'none';
        });
        
        addBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            cart.addItem(index + 1, productName, cleanPrice, productImage);
        });
        
        const infoDiv = card.querySelector('.card-info');
        if (infoDiv) {
            infoDiv.appendChild(addBtn);
        }
    });
}

function observeNewProducts(cart) {
    const observer = new MutationObserver(() => {
        initAddToCartButtons(cart);
    });
    
    const galleryGrid = document.getElementById('galleryGrid');
    if (galleryGrid) {
        observer.observe(galleryGrid, {
            childList: true,
            subtree: true
        });
    }
}

// تصدير الكارت
window.ShoppingCart = ShoppingCart;

// بدء التشغيل
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const cart = new ShoppingCart();
        window.shoppingCartInstance = cart; // حفظ مرجع للسلة
        setTimeout(() => {
            initAddToCartButtons(cart);
            observeNewProducts(cart);
        }, 100);
    });
} else {
    const cart = new ShoppingCart();
    window.shoppingCartInstance = cart; // حفظ مرجع للسلة
    setTimeout(() => {
        initAddToCartButtons(cart);
        observeNewProducts(cart);
    }, 100);
}

// --- Smart Navigation History ---
(function() {
    const sectionName = 'panier'; // اسم فريد للسلة

    // 1. عند فتح القسم، أضف الرابط للمتصفح
    window.openSection = function() {
        window.location.hash = sectionName;
    };

    // 2. عند إغلاق القسم، ارجع للرئيسية
    window.closeSection = function() {
        if(window.location.hash === '#' + sectionName) {
            window.history.back();
        }
    };

    // 3. الاستماع لزر الرجوع: إذا كان الـ hash يخص هذا القسم، أغلقه
    window.addEventListener('hashchange', function() {
        if (window.location.hash !== '#' + sectionName) {
            // إذا كان المستخدم خارج السلة وكانت مفتوحة، نغلقها
            if (window.shoppingCartInstance && window.shoppingCartInstance.isOpen) {
                window.shoppingCartInstance.closeCart();
            }
        }
    });
})();
