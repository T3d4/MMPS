import { ErrorRequestHandler } from "express";

export const errHandler: ErrorRequestHandler = (
    error,
    req,
    res,
    next
) => {
    const statusCode = res.statusCode == 200 ? 500 : res.statusCode;
    let message: string = "Internal server error";
    if (error instanceof Error) {
        message = error.message;
    }
    res.status(statusCode)
        .json({
            status: "fail",
            message,
        });
};
