import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { mergeMap } from 'rxjs/operators';
import { IQuiz, IQuizQuestion, IQuizResponses, isQuizQuestion } from 'src/app/models/quiz';
import { QuizApiService } from 'src/app/services/quiz-api.service';

/**
 * The component for the quiz.
 */
@Component({
	selector: 'app-quiz-container',
	templateUrl: './quiz-container.component.html',
	styleUrls: ['./quiz-container.component.css']
})
export class QuizContainerComponent implements OnInit {

	/**
	 * FormGroup for the whole quiz.
	 */
	quizForm = new FormGroup({});
	/**
	 * Get the FormArray holding the questions from the quizForm.
	 */
	get questionForms() { return this.quizForm.get("questions") as FormArray; }

	/**
	 * Storing the current quiz object.
	 */
	currentQuiz?: IQuiz;
	/**
	 * Storing the list of questions for the current quiz.
	 */
	questions?: IQuizQuestion[];
	/**
	 * Return the current quiz's name.
	 */
	get quizName() { return this.currentQuiz?.metadata?.quizName ?? ""; }
	/**
	 * return the current quiz's human readable name.
	 */
	get quizNameLiteral() { return this.currentQuiz?.metadata?.name ?? ""; }

	constructor(private quizApi: QuizApiService, private router: Router, private route: ActivatedRoute) { }

	ngOnInit(): void {
		this.route.params
			.pipe(mergeMap(params => {
				const quizName = params['quiz-name'];
				return this.quizApi.getQuiz(quizName);
			}))
			.subscribe(quiz => {
				this.currentQuiz = quiz;
				this.questions = (() => {
					const questions = quiz?.payload?.questions;
					if (!Array.isArray(questions)) { console.error("invalid quiz questions."); return []; }
					return questions.filter(question => isQuizQuestion(question));
				})();
			})
	}

	onSubmit() {

		if (this.quizForm.invalid) {
			this.quizForm.markAllAsTouched();
		} else {
			const results = this.quizForm.value;
			const submission: IQuizResponses = {
				quizName: this.quizName,
				response: results,
			}
			this.quizApi.submit(submission).subscribe(responseId => {
				this.router.navigate(['result', responseId]);
			})
		}

	}
}
