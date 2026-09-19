/* ==========================================================================
   MELLOW BAKERY & SPECIALTY COFFEE ROASTERY - MAIN APP LOGIC
   ========================================================================== */

// 1. PRODUCTS DATABASE
const PRODUCTS = [
  {
    id: 1,
    name: "Golden Almond Croissant",
    category: "pastries",
    price: 4.80,
    rating: 4.9,
    reviewsCount: 142,
    image: "assets/images/croissant.jpg",
    description: "Flaky butter croissant twice-baked with rich almond frangipane cream and topped with toasted sliced almonds & powdered sugar.",
    tags: ["bestseller", "fresh"],
    dietary: "Vegetarian",
    prepTime: "Baked daily at 5:00 AM"
  },
  {
    id: 2,
    name: "Classic Sourdough Loaf",
    category: "breads",
    price: 8.50,
    rating: 4.9,
    reviewsCount: 98,
    image: "assets/images/hero.jpg",
    description: "36-hour long fermentation artisan sourdough made with organic unbleached wheat flour, water, sea salt, and our 10-year heritage starter.",
    tags: ["bestseller", "vegan"],
    dietary: "Vegan / Organic",
    prepTime: "Fermented 36 Hours"
  },
  {
    id: 3,
    name: "Ethiopia Yirgacheffe Beans",
    category: "coffee",
    price: 24.00,
    rating: 5.0,
    reviewsCount: 210,
    image: "assets/images/coffee_beans.jpg",
    description: "Direct trade single-origin heirloom coffee. Medium roast featuring vibrant yellow plum, jasmine blossom, and rich cocoa undertones.",
    tags: ["bestseller", "special"],
    dietary: "100% Arabica",
    prepTime: "Micro-Batch Roasted Weekly"
  },
  {
    id: 4,
    name: "Wild Berry Crème Tart",
    category: "cakes",
    price: 7.20,
    rating: 4.8,
    reviewsCount: 86,
    image: "assets/images/berry_tart.jpg",
    description: "Crisp buttery sable crust filled with Tahitian vanilla bean pastry cream and layered with fresh raspberries, blueberries, and chopped pistachios.",
    tags: ["fresh"],
    dietary: "Vegetarian",
    prepTime: "Handcrafted Morning"
  },
  {
    id: 5,
    name: "Signature Mellow Wax Box",
    category: "giftbox",
    price: 45.00,
    rating: 5.0,
    reviewsCount: 175,
    image: "assets/images/wax_package.jpg",
    description: "Our signature luxury kraft gift box wrapped with jute twine and hand-stamped with the bronze Mellow Wax Seal. Contains 2 Croissants, Sourdough, & Coffee.",
    tags: ["bestseller", "special"],
    dietary: "Artisanal Gift",
    prepTime: "Custom Wax Sealed"
  },
  {
    id: 6,
    name: "Pain au Chocolat",
    category: "pastries",
    price: 4.50,
    rating: 4.9,
    reviewsCount: 114,
    image: "assets/images/croissant.jpg",
    description: "Classic French butter pastry folded with two batons of premium Valrhona 64% dark chocolate.",
    tags: ["fresh"],
    dietary: "Vegetarian",
    prepTime: "Freshly Baked"
  },
  {
    id: 7,
    name: "Rosemary & Sea Salt Focaccia",
    category: "breads",
    price: 9.00,
    rating: 4.7,
    reviewsCount: 64,
    image: "assets/images/hero.jpg",
    description: "High-hydration Italian bread dimpled with cold-pressed extra virgin olive oil, fresh organic rosemary leaves, and flaky Maldon sea salt.",
    tags: ["vegan", "fresh"],
    dietary: "Vegan",
    prepTime: "Stone Deck Baked"
  },
  {
    id: 8,
    name: "Pistachio Craquelin Choux",
    category: "cakes",
    price: 6.50,
    rating: 4.9,
    reviewsCount: 52,
    image: "assets/images/berry_tart.jpg",
    description: "Crispy crunchy choux bun topped with sweet craquelin crust and filled with silky roasted Bronte pistachio praline cream.",
    tags: ["special"],
    dietary: "Vegetarian",
    prepTime: "Limited Batch"
  }
];

// 2. APP STATE MANAGEMENT
let cart = [];
let appliedPromo = null; // { code: 'MELLOW10', discount: 0.10 }
let activeCategory = 'all';
let activeDietaryFilter = null;
let searchQuery = '';

// Simulator State
let simInterval = null;
let simProgress = 0;
let currentSimStage = 0; // 0: Idle, 1: Knead, 2: Bake, 3: Wax, 4: Ready
let currentSimOrderData = null;

// 3. INITIALIZATION ON DOM LOAD
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  setupEventListeners();
  updateCartUI();
  setupScrollHeader();
});

// 4. HEADER SCROLL & MOBILE MENU
function setupScrollHeader() {
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mainNav = document.getElementById('mainNav');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
    });
  }
}

// 5. RENDER PRODUCTS GRID WITH FILTERS
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  let filtered = PRODUCTS.filter(item => {
    // Category Filter
    if (activeCategory !== 'all' && item.category !== activeCategory) return false;
    
    // Search Query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      if (!matchName && !matchDesc) return false;
    }

    // Dietary / Tag Pill Filter
    if (activeDietaryFilter) {
      if (activeDietaryFilter === 'bestseller' && !item.tags.includes('bestseller')) return false;
      if (activeDietaryFilter === 'fresh' && !item.tags.includes('fresh')) return false;
      if (activeDietaryFilter === 'vegan' && !item.tags.includes('vegan')) return false;
      if (activeDietaryFilter === 'gf' && !item.tags.includes('gf')) return false;
    }

    return true;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; background: var(--bg-parchment); border-radius: 16px;">
        <span style="font-size: 3rem;">🥐</span>
        <h3 style="margin-top: 1rem; color: var(--color-espresso);">No Bakery Items Found</h3>
        <p style="color: var(--text-muted);">Try clearing your search or picking another category.</p>
        <button class="btn btn-outline btn-sm" style="margin-top: 1rem;" onclick="resetFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(item => `
    <div class="product-card">
      <div class="product-img-wrap">
        <img src="${item.image}" alt="${item.name}" class="product-img">
        ${renderTagBadge(item.tags)}
        <button class="quick-view-btn" onclick="openQuickView(${item.id})">Quick View 👁️</button>
      </div>
      <div class="product-info">
        <div class="product-header-row">
          <h3 class="product-title">${item.name}</h3>
          <span class="product-price">$${item.price.toFixed(2)}</span>
        </div>
        <p class="product-desc">${item.description}</p>
        <div class="product-footer-actions">
          <button class="btn btn-primary btn-sm btn-block" onclick="addSingleItemToCart(${item.id})">
            <span>🛒</span> Add to Cart
          </button>
          <button class="btn btn-outline btn-sm" onclick="openSimulatorWithItem(${item.id})">
            ✨ Simulate
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function renderTagBadge(tags) {
  if (tags.includes('bestseller')) {
    return `<span class="product-badge-tag tag-bestseller">🔥 Bestseller</span>`;
  }
  if (tags.includes('fresh')) {
    return `<span class="product-badge-tag tag-fresh">✨ Baked Today</span>`;
  }
  if (tags.includes('special')) {
    return `<span class="product-badge-tag tag-special">🎁 Special Box</span>`;
  }
  return '';
}

function resetFilters() {
  activeCategory = 'all';
  searchQuery = '';
  activeDietaryFilter = null;
  document.getElementById('menuSearchInput').value = '';
  document.getElementById('clearSearchBtn').style.display = 'none';

  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.tab-btn[data-category="all"]').classList.add('active');

  document.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
  renderProducts();
}

// 6. EVENT LISTENERS SETUP
function setupEventListeners() {
  // Category Tab Switching
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeCategory = tab.dataset.category;
      renderProducts();
    });
  });

  // Search Input
  const searchInput = document.getElementById('menuSearchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      clearSearchBtn.style.display = searchQuery ? 'block' : 'none';
      renderProducts();
    });
  }
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      clearSearchBtn.style.display = 'none';
      renderProducts();
    });
  }

  // Dietary Pills
  const pills = document.querySelectorAll('.pill-btn');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      if (pill.classList.contains('active')) {
        pill.classList.remove('active');
        activeDietaryFilter = null;
      } else {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeDietaryFilter = pill.dataset.diet;
      }
      renderProducts();
    });
  });

  // Cart Drawer Triggers
  const cartBtn = document.getElementById('cartBtn');
  if (cartBtn) cartBtn.addEventListener('click', openCart);

  // Simulator Start Button
  const startSimBtn = document.getElementById('startSimBtn');
  if (startSimBtn) startSimBtn.addEventListener('click', startOrderSimulation);

  // Reset Simulator Button
  const resetSimBtn = document.getElementById('resetSimBtn');
  if (resetSimBtn) resetSimBtn.addEventListener('click', resetSimulation);

  // View Receipt Button
  const viewReceiptBtn = document.getElementById('viewReceiptBtn');
  if (viewReceiptBtn) viewReceiptBtn.addEventListener('click', openReceiptModal);

  // Wax Color Picker Labels
  const waxOpts = document.querySelectorAll('.wax-opt');
  waxOpts.forEach(opt => {
    opt.addEventListener('click', () => {
      waxOpts.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
    });
  });

  // Simulator Box Option Radios
  const boxOpts = document.querySelectorAll('.box-opt-card');
  boxOpts.forEach(opt => {
    opt.addEventListener('click', () => {
      boxOpts.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
    });
  });
}

// 7. CART FUNCTIONALITY
function addSingleItemToCart(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;

  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCartUI();
  openCart();
}

function updateCartQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  }
  updateCartUI();
}

function updateCartUI() {
  const badge = document.getElementById('cartBadgeCount');
  const headerTotal = document.getElementById('cartHeaderTotal');
  const countText = document.getElementById('cartItemCount');
  const container = document.getElementById('cartItemsContainer');

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  if (badge) badge.innerText = totalItems;
  if (countText) countText.innerText = totalItems;
  if (headerTotal) headerTotal.innerText = `$${subtotal.toFixed(2)}`;

  // Update Free Shipping Progress ($35 target)
  const freeShipText = document.getElementById('freeShippingText');
  const freeShipFill = document.getElementById('freeShippingFill');
  const target = 35.00;
  if (freeShipText && freeShipFill) {
    if (subtotal >= target) {
      freeShipText.innerHTML = `🎉 You've unlocked <strong>FREE Express Delivery!</strong>`;
      freeShipFill.style.width = '100%';
    } else {
      const remaining = target - subtotal;
      freeShipText.innerHTML = `Add $${remaining.toFixed(2)} more for <strong>FREE Express Delivery</strong>!`;
      freeShipFill.style.width = `${Math.min(100, (subtotal / target) * 100)}%`;
    }
  }

  // Render Cart Items
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem; margin: auto 0;">
        <span style="font-size: 3rem;">🛍️</span>
        <h4 style="margin-top: 1rem; color: var(--color-espresso);">Your Mellow Cart is Empty</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.5rem;">Add fresh croissants, sourdough loaves, or specialty coffee to start!</p>
        <button class="btn btn-primary btn-sm" onclick="closeCart()">Browse Menu</button>
      </div>
    `;
  } else {
    container.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${item.price.toFixed(2)} each</div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="updateCartQty(${item.id}, -1)">-</button>
            <span style="font-weight: 700; font-size: 0.9rem;">${item.qty}</span>
            <button class="qty-btn" onclick="updateCartQty(${item.id}, 1)">+</button>
          </div>
        </div>
        <div style="font-weight: 800; color: var(--color-espresso); font-size: 0.95rem;">
          $${(item.price * item.qty).toFixed(2)}
        </div>
      </div>
    `).join('');
  }

  // Update Totals
  calculateCartTotals(subtotal);

  // Update Custom price in simulator box option
  const simCustomPrice = document.getElementById('simCustomPrice');
  if (simCustomPrice) simCustomPrice.innerText = `$${subtotal.toFixed(2)}`;
}

function calculateCartTotals(subtotal) {
  let discount = 0;
  if (appliedPromo) {
    discount = subtotal * appliedPromo.discount;
  }

  const delivery = subtotal >= 35.00 || subtotal === 0 ? 0.00 : 4.50;
  const grandTotal = Math.max(0, subtotal - discount + delivery);

  document.getElementById('cartSubtotal').innerText = `$${subtotal.toFixed(2)}`;
  document.getElementById('cartDeliveryFee').innerText = delivery === 0 ? 'FREE' : `$${delivery.toFixed(2)}`;
  document.getElementById('cartGrandTotal').innerText = `$${grandTotal.toFixed(2)}`;

  const promoBadge = document.getElementById('promoBadge');
  if (appliedPromo) {
    promoBadge.classList.remove('hidden');
    document.getElementById('promoDiscountAmount').innerText = `-$${discount.toFixed(2)}`;
  } else {
    promoBadge.classList.add('hidden');
  }
}

function applyPromoCode() {
  const code = document.getElementById('promoCodeInput').value.trim().toUpperCase();
  if (code === 'MELLOW10') {
    appliedPromo = { code: 'MELLOW10', discount: 0.10 };
    alert('🎉 Success! Code MELLOW10 applied for 10% discount.');
  } else if (code === '') {
    alert('Please enter a valid promo code.');
  } else {
    alert('Invalid code. Try MELLOW10 for 10% off!');
  }
  updateCartUI();
}

function openCart() {
  document.getElementById('cartOverlay').classList.add('open');
  document.getElementById('cartDrawer').classList.add('open');
}

function closeCart() {
  document.getElementById('cartOverlay').classList.remove('open');
  document.getElementById('cartDrawer').classList.remove('open');
}

function checkoutToSimulator() {
  closeCart();
  const simSection = document.getElementById('simulator');
  if (simSection) {
    simSection.scrollIntoView({ behavior: 'smooth' });
    // Auto check the custom cart radio
    const customRadio = document.querySelector('input[name="simBoxType"][value="custom"]');
    if (customRadio) {
      customRadio.checked = true;
      document.querySelectorAll('.box-opt-card').forEach(b => b.classList.remove('active'));
      customRadio.closest('.box-opt-card').classList.add('active');
    }
  }
}

// 8. QUICK VIEW MODAL
function openQuickView(id) {
  const item = PRODUCTS.find(p => p.id === id);
  if (!item) return;

  const content = document.getElementById('quickViewContent');
  content.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: center;">
      <div style="border-radius: 16px; overflow: hidden; height: 280px; background: var(--bg-parchment);">
        <img src="${item.image}" alt="${item.name}" style="width:100%; height:100%; object-fit:cover;">
      </div>
      <div>
        <span style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; color: var(--color-terracotta); font-weight: 700;">${item.category}</span>
        <h2 style="font-size: 1.8rem; margin: 0.2rem 0 0.5rem 0;">${item.name}</h2>
        <div style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 700; color: var(--color-terracotta); margin-bottom: 1rem;">$${item.price.toFixed(2)}</div>
        <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.25rem;">${item.description}</p>
        <div style="font-size: 0.85rem; color: var(--color-espresso); margin-bottom: 1.5rem;">
          <div>🌿 <strong>Dietary:</strong> ${item.dietary}</div>
          <div>⏱️ <strong>Baking Note:</strong> ${item.prepTime}</div>
        </div>
        <button class="btn btn-primary btn-block" onclick="addSingleItemToCart(${item.id}); closeQuickViewDirect();">
          🛒 Add to Bag
        </button>
      </div>
    </div>
  `;

  document.getElementById('quickViewModal').classList.remove('hidden');
}

function closeQuickView(e) {
  if (e.target.id === 'quickViewModal') {
    closeQuickViewDirect();
  }
}

function closeQuickViewDirect() {
  document.getElementById('quickViewModal').classList.add('hidden');
}

function openSimulatorWithItem(id) {
  addSingleItemToCart(id);
  checkoutToSimulator();
}

// 9. INTERACTIVE ORDER SIMULATOR LOGIC
function startOrderSimulation() {
  // Collect inputs
  const boxType = document.querySelector('input[name="simBoxType"]:checked').value;
  const waxColor = document.querySelector('input[name="simWaxColor"]:checked').value;
  const giftMsg = document.getElementById('simMessage').value || "Enjoy fresh oven-baked warmth from Mellow!";
  const fulfillment = document.querySelector('input[name="simFulfillment"]:checked').value;

  // Compute pricing & items list
  let items = [];
  let totalCost = 0;

  if (boxType === 'morning') {
    items = ["2x Golden Almond Croissants", "1x Ethiopia Yirgacheffe Beans (500g)", "1x Classic Sourdough Loaf"];
    totalCost = 38.00;
  } else if (boxType === 'tasting') {
    items = ["2x Pain au Chocolat", "2x Almond Croissants", "1x Wild Berry Crème Tart", "1x Chocolate Choux"];
    totalCost = 46.00;
  } else {
    // Custom Cart
    if (cart.length === 0) {
      alert('Your Cart is currently empty! Please add items or pick a preset bundle box.');
      return;
    }
    items = cart.map(i => `${i.qty}x ${i.name}`);
    totalCost = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
  }

  currentSimOrderData = {
    orderId: `#MLW-${Math.floor(10000 + Math.random() * 90000)}`,
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    boxType,
    waxColor,
    giftMsg,
    fulfillment: fulfillment === 'pickup' ? 'Counter Pickup (30 mins)' : 'Kraft Courier Delivery',
    items,
    totalCost
  };

  // Switch display from idle to active
  document.getElementById('simIdleView').classList.add('hidden');
  document.getElementById('simActiveView').classList.remove('hidden');
  document.getElementById('simCompleteActions').classList.add('hidden');

  // Reset Progress
  simProgress = 0;
  currentSimStage = 1;
  updateStageUI(1);

  // Disable Start Button
  const startBtn = document.getElementById('startSimBtn');
  startBtn.disabled = true;
  startBtn.innerHTML = `<span>⏳</span> Baking & Simulating...`;

  const pill = document.getElementById('simStatusPill');
  pill.innerText = "In Progress";
  pill.className = "sim-status-pill baking";

  // Run Interval Simulator
  if (simInterval) clearInterval(simInterval);
  
  const totalDurationSeconds = 12; // 12 seconds total simulation
  let elapsed = 0;

  simInterval = setInterval(() => {
    elapsed += 0.5;
    simProgress = (elapsed / totalDurationSeconds) * 100;
    
    document.getElementById('simTimerFill').style.width = `${simProgress}%`;
    const remainingSecs = Math.max(0, Math.ceil(totalDurationSeconds - elapsed));
    document.getElementById('simTimerText').innerText = `00:${remainingSecs < 10 ? '0' + remainingSecs : remainingSecs} remaining`;

    // Stage Transitions:
    // 0s - 3s: Stage 1 (Kneading)
    // 3.5s - 7s: Stage 2 (Oven Bake)
    // 7.5s - 10s: Stage 3 (Wax Stamp)
    // 10.5s - 12s: Stage 4 (Ready)

    if (elapsed >= 10.5 && currentSimStage !== 4) {
      currentSimStage = 4;
      updateStageUI(4);
    } else if (elapsed >= 7.5 && elapsed < 10.5 && currentSimStage !== 3) {
      currentSimStage = 3;
      updateStageUI(3);
    } else if (elapsed >= 3.5 && elapsed < 7.5 && currentSimStage !== 2) {
      currentSimStage = 2;
      updateStageUI(2);
    }

    if (elapsed >= totalDurationSeconds) {
      clearInterval(simInterval);
      completeSimulation();
    }
  }, 500);
}

function updateStageUI(stage) {
  // Update Timeline dots
  for (let i = 1; i <= 4; i++) {
    const dot = document.getElementById(`tStep${i}`);
    if (i < stage) {
      dot.className = "timeline-step completed";
    } else if (i === stage) {
      dot.className = "timeline-step active";
    } else {
      dot.className = "timeline-step";
    }
  }

  // Update Timeline connecting lines
  document.getElementById('tLine1').style.width = stage >= 2 ? '100%' : '0%';
  document.getElementById('tLine2').style.width = stage >= 3 ? '100%' : '0%';
  document.getElementById('tLine3').style.width = stage >= 4 ? '100%' : '0%';

  // Update Visual Windows
  document.getElementById('visualStage1').classList.add('hidden');
  document.getElementById('visualStage2').classList.add('hidden');
  document.getElementById('visualStage3').classList.add('hidden');
  document.getElementById('visualStage4').classList.add('hidden');

  const badgeText = document.getElementById('stageBadgeText');
  const descText = document.getElementById('stageStatusDesc');
  const phaseLabel = document.getElementById('simPhaseLabel');

  phaseLabel.innerText = `Phase ${stage} of 4`;

  if (stage === 1) {
    document.getElementById('visualStage1').classList.remove('hidden');
    badgeText.innerText = "Stage 1: Kneading & Dough Shaping";
    descText.innerText = "Master baker preparing organic sourdough starter and folding butter layers...";
  } else if (stage === 2) {
    document.getElementById('visualStage2').classList.remove('hidden');
    badgeText.innerText = "Stage 2: Stone Oven Baking (375°F)";
    descText.innerText = "Pastries rising in Italian deck oven, creating deep golden flaky crusts...";
    // animate browning
    let bakePercent = 45;
    const bakeInterval = setInterval(() => {
      bakePercent += 10;
      if (bakePercent > 95) clearInterval(bakeInterval);
      const el = document.getElementById('bakePercentText');
      if (el) el.innerText = `${bakePercent}%`;
    }, 400);
  } else if (stage === 3) {
    document.getElementById('visualStage3').classList.remove('hidden');
    badgeText.innerText = "Stage 3: Hand Wrapping & Wax Sealing";
    
    // Set wax color swatch
    const waxColorMap = {
      terracotta: "Hearth Terracotta",
      gold: "Mellow Honey Gold",
      espresso: "Dark Espresso",
      teal: "Highland Teal"
    };
    const waxColorDisplay = waxColorMap[currentSimOrderData.waxColor] || "Hearth Terracotta";
    document.getElementById('waxColorNameDisplay').innerText = waxColorDisplay;
    descText.innerText = `Wrapping in unbleached kraft paper and pressing hot ${waxColorDisplay} Wax Seal...`;
  } else if (stage === 4) {
    document.getElementById('visualStage4').classList.remove('hidden');
    badgeText.innerText = "Stage 4: Order Ready & Sealed!";
    descText.innerText = `Package ready with custom Mellow Wax stamp! Ticket ${currentSimOrderData.orderId} generated.`;
  }
}

function completeSimulation() {
  const pill = document.getElementById('simStatusPill');
  pill.innerText = "Bake Complete!";
  pill.className = "sim-status-pill ready";

  const startBtn = document.getElementById('startSimBtn');
  startBtn.disabled = false;
  startBtn.innerHTML = `<span>🔥</span> Start Live Order Baking Simulation`;

  document.getElementById('simCompleteActions').classList.remove('hidden');
}

function resetSimulation() {
  if (simInterval) clearInterval(simInterval);
  document.getElementById('simIdleView').classList.remove('hidden');
  document.getElementById('simActiveView').classList.add('hidden');
  
  const pill = document.getElementById('simStatusPill');
  pill.innerText = "Ready to Bake";
  pill.className = "sim-status-pill";
}

// 10. RECEIPT MODAL GENERATION
function openReceiptModal() {
  if (!currentSimOrderData) return;

  document.getElementById('receiptId').innerText = currentSimOrderData.orderId;
  document.getElementById('receiptDate').innerText = currentSimOrderData.date;
  document.getElementById('receiptFulfillment').innerText = currentSimOrderData.fulfillment;
  
  const waxColorMap = {
    terracotta: "Hearth Terracotta",
    gold: "Mellow Honey Gold",
    espresso: "Dark Espresso",
    teal: "Highland Teal"
  };
  document.getElementById('receiptWaxSeal').innerText = waxColorMap[currentSimOrderData.waxColor] || "Hearth Terracotta";
  document.getElementById('receiptMsgText').innerText = `"${currentSimOrderData.giftMsg}"`;

  const itemsList = document.getElementById('receiptItemsList');
  itemsList.innerHTML = currentSimOrderData.items.map(itemStr => `
    <div class="rc-row">
      <span>${itemStr}</span>
      <span>INCLUDED</span>
    </div>
  `).join('');

  const subtotal = currentSimOrderData.totalCost;
  let discount = 0;
  if (appliedPromo) {
    discount = subtotal * appliedPromo.discount;
  }
  const grandTotal = Math.max(0, subtotal - discount);

  document.getElementById('receiptSubtotal').innerText = `$${subtotal.toFixed(2)}`;
  document.getElementById('receiptDiscount').innerText = `-$${discount.toFixed(2)}`;
  document.getElementById('receiptTotal').innerText = `$${grandTotal.toFixed(2)}`;

  document.getElementById('receiptModal').classList.remove('hidden');
}

function closeReceiptModal(e) {
  if (e.target.id === 'receiptModal') {
    closeReceiptModalDirect();
  }
}

function closeReceiptModalDirect() {
  document.getElementById('receiptModal').classList.add('hidden');
}

// 11. FORM SUBMISSION HANDLERS
function handleContactSubmit(e) {
  e.preventDefault();
  alert('Thank you for contacting Mellow Bakehouse! Our master baker will reply within 24 hours regarding your catering event.');
  e.target.reset();
}

function handleNewsletterSubmit(e) {
  e.preventDefault();
  alert('🎉 Welcome to the Mellow Family! Use promo code MELLOW10 at checkout for 10% off your order.');
  e.target.reset();
}
