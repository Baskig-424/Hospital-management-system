const STORE_KEYS = {
  seeded: 'nv_store_seeded',
  adminPass: 'nv_admin_password',
  products: 'nv_products',
  orders: 'nv_orders',
  cart: 'nv_cart',
  authed: 'nv_admin_authed',
};

const DEFAULT_PRODUCTS = [
  { id: 'med-1', name: 'Paracetamol 650', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop', price: 45 },
  { id: 'med-2', name: 'Azithromycin 500', image: 'https://images.unsplash.com/photo-1580281657527-47f249e8f0f5?q=80&w=800&auto=format&fit=crop', price: 160 },
  { id: 'med-3', name: 'Vitamin C 1000', image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=800&auto=format&fit=crop', price: 120 },
  { id: 'med-4', name: 'Cough Syrup', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=800&auto=format&fit=crop', price: 95 },
  { id: 'med-5', name: 'Blood Pressure Kit', image: 'https://images.unsplash.com/photo-1513224502586-d1e602410265?q=80&w=800&auto=format&fit=crop', price: 620 },
  { id: 'med-6', name: 'Diabetes Test Strips', image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=800&auto=format&fit=crop', price: 210 },
  { id: 'med-7', name: 'Antacid Gel', image: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?q=80&w=800&auto=format&fit=crop', price: 70 },
  { id: 'med-8', name: 'Allergy Relief', image: 'https://images.unsplash.com/photo-1582719478148-9757cfcf9f78?q=80&w=800&auto=format&fit=crop', price: 110 },
  { id: 'med-9', name: 'Thermometer', image: 'https://images.unsplash.com/photo-1584118624012-df056829fbd0?q=80&w=800&auto=format&fit=crop', price: 180 },
  { id: 'med-10', name: 'ORS Sachets', image: 'https://images.unsplash.com/photo-1582719201952-ea63ac1671dc?q=80&w=800&auto=format&fit=crop', price: 35 },
  { id: 'med-11', name: 'Pain Relief Spray', image: 'https://images.unsplash.com/photo-1580281780460-82d277b0e3f4?q=80&w=800&auto=format&fit=crop', price: 160 },
  { id: 'med-12', name: 'Hand Sanitizer', image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?q=80&w=800&auto=format&fit=crop', price: 80 },
  { id: 'med-13', name: 'Calcium Tablets', image: 'https://images.unsplash.com/photo-1584308666744-8d0afc8d5a2d?q=80&w=800&auto=format&fit=crop', price: 140 },
  { id: 'med-14', name: 'Multivitamin', image: 'https://images.unsplash.com/photo-1612349317150-4f17fcd5c6e1?q=80&w=800&auto=format&fit=crop', price: 175 },
  { id: 'med-15', name: 'Eye Drops', image: 'https://images.unsplash.com/photo-1595246007497-6897223d9ee6?q=80&w=800&auto=format&fit=crop', price: 90 },
];

function parseXmlText(text) {
  const parser = new DOMParser();
  return parser.parseFromString(text, 'text/xml');
}

function getText(node, selector) {
  const el = node.querySelector(selector);
  return el ? el.textContent.trim() : '';
}

function seedStoreFromXml() {
  if (localStorage.getItem(STORE_KEYS.seeded)) return Promise.resolve();

  return fetch('../data/localstorage.xml')
    .then((res) => res.text())
    .then((xmlText) => {
      const xml = parseXmlText(xmlText);
      const password = getText(xml, 'admin > password') || 'admin123';
      const products = Array.from(xml.querySelectorAll('products > product')).map((p) => ({
        id: p.getAttribute('id'),
        name: getText(p, 'name'),
        image: getText(p, 'image'),
        price: Number(getText(p, 'price')) || 0,
      }));
      const orders = Array.from(xml.querySelectorAll('orders > order')).map((o) => ({
        id: o.getAttribute('id'),
        customerName: getText(o, 'customerName'),
        patientName: getText(o, 'patientName'),
        mobile: getText(o, 'mobile'),
        age: getText(o, 'age'),
        date: getText(o, 'date'),
        items: Array.from(o.querySelectorAll('items > item')).map((i) => ({
          id: i.getAttribute('id'),
          qty: Number(i.getAttribute('qty')) || 1,
        })),
      }));

      localStorage.setItem(STORE_KEYS.adminPass, password);
      localStorage.setItem(
        STORE_KEYS.products,
        JSON.stringify(products.length ? products : DEFAULT_PRODUCTS),
      );
      localStorage.setItem(STORE_KEYS.orders, JSON.stringify(orders));
      localStorage.setItem(STORE_KEYS.seeded, 'true');
    })
    .catch(() => {
      localStorage.setItem(STORE_KEYS.adminPass, 'admin123');
      localStorage.setItem(STORE_KEYS.products, JSON.stringify(DEFAULT_PRODUCTS));
      localStorage.setItem(STORE_KEYS.orders, JSON.stringify([]));
      localStorage.setItem(STORE_KEYS.seeded, 'true');
    });
}

function getProducts() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEYS.products)) || [];
  } catch {
    return [];
  }
}

function getOrders() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEYS.orders)) || [];
  } catch {
    return [];
  }
}

function saveOrders(orders) {
  localStorage.setItem(STORE_KEYS.orders, JSON.stringify(orders));
}

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEYS.cart)) || {};
  } catch {
    return {};
  }
}

function saveCart(cart) {
  localStorage.setItem(STORE_KEYS.cart, JSON.stringify(cart));
}

function formatCurrency(amount) {
  return `₹${amount.toFixed(0)}`;
}

function buildOrderId() {
  const stamp = Date.now().toString().slice(-6);
  return `ORD-${stamp}`;
}

function renderMedicineStore() {
  const grid = document.getElementById('medicineGrid');
  const cartBox = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  const orderForm = document.getElementById('orderForm');
  const successBox = document.getElementById('orderSuccess');
  if (!grid || !cartBox || !totalEl || !orderForm) return;

  const products = getProducts();
  let cart = getCart();

  function productById(id) {
    return products.find((p) => p.id === id);
  }

  function renderProducts() {
    grid.innerHTML = '';
    products.forEach((p) => {
      const qty = cart[p.id] || 0;
      const card = document.createElement('div');
      card.className = 'med-card';
      card.innerHTML = `
        <div class="med-img" style="background-image:url('${p.image}')"></div>
        <div class="med-body">
          <h4>${p.name}</h4>
          <div class="med-meta">
            <span class="price">${formatCurrency(p.price)}</span>
            <div class="qty-controls" data-id="${p.id}">
              <button type="button" class="qty-btn" data-action="remove">-</button>
              <span class="qty">${qty}</span>
              <button type="button" class="qty-btn" data-action="add">+</button>
            </div>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  function renderCart() {
    cartBox.innerHTML = '';
    let total = 0;
    Object.keys(cart).forEach((id) => {
      const qty = cart[id];
      const product = productById(id);
      if (!product || qty <= 0) return;
      const line = document.createElement('div');
      line.className = 'cart-line';
      const lineTotal = product.price * qty;
      total += lineTotal;
      line.innerHTML = `
        <div>
          <strong>${product.name}</strong>
          <div class="muted">Qty: ${qty}</div>
        </div>
        <span>${formatCurrency(lineTotal)}</span>
      `;
      cartBox.appendChild(line);
    });
    if (!cartBox.children.length) {
      cartBox.innerHTML = '<div class="muted">Cart is empty. Add medicines.</div>';
    }
    totalEl.textContent = formatCurrency(total);
  }

  function updateQty(id, delta) {
    const next = (cart[id] || 0) + delta;
    if (next <= 0) {
      delete cart[id];
    } else {
      cart[id] = next;
    }
    saveCart(cart);
    renderProducts();
    renderCart();
  }

  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('.qty-btn');
    if (!btn) return;
    const wrap = btn.closest('.qty-controls');
    const id = wrap ? wrap.getAttribute('data-id') : '';
    if (!id) return;
    updateQty(id, btn.dataset.action === 'add' ? 1 : -1);
  });

  orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const cartIds = Object.keys(cart);
    if (!cartIds.length) {
      alert('Please add at least one medicine.');
      return;
    }
    const customerName = document.getElementById('customerName').value.trim();
    const patientName = document.getElementById('patientName').value.trim();
    const mobile = document.getElementById('patientMobile').value.trim();
    const age = document.getElementById('patientAge').value.trim();
    const date = new Date().toISOString().slice(0, 10);

    const items = cartIds.map((id) => ({ id, qty: cart[id] }));
    const order = {
      id: buildOrderId(),
      customerName,
      patientName,
      mobile,
      age,
      date,
      items,
    };
    const orders = getOrders();
    orders.unshift(order);
    saveOrders(orders);

    cart = {};
    saveCart(cart);
    orderForm.reset();
    renderProducts();
    renderCart();

    if (successBox) {
      successBox.classList.add('show');
      setTimeout(() => successBox.classList.remove('show'), 2500);
    }
  });

  renderProducts();
  renderCart();
}

function renderAdminLogin() {
  const form = document.getElementById('adminLoginForm');
  if (!form) return;
  const error = document.getElementById('adminError');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('adminPassword').value.trim();
    const stored = localStorage.getItem(STORE_KEYS.adminPass) || 'admin123';
    if (password === stored) {
      localStorage.setItem(STORE_KEYS.authed, 'true');
      window.location.href = 'admin-dashboard.html';
    } else {
      if (error) error.textContent = 'Wrong password. Try again.';
    }
  });
}

function renderAdminDashboard() {
  const tableBody = document.getElementById('ordersBody');
  if (!tableBody) return;
  if (localStorage.getItem(STORE_KEYS.authed) !== 'true') {
    window.location.href = 'admin-login.html';
    return;
  }

  const products = getProducts();

  function productName(id) {
    const item = products.find((p) => p.id === id);
    return item ? item.name : id;
  }

  function calcTotal(order) {
    return order.items.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.id);
      return sum + (product ? product.price * item.qty : 0);
    }, 0);
  }

  function render() {
    const orders = getOrders();
    tableBody.innerHTML = '';
    if (!orders.length) {
      tableBody.innerHTML = '<tr><td colspan="8" class="muted">No orders yet.</td></tr>';
      return;
    }
    orders.forEach((order) => {
      const tr = document.createElement('tr');
      const itemsText = order.items
        .map((item) => `${productName(item.id)} x${item.qty}`)
        .join(', ');
      tr.innerHTML = `
        <td>${order.id}</td>
        <td>${order.customerName}</td>
        <td>${order.patientName}</td>
        <td>${order.mobile}</td>
        <td>${order.age}</td>
        <td>${itemsText}</td>
        <td>${formatCurrency(calcTotal(order))}</td>
        <td><button type="button" class="danger" data-id="${order.id}">Delete</button></td>
      `;
      tableBody.appendChild(tr);
    });
  }

  tableBody.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-id]');
    if (!btn) return;
    const id = btn.getAttribute('data-id');
    const orders = getOrders().filter((o) => o.id !== id);
    saveOrders(orders);
    render();
  });

  const logoutBtn = document.getElementById('adminLogout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem(STORE_KEYS.authed);
      window.location.href = 'admin-login.html';
    });
  }

  render();
}

document.addEventListener('DOMContentLoaded', () => {
  seedStoreFromXml().finally(() => {
    renderMedicineStore();
    renderAdminLogin();
    renderAdminDashboard();
  });
});
