import { BaseExecIDModel } from "./baseExecIDModel";

export interface GetDateRangesOutput extends BaseExecIDModel {
    oldest: string | Date;
    newest: string | Date;
}