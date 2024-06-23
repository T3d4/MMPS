// models/QuizResult.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface QuizResult extends Document {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model if using ObjectId for userId
        required: true
    },
    date: Date;
    quizName: string;
    timeTaken: number; // in seconds
    totalQuestions: number;
    answeredQuestions: number;
    correctAnswers: number;
}

const quizResultSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    quizName: { type: String, required: true },
    timeTaken: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    answeredQuestions: { type: Number, required: true },
    correctAnswers: { type: Number, required: true }
});

export default mongoose.model<QuizResult>('QuizResult', quizResultSchema);
