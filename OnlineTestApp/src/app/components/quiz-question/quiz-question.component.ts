import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ControlContainer, FormControlDirective, FormGroup, NgForm } from '@angular/forms';
import { IQuizQuestion, MCQuestion } from 'src/app/models/quiz';

@Component({
	selector: 'app-quiz-question',
	templateUrl: './quiz-question.component.html',
	styleUrls: ['./quiz-question.component.css'],
	viewProviders: [
		{
			provide: ControlContainer,
			useExisting: NgForm,
		}
	]
})
export class QuizQuestionComponent implements OnInit, OnChanges {

	@Input("question") quizQuestion?: IQuizQuestion;
	@Input("controlName") controlName?: String;

	get questionText(): string { return this.quizQuestion?.q ?? ""; }
	get questionId(): string { return this.quizQuestion?.id ?? ""; }
	get choices(): { id: number, text: string }[] {
		const question = this.quizQuestion as MCQuestion;
		if (question === undefined) { return []; }
		return question.c;
	}

	constructor() { }
	ngOnInit(): void { }

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.quizQuestion) {
			this.quizQuestion = changes.quizQuestion.currentValue;
		}
	}

}
