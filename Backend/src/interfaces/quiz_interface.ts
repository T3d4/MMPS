//Under development
export interface IQuiz {
    id?: string;
    name?: string;
    questions?: Question[];
    duration?: number;
    dateCreated?: Date;
}

interface Question {
    id: number;
    text: string;
    options: Option[];
}

interface Option {
    id: number;
    label?: string;
    text: string;
    isCorrect: boolean;
}
