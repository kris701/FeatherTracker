import { BaseExecIDModel } from "./baseExecIDModel";

export interface AddUserInput extends BaseExecIDModel {
    firstName: string;
    lastName: string;
    loginName: string;
    password: string;
    permissions: string[];
    isActive: boolean;
    isStaff: boolean;
}