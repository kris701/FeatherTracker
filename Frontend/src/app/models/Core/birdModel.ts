import { BaseExecIDModel } from "./baseExecIDModel";

export interface BirdModel extends BaseExecIDModel {
    id: string;
    name: string;
    description: string;
    type: string;
    icon: string;
    userID: string;
    birthDate: string | Date;
    createdAt: string | Date;
    updatedAt: string | Date | null;
}