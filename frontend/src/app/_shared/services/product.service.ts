import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment.development';
import { Product } from '../models/master-data/product.model';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl: string = 'products';

  constructor(private http: HttpClient, private router: Router) {}

  getAllProducts(pageSize?: number, pageNumber?: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust this header as needed
    });
    const options = { headers, withCredentials: true };
    
    if (pageSize != null && pageNumber != null) {
      return this.http.get(
        `${environment.apiUrl}${this.baseUrl}?pageSize=` +
          pageSize +
          `&pageNumber=` +
          pageNumber
      );
    }
    console.log(`${environment.apiUrl}${this.baseUrl}`,{withCredentials: true})
    return this.http.get(`${environment.apiUrl}${this.baseUrl}`,{withCredentials: true});
  }

  getProduct(id: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust this header as needed
    });
    const options = { headers, withCredentials: true };
    return this.http.get(`${environment.apiUrl}${this.baseUrl}/${id}`,options);
  }

  createProduct(model: Product): Observable<any> {
    let formData = new FormData();

    formData.append('name', model.name);
    formData.append('description', model.description);
    formData.append('imageName', model.imageName);
    formData.append('productCategoryId', model.productCategoryId.toString());
    formData.append('subcategoryId', model.subcategoryId.toString());
    if (model.imageFile) {
      formData.append('imageFile', model.imageFile ?? '');
    }

    return this.http.post(`${environment.apiUrl}${this.baseUrl}`, formData);
  }

  deleteProduct(model: Product): Observable<any> {
    return this.http.delete(
      `${environment.apiUrl}${this.baseUrl}/${model.id}`
    );
  }
  updateProduct(model: Product): Observable<any> {
    let formData = new FormData();
    formData.append('id', model.id.toString());
    formData.append('name', model.name);
    formData.append('description', model.description);
    if (model.imageName) {
      debugger;
      formData.append('imageName', model.imageName);
    }
    formData.append('productCategoryId', model.productCategoryId.toString());
    formData.append('subcategoryId', model.subcategoryId.toString());
    if (model.imageFile) {
      formData.append('imageFile', model.imageFile ?? '');
    }

    return this.http.put(
      `${environment.apiUrl}${this.baseUrl}/${model.id}`,
      formData
    );
  }
}
