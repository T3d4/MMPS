import { passphrase, publicKey, privateKey } from "../config";
import { sign, verify, decode } from "jsonwebtoken";


const accessOptions: object = { expiresIn: "15m", algorithm: "RS256" };
const refreshOptions: object = { expiresIn: "7d", algorithm: "RS256" };

export const generateAccessToken = async (payload: any) => {
    try {
        if (payload) {
            return sign(
                { user_id: payload },
                { key: privateKey, passphrase },
                accessOptions
            );
        } else {
            throw new Error("Payload is required");
        }
    } catch (error: any) {
        throw new Error(error);
    }
};

export const generateRefreshToken = async (payload: string) => {
    try {
        return sign(
            { user_id: payload },
            { key: privateKey, passphrase },
            refreshOptions
        );
    } catch (error: any) {
        throw new Error(error);
    }
};

export const refreshAccessToken = async (refreshToken: any) => {
    try {
        verify(refreshToken, publicKey, refreshOptions);
        const decoded: any = decode(refreshToken);
        const userId = decoded.user_id;
        return generateAccessToken(userId);
    } catch (error: any) {
        throw new Error(error);
    }
};
