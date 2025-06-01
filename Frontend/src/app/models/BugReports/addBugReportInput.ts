import { BaseExecIDModel } from "./baseExecIDModel";

export interface AddBugReportInput extends BaseExecIDModel {
    title: string;
    description: string;
}