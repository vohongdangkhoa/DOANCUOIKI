// Cart page functionality
class CartPage {
    constructor() {
        this.init();
    }

    init() {
        console.log('Cart page initialized');

        this.bindEvents();
    }

    bindEvents() {
        // Xử lý nút "Tiếp tục mua sắm" trong empty cart
        this.bindContinueShopping();

        // Xử lý quantity buttons
        this.bindQuantityButtons();

        // Xử lý input change
        this.bindQuantityInputs();

        // Xử lý xóa sản phẩm
        this.bindRemoveButtons();

        // Xử lý đặt hàng
        this.bindCheckoutButton();
    }

    bindContinueShopping() {
        // Empty cart continue button
        document.querySelector('.btn-continue-shopping')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.redirectToHome();
        });

        // Cart with items continue button
        document.querySelector('.btn-continue')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.redirectToHome();
        });
    }

    bindQuantityButtons() {
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const bookId = e.currentTarget.dataset.bookId;
                const isPlus = e.currentTarget.classList.contains('quantity-plus');
                const input = document.querySelector(`.quantity-input[data-book-id="${bookId}"]`);

                if (input) {
                    let quantity = parseInt(input.value) || 1;
                    quantity = isPlus ? quantity + 1 : Math.max(1, quantity - 1);
                    input.value = quantity;

                    // Update cart
                    this.updateCartQuantity(bookId, quantity);
                }
            });
        });
    }

    bindQuantityInputs() {
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const bookId = e.currentTarget.dataset.bookId;
                const quantity = Math.max(1, parseInt(e.currentTarget.value) || 1);
                e.currentTarget.value = quantity;
                this.updateCartQuantity(bookId, quantity);
            });

            // Prevent negative values
            input.addEventListener('keydown', (e) => {
                if (e.key === '-' || e.key === 'e') {
                    e.preventDefault();
                }
            });
        });
    }

    bindRemoveButtons() {
        document.querySelectorAll('.btn-remove, .btn-remove-lg').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const bookId = e.currentTarget.dataset.bookId;
                this.removeFromCart(bookId);
            });
        });
    }

    bindCheckoutButton() {
        document.querySelector('.btn-checkout')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.processCheckout();
        });
    }

    redirectToHome() {
        window.location.href = '/Home';
    }

    updateCartQuantity(bookId, quantity) {
        console.log(`Updating cart: Book ${bookId}, Quantity ${quantity}`);

        fetch('/Cart/UpdateQuantityAjax', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `bookId=${bookId}&quantity=${quantity}`
        })
            .then(response => {
                if (response.ok) {
                    this.showNotification('Đã cập nhật số lượng!', 'success');
                    setTimeout(() => {
                        location.reload(); // Reload để cập nhật tổng tiền
                    }, 1000);
                } else {
                    this.showNotification('Có lỗi xảy ra khi cập nhật!', 'error');
                }
            })
            .catch(error => {
                console.error('Error updating cart:', error);
                this.showNotification('Có lỗi xảy ra!', 'error');
            });
    }

    removeFromCart(bookId) {
        if (confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) {
            console.log(`Removing from cart: Book ${bookId}`);

            fetch('/Cart/RemoveFromCartAjax', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `bookId=${bookId}`
            })
                .then(response => {
                    if (response.ok) {
                        this.showNotification('Đã xóa sản phẩm khỏi giỏ hàng!', 'success');
                        setTimeout(() => {
                            location.reload();
                        }, 1000);
                    } else {
                        this.showNotification('Có lỗi xảy ra khi xóa!', 'error');
                    }
                })
                .catch(error => {
                    console.error('Error removing from cart:', error);
                    this.showNotification('Có lỗi xảy ra!', 'error');
                });
        }
    }

    processCheckout() {
        // Kiểm tra xem có sản phẩm trong giỏ hàng không
        const cartItems = document.querySelectorAll('.cart-item');
        if (cartItems.length === 0) {
            this.showNotification('Giỏ hàng của bạn đang trống!', 'error');
            return;
        }

        // Hiển thị thông báo đặt hàng
        this.showNotification('Đang xử lý đơn hàng...', 'info');

        // Giả lập quá trình đặt hàng
        setTimeout(() => {
            alert('Tính năng đặt hàng đang được phát triển!\n\nChức năng thanh toán sẽ được tích hợp trong phiên bản tiếp theo.');
        }, 500);
    }

    showNotification(message, type = 'info') {// Remove existing notifications
        document.querySelectorAll('.cart-notification').forEach(notification => {
            notification.remove();
        });

        const notification = document.createElement('div');
        notification.className = `cart-notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            z-index: 10000;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            info: 'info-circle',
            warning: 'exclamation-triangle'
        };
        return icons[type] || 'info-circle';
    }

    getNotificationColor(type) {
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            info: '#2196F3',
            warning: '#FF9800'
        };
        return colors[type] || '#2196F3';
    }
}

// Initialize cart page when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    new CartPage();
});

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
`;
document.head.appendChild(style);

// cart.js

// Hàm hiển thị loading
function showLoading(message = 'Đang xử lý...') {
    $('#loadingText').text(message);
    $('#loadingOverlay').fadeIn();
}

// Hàm ẩn loading
function hideLoading() {
    $('#loadingOverlay').fadeOut();
}// Hàm hiển thị thông báo thành công
function showSuccessMessage(message) {
    $('#successMessage').text(message).fadeIn();
    setTimeout(() => {
        $('#successMessage').fadeOut();
    }, 3000);
}

// Hàm hiển thị thông báo lỗi
function showErrorMessage(message) {
    $('#errorMessage').text(message).fadeIn();
    setTimeout(() => {
        $('#errorMessage').fadeOut();
    }, 3000);
}

// Hàm cập nhật số lượng giỏ hàng
function updateCartCount(count) {
    $('.cart-count').text(count);
}

// FUNCTION THÊM VÀO GIỎ (không chuyển trang)
function addToCart(bookId) {
    showLoading('Đang thêm vào giỏ...');

    $.ajax({
        url: '/Cart/AddToCartAjax',
        type: 'POST',
        data: { bookId: bookId, quantity: 1 },
        success: function (response) {
            hideLoading();
            if (response.success) {
                showSuccessMessage('✅ ' + response.message);
                // Cập nhật số lượng giỏ hàng
                updateCartCount(response.cartCount);
            } else {
                showErrorMessage('❌ ' + response.message);
            }
        },
        error: function () {
            hideLoading();
            showErrorMessage('❌ Có lỗi xảy ra khi thêm vào giỏ hàng!');
        }
    });
}

// FUNCTION MUA NGAY (chuyển thẳng đến giỏ hàng)
function buyNow(bookId) {
    showLoading('Đang xử lý...');

    $.ajax({
        url: '/Cart/AddToCartAjax',
        type: 'POST',
        data: { bookId: bookId, quantity: 1 },
        success: function (response) {
            hideLoading();
            if (response.success) {
                // Chuyển thẳng đến trang giỏ hàng
                window.location.href = '/Cart';
            } else {
                showErrorMessage('❌ ' + response.message);
            }
        },
        error: function () {
            hideLoading();
            showErrorMessage('❌ Có lỗi xảy ra!');
        }
    });
}

// Xử lý sự kiện khi trang load xong
$(document).ready(function () {
    // Xử lý sự kiện Thêm vào giỏ
    $('.btn-add-to-cart').on('click', function () {
        var bookId = $(this).data('book-id');
        addToCart(bookId);
    });

    // Xử lý sự kiện Mua hàng
    $('.btn-buy-now').on('click', function () {
        var bookId = $(this).data('book-id');
        buyNow(bookId);
    });

    // Lấy số lượng giỏ hàng khi trang load
    updateCartOnLoad();
});

// Cập nhật số lượng giỏ hàng khi trang load
function updateCartOnLoad() {
    $.ajax({
        url: '/Cart/GetCartCount',
        type: 'GET',
        success: function (response) {
            if (response.count !== undefined) {
                updateCartCount(response.count);
            }
        }
    });
}

// Các hàm khác cho giỏ hàng (nếu có)
function updateQuantity(bookId, quantity) {
    // Logic cập nhật số lượng
} function removeFromCart(bookId) {
    // Logic xóa khỏi giỏ hàng
}

// Thêm vào file cart.js - xử lý nút Mua hàng
$(document).ready(function () {
    // Xử lý sự kiện nút Mua hàng
    $('.buy-now-btn').on('click', function () {
        var bookId = $(this).data('book-id');
        var bookTitle = $(this).data('book-title');
        buyNowProduct(bookId, bookTitle);
    });

    // Xử lý sự kiện nút Thêm vào giỏ
    $('.add-to-cart-btn').on('click', function () {
        var bookId = $(this).data('book-id');
        var bookTitle = $(this).data('book-title');
        addToCart(bookId, bookTitle);
    });
});

// Function xử lý Mua hàng
function buyNowProduct(bookId, bookTitle) {
    showLoading('Đang thêm sản phẩm...');

    $.ajax({
        url: '/Cart/AddToCartAjax',
        type: 'POST',
        data: {
            bookId: bookId,
            quantity: 1
        },
        success: function (response) {
            hideLoading();
            if (response.success) {
                showSuccessMessage('✅ Đã thêm "' + bookTitle + '" vào giỏ hàng!');
                // Cập nhật số lượng giỏ hàng
                updateCartCount(response.cartCount);
                // Chuyển đến trang giỏ hàng sau 1 giây
                setTimeout(function () {
                    window.location.href = '/Cart';
                }, 1000);
            } else {
                showErrorMessage('❌ ' + response.message);
            }
        },
        error: function () {
            hideLoading();
            showErrorMessage('❌ Có lỗi xảy ra khi thêm vào giỏ hàng!');
        }
    });
}

// Function xử lý Thêm vào giỏ (giữ nguyên)
function addToCart(bookId, bookTitle) {
    showLoading('Đang thêm vào giỏ...');

    $.ajax({
        url: '/Cart/AddToCartAjax',
        type: 'POST',
        data: {
            bookId: bookId,
            quantity: 1
        },
        success: function (response) {
            hideLoading();
            if (response.success) {
                showSuccessMessage('✅ Đã thêm "' + bookTitle + '" vào giỏ hàng!');
                // Cập nhật số lượng giỏ hàng
                updateCartCount(response.cartCount);
            } else {
                showErrorMessage('❌ ' + response.message);
            }
        },
        error: function () {
            hideLoading();
            showErrorMessage('❌ Có lỗi xảy ra khi thêm vào giỏ hàng!');
        }
    });
}