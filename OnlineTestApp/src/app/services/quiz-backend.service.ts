import { Injectable } from '@angular/core';
import { EMPTY, NEVER, Observable, of } from 'rxjs';
import { IQuizResponses } from '../models/quiz';

@Injectable()
export class QuizBackendService {

	constructor() { }

	store(responseId: string, response: IQuizResponses): Observable<null> {
		const data = JSON.stringify(response);
		sessionStorage.setItem(`responseId-${responseId}`, data);
		return of(null);
	}

	retrieve(responseId: string): Observable<IQuizResponses | null> {
		const data = sessionStorage.getItem(`responseId-${responseId}`);
		const response = JSON.parse(data ?? 'null') as IQuizResponses | null;
		return of(response);
	}
}
