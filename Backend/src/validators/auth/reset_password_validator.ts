import Joi from "joi";

export const resetPassSchema = Joi.object({
    email: Joi.string()
        .required()
        .email({
            minDomainSegments: 2,
            tlds: { allow: ["com", "ng", "net"] },
        }),
    password: Joi.string().required(),
});