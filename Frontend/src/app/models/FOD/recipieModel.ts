export interface RecipieModel {
    id: string;
    name: string;
    recipie: string;
    quantity: number;
    unit: string;
    birds: string[];
    createdAt: string | Date;
    updatedAt: string | Date | null;
}