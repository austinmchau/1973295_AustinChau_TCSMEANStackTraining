/* Variables */
/* Declaring few global variables for the sessionStorage and storage key */

var storageKey = "budgetEntries"
var getStorage = () => { return sessionStorage }

/**
 * A prototype representing a budget entry.
 * @param {string} clientName 
 * @param {string} projectName 
 * @param {number} budget 
 */
function BudgetEntry(clientName, projectName, budget) {
    this.clientName = clientName;
    this.projectName = projectName;
    this.budget = budget
}

/* Adding Entries */

/**
 * callback function for when the add budget form is being submitted
 */
function onBudgetFormSubmit() {
    var entry = getBudgetFormData()
    if (entry !== null) {
        addBudgetEntry(entry)
        document.getElementById("addBudgetForm").reset()
    }
}

/**
 * Responsible for getting input from the add budget form. 
 * Performs validation on whether any field is empty. Raise alert if so.
 * @returns {BudgetEntry|null} A budget entry.
 */
function getBudgetFormData() {
    var clientName = document.getElementById("clientName").value;
    var projectName = document.getElementById("projectName").value;
    var budget = document.getElementById("budget").value;

    if (clientName == "" || projectName == "" || budget == "") {
        alert("All fields must be filled.")
        return null;
    }
    budget = Number(budget)
    if (isNaN(budget)) {
        alert("Budget has to be a valid number.")
        return null;
    }

    var entry = new BudgetEntry(clientName, projectName, budget)
    console.log(entry)
    return entry
}

/* Rendering Entries */

/**
 * Generates the budget view table when called. 
 */
function generateBudgetTable() {
    var entries = getBudgetEntries()
    var totalBudget = 0;

    var table = document.getElementById("budgetTable")
    var body = table.getElementsByTagName("tbody")[0]

    entries.forEach((entry) => {
        if (!entry) { return }

        var row = document.createElement("tr");

        [entry.clientName, entry.projectName, entry.budget].forEach(item => {
            var cell = document.createElement("td");
            cell.appendChild(document.createTextNode(
                typeof item == 'number' ? item.toLocaleString('en-US', { style: "currency", currency: "USD" }) : item
            ));
            row.appendChild(cell);
        });

        body.appendChild(row);

        totalBudget += entry.budget;
    })

    var total = document.getElementById("budgetTotal")
    total.innerText = totalBudget.toLocaleString('en-US', { style: "currency", currency: "USD" })
}

/* Entries Storage */

/**
 * Get all budget entries from storage.
 * @returns {BudgetEntry[]} entries
 */
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

/**
 * Add an entry to the sessionStorage.
 * @param {BudgetEntry} entry 
 */
function addBudgetEntry(entry) {
    var entries = getBudgetEntries()
    entries.push(entry)
    getStorage().setItem(
        storageKey,
        JSON.stringify(entries)
    )
}

/**
 * Reset the sessionStorage for budget entries
 */
function resetBudgetEntry() {
    getStorage().removeItem(storageKey)
}