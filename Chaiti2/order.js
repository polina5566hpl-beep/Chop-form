// ===== استمارة الطلب =====

// ===== بيانات الولايات والبلديات =====
const wilayaCommunes = {
    "عنابة": [
        "عنابة", "أولاد خالد", "برحال", "بونعيم", "بوعمار", 
        "الحجار", "الزرزار", "الشرفة", "الشطايبي", "سرايدي", 
        "سيدي عمار", "عين الباردة", "تريعات", "وادي العنب"
    ],
    "وهران": [
        "وهران", "عين الترك", "مرسى الكبير", "بوتليليس", "حاسي بن عقبة",
        "بني صاف", "قديل", "وادي تليلات", "الكرن", "السانية",
        "برج الجير", "البطحاء", "العنصر", "المرسى"
    ]
};

// الحصول على جميع الولايات (مفاتيح الكائن)
function getAllWilayas() {
    return Object.keys(wilayaCommunes);
}

// الحصول على بلديات ولاية محددة
function getCommunesByWilaya(wilaya) {
    return wilayaCommunes[wilaya] || [];
}

// تحديث قائمة البلديات بناءً على الولاية المختارة
function updateCommunesSelect() {
    const wilayaSelect = document.getElementById('wilaya');
    const communeSelect = document.getElementById('commune');
    
    if (!wilayaSelect || !communeSelect) return;
    
    const selectedWilaya = wilayaSelect.value;
    const communes = getCommunesByWilaya(selectedWilaya);
    
    // حفظ القيمة المحددة حاليًا إن وجدت
    const currentCommuneValue = communeSelect.value;
    
    // تفريغ الخيارات الحالية
    communeSelect.innerHTML = '<option value="">📍 البلدية *</option>';
    
    // إضافة البلديات الجديدة
    if (communes.length > 0) {
        communes.forEach(commune => {
            const option = document.createElement('option');
            option.value = commune;
            option.textContent = commune;
            communeSelect.appendChild(option);
        });
        
        communeSelect.disabled = false;
        
        // استعادة القيمة السابقة إذا كانت لا تزال موجودة في القائمة الجديدة
        if (currentCommuneValue && communes.includes(currentCommuneValue)) {
            communeSelect.value = currentCommuneValue;
        }
    } else {
        // إذا لم توجد بلديات، أضف خيار افتراضي
        communeSelect.innerHTML = '<option value="">📍 اختر ولاية أولاً</option>';
        communeSelect.disabled = true;
    }
}

// إضافة الاستمارة إلى الصفحة (لن تظهر إلا عند استدعائها)
function addOrderFormToPage() {
    // منع الإضافة المكررة
    if (document.querySelector('.order-section')) return;
    
    const wilayaOptions = getAllWilayas().map(wilaya => 
        `<option value="${wilaya}">${wilaya}</option>`
    ).join('');
    
    const orderHTML = `
        <div class="order-section" id="orderSection" style="display: none;">
            <div class="order-container">
                <div class="order-header">
                    <h2>
                        <i class="fas fa-clipboard-list"></i>
                        استمارة طلب الشراء
                    </h2>
                </div>
                
                <form id="orderForm" class="order-form">
                    <div class="form-row">
                        <div class="form-group">
                            <input type="text" id="fullName" placeholder="👤 الاسم الكامل *" required>
                        </div>
                        <div class="form-group">
                            <input type="tel" id="phoneNumber" placeholder="📞 رقم الهاتف *" required>
                        </div>
                    </div>
                    
                    <!-- الولاية والبلدية في نفس السطر -->
                    <div class="form-row">
                        <div class="form-group">
                            <select id="wilaya" required>
                                <option value="">🏙️ الولاية *</option>
                                ${wilayaOptions}
                            </select>
                        </div>
                        <div class="form-group">
                            <select id="commune" required disabled>
                                <option value="">📍 البلدية *</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <textarea id="address" rows="3" placeholder="🏠 العنوان التفصيلي (الشارع، رقم البناء، الطابق...) *" required></textarea>
                    </div>
                    
                    <div class="selected-products">
                        <h3><i class="fas fa-shopping-bag"></i> المنتجات المختارة</h3>
                        <div class="products-list" id="productsList">
                            <p style="text-align:center; color:#999;">لم يتم اختيار أي منتج بعد</p>
                        </div>
                        <div class="total-price">
                            <span>المجموع الكلي:</span>
                            <span id="orderTotalPrice">0 دج</span>
                        </div>
                    </div>
                    
                    <button type="submit" class="submit-btn" id="submitOrderBtn">
                        <i class="fas fa-check-circle"></i>
                        تأكيد الطلب
                    </button>
                </form>
            </div>
        </div>
    `;
    
    // إضافة الاستمارة بعد معرض المنتجات
    const gallery = document.querySelector('.gallery');
    if (gallery) {
        gallery.insertAdjacentHTML('afterend', orderHTML);
    } else {
        document.body.insertAdjacentHTML('beforeend', orderHTML);
    }
    
    // ربط حدث تغيير الولاية
    const wilayaSelect = document.getElementById('wilaya');
    if (wilayaSelect) {
        wilayaSelect.addEventListener('change', updateCommunesSelect);
    }
}

// إخفاء الاستمارة وإظهار المنتجات
function hideOrderFormAndShowProducts() {
    const orderSection = document.getElementById('orderSection');
    const gallery = document.querySelector('.gallery');
    const galleryHeader = document.querySelector('.gallery-header');
    
    // إخفاء الاستمارة
    if (orderSection) {
        orderSection.style.display = 'none';
    }
    
    // إظهار المنتجات
    if (gallery) {
        gallery.style.display = 'block';
    }
    if (galleryHeader) {
        galleryHeader.style.display = 'block';
    }
    
    // التمرير إلى أعلى المنتجات
    if (gallery) {
        gallery.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// إظهار الاستمارة وإخفاء المنتجات
function showOrderForm() {
    const orderSection = document.getElementById('orderSection');
    const gallery = document.querySelector('.gallery');
    const galleryHeader = document.querySelector('.gallery-header');
    
    // إخفاء المنتجات
    if (gallery) {
        gallery.style.display = 'none';
    }
    if (galleryHeader) {
        galleryHeader.style.display = 'none';
    }
    
    // إظهار الاستمارة
    if (orderSection) {
        orderSection.style.display = 'block';
        orderSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// إخفاء الاستمارة (داخلية)
function hideOrderForm() {
    const orderSection = document.getElementById('orderSection');
    if (orderSection) {
        orderSection.style.display = 'none';
    }
}

// تحديث المنتجات في الاستمارة
function updateOrderProductsDisplay(products) {
    const productsList = document.getElementById('productsList');
    const orderTotalSpan = document.getElementById('orderTotalPrice');
    
    if (!productsList) return;
    
    if (!products || products.length === 0) {
        productsList.innerHTML = '<p style="text-align:center; color:#999;">لم يتم اختيار أي منتج بعد</p>';
        if (orderTotalSpan) orderTotalSpan.innerHTML = '0 دج';
        return;
    }
    
    let subtotal = 0;
    productsList.innerHTML = products.map(product => {
        const price = product.price || 0;
        const quantity = product.quantity || 1;
        const itemTotal = price * quantity;
        subtotal += itemTotal;
        
        return `
            <div class="product-item">
                <span class="product-name">${product.name} ${quantity > 1 ? `× ${quantity}` : ''}</span>
                <span class="product-price">${itemTotal.toLocaleString()} دج</span>
            </div>
        `;
    }).join('');
    
    const total = subtotal + 600;
    if (orderTotalSpan) {
        orderTotalSpan.innerHTML = `${total.toLocaleString()} دج`;
    }
}

// عرض رسالة
function showOrderAlert(message, type) {
    const existingAlert = document.querySelector('.alert-message');
    if (existingAlert) existingAlert.remove();
    
    const alert = document.createElement('div');
    alert.className = `alert-message alert-${type}`;
    alert.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 3000);
}

// ===== إطار أبيض للشكر (Modal) =====
function showThankYouModal() {
    // إزالة أي مودال موجود مسبقاً
    const existingModal = document.querySelector('.thankyou-modal');
    if (existingModal) existingModal.remove();
    
    // إنشاء المودال
    const modal = document.createElement('div');
    modal.className = 'thankyou-modal';
    modal.innerHTML = `
        <div class="thankyou-modal-content">
            <div class="thankyou-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2>شكراً لك!</h2>
            <p>تم استلام طلبك بنجاح</p>
            <p class="thankyou-message">سيتم التواصل معكم قريباً لتأكيد الطلب</p>
            <button class="thankyou-btn" id="closeThankYouModal">حسناً</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // منع التمرير في الخلف
    document.body.style.overflow = 'hidden';
    
    // إغلاق المودال عند الضغط على الزر
    const closeBtn = document.getElementById('closeThankYouModal');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.classList.add('fade-out');
            setTimeout(() => {
                modal.remove();
                document.body.style.overflow = '';
                // إعادة تحميل الصفحة بعد إغلاق المودال
                location.reload();
            }, 300);
        });
    }
    
    // إغلاق عند الضغط خارج المودال
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.add('fade-out');
            setTimeout(() => {
                modal.remove();
                document.body.style.overflow = '';
                location.reload();
            }, 300);
        }
    });
}

// ===== دوال التحقق =====
function validateFullName(name) {
    // يسمح فقط بالحروف العربية والإنجليزية والمسافات
    const nameRegex = /^[a-zA-Z\u0621-\u064A\s]+$/;
    return nameRegex.test(name) && name.trim().length >= 2;
}

function validatePhoneNumber(phone) {
    // التحقق من رقم هاتف جزائري: 05, 06, 07 متبوع بـ 8 أرقام
    const phoneRegex = /^(05|06|07)[0-9]{8}$/;
    return phoneRegex.test(phone);
}

// ===== إرسال الطلب إلى Google Script (بدون حفظ محلي) =====
async function sendToGoogleScript(orderData) {
    try {
        const scriptUrl = 'https://script.google.com/macros/s/AKfycbyUYBIeGiwPMuCOGOCR6MbPlkVMujXYiljPztkIqQCinKYSl966OK5W4CZhtltIHhr9/exec';
        
        // إظهار رسالة "جاري الإرسال..."
        showOrderAlert('📡 جاري إرسال الطلب إلى الخادم...', 'info');
        
        const response = await fetch(scriptUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });
        
        console.log('تم إرسال الطلب إلى Google Script بنجاح', orderData.orderId);
        return { success: true };
        
    } catch (error) {
        console.error('فشل الإرسال إلى Google Script:', error);
        return { success: false, error: error.message };
    }
}

// إعادة إظهار المنتجات بعد إتمام الطلب
function resetAfterOrder() {
    const orderSection = document.getElementById('orderSection');
    const gallery = document.querySelector('.gallery');
    const galleryHeader = document.querySelector('.gallery-header');
    
    // إخفاء الاستمارة
    if (orderSection) {
        orderSection.style.display = 'none';
        // إعادة تعيين النموذج
        const orderForm = document.getElementById('orderForm');
        if (orderForm) orderForm.reset();
        // إعادة تعيين قائمة البلديات
        const communeSelect = document.getElementById('commune');
        if (communeSelect) {
            communeSelect.innerHTML = '<option value="">📍 البلدية *</option>';
            communeSelect.disabled = true;
        }
        updateOrderProductsDisplay([]);
    }
    
    // إظهار المنتجات
    if (gallery) {
        gallery.style.display = 'block';
    }
    if (galleryHeader) {
        galleryHeader.style.display = 'block';
    }
}

// تهيئة الاستمارة (تضاف للصفحة لكن مخفية)
function initOrderForm() {
    // إضافة الاستمارة إلى الصفحة (مخفية)
    addOrderFormToPage();
    
    // معالجة إرسال النموذج
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // تعطيل الزر لمنع الإرسال المتعدد
            const submitBtn = document.getElementById('submitOrderBtn');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> جاري الإرسال...';
            }
            
            // جلب القيم
            const fullName = document.getElementById('fullName')?.value.trim();
            const phoneNumber = document.getElementById('phoneNumber')?.value.trim();
            const wilaya = document.getElementById('wilaya')?.value;
            const commune = document.getElementById('commune')?.value;
            const address = document.getElementById('address')?.value.trim();
            
            // ===== التحقق من صحة الاسم =====
            if (!fullName) {
                showOrderAlert('يرجى إدخال الاسم الكامل', 'error');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> تأكيد الطلب';
                }
                return;
            }
            
            if (!validateFullName(fullName)) {
                showOrderAlert('يرجى إدخال اسم صحيح (حروف فقط بدون رموز أو أرقام)', 'error');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> تأكيد الطلب';
                }
                return;
            }
            
            // ===== التحقق من صحة رقم الهاتف =====
            if (!phoneNumber) {
                showOrderAlert('يرجى إدخال رقم الهاتف', 'error');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> تأكيد الطلب';
                }
                return;
            }
            
            if (!validatePhoneNumber(phoneNumber)) {
                showOrderAlert('رقم الهاتف غير صحيح. يجب أن يبدأ بـ 05 أو 06 أو 07 ويتكون من 10 أرقام', 'error');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> تأكيد الطلب';
                }
                return;
            }
            
            // ===== باقي التحققات =====
            if (!wilaya) {
                showOrderAlert('يرجى اختيار الولاية', 'error');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> تأكيد الطلب';
                }
                return;
            }
            
            if (!commune) {
                showOrderAlert('يرجى اختيار البلدية', 'error');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> تأكيد الطلب';
                }
                return;
            }
            
            if (!address) {
                showOrderAlert('يرجى إدخال العنوان التفصيلي', 'error');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> تأكيد الطلب';
                }
                return;
            }
            
            // جلب المنتجات من localStorage
            let products = [];
            try {
                products = JSON.parse(localStorage.getItem('tempCartItems') || '[]');
            } catch(e) {}
            
            if (!products || products.length === 0) {
                showOrderAlert('لا توجد منتجات في السلة', 'error');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> تأكيد الطلب';
                }
                return;
            }
            
            const subtotal = products.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
            const total = subtotal + 600;
            
            const orderId = 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
            
            const orderData = {
                orderId: orderId,
                date: new Date().toLocaleString('ar-SA'),
                customer: {
                    fullName: fullName,
                    phone: phoneNumber,
                    wilaya: wilaya,
                    commune: commune,
                    address: address
                },
                products: products,
                subtotal: subtotal,
                shippingCost: 600,
                totalAmount: total,
                status: 'pending'
            };
            
            // إرسال الطلب إلى Google Script فقط (بدون حفظ محلي)
            const result = await sendToGoogleScript(orderData);
            
            if (result.success) {
                // مسح البيانات المؤقتة
                localStorage.removeItem('tempCartItems');
                localStorage.removeItem('tempTotal');
                localStorage.removeItem('tempShippingCost');
                
                // إعادة تعيين كل شيء
                resetAfterOrder();
                
                // إطلاق حدث لتفريغ السلة
                if (typeof window.dispatchCartClear === 'function') {
                    window.dispatchCartClear();
                }
                
                // عرض إطار الشكر الأبيض بدلاً من confirm
                showThankYouModal();
                
            } else {
                // فشل الإرسال
                showOrderAlert('❌ عذراً، حدث خطأ في إرسال الطلب. يرجى المحاولة مرة أخرى.', 'error');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> تأكيد الطلب';
                }
            }
        });
    }
}

// دالة لفتح الاستمارة (يتم استدعاؤها من panier.js)
window.openOrderForm = function(cartItems, total, shippingCost) {
    // تخزين بيانات السلة في localStorage
    localStorage.setItem('tempCartItems', JSON.stringify(cartItems));
    localStorage.setItem('tempTotal', total);
    localStorage.setItem('tempShippingCost', shippingCost);
    
    // تحديث عرض المنتجات
    updateOrderProductsDisplay(cartItems);
    
    // إظهار الاستمارة وإخفاء المنتجات
    showOrderForm();
    
    // إضافة حالة لتاريخ المتصفح (Smart Navigation)
    window.history.pushState({ section: 'order' }, "");
};

// دالة لإعادة إظهار المنتجات (يمكن استدعاؤها من مكان آخر)
window.showProductsOnly = function() {
    resetAfterOrder();
};

// ===== Smart Navigation History =====
(function() {
    // الاستماع لزر الرجوع
    window.addEventListener('popstate', function(event) {
        const orderSection = document.getElementById('orderSection');
        // إذا كانت الاستمارة مفتوحة
        if (orderSection && orderSection.style.display === 'block') {
            // إغلاق الاستمارة وعرض المنتجات
            const gallery = document.querySelector('.gallery');
            const galleryHeader = document.querySelector('.gallery-header');
            
            orderSection.style.display = 'none';
            if (gallery) gallery.style.display = 'block';
            if (galleryHeader) galleryHeader.style.display = 'block';
            
            console.log("تم إغلاق الاستمارة عبر زر الرجوع");
            
            // منع السلوك الافتراضي للرجوع خارج الصفحة
            event.preventDefault();
        }
    });
})();

// بدء التشغيل (إضافة الاستمارة مخفية)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOrderForm);
} else {
    initOrderForm();
                                    }
