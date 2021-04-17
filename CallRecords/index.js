const fs = require("fs").promises;
const { MongoClient } = require("mongodb");

/** * Constants */

const dbUrl = "mongodb://localhost:27017";
const inputDataPath = "call_data.json";

/** * Representation of a Call Entry */
class CallEntry {
	constructor(obj) {
		const keys = [
			"_id",
			"source",
			"destination",
			"sourceLocation",
			"destinationLocation",
			"callDuration",
			"roaming",
			"callCharge",
		]
		const missingKey = keys.find(k => !(k in obj));
		if (missingKey !== undefined) {
			throw new TypeError(`Missing key "${missingKey}" from obj "${JSON.stringify(obj)}" for CallEntry.`);
		}
		keys.forEach(key => {
			this[key] = obj[key];
		});
	}
	/**
	 * Returns the instance as a plain JS object
	 * @returns {[key: string]: number | string}
	 */
	toObject() {
		return Object.entries(this).reduce((acc, [k, v]) => ({ ...acc, [k]: v }), Object.create({}));
	}
}

/** * READ JSON */

/**
 * Read the JSON file into array.
 * @param {PathLike | fs.FileHandle} filePath data source, e.g. call_data.json 
 */
async function ingest(filePath) {
	try {
		const file = await fs.readFile(filePath);
		const data = JSON.parse(file);
		if (!Array.isArray(data)) { throw new TypeError(`data is not an array. ${JSON.stringify(data)}`); }
		return data.map(item => new CallEntry(item));
	}
	catch (error) {
		console.error(error);
		return [];
	}
}

/** * Write to DB */

/**
 * Write a provided list of entries into the database, provided by mongoClient
 * @param {MongoClient} mongoClient
 * @param {CallEntry[]} entries 
 */
async function writeCalls(mongoClient, entries) {
	const client = await mongoClient.connect().catch(console.error);
	if (!client) { return; }

	try {
		const db = client.db("meanstack");
		const collection = db.collection("CallRecords");

		const bulk = collection.initializeUnorderedBulkOp();
		entries.map(item => item.toObject()).forEach(doc => {
			bulk.find({ _id: doc._id }).upsert().updateOne({ $set: doc });
		})
		const result = await bulk.execute();

		const { nInserted, nMatched, nModified, nRemoved, nUpserted } = result;
		console.log("Bulk write: " + [
			`Inserted: ${nInserted}`,
			`Matched: ${nMatched}`,
			`Modified: ${nModified}`,
			`Removed ${nRemoved}`,
			`Upserted ${nUpserted}`,
		].join("; "));
	}
	catch (error) {
		console.error(error);
	}
	finally {
		client.close();
	}
}

/**
 * Main driver function
 */
async function main() {
	const client = new MongoClient(dbUrl, { useUnifiedTopology: true });

	const data = await ingest(inputDataPath);
	console.log(data);
	await writeCalls(client, data);
}

/** Call driver from CLI */
if (typeof require !== 'undefined' && require.main === module) {
	main();
}