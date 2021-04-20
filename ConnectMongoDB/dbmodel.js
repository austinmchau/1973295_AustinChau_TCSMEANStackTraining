const { MongoClient } = require("mongodb");

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
	toObject() {
		return Object.entries(this).reduce((acc, [k, v]) => ({ ...acc, [k]: v }), Object.create({}));
	}
}


async function addCourse(course) {

	const mongoClient = new MongoClient(dbUrl, { useUnifiedTopology: true });
	const client = await mongoClient.connect().catch(console.error);

	try {
		if (!client) { throw new TypeError(`Empty Client`); }

		const entry = new CourseEntry(course).toObject();

		const db = client.db("meanstack");
		const collection = db.collection("CoursePlatform");

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

exports.addCourse = addCourse;