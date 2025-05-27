import { BaseExecIDModel } from "./baseExecIDModel";

export interface GetAllBirdWeightsInput extends BaseExecIDModel {
    birdID: string;
    from: string | Date;
    to: string | Date;
}