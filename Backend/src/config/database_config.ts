import mongoose, { connect } from "mongoose";
import { localUrl, nodeEnv, webUrl } from "./constants_config";

function selectDB() {
    if (nodeEnv !== "production")
        return { url: localUrl };

    return {
        url: webUrl,
    };
}
export const createDB = async (): Promise<void> => {
    try {
        mongoose.set("strictQuery", false);
        const { url } = selectDB();
        await connect(String(url));
        console.log(`Database connected sucessfully to mongoDB`);
    } catch (error: any) {
        throw new Error(error);
    }
};
