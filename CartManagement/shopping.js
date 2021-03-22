var inventory = [
    {
        "id": "1",
        "name": "Laptop",
        "price": 500
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
];
function updateCart(options) {
    console.debug("updating cart: ", options.itemId);
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
        var card = listingTemplate.cloneNode(true);
        console.debug("card: ", card);
        var nameLabel = card.querySelectorAll("h2")[0];
        var priceLabel = card.querySelectorAll("h2")[1];
        var quantityButton = card.querySelectorAll("input")[0];
        nameLabel.textContent = "Name: " + entry.name;
        priceLabel.textContent = "Price: " + entry.price;
        quantityButton.onclick = (function (ev) { return updateCart({ itemId: entry.id }); });
        listingArea.appendChild(card);
    });
}
