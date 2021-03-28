import { Component, OnInit } from '@angular/core';
import { IQuiz, IQuizQuestion } from 'src/app/models/quiz';
import { QuizApiService } from 'src/app/services/quiz-api.service';

@Component({
	selector: 'app-quiz-container',
	templateUrl: './quiz-container.component.html',
	styleUrls: ['./quiz-container.component.css']
})
export class QuizContainerComponent implements OnInit {

	quizList: string[] = [];

	demoQuiz?: IQuiz;
	testQuestion?: IQuizQuestion;

	constructor(private quizApi: QuizApiService) { }

	ngOnInit(): void {
		this.quizApi.getAvailableQuizzes().subscribe(quizzes => this.quizList = quizzes);
		this.quizApi.getQuiz("demo-quiz").subscribe(quiz => {
			this.demoQuiz = quiz;
			const questions = quiz.payload?.questions;
			if (Array.isArray(questions)) {
				const question = questions[0] as IQuizQuestion;
				if (question !== undefined) {
					this.testQuestion = question;
					console.log("TestQuestion: ", this.testQuestion);
				}
			}
		});
	}

}
