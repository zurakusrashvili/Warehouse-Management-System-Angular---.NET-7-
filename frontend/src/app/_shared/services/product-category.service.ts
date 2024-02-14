import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment.development';
import { ProductCategory } from '../models/master-data/product-category.model';
@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {

  private baseUrl: string = 'product-categories';

  constructor(private http: HttpClient, private router: Router) {}

  getAllProductCategories(pageSize?: number, pageNumber?: number) {
    if(pageSize != null && pageNumber != null){
      return this.http.get(
        `${environment.apiUrl}${this.baseUrl}?pageSize=`+pageSize + `&pageNumber=` + pageNumber,{withCredentials: true}
      );
    }
    return this.http.get( `${environment.apiUrl}${this.baseUrl}`,{withCredentials: true} )
  }

  getProductCategory(id: number) {
    return this.http.get(`${environment.apiUrl}${this.baseUrl}/${id}`,{withCredentials: true});
  }

  createProductCategory(model: ProductCategory) {
    return this.http.post(`${environment.apiUrl}${this.baseUrl}`, model,{withCredentials: true});
  }

  deleteProductCategory(model: ProductCategory) {
    return this.http.delete(
      `${environment.apiUrl}${this.baseUrl}/${model.id}`,{withCredentials: true}
    );
  }
  updateProductCategory(model: ProductCategory) {
    return this.http.put(
      `${environment.apiUrl}${this.baseUrl}/${model.id}`,
      model, {withCredentials: true}
    );
  }
}
