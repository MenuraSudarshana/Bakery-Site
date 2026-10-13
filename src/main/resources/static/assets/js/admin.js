const apiBaseUrl = "http://localhost:8080";
const adminSessionKey = "bakery_admin_session";
const byId = (id) => document.getElementById(id);
const setStatus = (el, msg) => { if (el) el.textContent = msg; };
const safeJson = async (r) => {
  const t = await r.text();
  if (!t) return {};
  try { return JSON.parse(t); } catch { return { message: t }; }
};
const money = (v) => `Rs. ${Number(v || 0).toFixed(2)}`;
let cachedProducts = [];
let cachedOrders = [];
let cachedReservations = [];
let cachedCustomOrders = [];
let notificationsTimer = null;
const defaultCategories = ["Butter Cakes", "Signature Cakes", "Cake Pieces"];
const defaultFlavours = ["Chocolate", "Vanilla", "Coffee", "Fruit", "Butter", "Red Velvet", "Mixed"];

function upsertSelectOption(selectEl, value) {
  const val = String(value || "").trim();
  if (!selectEl || !val) return;
  const exists = Array.from(selectEl.options).some((option) => option.value === val);
  if (!exists) {
    const option = document.createElement("option");
    option.value = val;
    option.textContent = val;
    selectEl.appendChild(option);
  }
}

function rebuildOptions(selectId, values) {
  const selectEl = byId(selectId);
  if (!selectEl) return;
  selectEl.innerHTML = values.map((v) => `<option value="${esc(v)}">${esc(v)}</option>`).join("");
}

function buildProductMetaOptions() {
  const flavours = new Map();
  defaultFlavours.forEach((value) => flavours.set(value.toLowerCase(), value));
  cachedProducts.forEach((product) => {
    const flavour = String(product.flavour || "").trim();
    if (flavour) flavours.set(flavour.toLowerCase(), flavour);
  });
  const flavourValues = [...flavours.values()].sort((a, b) => a.localeCompare(b));
  rebuildOptions("product-flavour", flavourValues);
  rebuildOptions("edit-product-flavour", flavourValues);
}

function showToast(message, type = "success") {
  const container = byId("admin-toast-container");
  if (!container || !message) return;
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  window.setTimeout(() => toast.remove(), 3500);
}

function updateProductActionButtons() {
  const id = byId("edit-product-select").value;
  const p = cachedProducts.find((x) => String(x.id) === String(id));
  const toggleBtn = byId("toggle-product-visibility-btn");
  const deleteBtn = byId("delete-product-btn");
  if (!toggleBtn || !deleteBtn) return;
  if (!p) {
    toggleBtn.textContent = "Hide Product";
    toggleBtn.disabled = true;
    deleteBtn.disabled = true;
    return;
  }
  toggleBtn.disabled = false;
  deleteBtn.disabled = false;
  toggleBtn.textContent = p.active ? "Hide Product" : "Make Visible";
}

async function uploadProductImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`${apiBaseUrl}/api/admin/products/upload-image`, {
    method: "POST",
    body: formData
  });
  const data = await safeJson(response);
  if (!response.ok || !data.url) {
    throw new Error(data.message || "Image upload failed.");
  }
  return data.url;
}

async function resolveProductImageUrl(fileInputId, urlInputId, fallbackValue = "") {
  const file = byId(fileInputId)?.files?.[0];
  if (file) {
    const type = String(file.type || "").toLowerCase();
    if (!["image/png", "image/jpeg", "image/jpg"].includes(type)) {
      throw new Error("Only PNG and JPG images are allowed.");
    }
    return await uploadProductImage(file);
  }
  const url = byId(urlInputId).value.trim();
  return url || String(fallbackValue || "").trim();
}

async function loadSummary() {
  const s = await (await fetch(`${apiBaseUrl}/api/admin/summary`)).json();
  byId("kpi-products").textContent = s.totalProducts || 0;
  byId("kpi-pending").textContent = s.pendingOrders || 0;
  byId("kpi-success").textContent = s.successfulOrders || 0;
  byId("kpi-reservations").textContent = s.reservationCount || 0;
}

async function loadProducts() {
  cachedProducts = await (await fetch(`${apiBaseUrl}/api/admin/products`)).json();
  buildProductMetaOptions();
  const select = byId("edit-product-select");
  select.innerHTML = cachedProducts.map((p) => `<option value="${p.id}">#${p.id} ${p.name} ${p.active ? "" : "(Hidden)"}</option>`).join("");
  if (cachedProducts.length) {
    fillEditForm(cachedProducts[0].id);
  } else {
    byId("edit-product-form").reset();
    updateProductActionButtons();
  }
}

function fillEditForm(id) {
  const p = cachedProducts.find((x) => String(x.id) === String(id));
  if (!p) return;
  byId("edit-product-name").value = p.name || "";
  const normalizedCategory = String(p.category || "").trim().toLowerCase();
  const allowedCategory = defaultCategories.find((item) => item.toLowerCase() === normalizedCategory) || defaultCategories[0];
  upsertSelectOption(byId("edit-product-flavour"), p.flavour || "");
  byId("edit-product-category").value = allowedCategory;
  byId("edit-product-flavour").value = p.flavour || "";
  byId("edit-product-price").value = p.price || 0;
  byId("edit-product-rating").value = p.rating || 4.5;
  byId("edit-product-stock").value = p.stock || 0;
  byId("edit-product-image-url").value = p.imageUrl || "";
  byId("edit-product-image-file").value = "";
  byId("edit-product-description").value = p.description || "";
  updateProductActionButtons();
}

function actionsButtons(type, id) {
  return `<button class="btn" data-${type}="${id}" data-status="Pending">Pending</button>
  <button class="btn" data-${type}="${id}" data-status="Successful">Successful</button>
  <button class="btn danger" data-${type}="${id}" data-status="Cancelled">Cancel</button>`;
}

function esc(v) {
  return String(v ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function labelStatus(value) {
  const raw = String(value || "").toLowerCase();
  if (raw === "requested_to_cancel") return "Requested To Cancel";
  if (raw === "pending_review") return "Pending Review";
  if (raw === "successful") return "Successful";
  if (raw === "cancelled") return "Cancelled";
  return "Pending";
}

function formatOrderItemsForAdmin(rawItems) {
  const text = String(rawItems || "").trim();
  if (!text) return "-";
  try {
    const items = JSON.parse(text);
    if (!Array.isArray(items) || !items.length) return esc(text);
    return items.map((item, index) => {
      const qty = Number(item.qty || 0);
      return `${index + 1}. ${esc(item.name || "Cake Item")} (Qty: ${qty || 1})`;
    }).join("<br>");
  } catch {
    return esc(text);
  }
}

function isImageUrl(url) {
  const s = String(url || "").toLowerCase();
  return s.startsWith("data:image/")
    || s.endsWith(".jpg")
    || s.endsWith(".jpeg")
    || s.endsWith(".png")
    || s.endsWith(".webp")
    || s.endsWith(".gif")
    || s.includes("cloudinary")
    || s.includes("imgur");
}

function normalizeImageSrc(value) {
  const s = String(value || "").trim();
  if (!s) return "";
  if (s.startsWith("data:image/")) return s;
  if (/^[A-Za-z0-9+/=\r\n]+$/.test(s) && s.length > 100) {
    return `data:image/jpeg;base64,${s.replace(/\s+/g, "")}`;
  }
  return s;
}

function renderReference(url) {
  const clean = String(url || "").trim();
  if (!clean) return "-";
  const imageSrc = normalizeImageSrc(clean);
  const safe = esc(imageSrc);
  const link = imageSrc.startsWith("data:image/")
    ? `<span class="link">Uploaded Image</span>`
    : `<a class="link" href="${safe}" target="_blank" rel="noopener noreferrer">Open Link</a>`;
  if (!isImageUrl(imageSrc)) return link;
  return `${link}<img class="thumb" src="${safe}" alt="Cake reference image">`;
}

async function loadOrders() {
  const rows = await (await fetch(`${apiBaseUrl}/api/admin/orders?status=all`)).json();
  cachedOrders = rows;
  const body = byId("orders-table-body");
  body.innerHTML = rows.map((o) => `<tr><td>#${o.id}</td><td>${o.customerName}</td><td>${esc(o.customerPhone) || "-"}</td><td>${formatOrderItemsForAdmin(o.orderItems)}</td><td>${money(o.total)}</td><td>${labelStatus(o.orderStatus)}</td><td>${o.pickupDate} ${o.pickupTime}</td><td>${esc(o.paymentMethod) || "-"}</td><td>${actionsButtons("order", o.id)}</td></tr>`).join("");
  body.querySelectorAll("[data-order]").forEach((b) => b.addEventListener("click", async () => {
    await fetch(`${apiBaseUrl}/api/admin/orders/${b.dataset.order}/status?status=${b.dataset.status}`, { method: "PATCH" });
    await refreshAll();
  }));
}

async function loadReservations() {
  const rows = await (await fetch(`${apiBaseUrl}/api/admin/reservations`)).json();
  cachedReservations = rows;
  const body = byId("reservations-table-body");
  body.innerHTML = rows.map((r) => `<tr><td>#${r.id}</td><td>${r.name || "-"}</td><td>${esc(r.phone) || "-"}</td><td>${r.persons ?? 0}</td><td>${r.reservationDate || "-"}</td><td>${r.reservationTime || "-"}</td><td>${labelStatus(r.reservationStatus || "Pending")}</td><td>${actionsButtons("reservation", r.id)}</td></tr>`).join("");
  body.querySelectorAll("[data-reservation]").forEach((b) => b.addEventListener("click", async () => {
    await fetch(`${apiBaseUrl}/api/admin/reservations/${b.dataset.reservation}/status?status=${b.dataset.status}`, { method: "PATCH" });
    await refreshAll();
  }));
}

async function loadCustomOrders() {
  const rows = await (await fetch(`${apiBaseUrl}/api/admin/customize-cake-orders?status=all`)).json();
  cachedCustomOrders = rows;
  const body = byId("custom-orders-table-body");
  body.innerHTML = rows.map((o) => `<tr>
    <td>#${o.id}</td>
    <td>${esc(o.customerName)}<br><small>${esc(o.customerEmail)}</small></td>
    <td>${esc(o.contactNumber) || "-"}</td>
    <td>${esc(o.occasion) || "-"}</td>
    <td>${esc(o.weight) || "-"}</td>
    <td>${o.layers ?? "-"}</td>
    <td>${esc(o.flavor) || "-"}</td>
    <td>${esc(o.requiredDate) || "-"}</td>
    <td>${esc(o.paymentMethod) || "-"}</td>
    <td>${esc(o.specifications) || "-"}</td>
    <td>${esc(o.note) || "-"}</td>
    <td>${renderReference(o.designPhotoUrl)}</td>
    <td>${labelStatus(o.orderStatus)}</td>
    <td>${actionsButtons("custom", o.id)}</td>
  </tr>`).join("");
  body.querySelectorAll("[data-custom]").forEach((b) => b.addEventListener("click", async () => {
    await fetch(`${apiBaseUrl}/api/admin/customize-cake-orders/${b.dataset.custom}/status?status=${b.dataset.status}`, { method: "PATCH" });
    await refreshAll();
  }));
}

async function loadCustomers() {
  const rows = await (await fetch(`${apiBaseUrl}/api/admin/customers`)).json();
  const body = byId("customers-table-body");
  body.innerHTML = rows.map((c) => `<tr><td>${c.id}</td><td>${c.name}</td><td>${c.email}</td><td>${c.active ? "Active" : "Blocked"}</td>
    <td><button class="btn" data-view-customer="${c.id}">View</button>
    <button class="btn ${c.active ? "danger" : ""}" data-toggle-customer="${c.id}" data-active="${c.active}">${c.active ? "Block Login" : "Allow Login"}</button>
    <button class="btn danger" data-delete-customer="${c.id}">Delete</button></td></tr>`).join("");
  body.querySelectorAll("[data-view-customer]").forEach((b) => b.addEventListener("click", () => loadCustomerDetails(b.dataset.viewCustomer)));
  body.querySelectorAll("[data-toggle-customer]").forEach((b) => b.addEventListener("click", async () => {
    const nextActive = b.dataset.active !== "true";
    await fetch(`${apiBaseUrl}/api/admin/customers/${b.dataset.toggleCustomer}/active?active=${nextActive}`, { method: "PATCH" });
    await loadCustomers();
  }));
  body.querySelectorAll("[data-delete-customer]").forEach((b) => b.addEventListener("click", async () => {
    await fetch(`${apiBaseUrl}/api/admin/customers/${b.dataset.deleteCustomer}`, { method: "DELETE" });
    byId("customer-details-title").textContent = "Select Customer";
    byId("customer-pending-orders").innerHTML = "";
    byId("customer-success-orders").innerHTML = "";
    await refreshAll();
  }));
}

async function loadCustomerDetails(customerId) {
  const d = await (await fetch(`${apiBaseUrl}/api/admin/customers/${customerId}`)).json();
  byId("customer-details-title").textContent = `${d.customer.name} (${d.customer.email})`;
  byId("customer-pending-orders").innerHTML = (d.pendingOrders || []).map((o) => `<tr><td>#${o.id}</td><td>${money(o.total)}</td><td>${o.pickupDate}</td></tr>`).join("") || `<tr><td colspan="3">No pending orders</td></tr>`;
  byId("customer-success-orders").innerHTML = (d.successfulOrders || []).map((o) => `<tr><td>#${o.id}</td><td>${money(o.total)}</td><td>${o.pickupDate}</td></tr>`).join("") || `<tr><td colspan="3">No successful orders</td></tr>`;
}

async function refreshAll() {
  await Promise.all([loadSummary(), loadProducts(), loadOrders(), loadReservations(), loadCustomOrders(), loadCustomers(), loadAdminReviews()]);
  renderNotifications();
}

function navigateFromNotification(sectionId) {
  const target = byId(sectionId);
  if (!target) return;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderNotifications() {
  const list = byId("notification-list");
  const count = byId("notification-count");
  if (!list || !count) return;

  const notifications = [];

  cachedOrders.forEach((order) => {
    if (order.cancelRequested) {
      notifications.push({ key: `order-cancel-${order.id}`, text: `Cancellation requested for order #${order.id}.`, section: "operations", meta: `${order.customerName || "-"} | ${order.customerEmail || "-"}` });
    }
    if (order.updateRequested) {
      notifications.push({ key: `order-update-${order.id}`, text: `Customer requested changes to order #${order.id}.`, section: "operations", meta: String(order.updateRequestNote || "No note") });
    }
    if (String(order.orderStatus || "").toLowerCase() === "pending") {
      notifications.push({ key: `order-new-${order.id}`, text: `New order #${order.id} is waiting for approval.`, section: "operations", meta: `${order.customerName || "-"} | ${money(order.total)}` });
    }
  });

  cachedReservations.forEach((reservation) => {
    if (reservation.cancelRequested) {
      notifications.push({ key: `reservation-cancel-${reservation.id}`, text: `Cancellation requested for reservation #${reservation.id}.`, section: "operations", meta: `${reservation.name || "-"} | ${reservation.email || "-"}` });
    }
    if (reservation.updateRequested) {
      notifications.push({ key: `reservation-update-${reservation.id}`, text: `Customer requested changes to reservation #${reservation.id}.`, section: "operations", meta: String(reservation.updateRequestNote || "No note") });
    }
    if (String(reservation.reservationStatus || "").toLowerCase() === "pending") {
      notifications.push({ key: `reservation-new-${reservation.id}`, text: `New reservation #${reservation.id} is waiting for approval.`, section: "operations", meta: `${reservation.name || "-"} | ${reservation.reservationDate || "-"}` });
    }
  });

  cachedCustomOrders.forEach((order) => {
    if (order.cancelRequested || String(order.orderStatus || "").toLowerCase() === "requested_to_cancel") {
      notifications.push({ key: `custom-cancel-${order.id}`, text: `Cancellation requested for custom order #${order.id}.`, section: "customize-orders-anchor", meta: `${order.customerName || "-"} | ${order.requiredDate || "-"}` });
    }
    if (order.updateRequested) {
      notifications.push({ key: `custom-update-${order.id}`, text: `Customer requested changes to custom order #${order.id}.`, section: "customize-orders-anchor", meta: String(order.updateRequestNote || "No note") });
    }
    const status = String(order.orderStatus || "").toLowerCase();
    if (status === "pending" || status === "pending_review") {
      notifications.push({ key: `custom-new-${order.id}`, text: `New custom order #${order.id} is waiting for review.`, section: "customize-orders-anchor", meta: `${order.customerName || "-"} | ${order.occasion || "-"}` });
    }
  });

  notifications.sort((a, b) => b.key.localeCompare(a.key));
  count.textContent = String(notifications.length);
  list.innerHTML = notifications.length
    ? notifications.map((n) => `<button type="button" class="notification-item" data-notification-target="${n.section}">
      <p>${esc(n.text)}<br><small>${esc(n.meta)}</small></p>
      <span class="link">View details</span>
    </button>`).join("")
    : `<p class="status">No new notifications.</p>`;

  list.querySelectorAll("[data-notification-target]").forEach((btn) => {
    btn.addEventListener("click", () => navigateFromNotification(btn.dataset.notificationTarget));
  });
}

function setLoggedInView(isLoggedIn) {
  byId("admin-login-card").classList.toggle("hidden", isLoggedIn);
  byId("admin-content").classList.toggle("hidden", !isLoggedIn);
  byId("admin-content-nav").classList.toggle("hidden", !isLoggedIn);
}

byId("admin-login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  setStatus(byId("admin-login-status"), "Checking login...");
  const response = await fetch(`${apiBaseUrl}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: byId("admin-username").value.trim(), password: byId("admin-password").value })
  });
  const result = (await response.text()).trim();
  if (result !== "SUCCESS") return setStatus(byId("admin-login-status"), "Invalid credentials.");
  localStorage.setItem(adminSessionKey, "1");
  setLoggedInView(true);
  setStatus(byId("admin-login-status"), "");
  await refreshAll();
  if (notificationsTimer) clearInterval(notificationsTimer);
  notificationsTimer = setInterval(refreshAll, 30000);
});

byId("add-product-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  let imageUrl = "";
  try {
    imageUrl = await resolveProductImageUrl("product-image-file", "product-image-url");
  } catch (error) {
    setStatus(byId("add-product-status"), error.message || "Invalid image file.");
    return;
  }
  if (!imageUrl) {
    setStatus(byId("add-product-status"), "Please add Image URL or upload PNG/JPG photo.");
    return;
  }
  const payload = {
    name: byId("product-name").value.trim(),
    category: byId("product-category").value.trim(),
    flavour: byId("product-flavour").value.trim(),
    description: byId("product-description").value.trim(),
    imageUrl,
    price: Number(byId("product-price").value),
    rating: Number(byId("product-rating").value),
    stock: Number(byId("product-stock").value)
  };
  const res = await fetch(`${apiBaseUrl}/api/admin/products`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  const data = await safeJson(res);
  const message = res.ok ? "Product created." : (data.message || "Failed.");
  setStatus(byId("add-product-status"), message);
  showToast(message, res.ok ? "success" : "error");
  if (res.ok) { byId("add-product-form").reset(); await refreshAll(); }
});

byId("edit-product-select").addEventListener("change", (e) => fillEditForm(e.target.value));
byId("edit-product-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = byId("edit-product-select").value;
  const currentProduct = cachedProducts.find((x) => String(x.id) === String(id));
  let imageUrl = "";
  try {
    imageUrl = await resolveProductImageUrl("edit-product-image-file", "edit-product-image-url", currentProduct?.imageUrl || "");
  } catch (error) {
    setStatus(byId("edit-product-status"), error.message || "Invalid image file.");
    return;
  }
  if (!imageUrl) {
    setStatus(byId("edit-product-status"), "Please add Image URL or upload PNG/JPG photo.");
    return;
  }
  const payload = {
    name: byId("edit-product-name").value.trim(),
    category: byId("edit-product-category").value.trim(),
    flavour: byId("edit-product-flavour").value.trim(),
    description: byId("edit-product-description").value.trim(),
    imageUrl,
    price: Number(byId("edit-product-price").value),
    rating: Number(byId("edit-product-rating").value),
    stock: Number(byId("edit-product-stock").value)
  };
  const res = await fetch(`${apiBaseUrl}/api/admin/products/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  const data = await safeJson(res);
  const message = res.ok ? "Product updated." : (data.message || "Failed.");
  setStatus(byId("edit-product-status"), message);
  showToast(message, res.ok ? "success" : "error");
  if (res.ok) await refreshAll();
});

byId("toggle-product-visibility-btn").addEventListener("click", async () => {
  const id = byId("edit-product-select").value;
  const product = cachedProducts.find((x) => String(x.id) === String(id));
  if (!product) return;
  const nextActive = !product.active;
  const res = await fetch(`${apiBaseUrl}/api/admin/products/${id}/active?active=${nextActive}`, { method: "PATCH" });
  const data = await safeJson(res);
  const message = res.ok ? (nextActive ? "Product is now visible." : "Product hidden from website.") : (data.message || "Failed.");
  setStatus(byId("edit-product-status"), message);
  showToast(message, res.ok ? "success" : "error");
  if (res.ok) await refreshAll();
});

byId("delete-product-btn").addEventListener("click", async () => {
  const id = byId("edit-product-select").value;
  const product = cachedProducts.find((x) => String(x.id) === String(id));
  if (!product) return;
  if (!window.confirm(`Are you sure you want to delete "${product.name}"?`)) return;
  const res = await fetch(`${apiBaseUrl}/api/admin/products/${id}`, { method: "DELETE" });
  const data = await safeJson(res);
  const message = res.ok ? "Product deleted." : (data.message || "Failed.");
  setStatus(byId("edit-product-status"), message);
  showToast(message, res.ok ? "success" : "error");
  if (res.ok) await refreshAll();
});

byId("refresh-orders").addEventListener("click", refreshAll);
byId("refresh-reviews").addEventListener("click", loadAdminReviews);

byId("admin-logout-btn").addEventListener("click", () => {
  localStorage.removeItem(adminSessionKey);
  if (notificationsTimer) {
    clearInterval(notificationsTimer);
    notificationsTimer = null;
  }
  setLoggedInView(false);
});

window.addEventListener("DOMContentLoaded", async () => {
  const isLoggedIn = localStorage.getItem(adminSessionKey) === "1";
  setLoggedInView(isLoggedIn);
  if (isLoggedIn) {
    await refreshAll();
    notificationsTimer = setInterval(refreshAll, 30000);
  }
});

async function loadAdminReviews() {
  const rows = await (await fetch(`${apiBaseUrl}/api/admin/reviews`)).json();
  const body = byId("reviews-table-body");
  body.innerHTML = rows.length ? rows.map((r) => `
      <tr>
        <td>#${r.id}</td>
        <td>${esc(r.customerName)}<br><small>${esc(r.customerEmail)}</small></td>
        <td>${esc(r.createdAt)}</td>
        <td>${esc(r.reviewText)}</td>
        <td>${r.hiddenByAdmin ? "Hidden by admin" : (r.autoHidden ? "Auto hidden (3 dislikes)" : "Visible")}</td>
        <td><button class="btn ${r.hiddenByAdmin ? "" : "danger"}" data-hide-review="${r.id}" data-hidden="${r.hiddenByAdmin}">
          ${r.hiddenByAdmin ? "Show on website" : "Hide from website"}
        </button></td>
      </tr>
  `).join("") : `<tr><td colspan="6">No reviews found.</td></tr>`;

  body.querySelectorAll("[data-hide-review]").forEach((btn) => btn.addEventListener("click", async () => {
    const nextHidden = btn.dataset.hidden !== "true";
    await fetch(`${apiBaseUrl}/api/admin/reviews/${btn.dataset.hideReview}/hidden?hidden=${nextHidden}`, { method: "PATCH" });
    await loadAdminReviews();
  }));
}
