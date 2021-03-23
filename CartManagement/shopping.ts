/* Prototypes */

/**
 * A mock db of all possible inventory for purchase.
 */
const inventory: InventoryItem[] = [
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
]

/**
 * Interface for a specific item.
 */
interface InventoryItem {
    id: string,
    name: string,
    price: number,
    imageUrl?: string,
}


/* Utilities */

/**
 * A util function for formatting a number into US currency.
 * @param value a number that to be converted to currency format.
 * @returns a formatted string representing the monetary value.
 */
function formatAsCurrency(value: number): string {
    return Intl.NumberFormat('en-US', {
        style: "currency",
        currency: "USD",
    }).format(value);
}

function inventoryFromId(id: string): InventoryItem | null {
    const filtered = inventory.filter(item => item.id == id);
    if (!filtered?.length) { return null; }
    return filtered[0];
}

/* Cart Storage */

class Cart {

    private static instance: Cart;
    private constructor() { }

    public static getInstance(): Cart {
        if (!Cart.instance) {
            Cart.instance = new Cart();
        }
        return Cart.instance;
    }

    protected storage = () => localStorage;
    protected readonly storageKey = "shoppingCart";

    protected clear() { this.storage().removeItem(this.storageKey); }
    protected read(): { [id: string]: number } {
        const store = this.storage().getItem(this.storageKey);
        if (store === null) {
            return {};
        } else {
            try {
                return JSON.parse(store);
            } catch (error) {
                this.clear();
                console.error(error);
                return {};
            }
        }
    }
    protected write(partialCart: { [id: string]: number }) {
        const cart = this.read();
        console.debug("write cart: ", cart);
        console.debug("partial cart: ", partialCart);
        for (const id in partialCart) {
            if (!(id in cart)) { cart[id] = 0; }
            cart[id] = Math.max(0, cart[id] + partialCart[id]);
        }
        console.debug("write cart after: ", cart);
        try {
            const json = JSON.stringify(cart);
            this.storage().setItem(this.storageKey, json);
        } catch (error) {
            this.clear();
            console.error(error);
        }
    }

    updateCart(itemId: string, quantity: number) {
        console.debug("updating cart: ", itemId, quantity);
        this.write({ [itemId]: quantity });
    }

    description(): { item: InventoryItem, quantity: number }[] {
        const cart = this.read();
        return Object.keys(cart).map(k => {
            return {
                item: inventoryFromId(k),
                quantity: cart[k]
            };
        })
    }

    quantityFromId(id: string): number | null {
        const cart = this.read();
        if (!(id in cart)) { return null; }
        return cart[id];
    }
}

/* Listing Page */

function updateListing() {
    let listingArea = document.getElementById("listingArea");
    let listingTemplate = (document.getElementById("listingTemplate") as HTMLTemplateElement).content;

    console.debug("listingArea: ", listingArea);
    console.debug("listingTemplate: ", listingTemplate);

    /* cleaning up the listingArea first */
    while (listingArea?.firstChild) {
        listingArea.removeChild(listingArea.firstChild);
    }

    inventory.forEach(entry => {
        let card = listingTemplate.cloneNode(true) as DocumentFragment;
        console.debug("card: ", card);
        let nameLabel = card.querySelectorAll("h2")[0];
        let priceLabel = card.querySelectorAll("p")[0];
        let quantitySubButton = card.querySelectorAll("button")[0];
        let quantityLabel = card.getElementById("quantityLabel");
        let quantityAddButton = card.querySelectorAll("button")[1];
        let imagePreview = card.querySelectorAll("img")[0];
        nameLabel.textContent = `${entry.name}`;
        priceLabel.textContent = `Price: ${formatAsCurrency(entry.price)}`;
        const labelId = `quantityLabel-${entry.id}`;
        quantityLabel.id = labelId;
        quantityLabel.innerText = `${Cart.getInstance().quantityFromId(entry.id)}`;
        quantitySubButton.onclick = (ev => {
            Cart.getInstance().updateCart(entry.id, -1);
            let label = document.getElementById(labelId)
            if (label !== null) {
                label.innerText = `${Cart.getInstance().quantityFromId(entry.id)}`;
            }
        });
        quantityAddButton.onclick = (ev => {
            Cart.getInstance().updateCart(entry.id, 1);
            let label = document.getElementById(labelId)
            if (label !== null) {
                label.innerText = `${Cart.getInstance().quantityFromId(entry.id)}`;
            }
        });
        if (!entry.imageUrl) {
            imagePreview.remove();
        } else {
            imagePreview.src = entry.imageUrl;
        }
        listingArea.appendChild(card);
    })
}

/* Checkout */

function updateCheckoutTable() {
    console.debug("Checkout table: ", Cart.getInstance().description());

    let checkoutTable = document.getElementById("checkoutTable");
    if (!checkoutTable) { console.error("Empty checkoutTable"); return; }
    let tbody = checkoutTable.getElementsByTagName("tbody")[0];
    let itemTemplate = (checkoutTable.getElementsByTagName("template")[0] as HTMLTemplateElement).content;
    let totalTemplate = (checkoutTable.getElementsByTagName("template")[1] as HTMLTemplateElement).content;

    console.debug("template: ", itemTemplate);
    console.debug("tbody: ", tbody);

    while (tbody?.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    let totalPrice = 0;
    Cart.getInstance().description().forEach(({ item, quantity }) => {
        let row = itemTemplate.cloneNode(true) as DocumentFragment;
        let nameLabel = row.querySelectorAll("td")[0];
        let quantityLabel = row.querySelectorAll("td")[1];
        let priceLabel = row.querySelectorAll("td")[2];

        let itemPrice = item.price * quantity;
        nameLabel.textContent = `${item.name}`;
        quantityLabel.textContent = `${quantity}`;
        priceLabel.textContent = `${formatAsCurrency(itemPrice)}`;

        totalPrice += itemPrice;
        tbody.appendChild(row);
    })
    let totalRow = totalTemplate.cloneNode(true) as DocumentFragment;
    totalRow.querySelectorAll("th")[1].textContent = `${formatAsCurrency(totalPrice)}`;
    tbody.appendChild(totalRow);
}