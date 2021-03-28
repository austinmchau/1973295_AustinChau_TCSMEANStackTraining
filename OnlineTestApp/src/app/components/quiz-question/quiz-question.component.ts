import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IQuizQuestion } from 'src/app/models/quiz';

@Component({
  selector: 'app-quiz-question',
  templateUrl: './quiz-question.component.html',
  styleUrls: ['./quiz-question.component.css']
})
export class QuizQuestionComponent implements OnInit, OnChanges {

	@Input("question") quizQuestion?: IQuizQuestion;

  constructor() { }
  ngOnInit(): void { }

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.quizQuestion) {
			this.quizQuestion = changes.quizQuestion.currentValue;
		}
	}

}
