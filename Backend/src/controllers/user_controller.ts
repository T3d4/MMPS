import { Request, Response, NextFunction } from "express";
import { User } from "../models/";
import { IUser, RequestWithUser } from "../interfaces";
import { hashPassword } from "../utils";

export class UserController {
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

    public async getUserById(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params.id;
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Sanitize the response (don't send the password hash back)
            const sanitizedUser = { _id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, isAdmin: user.isAdmin };
            res.status(200).json(sanitizedUser);
        } catch (error) {
            next(error);
        }
    }

    public async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await User.find();
            // Sanitize all user objects in the array before sending
            const sanitizedUsers = users.map(user => ({ _id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, isAdmin: user.isAdmin }));
            res.status(200).json(sanitizedUsers);
        } catch (error) {
            next(error);
        }
    }

    public async updateUser(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const userId = req.params.id;
            const updateData = req.body;

            // Check authorization (can only update self or if admin)
            if (req.user.id !== userId && !req.user.isAdmin) {
                return res.status(403).json({ message: "Unauthorized" });
            }

            // Input Validation (optional, but highly recommended)
            // ... (Validate updateData based on your schema) ...

            // Exclude fields that shouldn't be updated directly (e.g., password, isAdmin)
            delete updateData.password; // Don't allow direct password updates here
            delete updateData.isAdmin;   // Don't allow changing admin status directly

            const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

            if (!updatedUser) {
                return res.status(404).json({ message: "User not found" });
            }

            // Sanitize the response
            const sanitizedUser = { _id: updatedUser._id, firstName: updatedUser.firstName, lastName: updatedUser.lastName, email: updatedUser.email, isAdmin: updatedUser.isAdmin };
            res.status(200).json({ message: "User updated successfully", user: sanitizedUser });
        } catch (error) {
            next(error);
        }
    }

    public async deleteUser(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const userId = req.params.id;

            // Check authorization (admin only)
            if (!req.user.isAdmin) {
                return res.status(403).json({ message: "Unauthorized" });
            }

            const deletedUser = await User.findByIdAndDelete(userId);

            if (!deletedUser) {
                return res.status(404).json({ message: "User not found" });
            }

            res.status(200).json({ message: "User deleted successfully" });
        } catch (error) {
            next(error);
        }
    }
}
