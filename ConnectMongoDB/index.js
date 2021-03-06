const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const dbModel = require("./dbmodel");

/** * Middleware */
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

/** * MARK: - Driver Functions */

/** * Serve a CSS file quickly from root dir */
app.get("/main.css", (req, res) => {
	res.setHeader("Content-Type", "text/css")
	res.sendFile(__dirname + "/main.css");
})
/** * Serving HTML */
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});
/** * Serving Endpoints */
["addCourse", "updateCourse", "deleteCourse", "fetchCourses"].forEach(endpoint => {
	app.get(`/${endpoint}`, (req, res) => {
		res.sendFile(__dirname + `/${endpoint}.html`);
	});
})

const redirectHtml = (path, ms) => `
	<script>
		setTimeout(function () {
			window.location = "${path}";
		}, ${ms})
	</script>	
`
/** * CRUD operations */
app.post("/addCourse/submit", async (req, res) => {
	const data = req.body;
	console.log("data: ", data);
	try {
		await dbModel.addCourse(data);
		res.status(200).send(redirectHtml("/", 2000) + "Courses added successfully.");
	}
	catch (error) {
		res.status(500).send(redirectHtml("/", 2000) + "Course fail to be added.");
	}
})
app.post("/updateCourse/submit", async (req, res) => {
	const data = req.body;
	console.log("data: ", data);
	try {
		await dbModel.updateCourse(data);
		res.status(200).send(redirectHtml("/", 2000) + "Courses updated successfully.");
	}
	catch (error) {
		res.status(500).send(redirectHtml("/", 2000) + "Course fail to be updated.");
	}
})
app.post("/deleteCourse/submit", async (req, res) => {
	const data = req.body;
	console.log("data: ", data);
	try {
		await dbModel.deleteCourse(data);
		res.status(200).send(redirectHtml("/", 2000) + "Courses deleted successfully.");
	}
	catch (error) {
		res.status(500).send(redirectHtml("/", 2000) + "Course fail to be deleted.");
	}
})
app.get("/fetchCourses/courses", async (req, res) => {
	try {
		const entries = await dbModel.listCourses();
		res.status(200).header({ "Content-Type": "text/json" }).send(entries);
	}
	catch (error) {
		console.error(error);
		res.status(500).header({ "Content-Type": "text/json" }).send([]);
	}
})

/** * Activate server */
function run(port = 9000) {
	server.listen(port, () => {
		console.log(`Server running on *:${port}`);
	});
}

/** * Main entry point when called from cli */
if (typeof require !== 'undefined' && require.main === module) {
	run();
}