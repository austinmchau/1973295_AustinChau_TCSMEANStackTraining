
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);
const { MongoClient } = require("mongodb");

/** * Constants */
const dbUrl = "mongodb://localhost:27017";

/** * MARK: - MongoDB */

/**@typedef {{name: string, message: string}} DBEntry */

async function getClient() {
	const mongoClient = new MongoClient(dbUrl, { useUnifiedTopology: true });
	const client = await mongoClient.connect().catch(console.error);
	if (!client) { throw new TypeError(`Empty Client`); }
	return client;
}

/**
 * Writing the socket message into MongoDB
 * @param { string } name
 * @param { string } msg
 */
async function addMessage({ name, msg }) {
	try {
		const invalidProp = [name, msg].find(prop => typeof prop !== "string");
		if (invalidProp !== undefined) { throw new TypeError(`Invalid prop: ${invalidProp}`); }

		/**@type {DBEntry} */
		const payload = { name: name, message: msg };

		const client = await getClient();
		try {
			const db = client.db("meanstack");
			const collection = db.collection("ChatSocketIO");

			const { insertedCount } = await collection.insertOne(payload);
			console.log(`Inserted ${insertedCount} message. ${JSON.stringify(payload)}`);
		}
		catch (error) {
			console.error(error);
		}
		finally {
			client.close();
		}

	}
	catch (error) {
		console.error(error);
		return;
	}

}

/** * MARK: - Callbacks */

/** @typedef {{name: string, msg: string}} Message a Chat Message */

/**
 * Function to receive socket new chat message from frontend
 * @param {any} socket a reference to the socket
 * @param {Message} message new chat message
 */
async function onNewChatMessage(socket, message) {
	const { name, msg } = message;
	if ([name, msg].find(i => typeof i !== "string")) {
		console.error(`Message is Invalid! ${JSON.parse(message)}`);
	} else {
		await addMessage({ name: name, msg: msg });
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
	socket.on("newChatMessage", async (msg) => await onNewChatMessage(socket, msg))
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