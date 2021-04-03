import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isTask, Task } from '../models/tasks';
import { map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class TasksApiService {

	readonly hostname = "http://localhost:3000/"

	constructor(private http: HttpClient) { }

	addTask(task: Task) {
		return this.http.post(this.hostname + "tasks", task);
	}

	getAllTasks() {
		return this.http.get(this.hostname + "tasks")
		.pipe(map(result => {
			if (!(Array.isArray(result) && (result as Object[]).every(item => isTask(item)))) {
				throw new Error(`Invalid tasks results: ${result}`);
			}
			return result as Task[];
		}));
	}

}
