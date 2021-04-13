
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);

/** * MARK: - Callbacks */

/** @typedef {{name: string, msg: string}} Message */

/**
 * 
 * @param {Message} message 
 */
function onNewChatMessage(socket, message) {
	const { name, msg } = message;
	if ([name, msg].find(i => typeof i !== "string")) {
		console.error(`Message is Invalid! ${JSON.parse(message)}`);
	} else {
		const displayMsg = [
			// `[User("${socket.id}")]`,
			`Hello, "${name}".`,
			`Your message: ${msg}`,
			""
		].join("\n");
		console.log(displayMsg);
	}
}

/** * MARK: - Driver Functions */

/** * Serving HTML */
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});
app.get("/index.css", (req, res) => {
	res.setHeader("Content-Type", "text/css")
	res.sendFile(__dirname + "/index.css");
})

/** * Socket Management */
io.on("connection", (socket) => {
	console.log(`User("${socket.id}") connected.`);

	socket.on("newChatMessage", (msg) => onNewChatMessage(socket, msg))
});

/** * Activate server */
server.listen(9000, () => {
	console.log("Server running on *:9000");
});