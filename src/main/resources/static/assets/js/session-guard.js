(function () {
  const cartStorageKey = "bakery_cart";
  const cartActivityKey = "bakery_cart_last_activity";
  const timeoutMs = 30 * 60 * 1000;

  const parseJson = (value, fallback) => {
    try {
      return JSON.parse(value);
    } catch (e) {
      return fallback;
    }
  };

  const cart = parseJson(localStorage.getItem(cartStorageKey), []);
  const now = Date.now();
  const lastActivityRaw = localStorage.getItem(cartActivityKey);
  const lastActivity = lastActivityRaw ? Number(lastActivityRaw) : NaN;

  const clearExpiredCart = () => {
    localStorage.removeItem(cartStorageKey);
    localStorage.removeItem(cartActivityKey);
  };

  if (!Array.isArray(cart) || cart.length === 0) {
    return;
  }

  if (Number.isNaN(lastActivity)) {
    localStorage.setItem(cartActivityKey, String(now));
    return;
  }

  if (now - lastActivity > timeoutMs) {
    clearExpiredCart();
  }
})();
