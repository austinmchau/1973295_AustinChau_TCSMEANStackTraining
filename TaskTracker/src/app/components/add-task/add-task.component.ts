import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { isTask, Task } from 'src/app/models/tasks';
import { TasksApiService } from 'src/app/services/tasks-api.service';

/**
 * Component for the add task card + form
 */
@Component({
	selector: 'app-add-task',
	templateUrl: './add-task.component.html',
	styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {

	/**
	 * The formGroup for add-task
	 */
	form = this.fb.group({
		id: ['', [Validators.required, Validators.pattern(/\d{7}/)]],
		name: ['', [Validators.required]],
		task: ['', [Validators.required]],
		deadline: ['', [Validators.required]],
	})
	
	// Convenience getters

	get id() { return this.form.get("id") as FormControl; }
	get name() { return this.form.get("name") as FormControl; }
	get task() { return this.form.get("task") as FormControl; }
	get deadline() { return this.form.get("deadline") as FormControl; }

	constructor(private fb: FormBuilder, private taskApi: TasksApiService) { }

	ngOnInit(): void { }

	/**
	 * On adding task
	 * @param e clickEvent
	 */
	onSubmit(e: Event) {
		e.stopPropagation();
		e.preventDefault();

		if (this.form.valid) {
			const { id, name, task, deadline } = this.form.value;
			// Transforming the form value to the task object keys
			const taskObj: Task = { empId: id, name: name, task: task, deadline: deadline };
			this.taskApi.addTask(taskObj).subscribe(result => {
			}, error => {
				console.error("error: ", error);
			})
		}

	}

}
