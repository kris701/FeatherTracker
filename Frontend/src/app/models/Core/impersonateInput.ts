import { BaseExecIDModel } from "./baseExecIDModel";

export interface ImpersonateInput extends BaseExecIDModel {
    targetUser: string;
}