import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IQuizResponses } from '../models/quiz';

/**
 * Service that mimics a backend database service. Manages storing and retrieving quiz responses.
 */
@Injectable()
export class QuizBackendService {

	constructor() { }

	/**
	 * Store submission into backend.
	 * @param responseId a string hash for the submission session.
	 * @param response user's answers.
	 * @returns A null Observable
	 */
	store(responseId: string, response: IQuizResponses): Observable<null> {
		const data = JSON.stringify(response);
		sessionStorage.setItem(`responseId-${responseId}`, data);
		return of(null);
	}

	/**
	 * Retrieve submission from backend.
	 * @param responseId a string hash for the submission session.
	 * @returns An observable returning the user's answers or null responseId not seen.
	 */
	retrieve(responseId: string): Observable<IQuizResponses | null> {
		const data = sessionStorage.getItem(`responseId-${responseId}`);
		const response = JSON.parse(data ?? 'null') as IQuizResponses | null;
		return of(response);
	}
}
