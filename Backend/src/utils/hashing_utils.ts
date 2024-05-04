import { hashSync, genSaltSync } from "bcrypt";

const saltRounds: number = 10;
const salt: string = genSaltSync(saltRounds);

export const hashPassword = (password: string): string => {
    const hash: string = hashSync(password, salt);
    return hash;
}