export interface ListUserModel {
    id: string;
    firstName: string;
    lastName: string;
    permissionsCount: number;
    isActive: boolean;
    isStaff: boolean;
    createdAt: string | Date;
    updatedAt: string | Date | null;
}