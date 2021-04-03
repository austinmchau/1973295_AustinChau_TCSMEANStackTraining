import { Component, OnInit } from '@angular/core';

export interface Task {
	empId: string,
	name: string,
	task: string,
	deadline: string,
}

@Component({
	selector: 'app-task-view',
	templateUrl: './task-view.component.html',
	styleUrls: ['./task-view.component.css']
})
export class TaskViewComponent implements OnInit {

	tasksDataSource: Task[] = [
		{ empId: "1971111", name: "John Doe", task: "Do stuff", deadline: new Date().toLocaleDateString() },
	];

	headerColumns = ["empId", "name", "task", "deadline"];

	constructor() { }

	ngOnInit(): void {
	}

}
