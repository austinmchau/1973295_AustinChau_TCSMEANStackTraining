import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { QuizApiService } from 'src/app/services/quiz-api.service';

/**
 * A validator factory returning a function that checks whether the selected quiz name is valid.
 * @param selection A regex matching any quiz names that will be invalid.
 * @returns A validator function.
 */
function validQuizSelection(selection: RegExp): ValidatorFn {
	return (control: AbstractControl): { [key: string]: any } | null => {
		const forbidden = selection.test(control.value);
		return forbidden ? { forbiddenSelection: { value: control.value } } : null;
	};
}

/**
 * The splash page for the quz app where user can choose the quiz to attempt.
 */
@Component({
	selector: 'app-entry-screen',
	templateUrl: './entry-screen.component.html',
	styleUrls: ['./entry-screen.component.css']
})
export class EntryScreenComponent implements OnInit {

	/**
	 * Form Group holding the quiz name choice form.
	 */
	form = new FormGroup({
		quiz: new FormControl("placeholder", [Validators.required, validQuizSelection(/placeholder/g)]),
	});
	/**
	 * Storing the list of available quiz.
	 */
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
			this.router.navigate(["quiz", quizName])
		}
	}

}
