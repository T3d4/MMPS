//Under development
import { User } from "../models";
import { NextFunction, Request, Response } from "express";
import {
    generateAccessToken,
    generateRefreshToken,
    hashPassword,
    refreshAccessToken,
} from "../utils";
import { IUser } from "../interfaces";

// const accessCookieConfig: object = {}
const refreshCookieConfig: object = {
    httpOnly: true,
    maxAge: 72 * 60 * 60 * 1000,
    secure: true,
    sameSite: "none",
};

export class AuthController {
    public async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { password, ...otherFields } = req.body;
            const hashedPassword: string = hashPassword(password);

            // Create a new user object with hashed password and other fields
            const newUser: IUser = {
                ...otherFields,
                isAdmin: req.body.isAdmin || false, // Set isAdmin to false if not provided
                hash: hashedPassword,
            };

            const user = await User.create(newUser);

            res.status(201).json({
                message: "User created successfully",
                data: {
                    user: user._id
                },
            });
        } catch (error) {
            // Pass any errors to the next middleware for centralized error handling
            next(error);
        }
    }

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
                            refreshtkn: refreshToken,
                        },
                        { new: true }
                    );

                    // Set the refresh token as a cookie
                    res.cookie("refreshtkn", refreshToken, refreshCookieConfig);

                    // Create a sanitized user object by excluding the hash
                    const sanitizedUser = {
                        ...user.toObject(),
                        hash: undefined,
                        refreshtkn: undefined,
                        otpExpiresBy: undefined,
                    };

                    // Respond with success message, user details, and tokens
                    return res.status(200).json({
                        message: "Login Successful",
                        user: sanitizedUser,
                        token: accessToken,
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
            // Extract the refresh token from the request cookies
            const { refresh_token } = req.cookies;

            // If no refresh token is found, respond with 401 and an error message
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
                refreshtkn: undefined,
            };

            // Generate a new access token using the refresh token
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
            // Extract the refresh token from cookies
            const { refreshtkn } = req.cookies;

            // If no refresh token is found in cookies, respond with an error
            if (!refreshtkn) {
                res.status(403)
                throw new Error("No refresh token in cookie");
            }

            // Find the user document associated with the provided refresh token
            const user = await User.findOne({ refreshtkn });

            // If user is not found, clear the refresh token cookie and respond with an error status
            if (!user) {
                res.clearCookie("refreshtkn", {
                    httpOnly: true,
                    secure: true,
                });
                throw new Error("user not found");
            }
            // Update the refresh token to an empty string in the user document and retrieve the updated document
            await User.findByIdAndUpdate(
                user._id,
                {
                    refreshtkn: " ",
                },
                {
                    new: true,
                }
            );

            // Clear the refresh token cookie
            res.clearCookie("refreshtkn", {
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
