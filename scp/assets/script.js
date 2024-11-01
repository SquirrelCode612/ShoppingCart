const products = [
  { id: 1, name: "Eco-Friendly Paint Set", price: 30 },
  { id: 2, name: "Recycled Sketchbook", price: 15 },
  { id: 3, name: "Meditation Cushion", price: 50 },
];

let cart = [];

document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", () => {
    const productId = button.parentElement.getAttribute("data-id");
    const product = products.find((p) => p.id == productId);
    addToCart(product);
  });
});

function addToCart(product) {
  const existingProduct = cart.find((item) => item.id === product.id);
  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  renderCart();
}

function decrementCartItem(productId) {
  const existingProduct = cart.find((item) => item.id === productId);
  if (existingProduct.quantity > 1) {
    existingProduct.quantity--;
  } else {
    removeFromCart(productId);
  }
  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  renderCart();
}

function renderCart() {
  const cartItems = document.getElementById("cart-items");
  cartItems.innerHTML = "";

  cart.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `${item.name} x ${item.quantity} - $${item.price * item.quantity} 
        <button class="decrement-btn" onclick="decrementCartItem(${item.id})">-</button>
        <button class="increment-btn" onclick="addToCart({ id: ${item.id}, name: '${item.name}', price: ${item.price} })">+</button>
        <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>`;
    cartItems.appendChild(li);
  });

  const cartTotal = document.getElementById("cart-total");
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotal.textContent = total.toFixed(2);
}

function calculateTotal() {
  let total = 0;
  cart.forEach((item) => {
    total += item.price * item.quantity;
  });
  return total;
}

function checkout() {
  const totalPrice = calculateTotal();
  if (totalPrice === 0) {
    alert("Your cart is empty!");
    return;
  }

  let totalTendered = 0;

  while (totalTendered < totalPrice) {
    let amountTendered = parseFloat(
      prompt(
        `Total price is $${totalPrice.toFixed(2)}. You have paid $${totalTendered.toFixed(2)}. Enter the cash amount:`,
      ),
    );

    if (isNaN(amountTendered) || amountTendered <= 0) {
      alert("Please enter a valid cash amount.");
      continue;
    }

    totalTendered += amountTendered;

    if (totalTendered < totalPrice) {
      let remaining = totalPrice - totalTendered;
      alert(`You still owe $${remaining.toFixed(2)}.`);
    }
  }

  let change = totalTendered - totalPrice;

  if (change === 0) {
    alert("Exact amount received. No change needed.");
    cart = [];
    renderCart();
  } else {
    alert(`Thank you! Your change is $${change.toFixed(2)}.`);
    cart = [];
    renderCart();
  }
}
document.getElementById("checkout-btn").addEventListener("click", checkout);
