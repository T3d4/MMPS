//Under development
import { Router } from "express";
import { UserController } from "../controllers";
import {
    createUserSchema,
    updateUserSchema,
    deleteUserSchema
} from "../validators";
import { validator, authenticateToken, isAdmin} from "../middlewares";

const {createUser, deleteUser, getAllUsers, getUserById, updateUser} = new UserController();
export const userRouter = Router();

// CREATE - Create a new user (Admin only)
userRouter.post(
    "/",
    authenticateToken,
    isAdmin,
    validator(createUserSchema),
    createUser
);

// READ - Get a specific user by ID (Admin only)
userRouter.get(
    "/:id",
    authenticateToken,
    isAdmin,
    getUserById
);

// READ - Get all users (Admin only)
userRouter.get("/", authenticateToken, isAdmin, getAllUsers);

// UPDATE - Update a user by ID (Admin or self)
userRouter.patch(
    "/:id",
    authenticateToken,
    validator(updateUserSchema),
    updateUser
);

// DELETE - Delete a user by ID (Admin only)
userRouter.delete(
    "/:id",
    authenticateToken,
    isAdmin,
    validator(deleteUserSchema),
    deleteUser
);
