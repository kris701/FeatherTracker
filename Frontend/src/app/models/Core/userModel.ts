import { BaseExecIDModel } from "./baseExecIDModel";

export interface UserModel extends BaseExecIDModel {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    loginName: string;
    permissions: string[];
    isActive: boolean;
    isStaff: boolean;
    createdAt: string | Date;
    updatedAt: string | Date | null;
}