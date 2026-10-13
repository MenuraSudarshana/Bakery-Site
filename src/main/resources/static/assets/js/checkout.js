const cartStorageKey = "bakery_cart";
const customerStorageKey = "bakery_customer_session";
const pendingOrderStorageKey = "bakery_pending_order";
const cartActivityKey = "bakery_cart_last_activity";
const apiBaseUrl = "http://localhost:8080";

const formatPrice = (value) =>
  `Rs. ${value.toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;

const parseJson = (value, fallback) => {
  try {
    return JSON.parse(value);
  } catch (e) {
    return fallback;
  }
};

const customer = parseJson(localStorage.getItem(customerStorageKey), null);
const cartItems = parseJson(localStorage.getItem(cartStorageKey), []);

if (!customer?.loggedIn) {
  window.location.href = "./login.html?next=./checkout.html";
}

const state = {
  paymentMethod: "Pay at Pickup"
};

const customerName = document.getElementById("customer-name");
const customerEmail = document.getElementById("customer-email");
const customerPhone = document.getElementById("customer-phone");
const customerAddress = document.getElementById("customer-address");
const checkoutItems = document.getElementById("checkout-items");
const checkoutSubtotal = document.getElementById("checkout-subtotal");
const checkoutTotal = document.getElementById("checkout-total");
const checkoutForm = document.getElementById("checkout-form");
const checkoutStatus = document.getElementById("checkout-status");
const logoutButton = document.getElementById("logout-btn");
const paymentButtons = document.querySelectorAll("[data-payment]");
const myAccountLink = document.getElementById("my-account-link");

const pickupDateInput = document.getElementById("pickup-date");
const pickupTimeInput = document.getElementById("pickup-time");
const pickupDateError = document.getElementById("pickup-date-error");
const pickupTimeError = document.getElementById("pickup-time-error");

const getSubtotal = () =>
  cartItems.reduce((total, item) => total + Number(item.unitPrice || 0) * Number(item.qty || 0), 0);

const parseApiResponse = async (response) => {
  const rawText = await response.text();

  if (!rawText) {
    return {};
  }

  try {
    return JSON.parse(rawText);
  } catch (error) {
    return { message: rawText };
  }
};

const renderCustomer = () => {
  customerName.textContent = customer?.name || "-";
  customerEmail.textContent = customer?.email || "-";
  customerPhone.textContent = customer?.phone || "-";
  customerAddress.textContent = customer?.address || "-";
};

const renderItems = () => {
  if (!cartItems.length) {
    checkoutItems.innerHTML = `
      <div class="summary-item">
        <div></div>
        <div>
          <h3>Your cart is empty</h3>
          <p>Add a cake before checkout.</p>
        </div>
      </div>
    `;
    checkoutSubtotal.textContent = formatPrice(0);
    checkoutTotal.textContent = formatPrice(0);
    return;
  }

  checkoutItems.innerHTML = cartItems
    .map(
      (item) => `
        <article class="summary-item">
          <img src="${item.image}" alt="${item.name}">
          <div>
            <h3>${item.name}</h3>
            <p>${item.weight} | ${item.flavour} | ${item.cream}</p>
            ${item.message ? `<p>Message: ${item.message}</p>` : ""}
            <p>Qty: ${item.qty}</p>
          </div>
          <strong>${formatPrice(item.unitPrice * item.qty)}</strong>
        </article>
      `
    )
    .join("");

  const subtotal = getSubtotal();
  checkoutSubtotal.textContent = formatPrice(subtotal);
  checkoutTotal.textContent = formatPrice(subtotal);
};

const clearErrors = () => {
  pickupDateError.textContent = "";
  pickupTimeError.textContent = "";
  checkoutStatus.textContent = "";
  checkoutStatus.classList.remove("error");
};

const validateCheckout = () => {
  clearErrors();
  let isValid = true;

  if (!cartItems.length) {
    checkoutStatus.textContent = "Your cart is empty. Add items before checkout.";
    checkoutStatus.classList.add("error");
    return false;
  }

  if (!pickupDateInput.value) {
    pickupDateError.textContent = "Please select a pickup date.";
    isValid = false;
  }

  if (!pickupTimeInput.value) {
    pickupTimeError.textContent = "Please select a pickup time.";
    isValid = false;
  }

  if (!isValid) {
    checkoutStatus.textContent = "Please fill in the required checkout details.";
    checkoutStatus.classList.add("error");
  }

  return isValid;
};

paymentButtons.forEach((button) => {
  button.addEventListener("click", () => {
    paymentButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    state.paymentMethod = button.dataset.payment;
  });
});

logoutButton.addEventListener("click", () => {
  localStorage.removeItem(customerStorageKey);
  window.location.href = "./login.html?next=./checkout.html";
});

checkoutForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!validateCheckout()) {
    return;
  }

  const orderSummary = {
    customerId: customer.id || null,
    customerName: customer.name,
    customerEmail: customer.email,
    customerPhone: customer.phone,
    customerAddress: customer.address,
    cartItems,
    pickupDate: pickupDateInput.value,
    pickupTime: pickupTimeInput.value,
    paymentMethod: state.paymentMethod,
    total: getSubtotal()
  };

  try {
    checkoutStatus.textContent = "Saving your order...";

    const response = await fetch(`${apiBaseUrl}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        customerId: orderSummary.customerId,
        customerName: orderSummary.customerName,
        customerEmail: orderSummary.customerEmail,
        customerPhone: orderSummary.customerPhone,
        customerAddress: orderSummary.customerAddress,
        pickupDate: orderSummary.pickupDate,
        pickupTime: orderSummary.pickupTime,
        paymentMethod: orderSummary.paymentMethod,
        orderItems: JSON.stringify(orderSummary.cartItems),
        total: orderSummary.total
      })
    });

    const data = await parseApiResponse(response);

    if (!response.ok || !data.success) {
      checkoutStatus.textContent =
        data.message || `Unable to place your order right now. Server returned ${response.status}.`;
      checkoutStatus.classList.add("error");
      return;
    }

    localStorage.setItem(pendingOrderStorageKey, JSON.stringify({
      orderId: data.orderId,
      orderStatus: data.orderStatus,
      pickupDate: orderSummary.pickupDate,
      pickupTime: orderSummary.pickupTime,
      paymentMethod: orderSummary.paymentMethod,
      total: orderSummary.total,
      customerName: orderSummary.customerName
    }));

    localStorage.removeItem(cartStorageKey);
    localStorage.removeItem(cartActivityKey);
    checkoutStatus.textContent = "Order placed successfully.";

    const stayLoggedIn = window.confirm(
      "Order placed successfully. Do you want to stay logged in and go back to the menu?"
    );

    if (!stayLoggedIn) {
      localStorage.removeItem(customerStorageKey);
    }

    window.setTimeout(() => {
      window.location.href = "./menu.html";
    }, 500);
  } catch (error) {
    checkoutStatus.textContent = `Unable to connect to checkout server at ${apiBaseUrl}. Make sure Spring Boot is running on port 8080.`;
    checkoutStatus.classList.add("error");
  }
});

window.addEventListener("DOMContentLoaded", () => {
  const today = new Date().toISOString().split("T")[0];
  pickupDateInput.min = today;

  if (myAccountLink) {
    myAccountLink.href = customer?.loggedIn
      ? "./customer-account.html"
      : "./login.html?next=./customer-account.html";
  }

  renderCustomer();
  renderItems();
});
