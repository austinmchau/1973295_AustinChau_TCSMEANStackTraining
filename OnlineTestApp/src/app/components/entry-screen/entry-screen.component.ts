import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IQuiz } from 'src/app/models/quiz';
import { QuizApiService } from 'src/app/services/quiz-api.service';

function validQuizSelection(selection: RegExp): ValidatorFn {
	return (control: AbstractControl): { [key: string]: any } | null => {
		const forbidden = selection.test(control.value);
		return forbidden ? { forbiddenSelection: { value: control.value } } : null;
	};
}

@Component({
	selector: 'app-entry-screen',
	templateUrl: './entry-screen.component.html',
	styleUrls: ['./entry-screen.component.css']
})
export class EntryScreenComponent implements OnInit {

	form = new FormGroup({
		quiz: new FormControl("placeholder", [Validators.required, validQuizSelection(/placeholder/g)]),
	});
	availableQuizzes?: string[];

	constructor(private quizApi: QuizApiService, private router: Router) { }

	ngOnInit(): void {
		this.quizApi.getAvailableQuizzes().subscribe(quizzes => {
			this.availableQuizzes = quizzes;
		});
	}

	onSubmit() {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
		} else {
			const quiz = this.form.get("quiz") as FormControl;
			const quizName = quiz.value;
			console.log("quizName: ", quizName)
			this.router.navigate(["quiz", quizName])
		}
	}

}
