const products = [
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
      .filter((item) => String(item.category || "").trim().toLowerCase() === "cake pieces")
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
    grid.innerHTML = `<div class="empty">No cake pieces matched your search.</div>`;
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
