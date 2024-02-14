export interface SalesOrder {
  id: number;
  productId: number;
  quantity: number;
  transactionTypeId: number;
  customerId?: number;
  supplierId?: number;
  orderDate: Date;
  total: number;
  userId?: string;
}
