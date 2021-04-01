import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { combineLatest, Observable } from 'rxjs';
import { map, mergeMap } from "rxjs/operators";
import { IQuiz, IQuizAnswer, IQuizQuestion, IQuizResponses, MCAnswer, MCScore } from '../models/quiz';
import { QuizBackendService } from './quiz-backend.service';

@Injectable({
	providedIn: 'root'
})
export class QuizApiService {

	constructor(private http: HttpClient, private quizBackend: QuizBackendService) { }

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
		const responseId = [...Array(32)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
		return this.quizBackend.store(responseId, response)
			.pipe(
				map(() => responseId)
			)
	}

	private score(questions: IQuizQuestion[], answers: IQuizAnswer[], response: IQuizResponses): MCScore[] {
		const answerMap = new Map(answers.map(answer => [answer.id, answer]));
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
		const response$ = this.quizBackend.retrieve(responseId).pipe(
			map(response => {
				if (!response) { throw new Error(`responseId "${responseId}" does not have an entry.`); }
				return response;
			})
		)

		const quiz$ = response$.pipe(mergeMap(response => {
			return this.getQuiz(response.quizName);
		}));

		return combineLatest([response$, quiz$]).pipe(map(([response, quiz]) => ({
			score: this.score(quiz.payload.questions, quiz.payload.answers, response),
			response: response,
			quiz: quiz,
		})))
	}
}
