//Under development
import { Router } from "express";
import { UserController } from "../controllers";
import {
    updateUserSchema,
    deleteUserSchema
} from "../validators";
import { validator, authenticateToken, isAdmin } from "../middlewares";

const { deleteUser, getAllUsers, getUserById, updateUser, getTotalUsers } = new UserController();
export const userRouter = Router();

userRouter.get("/total", getTotalUsers)

// READ - Get all users (Admin only)
userRouter.get(
    "/all",
    getAllUsers
);

// READ - Get a specific user by ID (Admin only)
userRouter.get(
    "/:id",
    getUserById
);

// UPDATE - Update a user by ID (Admin or self)
userRouter.patch(
    "/:id",
    validator(updateUserSchema),
    updateUser
);

// DELETE - Delete a user by ID (Admin only)
userRouter.delete(
    "/:id",
    validator(deleteUserSchema),
    deleteUser
);
