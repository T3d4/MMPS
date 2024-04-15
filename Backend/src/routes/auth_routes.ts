//Under development
import { authenticateToken, isAdmin, validator } from "../middleware";
import { AuthController } from "../controllers";
import { Router } from "express";
import {
    createUserSchema,
    loginSchema,
} from "../validators";

const {
    createUser,
    login,
    refresh,
    resetPassword,
    logout,
} = new AuthController();

export const authRouter = Router();

// admin creates each new user
authRouter.route("/create").post(validator(createUserSchema), createUser);

// admin or user logs in
authRouter.route("/login").post(validator(loginSchema), login);

// checks if the refresh token stored in cookie is valid and renews the accesstoken
authRouter.route("/refresh").get(refresh);

// // reset password after confirming otp
// authRouter.route("/reset").patch(validator(resetPassSchema), resetPassword);

// clears cookies and loggs out user
authRouter.route("/logout").get(logout);
