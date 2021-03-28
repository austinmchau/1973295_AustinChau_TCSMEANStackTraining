export interface IQuiz {
	metadata: { [key: string]: any },
	payload: { questions: IQuizQuestion[] },
}

export interface IQuizQuestion {
	id: string,
	type: "mc" | "mc-multi",
	q: string,
	c: { [key: string]: any }[] | { [key: string]: any },
	a: { [key: string]: any }
}

export interface MCQuestion extends IQuizQuestion {
	type: "mc",
	c: { id: number, text: string }[],
	a: { id: number }
}
