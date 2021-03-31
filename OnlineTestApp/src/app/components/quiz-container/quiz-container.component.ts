import { Component, OnInit } from '@angular/core';
import { Form, FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { IQuiz, IQuizQuestion, isQuizQuestion } from 'src/app/models/quiz';
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
	get currentQuizName() { return this.currentQuiz?.metadata.name ?? ""; }

	constructor(private quizApi: QuizApiService, private fb: FormBuilder) { }

	ngOnInit(): void {
		this.quizApi.getQuiz("demo-quiz").subscribe(quiz => {
			this.currentQuiz = quiz;
			this.questions = (() => {
				const questions = quiz?.payload?.questions;
				if (!Array.isArray(questions)) { console.error("invalid quiz questions."); return []; }
				return questions.filter(question => isQuizQuestion(question));
			})();
		})
	}

	onSubmit() {
		const results = this.quizForm.value;
		console.log("Form submitted: ", results, this.quizForm.valid);

		this.quizForm.markAllAsTouched();
	}
}
