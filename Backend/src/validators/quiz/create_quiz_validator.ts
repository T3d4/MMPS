// CREATE QUIZ SCHEMA
import Joi from "joi";

// UPDATE QUIZ SCHEMA
export const createQuizSchema = Joi.object({
    id: Joi.number().required(),
    name: Joi.string().optional(),
    dateCreated: Joi.date().iso().required(),
    duration: Joi.number().required(), // Assuming dateCreated is a ISO-formatted date string
    questions: Joi.array().items(
        Joi.object({
            id: Joi.number().required(),
            text: Joi.string().optional(),
            correctAnswer: Joi.string().required(),
            options: Joi.array().items(
                Joi.object({
                    id: Joi.number().required(),
                    label: Joi.string().optional(),
                    text: Joi.string().optional(),
                    isCorrect: Joi.boolean().required()
                })
            ).min(2).required(),
        })
    ).optional(),
}).min(1); // Ensure at least one field is being updated
