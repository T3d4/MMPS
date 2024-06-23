//Under development
import { User } from "../models";
import { NextFunction, Request, Response } from "express";
import {
    generateAccessToken,
    generateRefreshToken,
    hashPassword,
    refreshAccessToken,
} from "../utils";
import * as faceapi from 'face-api.js';
import path from 'path';
import { IUser } from "src/interfaces";

// TODO
// use user interface for enabling a contract between user variables
// import { IUser } from "../interfaces";

// const accessCookieConfig: object = {}
const refreshCookieConfig: object = {
    httpOnly: true,
    maxAge: 72 * 60 * 60 * 1000,
    secure: true,
    sameSite: "none",
};

export class AuthController {

    public async signup(req: Request, res: Response, next: NextFunction) {
        const { name, email, password, faceDescriptor } = req.body;

        try {
            if (!name || !email || !password || !faceDescriptor) {
                return res.status(400).json({ message: "All fields are required." });
            }

            // Check if a user with the same email already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "User with this email already exists." });
            }

            // Check for unique face descriptor
            const users = await User.find({});
            for (const user of users) {
                const labeledFaceDescriptors = new faceapi.LabeledFaceDescriptors(
                    user.email,
                    [Float32Array.from(user.faceDescriptor)]
                );
                const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.4);
                const bestMatch = faceMatcher.findBestMatch(new Float32Array(faceDescriptor));
                if (bestMatch.distance < 0.4) {
                    return res.status(400).json({ message: "Face descriptor already exists for another user." });
                }
            }

            const hashedPassword: string = hashPassword(password);

            // Create a new user object with hashed password and other fields
            const newUser = {
                name: name,
                email: email,
                isAdmin: req.body.isAdmin || false, // Set isAdmin to false if not provided
                hash: hashedPassword,
                faceDescriptor: faceDescriptor
            };

            const user = await User.create(newUser);


            // Update the user document with the new refresh token
            // newUser.refreshToken = refreshToken;
            // await newUser.save();

            // res.cookie("refreshToken", refreshToken, {
            //     httpOnly: true,
            //     maxAge: 72 * 60 * 60 * 1000,
            //     secure: true,
            //     sameSite: "none",
            // });

            const sanitizedUser = {
                ...user.toObject(),
                hash: undefined,
                refreshToken: undefined,
                otpExpiresBy: undefined,
            };

            // res.setHeader('Authorization', `Bearer ${accessToken}`);

            return res.status(201).json({
                message: "Signup Successful",
                user: sanitizedUser,
            });
        } catch (error) {
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
                            refreshToken: refreshToken,
                            accessToken: accessToken
                        },
                        { new: true }
                    );

                    // Set the refresh token as a cookie
                    res.cookie("refreshToken", refreshToken, refreshCookieConfig);

                    const sanitizedUser = {
                        ...user.toObject(),
                        email: email,
                        name: user.name,
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

    public async validateFace(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, faceDescriptor } = req.body;

            if (!email || !faceDescriptor) {
                return res.status(400).json({ message: "Email and face descriptor are required." });
            }

            const user = await User.findOne({ email });
            if (!user || !user.faceDescriptor) {
                return res.status(404).json({ message: "User not found or face descriptor missing" });
            }

            // Load models (only once, potentially on server startup)
            // await faceapi.nets.ssdMobilenetv1.loadFromDisk(path.join(__dirname, '../public/models'));
            // await faceapi.nets.faceLandmark68Net.loadFromDisk(path.join(__dirname, '../public/models'));
            // await faceapi.nets.faceRecognitionNet.loadFromDisk(path.join(__dirname, '../public/models'));

            // Create LabeledFaceDescriptors and FaceMatcher
            const labeledFaceDescriptors = new faceapi.LabeledFaceDescriptors(
                user.email,
                [Float32Array.from(user.faceDescriptor)]
            );
            const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.7);

            // Compare the descriptors
            const bestMatch = faceMatcher.findBestMatch(new Float32Array(faceDescriptor));

            if (bestMatch.distance < 0.7) {
                return res.status(200).json({ success: true, message: 'Face validated successfully', user });
            }

            return res.status(401).json({ success: false, message: 'Face not recognized' });

        } catch (error) {
            next(error);
        }

    }
}
