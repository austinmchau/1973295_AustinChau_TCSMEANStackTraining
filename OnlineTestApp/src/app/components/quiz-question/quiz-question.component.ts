import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IQuizQuestion, MCQuestion } from 'src/app/models/quiz';

/**
 * A component for a single question. Reusable.
 */
@Component({
	selector: 'app-quiz-question',
	templateUrl: './quiz-question.component.html',
	styleUrls: ['./quiz-question.component.css'],
})
export class QuizQuestionComponent implements OnInit {

	/**
	 * The question object
	 */
	@Input("question") quizQuestion!: IQuizQuestion;
	/**
	 * Reference to the form for the whole quiz.
	 */
	@Input() quizForm!: FormGroup;

	/**
	 * Get the question text.
	 */
	get questionText(): string { return this.quizQuestion?.q; }
	/**
	 * Get the question's id.
	 */
	get questionId(): string { return this.quizQuestion?.id; }
	/**
	 * Get the list of possible choices.
	 */
	get choices(): { id: number, text: string }[] {
		const question = this.quizQuestion as MCQuestion;
		if (question.type !== "mc") { return []; }
		return question.c;
	}
	/**
	 * Get the form control for this question from the overall quiz from parent.
	 */
	get questionFormControl() { return this.quizForm.get(this.questionId) as FormControl; }

	/**
	 * Return a string id for the option html element's id.
	 * @param id id of the choice.
	 * @returns a string id
	 */
	choiceId(id: number) { return `${this.questionId}-${id.toString()}` }

	constructor() { }

	ngOnInit(): void {
		this.quizForm.addControl(this.questionId, new FormControl("", [Validators.required]));
	}
}
