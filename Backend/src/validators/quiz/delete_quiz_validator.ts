import Joi from "joi";

// DELETE QUIZ SCHEMA (for deleting a quiz by ID)
export const deleteQuizSchema = Joi.object({
    id: Joi.string().required(),
});
