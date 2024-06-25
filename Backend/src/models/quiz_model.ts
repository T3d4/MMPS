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
                isCorrect: { type: Boolean }
            }],
            correctAnswer: { type: String }
        }],
        duration: {
            type: Number,
            required: true
        },
        dateCreated: {
            type: Date,
            default: Date.now,
            required: true
        },
        taken: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },
    {
        timestamps: true,
    }
);


export const Quiz = model<IQuiz>("quiz", quizSchema);