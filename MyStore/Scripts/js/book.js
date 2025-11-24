// Product detail page functionality
class ProductDetail {
    constructor() {
        this.quantity = 1;
        this.maxStock = 0;
        this.init();
    }

    init() {
        console.log('Initializing product detail page...');
        this.setupQuantitySelector();
        this.setupActionButtons();
        this.setupImageZoom();
    }

    setupQuantitySelector() {
        const minusBtn = document.querySelector('.quantity-minus');
        const plusBtn = document.querySelector('.quantity-plus');
        const quantityInput = document.querySelector('.quantity-input');

        if (!minusBtn || !plusBtn || !quantityInput) {
            console.log('Quantity selector elements not found');
            return;
        }

        this.maxStock = parseInt(quantityInput.getAttribute('max')) || 999;
        this.quantity = parseInt(quantityInput.value) || 1;

        console.log('Max stock:', this.maxStock, 'Initial quantity:', this.quantity);

        minusBtn.addEventListener('click', () => {
            if (this.quantity > 1) {
                this.quantity--;
                this.updateQuantityInput();
            }
        });

        plusBtn.addEventListener('click', () => {
            if (this.quantity < this.maxStock) {
                this.quantity++;
                this.updateQuantityInput();
            } else {
                this.showStockAlert();
            }
        });

        quantityInput.addEventListener('change', (e) => {
            let value = parseInt(e.target.value) || 1;

            if (value < 1) value = 1;
            if (value > this.maxStock) {
                value = this.maxStock;
                this.showStockAlert();
            }

            this.quantity = value;
            this.updateQuantityInput();
        });

        quantityInput.addEventListener('input', (e) => {
            // Only allow numbers
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });
    }

    updateQuantityInput() {
        const quantityInput = document.querySelector('.quantity-input');
        if (quantityInput) {
            quantityInput.value = this.quantity;
        }
    }

    setupActionButtons() {
        const addToCartBtn = document.querySelector('.btn-add-cart');
        const buyNowBtn = document.querySelector('.btn-buy-now');

        console.log('Add to cart button:', addToCartBtn);
        console.log('Buy now button:', buyNowBtn);

        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.addToCart(false);
            });
        }

        if (buyNowBtn) {
            buyNowBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.addToCart(true);
            });
        }
    }

    addToCart(redirectToCart = false) {
        const bookId = document.querySelector('.btn-add-cart')?.dataset.bookId; console.log('Adding to cart - BookID:', bookId, 'Quantity:', this.quantity);

        if (!bookId) {
            console.error('Book ID not found');
            this.showNotification('Không tìm thấy thông tin sản phẩm!', 'error');
            return;
        }

        // Sử dụng fetch API để thêm vào giỏ hàng
        fetch('/Cart/AddToCart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({
                bookId: parseInt(bookId),
                quantity: this.quantity
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    this.showNotification('Đã thêm vào giỏ hàng!', 'success');
                    this.updateCartCount(this.quantity);

                    if (redirectToCart) {
                        setTimeout(() => {
                            window.location.href = '/Cart';
                        }, 1000);
                    }
                } else {
                    this.showNotification(data.message || 'Có lỗi xảy ra!', 'error');
                }
            })
            .catch(error => {
                console.error('Error adding to cart:', error);
                this.showNotification('Không thể thêm vào giỏ hàng. Vui lòng thử lại!', 'error');
            });
    }

    setupImageZoom() {
        const productImage = document.querySelector('.product-detail-image');

        if (productImage) {
            productImage.addEventListener('click', () => {
                this.openImageModal(productImage.src);
            });

            productImage.style.cursor = 'zoom-in';
        }
    }

    openImageModal(imageSrc) {
        const modal = document.createElement('div');
        modal.className = 'image-modal';

        const img = document.createElement('img');
        img.src = imageSrc;

        modal.appendChild(img);
        document.body.appendChild(modal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // Close on ESC key
        const closeModal = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', closeModal);
            }
        };
        document.addEventListener('keydown', closeModal);
    }

    showStockAlert() {
        this.showNotification(`Số lượng tối đa là ${this.maxStock}`, 'error');
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div'); notification.className = `notification ${type === 'error' ? 'error' : ''}`;

        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    updateCartCount(quantity = 1) {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const currentCount = parseInt(cartCount.textContent) || 0;
            cartCount.textContent = currentCount + quantity;

            // Hiệu ứng animation
            cartCount.style.transform = 'scale(1.2)';
            setTimeout(() => {
                cartCount.style.transform = 'scale(1)';
            }, 300);
        }
    }
}

// Category page functionality
class ProductCategory {
    constructor() {
        this.init();
    }

    init() {
        console.log('Initializing category page...');
        this.setupAddToCartButtons();
        this.setupProductCardClicks();
    }

    setupAddToCartButtons() {
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const bookId = btn.dataset.bookId;
                const bookTitle = btn.dataset.bookTitle;

                console.log('Adding to cart from category - BookID:', bookId, 'Title:', bookTitle);

                if (!bookId) {
                    console.error('Book ID not found');
                    return;
                }

                // Sử dụng fetch API để thêm vào giỏ hàng
                fetch('/Cart/AddToCart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify({
                        bookId: parseInt(bookId),
                        quantity: 1
                    })
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        if (data.success) {
                            this.showNotification('Đã thêm vào giỏ hàng!', 'success');
                            this.updateCartCount(1);
                        } else {
                            this.showNotification(data.message || 'Có lỗi xảy ra!', 'error');
                        }
                    })
                    .catch(error => {
                        console.error('Error adding to cart:', error);
                        this.showNotification('Không thể thêm vào giỏ hàng. Vui lòng thử lại!', 'error');
                    });
            });
        });
    }

    setupProductCardClicks() {
        // Xử lý click vào product card (trừ nút thêm vào giỏ)
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Nếu click vào nút thêm vào giỏ, không chuyển trang
                if (e.target.closest('.add-to-cart-btn')) {
                    return;
                }

                // Tìm link và chuyển hướng
                const productLink = card.querySelector('.product-title');
                if (productLink && productLink.href) {
                    window.location.href = productLink.href;
                }
            });
        });
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type === 'error' ? 'error' : ''}`;

        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    updateCartCount(quantity = 1) {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const currentCount = parseInt(cartCount.textContent) || 0;
            cartCount.textContent = currentCount + quantity;

            // Hiệu ứng animation
            cartCount.style.transform = 'scale(1.2)';
            setTimeout(() => {
                cartCount.style.transform = 'scale(1)';
            }, 300);
        }
    }
}

// Initialize based on current page
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded - checking page type...');

    // Check if we're on product detail page
    if (document.querySelector('.product-detail')) {
        console.log('Product detail page detected');
        new ProductDetail();
    }

    // Check if we're on category page
    if (document.querySelector('.category-header')) {
        console.log('Category page detected');
        new ProductCategory();
    }
});