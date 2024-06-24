//Under development
import { Types } from "joi";
import { Model, ObjectId } from "mongoose";

export interface IUser {
    _id?: ObjectId;
    id?:string;
    name?: string;
    email?: string;
    hash?: string;
    refreshToken?: string;
    accessToken?: string;
    isAdmin?: boolean;
    faceDescriptors?: Array<Array<number>>;
}

export interface IUserDocument extends IUser, Document {
    // Add any instance methods here if needed
}

export interface IUserModel extends Model<IUserDocument> {
    login(email: string, password: string): Promise<IUserDocument>;
}