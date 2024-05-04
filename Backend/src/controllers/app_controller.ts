import { Request, Response } from "express";

export class AppController{
    public async Home(req: Request, res: Response){
        try {
            return res.status(200).json({
                message:"Server is up and running...",
            });
        } catch (error:any) {
            throw new Error(error);
        }
    }
}