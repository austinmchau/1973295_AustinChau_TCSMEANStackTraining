import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { mergeMap } from 'rxjs/operators';
import { IQuiz, IQuizQuestion, IQuizResponses, isQuizQuestion } from 'src/app/models/quiz';
import { QuizApiService } from 'src/app/services/quiz-api.service';

@Component({
	selector: 'app-quiz-container',
	templateUrl: './quiz-container.component.html',
	styleUrls: ['./quiz-container.component.css']
})
export class QuizContainerComponent implements OnInit {

	quizForm = new FormGroup({});
	get questionForms() { return this.quizForm.get("questions") as FormArray; }

	currentQuiz?: IQuiz;
	questions?: IQuizQuestion[];
	get quizName() { return this.currentQuiz?.metadata?.quizName ?? ""; }
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
