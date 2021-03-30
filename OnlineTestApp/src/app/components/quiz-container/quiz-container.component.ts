import { Component, OnInit } from '@angular/core';
import { IQuiz, IQuizQuestion, isQuizQuestion } from 'src/app/models/quiz';
import { QuizApiService } from 'src/app/services/quiz-api.service';

@Component({
	selector: 'app-quiz-container',
	templateUrl: './quiz-container.component.html',
	styleUrls: ['./quiz-container.component.css']
})
export class QuizContainerComponent implements OnInit {

	quizList: string[] = [];

	demoQuiz?: IQuiz;
	questions?: IQuizQuestion[];

	constructor(private quizApi: QuizApiService) { }

	ngOnInit(): void {
		this.quizApi.getAvailableQuizzes().subscribe(quizzes => this.quizList = quizzes);
		this.quizApi.getQuiz("demo-quiz").subscribe(quiz => {
			this.demoQuiz = quiz;
			this.questions = (() => {
				const questions = quiz?.payload?.questions;
				if (!Array.isArray(questions)) { console.error("invalid quiz questions."); return []; }
				return questions.filter(question => isQuizQuestion(question));
			})();
		});
	}

	onSubmit() {
		console.log("Form submitted: ");
	}
}
