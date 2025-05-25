export interface JWTTokenModel {
    nameid: string;
    role: string[];
    iat: number;
    exp: number;
}