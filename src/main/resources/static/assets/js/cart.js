const cartStorageKey = "bakery_cart";
const pendingOrderStorageKey = "bakery_pending_order";
const cartActivityKey = "bakery_cart_last_activity";

const formatPrice = (value) =>
  `Rs. ${value.toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;

const fallbackProducts = {
  "1": {
    name: "Orange White Choco-Chip Gateau",
    image: "./assets/images/product-1.png",
    weight: "500 g",
    flavour: "Orange",
    cream: "Whippin Cream",
    unitPrice: 2000
  },
  "2": {
    name: "Black Forest Gateuax",
    image: "./assets/images/Black-forest-Gateau.png",
    weight: "500 g",
    flavour: "Black Forest",
    cream: "Whippin Cream",
    unitPrice: 5000
  },
  "3": {
    name: "Red Velvet Cake",
    image: "./assets/images/Red Velvet Cake 2.png",
    weight: "500 g",
    flavour: "Red Velvet",
    cream: "Cheese Cream",
    unitPrice: 4000
  },
  "4": {
    name: "Blueberry Baked Cheesecake",
    image: "./assets/images/Blueberry Baked Cheesecake.png",
    weight: "500 g",
    flavour: "Blueberry",
    cream: "Fresh Cream",
    unitPrice: 5500
  },
  "5": {
    name: "Chocolate Cake",
    image: "./assets/images/Coffee-Chocolate-Gateau.png",
    weight: "500 g",
    flavour: "Milk Chocolate",
    cream: "Chocolate Cream",
    unitPrice: 4500
  },
  "6": {
    name: "Marble Gateau",
    image: "./assets/images/Marble Gateau.png",
    weight: "500 g",
    flavour: "Marble",
    cream: "Whippin Cream",
    unitPrice: 3200
  }
};

const createCartItemKey = (productId, config) =>
  [productId, config.weight, config.flavour, config.cream, config.message || ""].join("|");

const hydrateCartItems = () => {
  const rawItems = JSON.parse(localStorage.getItem(cartStorageKey) || "[]");

  return rawItems
    .map((item) => {
      if (item.key && item.name && item.image && item.unitPrice) {
        return {
          ...item,
          qty: Number(item.qty) > 0 ? Number(item.qty) : 1
        };
      }

      const fallback = fallbackProducts[String(item.id)];
      if (!fallback) return null;

      return {
        key: createCartItemKey(String(item.id), fallback),
        id: String(item.id),
        name: fallback.name,
        image: fallback.image,
        qty: Number(item.qty) > 0 ? Number(item.qty) : 1,
        unitPrice: fallback.unitPrice,
        weight: fallback.weight,
        flavour: fallback.flavour,
        cream: fallback.cream,
        message: ""
      };
    })
    .filter(Boolean);
};

const state = {
  cartItems: hydrateCartItems()
};

const renderPendingOrder = () => {
  const pendingOrderPanel = document.getElementById("pending-order-panel");
  const pendingOrder = JSON.parse(localStorage.getItem(pendingOrderStorageKey) || "null");

  if (!pendingOrderPanel || !pendingOrder || pendingOrder.orderStatus !== "Pending") {
    if (pendingOrderPanel) {
      pendingOrderPanel.classList.add("is-hidden");
      pendingOrderPanel.innerHTML = "";
    }
    return;
  }

  pendingOrderPanel.classList.remove("is-hidden");
  pendingOrderPanel.innerHTML = `
    <h3>Pending Order #${pendingOrder.orderId}</h3>
    <p>
      Your order is currently pending. Pickup on ${pendingOrder.pickupDate} at ${pendingOrder.pickupTime}.
      Payment method: ${pendingOrder.paymentMethod}. Total: ${formatPrice(pendingOrder.total)}.
    </p>
  `;
};

const persistCartItems = () => {
  localStorage.setItem(cartStorageKey, JSON.stringify(state.cartItems));
  if (state.cartItems.length > 0) {
    localStorage.setItem(cartActivityKey, String(Date.now()));
  } else {
    localStorage.removeItem(cartActivityKey);
  }
};

const getCartTotals = () => {
  const subtotal = state.cartItems.reduce(
    (total, item) => total + item.unitPrice * item.qty,
    0
  );

  return { subtotal, total: subtotal };
};

const renderSummary = () => {
  const { subtotal, total } = getCartTotals();

  document.getElementById("summary-subtotal").textContent = formatPrice(subtotal);
  document.getElementById("summary-total").textContent = formatPrice(total);
  document.getElementById("nav-cart-count").textContent = String(
    state.cartItems.reduce((count, item) => count + item.qty, 0)
  );
};

const renderCartList = () => {
  const cartList = document.getElementById("cart-list");

  if (!state.cartItems.length) {
    cartList.innerHTML = `
      <div class="cart-empty">
        Your cart is empty. Add a cake from the product page.
      </div>
    `;
    renderSummary();
    return;
  }

  cartList.innerHTML = state.cartItems
    .map(
      (item) => `
        <article class="cart-row">
          <div class="product-cell">
            <img src="${item.image}" alt="${item.name}">
            <div class="product-copy">
              <h3>${item.name}</h3>
              <p>${item.weight} | ${item.flavour} | ${item.cream}</p>
              ${item.message ? `<p>Message: ${item.message}</p>` : ""}
            </div>
          </div>

          <div class="cell-price">${formatPrice(item.unitPrice)}</div>

          <div class="qty-control">
            <button type="button" data-key="${item.key}" data-action="decrease">-</button>
            <span>${item.qty}</span>
            <button type="button" data-key="${item.key}" data-action="increase">+</button>
          </div>

          <div class="cell-subtotal">
            ${formatPrice(item.unitPrice * item.qty)}
          </div>

          <div class="cell-remove">
            <button class="delete-btn" type="button" data-remove="${item.key}" title="Remove item" aria-label="Remove item">
              &#128465;
            </button>
          </div>
        </article>
      `
    )
    .join("");

  cartList.querySelectorAll("[data-key]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = state.cartItems.find((i) => i.key === btn.dataset.key);
      if (!item) return;

      if (btn.dataset.action === "increase") {
        item.qty += 1;
      } else {
        item.qty -= 1;
      }

      state.cartItems = state.cartItems.filter((i) => i.qty > 0);

      persistCartItems();
      renderCartList();
    });
  });

  cartList.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!confirm("Remove this item from cart?")) return;

      state.cartItems = state.cartItems.filter(
        (item) => item.key !== btn.dataset.remove
      );

      persistCartItems();
      renderCartList();
    });
  });

  renderSummary();
};

document.addEventListener("DOMContentLoaded", () => {
  persistCartItems();
  renderPendingOrder();
  renderCartList();

  const couponApply = document.getElementById("coupon-apply");

  if (couponApply) {
    couponApply.addEventListener("click", () => {
      const input = document.getElementById("coupon-input");
      const message = document.getElementById("coupon-message");

      message.textContent = input.value.trim()
        ? "Coupons not available yet."
        : "No coupons available.";
    });
  }
});
