import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ControlContainer, FormControl, FormControlDirective, FormGroup, NgForm, Validators } from '@angular/forms';
import { IQuizQuestion, MCQuestion } from 'src/app/models/quiz';

@Component({
	selector: 'app-quiz-question',
	templateUrl: './quiz-question.component.html',
	styleUrls: ['./quiz-question.component.css'],
})
export class QuizQuestionComponent implements OnInit, OnChanges {

	@Input("question") quizQuestion!: IQuizQuestion;
	@Input() quizForm!: FormGroup;

	get questionText(): string { return this.quizQuestion?.q; }
	get questionId(): string { return this.quizQuestion?.id; }
	get choices(): { id: number, text: string }[] {
		const question = this.quizQuestion as MCQuestion;
		if (question === undefined) { return []; }
		return question.c;
	}
	get questionFormControl() { return this.quizForm.get(this.questionId) as FormControl; }

	choiceId(id: number) { return `${this.questionId}-${id.toString()}`}

	constructor() { }
	ngOnInit(): void { 
		this.quizForm.addControl(this.questionId, new FormControl("", [Validators.required]));
	}

	ngOnChanges(changes: SimpleChanges): void {
		// if (changes.quizQuestion) {
		// 	this.quizQuestion = changes.quizQuestion.currentValue;
		// }
	}

}
