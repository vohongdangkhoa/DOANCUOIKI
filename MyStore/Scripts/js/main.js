// Main JavaScript file - Common functionality
class CartManager {
    constructor() {
        this.updateCartCount();
    }

    updateCartCount() {
        // Cart count sẽ được update từ server
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type === 'error' ? 'error' : ''}`;
        notification.style.animation = 'slideInRight 0.3s ease';

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

    addToCart(bookId, quantity = 1, redirectToCart = false) {
        fetch('/Cart/AddToCartAjax', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({ bookId, quantity })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    this.showNotification('Đã thêm vào giỏ hàng!');
                    this.updateCartCountUI(quantity);

                    // THÊM: Chuyển hướng đến giỏ hàng sau 1 giây
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
                this.showNotification('Có lỗi xảy ra!', 'error');
            });
    }

    updateCartCountUI(quantity = 1) {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const currentCount = parseInt(cartCount.textContent) || 0;
            cartCount.textContent = currentCount + quantity;
            cartCount.style.transform = 'scale(1.2)';
            setTimeout(() => {
                cartCount.style.transform = 'scale(1)';
            }, 300);
        }
    }
}

// Simple Carousel
class SimpleCarousel {
    constructor(container) {
        this.container = container;
        this.slides = container.querySelectorAll('.slide');
        this.dots = container.querySelectorAll('.dot');
        this.prevBtn = container.querySelector('.carousel-prev');
        this.nextBtn = container.querySelector('.carousel-next');
        this.currentSlide = 0;
        this.interval = null;

        this.init();
    }

    init() {
        if (this.slides.length === 0) return;

        // Show first slide
        this.showSlide(this.currentSlide);

        // Auto slide
        this.startAutoSlide();

        // Event listeners
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.stopAutoSlide();
                this.prevSlide();
                this.startAutoSlide();
            });
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.stopAutoSlide();
                this.nextSlide();
                this.startAutoSlide();
            });
        }

        // Dot click events
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.stopAutoSlide();
                this.showSlide(index);
                this.startAutoSlide();
            });
        });

        // Pause on hover
        this.container.addEventListener('mouseenter', () => this.stopAutoSlide());
        this.container.addEventListener('mouseleave', () => this.startAutoSlide());
    }

    showSlide(index) {
        // Hide all slides
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.dots.forEach(dot => dot.classList.remove('active'));

        // Show current slide
        this.slides[index].classList.add('active');
        this.dots[index].classList.add('active');
        this.currentSlide = index;
    }

    nextSlide() {
        const next = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(next);
    }

    prevSlide() {
        const prev = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.showSlide(prev);
    }

    startAutoSlide() {
        this.stopAutoSlide();
        this.interval = setInterval(() => this.nextSlide(), 4000);
    }

    stopAutoSlide() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    console.log('MyStore - Initializing...');

    // Initialize Cart Manager
    const cartManager = new CartManager();
    window.cartManager = cartManager;

    // Initialize Carousel
    const carousel = document.querySelector('.banner-carousel');
    if (carousel && carousel.querySelectorAll('.slide').length > 0) {
        new SimpleCarousel(carousel);
    }

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (e) {
            if (!e.target.closest('.navbar')) {
                navMenu.classList.remove('active');
            }
        });

        // Close menu when clicking on links
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

    // Add to cart buttons
    // Add to cart buttons - THÊM CHUYỂN HƯỚNG
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const bookId = this.dataset.bookId;
            if (bookId) {
                // THÊM: Tham số true để chuyển hướng đến giỏ hàng
                cartManager.addToCart(bookId, 1, true);
            }
        });
    });

    // Search form validation
    const searchForm = document.querySelector('.search-box form');
    if (searchForm) {
        searchForm.addEventListener('submit', function (e) {
            const input = this.querySelector('input[name="q"]');
            if (!input.value.trim()) {
                e.preventDefault();
                input.focus();
            }
        });
    }

    // Active navigation link
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-menu a').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    console.log('MyStore - Initialization complete');
});

// Global utility functions
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}