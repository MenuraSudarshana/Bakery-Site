const products = [
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
  }
];


const apiBaseUrl = "http://localhost:8080";
const state = { search: "", sort: "default" };

const formatPrice = (value) =>
  `Rs. ${value.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const openProductDetails = (productId) => {
  window.location.href = `./product.html?id=${productId}`;
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
    dbProducts
      .filter((item) => String(item.category || "").trim().toLowerCase() === "butter cakes")
      .forEach((item) => {
        const mappedId = `db-${item.id}`;
        products.unshift({
          id: mappedId,
          name: item.name,
          image: item.imageUrl,
          price: Number(item.price || 0),
          rating: Number(item.rating || 0),
          flavour: item.flavour || "Custom",
          description: item.description || "Fresh bakery product."
        });
      });
  } catch (error) {
    // Keep static catalog when API is unavailable.
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
    grid.innerHTML = `<div class="empty">No butter cakes matched your search.</div>`;
    return;
  }

  grid.innerHTML = list
    .map(
      (item) => `
      <article class="product-card">
        <img src="${item.image}" alt="${item.name}">
        <div class="product-body">
          <h3><a class="product-name-link" href="./product.html?id=${item.id}">${item.name}</a></h3>
          <p>${item.description}</p>
          <div class="meta">
            <span class="price">${formatPrice(item.price)}</span>
            <span class="rating">${item.rating.toFixed(1)} / 5</span>
          </div>
          <button class="cart-btn" type="button" data-add-id="${item.id}">Add to Cart &#128717;</button>
        </div>
      </article>
    `
    )
    .join("");

  document.querySelectorAll(".product-card").forEach((card, index) => {
    setTimeout(() => card.classList.add("show"), 80 * (index + 1));
  });

  grid.querySelectorAll("[data-add-id]").forEach((button) => {
    button.addEventListener("click", () => {
      openProductDetails(button.getAttribute("data-add-id"));
    });
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  await syncAdminProducts();
  document.getElementById("search-input").addEventListener("input", (event) => {
    state.search = event.target.value.trim().toLowerCase();
    render();
  });

  document.getElementById("sort-select").addEventListener("change", (event) => {
    state.sort = event.target.value;
    render();
  });

  render();
  setInterval(async () => {
    await syncAdminProducts();
    render();
  }, 15000);
});
