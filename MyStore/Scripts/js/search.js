// Search page functionality
class SearchPage {
    constructor() {
        this.currentSort = 'default';
        this.init();
    }

    init() {
        this.setupSorting();
        this.setupAddToCartButtons();
        this.highlightSearchTerms();
        this.setupSearchSuggestions();
    }

    setupSorting() {
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.sortProducts(this.currentSort);
            });
        }
    }

    sortProducts(sortBy) {
        const productsGrid = document.querySelector('.search-grid');
        const products = Array.from(productsGrid.querySelectorAll('.product-card'));

        products.sort((a, b) => {
            const priceA = this.parsePrice(a.querySelector('.product-price').textContent);
            const priceB = this.parsePrice(b.querySelector('.product-price').textContent);
            const nameA = a.dataset.name;
            const nameB = b.dataset.name;

            switch (sortBy) {
                case 'price_asc':
                    return priceA - priceB;
                case 'price_desc':
                    return priceB - priceA;
                case 'name_asc':
                    return nameA.localeCompare(nameB);
                case 'name_desc':
                    return nameB.localeCompare(nameA);
                default:
                    return 0;
            }
        });

        // Clear and re-append sorted products
        productsGrid.innerHTML = '';
        products.forEach(product => productsGrid.appendChild(product));

        this.showNotification(`Đã sắp xếp theo ${this.getSortLabel(sortBy)}`);
    }

    getSortLabel(sortBy) {
        const labels = {
            'default': 'mặc định',
            'price_asc': 'giá thấp đến cao',
            'price_desc': 'giá cao đến thấp',
            'name_asc': 'tên A-Z',
            'name_desc': 'tên Z-A'
        };
        return labels[sortBy] || 'mặc định';
    }

    setupAddToCartButtons() {
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const bookId = btn.dataset.bookId;
                this.addToCart(bookId, 1);
            });
        });
    }

    addToCart(bookId, quantity) {
        this.showLoading(bookId);

        fetch('/Cart/AddToCart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `bookId=${bookId}&quantity=${quantity}`
        })
            .then(response => {
                if (response.ok) {
                    this.hideLoading(bookId);
                    this.showNotification('Đã thêm vào giỏ hàng!', 'success');
                    this.updateCartCount(quantity);
                } else {
                    throw new Error('Failed to add to cart');
                }
            })
            .catch(error => {
                console.error('Error adding to cart:', error);
                this.hideLoading(bookId);
                this.showNotification('Có lỗi xảy ra khi thêm vào giỏ hàng!', 'error');
            });
    }

    highlightSearchTerms() {
        const searchQuery = document.querySelector('.search-query')?.textContent;
        if (!searchQuery) return;

        const productTitles = document.querySelectorAll('.product-title');
        const regex = new RegExp(searchQuery, 'gi');

        productTitles.forEach(title => {
            const originalText = title.textContent;
            const highlightedText = originalText.replace(regex,
                match => `<span class="search-highlight">${match}</span>`
            );
            title.innerHTML = highlightedText;
        });
    }

    setupSearchSuggestions() {
        // Add analytics tracking for suggestion clicks
        document.querySelectorAll('.suggestion-tag').forEach(tag => {
            tag.addEventListener('click', (e) => {
                const searchQuery = tag.textContent;
                console.log('Suggestion clicked:', searchQuery);
                // You can add analytics tracking here
            });
        });
    }

    parsePrice(priceString) {
        return parseInt(priceString.replace(/[^\d]/g, '')) || 0;
    }

    showLoading(bookId) {
        const button = document.querySelector(`.add-to-cart-btn[data-book-id="${bookId}"]`);
        if (button) {
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang thêm...';
            button.disabled = true;
            button.setAttribute('data-original-text', originalText);
        }
    }

    hideLoading(bookId) {
        const button = document.querySelector(`.add-to-cart-btn[data-book-id="${bookId}"]`);
        if (button && button.getAttribute('data-original-text')) {
            button.innerHTML = button.getAttribute('data-original-text');
            button.disabled = false;
        }
    }

    updateCartCount(quantity = 1) {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const currentCount = parseInt(cartCount.textContent) || 0;
            cartCount.textContent = currentCount + quantity;

            // Add animation
            cartCount.style.transform = 'scale(1.3)';
            setTimeout(() => {
                cartCount.style.transform = 'scale(1)';
            }, 300);
        }
    }

    showNotification(message, type = 'success') {
        // Use cartManager if available from main.js
        if (window.cartManager) {
            window.cartManager.showNotification(message, type);
        } else {
            // Fallback notification
            const notification = document.createElement('div'); notification.className = `notification notification-${type}`;
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

    showError(message) {
        const resultsContainer = document.querySelector('.search-results');
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="search-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Đã có lỗi xảy ra</h3>
                    <p>${message}</p>
                    <button onclick="location.reload()" class="btn-retry">
                        Thử lại
                    </button>
                </div>
            `;
        }
    }
}

// Add CSS animations for search page
const searchStyles = document.createElement('style');
searchStyles.textContent = `
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
    
    .cart-count {
        transition: transform 0.3s ease;
    }
    
    .add-to-cart-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    
    .fa-spin {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(searchStyles);

// Initialize search page
document.addEventListener('DOMContentLoaded', function () {
    new SearchPage();
});