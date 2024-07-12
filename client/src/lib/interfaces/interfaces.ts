

export interface IUser {
    id: string;
    name: string;
    score: number;
    notCorrect: number;
    answer: string | undefined;
}

export interface IQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
}