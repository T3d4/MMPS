import Joi from "joi";

// UPDATE USER SCHEMA (allow partial updates)
export const updateUserSchema = Joi.object({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    email: Joi.string().email().optional(),
}).min(1); // Require at least one field to be updated