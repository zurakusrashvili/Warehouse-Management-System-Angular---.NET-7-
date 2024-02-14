import { Component, OnInit } from '@angular/core';
import { ProductCategory } from '@app/_shared/models/master-data/product-category.model';
import { Subcategory } from '@app/_shared/models/master-data/subcategory.model';
import { ProductCategoryService } from '@app/_shared/services/product-category.service';
import { SubcategoryService } from '@app/_shared/services/subcategory.service';
import { environment } from '@environment/environment.development';
import { Product} from '@models/master-data/product.model';

import { ProductService } from 'src/app/_shared/services/product.service';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  imageBaseUrl = environment.appUrl + '/uploads/';
  products: Product[] = [];

  categories: ProductCategory[] = [];
  subcategories: Subcategory[] = [];

  pageSize: number = 5;
  pageNumber: number = 1;
  constructor(private productService: ProductService, private categoryService: ProductCategoryService, private subcategoryService: SubcategoryService) {}
  ngOnInit(): void {
    this.getAllProducts();
    this.getCategories();
    this.getSubcategories();
  }
  getAllProducts() {
    // debugger;
    this.productService.getAllProducts().subscribe({
      next: (response: any) => {
        this.products = response.result;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  getCategoryName(product: Product){
    return this.categories.find(c => c.id === product.productCategoryId)?.name
  }

  getSubcategoryName(product: Product){
    return this.subcategories.find(c => c.id === product.subcategoryId)?.name
  }


  getCategories() {
    // debugger;
    this.categoryService.getAllProductCategories().subscribe({
      next: (response: any) => {
        this.categories = response.result;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  
  getSubcategories() {
    // debugger;
    this.subcategoryService.getAllSubcategories().subscribe({
      next: (response: any) => {
        this.subcategories = response.result;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

}
