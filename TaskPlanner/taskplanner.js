const http = require("http");
const url = require("url");

const addTaskHtml = async () => Promise.resolve(`
	<form action="/addTask" method="get">
		<label> Employee ID <input type="text" name="empId"> </label> <br/>
		<label> Task ID <input type="text" name="taskId"> </label> <br/>
		<label> Task <input type="text" name="taskDesc"> </label> <br/>
		<label> Deadline <input type="date" name="deadline"> </label> <br/>
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
	const table = (rows) => `
		<table>
		${rows}
		</table>
	`;
	const tableRow = (entry) => `
		<td>Entry</td>
	`
	return retrieve()
		.then(entries => entries.map(entry => tableRow(entry)))
		.then(rows => table(rows))
}

function listTaskBtnHtmlOnClick(e) {

}

/**
 * 
 * @param {{[key: string]: any}} data 
 */
function addTask(data) {
	const entry = Entry(data);
	store(entry);
}

/*
 * MARK: - Storage
 */

class Entry {
	constructor(options) {
		const { empId, taskId, taskDesc, deadline } = options;
		this.empId = empId;
		this.taskId = taskId;
		this.taskDesc = taskDesc;
		this.deadline = deadline;
	}
}

class DuplicateTask extends Error { }

const fs = require("fs").promises;
const dbFile = "tasks.json";


/**
 * @returns {Promise<Entry[]>}
 */
async function retrieve() {
	return fs.readFile(dbFile)
		.then(JSON.parse)
}
/**
 * 
 * @param {Entry} entry 
 */
function store(entry) {
	retrieve()
		.then(entries => {
			if (entries.find(e => e.taskId === entry.taskId)) {
				throw new DuplicateTask(`Entry "${entry.taskId}" already exists. Aborting.`)
			}
			return entries.push(entry);
		})
		.then(JSON.stringify)
		.then(json => fs.writeFile(dbFile, json));
}

let server = http.createServer((req, res) => {
	const pathInfo = url.parse(req.url, true).pathname;

	if (pathInfo === "/addTask") {
		const data = url.parse(req.url, true).query;
		console.log("Data: ", data);
	}

	res.setHeader("content-type", "text/html");
	Promise.all([
		addTaskHtml(),
		deleteTaskHtml(),
		listTaskBtnHtml({onclick: "listTaskBtnHtmlOnClick"}),
		listTaskHtml(),
	])
		.then(fragments => fragments.join("\n"))
		.then(html => res.write(html))
		.catch(console.error)
		.finally(() => res.end());
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