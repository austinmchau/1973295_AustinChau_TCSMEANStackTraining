export interface IQuiz {
	metadata: { [key: string]: any },
	payload: { questions: IQuizQuestion[], answers: IQuizAnswer[] },
}

export interface IQuizQuestion {
	id: string,
	type: "mc" | "mc-multi",
	q: string,
	c: { [key: string]: any }[] | { [key: string]: any },
}

export function isQuizQuestion(obj: Object): obj is IQuizQuestion {
	const question = (obj as IQuizQuestion);
	return [question.id, question.type, question.q, question.c].every(item => item !== undefined);
}

export interface IQuizResponse {
	id: string,
	a: { [key: string]: any }
}

export interface IQuizAnswer {
	id: string,
	a: { [key: string]: any }
}

export interface MCQuestion extends IQuizQuestion {
	type: "mc",
	c: { id: number, text: string }[],
}
