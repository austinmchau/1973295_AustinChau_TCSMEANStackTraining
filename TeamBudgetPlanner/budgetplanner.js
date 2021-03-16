/* Variables */

var storageKey = "budgetEntries"
var getStorage = () => {return sessionStorage}

/* Adding Entries */

function onBudgetFormSubmit() {
    var entry = getBudgetFormData()
    if (entry !== null) {
        addBudgetEntry(entry)
        document.getElementById("addBudgetForm").reset()
    }
}

function getBudgetFormData() {
    var entry = {}
    entry.clientName = document.getElementById("clientName").value;
    entry.projectName = document.getElementById("projectName").value;
    entry.budget = Number(document.getElementById("budget").value);

    if (!entry.clientName || !entry.projectName || !budget) {
        alert("All fields must be filled.")
        return null;
    }

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
    var storedEntries = getStorage().getItem(storageKey)
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
    getStorage().setItem(
        storageKey,
        JSON.stringify(entries)
    )
}

function resetBudgetEntry() {
    getStorage().removeItem(storageKey)
}