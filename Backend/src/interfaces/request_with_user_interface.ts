// interfaces/requestWithUser.ts
import { Request } from 'express';
import { IUser } from './'; // Import your User interface

export interface RequestWithUser extends Request {
    user?: IUser; // Or a simplified version of IUser with the properties you need
}
