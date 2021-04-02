import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { mergeMap } from 'rxjs/operators';
import { IQuiz, IQuizResponses, MCQuestion, MCScore } from 'src/app/models/quiz';
import { QuizApiService } from 'src/app/services/quiz-api.service';

/**
 * Component for the result screen where the score and incorrect responses are shown.
 */
@Component({
	selector: 'app-score-screen',
	templateUrl: './score-screen.component.html',
	styleUrls: ['./score-screen.component.css']
})
export class ScoreScreenComponent implements OnInit {

	scores?: MCScore[];  // The scored quiz object.
	userResponse?: IQuizResponses;  // User's response.
	quiz?: IQuiz;  // The quiz object.

	/**
	 * Get a list of scored responses that are incorrect.
	 */
	get incorrectResponses() { return this.scores?.filter(score => !score.correct) }
	/**
	 * Boolean to check if user has passed.
	 */
	get hasPassed() { return this.grade('score') >= this.grade('passing'); }

	/**
	 * Return a numeric score.
	 * @param which signal for which score to return. 
	 * "score": the user's score;
	 * "total": total score available from the quiz;
	 * "passing": the passing grade.
	 * @returns the respective score.
	 */
	grade(which: "score" | "total" | "passing") {
		switch (which) {
			case 'score': return this.scores?.reduce((acc, { correct }) => acc + (correct ? 1 : 0), 0);
			case 'total': return this.scores?.length;
			case 'passing': return this.quiz?.metadata["passing-grade"];
		};
	}

	/**
	 * Get the answer, either user's or the correct ones, for a question.
	 * @param score the score object for the question.
	 * @param whose "user": return user's response; "answer": correct answer for the question.
	 * @returns the answer for the question
	 */
	chosenAnswer(score: MCScore, whose: "user" | "answer") {
		const choiceId = (() => {
			switch (whose) {
				case 'user': return score.response;
				case 'answer': return score.answer.a.id;
			}
		})()
		return (score.question as MCQuestion).c.find(c => c.id === choiceId);
	}

	constructor(private quizApi: QuizApiService, private route: ActivatedRoute) { }

	ngOnInit(): void {
		this.route.params
			.pipe(mergeMap(params => {
				const responseId = params['responseId'];
				return this.quizApi.getScore(responseId);
			}))
			.subscribe(response => {
				this.scores = response.score;
				this.userResponse = response.response;
				this.quiz = response.quiz;
			})
	}

}
