import { Product } from "./product.model";

export interface ProductCategory {
  id: number;
  name: string;
  description: string;
  userId: string;
  products: Product[]
}
