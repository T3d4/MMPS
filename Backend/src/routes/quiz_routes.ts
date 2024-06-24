//Under development
import { Router } from "express";
import { QuizController, QuizResultController } from "../controllers";
import {
    createQuizSchema,
    updateQuizSchema,
} from "../validators";
import { validator, authenticateToken, isAdmin } from "../middlewares";

const { createQuiz, deleteQuiz, getAllQuizzes, getQuizById, updateQuiz, getTotalQuizzes } = new QuizController(); // Pass Quiz to controller
const { getQuizResultsByUserId, saveQuizResult } = new QuizResultController();
export const quizRouter = Router();

quizRouter.get("/total", getTotalQuizzes)

// CREATE - Create a new quiz (Admin only)
quizRouter.post(
    "/",
    validator(createQuizSchema),
    createQuiz
);

// READ - Get a specific quiz by ID
quizRouter.get(
    "/:id",
    getQuizById
);

// READ - Get all quizzes (potentially paginated)
quizRouter.get("/", getAllQuizzes);

// UPDATE - Update a quiz by ID (Admin only)
quizRouter.patch(
    "/:id",
    validator(updateQuizSchema),
    updateQuiz
);

// DELETE - Delete a quiz by ID (Admin only)
quizRouter.delete(
    "/:id",
    deleteQuiz
);

quizRouter.get('/user/:userId',
    getQuizResultsByUserId
);

quizRouter.post('/quiz-result',
    saveQuizResult
);
