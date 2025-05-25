import { BaseExecIDModel } from "./baseExecIDModel";

export interface RegisterUserInput extends BaseExecIDModel {
    firstName: string;
    lastName: string;
    loginName: string;
    password: string;
}