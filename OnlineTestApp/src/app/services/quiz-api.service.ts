import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { map } from "rxjs/operators";
import { IQuiz } from '../models/quiz';

@Injectable({
	providedIn: 'root'
})
export class QuizApiService {

	constructor(private http: HttpClient) { }

	getAvailableQuizzes(): Observable<string[]> {
		return this.http.get("/assets/quiz-questions/quiz-manifest.json")
			.pipe(map(obj => {
				const quizzes = (obj as { "quizzes": string[] }).quizzes;
				if (!Array.isArray(quizzes)) {
					console.error("quiz-manifest is malformed.");
					return [];
				}
				return quizzes
			}));
	}

	getQuiz(quizName: string): Observable<IQuiz> {
		return this.http.get(`/assets/quiz-questions/${quizName}.json`)
			.pipe(map(obj => {
				const quiz = (obj as IQuiz);
				if (obj === undefined) { throw new Error(`error loading quiz, obj undefined: ${quizName}.`); }
				return quiz;
			}));
	}
}
