import { BaseExecIDModel } from "./baseExecIDModel";

export interface BirdModel extends BaseExecIDModel {
    id: string;
    name: string;
    description: string;
    type: string;
    icon: string;
    userID: string;
    createdAt: string | Date;
    updatedAt: string | Date | null;
}