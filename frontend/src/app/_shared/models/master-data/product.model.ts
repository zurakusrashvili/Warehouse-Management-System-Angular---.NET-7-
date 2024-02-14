export interface Product {
  id: number;
  name: string;
  description: string;
  imageName: string;
  productCategoryId: number;
  subcategoryId: number;
  imageFile?: File;
}
