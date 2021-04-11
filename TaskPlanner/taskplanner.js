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
		<label> Task ID <input type="text" name="taskId"> </label>
		<button type="submit">Delete Task</button>
	</form>
`);
const listTaskBtnHtml = async (opt) => Promise.resolve(`
	<button onClick="${opt.onClick}()">List Task</button>
`);
const listTaskHtml = async () => {
	const asTable = (rows) => `
		<table>
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
	console.log("addTask: ", entry, JSON.stringify(entry));
	return store(entry);
}

function listTaskBtnHtmlOnClick(e) {

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
	return fs.readFile(dbFile)
		.then(JSON.parse)
		.then(data => { console.log("data: ", data); return data; })
		.then(data => data !== null ? data : [])
		.then(data => data.map(entry => {
			try {
				return new Entry(entry);
			} catch (error) {
				if (error instanceof TypeError) { return null; }
			}
		}))
		.then(data => data.filter(item => item !== null))
}
/**
 * 
 * @param {Entry} entry 
 */
async function store(entry) {
	return retrieve()
		.then(entries => {
			if (entries.find(e => e.taskId === entry.taskId)) {
				throw new DuplicateTask(null, entry.taskId);
			}
			return entries.concat(entry);
		})
		.then(payload => JSON.stringify(payload, null, 2))
		.then(json => fs.writeFile(dbFile, json));
}

async function remove(taskId) {

	const entries = await retrieve();
	const match = entries.findIndex(e => e.taskId === taskId);
	if (match === -1) { throw new NoMatch(null, taskId); }

	entries.splice(match, 1);
	return fs.writeFile(dbFile, JSON.stringify(entries, null, 2));
}

/*
 * MARK: - HTTP Server
 */

let server = http.createServer(async (req, res) => {
	const pathInfo = url.parse(req.url, true).pathname;

	if (pathInfo === "/addTask") {
		const data = url.parse(req.url, true).query;
		console.log("urlData: ", data);
		if (data) {
			try {
				await addTaskOnSubmit(data);
			} catch (error) {
				if (error instanceof DuplicateTask) {
					console.log("Duplicate task! ", error);
				}
				console.error(error);
			}
		}
		res.writeHead(301, { Location: '/' });
		res.end();
	}
	else if (pathInfo === "/") {
		res.setHeader("content-type", "text/html");
		Promise.all([
			addTaskHtml(),
			deleteTaskHtml(),
			listTaskBtnHtml({ onclick: "listTaskBtnHtmlOnClick" }),
			listTaskHtml(),
		])
			.then(fragments => fragments.join("\n"))
			.then(html => res.write(html))
			.catch(console.error)
			.finally(() => res.end());
	}

})


function run(port = 9000) {
	server.listen(port, () => console.log(`Server started on port ${port}.`));
}

/**
 * Main entry point when called from cli
 */
if (typeof require !== 'undefined' && require.main === module) {
	run();
}