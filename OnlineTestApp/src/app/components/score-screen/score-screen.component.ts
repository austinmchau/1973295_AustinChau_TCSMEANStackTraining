import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { mergeMap } from 'rxjs/operators';
import { IQuiz, IQuizResponses, MCScore } from 'src/app/models/quiz';
import { QuizApiService } from 'src/app/services/quiz-api.service';

@Component({
  selector: 'app-score-screen',
  templateUrl: './score-screen.component.html',
  styleUrls: ['./score-screen.component.css']
})
export class ScoreScreenComponent implements OnInit {

	scores!: MCScore[];
	userResponse!: IQuizResponses;
	quiz!: IQuiz;

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
				console.log(response);
			})
  }

}
