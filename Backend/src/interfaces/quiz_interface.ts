import mongoose from "mongoose";

//Under development
export interface IQuiz {
    id?: string;
    name?: string;
    questions?: Question[];
    duration?: number;
    dateCreated?: Date;
    taken?: mongoose.Types.ObjectId[];
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
