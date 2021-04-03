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

@Component({
	selector: 'app-task-view',
	templateUrl: './task-view.component.html',
	styleUrls: ['./task-view.component.css']
})
export class TaskViewComponent implements OnInit {

	tasksDataSource: TaskDisplay[] = [];
	headerColumns = ["empId", "name", "task", "deadline"];

	subscription?: Subscription;

	constructor(private taskApi: TasksApiService) { }

	ngOnInit(): void {
		this.getTasks();
		this.subscription = this.taskApi.taskAdded$.subscribe(
			result => {
				console.log("fjsdiofji", result);
				this.getTasks();
			}
		)
	}

	getTasks() {
		this.taskApi.getAllTasks().subscribe(result => {
			console.log(result);
			this.tasksDataSource = result
				.sort((a, b) => b.deadline.getTime() - a.deadline.getTime())
				.map(task => displayTask(task));
		}, error => {
			console.error(error);
		})
	}

}
