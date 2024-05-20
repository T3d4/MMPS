import Joi from "joi";

export const deleteUserSchema = Joi.object({
    userId: Joi.string().required(),
});