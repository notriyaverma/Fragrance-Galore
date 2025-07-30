// Cart Management System
class CartManager {
    constructor() {
        this.cart = [];
        this.cartCount = document.querySelector('.cart-count');
        this.loginIcon = document.getElementById('loginIcon');
        this.cartIcon = document.getElementById('cartIcon');
        this.init();
    }

    init() {
        // Load cart from localStorage on page load
        this.loadCart();
        this.bindEvents();
        this.updateCartUI();
    }

    // Event listeners
    bindEvents() {
        // Login click handler
        if (this.loginIcon) {
            this.loginIcon.addEventListener('click', (e) => {
                e.preventDefault();
                this.showLoginModal();
            });
        }

        // Cart click handler
        if (this.cartIcon) {
            this.cartIcon.addEventListener('click', (e) => {
                e.preventDefault();
                this.showCartModal();
            });
        }

        // Add to cart buttons (assuming they have class 'add-to-cart')
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart')) {
                e.preventDefault();
                const productData = this.getProductData(e.target);
                this.addToCart(productData);
            }
        });
    }

    // Get product data from button attributes
    getProductData(button) {
        return {
            id: button.dataset.productId || Date.now().toString(),
            name: button.dataset.productName || 'Fragrance',
            price: parseFloat(button.dataset.productPrice) || 0,
            image: button.dataset.productImage || '',
            category: button.dataset.productCategory || 'fragrance',
            quantity: 1
        };
    }

    // Add item to cart
    addToCart(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push(product);
        }
        
        this.saveCart();
        this.updateCartUI();
        this.showAddToCartNotification(product.name);
    }

    // Remove item from cart
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartUI();
        this.refreshCartModal();
    }

    // Update item quantity
    updateQuantity(productId, newQuantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (newQuantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = newQuantity;
                this.saveCart();
                this.updateCartUI();
                this.refreshCartModal();
            }
        }
    }

    // Get cart total
    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Get total item count
    getTotalItems() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    // Update cart UI (count badge)
    updateCartUI() {
        const totalItems = this.getTotalItems();
        
        if (this.cartCount) {
            this.cartCount.textContent = totalItems;
            if (totalItems > 0) {
                this.cartCount.style.display = 'flex';
            } else {
                this.cartCount.style.display = 'none';
            }
        }
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('fragranceCart', JSON.stringify(this.cart));
    }

    // Load cart from localStorage
    loadCart() {
        const savedCart = localStorage.getItem('fragranceCart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
        }
    }

    // Clear entire cart
    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartUI();
        this.refreshCartModal();
    }

    // Show add to cart notification
    showAddToCartNotification(productName) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span>✓ ${productName} added to list!</span>
            </div>
        `;
        
        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #9D4352;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Show login modal
    showLoginModal() {
        const modal = this.createModal('Login', `
            <form class="login-form">
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" required>
                </div>
                <div class="form-group">
                    <label for="password">Password:</label>
                    <input type="password" id="password" required>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-primary">Login</button>
                    <button type="button" class="btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                </div>
            </form>
        `);
        
        modal.querySelector('.login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Login functionality would connect to your authentication system');
            modal.remove();
        });
    }

    // Show cart modal
    showCartModal() {
        const cartHTML = this.generateCartHTML();
        const modal = this.createModal('Wishlist', cartHTML);
        
        // Add event listeners for cart actions
        this.bindCartModalEvents(modal);
    }

    // Generate cart HTML
    generateCartHTML() {
        if (this.cart.length === 0) {
            return `
                <div class="empty-cart">
                    <p>Your wishlist is empty</p>
                    <button class="btn-primary" onclick="this.closest('.modal').remove()">Continue Shopping</button>
                </div>
            `;
        }

        const cartItems = this.cart.map(item => `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yMCAyMEg0MFY0MEgyMFYyMFoiIHN0cm9rZT0iIzk5OTk5OSIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+CjwvcG2nPg=='">
                </div>
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p class="item-category">${item.category}</p>
                    <p class="item-price">$${item.price.toFixed(2)}</p>
                </div>
                <div class="quantity-controls">
                    <button class="qty-btn minus" data-action="decrease">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="qty-btn plus" data-action="increase">+</button>
                </div>
                <div class="item-total">
                    $${(item.price * item.quantity).toFixed(2)}
                </div>
                <button class="remove-item" data-action="remove">×</button>
            </div>
        `).join('');

        return `
            <div class="cart-content">
                <div class="cart-items">
                    ${cartItems}
                </div>
                <div class="cart-summary">
                    <div class="cart-total">
                        <strong>Total: $${this.getCartTotal().toFixed(2)}</strong>
                    </div>
                    <div class="cart-actions">
                        <button class="btn-secondary clear-cart">Clear Cart</button>
                        <button class="btn-primary checkout-btn">Checkout</button>
                    </div>
                </div>
            </div>
        `;
    }

    // Bind cart modal events
    bindCartModalEvents(modal) {
        modal.addEventListener('click', (e) => {
            const productId = e.target.closest('.cart-item')?.dataset.productId;
            const action = e.target.dataset.action;

            switch(action) {
                case 'increase':
                    const currentQty = parseInt(e.target.parentElement.querySelector('.quantity').textContent);
                    this.updateQuantity(productId, currentQty + 1);
                    break;
                case 'decrease':
                    const currentQtyDec = parseInt(e.target.parentElement.querySelector('.quantity').textContent);
                    this.updateQuantity(productId, currentQtyDec - 1);
                    break;
                case 'remove':
                    if (confirm('Remove this item from wishlist?')) {
                        this.removeFromCart(productId);
                    }
                    break;
            }
        });

        // Clear cart button
        modal.querySelector('.clear-cart')?.addEventListener('click', () => {
            if (confirm('Clear entire list?')) {
                this.clearCart();
            }
        });

        // Checkout button
        modal.querySelector('.checkout-btn')?.addEventListener('click', () => {
            alert(`Proceeding to checkout with ${this.getTotalItems()} items totaling $${this.getCartTotal().toFixed(2)}`);
            modal.remove();
        });
    }

    // Refresh cart modal content
    refreshCartModal() {
        const existingModal = document.querySelector('.modal');
        if (existingModal && existingModal.querySelector('.cart-content')) {
            const modalBody = existingModal.querySelector('.modal-body');
            modalBody.innerHTML = this.generateCartHTML();
            this.bindCartModalEvents(existingModal);
        }
    }

    // Create modal utility
    createModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-container">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close">×</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;

        // Add modal styles
        this.addModalStyles();
        
        document.body.appendChild(modal);

        // Close modal events
        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
        modal.querySelector('.modal-overlay').addEventListener('click', () => modal.remove());

        return modal;
    }

    // Add modal styles
    addModalStyles() {
        if (!document.querySelector('#cart-modal-styles')) {
            const styles = document.createElement('style');
            styles.id = 'cart-modal-styles';
            styles.textContent = `
                .modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 10000; }
                .modal-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); }
                .modal-container { position: relative; max-width: 600px; margin: 50px auto; background: white; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
                .modal-header { padding: 20px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
                .modal-close { background: none; border: none; font-size: 24px; cursor: pointer; }
                .modal-body { padding: 20px; max-height: 500px; overflow-y: auto; }
                .cart-item { display: flex; align-items: center; gap: 15px; padding: 15px 0; border-bottom: 1px solid #eee; }
                .item-image img { width: 60px; height: 60px; object-fit: cover; border-radius: 8px; }
                .item-details { flex: 1; }
                .item-details h4 { margin: 0 0 5px 0; }
                .item-category { color: #666; margin: 0; }
                .quantity-controls { display: flex; align-items: center; gap: 10px; }
                .qty-btn { width: 30px; height: 30px; border: 1px solid #ddd; background: white; cursor: pointer; }
                .remove-item { background: #ff4444; color: white; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; }
                .cart-summary { margin-top: 20px; padding-top: 20px; border-top: 2px solid #eee; }
                .cart-total { font-size: 18px; margin-bottom: 15px; }
                .cart-actions { display: flex; gap: 10px; }
                .btn-primary, .btn-secondary { padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; }
                .btn-primary { background: #9D4352; color: white; }
                .btn-secondary { background: #eee; color: #333; }
                .empty-cart { text-align: center; padding: 40px; }
                .form-group { margin-bottom: 15px; }
                .form-group label { display: block; margin-bottom: 5px; }
                .form-group input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
                .form-actions { display: flex; gap: 10px; justify-content: flex-end; }
                @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
                @keyframes slideOut { from { transform: translateX(0); } to { transform: translateX(100%); } }
            `;
            document.head.appendChild(styles);
        }
    }
}

// Initialize cart manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.cartManager = new CartManager();
});

document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('saved');
      // Here you can add code to save to localStorage or database
    });
  });

// Example usage for product buttons:
// <button class="add-to-cart" 
//         data-product-id="frag001" 
//         data-product-name="Chanel No. 5" 
//         data-product-price="120.00" 
//         data-product-image="/images/chanel.jpg"
//         data-product-category="floral">
//     Add to Cart
// </button>