import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { asTask, Task } from '../models/tasks';
import { catchError, map } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

/**
 * API to interact with json-server backend
 */
@Injectable({
	providedIn: 'root'
})
export class TasksApiService {

	readonly hostname = "http://localhost:3000/"

	// properties for letting task-view to subscribe for data changes
	private taskAddedSource = new Subject<Object>();
	taskAdded$ = this.taskAddedSource.asObservable();

	constructor(private http: HttpClient) { }

	/**
	 * Function to add a task to storage.
	 * @param task A valid Task
	 * @returns an Observable with the post result json
	 */
	addTask(task: Task) {
		return this.http.post(this.hostname + "tasks", task)
			.pipe(
				map(result => {
					this.taskAddedSource.next(result);
					return result;
				}),
				catchError(error => {
					return throwError(error);
				})
			);
	}

	/**
	 * Function to get all stored tasks.
	 * @returns an observable returning a list of Tasks
	 */
	getAllTasks() {
		return this.http.get(this.hostname + "tasks")
			.pipe(map(result => {
				if (Array.isArray(result)) {
					// map convert each object into (Task | null) then filter out any null values
					return (result as Object[])
						.map(item => asTask(item))
						.reduce<Task[]>((prev, item) => item !== null ? [...prev, item] : prev, []);
				}
				throw new Error(`Invalid tasks results: ${JSON.stringify(result)}`);
			}));
	}

}
