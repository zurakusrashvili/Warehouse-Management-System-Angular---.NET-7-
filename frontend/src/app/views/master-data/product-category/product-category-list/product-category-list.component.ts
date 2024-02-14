import { Component, OnInit } from '@angular/core';
import { ProductCategory } from '@models/master-data/product-category.model';

import { ProductCategoryService } from 'src/app/_shared/services/product-category.service';
@Component({
  selector: 'app-product-category-list',
  templateUrl: './product-category-list.component.html',
  styleUrls: ['./product-category-list.component.scss']
})
export class ProductCategoryListComponent implements OnInit {
  productCategories: ProductCategory[] = [];
  pageSize: number = 5;
  pageNumber: number = 1;
  constructor(private productCategoryService: ProductCategoryService) {}
  ngOnInit(): void {
    this.getAllProductCategories();
  }

  getAllProductCategories() {
    this.productCategoryService.getAllProductCategories().subscribe({
      next: (response: any) => {
        this.productCategories = response.result;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
}
