import { Component, OnInit } from '@angular/core';
import { QuizApiService } from 'src/app/services/quiz-api.service';

@Component({
  selector: 'app-quiz-container',
  templateUrl: './quiz-container.component.html',
  styleUrls: ['./quiz-container.component.css']
})
export class QuizContainerComponent implements OnInit {

  constructor(private quizApi: QuizApiService) { }

  ngOnInit(): void {
		this.quizApi.getAvailableQuizzes().subscribe(obj => console.log("Obj: ", obj));
  }

}
