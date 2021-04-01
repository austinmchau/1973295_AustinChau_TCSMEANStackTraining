import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { forkJoin, Observable, of } from 'rxjs';
import { map } from "rxjs/operators";
import { IQuiz, IQuizAnswer, IQuizQuestion, IQuizResponses, MCAnswer, MCScore } from '../models/quiz';

@Injectable({
	providedIn: 'root'
})
export class QuizApiService {

	private quizResponses = new Map<string, IQuizResponses>();

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

	submit(response: IQuizResponses): Observable<string> {
		const responseId = [...Array(32)].map(i=>(~~(Math.random()*36)).toString(36)).join('');
		this.quizResponses.set(responseId, response);
		return of(responseId);
	}

	private score(questions: IQuizQuestion[], answers: IQuizAnswer[], response: IQuizResponses): MCScore[] {
		const answerMap = new Map(answers.map(answer => [answer.id, answer.a]));
		const responseMap = new Map(Object.entries(response.response));
		return questions.map(question => {
			const answer = answerMap.get(question.id);
			const resp = responseMap.get(question.id);
			if (answer === undefined || typeof resp !== 'number') throw new Error(`Broken resp: ${resp}`)

			const correct = (answer as MCAnswer).a.id === resp;

			return {
				question: question,
				answer: answer as MCAnswer,
				response: resp,
				correct: correct,
			};
		})
	}

	getScore(responseId: string): Observable<{ score: MCScore[], response: IQuizResponses, quiz: IQuiz }> {
		const response$ = new Observable<IQuizResponses>(observer => {
			const response = this.quizResponses.get(responseId);
			if (!response) { observer.error(new Error(`responseId "${responseId}" does not have an entry.`)); return; }
			observer.next(response);
			observer.complete();
			return { unsubscribe() { } };
		})
		const quiz$ = this.getQuiz(responseId);

		return forkJoin([response$, quiz$]).pipe(map(([response, quiz]) => ({
			score: this.score(quiz.payload.questions, quiz.payload.answers, response),
			response: response,
			quiz: quiz,
		})))
	}
}
