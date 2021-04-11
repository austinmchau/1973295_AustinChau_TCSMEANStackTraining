const http = require("http");
const url = require("url");

/*
 * MARK: - Setup / Constants
 */

/**
 * Return HTML the form to add a task.
 * @returns HTML fragment
 */
const addTaskHtml = async () => Promise.resolve(`
	<form action="/addTask" method="get">
		<label> Employee ID <input type="text" name="empId" required> </label> <br/>
		<label> Task ID <input type="text" name="taskId" required> </label> <br/>
		<label> Task <input type="text" name="taskDesc" required> </label> <br/>
		<label> Deadline <input type="date" name="deadline" required> </label> <br/>
		<button type="submit">Add Task</button>
	</form>
`);
/**
 * Return HTML for the Form that deletes a task
 * @returns HTML fragment
 */
const deleteTaskHtml = async () => Promise.resolve(`
	<form action="/deleteTask" method="get">
		<label> Task ID <input type="text" name="taskId" required> </label>
		<button type="submit">Delete Task</button>
	</form>
`);
/**
 * Return HTML for the List / Hide Task Table button.
 * @param {{onClick: () => {}}} opt Pass parameters required
 * @returns HTML fragment
 */
const listTaskBtnHtml = async (opt) => Promise.resolve(`
	<script>${opt.onClick.toString()}</script>
	<button id="listTasksBtn" onClick="${opt.onClick.name}()">Hide Tasks</button>
`);
/**
 * Returns the HTML for the task table
 * @returns HTML fragment
 */
const listTaskHtml = async () => {
	/**
	 * Generate the Task Table.
	 * @param {string} rows a formatted table row.
	 * @returns HTML string for the task table
	 */
	const asTable = (rows) => `
		<table id="tasksTable">
			<thead>
				<tr>
					<th>Employee ID</th>
					<th>Task ID</th>
					<th>Description</th>
					<th>Deadline</th>
				</tr>
			</thead>
			<tbody> ${rows} </tbody>
		</table>
	`;
	/**
	 * Convert an entry into table row.
	 * @param {Entry} entry a task entry
	 * @returns {string} HTML fragment.
	 */
	const asRow = (entry) => `
		<tr> ${entry.asFormattedEntries().map(([_, v]) => `<td>${v}</td>`).join("\n")} </tr>
	`
	return retrieve()
		.then(entries => entries.map(asRow))
		.then(rows => rows.join("\n"))
		.then(asTable)
}

/*
 * MARK: - Callbacks
 */

/**
 * The OnSubmit callback for the addTask form. Returns the storage promise.
 * @param {{[key: string]: any}} urlQuery url params from the form
 * @returns Promise after storing the entry
 */
async function addTaskOnSubmit(urlQuery) {
	const entry = new Entry(urlQuery);
	return store(entry);
}

/**
 * The OnSubmit callback for the deleteTask form. Returns the removal promise.
 * @param {{[key: string]: any}} urlQuery 
 * @returns Promise after removing the entry
 */
async function deleteTaskOnSubmit(urlQuery) {
	let { taskId } = urlQuery;
	if (typeof taskId === "number") { taskId = taskId.toString(); }
	return remove(taskId);
}

/**
 * Callback for the List/Hide table button.
 * Hide or show the table, change the button's text accordingly.
 * @param {Event} e The OnClick HTML event
 */
function listTaskBtnHtmlOnClick(e) {
	let table = document.getElementById("tasksTable");
	let btn = document.getElementById("listTasksBtn");
	let state = table.style.display;
	table.style.display = state === "none" ? "table" : "none";
	btn.innerText = state === "none" ? "List Tasks" : "Hide Tasks";
}

/*
 * MARK: - Storage
 */

/**
 * Class representing a task entry.
 * @property {string} empId
 * @property {string} taskId
 * @property {string} taskDesc
 * @property {Date} deadline
 */
class Entry {
	/**
	 * Constructor. Throws TypeError if the options are invalid as an Entry.
	 * @param {{[key: string]: any}} options html params
	 * @throws {TypeError} options missing key or deadline is not a valid date.
	 */
	constructor(options) {
		["empId", "taskId", "taskDesc", "deadline"].forEach(key => {
			const value = options[key];
			if (typeof value !== "string") {
				throw new TypeError(`Entry["${key}"] is invalid: ${value}`);
			}

			if (key === "deadline") {
				const deadline = new Date(value);
				if (isNaN(deadline.getTime())) {
					throw new TypeError(`Invalid date: ${value}`);
				}
				this[key] = deadline;
			} else {
				this[key] = value;
			}
		})
	}

	/**
	 * Returns an array of [Key, Value] tuple that represents the entry.
	 * Order is ["empId", "taskId", "taskDesc", "deadline"]
	 * @returns {[keyof Entry, string | Date][]} An array of [key, value] tuple representing the Entry.
	 */
	asFormattedEntries() {
		return ["empId", "taskId", "taskDesc", "deadline"].map(key => {
			if (key === "deadline") {
				return [key, this[key].toLocaleDateString()];
			} else {
				return [key, this[key]];
			}
		});
	}
}

/**
 * Error representing a duplicate task when adding to storage
 */
class DuplicateTask extends Error {
	constructor(message = undefined, taskId) {
		super(message ?? `Entry "${taskId}" already exists. Aborting.`);
		this.name = "DuplicateTask"
		this.taskId = taskId
	}
}
/**
 * Error representing that a given taskId is not found in storage
 */
class NoMatch extends Error {
	constructor(message = undefined, taskId) {
		super(message ?? `${taskId} does not match any stored tasks.`);
		this.name = "NoMatch"
		this.taskId = taskId;
	}
}

const fs = require("fs").promises;
const dbFile = "tasks.json";

/**
 * Returns the stored entries. 
 * Returns [] if malformed JSON, or filter out malformed array items.
 * @returns {Promise<Entry[]>} The stored entries
 */
async function retrieve() {
	/** @type {Array<{[key: string]: any}>} */
	const data = await fs.readFile(dbFile)
		.then(JSON.parse)
		.catch(error => { if (error instanceof SyntaxError) { return []; } throw error; })

	return data.reduce(
		/** @param {Entry[]} entries */
		(entries, obj) => {
			try { entries.push(new Entry(obj)); }
			catch (error) { if (error instanceof TypeError) { console.warn(error); } throw error; }

			return entries;
		}, [])
}
/**
 * Returns the index of the entry with the matching taskId.
 * Similar to the Array.prototype.findIndex function.
 * @param {string} taskId 
 * @returns {number}
 */
async function findTaskIndex(taskId) {
	const entries = await retrieve();
	return entries.findIndex(e => e.taskId === taskId);
}
/**
 * Store the given entry.
 * @param {Entry} entry Task Entry.
 * @returns {Promise<void>} the writeFile promise
 * @throws {DuplicateTask} the taskId is already in use.
 */
async function store(entry) {
	const entries = await retrieve();
	if (await findTaskIndex(entry.taskId) !== -1) {
		throw new DuplicateTask(null, entry.taskId);
	}
	entries.push(entry);
	return fs.writeFile(dbFile, JSON.stringify(entries, null, 2));
}

/**
 * Remove the entry with the given Id.
 * @param {string} taskId the TaskId
 * @returns {Promise<void>} the writeFile promise
 * @throws {NoMatch} the taskId is not found.
 */
async function remove(taskId) {
	const entries = await retrieve();
	const match = await findTaskIndex(taskId);
	if (match === -1) { throw new NoMatch(null, taskId); }

	entries.splice(match, 1);
	return fs.writeFile(dbFile, JSON.stringify(entries, null, 2));
}

/*
 * MARK: - HTTP Server
 */

/**
 * The main createServer object
 */
let server = http.createServer(async (req, res) => {
	const pathInfo = url.parse(req.url, true).pathname;

	/**
	 * Ignore favicon
	 */
	if (pathInfo === "/favicon.ico") {
		res.writeHead(404);
		res.end();
	}
	/**
	 * the main root html
	 */
	else if (pathInfo === "/") {
		res.setHeader("content-type", "text/html");
		/**
		 * completes all the promise that generates the html template.
		 * then write it to the response
		 */
		await Promise.all([
			addTaskHtml(),
			deleteTaskHtml(),
			listTaskBtnHtml({ onClick: listTaskBtnHtmlOnClick }),
			listTaskHtml(),
		])
			.then(fragments => fragments.join("\n"))
			.then(html => res.write(html))
			.catch(console.error)
			.finally(() => res.end());
	}
	/**
	 * Handles all other routes.
	 */
	else {

		/**
		 * A factory that returns a script tag with an auto redirect function.
		 * @param {string} path A path/url where the page should direct to.
		 * @param {number} ms the millisecond for the setTimeout
		 * @returns and HTML <script> that auto redirects the page
		 */
		const redirectHtml = (path, ms) => `
			<script>
				setTimeout(function () {
					window.location = "${path}";
				}, ${ms})
			</script>	
		`
		/**
		 * @typedef {Object} Route A route 
		 * @property {Promise<void>} onSubmit the function to be executed when landing on the route.
		 * @property {(error: Error) => {}} catchError callback to process any errors thrown from onSubmit
		 * 
		*/
		/** 
		 * An object of routes where the key is matched with the pathInfo.
		 * @type {Route[]} 
		 * */
		const routes = {
			"/addTask": {
				"onSubmit": addTaskOnSubmit,
				"catchError": (error) => {
					if (error instanceof DuplicateTask) {
						res.write(`<p>Duplicate task! (Task ID: "${error.taskId}") Try again.</p>`)
						res.write(redirectHtml("/", 2000));
					} else {
						throw error;
					}
				},
			},
			"/deleteTask": {
				"onSubmit": deleteTaskOnSubmit,
				"catchError": (error) => {
					if (error instanceof NoMatch) {
						res.write(`<p>Task ID "${error.taskId}" does not exist! Try again.</p>`);
						res.write(redirectHtml("/", 2000));
					} else {
						throw error;
					}
				},
			},
		}

		const data = url.parse(req.url, true).query;
		/**
		 * Obtain a Route with a given pathInfo.
		 * @type {?Route}
		 */
		const route = routes[pathInfo];
		if (route && data) {
			/**
			 * Execute the retrieved Route.
			 * If onSubmit is successful, immediately return to root.
			 * Otherwise runs catchError.
			 */
			await route.onSubmit(data)
				.then(() => res.writeHead(301, { Location: '/' }))
				.catch(route.catchError)
				.catch(console.error)
				.finally(() => res.end());
		}
	}
})


/**
 * Driver function to be called if imported.
 * @param {number} port port to run server
 */
function run(port = 9000) {
	server.listen(port, () => console.info(`Server started on port ${port}.`));
}

/**
 * Main entry point when called from cli
 */
if (typeof require !== 'undefined' && require.main === module) {
	run();
}