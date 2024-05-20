//Under development
export interface IQuiz {
    id?: string;
    name?: string;
    questions?: Array<questions>
}

type questions = {
    id: number;
    text: string;
    options: Array<any>;
}