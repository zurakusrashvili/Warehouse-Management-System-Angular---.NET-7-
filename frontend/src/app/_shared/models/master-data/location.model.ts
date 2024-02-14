import { Stock } from "./stock.model";

export interface Location{
    id: number;
    standId: number;
    shelfNumber: number;
    placeNumber:number;
    userId: string;
    stocks: Stock[]
}
