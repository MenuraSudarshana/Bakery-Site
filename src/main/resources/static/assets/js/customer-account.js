const sessionKey = "bakery_customer_session";
const apiBase = "http://localhost:8080";

const parseSession = () => {
  try { return JSON.parse(localStorage.getItem(sessionKey) || "null"); } catch { return null; }
};

const session = parseSession();
if (!session?.loggedIn) {
  window.location.href = "./login.html?next=./customer-account.html";
}

const profileForm = document.getElementById("profileForm");
const passwordForm = document.getElementById("passwordForm");
const profileStatus = document.getElementById("profileStatus");
const passwordStatus = document.getElementById("passwordStatus");
const ordersPendingList = document.getElementById("ordersPendingList");
const ordersSuccessfulList = document.getElementById("ordersSuccessfulList");
const reservationsList = document.getElementById("reservationsList");
const customizePendingList = document.getElementById("customizePendingList");
const customizeSuccessfulList = document.getElementById("customizeSuccessfulList");
const customizeCancelledList = document.getElementById("customizeCancelledList");

const tabOrders = document.getElementById("tab-orders");
const tabReservations = document.getElementById("tab-reservations");
const tabCustomize = document.getElementById("tab-customize");
const tabReviews = document.getElementById("tab-reviews");
const tabProfile = document.getElementById("tab-profile");

const panelOrders = document.getElementById("panel-orders");
const panelReservations = document.getElementById("panel-reservations");
const panelCustomize = document.getElementById("panel-customize");
const panelReviews = document.getElementById("panel-reviews");
const panelProfile = document.getElementById("panel-profile");
const reviewForm = document.getElementById("reviewForm");
const reviewStatus = document.getElementById("reviewStatus");
const reviewsList = document.getElementById("reviewsList");
const updateModal = document.getElementById("updateModal");
const updateModalTitle = document.getElementById("updateModalTitle");
const updateModalCopy = document.getElementById("updateModalCopy");
const updateModalForm = document.getElementById("updateModalForm");
const updateModalCancel = document.getElementById("updateModalCancel");
const updateModalSubmit = document.getElementById("updateModalSubmit");
const logoutBtn = document.getElementById("logoutBtn");
let currentUpdateHandler = null;
let cachedOverview = { orders: [], reservations: [], customizeOrders: [] };
const paymentMethods = ["Pay at Pickup", "Card on Collection", "Home Delivery"];
const pickupSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30", "20:00"
];

document.getElementById("name").value = session?.name || "";
document.getElementById("email").value = session?.email || "";
document.getElementById("phone").value = session?.phone || "";
document.getElementById("address").value = session?.address || "";

const showStatus = (el, text, isError = false) => {
  el.textContent = text;
  el.classList.toggle("error", isError);
};

const escapeHtml = (value) => String(value || "")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#039;");

const renderOrderItems = (rawItems) => {
  const text = String(rawItems || "").trim();
  if (!text) return "-";
  try {
    const items = JSON.parse(text);
    if (!Array.isArray(items) || !items.length) return escapeHtml(text);
    return items.map((item, index) => {
      const qty = Number(item.qty || 0);
      const price = Number(item.unitPrice || 0);
      const total = qty * price;
      return [
        `${index + 1}. ${escapeHtml(item.name || "Cake Item")}`,
        `Qty: ${qty || 1}`,
        `Weight: ${escapeHtml(item.weight || "-")}`,
        `Flavor: ${escapeHtml(item.flavour || "-")}`,
        `Cream: ${escapeHtml(item.cream || "-")}`,
        `Message: ${escapeHtml(item.message || "-")}`,
        `Unit Price: Rs. ${price.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        `Line Total: Rs. ${total.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      ].join(" | ");
    }).join("<br>");
  } catch {
    return escapeHtml(text);
  }
};

const formatOrderItemsText = (rawItems) => {
  const text = String(rawItems || "").trim();
  if (!text) return "-";
  try {
    const items = JSON.parse(text);
    if (!Array.isArray(items) || !items.length) return text;
    return items.map((item, index) => {
      const qty = Number(item.qty || 0);
      const price = Number(item.unitPrice || 0);
      const total = qty * price;
      return [
        `${index + 1}. ${String(item.name || "Cake Item")}`,
        `Qty: ${qty || 1}`,
        `Weight: ${String(item.weight || "-")}`,
        `Flavor: ${String(item.flavour || "-")}`,
        `Cream: ${String(item.cream || "-")}`,
        `Message: ${String(item.message || "-")}`,
        `Unit Price: Rs. ${price.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        `Line Total: Rs. ${total.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      ].join(" | ");
    }).join("\n");
  } catch {
    return text;
  }
};

const getOrderQuantity = (rawItems) => {
  try {
    const items = JSON.parse(String(rawItems || "").trim());
    if (!Array.isArray(items) || !items.length) return 1;
    const totalQty = items.reduce((sum, item) => sum + Math.max(1, Number(item.qty || 1)), 0);
    return Math.max(1, totalQty);
  } catch {
    return 1;
  }
};

const statusClass = (status) => {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "successful") return "successful";
  if (normalized === "cancelled") return "cancelled";
  if (normalized === "requested_to_cancel") return "requested";
  return "pending";
};

const displayStatus = (item) => {
  const raw = String(item?.orderStatus || item?.reservationStatus || "").toLowerCase();
  if (raw === "requested_to_cancel") return "Requested To Cancel";
  if (raw === "pending_review") return "Pending Review";
  if (raw === "successful") return "Successful";
  if (raw === "cancelled") return "Cancelled";
  return "Pending";
};

const setActiveTab = (tabName) => {
  const tabConfig = [
    { tab: tabOrders, panel: panelOrders, key: "orders" },
    { tab: tabReservations, panel: panelReservations, key: "reservations" },
    { tab: tabCustomize, panel: panelCustomize, key: "customize" },
    { tab: tabReviews, panel: panelReviews, key: "reviews" },
    { tab: tabProfile, panel: panelProfile, key: "profile" }
  ];

  tabConfig.forEach(({ tab, panel, key }) => {
    const active = key === tabName;
    tab.classList.toggle("active", active);
    panel.classList.toggle("is-hidden", !active);
  });
};

tabOrders.addEventListener("click", () => setActiveTab("orders"));
tabReservations.addEventListener("click", () => setActiveTab("reservations"));
tabCustomize.addEventListener("click", () => setActiveTab("customize"));
tabReviews.addEventListener("click", () => setActiveTab("reviews"));
tabProfile.addEventListener("click", () => setActiveTab("profile"));

const openUpdateModal = ({ title, copy, fields, onSubmit, submitText = "Update Order", onOpen = null }) => {
  if (!updateModal || !updateModalTitle || !updateModalCopy || !updateModalForm) {
    const raw = window.prompt("Enter update details:", "");
    if (!raw || !raw.trim()) return;
    currentUpdateHandler = async () => onSubmit(raw.trim());
    currentUpdateHandler();
    return;
  }
  updateModalTitle.textContent = title;
  updateModalCopy.textContent = copy;
  updateModalForm.innerHTML = fields.map((field) => `
    <label>
      ${field.label}
      ${field.type === "select"
        ? `<select name="${field.name}" ${field.required ? "required" : ""} ${field.readonly ? "disabled" : ""}>
          ${(field.options || []).map((option) => {
            const selected = String(option.value) === String(field.value) ? "selected" : "";
            return `<option value="${escapeHtml(option.value)}" ${selected}>${escapeHtml(option.label)}</option>`;
          }).join("")}
        </select>`
        : field.type === "textarea"
        ? `<textarea name="${field.name}" ${field.required ? "required" : ""} ${field.readonly ? "readonly" : ""}>${field.value || ""}</textarea>`
        : `<input name="${field.name}" type="${field.type || "text"}" value="${field.value || ""}" ${field.required ? "required" : ""} ${field.readonly ? "readonly" : ""}>`}
    </label>
  `).join("");
  updateModalSubmit.textContent = submitText;
  currentUpdateHandler = onSubmit;
  updateModal.classList.remove("is-hidden");
  if (typeof onOpen === "function") onOpen();
};

const closeUpdateModal = () => {
  if (!updateModal || !updateModalForm) return;
  updateModal.classList.add("is-hidden");
  updateModalForm.innerHTML = "";
  currentUpdateHandler = null;
};

const createNoteFromForm = () => {
  if (!updateModalForm) return "";
  const formData = new FormData(updateModalForm);
  const lines = [];
  for (const [key, value] of formData.entries()) {
    const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
    lines.push(`${label}: ${String(value).trim()}`);
  }
  return lines.join(" | ");
};

const updateOrder = async (orderId) => {
  const params = new URLSearchParams();
  if (session?.id) params.set("customerId", String(session.id));
  if (session?.email) params.set("email", session.email);
  const formData = new FormData(updateModalForm);
  const payload = {
    customerPhone: String(formData.get("customerPhone") || "").trim(),
    quantity: Number(String(formData.get("quantity") || "1")),
    pickupDate: String(formData.get("pickupDate") || "").trim(),
    pickupTime: String(formData.get("pickupTime") || "").trim(),
    paymentMethod: String(formData.get("paymentMethod") || "").trim()
  };
  const res = await fetch(`${apiBase}/api/customers/orders/${orderId}?${params.toString()}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    window.alert(data.message || "Update failed.");
    return;
  }
  const shownTotal = String(new FormData(updateModalForm).get("orderTotal") || "").trim();
  window.alert(
    `Updated successfully.\n` +
    `Phone: ${payload.customerPhone}\n` +
    `Quantity: ${payload.quantity}\n` +
    `Total: ${shownTotal || "-" }\n` +
    `Pickup Date: ${payload.pickupDate}\n` +
    `Pickup Time: ${payload.pickupTime}\n` +
    `Payment Method: ${payload.paymentMethod}`
  );
  await loadOverview();
};

const requestOrderAction = async (orderId, type) => {
  const params = new URLSearchParams();
  if (session?.id) params.set("customerId", String(session.id));
  if (session?.email) params.set("email", session.email);
  const suffix = type === "update" ? "update-request" : "cancel-request";
  if (type === "update") {
    const note = createNoteFromForm();
    if (!note) return;
    params.set("note", note);
  }
  const res = await fetch(`${apiBase}/api/customers/orders/${orderId}/${suffix}?${params.toString()}`, { method: "PATCH" });
  const data = await res.json();
  if (!res.ok || !data.success) {
    window.alert(data.message || "Request failed.");
    return;
  }
  await loadOverview();
};

const requestReservationAction = async (reservationId, type) => {
  const params = new URLSearchParams();
  if (session?.phone) params.set("phone", session.phone);
  if (session?.email) params.set("email", session.email);
  if (type === "update") {
    const note = createNoteFromForm();
    if (!note) return;
    params.set("note", note);
  }

  const suffix = type === "update" ? "update-request" : "cancel-request";
  const res = await fetch(`${apiBase}/api/customers/reservations/${reservationId}/${suffix}?${params.toString()}`, { method: "PATCH" });
  const data = await res.json();
  if (!res.ok || !data.success) {
    window.alert(data.message || "Request failed.");
    return;
  }
  await loadOverview();
};

const updateReservation = async (reservationId) => {
  const params = new URLSearchParams();
  if (session?.phone) params.set("phone", session.phone);
  if (session?.email) params.set("email", session.email);
  const formData = new FormData(updateModalForm);
  const payload = {
    reservationDate: String(formData.get("reservationDate") || "").trim(),
    reservationTime: String(formData.get("reservationTime") || "").trim(),
    persons: Number(String(formData.get("persons") || "0"))
  };
  const res = await fetch(`${apiBase}/api/customers/reservations/${reservationId}?${params.toString()}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    window.alert(data.message || "Update failed.");
    return;
  }
  window.alert(
    `Reservation updated successfully.\n` +
    `Date: ${payload.reservationDate}\n` +
    `Time: ${payload.reservationTime}\n` +
    `Guests: ${payload.persons}`
  );
  await loadOverview();
};

const updateCustomizeOrder = async (orderId) => {
  const params = new URLSearchParams();
  if (session?.id) params.set("customerId", String(session.id));
  if (session?.email) params.set("email", session.email);
  const formData = new FormData(updateModalForm);
  const payload = {
    occasion: String(formData.get("occasion") || "").trim(),
    weight: String(formData.get("weight") || "").trim(),
    requiredDate: String(formData.get("requiredDate") || "").trim(),
    paymentMethod: String(formData.get("paymentMethod") || "").trim(),
    contactNumber: String(formData.get("contactNumber") || "").trim(),
    layers: Number(String(formData.get("layers") || "1")),
    flavor: String(formData.get("flavor") || "").trim(),
    specifications: String(formData.get("specifications") || "").trim(),
    note: String(formData.get("note") || "").trim(),
    designPhotoUrl: String(formData.get("designPhotoUrl") || "").trim()
  };

  const res = await fetch(`${apiBase}/api/customers/customize-orders/${orderId}?${params.toString()}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    window.alert(data.message || "Update failed.");
    return;
  }
  await loadOverview();
};

const requestCustomizeAction = async (orderId, type) => {
  const params = new URLSearchParams();
  if (session?.id) params.set("customerId", String(session.id));
  if (session?.email) params.set("email", session.email);
  if (type === "update") {
    const note = createNoteFromForm();
    if (!note) return;
    params.set("note", note);
  }

  const suffix = type === "update" ? "update-request" : "cancel-request";
  const res = await fetch(`${apiBase}/api/customers/customize-orders/${orderId}/${suffix}?${params.toString()}`, { method: "PATCH" });
  const data = await res.json();
  if (!res.ok || !data.success) {
    window.alert(data.message || "Request failed.");
    return;
  }
  await loadOverview();
};

const loadOverview = async () => {
  const params = new URLSearchParams();
  if (session?.id) params.set("customerId", String(session.id));
  if (session?.email) params.set("email", session.email);
  if (session?.phone) params.set("phone", session.phone);

  const res = await fetch(`${apiBase}/api/customers/account-overview?${params.toString()}`);
  const data = await res.json();
  if (!res.ok || !data.success) return;
  cachedOverview = {
    orders: data.orders || [],
    reservations: data.reservations || [],
    customizeOrders: data.customizeOrders || []
  };

  const pendingOrders = (data.orders || []).filter((order) => {
    const status = String(order.orderStatus || "").toLowerCase();
    return status === "pending" || status === "requested_to_cancel";
  });
  const successfulOrders = (data.orders || []).filter((order) => String(order.orderStatus || "").toLowerCase() === "successful");

  ordersPendingList.innerHTML = pendingOrders.length
    ? pendingOrders.map((order) => `
      <article class="item">
        <div class="item-head">
          <strong>Order #${order.id}</strong>
          <span class="pill ${statusClass(order.orderStatus)}">${displayStatus(order)}</span>
        </div>
        <p>Name: ${order.customerName || "-"}</p>
        <p>Email: ${order.customerEmail || "-"}</p>
        <p>Phone: ${order.customerPhone || "-"}</p>
        <p>Address: ${order.customerAddress || "-"}</p>
        <p>Items:<br>${renderOrderItems(order.orderItems)}</p>
        <p>Total: Rs. ${Number(order.total || 0).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p>Pickup: ${order.pickupDate || "-"} ${order.pickupTime || ""}</p>
        <p>Payment: ${order.paymentMethod || "-"}</p>
        <div class="item-actions">
          ${String(order.orderStatus || "").toLowerCase() === "requested_to_cancel" ? "" : `<button type="button" data-order-update="${order.id}">Update Order</button>`}
          ${!order.cancelRequested
            ? `<button type="button" class="btn-secondary" data-order-cancel="${order.id}">Request Cancel</button>`
            : ""}
        </div>
      </article>
    `).join("")
    : `<p class="muted">No pending orders found.</p>`;

  ordersSuccessfulList.innerHTML = successfulOrders.length
    ? successfulOrders.map((order) => `
      <article class="item">
        <div class="item-head">
          <strong>Order #${order.id}</strong>
          <span class="pill ${statusClass(order.orderStatus)}">${displayStatus(order)}</span>
        </div>
        <p>Name: ${order.customerName || "-"}</p>
        <p>Email: ${order.customerEmail || "-"}</p>
        <p>Phone: ${order.customerPhone || "-"}</p>
        <p>Address: ${order.customerAddress || "-"}</p>
        <p>Items:<br>${renderOrderItems(order.orderItems)}</p>
        <p>Total: Rs. ${Number(order.total || 0).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p>Pickup: ${order.pickupDate || "-"} ${order.pickupTime || ""}</p>
        <p>Payment: ${order.paymentMethod || "-"}</p>
      </article>
    `).join("")
    : `<p class="muted">No successful orders found.</p>`;

  reservationsList.innerHTML = (data.reservations || []).length
    ? data.reservations.map((item) => `
      <article class="item">
        <div class="item-head">
          <strong>Reservation #${item.id}</strong>
          <span class="pill ${statusClass(item.reservationStatus || "Pending")}">${displayStatus(item)}</span>
        </div>
        <p>${item.reservationDate || "-"} at ${item.reservationTime || "-"}</p>
        <p>Email: ${item.email || "-"}</p>
        <p>Guests: ${item.persons || 0}</p>
        ${item.cancelRequested ? "<p>Cancel request: Submitted</p>" : ""}
        <div class="item-actions">
          ${String(item.reservationStatus || "Pending").toLowerCase() === "pending" ? `<button type="button" data-reservation-update="${item.id}">Update Reservation</button>` : ""}
          ${String(item.reservationStatus || "Pending").toLowerCase() === "pending" && !item.cancelRequested
            ? `<button type="button" class="btn-secondary" data-reservation-cancel="${item.id}">Request Cancel</button>`
            : ""}
        </div>
      </article>
    `).join("")
    : `<p class="muted">No reservations found for your phone number or email.</p>`;

  const pendingCustomize = (data.customizeOrders || []).filter((item) => {
    const status = String(item.orderStatus || "").toLowerCase();
    return status === "pending" || status === "pending_review" || status === "requested_to_cancel";
  });
  const successfulCustomize = (data.customizeOrders || []).filter((item) => String(item.orderStatus || "").toLowerCase() === "successful");
  const cancelledCustomize = (data.customizeOrders || []).filter((item) => String(item.orderStatus || "").toLowerCase() === "cancelled");

  customizePendingList.innerHTML = pendingCustomize.length
    ? pendingCustomize.map((item) => `
      <article class="item">
        <div class="item-head">
          <strong>Customize Order #${item.id}</strong>
          <span class="pill ${statusClass(item.orderStatus || "Pending")}">${displayStatus(item)}</span>
        </div>
        <p>Occasion: ${item.occasion || "-"}</p>
        <p>Flavor: ${item.flavor || "-"} | Weight: ${item.weight || "-"} | Layers: ${item.layers || "-"}</p>
        <p>Required Date: ${item.requiredDate || "-"}</p>
        <p>Payment: ${item.paymentMethod || "-"}</p>
        <p>Contact: ${item.contactNumber || "-"}</p>
        <p>Specifications: ${item.specifications || "-"}</p>
        <p>Note: ${item.note || "-"}</p>
        <div class="item-actions">
          ${String(item.orderStatus || "").toLowerCase() === "requested_to_cancel" ? "" : `<button type="button" data-customize-update="${item.id}">Update Order</button>`}
          ${!item.cancelRequested
            ? `<button type="button" class="btn-secondary" data-customize-cancel="${item.id}">Request Cancel</button>`
            : ""}
        </div>
      </article>
    `).join("")
    : `<p class="muted">No pending customize orders found.</p>`;

  customizeSuccessfulList.innerHTML = successfulCustomize.length
    ? successfulCustomize.map((item) => `
      <article class="item">
        <div class="item-head">
          <strong>Customize Order #${item.id}</strong>
          <span class="pill ${statusClass(item.orderStatus || "Successful")}">${displayStatus(item)}</span>
        </div>
        <p>Occasion: ${item.occasion || "-"}</p>
        <p>Flavor: ${item.flavor || "-"} | Weight: ${item.weight || "-"} | Layers: ${item.layers || "-"}</p>
        <p>Required Date: ${item.requiredDate || "-"}</p>
        <p>Payment: ${item.paymentMethod || "-"}</p>
        <p>Contact: ${item.contactNumber || "-"}</p>
        <p>Specifications: ${item.specifications || "-"}</p>
        <p>Note: ${item.note || "-"}</p>
      </article>
    `).join("")
    : `<p class="muted">No successful customize orders found.</p>`;

  customizeCancelledList.innerHTML = cancelledCustomize.length
    ? cancelledCustomize.map((item) => `
      <article class="item">
        <div class="item-head">
          <strong>Customize Order #${item.id}</strong>
          <span class="pill ${statusClass(item.orderStatus || "Cancelled")}">${displayStatus(item)}</span>
        </div>
        <p>Occasion: ${item.occasion || "-"}</p>
        <p>Flavor: ${item.flavor || "-"} | Weight: ${item.weight || "-"} | Layers: ${item.layers || "-"}</p>
        <p>Required Date: ${item.requiredDate || "-"}</p>
        <p>Payment: ${item.paymentMethod || "-"}</p>
        <p>Contact: ${item.contactNumber || "-"}</p>
        <p>Specifications: ${item.specifications || "-"}</p>
        <p>Note: ${item.note || "-"}</p>
      </article>
    `).join("")
    : `<p class="muted">No cancelled customize orders found.</p>`;

  ordersPendingList.querySelectorAll("[data-order-update]").forEach((button) => {
    button.addEventListener("click", async () => {
      const orderId = button.dataset.orderUpdate;
      const order = cachedOverview.orders.find((x) => String(x.id) === String(orderId));
      if (!order) return;
      openUpdateModal({
        title: `Update Order #${orderId}`,
        copy: "Edit the details you need to change, then submit your request.",
        submitText: "Update Order",
        fields: [
          { name: "customerName", label: "Customer Name", value: order.customerName || "", readonly: true },
          { name: "customerEmail", label: "Customer Email", value: order.customerEmail || "", readonly: true },
          { name: "customerPhone", label: "Customer Phone", value: order.customerPhone || "", required: true },
          { name: "customerAddress", label: "Customer Address", value: order.customerAddress || "", readonly: true },
          { name: "orderItems", label: "Order Items", type: "textarea", value: formatOrderItemsText(order.orderItems), readonly: true },
          { name: "orderTotal", label: "Order Total", value: `Rs. ${Number(order.total || 0).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, readonly: true },
          {
            name: "quantity",
            label: "Quantity",
            type: "select",
            value: String(getOrderQuantity(order.orderItems)),
            required: true,
            options: Array.from({ length: 20 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }))
          },
          { name: "pickupDate", label: "Pickup Date", type: "date", value: order.pickupDate || "", required: true },
          {
            name: "pickupTime",
            label: "Pickup Time",
            type: "select",
            value: order.pickupTime || "",
            required: true,
            options: (() => {
              const slots = [...pickupSlots];
              if (order.pickupTime && !slots.includes(order.pickupTime)) slots.unshift(order.pickupTime);
              return slots.map((slot) => ({ value: slot, label: slot }));
            })()
          },
          {
            name: "paymentMethod",
            label: "Payment Method",
            type: "select",
            value: order.paymentMethod || paymentMethods[0],
            required: true,
            options: paymentMethods.map((method) => ({ value: method, label: method }))
          },
        ],
        onOpen: () => {
          const qtySelect = updateModalForm.querySelector('select[name="quantity"]');
          const totalInput = updateModalForm.querySelector('input[name="orderTotal"]');
          const baseQty = getOrderQuantity(order.orderItems);
          const baseTotal = Number(order.total || 0);
          const updateTotalPreview = () => {
            const nextQty = Number(qtySelect?.value || baseQty || 1);
            const total = baseQty > 0 ? (baseTotal / baseQty) * nextQty : baseTotal;
            if (totalInput) {
              totalInput.value = `Rs. ${Number(total).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            }
          };
          if (qtySelect) {
            qtySelect.addEventListener("change", updateTotalPreview);
            updateTotalPreview();
          }
        },
        onSubmit: async () => {
          const sure = window.confirm("Are you sure you want to update this order?");
          if (!sure) return;
          await updateOrder(orderId);
          closeUpdateModal();
        }
      });
    });
  });
  ordersPendingList.querySelectorAll("[data-order-cancel]").forEach((button) => {
    button.addEventListener("click", async () => {
      const sure = window.confirm("Are you sure about cancelling this order?");
      if (!sure) return;
      await requestOrderAction(button.dataset.orderCancel, "cancel");
    });
  });
  reservationsList.querySelectorAll("[data-reservation-update]").forEach((button) => {
    button.addEventListener("click", async () => {
      const reservationId = button.dataset.reservationUpdate;
      const reservation = cachedOverview.reservations.find((x) => String(x.id) === String(reservationId));
      if (!reservation) return;
      openUpdateModal({
        title: `Update Reservation #${reservationId}`,
        copy: "Update reservation details below.",
        submitText: "Update Reservation",
        fields: [
          { name: "reservationDate", label: "Reservation Date", type: "date", value: reservation.reservationDate || "", required: true },
          {
            name: "reservationTime",
            label: "Reservation Time",
            type: "select",
            value: reservation.reservationTime || "18:00",
            required: true,
            options: (() => {
              const slots = [...pickupSlots];
              if (reservation.reservationTime && !slots.includes(reservation.reservationTime)) slots.unshift(reservation.reservationTime);
              return slots.map((slot) => ({ value: slot, label: slot }));
            })()
          },
          {
            name: "persons",
            label: "Guests",
            type: "select",
            value: String(reservation.persons || 2),
            required: true,
            options: Array.from({ length: 20 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }))
          }
        ],
        onSubmit: async () => {
          const sure = window.confirm("Are you sure you want to update this reservation?");
          if (!sure) return;
          await updateReservation(reservationId);
          closeUpdateModal();
        }
      });
    });
  });
  reservationsList.querySelectorAll("[data-reservation-cancel]").forEach((button) => {
    button.addEventListener("click", async () => {
      const sure = window.confirm("Are you sure about cancelling this reservation?");
      if (!sure) return;
      await requestReservationAction(button.dataset.reservationCancel, "cancel");
    });
  });
  customizePendingList.querySelectorAll("[data-customize-update]").forEach((button) => {
    button.addEventListener("click", async () => {
      const customizeId = button.dataset.customizeUpdate;
      const custom = cachedOverview.customizeOrders.find((x) => String(x.id) === String(customizeId));
      if (!custom) return;
      openUpdateModal({
        title: `Update Customize Order #${customizeId}`,
        copy: "Edit your customize details and submit your update request.",
        submitText: "Update Order",
        fields: [
          { name: "occasion", label: "Occasion", value: custom.occasion || "", required: true },
          { name: "flavor", label: "Flavor", value: custom.flavor || "", required: true },
          { name: "weight", label: "Weight", value: custom.weight || "", required: true },
          { name: "requiredDate", label: "Required Date", type: "date", value: custom.requiredDate || "", required: true },
          { name: "paymentMethod", label: "Payment Method", value: custom.paymentMethod || "", required: true },
          { name: "contactNumber", label: "Contact Number", value: custom.contactNumber || "", required: true },
          { name: "layers", label: "Layers", type: "number", value: custom.layers || 1, required: true },
          { name: "designPhotoUrl", label: "Design Photo URL", value: custom.designPhotoUrl || "", required: false },
          { name: "specifications", label: "Specifications", type: "textarea", value: custom.specifications || "", required: false },
          { name: "note", label: "Note", type: "textarea", value: custom.note || "", required: false }
        ],
        onSubmit: async () => {
          const sure = window.confirm("Are you sure you want to update this customize order?");
          if (!sure) return;
          await updateCustomizeOrder(customizeId);
          closeUpdateModal();
        }
      });
    });
  });
  customizePendingList.querySelectorAll("[data-customize-cancel]").forEach((button) => {
    button.addEventListener("click", async () => {
      const sure = window.confirm("Are you sure about cancelling this customize order?");
      if (!sure) return;
      await requestCustomizeAction(button.dataset.customizeCancel, "cancel");
    });
  });
};

const loadReviews = async () => {
  if (!session?.id) return;
  const res = await fetch(`${apiBase}/api/customers/reviews?customerId=${encodeURIComponent(session.id)}`);
  const rows = await res.json();
  reviewsList.innerHTML = rows.length ? rows.map((r) => `
    <article class="item">
      <div class="item-head">
        <strong>Review #${r.id}</strong>
        <span class="pill ${r.hiddenByAdmin || r.autoHidden ? "cancelled" : "successful"}">${r.hiddenByAdmin ? "Hidden By Admin" : (r.autoHidden ? "Hidden (3 Dislikes)" : "Visible")}</span>
      </div>
      <p>${escapeHtml(r.reviewText || "")}</p>
      <p>Likes: ${r.likesCount || 0} | Dislikes: ${r.dislikesCount || 0}</p>
      <div class="item-actions">
        <button type="button" data-edit-review="${r.id}" data-review-text="${escapeHtml(r.reviewText || "")}">Edit</button>
        <button type="button" class="btn-secondary" data-delete-review="${r.id}">Delete</button>
      </div>
    </article>
  `).join("") : `<p class="muted">No reviews yet.</p>`;

  reviewsList.querySelectorAll("[data-edit-review]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.getElementById("reviewId").value = btn.dataset.editReview;
      document.getElementById("reviewText").value = btn.dataset.reviewText
        .replaceAll("&lt;", "<")
        .replaceAll("&gt;", ">")
        .replaceAll("&amp;", "&")
        .replaceAll("&#039;", "'")
        .replaceAll("&quot;", "\"");
      setActiveTab("reviews");
    });
  });

  reviewsList.querySelectorAll("[data-delete-review]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const reviewId = btn.dataset.deleteReview;
      const sure = window.confirm("Are you sure you want to delete this review?");
      if (!sure) return;
      const res = await fetch(`${apiBase}/api/customers/reviews/${reviewId}?customerId=${encodeURIComponent(session.id)}`, {
        method: "DELETE"
      });
      const text = await res.text();
      if (!res.ok) {
        try {
          const err = JSON.parse(text);
          showStatus(reviewStatus, err.message || "Review delete failed.", true);
        } catch {
          showStatus(reviewStatus, "Review delete failed.", true);
        }
        return;
      }
      showStatus(reviewStatus, "Review deleted.");
      if (document.getElementById("reviewId").value === String(reviewId)) {
        reviewForm.reset();
        document.getElementById("reviewId").value = "";
      }
      await loadReviews();
    });
  });
};

profileForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  showStatus(profileStatus, "");

  const payload = {
    customerId: session.id,
    name: document.getElementById("name").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    address: document.getElementById("address").value.trim()
  };

  try {
    const res = await fetch(`${apiBase}/api/customers/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      showStatus(profileStatus, data.message || "Update failed.", true);
      return;
    }
    localStorage.setItem(sessionKey, JSON.stringify({ ...session, ...data.customer, loggedIn: true }));
    showStatus(profileStatus, "Profile updated successfully.");
  } catch (err) {
    showStatus(profileStatus, "Server unavailable. Please try again.", true);
  }
});

passwordForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  showStatus(passwordStatus, "");

  const payload = {
    customerId: session.id,
    currentPassword: document.getElementById("currentPassword").value,
    newPassword: document.getElementById("newPassword").value,
    confirmPassword: document.getElementById("confirmPassword").value
  };

  try {
    const res = await fetch(`${apiBase}/api/customers/password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      showStatus(passwordStatus, data.message || "Password update failed.", true);
      return;
    }
    passwordForm.reset();
    showStatus(passwordStatus, "Password updated successfully.");
  } catch (err) {
    showStatus(passwordStatus, "Server unavailable. Please try again.", true);
  }
});

window.addEventListener("DOMContentLoaded", async () => {
  setActiveTab("orders");
  await loadOverview();
  await loadReviews();
});

if (reviewForm) {
  reviewForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const reviewId = document.getElementById("reviewId").value.trim();
    const payload = {
      customerId: session.id,
      customerName: session.name || "",
      customerEmail: session.email || "",
      reviewText: document.getElementById("reviewText").value.trim()
    };
    const url = reviewId ? `${apiBase}/api/customers/reviews/${reviewId}` : `${apiBase}/api/customers/reviews`;
    const method = reviewId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const text = await res.text();
    if (!res.ok) {
      try {
        const err = JSON.parse(text);
        showStatus(reviewStatus, err.message || "Review save failed.", true);
      } catch {
        showStatus(reviewStatus, "Review save failed.", true);
      }
      return;
    }
    reviewForm.reset();
    document.getElementById("reviewId").value = "";
    showStatus(reviewStatus, reviewId ? "Review updated." : "Review added.");
    await loadReviews();
  });
}

if (updateModalCancel) {
  updateModalCancel.addEventListener("click", closeUpdateModal);
}
if (updateModalSubmit) {
  updateModalSubmit.addEventListener("click", async () => {
    if (updateModalForm && !updateModalForm.reportValidity()) return;
    if (!currentUpdateHandler) return;
    await currentUpdateHandler();
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem(sessionKey);
    window.location.href = "./index.html";
  });
}
