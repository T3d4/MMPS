import Joi from "joi";

// CREATE USER SCHEMA
export const signupSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    isAdmin: Joi.boolean().default(false),
    faceDescriptors: Joi.any().required(),
});