const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);

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

/** * CRUD operations */
app.post("/addCourse/submit", (req, res) => {
	const data = req.body;
	console.log("data: ", data);
	res.send("Courses added successfully.");
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