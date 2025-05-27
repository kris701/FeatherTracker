export interface JWTTokenModel {
    nameid: string;
    role: string[];
    isstaff: string;
    iat: number;
    exp: number;
}