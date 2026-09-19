/* ==========================================================================
   MELLOW BAKERY & SPECIALTY COFFEE - MINIMALIST APP LOGIC
   ========================================================================== */

const PRODUCTS = [
  {
    id: 1,
    name: "Golden Almond Croissant",
    category: "pastries",
    price: 4.80,
    image: "assets/images/croissant.jpg",
    description: "Flaky butter croissant filled with almond frangipane cream and topped with sliced almonds.",
    tags: ["bestseller"]
  },
  {
    id: 2,
    name: "Classic Sourdough Loaf",
    category: "breads",
    price: 8.50,
    image: "assets/images/hero.jpg",
    description: "36-hour long fermentation sourdough bread made with organic unbleached flour and sea salt.",
    tags: ["bestseller", "vegan"]
  },
  {
    id: 3,
    name: "Ethiopia Yirgacheffe Beans",
    category: "coffee",
    price: 24.00,
    image: "assets/images/coffee_beans.jpg",
    description: "Direct trade single-origin coffee with notes of yellow plum, jasmine blossom, and cocoa.",
    tags: ["bestseller"]
  },
  {
    id: 4,
    name: "Wild Berry Crème Tart",
    category: "cakes",
    price: 7.20,
    image: "assets/images/berry_tart.jpg",
    description: "Crisp sable crust with vanilla bean pastry cream, raspberries, blueberries, and pistachios.",
    tags: ["fresh"]
  },
  {
    id: 5,
    name: "Signature Mellow Wax Box",
    category: "giftbox",
    price: 45.00,
    image: "assets/images/wax_package.jpg",
    description: "Signature kraft gift box tied with twine and sealed with the bronze Mellow wax stamp.",
    tags: ["special"]
  },
  {
    id: 6,
    name: "Pain au Chocolat",
    category: "pastries",
    price: 4.50,
    image: "assets/images/croissant.jpg",
    description: "Classic French butter pastry with two batons of Valrhona 64% dark chocolate.",
    tags: ["fresh"]
  }
];

let cart = [];
let appliedPromo = null;
let activeCategory = 'all';
let activeDietaryFilter = null;
let searchQuery = '';

let simInterval = null;
let currentSimOrderData = null;

document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  setupEventListeners();
  updateCartUI();
});

function renderProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  let filtered = PRODUCTS.filter(item => {
    if (activeCategory !== 'all' && item.category !== activeCategory) return false;
    
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      if (!item.name.toLowerCase().includes(q) && !item.description.toLowerCase().includes(q)) return false;
    }

    if (activeDietaryFilter) {
      if (activeDietaryFilter === 'bestseller' && !item.tags.includes('bestseller')) return false;
      if (activeDietaryFilter === 'fresh' && !item.tags.includes('fresh')) return false;
      if (activeDietaryFilter === 'vegan' && !item.tags.includes('vegan')) return false;
    }

    return true;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem; background: #FFF; border-radius: 12px; border: 1px solid var(--border-color);">
        <p style="color: var(--text-muted);">No bakery items match your search.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(item => `
    <div class="p-card">
      <div class="p-img-box">
        <img src="${item.image}" alt="${item.name}" class="p-img">
        ${item.tags.includes('bestseller') ? '<span class="p-tag tag-hot">🔥 Bestseller</span>' : ''}
      </div>
      <div class="p-body">
        <div class="p-title-row">
          <h3 class="p-title">${item.name}</h3>
          <span class="p-price">$${item.price.toFixed(2)}</span>
        </div>
        <p class="p-desc">${item.description}</p>
        <div class="p-actions">
          <button class="btn btn-primary btn-sm btn-block" onclick="addSingleItemToCart(${item.id})">
            🛒 Add to Cart
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function setupEventListeners() {
  // Category tabs
  const tabs = document.querySelectorAll('.m-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeCategory = tab.dataset.category;
      renderProducts();
    });
  });

  // Search input
  const searchInput = document.getElementById('menuSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderProducts();
    });
  }

  // Dietary pills
  const pills = document.querySelectorAll('.d-pill');
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

  // Wax pills
  const waxPills = document.querySelectorAll('.wax-pill');
  waxPills.forEach(pill => {
    pill.addEventListener('click', () => {
      waxPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const input = pill.querySelector('input');
      if (input) input.checked = true;
    });
  });

  // Box preset items
  const boxItems = document.querySelectorAll('.s-opt-item');
  boxItems.forEach(item => {
    item.addEventListener('click', () => {
      boxItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      const input = item.querySelector('input');
      if (input) input.checked = true;
    });
  });

  // Simulator Start button
  const startSimBtn = document.getElementById('startSimBtn');
  if (startSimBtn) startSimBtn.addEventListener('click', startOrderSimulation);

  const resetSimBtn = document.getElementById('resetSimBtn');
  if (resetSimBtn) resetSimBtn.addEventListener('click', resetSimulation);

  const viewReceiptBtn = document.getElementById('viewReceiptBtn');
  if (viewReceiptBtn) viewReceiptBtn.addEventListener('click', openReceiptModal);
}

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
  const countText = document.getElementById('cartItemCount');
  const container = document.getElementById('cartItemsContainer');

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  if (badge) badge.innerText = totalItems;
  if (countText) countText.innerText = totalItems;

  const freeShipText = document.getElementById('freeShippingText');
  if (freeShipText) {
    if (subtotal >= 35.00) {
      freeShipText.innerHTML = `🎉 You've unlocked <strong>FREE Express Delivery!</strong>`;
    } else {
      const rem = 35.00 - subtotal;
      freeShipText.innerHTML = `Add $${rem.toFixed(2)} more for <strong>FREE Express Delivery</strong>!`;
    }
  }

  if (container) {
    if (cart.length === 0) {
      container.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 2rem 0;">Your cart is empty.</p>`;
    } else {
      container.innerHTML = cart.map(item => `
        <div style="display: flex; gap: 0.85rem; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 0.75rem;">
          <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; border-radius: 6px; object-fit: cover;">
          <div style="flex: 1;">
            <strong style="font-size: 0.9rem; color: var(--color-espresso);">${item.name}</strong>
            <div style="font-size: 0.8rem; color: var(--color-terracotta);">$${item.price.toFixed(2)} each</div>
            <div style="display: flex; align-items: center; gap: 0.4rem; margin-top: 0.25rem;">
              <button onclick="updateCartQty(${item.id}, -1)" style="padding: 0 0.4rem; border: 1px solid var(--border-color); border-radius: 4px;">-</button>
              <span style="font-size: 0.85rem; font-weight: 700;">${item.qty}</span>
              <button onclick="updateCartQty(${item.id}, 1)" style="padding: 0 0.4rem; border: 1px solid var(--border-color); border-radius: 4px;">+</button>
            </div>
          </div>
          <strong style="font-size: 0.95rem;">$${(item.price * item.qty).toFixed(2)}</strong>
        </div>
      `).join('');
    }
  }

  const grandTotal = subtotal >= 35.00 ? subtotal : (subtotal === 0 ? 0 : subtotal + 4.50);
  document.getElementById('cartGrandTotal').innerText = `$${grandTotal.toFixed(2)}`;

  const simCustomPrice = document.getElementById('simCustomPrice');
  if (simCustomPrice) simCustomPrice.innerText = `$${subtotal.toFixed(2)}`;
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
  const sim = document.getElementById('simulator');
  if (sim) sim.scrollIntoView({ behavior: 'smooth' });
}

/* Simulator Logic */
function startOrderSimulation() {
  const boxType = document.querySelector('input[name="simBoxType"]:checked').value;
  const waxColor = document.querySelector('input[name="simWaxColor"]:checked').value;
  const giftMsg = document.getElementById('simMessage').value || "Enjoy fresh oven-baked warmth from Mellow!";

  let items = [];
  let totalCost = 0;

  if (boxType === 'morning') {
    items = ["2x Golden Almond Croissants", "1x Ethiopia Yirgacheffe Beans (500g)", "1x Classic Sourdough Loaf"];
    totalCost = 38.00;
  } else if (boxType === 'tasting') {
    items = ["2x Pain au Chocolat", "1x Wild Berry Crème Tart", "1x Signature Choux"];
    totalCost = 46.00;
  } else {
    if (cart.length === 0) {
      alert('Your Cart is empty! Please add items or pick a box preset.');
      return;
    }
    items = cart.map(i => `${i.qty}x ${i.name}`);
    totalCost = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
  }

  currentSimOrderData = {
    orderId: `#MLW-${Math.floor(10000 + Math.random() * 90000)}`,
    date: new Date().toLocaleDateString(),
    boxType,
    waxColor,
    giftMsg,
    items,
    totalCost
  };

  document.getElementById('simIdleView').classList.add('hidden');
  document.getElementById('simActiveView').classList.remove('hidden');
  document.getElementById('simCompleteActions').classList.add('hidden');

  const startBtn = document.getElementById('startSimBtn');
  startBtn.disabled = true;
  startBtn.innerText = "⏳ Baking...";

  document.getElementById('simStatusPill').innerText = "In Progress";

  let elapsed = 0;
  const totalDuration = 12;

  if (simInterval) clearInterval(simInterval);

  simInterval = setInterval(() => {
    elapsed += 0.5;
    const progress = (elapsed / totalDuration) * 100;

    document.getElementById('simTimerFill').style.width = `${progress}%`;
    const remaining = Math.max(0, Math.ceil(totalDuration - elapsed));
    document.getElementById('simTimerText').innerText = `00:${remaining < 10 ? '0' + remaining : remaining} remaining`;

    if (elapsed >= 10) {
      updateStageUI(4);
    } else if (elapsed >= 7) {
      updateStageUI(3);
    } else if (elapsed >= 3.5) {
      updateStageUI(2);
    } else {
      updateStageUI(1);
    }

    if (elapsed >= totalDuration) {
      clearInterval(simInterval);
      document.getElementById('simStatusPill').innerText = "Bake Complete!";
      startBtn.disabled = false;
      startBtn.innerText = "🔥 Start Live Baking Simulation";
      document.getElementById('simCompleteActions').classList.remove('hidden');
    }
  }, 500);
}

function updateStageUI(stage) {
  const badge = document.getElementById('stageBadgeText');
  const emoji = document.getElementById('stageEmoji');
  const desc = document.getElementById('stageStatusDesc');
  const temp = document.getElementById('stageTemp');
  const phaseLbl = document.getElementById('simPhaseLabel');

  phaseLbl.innerText = `Phase ${stage} of 4`;

  if (stage === 1) {
    badge.innerText = "Stage 1: Kneading & Shaping";
    emoji.innerText = "🥣";
    desc.innerText = "Master baker preparing organic sourdough starter...";
    temp.innerText = "74°F";
  } else if (stage === 2) {
    badge.innerText = "Stage 2: Stone Oven Baking";
    emoji.innerText = "🔥";
    desc.innerText = "Pastries rising in stone deck oven...";
    temp.innerText = "375°F";
  } else if (stage === 3) {
    badge.innerText = "Stage 3: Wax Seal Stamping";
    emoji.innerText = "🕯️";
    desc.innerText = `Wrapping kraft paper & stamping ${currentSimOrderData.waxColor} wax seal...`;
    temp.innerText = "Cooling";
  } else if (stage === 4) {
    badge.innerText = "Stage 4: Sealed & Ready!";
    emoji.innerText = "✨";
    desc.innerText = `Package ready with Mellow Wax stamp! Ticket ${currentSimOrderData.orderId} created.`;
    temp.innerText = "Ready";
  }
}

function resetSimulation() {
  if (simInterval) clearInterval(simInterval);
  document.getElementById('simIdleView').classList.remove('hidden');
  document.getElementById('simActiveView').classList.add('hidden');
  document.getElementById('simStatusPill').innerText = "Ready";
}

function openReceiptModal() {
  if (!currentSimOrderData) return;

  document.getElementById('receiptId').innerText = currentSimOrderData.orderId;
  document.getElementById('receiptItemsList').innerHTML = currentSimOrderData.items.map(i => `<div>${i}</div>`).join('');
  document.getElementById('receiptTotal').innerText = `TOTAL: $${currentSimOrderData.totalCost.toFixed(2)}`;
  document.getElementById('receiptModal').classList.remove('hidden');
}

function closeReceiptModalDirect() {
  document.getElementById('receiptModal').classList.add('hidden');
}

function closeReceiptModal(e) {
  if (e.target.id === 'receiptModal') closeReceiptModalDirect();
}
