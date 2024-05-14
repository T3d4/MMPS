//Under development
import { User } from "../models";
import { NextFunction, Request, Response } from "express";
import {
    generateAccessToken,
    generateRefreshToken,
    refreshAccessToken,
} from "../utils";

// TODO
// use user interface for enabling a contract between user variables
import { IUser } from "../interfaces";

// const accessCookieConfig: object = {}
const refreshCookieConfig: object = {
    httpOnly: true,
    maxAge: 72 * 60 * 60 * 1000,
    secure: true,
    sameSite: "none",
};

export class AuthController {

    public async login(req: Request, res: Response, next: NextFunction) {
        const { email, password } = req.body;
        try {
            if (password && email) {
                // Attempt to login using the login static method on the User model
                const user: any = await User.login(email, password);

                if (user) {
                    const accessToken = await generateAccessToken(user._id);
                    const refreshToken = await generateRefreshToken(user._id);

                    // Update the user document with the new refresh token
                    await User.findByIdAndUpdate(
                        user._id,
                        {
                            refreshToken: refreshToken,
                        },
                        { new: true }
                    );

                    // Set the refresh token as a cookie
                    res.cookie("refreshToken", refreshToken, refreshCookieConfig);

                    const sanitizedUser = {
                        ...user.toObject(),
                        hash: undefined,
                        refreshToken: undefined,
                        otpExpiresBy: undefined,
                    };

                    // Set the access token in the Authorization header
                    res.setHeader('Authorization', `Bearer ${accessToken}`);

                    return res.status(200).json({
                        message: "Login Successful",
                        user: sanitizedUser,
                    });

                } else {
                    res.status(401);
                    throw new Error("Invalid email or password");
                }
            } else {
                // If email or password is missing, respond with 400 and an error message
                res.status(400);
                throw new Error("Email and password are required");
            }
        } catch (error) {
            next(error);
        }
    }


    public async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const { refresh_token } = req.cookies;

            if (!refresh_token) {
                res.status(401);
                throw new Error("No refresh token in cookie");
            }

            // Find the user document associated with the provided refresh token
            const user = await User.findOne({ refresh_token });

            // If no user is found, respond with 404 and an error message
            if (!user) {
                res.status(404);
                throw new Error("User with refresh token not found");
            }

            const sanitizedUser = {
                ...user.toObject(),
                hash: undefined,
                refreshToken: undefined,
            };

            const token = await refreshAccessToken(refresh_token);

            // Respond with success message and the new access token
            return res.status(200).json({
                status: "success",
                token,
                sanitizedUser,
            });
        } catch (error) {
            // Pass any errors to the next middleware for centralized error handling
            next(error);
        }
    }

    public async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const { refreshToken } = req.cookies;

            if (!refreshToken) {
                res.status(403)
                throw new Error("No refresh token in cookie");
            }

            // Find the user document associated with the provided refresh token
            const user = await User.findOne({ refreshToken });

            // If user is not found, clear the refresh token cookie and respond with an error status
            if (!user) {
                res.clearCookie("refreshToken", {
                    httpOnly: true,
                    secure: true,
                });
                throw new Error("user not found");
            }
            // Update the refresh token to an empty string in the user document and retrieve the updated document
            await User.findByIdAndUpdate(
                user._id,
                {
                    refreshToken: " ",
                },
                {
                    new: true,
                }
            );

            // Clear the refresh token cookie
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: true,
            });
            // Respond with a successful logout status
            return res.sendStatus(204);
        } catch (error) {
            // Pass any errors to the next middleware for centralized error handling
            next(error);
        }
    }
}
