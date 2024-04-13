import { Request, Response, NextFunction } from "express";
import { User } from "../models";

export const isAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req["userId"];

        const retrievedUser: any = await User.findById(user);
        const userObject = retrievedUser.toObject();
        userObject.isAdmin
            ? next()
            : res
                .status(403)
                .json({
                    message:"Permmison denied. Only admins have access to this resource.",
                });
    } catch (error) {
        next(error);
    }
};
