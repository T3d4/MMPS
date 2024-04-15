//Under development
import { Schema, model } from "mongoose";
import { IUser, IUserMethods } from "../interfaces";
import { compare } from "bcrypt";

const userSchema = new Schema<IUser, IUserMethods>(
    {
        user_id: {
            type: String,
            required: true,
            unique: true,
        },
        first_name: {
            type: String,
        },
        last_name: {
            type: String,
        },
        // email: {
        //     type: String,
        //     unique: true,
        // },
        hash: {
            type: String,
            required: true,
        },
        is_admin: {
            type: Boolean,
            default: false,
        },
        refresh_token: {
            type: String,
        }
    },
    {
        timestamps: true,
    }
);

// Define a static method 'login' for the user schema
userSchema.statics.login = async function (user_id: string, password: string) {
    const user: any = await this.findOne({ user_id });

    if (user) {
        const auth: boolean = await compare(password, user.hash);

        if (auth) {
            return user;
        } else {
            throw new Error("Incorrect Password");
        }
    } else {
        throw new Error("Email not found");
    }
};


export const User = model<IUser, IUserMethods>("user", userSchema);
