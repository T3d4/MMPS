//Under development
import { Document, Model, Types } from "mongoose";

export interface IUser{
    user_id?:   string;
    first_name?: string;
    last_name?:  string;
    // email?:string;
    hash?:string;
    refresh_token?:string;
    is_admin?:boolean;
}

export interface IUserMethods extends Model<IUser> {
    login(email: string, password: string): object;
}