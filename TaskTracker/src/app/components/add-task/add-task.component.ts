import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {

	form = this.fb.group({
		id: ['', [Validators.required]],
		name: ['', [Validators.required]],
		task: ['', [Validators.required]],
		deadline: ['', [Validators.required]],
	})

	get id() { return this.form.get("id") as FormControl; }
	get name() { return this.form.get("name") as FormControl; }
	get task() { return this.form.get("task") as FormControl; }
	get deadline() { return this.form.get("deadline") as FormControl; }

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

}
