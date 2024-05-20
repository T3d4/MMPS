import { NextFunction, Request, Response } from "express";
export const notFound = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        res.status(404);
        throw new Error("Route not found");
    } catch (error) {
        next(error);
    }
};
