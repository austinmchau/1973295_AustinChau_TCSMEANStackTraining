export interface Task {
	empId: string,
	name: string,
	task: string,
	deadline: Date,
}

export function isTask(obj: Object): obj is Task {
	const isString = (o: Object) => (typeof o === "string");
	const isDate = (o: Object) => (
		o && Object.prototype.toString.call(o) === "[object Date]" && !isNaN(o as number)
	);

	const keys: ([keyof Task, (arg1: Object) => boolean])[] = [
		["empId", isString], ["name", isString], ["task", isString], ["deadline", isDate]
	];

	return keys.every(([key, isType]) => isType((obj as Task)[key]));
}

export function asTask(obj: Object): Task | null {

	type TransformerFn<T> = (o: Object) => T | null

	const asString = (o: Object | null) => typeof o === "string" ? o : "";
	const asDate = (o: Object | null) => {
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

	const transformers: [(keyof Task), TransformerFn<string | Date>][] = [
		["empId", asString], ["name", asString], ["task", asString], ["deadline", asDate],
	]

	const task = transformers
		.map<[keyof Task, string | Date | null]>(([key, fn]) => ([key, fn((obj as Task)[key])]))
		.reduce((obj, [k, v]) => (v !== null ? { ...obj, [k]: v } : obj), {});
	
	if (!isTask(task)) { return null; }
	return task as Task;
}