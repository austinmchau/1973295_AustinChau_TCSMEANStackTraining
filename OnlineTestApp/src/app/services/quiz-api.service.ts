import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class QuizApiService {

	constructor(private http: HttpClient) { }

	getAvailableQuizzes(): Observable<Object> {
		return this.http.get("/assets/quiz-questions/quiz-manifest.json");
	}

	getQuiz(quizName: string): Observable<any> {
		return this.http.get(`/assets/${quizName}.json`);
	}
}
