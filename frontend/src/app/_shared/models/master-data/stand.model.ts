export interface Stand{
  id: number;
  standName: string;
  warehouseId: number;
  userId?: string;
  locations?: Location[];
}

