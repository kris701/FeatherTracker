import { BaseExecIDModel } from "./baseExecIDModel";

export interface AddBirdWeightInput extends BaseExecIDModel {
    grams: number;
    birdID: string;
    timestamp: string | Date;
}