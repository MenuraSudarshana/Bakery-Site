const form = document.getElementById("adminLoginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const showPasswordInput = document.getElementById("showPassword");
const statusMessage = document.getElementById("statusMessage");
const adminSessionKey = "bakery_admin_session";

const setStatus = (message, isError = false) => {
  statusMessage.textContent = message;
  statusMessage.classList.toggle("error", isError);
};

showPasswordInput.addEventListener("change", () => {
  passwordInput.type = showPasswordInput.checked ? "text" : "password";
});

window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem(adminSessionKey) === "1") {
    window.location.href = "./admin.html";
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  setStatus("");

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!username || !password) {
    setStatus("Please enter username and password.", true);
    return;
  }

  try {
    setStatus("Checking login...");

    const response = await fetch("http://localhost:8080/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const result = (await response.text()).trim();

    if (response.ok && result === "SUCCESS") {
      setStatus("Login successful. Opening admin panel...");
      localStorage.setItem(adminSessionKey, "1");
      window.setTimeout(() => {
        window.open("./admin.html", "_blank");
      }, 300);
      return;
    }

    setStatus("Invalid username or password.", true);
  } catch (error) {
    setStatus("Server connection failed. Please try again.", true);
  }
});
