import { Component, OnInit } from '@angular/core';
import { Form, FormGroup, NgForm } from '@angular/forms';
import { IQuiz, IQuizQuestion, isQuizQuestion } from 'src/app/models/quiz';
import { QuizApiService } from 'src/app/services/quiz-api.service';

@Component({
	selector: 'app-quiz-container',
	templateUrl: './quiz-container.component.html',
	styleUrls: ['./quiz-container.component.css']
})
export class QuizContainerComponent implements OnInit {

	quizList: string[] = [];

	currentQuiz?: IQuiz;
	questions?: IQuizQuestion[];

	get currentQuizName() { return this.currentQuiz?.metadata.name ?? ""; }


	constructor(private quizApi: QuizApiService) { }

	ngOnInit(): void {
		this.quizApi.getAvailableQuizzes().subscribe(quizzes => this.quizList = quizzes);
		this.quizApi.getQuiz("demo-quiz").subscribe(quiz => {
			this.currentQuiz = quiz;
			this.questions = (() => {
				const questions = quiz?.payload?.questions;
				if (!Array.isArray(questions)) { console.error("invalid quiz questions."); return []; }
				return questions.filter(question => isQuizQuestion(question));
			})();
		});
	}

	onSubmit(questionForm: NgForm) {
		const results = questionForm.value;
		console.log("Form submitted: ", results);
	}
}
