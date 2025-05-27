export interface ListUserModel {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    isActive: boolean;
    isStaff: boolean;
    createdAt: string | Date;
    updatedAt: string | Date | null;
}