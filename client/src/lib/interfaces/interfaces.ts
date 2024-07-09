

export interface IUser {
    id: string;
    name: string;
    score: number;
    answer: string | undefined;
}

export interface IQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
}