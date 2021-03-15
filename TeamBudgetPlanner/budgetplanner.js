/* Variables */

var storageKey = "budgetEntries"

/* Adding Entries */

function onBudgetFormSubmit() {
    console.log("submitted")
    var entry = getBudgetFormData()
    addBudgetEntry(entry)
}

function getBudgetFormData() {
    var entry = {}
    entry.clientName = document.getElementById("clientName").value;
    entry.projectName = document.getElementById("projectName").value;
    entry.budget = Number(document.getElementById("budget").value);

    console.log("budget form: ", entry);
    return entry
}

/* Rendering Entries */

function generateBudgetTable() {
    var entries = getBudgetEntries()
    var totalBudget = 0;

    var table = document.getElementById("budgetTable")
    var body = table.getElementsByTagName("tbody")[0]

    entries.forEach(entry => {
        var row = document.createElement("tr");

        [entry.clientName, entry.projectName, entry.budget].forEach(item => {
            var cell = document.createElement("td")
            console.log("item", item, item instanceof Number)
            cell.appendChild(document.createTextNode(
                typeof item == 'number' ? item.toLocaleString('en-US', {style: "currency", currency: "USD"}) : item
            ))
            row.appendChild(cell)
        })

        body.appendChild(row)

        totalBudget += entry.budget
    })

    var total = document.getElementById("budgetTotal")
    total.innerText = totalBudget.toLocaleString('en-US', {style: "currency", currency: "USD"})
}

/* Entries Storage */

function getBudgetEntries() {
    var entries
    var storedEntries = localStorage.getItem(storageKey)
    if (!storedEntries) {
        entires = []
    } else {
        try {
            entires = JSON.parse(storedEntries)
        } catch (e) {
            if (e instanceof SyntaxError) {
                resetBudgetEntry()
                entries = []
            }
            else {
                throw e
            }
        }
    }
    return entires
}

function addBudgetEntry(entry) {
    var entries = getBudgetEntries()
    entries.push(entry)
    localStorage.setItem(
        storageKey,
        JSON.stringify(entries)
    )
}

function resetBudgetEntry() {
    localStorage.removeItem(storageKey)
}