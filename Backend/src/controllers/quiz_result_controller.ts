// controllers/QuizResultController.ts
import { Request, Response, NextFunction } from 'express';
import {QuizResult} from '../models';
import { Quiz } from '../models';

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

            const quiz = await Quiz.findById(quizId);
            if (!quiz) {
                return res.status(404).json({ message: "Quiz not found" });
            }

            // Add the user's ID to the taken array if not already present
            if (!quiz.taken.includes(userId)) {
                quiz.taken.push(userId);
                await quiz.save();
            }
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
