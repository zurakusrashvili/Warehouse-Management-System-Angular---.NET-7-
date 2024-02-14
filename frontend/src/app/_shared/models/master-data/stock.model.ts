import { Product } from "./product.model";
import { Supplier } from "./supplier.model";
import { Unit } from "./unit.model";
import { Location } from "./location.model";

export interface Stock{
    id: number;
    productId: number;
    product: Product;
    unitId: number;
    productUnit: Unit;
    supplierId: number;
    supplier: Supplier;
    purchasePrice: number;
    salesPrice: number;
    qtyInStock: number;
    valueOnHand: number;
    locationId: number;
    location: Location;
    userId: string;
}
