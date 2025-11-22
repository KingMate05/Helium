import "./scss/app.scss";

async function loadProducts() {
  const container = document.getElementById("productsContainer");

  try {
    const response = await fetch("http://localhost/api/getProducts.php");
    const products = await response.json();

    container.innerHTML = products
      .map(
        (p) => `
          <div class="product_shop fade-up">
            <div class="img_product">
              <img src="http://localhost/api/assets/img/product/${p.image}" alt="${p.name}">
            </div>
            <span class="product_name">${p.name}</span>
            <span class="product_price">${p.price}€</span>
               
            <a href="produit.php?${p.id}">
            <div class="product_container_detail">
              <p>DÉCOUVRIR</p>
            </div>
            </a>
          </div>
        `
      )
      .join("");

    // ---- Observer APRES avoir ajouté les produits ----
    const faders = document.querySelectorAll(".fade-up");
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    faders.forEach((fader) => observer.observe(fader));
  } catch (error) {
    console.error("Erreur lors du fetch :", error);
    container.innerHTML = "<p>Impossible de charger les produits.</p>";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const faders = document.querySelectorAll(".fade-up");

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 } // déclenche quand 20% de l'élément est visible
  );

  faders.forEach((fader) => observer.observe(fader));
});

loadProducts();
// Récupère le panier ou le crée s'il n'existe pas
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// Sauvegarde le panier
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Ajouter un produit
function addToCart(id, name, price) {
  let cart = getCart();

  // Vérifie si le produit existe déjà dans le panier
  let existing = cart.find((item) => item.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      id: id,
      name: name,
      price: price,
      quantity: 1,
    });
  }

  saveCart(cart);
  displayCart();
}

// Supprimer un produit
function removeFromCart(id) {
  let cart = getCart().filter((item) => item.id !== id);
  saveCart(cart);
  displayCart();
}

// Modifier la quantité d’un produit
function updateQuantity(id, quantity) {
  let cart = getCart();

  let item = cart.find((item) => item.id === id);
  if (item) {
    item.quantity = quantity <= 0 ? 1 : quantity;
  }

  saveCart(cart);
  displayCart();
}

// Affichage du panier
function displayCart() {
  let cart = getCart();
  let cartDiv = document.getElementById("cart");

  if (cart.length === 0) {
    cartDiv.innerHTML = "<p>Le panier est vide.</p>";
    return;
  }

  let html = "<ul>";

  cart.forEach((item) => {
    html += `
            <li>
                <strong>${item.name}</strong> - 
                ${item.price} € × 
                <input type="number" value="${item.quantity}" min="1"
                    onchange="updateQuantity(${item.id}, this.value)">
                
                <button onclick="removeFromCart(${item.id})">Supprimer</button>
            </li>
        `;
  });

  html += "</ul>";

  // Total du panier
  let total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  html += `<h3>Total : ${total.toFixed(2)} €</h3>`;

  cartDiv.innerHTML = html;
}

// Affiche le panier au chargement de la page
displayCart();
