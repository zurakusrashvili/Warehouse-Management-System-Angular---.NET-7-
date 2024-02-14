import { Stand } from "./Stand.model";

export interface Warehouse{
    id: number;
    name: string;
    address: string;
    phoneNumber: string;
    userId: string;
    stands: Stand[]
}