import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Task } from 'src/app/models/tasks';
import { TasksApiService } from 'src/app/services/tasks-api.service';

interface TaskDisplay extends Omit<Task, 'deadline'> {
	deadline: string,
}

function displayTask(task: Task): TaskDisplay {
	const { deadline, ...display } = task;
	return { ...display, deadline: deadline.toLocaleDateString() }
}

/**
 * Component for the task table view
 */
@Component({
	selector: 'app-task-view',
	templateUrl: './task-view.component.html',
	styleUrls: ['./task-view.component.css']
})
export class TaskViewComponent implements OnInit {

	/**
	 * Data Source for the table
	 */
	tasksDataSource: TaskDisplay[] = [];
	headerColumns = ["empId", "name", "task", "deadline"];

	/**
	 * Subscription to get notified for add-task submission
	 */
	subscription?: Subscription;

	constructor(private taskApi: TasksApiService) { }

	ngOnInit(): void {
		this.getTasks();
		this.subscription = this.taskApi.taskAdded$.subscribe( result =>  this.getTasks() )
	}

	/**
	 * Function to query api to get all the tasks.
	 */
	getTasks() {
		this.taskApi.getAllTasks().subscribe(result => {
			this.tasksDataSource = result
				.sort((a, b) => b.deadline.getTime() - a.deadline.getTime())
				.map(task => displayTask(task));
		}, error => {
			console.error(error);
		})
	}

}
