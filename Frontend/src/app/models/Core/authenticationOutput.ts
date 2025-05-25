import { UserModel } from "./userModel";

export interface AuthenticationOutput {
    user: UserModel;
    jwtToken: string;
}