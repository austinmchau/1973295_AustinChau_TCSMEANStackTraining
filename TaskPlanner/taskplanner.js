const http = require("http");
const url = require("url");

/*
 * MARK: - Setup / Constants
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
const deleteTaskHtml = async () => Promise.resolve(`
	<form action="/deleteTask" method="get">
		<label> Task ID <input type="text" name="taskId" required> </label>
		<button type="submit">Delete Task</button>
	</form>
`);
const listTaskBtnHtml = async (opt) => Promise.resolve(`
	<script>${opt.onClick.toString()}</script>
	<button id="listTasksBtn" onClick="${opt.onClick.name}()">Hide Tasks</button>
`);
const listTaskHtml = async () => {
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
			<tbody>
			${rows}
			</tbody>
		</table>
	`;
	/**
	 * 
	 * @param {Entry} entry 
	 * @returns {string} HTML fragment.
	 */
	const asRow = (entry) => `
		<tr>
			${entry.asFormattedEntries().map(([_, v]) => `<td>${v}</td>`).join("\n")}
		</tr>
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
 * 
 * @param {{[key: string]: any}} urlQuery 
 */
async function addTaskOnSubmit(urlQuery) {
	const entry = new Entry(urlQuery);
	return store(entry);
}

/**
 * 
 * @param {{[key: string]: any}} urlQuery 
 */
async function deleteTaskOnSubmit(urlQuery) {
	let { taskId } = urlQuery;
	if (typeof taskId === "number") { taskId = taskId.toString(); }
	return remove(taskId);
}

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
 * @property {string} empId
 * @property {string} taskId
 * @property {string} taskDesc
 * @property {Date} deadline
 */
class Entry {
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
	 * 
	 * @returns {[keyof Entry, string | Date][]}
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

class DuplicateTask extends Error {
	constructor(message = undefined, taskId) {
		super(message ?? `Entry "${taskId}" already exists. Aborting.`);
		this.name = "DuplicateTask"
		this.taskId = taskId
	}
}
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
 * @returns {Promise<Entry[]>}
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
 * 
 * @param {string} taskId 
 * @returns number
 */
async function findTaskIndex(taskId) {
	const entries = await retrieve();
	return entries.findIndex(e => e.taskId === taskId);
}
/**
 * 
 * @param {Entry} entry 
 */
async function store(entry) {
	const entries = await retrieve();
	if (await findTaskIndex(entry.taskId) !== -1) {
		throw new DuplicateTask(null, entry.taskId);
	}
	entries.push(entry);
	return fs.writeFile(dbFile, JSON.stringify(entries, null, 2));
}

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

let server = http.createServer(async (req, res) => {
	const pathInfo = url.parse(req.url, true).pathname;

	if (pathInfo === "/favicon.ico") {
		res.writeHead(404);
		res.end();
	}
	else if (pathInfo === "/") {
		res.setHeader("content-type", "text/html");
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
	} else {

		const redirectHtml = (path, ms) => `
			<script>
				setTimeout(function () {
					window.location = "${path}";
				}, ${ms})
			</script>	
		`
		/**@typedef {{onSubmit: Promise<void>, catchError: (error: Error) => {}}} Route */
		/** @type {Route[]} */
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
		/** @type {Route | undefined} */
		const route = routes[pathInfo];
		if (route && data) {
			await route.onSubmit(data)
				.then(() => res.writeHead(301, { Location: '/' }))
				.catch(route.catchError)
				.catch(console.error)
				.finally(() => res.end());
		}
	}
})


function run(port = 9000) {
	server.listen(port, () => console.info(`Server started on port ${port}.`));
}

/**
 * Main entry point when called from cli
 */
if (typeof require !== 'undefined' && require.main === module) {
	run();
}