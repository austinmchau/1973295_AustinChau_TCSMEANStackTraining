import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { asTask, isTask, Task } from '../models/tasks';
import { map, mergeMap } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class TasksApiService {

	readonly hostname = "http://localhost:3000/"

	private taskAddedSource = new Subject<Object>();
	taskAdded$ = this.taskAddedSource.asObservable();

	constructor(private http: HttpClient) { }

	addTask(task: Task) {
		return this.http.post(this.hostname + "tasks", task)
			.pipe(map(result => {
				this.taskAddedSource.next(result);
				return result;
			}));
	}

	getAllTasks() {
		return this.http.get(this.hostname + "tasks")
			.pipe(map(result => {
				if (Array.isArray(result)) {
					return (result as Object[])
						.map(item => asTask(item))
						.reduce<Task[]>((prev, item) => item !== null ? [...prev, item] : prev, []);
				}
				throw new Error(`Invalid tasks results: ${JSON.stringify(result)}`);
			}));
	}

}
