import dotenv from "dotenv";

dotenv.config();


const PORT: string = process.env.PORT || "3000";
const passphrase = process.env.PASSPHRASE;
const localUrl = process.env.LOCAL_URL;
const webUrl = process.env.MONGO_URL;
const nodeEnv = process.env.NODE_ENV;
const privateKey = process.env.PRIVATE_KEY;
const publicKey = process.env.PUBLIC_KEY;

export {
    PORT,
    passphrase,
    localUrl,
    webUrl,
    nodeEnv,
    privateKey,
    publicKey,
};
