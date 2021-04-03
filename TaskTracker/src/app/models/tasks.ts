/**
 * Interface for a task
 */
export interface Task {
	empId: string,
	name: string,
	task: string,
	deadline: Date,
}

/**
 * Function to check whether an object is Task (key and type).
 * @param obj object to be tested
 * @returns boolean of whether the object has all the keys and correct type as Task
 */
export function isTask(obj: Object): obj is Task {
	// setup functions to test for types
	const isString = (o: Object) => (typeof o === "string");
	const isDate = (o: Object) => (
		o && Object.prototype.toString.call(o) === "[object Date]" && !isNaN(o as number)
	);

	// setup array of keys and validator functions
	const keys: ([keyof Task, (arg1: Object) => boolean])[] = [
		["empId", isString], ["name", isString], ["task", isString], ["deadline", isDate]
	];

	// run thru the keys to validate each key in object exists and is of the valid type respectively
	return keys.every(([key, isType]) => isType((obj as Task)[key]));
}

/**
 * Function to convert an object to a Task object, return null if failed at any point.
 * @param obj object to be tested
 * @returns Task object or null if failed
 */
export function asTask(obj: Object): Task | null {

	// define a function type for mapping a property into a desired type.
	type TransformerFn<T> = (o: Object) => T | null

	// functions to map property into respective types
	const asString = (o: Object | null) => typeof o === "string" ? o : "";
	const asDate = (o: Object | null) => {
		// function to check whether an object can be a valid Date object
		const isDate = (toCheck: Object | null) => (
			toCheck && Object.prototype.toString.call(toCheck) === "[object Date]" && !isNaN(toCheck as number)
		);
		// see if object is date already
		if (isDate(o)) { return o as Date; }
		// see if it's a string that creates valid date
		if (typeof o === "string") {
			const date = new Date(o);
			if (isDate(date)) { return date; }
		}
		return null;
	};

	// create an array of keys and their respective transformer function
	const transformers: [(keyof Task), TransformerFn<string | Date>][] = [
		["empId", asString], ["name", asString], ["task", asString], ["deadline", asDate],
	]

	// map thru each keys and their transformers, then filter out any failed (i.e. null) values. Return as Object
	const task = transformers
		.map<[keyof Task, string | Date | null]>(([key, fn]) => ([key, fn((obj as Task)[key])]))
		.reduce((obj, [k, v]) => (v !== null ? { ...obj, [k]: v } : obj), {});
	
	if (!isTask(task)) { return null; }
	return task as Task;
}