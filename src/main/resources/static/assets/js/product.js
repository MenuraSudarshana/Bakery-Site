const params = new URLSearchParams(window.location.search);
const requestedId = params.get("id") || "1";
const apiBaseUrl = "http://localhost:8080";

const products = {
  "1": {
    name: "Orange White Choco-Chip Gateau",
    badge: "Best Seller",
    category: "Signature Cake",
    rating: "4.8",
    basePrice: 2000,
    image: "./assets/images/product-1.png",
    gallery: [
      "./assets/images/product-1.png",
      "./assets/images/orange 1.png",
      "./assets/images/orange 2.png",
      "./assets/images/orange 3.png"
    ],
    description: "A vibrant, zesty cake that blends the bright citrus flavor of oranges with smooth white chocolate chips, soft vanilla sponge, and silky cream for a fresh celebration centerpiece.",
    deliveryText: "Ready for pickup in 2 hours",
    weights: [
      { label: "500 g", price: 2000 },
      { label: "1 kg", price: 3800 },
      { label: "1.5 kg", price: 5600 }
    ],
    flavours: ["Orange", "Vanilla Orange", "Citrus Delight"],
    creams: ["Whippin Cream", "Butter Cream", "Cheese Cream"]
  },
  "2": {
    name: "Black Forest Gateuax",
    badge: "Seasonal",
    category: "Classic Gateau",
    rating: "4.8",
    basePrice: 5000,
    image: "./assets/images/Black-forest-Gateau.png",
    gallery: [
      "./assets/images/Black-forest-Gateau.png",
      "./assets/images/Black-forest-Gateau-1.png",
      "./assets/images/Black-forest-Gateau-2.png"
    ],
    description: "This delicious black forest gateau is layered with soft chocolate sponge, cherry syrup, whipped cream, and shaved chocolate for a rich celebration finish.",
    deliveryText: "Ready for pickup in 4 hours",
    weights: [
      { label: "500 g", price: 5000 },
      { label: "1 kg", price: 9200 },
      { label: "1.5 kg", price: 13600 }
    ],
    flavours: ["Black Forest", "Cherry Chocolate", "Classic Cocoa"],
    creams: ["Whippin Cream", "Chocolate Cream", "Butter Cream"]
  },
  "3": {
    name: "Red Velvet Cake",
    badge: "Rich Choice",
    category: "Velvet Cake",
    rating: "4.7",
    basePrice: 4000,
    image: "./assets/images/Red Velvet Cake 2.png",
    gallery: [
      "./assets/images/Red Velvet Cake 2.png",
      "./assets/images/Red Velvet Cake 1.png",
      "./assets/images/Red Velvet Cake 3.png"
    ],
    description: "A luscious blend of red velvet and chocolate base, topped with a striking half-red, half-white frosting design for birthdays and special gifts.",
    deliveryText: "Pickup slots available today",
    weights: [
      { label: "500 g", price: 4000 },
      { label: "1 kg", price: 7600 },
      { label: "1.5 kg", price: 11200 }
    ],
    flavours: ["Red Velvet", "Classic Velvet", "Chocolate Velvet"],
    creams: ["Cheese Cream", "Butter Cream", "Whippin Cream"]
  },
  "4": {
    name: "Blueberry Baked Cheesecake",
    badge: "Fresh Pick",
    category: "Cheesecake",
    rating: "4.9",
    basePrice: 5500,
    image: "./assets/images/Blueberry Baked Cheesecake.png",
    gallery: [
      "./assets/images/Blueberry Baked Cheesecake.png",
      "./assets/images/Blueberry Baked Cheesecake 2.png",
      "./assets/images/Blueberry Baked Cheesecake 3.png",
      "./assets/images/Blueberry Baked Cheesecake 4.png"
    ],
    description: "A silky-smooth baked cheesecake set on a crunchy biscuit base and finished with an elegant blueberry topping for a premium dessert experience.",
    deliveryText: "Pickup in 3 hours",
    weights: [
      { label: "500 g", price: 5500 },
      { label: "1 kg", price: 10400 },
      { label: "1.5 kg", price: 15300 }
    ],
    flavours: ["Blueberry", "Mixed Berry", "Vanilla Berry"],
    creams: ["Fresh Cream", "Whippin Cream", "Cheese Cream"]
  },
  "5": {
    name: "Chocalate Cake",
    badge: "Most Selling",
    category: "Chocolate Cake",
    rating: "4.8",
    basePrice: 4500,
    image: "./assets/images/Coffee-Chocolate-Gateau.png",
    gallery: [
      "./assets/images/Coffee-Chocolate-Gateau.png"
    ],
    description: "Delicious rich chocolate cake sandwiched with chocolate buttercream and covered with smooth chocolate ganache for a bold cocoa finish.",
    deliveryText: "Ready for pickup in 2.5 hours",
    weights: [
      { label: "500 g", price: 4500 },
      { label: "1 kg", price: 8500 },
      { label: "1.5 kg", price: 12600 }
    ],
    flavours: ["Milk Chocolate", "Dark Chocolate", "Mocha"],
    creams: ["Chocolate Cream", "Butter Cream", "Whippin Cream"]
  },
  "6": {
    name: "Marble Gateau",
    badge: "Customer Pick",
    category: "Gateau",
    rating: "4.6",
    basePrice: 3200,
    image: "./assets/images/Marble Gateau.png",
    gallery: [
      "./assets/images/Marble Gateau.png",
      "./assets/images/Marble Gateau 2.png"
    ],
    description: "A soft marble gateau with balanced vanilla and chocolate layers, finished in a simple bakery style that works well for family celebrations.",
    deliveryText: "Pickup in 2 hours",
    weights: [
      { label: "500 g", price: 3200 },
      { label: "1 kg", price: 6100 },
      { label: "1.5 kg", price: 9000 }
    ],
    flavours: ["Marble", "Vanilla Chocolate", "Classic Duo"],
    creams: ["Whippin Cream", "Butter Cream", "Chocolate Cream"]
  },
  "7": {
    name: "Chocolate Pineapple Gateau Slice",
    badge: "Top Rated",
    category: "Cake Slice",
    rating: "4.9",
    basePrice: 250,
    image: "./assets/images/Chocolate Pineapple Gateau Slice.png",
    gallery: [
      "./assets/images/Chocolate Pineapple Gateau Slice.png"
    ],
    description: "Rich chocolate and sweet pineapple slice.",
    deliveryText: "Ready for pickup today",
    weights: [
      { label: "1 Slice", price: 250 }
    ],
    flavours: ["Chocolate & Pineapple"],
    creams: ["Fresh Cream", "Chocolate Cream"]
  },
  "8": {
    name: "Coffee Chocolate Gateau Slice",
    badge: "Popular",
    category: "Cake Slice",
    rating: "4.8",
    basePrice: 250,
    image: "./assets/images/Coffee Chocolate Gateau Slice.png",
    gallery: [
      "./assets/images/Coffee Chocolate Gateau Slice.png"
    ],
    description: "Perfect blend of coffee and chocolate.",
    deliveryText: "Ready for pickup today",
    weights: [
      { label: "1 Slice", price: 250 }
    ],
    flavours: ["Chocolate & Coffee"],
    creams: ["Chocolate Cream", "Whippin Cream"]
  },
  "9": {
    name: "Mango Gateau Slice",
    badge: "Fresh Pick",
    category: "Cake Slice",
    rating: "4.8",
    basePrice: 250,
    image: "./assets/images/Mango Gateau Slice.png",
    gallery: [
      "./assets/images/Mango Gateau Slice.png"
    ],
    description: "Tropical mango flavored gateau slice.",
    deliveryText: "Ready for pickup today",
    weights: [
      { label: "1 Slice", price: 250 }
    ],
    flavours: ["Mango"],
    creams: ["Fresh Cream", "Whippin Cream"]
  },
  "10": {
    name: "Rose Gateau Slice",
    badge: "Delicate Choice",
    category: "Cake Slice",
    rating: "4.8",
    basePrice: 250,
    image: "./assets/images/Rose Gateau Slice.png",
    gallery: [
      "./assets/images/Rose Gateau Slice.png"
    ],
    description: "Floral rose and vanilla flavored slice.",
    deliveryText: "Ready for pickup today",
    weights: [
      { label: "1 Slice", price: 250 }
    ],
    flavours: ["Rose and Vanilla"],
    creams: ["Fresh Cream", "Butter Cream"]
  },
  "11": {
    name: "Swiss Roll",
    badge: "Classic Favorite",
    category: "Swiss Roll",
    rating: "4.7",
    basePrice: 4500,
    image: "./assets/images/Swiss-Roll.png",
    gallery: [
      "./assets/images/Swiss-Roll.png"
    ],
    description: "Rolled sponge cake with cream filling.",
    deliveryText: "Ready for pickup in 3 hours",
    weights: [
      { label: "1 Roll", price: 4500 }
    ],
    flavours: ["Chocolate / Vanilla"],
    creams: ["Fresh Cream", "Chocolate Cream"]
  },
  "12": {
    name: "Triple Treat Slice",
    badge: "Bakery Special",
    category: "Cake Slice",
    rating: "4.8",
    basePrice: 250,
    image: "./assets/images/Triple Treat Slice.png",
    gallery: [
      "./assets/images/Triple Treat Slice.png"
    ],
    description: "Three flavors in one delicious slice.",
    deliveryText: "Ready for pickup today",
    weights: [
      { label: "1 Slice", price: 250 }
    ],
    flavours: ["Strawberry, Vanilla & Chocolate"],
    creams: ["Fresh Cream", "Whippin Cream"]
  },
  "13": {
    name: "Butter Cake",
    badge: "Bakery Favorite",
    category: "Butter Cake",
    rating: "4.9",
    basePrice: 1100,
    image: "./assets/images/Butter-cake-1-1-1.png",
    gallery: [
      "./assets/images/Butter-cake-1-1-1.png"
    ],
    description: "Rich, buttery and moist vanilla cake.",
    deliveryText: "Ready for pickup today",
    weights: [
      { label: "1 Cake", price: 1100 }
    ],
    flavours: ["Vanilla"],
    creams: ["Butter Cream", "Whippin Cream"]
  },
  "14": {
    name: "Coffee Cake",
    badge: "Popular Pick",
    category: "Butter Cake",
    rating: "4.8",
    basePrice: 2000,
    image: "./assets/images/Coffee Cake.png",
    gallery: [
      "./assets/images/Coffee Cake.png"
    ],
    description: "Rich coffee flavored sponge cake.",
    deliveryText: "Ready for pickup today",
    weights: [
      { label: "1 Cake", price: 2000 }
    ],
    flavours: ["Coffee"],
    creams: ["Butter Cream", "Whippin Cream"]
  },
  "15": {
    name: "Disc Cake",
    badge: "Party Choice",
    category: "Butter Cake",
    rating: "4.3",
    basePrice: 2000,
    image: "./assets/images/Disc Cake.png",
    gallery: [
      "./assets/images/Disc Cake.png"
    ],
    description: "Round disc shaped cake for celebrations.",
    deliveryText: "Ready for pickup today",
    weights: [
      { label: "1 Cake", price: 2000 }
    ],
    flavours: ["Chocolate / Vanilla"],
    creams: ["Butter Cream", "Whippin Cream"]
  },
  "16": {
    name: "Disk Ribbon Cake Extra Large",
    badge: "Large Celebration",
    category: "Butter Cake",
    rating: "4.7",
    basePrice: 4600,
    image: "./assets/images/Disk-Ribbon-Cake-Extra-Large-1.png",
    gallery: [
      "./assets/images/Disk-Ribbon-Cake-Extra-Large-1.png"
    ],
    description: "Extra large ribbon disc cake for big celebrations.",
    deliveryText: "Ready for pickup in 3 hours",
    weights: [
      { label: "1 Cake", price: 4600 }
    ],
    flavours: ["Ribbon"],
    creams: ["Butter Cream", "Whippin Cream"]
  },
  "17": {
    name: "Ribbon Cake",
    badge: "Classic Pick",
    category: "Butter Cake",
    rating: "4.4",
    basePrice: 1500,
    image: "./assets/images/Ribbon Cake.png",
    gallery: [
      "./assets/images/Ribbon Cake.png"
    ],
    description: "Colorful layered ribbon cake.",
    deliveryText: "Ready for pickup today",
    weights: [
      { label: "1 Cake", price: 1500 }
    ],
    flavours: ["Ribbon"],
    creams: ["Butter Cream", "Whippin Cream"]
  },
  "18": {
    name: "Marble Cake",
    badge: "Everyday Choice",
    category: "Butter Cake",
    rating: "4.3",
    basePrice: 250,
    image: "./assets/images/Marble-Cake.png",
    gallery: [
      "./assets/images/Marble-Cake.png"
    ],
    description: "Swirled chocolate and vanilla marble cake.",
    deliveryText: "Ready for pickup today",
    weights: [
      { label: "1 Piece", price: 250 }
    ],
    flavours: ["Chocolate & Vanilla"],
    creams: ["Butter Cream", "Whippin Cream"]
  }
};

const addOns = [
  { name: "Birthday Cap", price: 380, image: "./assets/images/b-cap.png" },
  { name: "Birthday Candle", price: 120, image: "./assets/images/Birthday_candle.png" },
  { name: "Greeting Card", price: 200, image: "./assets/images/Greeting Card.png" }
];

const reviews = [
  {
    name: "Alpa Solanki",
    date: "January 24, 2025",
    rating: 4,
    text: "The orange flavor balances the sweetness well, and the cake looks premium enough for gifting."
  },
  {
    name: "Madhavi Perera",
    date: "February 07, 2025",
    rating: 5,
    text: "Very soft sponge, fresh cream, and the pickup process was fast. The custom message was neatly written."
  },
  {
    name: "Rashmi Fernando",
    date: "March 11, 2025",
    rating: 5,
    text: "The page layout made ordering easy. Weight selection, quantity, and add-ons were clear even on mobile."
  }
];

let product = products[requestedId] || products["1"];

const loadDynamicProduct = async () => {
  if (!String(requestedId).startsWith("db-")) return;
  const dbId = String(requestedId).replace("db-", "");
  try {
    const response = await fetch(`${apiBaseUrl}/api/products/public`);
    if (!response.ok) return;
    const all = await response.json();
    const found = all.find((item) => String(item.id) === String(dbId));
    if (!found) return;

    product = {
      name: found.name,
      badge: "New Product",
      category: found.category || "Cake",
      rating: Number(found.rating || 4.5).toFixed(1),
      basePrice: Number(found.price || 0),
      image: found.imageUrl,
      gallery: [found.imageUrl],
      description: found.description || "Fresh bakery product.",
      deliveryText: "Pickup slots available",
      weights: [{ label: "1 item", price: Number(found.price || 0) }],
      flavours: [found.flavour || "Classic"],
      creams: ["Bakery Cream"]
    };
  } catch (error) {
    // Fallback to static product when API is unavailable.
  }
};

const state = {
  quantity: 1,
  selectedWeightIndex: 0,
  addMessage: false,
  addOnQuantities: addOns.map(() => 0),
  favorite: false,
  relatedIndex: 0,
  cartItems: []
};

let relatedAutoSlideId;
const cartStorageKey = "bakery_cart";
const cartActivityKey = "bakery_cart_last_activity";

const formatPrice = (price) => `Rs. ${price.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const setText = (id, value) => {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value;
  }
};

const populateSelect = (selectId, values, formatter) => {
  const select = document.getElementById(selectId);
  if (!select) {
    return;
  }

  select.innerHTML = values
    .map((value, index) => `<option value="${index}">${formatter(value)}</option>`)
    .join("");
};

const renderGallery = () => {
  const galleryThumbs = document.getElementById("gallery-thumbs");
  const productImg = document.getElementById("product-img");

  productImg.src = product.gallery[0];
  productImg.alt = product.name;

  galleryThumbs.innerHTML = product.gallery
    .map(
      (image, index) => `
        <button class="thumb-btn ${index === 0 ? "active" : ""}" type="button" data-image="${image}">
          <img src="${image}" alt="${product.name} view ${index + 1}">
        </button>
      `
    )
    .join("");

  galleryThumbs.querySelectorAll(".thumb-btn").forEach((button) => {
    button.addEventListener("click", () => {
      productImg.src = button.dataset.image;
      galleryThumbs.querySelectorAll(".thumb-btn").forEach((thumb) => thumb.classList.remove("active"));
      button.classList.add("active");
    });
  });
};

const renderAddOns = () => {
  const addOnsGrid = document.getElementById("addons-grid");

  addOnsGrid.innerHTML = addOns
    .map(
      (item, index) => `
        <article class="addon-card">
          <img src="${item.image}" alt="${item.name}">
          <h3>${item.name}</h3>
          <div class="addon-meta">
            <span>Useful celebration add-on</span>
            <strong>${formatPrice(item.price)}</strong>
          </div>
          <div class="addon-controls">
            <div class="mini-qty">
              <button type="button" data-addon-index="${index}" data-addon-action="decrease">-</button>
              <span id="addon-qty-${index}">0</span>
              <button type="button" data-addon-index="${index}" data-addon-action="increase">+</button>
            </div>
            <button class="addon-cta" type="button">Add</button>
          </div>
        </article>
      `
    )
    .join("");

  addOnsGrid.querySelectorAll("[data-addon-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.addonIndex);
      const action = button.dataset.addonAction;

      if (action === "increase") {
        state.addOnQuantities[index] += 1;
      } else {
        state.addOnQuantities[index] = Math.max(0, state.addOnQuantities[index] - 1);
      }

      document.getElementById(`addon-qty-${index}`).textContent = state.addOnQuantities[index];
      updateEstimatedTotal();
    });
  });
};

const renderRelatedProducts = () => {
  const relatedGrid = document.getElementById("related-grid");
  const relatedProducts = Object.entries(products).filter(([id]) => id !== requestedId);

  relatedGrid.innerHTML = relatedProducts
    .map(
      ([id, item]) => `
        <article class="related-card">
          <img src="${item.image}" alt="${item.name}">
          <div class="related-content">
            <h3>${item.name}</h3>
            <div class="related-meta">
              <strong>${formatPrice(item.weights[0].price)}</strong>
              <span>${item.rating} / 5</span>
            </div>
            <p>${item.category}</p>
            <a class="related-link" href="./product.html?id=${id}">View Details</a>
          </div>
        </article>
      `
    )
    .join("");
};

const getRelatedVisibleCards = () => {
  if (window.innerWidth <= 760) {
    return 1;
  }

  if (window.innerWidth <= 1080) {
    return 2;
  }

  return 3;
};

const updateRelatedCarousel = () => {
  const relatedGrid = document.getElementById("related-grid");
  const cards = relatedGrid.querySelectorAll(".related-card");

  if (!cards.length) {
    return;
  }

  const visibleCards = getRelatedVisibleCards();
  const maxIndex = Math.max(0, cards.length - visibleCards);
  state.relatedIndex = Math.min(state.relatedIndex, maxIndex);

  const cardWidth = cards[0].getBoundingClientRect().width;
  const gap = 18;
  const offset = state.relatedIndex * (cardWidth + gap);

  relatedGrid.style.transform = `translateX(-${offset}px)`;
};

const moveRelatedCarousel = (direction) => {
  const relatedGrid = document.getElementById("related-grid");
  const cards = relatedGrid.querySelectorAll(".related-card");
  const visibleCards = getRelatedVisibleCards();
  const maxIndex = Math.max(0, cards.length - visibleCards);

  if (!cards.length) {
    return;
  }

  if (direction === "next") {
    state.relatedIndex = state.relatedIndex >= maxIndex ? 0 : state.relatedIndex + 1;
  } else {
    state.relatedIndex = state.relatedIndex <= 0 ? maxIndex : state.relatedIndex - 1;
  }

  updateRelatedCarousel();
};

const startRelatedAutoSlide = () => {
  window.clearInterval(relatedAutoSlideId);
  relatedAutoSlideId = window.setInterval(() => {
    moveRelatedCarousel("next");
  }, 5000);
};

const setupRelatedCarousel = () => {
  const prevButton = document.getElementById("related-prev");
  const nextButton = document.getElementById("related-next");

  prevButton.addEventListener("click", () => {
    moveRelatedCarousel("prev");
    startRelatedAutoSlide();
  });

  nextButton.addEventListener("click", () => {
    moveRelatedCarousel("next");
    startRelatedAutoSlide();
  });

  window.addEventListener("resize", updateRelatedCarousel);

  updateRelatedCarousel();
  startRelatedAutoSlide();
};

const renderReviews = () => {
  const reviewList = document.getElementById("review-list");

  reviewList.innerHTML = reviews
    .map(
      (review) => `
        <article class="review-card">
          <div class="review-top">
            <div>
              <strong>${review.name}</strong>
              <span>${review.date}</span>
            </div>
            <span class="review-stars">${"&#9733;".repeat(review.rating)}${"&#9734;".repeat(5 - review.rating)}</span>
          </div>
          <p>${review.text}</p>
        </article>
      `
    )
    .join("");
};

const updateEstimatedTotal = () => {
  const selectedWeight = product.weights[state.selectedWeightIndex];
  const messageCharge = state.addMessage ? 120 : 0;
  const addOnTotal = addOns.reduce((total, item, index) => total + item.price * state.addOnQuantities[index], 0);
  const total = selectedWeight.price * state.quantity + messageCharge + addOnTotal;

  setText("estimated-total", formatPrice(total));
  setText("selected-weight", selectedWeight.label);
  setText("product-price", formatPrice(selectedWeight.price));
  setText("main-qty", state.quantity);
};

const getSelectedCartConfig = () => {
  const selectedWeight = product.weights[state.selectedWeightIndex];
  const selectedFlavour = product.flavours[Number(document.getElementById("flavour-select").value) || 0];
  const selectedCream = product.creams[Number(document.getElementById("cream-select").value) || 0];
  const messageText = state.addMessage ? document.getElementById("cake-message").value.trim() : "";

  return {
    weight: selectedWeight.label,
    flavour: selectedFlavour,
    cream: selectedCream,
    message: messageText,
    unitPrice: selectedWeight.price
  };
};

const createCartItemKey = (productId, config) =>
  [productId, config.weight, config.flavour, config.cream, config.message].join("|");

const loadCartItems = () => {
  const storedItems = JSON.parse(localStorage.getItem(cartStorageKey) || "[]");

  state.cartItems = storedItems
    .map((item) => {
      if (item.key && item.name && item.image && item.unitPrice) {
        return item;
      }

      const fallbackProduct = products[String(item.id)];

      if (!fallbackProduct) {
        return null;
      }

      const fallbackConfig = {
        weight: fallbackProduct.weights[0].label,
        flavour: fallbackProduct.flavours[0],
        cream: fallbackProduct.creams[0],
        message: "",
        unitPrice: fallbackProduct.weights[0].price
      };

      return {
        key: createCartItemKey(String(item.id), fallbackConfig),
        id: String(item.id),
        name: fallbackProduct.name,
        image: fallbackProduct.image,
        qty: item.qty || 1,
        unitPrice: fallbackConfig.unitPrice,
        weight: fallbackConfig.weight,
        flavour: fallbackConfig.flavour,
        cream: fallbackConfig.cream,
        message: fallbackConfig.message
      };
    })
    .filter(Boolean);
};

const persistCartItems = () => {
  localStorage.setItem(cartStorageKey, JSON.stringify(state.cartItems));
  if (state.cartItems.length > 0) {
    localStorage.setItem(cartActivityKey, String(Date.now()));
  } else {
    localStorage.removeItem(cartActivityKey);
  }
};

const openCartDrawer = () => {
  document.getElementById("cart-drawer").classList.add("active");
  document.getElementById("cart-backdrop").classList.add("active");
  document.body.classList.add("drawer-open");
};

const closeCartDrawer = () => {
  document.getElementById("cart-drawer").classList.remove("active");
  document.getElementById("cart-backdrop").classList.remove("active");
  document.body.classList.remove("drawer-open");
};

const getCartSubtotal = () =>
  state.cartItems.reduce((total, item) => total + item.unitPrice * item.qty, 0);

const renderCartDrawer = () => {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartSubtotal = document.getElementById("cart-subtotal");

  if (!state.cartItems.length) {
    cartItemsContainer.innerHTML = `
      <div class="cart-empty">
        No items in cart yet. Add a cake from this page and it will appear here.
      </div>
    `;
    cartSubtotal.textContent = formatPrice(0);
    return;
  }

  cartItemsContainer.innerHTML = state.cartItems
    .map(
      (item) => `
        <article class="cart-item">
          <img class="cart-item-image" src="${item.image}" alt="${item.name}">

          <div class="cart-item-main">
            <h3>${item.name}</h3>
            <p class="cart-item-spec">Weight: ${item.weight}</p>
            <p class="cart-item-spec">Flavour: ${item.flavour}</p>
            <p class="cart-item-spec">Cream: ${item.cream}</p>
            ${item.message ? `<p class="cart-item-spec">Message: ${item.message}</p>` : ""}
            <strong class="cart-item-price">${formatPrice(item.unitPrice)}</strong>
          </div>

          <button class="cart-remove-btn" type="button" data-cart-remove="${item.key}" aria-label="Remove item">&times;</button>

          <div class="cart-item-actions">
            <div class="cart-item-qty">
              <button type="button" data-cart-qty="${item.key}" data-cart-action="decrease">-</button>
              <span>${item.qty}</span>
              <button type="button" data-cart-qty="${item.key}" data-cart-action="increase">+</button>
            </div>

            <span class="cart-line-total">${formatPrice(item.unitPrice * item.qty)}</span>
          </div>
        </article>
      `
    )
    .join("");

  cartSubtotal.textContent = formatPrice(getCartSubtotal());

  cartItemsContainer.querySelectorAll("[data-cart-remove]").forEach((button) => {
    button.addEventListener("click", () => {
      state.cartItems = state.cartItems.filter((item) => item.key !== button.dataset.cartRemove);
      persistCartItems();
      renderCartDrawer();
    });
  });

  cartItemsContainer.querySelectorAll("[data-cart-qty]").forEach((button) => {
    button.addEventListener("click", () => {
      const targetItem = state.cartItems.find((item) => item.key === button.dataset.cartQty);

      if (!targetItem) {
        return;
      }

      if (button.dataset.cartAction === "increase") {
        targetItem.qty += 1;
      } else {
        targetItem.qty -= 1;
      }

      state.cartItems = state.cartItems.filter((item) => item.qty > 0);
      persistCartItems();
      renderCartDrawer();
    });
  });
};

const addCurrentProductToCart = () => {
  const config = getSelectedCartConfig();
  const key = createCartItemKey(requestedId, config);
  const existingItem = state.cartItems.find((item) => item.key === key);

  if (existingItem) {
    existingItem.qty += state.quantity;
  } else {
    state.cartItems.push({
      key,
      id: requestedId,
      name: product.name,
      image: product.image,
      qty: state.quantity,
      unitPrice: config.unitPrice,
      weight: config.weight,
      flavour: config.flavour,
      cream: config.cream,
      message: config.message
    });
  }

  persistCartItems();
  renderCartDrawer();
  openCartDrawer();
};

const setupCartDrawer = () => {
  loadCartItems();
  persistCartItems();
  renderCartDrawer();

  document.getElementById("cart-close-btn").addEventListener("click", closeCartDrawer);
  document.getElementById("cart-backdrop").addEventListener("click", closeCartDrawer);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeCartDrawer();
    }
  });
};

const initialisePage = () => {
  setText("product-name", product.name);
  setText("product-badge", product.badge);
  setText("product-category", product.category);
  setText("product-rating", product.rating);
  setText("delivery-text", product.deliveryText);
  setText("product-desc", product.description);

  populateSelect("weight-select", product.weights, (item) => `${item.label} - ${formatPrice(item.price)}`);
  populateSelect("flavour-select", product.flavours, (item) => item);
  populateSelect("cream-select", product.creams, (item) => item);

  renderGallery();
  renderAddOns();
  renderRelatedProducts();
  setupRelatedCarousel();
  renderReviews();
  updateEstimatedTotal();
  setupCartDrawer();
};

document.addEventListener("DOMContentLoaded", async () => {
  await loadDynamicProduct();
  initialisePage();

  document.getElementById("weight-select").addEventListener("change", (event) => {
    state.selectedWeightIndex = Number(event.target.value);
    updateEstimatedTotal();
  });

  document.querySelectorAll(".qty-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;

      if (action === "increase") {
        state.quantity += 1;
      } else {
        state.quantity = Math.max(1, state.quantity - 1);
      }

      updateEstimatedTotal();
    });
  });

  const messageToggle = document.getElementById("cake-message-toggle");
  const messageBox = document.getElementById("cake-message");

  messageToggle.addEventListener("change", () => {
    state.addMessage = messageToggle.checked;
    messageBox.classList.toggle("visible", state.addMessage);
    updateEstimatedTotal();
  });

  document.getElementById("favorite-btn").addEventListener("click", (event) => {
    state.favorite = !state.favorite;
    event.currentTarget.classList.toggle("active", state.favorite);
    event.currentTarget.innerHTML = `<span aria-hidden="true">${state.favorite ? "&#9829;" : "&#9825;"}</span>`;
  });

  document.getElementById("add-to-cart").addEventListener("click", () => {
    addCurrentProductToCart();
  });
});
