/* Prototypes */
/**
 * A mock db of all possible inventory for purchase.
 */
const inventory = [
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
        currency: "USD",
    }).format(value);
}
/**
 * Return a specific inventory item by giving the item unique id.
 * @param id the id of the inventory item.
 * @returns The inventory item. Or if no match, null.
 */
function inventoryFromId(id) {
    const filtered = inventory.filter(item => item.id == id);
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
class Cart {
    constructor() {
        // properties for accessing underlying storage
        this.storage = () => localStorage;
        this.storageKey = "shoppingCart";
    }
    static getInstance() {
        if (!Cart.instance) {
            Cart.instance = new Cart();
        }
        return Cart.instance;
    }
    /**
     * Clears the storage.
     */
    clear() { this.storage().removeItem(this.storageKey); }
    /**
     * Read from the storage and get the cart.
     * Represents by an object where the key is the inventory id, and value is the quantity.
     * @returns returns an object of the full cart.
     */
    read() {
        const store = this.storage().getItem(this.storageKey);
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
    }
    /**
     * Write a delta into the cart.
     * e.g. partialCart = { "1": -1 } means subtracting 1 quantity of item of id "1" from the current cart.
     * @param partialCart an object represents an item to be updated.
     */
    write(partialCart) {
        const cart = this.read();
        for (const id in partialCart) {
            // if (!(id in cart)) { continue; }
            const prev = id in cart ? cart[id] : 0;
            const quantity = Math.max(0, prev + partialCart[id]);
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
            const json = JSON.stringify(cart);
            this.storage().setItem(this.storageKey, json);
        }
        catch (error) {
            this.clear();
            console.error(error);
        }
    }
    /**
     * API for adding or subtracting item into/from the cart.
     * @param itemId inventory item id.
     * @param quantity How many of item to be added to cart.
     */
    updateCart(itemId, quantity) {
        this.write({ [itemId]: quantity });
    }
    /**
     * Transforms the cart into a list of item with quantity.
     * Used for displaying in the checkout table.
     * @returns a List of Objects containing the inventory item and its quantity in the cart.
     */
    description() {
        const cart = this.read();
        return Object.keys(cart).map(k => {
            return {
                item: inventoryFromId(k),
                quantity: cart[k]
            };
        });
    }
    /**
     * Convenience method for getting the current quantity of a given item in the cart.
     * @param id inventory id.
     * @returns The quantity of the inventory item from the given id.
     */
    quantityFromId(id) {
        const cart = this.read();
        if (!(id in cart)) {
            return 0;
        }
        return cart[id];
    }
    /**
     * Convenience method for getting the size of the cart.
     * @returns Count of all items in the cart, accounting for their quantities in the cart.
     */
    cartSize() {
        const cart = this.read();
        return Object.keys(cart).map(k => cart[k]).reduce((prev, curr) => prev + curr, 0);
    }
}
/* Listing Page */
/**
 * Function that updates the cart size count at the top of the listing page.
 */
function updateCartCount() {
    let cartCount = document.getElementById("cartCount");
    if (cartCount) {
        cartCount.innerText = `${Cart.getInstance().cartSize()}`;
    }
}
/**
 * Main function for generating the listing pages.
 */
function updateListing() {
    // Calls to update the cart count at least once, when generating the page.
    updateCartCount();
    // getting reference to the template and insertion point from DOM.
    let listingArea = document.getElementById("listingArea");
    let listingTemplate = document.getElementById("listingTemplate").content;
    /* cleaning up the listingArea first */
    while (listingArea === null || listingArea === void 0 ? void 0 : listingArea.firstChild) {
        listingArea.removeChild(listingArea.firstChild);
    }
    // iterate through the inventory
    inventory.forEach(entry => {
        // getting the elements from DOM
        let card = listingTemplate.cloneNode(true);
        let nameLabel = card.querySelectorAll("h2")[0];
        let priceLabel = card.getElementById("priceLabel");
        let quantitySubButton = card.querySelectorAll("button")[0];
        let quantityLabel = card.getElementById("quantityLabel");
        let quantityAddButton = card.querySelectorAll("button")[1];
        let imagePreview = card.querySelectorAll("img")[0];
        // changing the label ids as we're inserting it back to DOM
        const quantityLabelId = `quantityLabel-${entry.id}`;
        quantityLabel.id = quantityLabelId;
        const priceLabelId = `priceLabel-${entry.id}`;
        priceLabel.id = priceLabelId;
        // changing the labels
        nameLabel.textContent = `${entry.name}`;
        priceLabel.innerText = `${formatAsCurrency(entry.price)}`;
        // abstracting the functions that get the quantity for the particular item
        const quantityFromId = (id) => `${Cart.getInstance().quantityFromId(id)}`;
        // abstracting the callback for when the +/- buttons are clicked
        const quantityButtonOnClick = (ev, delta) => {
            Cart.getInstance().updateCart(entry.id, delta);
            let label = document.getElementById(quantityLabelId);
            if (label !== null) {
                label.innerText = quantityFromId(entry.id);
            }
            updateCartCount();
        };
        // updating the quantity labels and buttons
        quantityLabel.innerText = `${Cart.getInstance().quantityFromId(entry.id)}`;
        quantitySubButton.onclick = (ev => quantityButtonOnClick(ev, -1));
        quantityAddButton.onclick = (ev => quantityButtonOnClick(ev, 1));
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
    let checkoutTable = document.getElementById("checkoutTable");
    if (!checkoutTable) {
        console.error("Empty checkoutTable");
        return;
    }
    // getting reference to the entry template rows and the total row.
    let tbody = checkoutTable.getElementsByTagName("tbody")[0];
    let itemTemplate = checkoutTable.getElementsByTagName("template")[0].content;
    let totalTemplate = checkoutTable.getElementsByTagName("template")[1].content;
    // clear table if needed.
    while (tbody === null || tbody === void 0 ? void 0 : tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
    // iterate through the cart. Also calculating the total.
    let totalPrice = 0;
    Cart.getInstance().description().forEach(({ item, quantity }) => {
        // getting the ref to the cells.
        let row = itemTemplate.cloneNode(true);
        let [nameLabel, listedPriceLabel, quantityLabel, subtotalPriceLabel] = Array.from(row.querySelectorAll("td").values());
        // updating the values
        let subtotalPrice = item.price * quantity;
        nameLabel.textContent = `${item.name}`;
        listedPriceLabel.textContent = `${formatAsCurrency(item.price)}`;
        quantityLabel.textContent = `${quantity}`;
        subtotalPriceLabel.textContent = `${formatAsCurrency(subtotalPrice)}`;
        // finalizing
        totalPrice += subtotalPrice;
        tbody.appendChild(row);
    });
    // update the total value
    let totalRow = totalTemplate.cloneNode(true);
    totalRow.querySelectorAll("th")[1].textContent = `${Cart.getInstance().cartSize()}`;
    totalRow.querySelectorAll("th")[2].textContent = `${formatAsCurrency(totalPrice)}`;
    tbody.appendChild(totalRow);
}
