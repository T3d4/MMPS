// controllers/QuizResultController.ts
import { Request, Response, NextFunction } from 'express';
import QuizResult from '../models/quiz_result_model';

export class QuizResultController {

    async saveQuizResult(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                userId,
                quizId,
                quizName,
                timeTaken,
                totalQuestions,
                answeredQuestions,
                correctAnswers
            } = req.body;

            const newQuizResult = new QuizResult({
                userId,
                quizId,
                date: new Date(),
                quizName,
                timeTaken,
                totalQuestions,
                answeredQuestions,
                correctAnswers
            });

            const savedQuizResult = await newQuizResult.save();

            res.status(201).json({ message: 'Quiz result saved successfully', quizResult: savedQuizResult });
        } catch (error) {
            next(error);
        }
    }

    async getQuizResultsByUserId(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params.userId;
            const quizResults = await QuizResult.find({ userId });

            if (!quizResults || quizResults.length === 0) {
                res.status(404).json({ message: 'No quiz results found for this user' });
                return;
            }

            res.status(200).json(quizResults);
        } catch (error) {
            next(error);
        }
    }
}
