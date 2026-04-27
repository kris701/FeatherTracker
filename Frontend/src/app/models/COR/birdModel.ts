export interface BirdModel {
    id: string;
    name: string;
    description: string;
    type: string;
    icon: string;
    birthDate: string | Date;
    createdAt: string | Date;
    updatedAt: string | Date | null;
}