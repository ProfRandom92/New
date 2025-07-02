// Product data
const products = [
    {
        id: 1,
        name: "Handgetöpferte Vase",
        description: "Elegante Keramikvase in erdigen Tönen",
        price: 45.99,
        category: "keramik",
        icon: "fas fa-wine-glass-alt"
    },
    {
        id: 2,
        name: "Raysin Engel",
        description: "Liebevoll gefertigte Engelsfigur aus Raysin",
        price: 28.50,
        category: "raysin",
        icon: "fas fa-user-friends"
    },
    {
        id: 3,
        name: "Keramik Schale",
        description: "Handgedrehte Schale für Dekoration",
        price: 32.99,
        category: "keramik",
        icon: "fas fa-circle-notch"
    },
    {
        id: 4,
        name: "Raysin Herz",
        description: "Dekoratives Herz als Geschenkidee",
        price: 19.95,
        category: "raysin",
        icon: "fas fa-heart"
    },
    {
        id: 5,
        name: "Geschenkset Keramik",
        description: "Set aus Vase und Schale in Geschenkbox",
        price: 65.00,
        category: "geschenke",
        icon: "fas fa-gift"
    },
    {
        id: 6,
        name: "Keramik Teller Set",
        description: "4-teiliges Tellerset handgetöpfert",
        price: 89.99,
        category: "keramik",
        icon: "fas fa-circle"
    },
    {
        id: 7,
        name: "Raysin Blume",
        description: "Detailreiche Blumendekoration",
        price: 24.50,
        category: "raysin",
        icon: "fas fa-seedling"
    },
    {
        id: 8,
        name: "Geschenkset Mix",
        description: "Kombination aus Keramik und Raysin",
        price: 55.00,
        category: "geschenke",
        icon: "fas fa-gift"
    }
];

// Shopping cart (persistent across pages)
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM elements
const cartModal = document.getElementById('cart-modal');
const cartToggle = document.getElementById('cart-toggle');
const closeCart = document.querySelector('.close-cart');
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const productGrid = document.getElementById('product-grid');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    displayProducts(products);
    setupEventListeners();
    updateCartDisplay();
});

// Display products
function displayProducts(productsToShow) {
    productGrid.innerHTML = '';
    
    productsToShow.forEach(product => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });
}

// Create product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    card.innerHTML = `
        <div class="product-image">
            <i class="${product.icon}"></i>
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">€${product.price.toFixed(2)}</div>
            <button class="add-to-cart" onclick="addToCart(${product.id})">
                In den Warenkorb
            </button>
        </div>
    `;
    
    return card;
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartDisplay();
    showNotification('Produkt wurde zum Warenkorb hinzugefügt!');
}

// Remove product from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartDisplay();
}

// Update cart display
function updateCartDisplay() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: var(--light-text);">Ihr Warenkorb ist leer</p>';
    } else {
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>Menge: ${item.quantity}</p>
                </div>
                <div class="cart-item-price">
                    €${(item.price * item.quantity).toFixed(2)}
                    <button onclick="removeFromCart(${item.id})" style="margin-left: 10px; background: none; border: none; color: var(--light-text); cursor: pointer;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            cartItems.appendChild(cartItem);
        });
    }
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
}

// Setup event listeners
function setupEventListeners() {
    // Cart modal
    cartToggle.addEventListener('click', (e) => {
        e.preventDefault();
        cartModal.style.display = 'block';
    });
    
    closeCart.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
    
    // Mobile navigation
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    
    // Category filtering - redirect to products page
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const category = e.target.closest('.category-card').dataset.category;
            window.location.href = `products.html?category=${category}`;
        });
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });
    
    // Contact form
    document.querySelector('.contact-form').addEventListener('submit', handleContactForm);
    
    // Checkout button
    document.querySelector('.checkout-btn').addEventListener('click', handleCheckout);
}

// Filter products by category
function filterProducts(category) {
    const filteredProducts = products.filter(product => product.category === category);
    displayProducts(filteredProducts);
    
    // Scroll to products section
    document.querySelector('#products').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

// Handle contact form submission
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('name') || e.target.querySelector('input[type="text"]').value;
    const email = formData.get('email') || e.target.querySelector('input[type="email"]').value;
    const message = formData.get('message') || e.target.querySelector('textarea').value;
    
    // Here you would typically send the data to a server
    showNotification('Vielen Dank für Ihre Nachricht! Wir melden uns bald bei Ihnen.');
    e.target.reset();
}

// Handle checkout
function handleCheckout() {
    if (cart.length === 0) {
        showNotification('Ihr Warenkorb ist leer!');
        return;
    }
    
    // Here you would typically redirect to a payment processor
    showNotification('Weiterleitung zur Bezahlung... (Demo-Modus)');
    
    // For demo purposes, clear the cart after a delay
    setTimeout(() => {
        cart = [];
        saveCart();
        updateCartDisplay();
        cartModal.style.display = 'none';
        showNotification('Bestellung erfolgreich abgeschlossen! (Demo)');
    }, 2000);
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 1rem 2rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow);
        z-index: 3000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.backgroundColor = 'var(--white)';
        header.style.backdropFilter = 'none';
    }
});

// Add mobile menu styles
const mobileMenuStyles = `
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            top: 80px;
            left: -100%;
            width: 100%;
            height: calc(100vh - 80px);
            background: var(--white);
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            padding-top: 2rem;
            transition: left 0.3s ease;
            box-shadow: var(--shadow);
        }
        
        .nav-menu.active {
            left: 0;
        }
        
        .nav-menu li {
            margin: 1rem 0;
        }
        
        .hamburger.active span:nth-child(1) {
            transform: rotate(-45deg) translate(-5px, 6px);
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
            transform: rotate(45deg) translate(-5px, -6px);
        }
    }
`;

// Add mobile styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = mobileMenuStyles;
document.head.appendChild(styleSheet);

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.category-card, .product-card, .contact-item');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Add some easter egg functionality for the ceramic placeholder
document.querySelector('.ceramic-placeholder').addEventListener('click', () => {
    const placeholder = document.querySelector('.ceramic-placeholder');
    placeholder.style.transform = 'rotate(360deg)';
    setTimeout(() => {
        placeholder.style.transform = 'rotate(0deg)';
    }, 1000);
    
    showNotification('🏺 Handgemacht mit Liebe! 💕');
});

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}