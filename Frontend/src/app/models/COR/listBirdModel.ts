export interface ListBirdModel {
    id: string;
    name: string;
    type: string;
    icon: string;
    birthDate: string | Date;
    updatedAt: string | Date | null;
}