
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);

/** * MARK: - Callbacks */

/** @typedef {{name: string, msg: string}} Message a Chat Message */

/**
 * Function to receive socket new chat message from frontend
 * @param {any} socket a reference to the socket
 * @param {Message} message new chat message
 */
function onNewChatMessage(socket, message) {
	const { name, msg } = message;
	if ([name, msg].find(i => typeof i !== "string")) {
		console.error(`Message is Invalid! ${JSON.parse(message)}`);
	} else {
		const displayMsg = [
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
/** * Serve a CSS file quickly from root dir */
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
function run(port = 9000) {
	server.listen(port, () => {
		console.log(`Server running on *:${port}`);
	});
}

/** * Main entry point when called from cli */
if (typeof require !== 'undefined' && require.main === module) {
	run();
}