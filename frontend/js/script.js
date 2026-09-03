/* ==========================================
   WAFFLECART
   CART + WHATSAPP ORDER SYSTEM
========================================== */


/* ==========================================
   WHATSAPP NUMBER
========================================== */

/*
    IMPORTANT:

    Replace this with the owner's WhatsApp
    number.

    Example:

    const WHATSAPP_NUMBER = "919876543210";

    Do not add:
    +
    spaces
    brackets
*/

const WHATSAPP_NUMBER = "919967939693";


/* ==========================================
   CART
========================================== */

let cart =
    JSON.parse(
        localStorage.getItem("waffleCart")
    ) || [];


/* ==========================================
   ELEMENTS
========================================== */

const cartButton =
    document.getElementById("cartButton");

const cartDrawer =
    document.getElementById("cartDrawer");

const cartOverlay =
    document.getElementById("cartOverlay");

const closeCart =
    document.getElementById("closeCart");

const cartItems =
    document.getElementById("cartItems");

const cartCount =
    document.getElementById("cartCount");

const cartTotal =
    document.getElementById("cartTotal");

const discountAmount =
    document.getElementById("discountAmount");

const grandTotal =
    document.getElementById("grandTotal");

const cartDiscount =
    document.getElementById("cartDiscount");

const whatsappOrderButton =
    document.getElementById(
        "whatsappOrderButton"
    );

const toast =
    document.getElementById("toast");


/* ==========================================
   SAVE CART
========================================== */

function saveCart() {

    localStorage.setItem(
        "waffleCart",
        JSON.stringify(cart)
    );

}


/* ==========================================
   ADD PRODUCT
========================================== */

document
    .querySelectorAll(".add-cart")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const name =
                    button.dataset.name;

                const price =
                    Number(
                        button.dataset.price
                    );


                const existing =
                    cart.find(
                        item =>
                            item.name === name
                    );


                if (existing) {

                    existing.quantity += 1;

                } else {

                    cart.push({

                        name: name,

                        price: price,

                        quantity: 1

                    });

                }


                saveCart();

                updateCart();

                showToast(
                    `${name} added to cart`
                );


                button.classList.add(
                    "added"
                );

                button.innerHTML =
                    "Added ✓";


                setTimeout(
                    () => {

                        button.classList.remove(
                            "added"
                        );

                        button.innerHTML =
                            'Add <span>+</span>';

                    },
                    900
                );

            }
        );

    });


/* ==========================================
   UPDATE CART
========================================== */

function updateCart() {

    cartItems.innerHTML = "";


    /* Empty */

    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <div>
                    🧇
                </div>

                <h3>
                    Your cart is empty
                </h3>

                <p>
                    Add a delicious waffle
                    to get started.
                </p>

            </div>

        `;


        cartCount.textContent = "0";

        cartTotal.textContent = "0";

        grandTotal.textContent = "0";

        discountAmount.textContent = "0";

        cartDiscount.style.display =
            "none";

        return;

    }


    let subtotal = 0;

    let quantity = 0;


    cart.forEach(
        (item, index) => {

            const itemTotal =
                item.price *
                item.quantity;


            subtotal += itemTotal;

            quantity +=
                item.quantity;


            const itemElement =
                document.createElement(
                    "div"
                );


            itemElement.className =
                "cart-item";


            itemElement.innerHTML = `

                <div class="cart-item-image">
                    🧇
                </div>

                <div class="cart-item-details">

                    <strong>
                        ${escapeHTML(item.name)}
                    </strong>

                    <span>
                        ₹${item.price}
                    </span>

                    <div class="quantity-control">

                        <button
                            onclick="changeQuantity(${index}, -1)">
                            −
                        </button>

                        <strong>
                            ${item.quantity}
                        </strong>

                        <button
                            onclick="changeQuantity(${index}, 1)">
                            +
                        </button>

                    </div>

                </div>

                <div class="cart-item-right">

                    <strong>
                        ₹${itemTotal}
                    </strong>

                    <button
                        class="remove-item"
                        onclick="removeItem(${index})">

                        Remove

                    </button>

                </div>

            `;


            cartItems.appendChild(
                itemElement
            );

        }
    );


    /* ======================================
       DISCOUNT
    ====================================== */

    let discount = 0;


    if (subtotal >= 499) {

        discount =
            Math.round(
                subtotal * 0.20
            );

        cartDiscount.style.display =
            "flex";

    } else {

        cartDiscount.style.display =
            "none";

    }


    const total =
        subtotal - discount;


    cartCount.textContent =
        quantity;

    cartTotal.textContent =
        subtotal;

    discountAmount.textContent =
        discount;

    grandTotal.textContent =
        total;

}


/* ==========================================
   CHANGE QUANTITY
========================================== */

function changeQuantity(
    index,
    change
) {

    if (!cart[index]) {
        return;
    }


    cart[index].quantity +=
        change;


    if (
        cart[index].quantity <= 0
    ) {

        cart.splice(
            index,
            1
        );

    }


    saveCart();

    updateCart();

}


/* ==========================================
   REMOVE
========================================== */

function removeItem(index) {

    if (!cart[index]) {
        return;
    }


    cart.splice(
        index,
        1
    );


    saveCart();

    updateCart();

    showToast(
        "Item removed"
    );

}


/* ==========================================
   OPEN CART
========================================== */

function openCart() {

    cartDrawer.classList.add(
        "open"
    );

    cartOverlay.classList.add(
        "active"
    );

    document.body.classList.add(
        "cart-open"
    );

}


/* ==========================================
   CLOSE CART
========================================== */

function closeCartDrawer() {

    cartDrawer.classList.remove(
        "open"
    );

    cartOverlay.classList.remove(
        "active"
    );

    document.body.classList.remove(
        "cart-open"
    );

}


cartButton.addEventListener(
    "click",
    openCart
);


closeCart.addEventListener(
    "click",
    closeCartDrawer
);


cartOverlay.addEventListener(
    "click",
    closeCartDrawer
);


/* ==========================================
   WHATSAPP ORDER
========================================== */

whatsappOrderButton.addEventListener(
    "click",
    () => {

        if (cart.length === 0) {

            showToast(
                "Your cart is empty"
            );

            return;

        }


        sendWhatsAppOrder();

    }
);


/* ==========================================
   CREATE WHATSAPP MESSAGE
========================================== */

/* ==========================================
   CREATE + SEND WHATSAPP ORDER
========================================== */

function sendWhatsAppOrder() {

    /* --------------------------------------
       CHECK CART
    -------------------------------------- */

    if (cart.length === 0) {

        showToast("Your cart is empty");

        return;
    }


    /* --------------------------------------
       GET LOCATION
    -------------------------------------- */

    const selectedLocation =
        localStorage.getItem("waffleLocation") ||
        "Location not selected";


    /* --------------------------------------
       CALCULATE SUBTOTAL
    -------------------------------------- */

    let subtotal = 0;

    cart.forEach(item => {

        subtotal +=
            item.price * item.quantity;

    });


    /* --------------------------------------
       DISCOUNT
       20% OFF ABOVE ₹499
    -------------------------------------- */

    let discount = 0;

    if (subtotal >= 499) {

        discount =
            Math.round(subtotal * 0.20);

    }


    /* --------------------------------------
       FINAL TOTAL
    -------------------------------------- */

    const total =
        subtotal - discount;


    /* --------------------------------------
       CREATE WHATSAPP MESSAGE
    -------------------------------------- */

    let message =
`🧇 WAFFLECART ORDER

Hi! I'd like to order:

`;


    /* --------------------------------------
       ADD CART ITEMS
    -------------------------------------- */

    cart.forEach(item => {

        const itemTotal =
            item.price * item.quantity;

        message +=
`• ${item.name} × ${item.quantity} — ₹${itemTotal}
`;

    });


    /* --------------------------------------
       ORDER SUMMARY
    -------------------------------------- */

    message +=
`
────────────────
Subtotal: ₹${subtotal}
`;


    if (discount > 0) {

        message +=
`Discount (20%): -₹${discount}
`;

    }


    message +=
`TOTAL: ₹${total}
────────────────

📍 Delivery Location:
${selectedLocation}

Please confirm my order. ❤️`;


    /* --------------------------------------
       WHATSAPP URL
    -------------------------------------- */

    const whatsappURL =
        `https://wa.me/${WHATSAPP_NUMBER}` +
        `?text=${encodeURIComponent(message)}`;


    /* --------------------------------------
       OPEN WHATSAPP
    -------------------------------------- */

    window.open(
        whatsappURL,
        "_blank"
    );


    /* --------------------------------------
       CLEAR CART
       
       WhatsApp opens first.
       Then clear the customer's cart.
    -------------------------------------- */

    setTimeout(() => {

        cart = [];

        localStorage.removeItem(
            "waffleCart"
        );

        updateCart();

        closeCartDrawer();

        showToast(
            "Order opened in WhatsApp ✓ Cart cleared"
        );

    }, 1200);

}


/* ==========================================
   TOAST
========================================== */

function showToast(
    message
) {

    const toastText =
        toast.querySelector("p");


    toastText.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        window.toastTimer
    );


    window.toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2200
        );

}


/* ==========================================
   MENU FILTER
========================================== */

document
    .querySelectorAll(".filter")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".filter")
                    .forEach(
                        filter =>
                            filter.classList.remove(
                                "active"
                            )
                    );


                button.classList.add(
                    "active"
                );


                const category =
                    button.dataset.filter;


                document
                    .querySelectorAll(".product-card")
                    .forEach(card => {

                        if (
                            category === "all" ||
                            card.dataset.category ===
                            category
                        ) {

                            card.style.display =
                                "";

                        } else {

                            card.style.display =
                                "none";

                        }

                    });

            }
        );

    });


/* ==========================================
   WISHLIST
========================================== */

document
    .querySelectorAll(".wishlist")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                button.classList.toggle(
                    "liked"
                );


                button.textContent =
                    button.classList.contains(
                        "liked"
                    )
                        ? "♥"
                        : "♡";

            }
        );

    });


/* ==========================================
   COUPON COPY
========================================== */

const copyCoupon =
    document.getElementById(
        "copyCoupon"
    );


if (copyCoupon) {

    copyCoupon.addEventListener(
        "click",
        async () => {

            try {

                await navigator
                    .clipboard
                    .writeText(
                        "WAFFLE20"
                    );


                copyCoupon.textContent =
                    "COPIED ✓";


                setTimeout(
                    () => {

                        copyCoupon.textContent =
                            "COPY";

                    },
                    1500
                );

            } catch {

                alert(
                    "Coupon: WAFFLE20"
                );

            }

        }
    );

}


/* ==========================================
   LOCATION BUTTON
========================================== */

const locationButton =
    document.getElementById(
        "locationButton"
    );

const locationText =
    document.getElementById(
        "locationText"
    );


if (locationButton) {

    locationButton.addEventListener(
        "click",
        () => {

            const location =
                prompt(
                    "Enter your delivery area:"
                );


            if (
                location &&
                location.trim()
            ) {

                locationText.textContent =
                    location.trim();

                localStorage.setItem(
                    "waffleLocation",
                    location.trim()
                );

            }

        }
    );

}


/* ==========================================
   RESTORE LOCATION
========================================== */

const savedLocation =
    localStorage.getItem(
        "waffleLocation"
    );


if (
    savedLocation &&
    locationText
) {

    locationText.textContent =
        savedLocation;

}


/* ==========================================
   ESCAPE HTML
========================================== */

function escapeHTML(
    text
) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        text;

    return div.innerHTML;

}


/* ==========================================
   INITIALIZE
========================================== */

updateCart();