//Under development
import { Schema, model } from "mongoose";
import { IQuiz } from "../interfaces";

const quizSchema = new Schema<IQuiz>(
    {
        id: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        questions: [{
            id: { type: Number },
            text: { type: String },
            options: [{
                id: { type: Number },
                label: { type: String },
                text: { type: String },
                isCorrect: { type: String }
            }]
        }],
    },
    {
        timestamps: true,
    }
);

export const Quiz = model<IQuiz>("quiz", quizSchema);