//Under development
import { Request, Response, NextFunction } from "express";
import { Quiz } from "../models";

export class QuizController {

    async createQuiz(req: Request, res: Response, next: NextFunction) {
        try {
            const quizData = req.body;

            if (!Array.isArray(quizData)) {
                return res.status(400).json({ message: "Invalid quiz data format. Expected an array." });
            }

            const newQuizzes = await Promise.all(
                quizData.map(async (quiz) => {
                    return Quiz.create(quiz);
                })
            );
            res.status(201).json({ message: "Quizzes created successfully", quizzes: newQuizzes });
        } catch (error) {
            next(error);
        }
    }

    async getQuizById(req: Request, res: Response, next: NextFunction) {
        try {
            const quizId = req.params.id;
            const quiz = await Quiz.findById(quizId);

            if (!quiz) {
                res.status(404).json({ message: "Quiz not found" });
                return;
            }

            res.status(200).json(quiz);
        } catch (error) {
            next(error);
        }
    }

    async getAllQuizzes(req: Request, res: Response, next: NextFunction) {
        try {
            const quizzes = await Quiz.find();
            res.status(200).json(quizzes);
        } catch (error) {
            next(error);
        }
    }

    async updateQuiz(req: Request, res: Response, next: NextFunction) {
        try {
            const quizId = req.params.id;
            const updateData = req.body;

            // You can add validation here to ensure updateData is valid

            const updatedQuiz = await Quiz.findByIdAndUpdate(
                quizId,
                updateData,
                { new: true } // Return the updated document
            );

            if (!updatedQuiz) {
                res.status(404).json({ message: "Quiz not found" });
                return;
            }

            res.status(200).json({ message: "Quiz updated successfully", quiz: updatedQuiz });
        } catch (error) {
            next(error);
        }
    }

    async deleteQuiz(req: Request, res: Response, next: NextFunction) {
        try {
            const quizId = req.params.id;
            const deletedQuiz = await Quiz.findByIdAndDelete(quizId);

            if (!deletedQuiz) {
                res.status(404).json({ message: "Quiz not found" });
                return;
            }

            res.status(200).json({ message: "Quiz deleted successfully" });
        } catch (error) {
            next(error);
        }
    }

    async getTotalQuizzes(req: Request, res: Response, next: NextFunction) {
        try {
            const totalQuizzes = await Quiz.countDocuments();
            res.status(200).json({ totalQuizzes });
        } catch (error) {
            next(error);
        }
    }

    
}
