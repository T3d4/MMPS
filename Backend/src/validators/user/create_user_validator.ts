import Joi from "joi";

// CREATE USER SCHEMA
export const createUserSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    isAdmin: Joi.boolean().default(false),
});