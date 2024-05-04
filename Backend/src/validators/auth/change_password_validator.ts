import Joi from "joi";

export const changePassSchema = Joi.object({
    firstLogin: Joi.boolean().required(),
    password: Joi.string().required()
})