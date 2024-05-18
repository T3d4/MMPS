//Under development
import { Types } from "joi";
import { Model, ObjectId } from "mongoose";

export interface IUser {
    _id?: ObjectId;
    id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    hash?: string;
    refreshToken?: string;
    isAdmin?: boolean;
    faceDescriptor?: Array[any];
}

export interface IUserMethods extends Model<IUser> {
    login(email: string, password: string): object;
}