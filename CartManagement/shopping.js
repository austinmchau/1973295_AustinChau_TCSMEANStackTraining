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
/**
 * Return a specific inventory item by giving the item unique id.
 * @param id the id of the inventory item.
 * @returns The inventory item. Or if no match, null.
 */
function inventoryFromId(id) {
    var filtered = inventory.filter(function (item) { return item.id == id; });
    if (!(filtered === null || filtered === void 0 ? void 0 : filtered.length)) {
        return null;
    }
    return filtered[0];
}
/* Cart Storage */
/**
 * A singleton class that represents the current shopping cart.
 * Provides interface with the underlying localStorage.
 * Provides function to update and retrieve info from the cart in different formats.
 */
var Cart = /** @class */ (function () {
    function Cart() {
        // properties for accessing underlying storage
        this.storage = function () { return localStorage; };
        this.storageKey = "shoppingCart";
    }
    Cart.getInstance = function () {
        if (!Cart.instance) {
            Cart.instance = new Cart();
        }
        return Cart.instance;
    };
    /**
     * Clears the storage.
     */
    Cart.prototype.clear = function () { this.storage().removeItem(this.storageKey); };
    /**
     * Read from the storage and get the cart.
     * Represents by an object where the key is the inventory id, and value is the quantity.
     * @returns returns an object of the full cart.
     */
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
    /**
     * Write a delta into the cart.
     * e.g. partialCart = { "1": -1 } means subtracting 1 quantity of item of id "1" from the current cart.
     * @param partialCart an object represents an item to be updated.
     */
    Cart.prototype.write = function (partialCart) {
        var cart = this.read();
        for (var id in partialCart) {
            // if (!(id in cart)) { continue; }
            var prev = id in cart ? cart[id] : 0;
            var quantity = Math.max(0, prev + partialCart[id]);
            if (quantity == 0) {
                if (id in cart) {
                    delete cart[id];
                }
            }
            else {
                cart[id] = quantity;
            }
        }
        try {
            var json = JSON.stringify(cart);
            this.storage().setItem(this.storageKey, json);
        }
        catch (error) {
            this.clear();
            console.error(error);
        }
    };
    /**
     * API for adding or subtracting item into/from the cart.
     * @param itemId inventory item id.
     * @param quantity How many of item to be added to cart.
     */
    Cart.prototype.updateCart = function (itemId, quantity) {
        var _a;
        this.write((_a = {}, _a[itemId] = quantity, _a));
    };
    /**
     * Transforms the cart into a list of item with quantity.
     * Used for displaying in the checkout table.
     * @returns a List of Objects containing the inventory item and its quantity in the cart.
     */
    Cart.prototype.description = function () {
        var cart = this.read();
        return Object.keys(cart).map(function (k) {
            return {
                item: inventoryFromId(k),
                quantity: cart[k]
            };
        });
    };
    /**
     * Convenience method for getting the current quantity of a given item in the cart.
     * @param id inventory id.
     * @returns The quantity of the inventory item from the given id.
     */
    Cart.prototype.quantityFromId = function (id) {
        var cart = this.read();
        if (!(id in cart)) {
            return 0;
        }
        return cart[id];
    };
    /**
     * Convenience method for getting the size of the cart.
     * @returns Count of all items in the cart, accounting for their quantities in the cart.
     */
    Cart.prototype.cartSize = function () {
        var cart = this.read();
        return Object.keys(cart).map(function (k) { return cart[k]; }).reduce(function (prev, curr) { return prev + curr; }, 0);
    };
    return Cart;
}());
/* Listing Page */
/**
 * Function that updates the cart size count at the top of the listing page.
 */
function updateCartCount() {
    var cartCount = document.getElementById("cartCount");
    if (cartCount) {
        cartCount.innerText = "" + Cart.getInstance().cartSize();
    }
}
/**
 * Main function for generating the listing pages.
 */
function updateListing() {
    // Calls to update the cart count at least once, when generating the page.
    updateCartCount();
    // getting reference to the template and insertion point from DOM.
    var listingArea = document.getElementById("listingArea");
    var listingTemplate = document.getElementById("listingTemplate").content;
    /* cleaning up the listingArea first */
    while (listingArea === null || listingArea === void 0 ? void 0 : listingArea.firstChild) {
        listingArea.removeChild(listingArea.firstChild);
    }
    // iterate through the inventory
    inventory.forEach(function (entry) {
        // getting the elements from DOM
        var card = listingTemplate.cloneNode(true);
        var nameLabel = card.querySelectorAll("h2")[0];
        var priceLabel = card.getElementById("priceLabel");
        var quantitySubButton = card.querySelectorAll("button")[0];
        var quantityLabel = card.getElementById("quantityLabel");
        var quantityAddButton = card.querySelectorAll("button")[1];
        var imagePreview = card.querySelectorAll("img")[0];
        // changing the label ids as we're inserting it back to DOM
        var quantityLabelId = "quantityLabel-" + entry.id;
        quantityLabel.id = quantityLabelId;
        var priceLabelId = "priceLabel-" + entry.id;
        priceLabel.id = priceLabelId;
        // changing the labels
        nameLabel.textContent = "" + entry.name;
        priceLabel.innerText = "" + formatAsCurrency(entry.price);
        // abstracting the functions that get the quantity for the particular item
        var quantityFromId = function (id) { return "" + Cart.getInstance().quantityFromId(id); };
        // abstracting the callback for when the +/- buttons are clicked
        var quantityButtonOnClick = function (ev, delta) {
            Cart.getInstance().updateCart(entry.id, delta);
            var label = document.getElementById(quantityLabelId);
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
/**
 * Function for generating the checkout table.
 */
function updateCheckoutTable() {
    // getting reference to the table.
    var checkoutTable = document.getElementById("checkoutTable");
    if (!checkoutTable) {
        console.error("Empty checkoutTable");
        return;
    }
    // getting reference to the entry template rows and the total row.
    var tbody = checkoutTable.getElementsByTagName("tbody")[0];
    var itemTemplate = checkoutTable.getElementsByTagName("template")[0].content;
    var totalTemplate = checkoutTable.getElementsByTagName("template")[1].content;
    // clear table if needed.
    while (tbody === null || tbody === void 0 ? void 0 : tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
    // iterate through the cart. Also calculating the total.
    var totalPrice = 0;
    Cart.getInstance().description().forEach(function (_a) {
        var item = _a.item, quantity = _a.quantity;
        // getting the ref to the cells.
        var row = itemTemplate.cloneNode(true);
        var _b = Array.from(row.querySelectorAll("td").values()), nameLabel = _b[0], listedPriceLabel = _b[1], quantityLabel = _b[2], subtotalPriceLabel = _b[3];
        // updating the values
        var subtotalPrice = item.price * quantity;
        nameLabel.textContent = "" + item.name;
        listedPriceLabel.textContent = "" + formatAsCurrency(item.price);
        quantityLabel.textContent = "" + quantity;
        subtotalPriceLabel.textContent = "" + formatAsCurrency(subtotalPrice);
        // finalizing
        totalPrice += subtotalPrice;
        tbody.appendChild(row);
    });
    // update the total value
    var totalRow = totalTemplate.cloneNode(true);
    totalRow.querySelectorAll("th")[1].textContent = "" + Cart.getInstance().cartSize();
    totalRow.querySelectorAll("th")[2].textContent = "" + formatAsCurrency(totalPrice);
    tbody.appendChild(totalRow);
}
