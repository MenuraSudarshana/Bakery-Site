const sessionKey = "bakery_customer_session";
const apiBase = "http://localhost:8080";

const form = document.getElementById("customCakeForm");
const statusMessage = document.getElementById("statusMessage");

const parseSession = () => {
  try {
    return JSON.parse(localStorage.getItem(sessionKey) || "null");
  } catch (e) {
    return null;
  }
};

const session = parseSession();
if (!session?.loggedIn) {
  window.location.href = "./login.html?next=./customize-cake.html";
}

const showStatus = (text, isError = false) => {
  statusMessage.textContent = text;
  statusMessage.classList.toggle("error", isError);
};

const toBase64DataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(new Error("Unable to read file."));
    reader.readAsDataURL(file);
  });

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  showStatus("");

  const designPhotoUrl = document.getElementById("designPhotoUrl").value.trim();
  const designPhotoFile = document.getElementById("designPhotoFile").files?.[0] || null;

  if (!designPhotoUrl && !designPhotoFile) {
    showStatus("Please add a design image URL or upload a design photo.", true);
    return;
  }

  let designPhotoValue = designPhotoUrl;
  if (designPhotoFile) {
    try {
      designPhotoValue = await toBase64DataUrl(designPhotoFile);
    } catch (e) {
      showStatus("Unable to read selected photo.", true);
      return;
    }
  }

  const payload = {
    customerId: session?.id,
    customerName: session?.name || "",
    customerEmail: session?.email || "",
    occasion: document.getElementById("occasion").value.trim(),
    weight: document.getElementById("weight").value.trim(),
    requiredDate: document.getElementById("requiredDate").value,
    paymentMethod: document.getElementById("paymentMethod").value,
    contactNumber: document.getElementById("contactNumber").value.trim(),
    layers: Number(document.getElementById("layers").value || "1"),
    flavor: document.getElementById("flavor").value.trim(),
    designPhotoUrl: designPhotoValue,
    specifications: document.getElementById("specifications").value.trim(),
    note: document.getElementById("note").value.trim()
  };

  if (!payload.occasion || !payload.weight || !payload.requiredDate || !payload.paymentMethod || !payload.contactNumber) {
    showStatus("Please fill all required fields.", true);
    return;
  }

  try {
    const res = await fetch(`${apiBase}/api/customize-cake-orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await res.text();

    if (result === "SUCCESS") {
      form.reset();
      document.getElementById("layers").value = 1;
      showStatus("Order confirmation sent successfully. Our team will contact you as soon as possible.");
      return;
    }

    if (result === "CUSTOMER_REQUIRED") {
      showStatus("Customer login details are missing. Please login again.", true);
      return;
    }
    if (result === "IMAGE_REQUIRED") {
      showStatus("Please add a design image URL or upload a design photo.", true);
      return;
    }
    if (result === "INVALID") {
      showStatus("Please fill all required fields correctly.", true);
      return;
    }

    showStatus("Unable to submit order. Please try again.", true);
  } catch (e) {
    showStatus("Unable to submit now. Please try again.", true);
  }
});
