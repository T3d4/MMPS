import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export const validator = (schema: Joi.ObjectSchema) =>
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { body } = req;
                const value = await schema.validateAsync(body);
                next();
            } catch (error) {
                res.status(400)
                next(error)
            }
        };
