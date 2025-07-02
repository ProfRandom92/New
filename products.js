// Extended product catalog
const allProducts = [
    {
        id: 1,
        name: "Handgetöpferte Vase Luna",
        description: "Elegante Keramikvase in erdigen Tönen mit natürlicher Glasur",
        price: 45.99,
        category: "keramik",
        icon: "fas fa-wine-glass-alt",
        featured: true
    },
    {
        id: 2,
        name: "Raysin Engel Gabriel",
        description: "Liebevoll gefertigte Engelsfigur aus Raysin, 15cm hoch",
        price: 28.50,
        category: "raysin",
        icon: "fas fa-user-friends",
        featured: true
    },
    {
        id: 3,
        name: "Keramik Schale Terra",
        description: "Handgedrehte Schale für Dekoration oder als Obstschale",
        price: 32.99,
        category: "keramik",
        icon: "fas fa-circle-notch",
        featured: false
    },
    {
        id: 4,
        name: "Raysin Herz Romance",
        description: "Dekoratives Herz als Geschenkidee, handgemalt",
        price: 19.95,
        category: "raysin",
        icon: "fas fa-heart",
        featured: true
    },
    {
        id: 5,
        name: "Geschenkset Harmonie",
        description: "Set aus Vase und Schale in Geschenkbox mit Schleife",
        price: 65.00,
        category: "geschenke",
        icon: "fas fa-gift",
        featured: true
    },
    {
        id: 6,
        name: "Keramik Teller Set Familia",
        description: "4-teiliges Tellerset handgetöpfert, spülmaschinenfest",
        price: 89.99,
        category: "keramik",
        icon: "fas fa-circle",
        featured: false
    },
    {
        id: 7,
        name: "Raysin Blume Primavera",
        description: "Detailreiche Blumendekoration für Frühlingsstimmung",
        price: 24.50,
        category: "raysin",
        icon: "fas fa-seedling",
        featured: false
    },
    {
        id: 8,
        name: "Geschenkset Liebe",
        description: "Kombination aus Keramik und Raysin für Verliebte",
        price: 55.00,
        category: "geschenke",
        icon: "fas fa-gift",
        featured: false
    },
    {
        id: 9,
        name: "Keramik Krug Nostalgia",
        description: "Rustikaler Wasserkrug mit traditioneller Glasur",
        price: 38.75,
        category: "keramik",
        icon: "fas fa-wine-bottle",
        featured: false
    },
    {
        id: 10,
        name: "Raysin Katze Mimi",
        description: "Verspielte Katzenfigur, handbemalt mit Liebe zum Detail",
        price: 22.90,
        category: "raysin",
        icon: "fas fa-cat",
        featured: false
    },
    {
        id: 11,
        name: "Keramik Tassen Set Morgen",
        description: "2er Set handgetöpferte Kaffeetassen mit Unterteller",
        price: 42.50,
        category: "keramik",
        icon: "fas fa-coffee",
        featured: false
    },
    {
        id: 12,
        name: "Raysin Vogel Melodie",
        description: "Singvogel-Dekoration für Garten oder Fensterbank",
        price: 18.75,
        category: "raysin",
        icon: "fas fa-dove",
        featured: false
    },
    {
        id: 13,
        name: "Geschenkset Baby",
        description: "Süßes Set für Neugeborene mit Keramik-Geschirr",
        price: 49.99,
        category: "geschenke",
        icon: "fas fa-baby",
        featured: false
    },
    {
        id: 14,
        name: "Keramik Lampenschirm Zen",
        description: "Eleganter Lampenschirm aus durchscheinender Keramik",
        price: 67.50,
        category: "keramik",
        icon: "fas fa-lightbulb",
        featured: false
    },
    {
        id: 15,
        name: "Raysin Weihnachtsengel",
        description: "Festlicher Engel für die Weihnachtszeit, goldene Akzente",
        price: 35.00,
        category: "raysin",
        icon: "fas fa-star",
        featured: false
    }
];

// Shopping cart (shared across pages)
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM elements
const cartModal = document.getElementById('cart-modal');
const cartToggle = document.getElementById('cart-toggle');
const closeCart = document.querySelector('.close-cart');
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const productsGrid = document.getElementById('products-grid');
const searchInput = document.getElementById('search-input');
const filterBtns = document.querySelectorAll('.filter-btn');
const sortSelect = document.getElementById('sort-select');
const noResults = document.getElementById('no-results');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Current display state
let currentProducts = [...allProducts];
let currentFilter = 'all';
let currentSort = 'name';
let currentSearch = '';

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Check for URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    
    if (categoryParam && categoryParam !== 'all') {
        currentFilter = categoryParam;
        // Update active filter button
        filterBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === categoryParam) {
                btn.classList.add('active');
            }
        });
        applyFilters();
    } else {
        displayProducts();
    }
    
    updateCartDisplay();
    setupEventListeners();
});

// Display products
function displayProducts() {
    productsGrid.innerHTML = '';
    
    if (currentProducts.length === 0) {
        noResults.style.display = 'block';
        return;
    } else {
        noResults.style.display = 'none';
    }
    
    currentProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
    
    // Animate cards
    animateProductCards();
}

// Create product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const badgeHtml = product.featured ? '<div class="featured-badge">Beliebt</div>' : '';
    
    card.innerHTML = `
        ${badgeHtml}
        <div class="product-image">
            <i class="${product.icon}"></i>
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">€${product.price.toFixed(2)}</div>
            <button class="add-to-cart" onclick="addToCart(${product.id})">
                <i class="fas fa-cart-plus"></i> In den Warenkorb
            </button>
        </div>
    `;
    
    return card;
}

// Filter and search functions
function applyFilters() {
    let filtered = [...allProducts];
    
    // Apply category filter
    if (currentFilter !== 'all') {
        filtered = filtered.filter(product => product.category === currentFilter);
    }
    
    // Apply search filter
    if (currentSearch) {
        filtered = filtered.filter(product => 
            product.name.toLowerCase().includes(currentSearch.toLowerCase()) ||
            product.description.toLowerCase().includes(currentSearch.toLowerCase())
        );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
        switch (currentSort) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'name':
            default:
                return a.name.localeCompare(b.name);
        }
    });
    
    currentProducts = filtered;
    displayProducts();
}

// Add product to cart
function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
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
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
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
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
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
    
    // Search functionality
    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value;
        applyFilters();
    });
    
    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            applyFilters();
        });
    });
    
    // Sort select
    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        applyFilters();
    });
    
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = e.target.querySelector('input[type="email"]').value;
            showNotification('Vielen Dank! Sie wurden für den Newsletter angemeldet.');
            e.target.reset();
        });
    }
    
    // Checkout button
    document.querySelector('.checkout-btn').addEventListener('click', handleCheckout);
}

// Handle checkout
function handleCheckout() {
    if (cart.length === 0) {
        showNotification('Ihr Warenkorb ist leer!');
        return;
    }
    
    showNotification('Weiterleitung zur Bezahlung... (Demo-Modus)');
    
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
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Animate product cards
function animateProductCards() {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
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

// Add styles for products page
const productsPageStyles = `
    .page-header {
        background: linear-gradient(135deg, var(--light-background) 0%, var(--accent-color) 100%);
        padding: 8rem 0 4rem;
        text-align: center;
    }
    
    .page-header h1 {
        font-size: 3rem;
        color: var(--primary-color);
        margin-bottom: 1rem;
    }
    
    .page-header p {
        font-size: 1.2rem;
        color: var(--light-text);
    }
    
    .filter-section {
        padding: 2rem 0;
        background: var(--white);
        border-bottom: 1px solid #E0E0E0;
    }
    
    .filter-controls {
        display: grid;
        grid-template-columns: 1fr auto auto;
        gap: 2rem;
        align-items: center;
    }
    
    .search-box {
        position: relative;
    }
    
    .search-box input {
        width: 100%;
        padding: 0.8rem 3rem 0.8rem 1rem;
        border: 2px solid #E0E0E0;
        border-radius: var(--border-radius);
        font-size: 1rem;
    }
    
    .search-box i {
        position: absolute;
        right: 1rem;
        top: 50%;
        transform: translateY(-50%);
        color: var(--light-text);
    }
    
    .filter-buttons {
        display: flex;
        gap: 0.5rem;
    }
    
    .filter-btn {
        padding: 0.8rem 1.5rem;
        border: 2px solid var(--primary-color);
        background: transparent;
        color: var(--primary-color);
        border-radius: var(--border-radius);
        cursor: pointer;
        transition: var(--transition);
    }
    
    .filter-btn.active,
    .filter-btn:hover {
        background: var(--primary-color);
        color: var(--white);
    }
    
    .sort-controls select {
        padding: 0.8rem 1rem;
        border: 2px solid #E0E0E0;
        border-radius: var(--border-radius);
        font-size: 1rem;
        background: var(--white);
    }
    
    .products-page {
        padding: 4rem 0;
        background: var(--light-background);
    }
    
    .products-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
    }
    
    .featured-badge {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: var(--secondary-color);
        color: var(--white);
        padding: 0.3rem 0.8rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
        z-index: 10;
    }
    
    .product-card {
        position: relative;
    }
    
    .no-results {
        text-align: center;
        padding: 4rem 0;
        color: var(--light-text);
    }
    
    .newsletter {
        background: var(--primary-color);
        padding: 4rem 0;
        color: var(--white);
        text-align: center;
    }
    
    .newsletter h2 {
        margin-bottom: 1rem;
        color: var(--white);
    }
    
    .newsletter p {
        margin-bottom: 2rem;
        color: rgba(255, 255, 255, 0.9);
    }
    
    .newsletter-form {
        display: flex;
        max-width: 400px;
        margin: 0 auto;
        gap: 1rem;
    }
    
    .newsletter-form input {
        flex: 1;
        padding: 1rem;
        border: none;
        border-radius: var(--border-radius);
        font-size: 1rem;
    }
    
    .newsletter-form button {
        padding: 1rem 2rem;
        background: var(--secondary-color);
        color: var(--white);
        border: none;
        border-radius: var(--border-radius);
        font-weight: 600;
        cursor: pointer;
        transition: var(--transition);
    }
    
    .newsletter-form button:hover {
        background: #C19B69;
    }
    
    .nav-menu a.active {
        color: var(--primary-color);
        font-weight: 600;
    }
    
    @media (max-width: 768px) {
        .filter-controls {
            grid-template-columns: 1fr;
            gap: 1rem;
        }
        
        .filter-buttons {
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .newsletter-form {
            flex-direction: column;
        }
        
        .page-header h1 {
            font-size: 2rem;
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = productsPageStyles;
document.head.appendChild(styleSheet);