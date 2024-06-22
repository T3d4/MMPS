//Under development
import { Router } from "express";
import { QuizController, QuizResultController } from "../controllers";
import {
    createQuizSchema,
    updateQuizSchema,
    deleteQuizSchema
} from "../validators";
import { validator, authenticateToken, isAdmin } from "../middlewares";

const { createQuiz, deleteQuiz, getAllQuizzes, getQuizById, updateQuiz } = new QuizController(); // Pass Quiz to controller
const { getQuizResultsByUserId, saveQuizResult } = new QuizResultController();
export const quizRouter = Router();

// CREATE - Create a new quiz (Admin only)
quizRouter.post(
    "/",
    // authenticateToken,
    isAdmin,
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
    // authenticateToken,
    isAdmin,
    validator(updateQuizSchema),
    updateQuiz
);

// DELETE - Delete a quiz by ID (Admin only)
quizRouter.delete(
    "/:id",
    // authenticateToken,
    isAdmin,
    validator(deleteQuizSchema),
    deleteQuiz
);

quizRouter.get('/user/:userId',
    getQuizResultsByUserId
);

quizRouter.post('/quiz-result',
    saveQuizResult
);
