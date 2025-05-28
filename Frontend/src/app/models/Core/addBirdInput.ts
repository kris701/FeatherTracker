import { BaseExecIDModel } from "./baseExecIDModel";

export interface AddBirdInput extends BaseExecIDModel {
    name: string;
    description: string;
    type: string;
    icon: string;
    userID: string;
    birthDate: string | Date;
}