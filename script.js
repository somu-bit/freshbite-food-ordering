const foodItems = [
    { id: 1, name: "Margherita Basil Pizza", price: 12.99, category: "Pizza", type: "veg", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500", description: "Fresh mozzarella, organic basil, and San Marzano tomato sauce." },
    { id: 2, name: "Double Smash Burger", price: 9.99, category: "Burgers", type: "non-veg", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500", description: "Two seared beef patties, melted cheddar, lettuce, and secret sauce." },
    { id: 3, name: "Creamy Arrabbiata Pasta", price: 11.50, category: "Pasta", type: "veg", image: "https://images.unsplash.com/photo-1621996346565-e3d5d6281293?w=500", description: "Penne tossed in spicy tomato sauce, garlic, and fresh parmesan." },
    { id: 4, name: "Crispy BBQ Wings", price: 8.49, category: "Sides", type: "non-veg", image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500", description: "Golden fried chicken wings tossed in tangy barbecue glaze." }
];

let cart = JSON.parse(localStorage.getItem('freshbite_cart')) || [];
let activeCategory = 'all';
let activeDietary = 'all';

document.addEventListener('DOMContentLoaded', () => {
    renderFoodGrid();
    updateCartUI();
});

function renderFoodGrid() {
    const foodGrid = document.getElementById('food-grid');
    if (!foodGrid) return;

    const filteredItems = foodItems.filter(item => {
        const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
        const matchesDietary = activeDietary === 'all' || item.type === activeDietary;
        return matchesCategory && matchesDietary;
    });

    foodGrid.innerHTML = filteredItems.map(item => `
        <div class="food-card">
            <img src="${item.image}" alt="${item.name}">
            <div class="food-info">
                <h3 class="food-title">${item.name}</h3>
                <p class="food-desc">${item.description}</p>
                <div class="food-bottom">
                    <span class="food-price">$${item.price.toFixed(2)}</span>
                    <button class="btn btn-primary" onclick="addToCart(${item.id})">Add to Cart</button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterCategory(category) {
    activeCategory = category;
    renderFoodGrid();
}

function filterDietary(dietary, event) {
    activeDietary = dietary;
    document.querySelectorAll('.dietary-filters .filter-btn').forEach(btn => btn.classList.remove('active'));
    if (event) event.target.classList.add('active');
    renderFoodGrid();
}

function toggleMobileMenu() {
    document.getElementById('navLinks').classList.toggle('active');
}

function toggleCartModal() {
    document.getElementById('cartModal').classList.toggle('active');
}

function addToCart(productId) {
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        const product = foodItems.find(p => p.id === productId);
        cart.push({ ...product, quantity: 1 });
    }
    updateCartUI();
}

function updateQuantity(productId, change) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== productId);
    }
    updateCartUI();
}

function updateCartUI() {
    localStorage.setItem('freshbite_cart', JSON.stringify(cart));

    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => el.textContent = totalCount);

    const cartItemsList = document.getElementById('cartItems');
    if (cartItemsList) {
        if (cart.length === 0) {
            cartItemsList.innerHTML = '<p style="text-align:center; padding: 20px;">Your cart is empty.</p>';
        } else {
            cartItemsList.innerHTML = cart.map(item => `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px;">
                    <div>
                        <strong style="display:block;">${item.name}</strong>
                        <span style="color:#666;">$${item.price.toFixed(2)} × ${item.quantity}</span>
                    </div>
                    <div>
                        <button onclick="updateQuantity(${item.id}, -1)" style="padding:2px 8px;">-</button>
                        <span style="margin:0 5px;">${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)" style="padding:2px 8px;">+</button>
                    </div>
                </div>
            `).join('');
        }
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartTotalEl = document.getElementById('cartTotal');
    if (cartTotalEl) cartTotalEl.textContent = `$${total.toFixed(2)}`;
}

function processCheckout() {
    if (cart.length === 0) {
        alert("Your cart is empty. Please add items before checking out!");
        return;
    }
    alert("Order placed successfully! Thank you for choosing FreshBite.");
    cart = [];
    updateCartUI();
    toggleCartModal();
}

function handleLogin(e) {
    e.preventDefault();
    alert("Login successful! Welcome to FreshBite.");
}