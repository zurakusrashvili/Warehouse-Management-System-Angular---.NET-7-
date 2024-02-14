import { Product } from "./product.model";

export interface Subcategory{
    id: number;
    productCategoryId: number;
    name: string;
    description: string;
    userId: string;
    products?: Product[];
}
