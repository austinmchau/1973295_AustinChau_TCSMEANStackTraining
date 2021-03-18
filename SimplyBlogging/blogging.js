/**
 * Key to storage
 */
var storageKey = "blogDB"
var getStorage = () => { return sessionStorage }

/**
 * Prototype representing a submitted blog entry.
 * @param {string} title Title text of the blog entry.
 * @param {string} articles Body article of the blog.
 * @param {string} imagePath the name path of the image. Only works if the image is relative to the index.html
 */
function BlogEntry(title, articles, imagePath) {
    this.title = title;
    this.articles = articles;
    /* getting the image as URL, so that image from anywhere on the FS can be used. Otherwise, save only the name as path relative to the index.html*/
    this.imagePath = imagePath;
}

/**
 * Handler for when the add blog form is submitted.
 */
function onAddBlog() {
    var form = document.getElementById('addBlogForm');
    var entry = getFormData(form)
    if (entry !== null) {
        addEntry(entry);
        form.reset();
        generateBlogCards();
    }
}

/**
 * Process the form information.
 * @param {HTMLElement} form The form element.
 * @returns {BlogEntry | null} The entry.
 */
function getFormData(form) {

    var title = form.elements['titleText'].value;
    var articles = form.elements['articleText'].value;
    var imageSrc = form.elements['formFile'].files[0];

    if (title == "" || articles == "" || !imageSrc) {
        alert("All fields must be filled.");
        return null;
    } else if (!imageSrc.type.match('image.*')) {
        alert("Only image files are supported.");
        return null;
    } else {
        var entry = new BlogEntry(title, articles, imageSrc.name);
        return entry;
    }
}

/**
 * Function to use the template from the HTML and generate each cards for each blog.
 */
function generateBlogCards() {

    var blogsContainer = document.getElementById("blogEntries");
    var cardTemplate = document.getElementById("blogEntryCardTemplate");

    while (blogsContainer.firstChild) {
        blogsContainer.removeChild(blogsContainer.firstChild)
    }

    getEntries().reverse().forEach(entry => {
        var card = cardTemplate.content.cloneNode(true);
        card.querySelectorAll("h1")[0].textContent = entry.title;
        card.querySelectorAll("p")[0].textContent = entry.articles;
        card.querySelectorAll("img")[0].src = entry.imagePath;
        blogsContainer.appendChild(card);
    })
}

/**
 * Get all blog entries from storage.
 * @returns {BlogEntry[]}
 */
function getEntries() {
    var entries
    var storedEntries = getStorage().getItem(storageKey)
    if (!storedEntries) {
        entires = []
    } else {
        try {
            entires = JSON.parse(storedEntries).filter((item) => item != null)
        } catch (e) {
            if (e instanceof SyntaxError) {
                resetEntries()
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
 * Add a blog entry to the storage.
 * @param {BlogEntry} entry The entry to be added.
 */
function addEntry(entry) {
    if (!entry) {
        return;
    }
    var entries = getEntries()
    entries.push(entry)
    getStorage().setItem(
        storageKey,
        JSON.stringify(entries)
    )
}

/**
 * Clear the blog entries stored.
 */
function resetEntries() {
    getStorage().removeItem(storageKey)
}