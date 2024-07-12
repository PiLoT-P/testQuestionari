

export interface IUser {
    id: string, 
    name: string, 
    score: number, 
    notCorrect: number, 
    answer: string | undefined,
    currentQuestionIndex: number,
    finished: boolean,
}

export interface IQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
}