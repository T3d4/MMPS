//Under development
import { Schema, model } from "mongoose";
import { IUser, IUserMethods } from "../interfaces";
import { compare } from "bcrypt";
import { string } from "joi";

const userSchema = new Schema<IUser, IUserMethods>(
    {
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        email: {
            type: String,
            unique: true,
        },
        hash: {
            type: String,
            required: true,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        refreshToken: {
            type: String,
        },
        faceDescriptor: {
            type: Object,
            required: true
        },
    },
    {
        timestamps: true,
    }
);

userSchema.virtual('id').get(function (this: IUser) {
    return this._id.toString();
});

userSchema.set('toJSON', {
    virtuals: true,
});
// Define a static method 'login' for the user schema
userSchema.statics.login = async function (email: string, password: string) {
    const user: any = await this.findOne({ email });

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
