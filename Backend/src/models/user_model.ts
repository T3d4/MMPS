import { Schema, model, Document } from "mongoose";
import { compare } from "bcrypt";
import { IUser, IUserDocument, IUserModel } from "../interfaces";

const userSchema = new Schema<IUserDocument>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    hash: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String
    },
    accessToken: {
        type: String
    },
    faceDescriptors: { type: [[Number]], default: [] },
});

// Virtual for 'id' field
userSchema.virtual('id').get(function (this: IUserDocument) {
    return this._id.toString();
});

// toJSON transformation to hide sensitive fields
userSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.hash; // Ensure hash is not exposed
    }
});

// Static method for user login
userSchema.statics.login = async function (email: string, password: string): Promise<IUserDocument> {
    const user = await this.findOne({ email });

    if (!user) {
        throw new Error("Email not found");
    }

    const auth = await compare(password, user.hash);

    if (!auth) {
        throw new Error("Incorrect Password");
    }

    return user;
};

export const User = model<IUserDocument, IUserModel>("User", userSchema);
