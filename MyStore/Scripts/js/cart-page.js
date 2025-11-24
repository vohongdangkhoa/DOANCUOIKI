// Cart page specific functionality
class CartPage {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupQuantityControls();
        this.setupRemoveButtons();
        this.setupCheckoutButton();
    }

    setupEventListeners() {
        console.log('Cart page initialized');
    }

    setupQuantityControls() {
        // Quantity minus buttons
        document.querySelectorAll('.quantity-minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const bookId = btn.dataset.bookId;
                this.handleQuantityChange(bookId, 'decrease');
            });
        });

        // Quantity plus buttons
        document.querySelectorAll('.quantity-plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const bookId = btn.dataset.bookId;
                this.handleQuantityChange(bookId, 'increase');
            });
        });

        // Quantity input changes
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const bookId = input.dataset.bookId;
                const quantity = parseInt(input.value) || 1;
                this.updateQuantity(bookId, quantity);
            });

            input.addEventListener('input', (e) => {
                // Only allow numbers
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
            });
        });
    }

    setupRemoveButtons() {
        // Small remove buttons
        document.querySelectorAll('.btn-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const bookId = btn.dataset.bookId;
                this.removeItemWithConfirmation(bookId);
            });
        });

        // Large remove buttons (X icon)
        document.querySelectorAll('.btn-remove-lg').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const bookId = btn.dataset.bookId;
                this.removeItemWithConfirmation(bookId);
            });
        });
    }

    setupCheckoutButton() {
        const checkoutBtn = document.querySelector('.btn-checkout');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.proceedToCheckout();
            });
        }
    }

    handleQuantityChange(bookId, action) {
        const input = document.querySelector(`.quantity-input[data-book-id="${bookId}"]`);
        if (!input) return;

        let quantity = parseInt(input.value) || 1;

        if (action === 'decrease') {
            if (quantity > 1) {
                quantity--;
            } else {
                this.removeItemWithConfirmation(bookId);
                return;
            }
        } else if (action === 'increase') {
            quantity++;
        }

        input.value = quantity;
        this.updateQuantity(bookId, quantity);
    }

    updateQuantity(bookId, quantity) {
        this.showLoading(bookId);

        fetch('/Cart/UpdateQuantity', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `bookId=${bookId}&quantity=${quantity}`
        })
            .then(response => {
                if (response.ok) {
                    return response.text().then(() => {
                        this.hideLoading(bookId);
                        this.updateItemTotal(bookId, quantity);
                        this.updateCartSummary();
                        this.showNotification('Đã cập nhật số lượng!', 'success');
                    });
                }
                throw new Error('Network response was not ok');
            })
            .catch(error => {
                console.error('Error updating quantity:', error);
                this.hideLoading(bookId);
                this.showNotification('Có lỗi xảy ra khi cập nhật!', 'error');
            });
    }

    removeItemWithConfirmation(bookId) {
        if (confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) {
            this.removeItem(bookId);
        }
    }

    removeItem(bookId) {
        this.showLoading(bookId);

        fetch('/Cart/RemoveFromCart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `bookId=${bookId}`
        })
            .then(response => {
                if (response.ok) {
                    this.removeItemFromUI(bookId);
                    this.updateCartSummary();
                    this.showNotification('Đã xóa sản phẩm khỏi giỏ hàng!', 'success');
                }
            })
            .catch(error => {
                console.error('Error removing item:', error);
                this.hideLoading(bookId);
                this.showNotification('Có lỗi xảy ra khi xóa!', 'error');
            });
    }

    proceedToCheckout() {
        const cartItems = document.querySelectorAll('.cart-item');
        if (cartItems.length === 0) {
            this.showNotification('Giỏ hàng của bạn đang trống!', 'error');
            return;
        }

        // Show checkout confirmation
        if (confirm('Bạn có muốn tiến hành đặt hàng?')) {
            // Redirect to checkout page or show checkout modal
            this.showCheckoutModal();
        }
    }

    showCheckoutModal() {
        const modal = document.createElement('div');
        modal.className = 'checkout-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 8px;
            text-align: center;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        `;

        modalContent.innerHTML = `
            <h3 style="color: #333; margin-bottom: 15px;">Thông báo</h3>
            <p style="color: #666; margin-bottom: 20px; line-height: 1.5;">
                Tính năng đặt hàng đang được phát triển!<br>
                Trang thanh toán sẽ sớm được cập nhật.
            </p>
            <button class="btn-close-modal" style="
                background: #ee4d2d;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 4px;
                cursor: pointer;
                font-weight: 500;
                transition: background 0.2s;
            ">Đóng</button>
        `;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        const closeBtn = modal.querySelector('.btn-close-modal');
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // Close on ESC key
        const closeOnEsc = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', closeOnEsc);
            }
        };
        document.addEventListener('keydown', closeOnEsc);
    }

    updateItemTotal(bookId, quantity) {
        const item = document.querySelector(`.cart-item[data-book-id="${bookId}"]`);
        if (!item) return;

        const priceElement = item.querySelector('.cart-item-price');
        const totalElement = item.querySelector('.cart-item-total');

        if (priceElement && totalElement) {
            const price = this.parsePrice(priceElement.textContent);
            const total = price * quantity;
            totalElement.textContent = total.toLocaleString() + ' ₫';
        }
    }

    updateCartSummary() {
        const items = document.querySelectorAll('.cart-item');
        let subtotal = 0;

        items.forEach(item => {
            const priceElement = item.querySelector('.cart-item-price');
            const quantityInput = item.querySelector('.quantity-input');

            if (priceElement && quantityInput) {
                const price = this.parsePrice(priceElement.textContent);
                const quantity = parseInt(quantityInput.value) || 1;
                subtotal += price * quantity;
            }
        });

        this.updateSummaryDisplay(subtotal);
    }

    updateSummaryDisplay(subtotal) {
        const subtotalElement = document.querySelector('.summary-row:nth-child(1) .value');
        const totalElement = document.querySelector('.summary-row.total-price .value');

        if (subtotalElement) {
            subtotalElement.textContent = subtotal.toLocaleString() + ' ₫';
        }

        if (totalElement) {
            totalElement.textContent = subtotal.toLocaleString() + ' ₫';
        }
    }

    removeItemFromUI(bookId) {
        const item = document.querySelector(`.cart-item[data-book-id="${bookId}"]`);
        if (item) {
            item.classList.add('cart-item-removing');
            setTimeout(() => {
                item.remove();
                this.checkEmptyCart();
            }, 300);
        }
    }

    checkEmptyCart() {
        const items = document.querySelectorAll('.cart-item');
        if (items.length === 0) {
            // Reload to show empty cart state
            setTimeout(() => {
                location.reload();
            }, 500);
        }
    }

    showLoading(bookId) {
        const item = document.querySelector(`.cart-item[data-book-id="${bookId}"]`);
        if (item) {
            item.classList.add('quantity-updating');
        }
    }

    hideLoading(bookId) {
        const item = document.querySelector(`.cart-item[data-book-id="${bookId}"]`);
        if (item) {
            item.classList.remove('quantity-updating');
        }
    }

    parsePrice(priceString) {
        return parseInt(priceString.replace(/[^\d]/g, '')) || 0;
    }

    showNotification(message, type = 'success') {
        // Use cartManager if available from main.js
        if (window.cartManager) {
            window.cartManager.showNotification(message, type);
        } else {
            // Fallback notification
            const notification = document.createElement('div');
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: ${type === 'success' ? '#4CAF50' : '#f44336'};
                color: white;
                padding: 12px 20px;
                border-radius: 2px;
                z-index: 10000;
                font-size: 14px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                animation: slideInRight 0.3s ease;
            `;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    new CartPage();
});