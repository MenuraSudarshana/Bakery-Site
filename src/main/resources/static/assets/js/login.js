const customerForm = document.getElementById("customer-form");
const loginTab = document.getElementById("login-tab");
const signupTab = document.getElementById("signup-tab");
const submitButton = document.getElementById("submit-btn");
const formEyebrow = document.getElementById("form-eyebrow");
const formTitle = document.getElementById("form-title");
const formCopy = document.getElementById("form-copy");
const statusMessage = document.getElementById("status-message");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const addressInput = document.getElementById("address");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");
const rememberMeInput = document.getElementById("remember-me");

const togglePasswordButton = document.getElementById("toggle-password");
const toggleConfirmPasswordButton = document.getElementById("toggle-confirm-password");

const customerStorageKey = "bakery_customer_session";
const params = new URLSearchParams(window.location.search);
const nextUrlRaw = params.get("next") || "./customer-account.html";
const nextUrl = nextUrlRaw.includes("login.html") ? "./customer-account.html" : nextUrlRaw;
const apiBaseUrl = "http://localhost:8080";

const errorElements = {
  name: document.getElementById("name-error"),
  email: document.getElementById("email-error"),
  phone: document.getElementById("phone-error"),
  address: document.getElementById("address-error"),
  password: document.getElementById("password-error"),
  confirmPassword: document.getElementById("confirm-password-error")
};

const signupOnlyFields = document.querySelectorAll(".signup-only");

const state = {
  mode: "login"
};

const setStatus = (message, isError = false) => {
  statusMessage.textContent = message;
  statusMessage.classList.toggle("error", isError);
};

const clearErrors = () => {
  Object.values(errorElements).forEach((errorElement) => {
    errorElement.textContent = "";
  });

  [nameInput, emailInput, phoneInput, addressInput, passwordInput, confirmPasswordInput].forEach((input) => {
    if (input) {
      input.setAttribute("aria-invalid", "false");
    }
  });

  setStatus("", false);
};

const setFieldError = (input, errorElement, message) => {
  errorElement.textContent = message;
  input.setAttribute("aria-invalid", message ? "true" : "false");
};

const validateEmail = (value) => /\S+@\S+\.\S+/.test(value);
const validatePhone = (value) => /^\d{10}$/.test(value);

const resetSignupFields = () => {
  nameInput.value = "";
  phoneInput.value = "";
  addressInput.value = "";
  confirmPasswordInput.value = "";
};

const applyMode = () => {
  const isSignup = state.mode === "signup";

  signupOnlyFields.forEach((field) => field.classList.toggle("is-hidden", !isSignup));
  loginTab.classList.toggle("active", !isSignup);
  signupTab.classList.toggle("active", isSignup);

  formEyebrow.textContent = isSignup ? "New Customer" : "Welcome Back";
  formTitle.textContent = isSignup ? "Create your customer account" : "Login to continue";
  formCopy.textContent = isSignup
    ? "Fill every field correctly, then save your account before checkout."
    : "Enter your customer account details below.";
  submitButton.textContent = isSignup ? "Create Account" : "Login and Continue";

  passwordInput.setAttribute("autocomplete", isSignup ? "new-password" : "current-password");

  clearErrors();
};

const validateLogin = () => {
  let isValid = true;

  if (!emailInput.value.trim()) {
    setFieldError(emailInput, errorElements.email, "Please enter your email address.");
    isValid = false;
  } else if (!validateEmail(emailInput.value.trim())) {
    setFieldError(emailInput, errorElements.email, "Please enter a valid email address.");
    isValid = false;
  }

  if (!passwordInput.value.trim()) {
    setFieldError(passwordInput, errorElements.password, "Please enter your password.");
    isValid = false;
  }

  return isValid;
};

const validateSignup = () => {
  let isValid = true;

  if (!nameInput.value.trim()) {
    setFieldError(nameInput, errorElements.name, "Please enter your full name.");
    isValid = false;
  }

  if (!emailInput.value.trim()) {
    setFieldError(emailInput, errorElements.email, "Please enter your email address.");
    isValid = false;
  } else if (!validateEmail(emailInput.value.trim())) {
    setFieldError(emailInput, errorElements.email, "Please enter a valid email address.");
    isValid = false;
  }

  if (!phoneInput.value.trim()) {
    setFieldError(phoneInput, errorElements.phone, "Please enter your phone number.");
    isValid = false;
  } else if (!validatePhone(phoneInput.value.trim())) {
    setFieldError(phoneInput, errorElements.phone, "Phone number must contain exactly 10 digits.");
    isValid = false;
  }

  if (!addressInput.value.trim()) {
    setFieldError(addressInput, errorElements.address, "Please enter your address.");
    isValid = false;
  }

  if (!passwordInput.value.trim()) {
    setFieldError(passwordInput, errorElements.password, "Please enter your password.");
    isValid = false;
  } else if (passwordInput.value.trim().length < 6) {
    setFieldError(passwordInput, errorElements.password, "Password must be at least 6 characters.");
    isValid = false;
  }

  if (!confirmPasswordInput.value.trim()) {
    setFieldError(confirmPasswordInput, errorElements.confirmPassword, "Please confirm your password.");
    isValid = false;
  } else if (passwordInput.value !== confirmPasswordInput.value) {
    setFieldError(confirmPasswordInput, errorElements.confirmPassword, "Passwords do not match.");
    isValid = false;
  }

  return isValid;
};

const saveCustomerSession = (customer) => {
  const session = {
    ...customer,
    loggedIn: true,
    rememberMe: rememberMeInput.checked,
    loginTime: new Date().toISOString()
  };

  localStorage.setItem(customerStorageKey, JSON.stringify(session));
};

const togglePassword = (input, button) => {
  const showPassword = input.type === "password";
  input.type = showPassword ? "text" : "password";
  button.textContent = showPassword ? "Hide" : "Show";
};

loginTab.addEventListener("click", () => {
  state.mode = "login";
  resetSignupFields();
  applyMode();
});

signupTab.addEventListener("click", () => {
  state.mode = "signup";
  applyMode();
});

togglePasswordButton.addEventListener("click", () => {
  togglePassword(passwordInput, togglePasswordButton);
});

toggleConfirmPasswordButton.addEventListener("click", () => {
  togglePassword(confirmPasswordInput, toggleConfirmPasswordButton);
});

phoneInput.addEventListener("input", () => {
  phoneInput.value = phoneInput.value.replace(/\D/g, "").slice(0, 10);
});

customerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearErrors();

  const isSignup = state.mode === "signup";
  const valid = isSignup ? validateSignup() : validateLogin();

  if (!valid) {
    setStatus("Please fix the highlighted fields and try again.", true);
    return;
  }

  const endpoint = isSignup
    ? `${apiBaseUrl}/api/customers/register`
    : `${apiBaseUrl}/api/customers/login`;
  const payload = isSignup
    ? {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        address: addressInput.value.trim(),
        password: passwordInput.value,
        confirmPassword: confirmPasswordInput.value
      }
    : {
        email: emailInput.value.trim(),
        password: passwordInput.value
      };

  try {
    submitButton.disabled = true;
    setStatus(isSignup ? "Creating your account..." : "Signing you in...");

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      setStatus(data.message || "Something went wrong. Please try again.", true);
      return;
    }

    if (isSignup) {
      state.mode = "login";
      passwordInput.value = "";
      confirmPasswordInput.value = "";
      applyMode();
      emailInput.value = data.customer.email;
      setStatus("Account created successfully. You can now login with your email and password.");
      return;
    }

    saveCustomerSession(data.customer);
    setStatus("Login successful. Redirecting...");

    window.setTimeout(() => {
      window.location.replace(nextUrl);
    }, 700);
  } catch (error) {
    setStatus("Unable to connect to the server right now. Please try again.", true);
  } finally {
    submitButton.disabled = false;
  }
});

window.addEventListener("DOMContentLoaded", () => {
  applyMode();

  const existingSession = JSON.parse(localStorage.getItem(customerStorageKey) || "null");

  if (existingSession?.loggedIn) {
    setStatus("You are already logged in. Redirecting...");

    window.setTimeout(() => {
      window.location.replace(nextUrl);
    }, 500);
  }
});
