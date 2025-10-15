interface CartItem {
  name: string;
  price: number;
  quantity: number;
  image: string;
}

document.addEventListener("DOMContentLoaded", () => {
  const addButtons = document.querySelectorAll<HTMLButtonElement>(".addItem");
  const cartTitle = document.querySelector<HTMLHeadingElement>(".shoppingCart h3")!;
  const cartList = document.querySelector<HTMLUListElement>(".cartList")!;
  const cartTotal = document.querySelector<HTMLHeadingElement>(".shoppingCart h4")!;
  const checkoutBtn = document.querySelector<HTMLButtonElement>("#checkoutBtn")!;

  // overlay 
  const overlay = document.createElement("div");
  overlay.id = "overlay";
  overlay.className = "hidden";
  overlay.innerHTML = `
    <div id="overlayContent">
      <h2>Purchase Successful!</h2>
      <div id="overlayItems"></div>
      <h3 id="overlayTotal"></h3>
      <p>Thank you for your order. Your desserts will be prepared shortly</p>
      <button id="closeOverlay">Close</button>
    </div>
  `;
  document.body.appendChild(overlay);

  const overlayItems = overlay.querySelector<HTMLDivElement>("#overlayItems")!;
  const overlayTotal = overlay.querySelector<HTMLHeadingElement>("#overlayTotal")!;
  const closeOverlay = overlay.querySelector<HTMLButtonElement>("#closeOverlay")!;

  let cart: CartItem[] = [];

  // -------------------------------
  // Update cart display
  // -------------------------------
  function updateCartDisplay(): void {
    cartList.innerHTML = "";

    let total = 0;
    cart.forEach((item) => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${item.name} - $${item.price.toFixed(2)} x ${item.quantity}
        <button class="decrease">-</button>
        <button class="increase">+</button>
        <button class="remove">Remove</button>
      `;

      const decreaseBtn = li.querySelector(".decrease") as HTMLButtonElement;
      const increaseBtn = li.querySelector(".increase") as HTMLButtonElement;
      const removeBtn = li.querySelector(".remove") as HTMLButtonElement;

      decreaseBtn.addEventListener("click", () => changeQuantity(item.name, -1));
      increaseBtn.addEventListener("click", () => changeQuantity(item.name, 1));
      removeBtn.addEventListener("click", () => removeFromCart(item.name));

      cartList.appendChild(li);
      total += item.price * item.quantity;
    });

    cartTitle.textContent = `Add your cart items (${cart.length})`;
    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
  }

  // -------------------------------
  // Add item to cart
  // -------------------------------
  function addToCart(name: string, price: number, image: string, itemDiv: HTMLElement): void {
    const existing = cart.find((i) => i.name === name);
    if (existing) {
      existing.quantity++;
    } else {
      cart.push({ name, price, quantity: 1, image });
    }

    // Highlight animation
    itemDiv.classList.add("highlight");
    const imgDiv = itemDiv.querySelector(".productImg");
    imgDiv?.classList.add("highlight");

    setTimeout(() => {
      itemDiv.classList.remove("highlight");
      imgDiv?.classList.remove("highlight");
    }, 600);

    updateCartDisplay();
  }

  // -------------------------------
  // Remove item from cart
  // -------------------------------
  function removeFromCart(name: string): void {
    cart = cart.filter((i) => i.name !== name);
    updateCartDisplay();
  }

  // -------------------------------
  // Change item quantity (+ / -)
  // -------------------------------
  function changeQuantity(name: string, change: number): void {
    const item = cart.find((i) => i.name === name);
    if (item) {
      item.quantity += change;
      if (item.quantity <= 0) removeFromCart(name);
    }
    updateCartDisplay();
  }

  // -------------------------------
  // Checkout + Confirm Purchase
  // -------------------------------
  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    let total = 0;
    cart.forEach((item) => (total += item.price * item.quantity));

    const confirmPurchase = confirm(`Confirm purchase of $${total.toFixed(2)}?`);
    if (confirmPurchase) {
      overlayItems.innerHTML = "";
      overlay.classList.remove("hidden");

      // Build overlay with images
      cart.forEach((item) => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "overlayItem";
        itemDiv.innerHTML = `
          <img src="${item.image}" alt="${item.name}">
          <p>${item.name} x${item.quantity}</p>
          <span>$${(item.price * item.quantity).toFixed(2)}</span>
        `;
        overlayItems.appendChild(itemDiv);
      });

      overlayTotal.textContent = `Total: $${total.toFixed(2)}`;

      // Clear cart
      cart = [];
      updateCartDisplay();
    }
  });

  // -------------------------------
  // Close overlay
  // -------------------------------
  closeOverlay.addEventListener("click", () => {
    overlay.classList.add("hidden");
  });

  // -------------------------------
  // Handle Add-to-Cart Buttons
  // -------------------------------
  addButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const product = button.closest(".items");
      if (!product) return;

      const name = product.querySelector("h5")?.textContent ?? "Unknown";
      const priceText = product.querySelector(".price")?.textContent ?? "$0";
      const price = parseFloat(priceText.replace("$", ""));
      const image = product.querySelector("img")?.getAttribute("src") ?? "";

      //addToCart(name, price, image, product);
    });
  });

  updateCartDisplay();
});
