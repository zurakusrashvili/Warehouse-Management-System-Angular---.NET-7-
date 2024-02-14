import { Component } from '@angular/core';
import { ProductCategory } from '@app/_shared/models/master-data/product-category.model';
import { Subcategory } from '@app/_shared/models/master-data/subcategory.model';
import { ProductCategoryService } from '@app/_shared/services/product-category.service';
import { SubcategoryService } from '@app/_shared/services/subcategory.service';

@Component({
  selector: 'app-product-subcategory-list',
  templateUrl: './product-subcategory-list.component.html',
  styleUrls: ['./product-subcategory-list.component.scss']
})
export class ProductSubcategoryListComponent {
  productCategories: ProductCategory[] = [];
  productSubcategories: Subcategory[] = []
  pageSize: number = 5;
  pageNumber: number = 1;
  constructor(private productCategoryService: ProductCategoryService, private subcategoryService: SubcategoryService) {}
  ngOnInit(): void {
    this.getAllProductCategories();
    this.getAllProductSubcategories();
  }

  getCategoryName(categoryId: number){
    return this.productCategories.find(v => v.id == categoryId)?.name
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

  getAllProductSubcategories() {
    this.subcategoryService.getAllSubcategories().subscribe({
      next: (response: any) => {
        this.productSubcategories = response.result;
        console.log(this.productSubcategories)
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
}
