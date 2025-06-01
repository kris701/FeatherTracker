import { BaseExecIDModel } from "./baseExecIDModel";

export interface BugReportModel extends BaseExecIDModel {
    id: string;
    title: string;
    description: string;
    isResolved: boolean;
    createdBy: string;
    createdAt: string | Date;
    updatedAt: string | Date | null;
}