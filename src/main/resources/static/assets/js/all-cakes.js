const products = [
  {
    id: 1,
    name: "Orange Butter Cake",
    image: "./assets/images/product-1.png",
    price: 2000,
    rating: 4.8,
    flavour: "Orange / Vanilla",
    description: "Soft butter sponge with fresh orange notes."
  },
  {
    id: 13,
    name: "Classic Vanilla Butter Cake",
    image: "./assets/images/Marble Gateau.png",
    price: 3200,
    rating: 4.6,
    flavour: "Vanilla",
    description: "Traditional butter cake with rich vanilla taste."
  },
  {
    id: 5,
    name: "Chocolate Butter Loaf",
    image: "./assets/images/Coffee-Chocolate-Gateau.png",
    price: 4500,
    rating: 4.7,
    flavour: "Chocolate / Mocha",
    description: "Dense butter loaf finished with chocolate layers."
  },
  {
    id: 2,
    name: "Black Forest Signature",
    image: "./assets/images/Black-forest-Gateau.png",
    price: 5000,
    rating: 4.8,
    flavour: "Chocolate / Cherry",
    description: "Signature black forest cake with cherry cream."
  },
  {
    id: 4,
    name: "Blueberry Signature Cheesecake",
    image: "./assets/images/Blueberry Baked Cheesecake.png",
    price: 5500,
    rating: 4.9,
    flavour: "Blueberry / Vanilla",
    description: "Baked cheesecake with premium blueberry topping."
  },
  {
    id: 3,
    name: "Red Velvet Signature",
    image: "./assets/images/Red Velvet Cake 2.png",
    price: 4000,
    rating: 4.7,
    flavour: "Vanilla / Cocoa",
    description: "Moist red velvet cake with smooth cream finish."
  },
  {
    id: 2,
    name: "Chocolate Cake Piece",
    image: "./assets/images/Black-forest-Gateau-1.png",
    price: 650,
    rating: 4.6,
    flavour: "Chocolate",
    description: "Single-serve chocolate slice."
  },
  {
    id: 5,
    name: "Coffee Chocolate Slice",
    image: "./assets/images/Coffee-Chocolate-Gateau.png",
    price: 700,
    rating: 4.7,
    flavour: "Mocha / Chocolate",
    description: "Rich coffee chocolate slice for quick treats."
  },
  {
    id: 3,
    name: "Orange Slice",
    image: "./assets/images/orange 2.png",
    price: 600,
    rating: 4.5,
    flavour: "Orange / Vanilla",
    description: "Fresh orange sponge slice with light cream."
  },
  {
      id: 13,
      name: "Butter Cake",
      image: "./assets/images/Butter-cake-1-1-1.png",
      price: 1100,
      rating: 4.9,
      flavour: "Vanilla",
      description: "Rich, buttery and moist vanilla cake."
    },
    {
      id: 14,
      name: "Coffee Cake",
      image: "./assets/images/Coffee Cake.png",
      price: 2000,
      rating: 4.8,
      flavour: "Coffee",
      description: "Rich coffee flavored sponge cake."
    },
    {
      id: 15,
      name: "Disc Cake",
      image: "./assets/images/Disc Cake.png",
      price: 2000,
      rating: 4.3,
      flavour: "Chocolate / Vanilla",
      description: "Round disc shaped cake for celebrations."
    },
    {
      id: 16,
      name: "Disk Ribbon Cake Extra Large",
      image: "./assets/images/Disk-Ribbon-Cake-Extra-Large-1.png",
      price: 4600,
      rating: 4.7,
      flavour: "Ribbon",
      description: "Extra large ribbon disc cake for big celebrations."
    },
    {
      id: 17,
      name: "Ribbon Cake",
      image: "./assets/images/Ribbon Cake.png",
      price: 1500,
      rating: 4.4,
      flavour: "Ribbon",
      description: "Colorful layered ribbon cake."
    },
    {
      id: 18,
      name: "Marble Cake",
      image: "./assets/images/Marble-Cake.png",
      price: 250,
      rating: 4.3,
      flavour: "Chocolate & Vanilla",
      description: "Swirled chocolate and vanilla marble cake."
    },
    {
    id: 7,
    name: "Chocolate Pineapple Gateau Slice",
    image: "./assets/images/Chocolate Pineapple Gateau Slice.png",
    price: 250,
    rating: 4.9,
    flavour: "Chocolate & Pineapple",
    description: "Rich chocolate and sweet pineapple slice."
  },
  {
    id: 8,
    name: "Coffee Chocolate Gateau Slice",
    image: "./assets/images/Coffee Chocolate Gateau Slice.png",
    price: 250,
    rating: 4.8,
    flavour: "Chocolate & Coffee",
    description: "Perfect blend of coffee and chocolate."
  },
  {
    id: 9,
    name: "Mango Gateau Slice",
    image: "./assets/images/Mango Gateau Slice.png",
    price: 250,
    rating: 4.8,
    flavour: "Mango",
    description: "Tropical mango flavored gateau slice."
  },
  {
    id: 10,
    name: "Rose Gateau Slice",
    image: "./assets/images/Rose Gateau Slice.png",
    price: 250,
    rating: 4.8,
    flavour: "Rose and Vanilla",
    description: "Floral rose and vanilla flavored slice."
  },
  {
    id: 11,
    name: "Swiss Roll",
    image: "./assets/images/Swiss-Roll.png",
    price: 4500,
    rating: 4.7,
    flavour: "Chocolate / Vanilla",
    description: "Rolled sponge cake with cream filling."
  },
  {
    id: 12,
    name: "Triple Treat Slice",
    image: "./assets/images/Triple Treat Slice.png",
    price: 250,
    rating: 4.8,
    flavour: "Strawberry, Vanilla & Chocolate",
    description: "Three flavors in one delicious slice."
  }
];

const apiBaseUrl = "http://localhost:8080";
const cartStorageKey = "bakery_cart";
const cartActivityKey = "bakery_cart_last_activity";

const state = {
  search: "",
  sort: "default"
};

const formatPrice = (value) =>
  `Rs. ${value.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const openProductDetails = (productId) => {
  window.location.href = `./product.html?id=${productId}`;
};

const addProductToCart = (productId) => {
  const product = products.find((item) => String(item.id) === String(productId));
  if (!product) return;

  const cartItems = JSON.parse(localStorage.getItem(cartStorageKey) || "[]");
  const key = `${product.id}|1 item|${product.flavour}|Bakery Cream|`;
  const existing = cartItems.find((item) => item.key === key);

  if (existing) {
    existing.qty += 1;
  } else {
    cartItems.push({
      key,
      id: String(product.id),
      name: product.name,
      image: product.image,
      qty: 1,
      unitPrice: Number(product.price),
      weight: "1 item",
      flavour: product.flavour,
      cream: "Bakery Cream",
      message: ""
    });
  }

  localStorage.setItem(cartStorageKey, JSON.stringify(cartItems));
  if (cartItems.length > 0) {
    localStorage.setItem(cartActivityKey, String(Date.now()));
  } else {
    localStorage.removeItem(cartActivityKey);
  }
  window.alert(`${product.name} added to cart.`);
};

const syncAdminProducts = async () => {
  try {
    const response = await fetch(`${apiBaseUrl}/api/products/public`);
    if (!response.ok) return;

    const dbProducts = await response.json();
    for (let i = products.length - 1; i >= 0; i -= 1) {
      if (String(products[i].id).startsWith("db-")) {
        products.splice(i, 1);
      }
    }
    dbProducts.forEach((item) => {
      const mappedId = `db-${item.id}`;
      const normalizedName = String(item.name || "").trim().toLowerCase();
      if (normalizedName) {
        for (let i = products.length - 1; i >= 0; i -= 1) {
          const candidate = String(products[i].name || "").trim().toLowerCase();
          if (candidate === normalizedName) {
            products.splice(i, 1);
          }
        }
      }
      products.unshift({
        id: mappedId,
        name: item.name,
        image: item.imageUrl,
        price: Number(item.price || 0),
        rating: Number(item.rating || 0),
        flavour: item.flavour || item.category || "Custom",
        description: item.description || "Fresh bakery product."
      });
    });
  } catch (error) {
    // Keep static catalog even when API is unavailable.
  }
};

const filteredProducts = () => {
  let list = products.filter((item) => {
    const q = state.search;
    if (!q) return true;
    return item.name.toLowerCase().includes(q) || item.flavour.toLowerCase().includes(q);
  });

  switch (state.sort) {
    case "price-low":
      list = [...list].sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      list = [...list].sort((a, b) => b.price - a.price);
      break;
    case "rating-high":
      list = [...list].sort((a, b) => b.rating - a.rating);
      break;
    case "name":
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      break;
  }

  return list;
};

const render = () => {
  const grid = document.getElementById("product-grid");
  const resultCount = document.getElementById("result-count");
  const list = filteredProducts();

  resultCount.textContent = `${list.length} cake${list.length === 1 ? "" : "s"} found`;

  if (!list.length) {
    grid.innerHTML = `<div class="empty">No cakes matched your search.</div>`;
    return;
  }

  grid.innerHTML = list
    .map((item) => {
      const heading = `<a class="product-name-link" href="./product.html?id=${item.id}">${item.name}</a>`;

      return `
      <article class="product-card">
        <a href="./product.html?id=${item.id}">
          <img src="${item.image}" alt="${item.name}">
        </a>
        <div class="product-body">
          <h3>${heading}</h3>
          <p>${item.description}</p>
          <div class="meta">
            <span class="price">${formatPrice(item.price)}</span>
            <span class="rating">${item.rating.toFixed(1)} / 5</span>
          </div>
          <button class="cart-btn" type="button" data-add-id="${item.id}">Add to Cart &#128717;</button>
        </div>
      </article>
    `;
    })
    .join("");

  const cards = document.querySelectorAll(".product-card");
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add("show");
    }, 80 * (index + 1));
  });

  grid.querySelectorAll("[data-add-id]").forEach((button) => {
    button.addEventListener("click", () => {
      openProductDetails(button.getAttribute("data-add-id"));
    });
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  const searchInput = document.getElementById("search-input");
  const sortSelect = document.getElementById("sort-select");

  await syncAdminProducts();

  searchInput.addEventListener("input", (event) => {
    state.search = event.target.value.trim().toLowerCase();
    render();
  });

  sortSelect.addEventListener("change", (event) => {
    state.sort = event.target.value;
    render();
  });

  render();
  setInterval(async () => {
    await syncAdminProducts();
    render();
  }, 15000);
});
