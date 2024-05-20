//Under development
import { validator } from "../middlewares";
import { AuthController } from "../controllers";
import { Router } from "express";
import {
    createUserSchema,
    loginSchema,
} from "../validators";

const {
    login,
    refresh,
    logout,
    validateFace
} = new AuthController();

import {authenticateToken} from "../middlewares";

export const authRouter = Router();

// admin or user logs in
authRouter.route("/login").post(validator(loginSchema), login);

// checks if the refresh token stored in cookie is valid and renews the accesstoken
authRouter.route("/refresh").get(refresh);

// // reset password after confirming otp
// authRouter.route("/reset").patch(validator(resetPassSchema), resetPassword);

// clears cookies and loggs out user
authRouter.route("/logout").get(logout);
authRouter.post("/validateFace");
