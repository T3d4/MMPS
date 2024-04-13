import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import express, { json, urlencoded, Application } from "express";

export const app: Application = express();

// Set up CORS for HTTP requests
app.use(
    cors({
        origin: ["http://localhost:3000", "http://127.0.0.1:3000", "*"],
        methods: ["POST, GET, PUT, PATCH, DELETE"],
        credentials: true,
    })
);

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// routes

//
app.use(notFound);
app.use(errHandler);