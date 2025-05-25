import { BaseExecIDModel } from "./baseExecIDModel";

export interface UpdatePasswordInput extends BaseExecIDModel {
    oldPassword: string;
    newPassword: string;
}