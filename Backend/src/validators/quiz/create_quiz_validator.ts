import Joi from "joi";

// CREATE QUIZ SCHEMA
export const createQuizSchema = Joi.array().items(Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    questions: Joi.array().items(
        Joi.object({
            id: Joi.number().required(),
            text: Joi.string().required(),
            options: Joi.array().items(
                Joi.object({
                    id: Joi.number().required(),
                    label: Joi.string().required(),
                    text: Joi.string().required(),
                    isCorrect: Joi.boolean().required(), // Changed to boolean for clarity
                })
            ).min(2).required(), // Require at least two options per question
        })
    ).min(1).required(), // Require at least one question in the quiz
}));