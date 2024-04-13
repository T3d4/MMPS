import Joi from "joi";

export const createUserSchema = Joi.object({
    User_id: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().required().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "ng", "net"] },
    }),
    role: Joi.string().required()
})