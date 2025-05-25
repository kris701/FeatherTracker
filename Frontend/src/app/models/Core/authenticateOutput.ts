import { UserModel } from "./userModel";

export interface AuthenticateOutput {
    user: UserModel | null;
    token: string;
}