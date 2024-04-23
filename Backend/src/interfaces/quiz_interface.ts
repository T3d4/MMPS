//Under development
export interface IQuiz {
    id?: string;
    imgURL?: string;
    name?: string;
    questions?: Array<questions>
}

type questions = {
    id: number;
    text: string;
    options: Array<object>;
}