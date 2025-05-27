import { BaseExecIDModel } from "./baseExecIDModel";

export interface BirdWeightModel extends BaseExecIDModel {
    id: string;
    grams: number;
    birdID: string;
    timestamp: string | Date;
}