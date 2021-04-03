export interface Task {
	empId: string,
	name: string,
	task: string,
	deadline: Date,
}

export function isTask(obj: Object): obj is Task {
	const keys: (keyof Task)[] = ["empId", "name", "task", "deadline"];
	return keys.every(key => obj.hasOwnProperty(key));
}