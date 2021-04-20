const { MongoClient, Db } = require("mongodb");

/** * Constants */
const dbUrl = "mongodb://localhost:27017";

class CourseEntry {
	constructor({ courseId, courseName, description, amount }) {
		const invalidProp = [courseId, courseName, description, amount].find(item => typeof item !== "string");
		if (invalidProp !== undefined) { throw new TypeError(`Invalid Prop: ${invalidProp}`); }

		this._id = courseId;
		this.courseName = courseName;
		this.description = description;
		this.amount = amount;
	}
	static fromDb({ _id, courseName, description, amount }) {
		const invalidProp = [_id, courseName, description, amount].find(item => typeof item !== "string");
		if (invalidProp !== undefined) { throw new TypeError(`Invalid Prop: ${invalidProp}`); }

		return new CourseEntry({ courseId: _id, courseName: courseName, description: description, amount: amount });
	}
	toObject() {
		return Object.entries(this).reduce((acc, [k, v]) => ({ ...acc, [k]: v }), Object.create({}));
	}
}


async function getClient() {
	const mongoClient = new MongoClient(dbUrl, { useUnifiedTopology: true });
	const client = await mongoClient.connect().catch(console.error);
	if (!client) { throw new TypeError(`Empty Client`); }
	return client;
}

async function getCollection(client) {
	const db = client.db("meanstack");
	return db.collection("CoursePlatform");
}

async function addCourse(course) {
	const client = await getClient();
	try {
		const entry = new CourseEntry(course).toObject();
		const collection = await getCollection(client);
		const { insertedCount } = await collection.insertOne(entry);
		console.log(`Inserted ${insertedCount} courses. ${JSON.stringify(entry)}`);
	}
	catch (error) {
		console.error(error);
		throw error;
	}
	finally {
		client.close();
	}
}

async function updateCourse({ courseId, amount }) {
	const client = await getClient();
	try {
		const collection = await getCollection(client);
		const { modifiedCount } = await collection.updateOne({ _id: courseId }, { $set: { amount: amount } })
		console.log(`Updated ${modifiedCount} courses. ${JSON.stringify({ courseId, amount })}`);
	}
	catch (error) {
		console.error(error);
		throw error;
	}
	finally {
		client.close();
	}
}

async function deleteCourse({ courseId }) {
	const client = await getClient();
	try {
		const collection = await getCollection(client);
		const { deletedCount } = await collection.deleteOne({ _id: courseId });
		console.log(`Deleted ${deletedCount} courses. ${JSON.stringify({ courseId })}`);
	}
	catch (error) {
		console.error(error);
		throw error;
	}
	finally {
		client.close();
	}
}

async function listCourses() {
	const client = await getClient();
	try {
		const collection = await getCollection(client);
		const docs = await collection.find({}).toArray();
		const entries = docs.map(doc => CourseEntry.fromDb(doc));
		console.log(`Retrieved entries. ${JSON.stringify(entries)}`)
		return entries;
	}
	catch (error) {
		console.error(error);
		throw error;
	}
	finally {
		client.close();
	}
}

exports.addCourse = addCourse;
exports.updateCourse = updateCourse;
exports.deleteCourse = deleteCourse;
exports.listCourses = listCourses;