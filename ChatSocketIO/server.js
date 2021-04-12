
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
	const displayMsg = `
		[User("${socket.id}")]
		Hello, "${message.name}".
		Your message: ${message.msg}
	`
	console.log(displayMsg);
}

/** * MARK: - Driver Functions */

/** * Serving HTML */
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

/** * Socket Management */
io.on("connection", (socket) => {
	console.log(`User("${socket.id}") connected.`);

	socket.on("newChatMessage", (msg) => onNewChatMessage(socket, msg))
});

/** * Activate server */
server.listen(9000, () => {
	console.log("Server running on *:9000");
});