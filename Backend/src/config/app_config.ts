import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import express, { json, urlencoded, Application } from "express";
import { notFound, errHandler } from "../middlewares";
import { router, authRouter, userRouter, quizRouter } from "../routes";
import path from 'path';
import '@tensorflow/tfjs-node';
import { monkeyPatchFaceAPI } from '../utils/faceapi-env';

monkeyPatchFaceAPI();

export const app: Application = express();

// Set up CORS for HTTP requests
app.use(
    cors({
        origin: ["http://localhost:3000", "http://127.0.0.1:3000", "*"],
        methods: ["POST, GET, PUT, PATCH, DELETE"],
        credentials: true,
        exposedHeaders: ["Authorization"]
    })
);

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// routes
app.use(router)

// Serve face-api.js models
app.use('/models', express.static(path.join(__dirname, 'public/models')))

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/quiz", quizRouter)
//
app.use(notFound);
app.use(errHandler);