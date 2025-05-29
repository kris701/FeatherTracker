import { BaseExecIDModel } from "./baseExecIDModel";

export interface PurgeBirdWeightsInput extends BaseExecIDModel {
    iDs: string[];
}