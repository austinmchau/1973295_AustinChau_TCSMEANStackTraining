/* Prototypes */
/**
 * A mock db of all possible inventory for purchase.
 */
var inventory = [
    {
        "id": "1",
        "name": "Laptop",
        "price": 500,
        "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/6/6d/Grizzly_Creek_Fire_-_8.23.20_e_01.jpg"
    },
    {
        "id": "2",
        "name": "Desktop",
        "price": 800,
        "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/b/b6/Computer.tower.750pix.jpg"
    },
    {
        "id": "3",
        "name": "Monitor",
        "price": 250,
        "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/c/cf/ASUS_MK241H_20080707.jpg"
    },
    {
        "id": "4",
        "name": "Keyboard",
        "price": 80,
        "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/2007_09_30_de_Apple-Tastatur.jpg/1024px-2007_09_30_de_Apple-Tastatur.jpg"
    },
    {
        "id": "5",
        "name": "Smartphone",
        "price": 1200,
        "imageUrl": "https://images.pexels.com/photos/4387770/pexels-photo-4387770.jpeg?cs=srgb&dl=pexels-stanley-ng-4387770.jpg&fm=jpg"
    },
    {
        "id": "6",
        "name": "Mouse",
        "price": 30,
        "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/c/c5/Red_computer_mouse.jpg"
    }
];
/* Utilities */
/**
 * A util function for formatting a number into US currency.
 * @param value a number that to be converted to currency format.
 * @returns a formatted string representing the monetary value.
 */
function formatAsCurrency(value) {
    return Intl.NumberFormat('en-US', {
        style: "currency",
        currency: "USD"
    }).format(value);
}
function inventoryFromId(id) {
    var filtered = inventory.filter(function (item) { return item.id == id; });
    if (!(filtered === null || filtered === void 0 ? void 0 : filtered.length)) {
        return null;
    }
    return filtered[0];
}
/* Cart Storage */
var Cart = /** @class */ (function () {
    function Cart() {
        this.storage = function () { return localStorage; };
        this.storageKey = "shoppingCart";
    }
    Cart.getInstance = function () {
        if (!Cart.instance) {
            Cart.instance = new Cart();
        }
        return Cart.instance;
    };
    Cart.prototype.clear = function () { this.storage().removeItem(this.storageKey); };
    Cart.prototype.read = function () {
        var store = this.storage().getItem(this.storageKey);
        if (store === null) {
            return {};
        }
        else {
            try {
                return JSON.parse(store);
            }
            catch (error) {
                this.clear();
                console.error(error);
                return {};
            }
        }
    };
    Cart.prototype.write = function (partialCart) {
        var cart = this.read();
        console.debug("write cart: ", cart);
        console.debug("partial cart: ", partialCart);
        for (var id in partialCart) {
            if (!(id in cart)) {
                cart[id] = 0;
            }
            cart[id] = Math.max(0, cart[id] + partialCart[id]);
        }
        console.debug("write cart after: ", cart);
        try {
            var json = JSON.stringify(cart);
            this.storage().setItem(this.storageKey, json);
        }
        catch (error) {
            this.clear();
            console.error(error);
        }
    };
    Cart.prototype.updateCart = function (itemId, quantity) {
        var _a;
        console.debug("updating cart: ", itemId, quantity);
        this.write((_a = {}, _a[itemId] = quantity, _a));
    };
    Cart.prototype.description = function () {
        var cart = this.read();
        return Object.keys(cart).map(function (k) {
            return {
                item: inventoryFromId(k),
                quantity: cart[k]
            };
        });
    };
    Cart.prototype.quantityFromId = function (id) {
        var cart = this.read();
        if (!(id in cart)) {
            return 0;
        }
        return cart[id];
    };
    Cart.prototype.cartSize = function () {
        var cart = this.read();
        return Object.keys(cart).map(function (k) { return cart[k]; }).reduce(function (prev, curr) { return prev + curr; });
    };
    return Cart;
}());
/* Listing Page */
function updateCartCount() {
    var cartCount = document.getElementById("cartCount");
    if (cartCount) {
        cartCount.innerText = "" + Cart.getInstance().cartSize();
    }
}
function updateListing() {
    var listingArea = document.getElementById("listingArea");
    var listingTemplate = document.getElementById("listingTemplate").content;
    console.debug("listingArea: ", listingArea);
    console.debug("listingTemplate: ", listingTemplate);
    /* cleaning up the listingArea first */
    while (listingArea === null || listingArea === void 0 ? void 0 : listingArea.firstChild) {
        listingArea.removeChild(listingArea.firstChild);
    }
    inventory.forEach(function (entry) {
        // getting the elements from DOM
        var card = listingTemplate.cloneNode(true);
        console.debug("card: ", card);
        var nameLabel = card.querySelectorAll("h2")[0];
        var priceLabel = card.querySelectorAll("p")[0];
        var quantitySubButton = card.querySelectorAll("button")[0];
        var quantityLabel = card.getElementById("quantityLabel");
        var quantityAddButton = card.querySelectorAll("button")[1];
        var imagePreview = card.querySelectorAll("img")[0];
        // changing the quantityLabel id as we're inserting it back to DOM
        var labelId = "quantityLabel-" + entry.id;
        quantityLabel.id = labelId;
        // changing the labels
        nameLabel.textContent = "" + entry.name;
        priceLabel.textContent = "Price: " + formatAsCurrency(entry.price);
        // abstracting the functions that get the quantity for the particular item
        var quantityFromId = function (id) { return "" + Cart.getInstance().quantityFromId(id); };
        // abstracting the callback for when the +/- buttons are clicked
        var quantityButtonOnClick = function (ev, delta) {
            Cart.getInstance().updateCart(entry.id, delta);
            var label = document.getElementById(labelId);
            if (label !== null) {
                label.innerText = quantityFromId(entry.id);
            }
            updateCartCount();
        };
        // updating the quantity labels and buttons
        quantityLabel.innerText = "" + Cart.getInstance().quantityFromId(entry.id);
        quantitySubButton.onclick = (function (ev) { return quantityButtonOnClick(ev, -1); });
        quantityAddButton.onclick = (function (ev) { return quantityButtonOnClick(ev, 1); });
        // updating the image
        if (!entry.imageUrl) {
            imagePreview.remove();
        }
        else {
            imagePreview.src = entry.imageUrl;
        }
        // finally, append the new fragment back to DOM
        listingArea.appendChild(card);
    });
}
/* Checkout */
function updateCheckoutTable() {
    console.debug("Checkout table: ", Cart.getInstance().description());
    var checkoutTable = document.getElementById("checkoutTable");
    if (!checkoutTable) {
        console.error("Empty checkoutTable");
        return;
    }
    var tbody = checkoutTable.getElementsByTagName("tbody")[0];
    var itemTemplate = checkoutTable.getElementsByTagName("template")[0].content;
    var totalTemplate = checkoutTable.getElementsByTagName("template")[1].content;
    console.debug("template: ", itemTemplate);
    console.debug("tbody: ", tbody);
    while (tbody === null || tbody === void 0 ? void 0 : tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
    var totalPrice = 0;
    Cart.getInstance().description().forEach(function (_a) {
        var item = _a.item, quantity = _a.quantity;
        var row = itemTemplate.cloneNode(true);
        var nameLabel = row.querySelectorAll("td")[0];
        var quantityLabel = row.querySelectorAll("td")[1];
        var priceLabel = row.querySelectorAll("td")[2];
        var itemPrice = item.price * quantity;
        nameLabel.textContent = "" + item.name;
        quantityLabel.textContent = "" + quantity;
        priceLabel.textContent = "" + formatAsCurrency(itemPrice);
        totalPrice += itemPrice;
        tbody.appendChild(row);
    });
    var totalRow = totalTemplate.cloneNode(true);
    totalRow.querySelectorAll("th")[1].textContent = "" + formatAsCurrency(totalPrice);
    tbody.appendChild(totalRow);
}
