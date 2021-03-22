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
        "price": 800
    },
    {
        "id": "3",
        "name": "Monitor",
        "price": 250
    },
    {
        "id": "4",
        "name": "Keyboard",
        "price": 80
    },
    {
        "id": "5",
        "name": "Smart Phone",
        "price": 1200
    },
    {
        "id": "6",
        "name": "Mouse",
        "price": 30
    }
]


interface InventoryItem {
    id: string,
    name: string,
    price: number,
    imageUrl?: string,
}

function updateCart(options: { itemId: string }) {
    console.debug("updating cart: ", options.itemId);
}

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
        let quantityButton = card.querySelectorAll("input")[0];
        let imagePreview = card.querySelectorAll("img")[0];
        nameLabel.textContent = `Name: ${entry.name}`;
        priceLabel.textContent = `Price: ${entry.price}`;
        quantityButton.onclick = (ev => updateCart({ itemId: entry.id }));
        if (!entry.imageUrl) {
            imagePreview.remove();
        } else {
            imagePreview.src = entry.imageUrl;
        }
        listingArea.appendChild(card);
    })
}