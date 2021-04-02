/**
 * Interface for a quiz object. This should mirror the quiz json file.
 */
export interface IQuiz {
	metadata: { [key: string]: any },
	payload: { questions: IQuizQuestion[], answers: IQuizAnswer[] },
}

/**
 * Interface for the user's response to the quiz.
 */
export interface IQuizResponses {
	quizName: string,  // name of the quiz, e.g. "demo-quiz"
	response: { [questionId: string]: string | number },  // user's response from the form. e.g. { "0": 1, "1", 2 }
}

/**
 * Interface for each question. Mirrors the json file.
 */
export interface IQuizQuestion {
	id: string,  // id representing the question.
	type: "mc" | "mc-multi",  // type of question. Allow future expansion to other question types.
	q: string,  // the question itself.
	c: { [key: string]: any }[] | { [key: string]: any },  // choices available.
}

/**
 * Convenience function for checking an object against the IQuizQuestion interface.
 * @param obj object to be checked.
 * @returns boolean if obj satisfy the IQuizQuestion interface.
 */
export function isQuizQuestion(obj: Object): obj is IQuizQuestion {
	const question = (obj as IQuizQuestion);
	return [question.id, question.type, question.q, question.c].every(item => item !== undefined);
}

/**
 * Interface for a correct answer to a question.
 */
export interface IQuizAnswer {
	id: string,  // questionId
	a: { [key: string]: any }  // the answer itself
}

/**
 * Interface for a multiple choice question.
 */
export interface MCQuestion extends IQuizQuestion {
	type: "mc",
	c: { id: number, text: string }[],
}

/**
 * Interface for an answer to a multiple choice question.
 */
export interface MCAnswer extends IQuizAnswer {
	id: string,
	a: { id: number },
}

/**
 * Interface for a scored quiz object.
 */
export interface MCScore {
	question: IQuizQuestion,
	answer: MCAnswer,
	response: number,
	correct: boolean,
}
