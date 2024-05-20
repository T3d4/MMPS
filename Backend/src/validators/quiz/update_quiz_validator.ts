import Joi from "joi";

// UPDATE QUIZ SCHEMA
export const updateQuizSchema = Joi.object({
    name: Joi.string().optional(),
    imgURL: Joi.string().uri().allow(null).optional(),
    questions: Joi.array().items(
        Joi.object({
            id: Joi.number().required(),
            text: Joi.string().optional(),
            options: Joi.array().items(
                Joi.object({
                    id: Joi.number().required(),
                    label: Joi.string().optional(),
                    text: Joi.string().optional(),
                    isCorrect: Joi.boolean().optional(),
                })
            ).optional(),
        })
    ).optional(),
}).min(1); // Ensure at least one field is being updated