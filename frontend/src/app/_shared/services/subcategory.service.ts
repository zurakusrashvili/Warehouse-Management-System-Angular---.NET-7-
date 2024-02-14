import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment.development';
import { Subcategory } from '../models/master-data/subcategory.model';
@Injectable({
  providedIn: 'root',
})
export class SubcategoryService {
  private baseUrl: string = 'product-subcategories';

  constructor(private http: HttpClient, private router: Router) {}

  getAllSubcategories(pageSize?: number, pageNumber?: number) {
    if(pageSize != null && pageNumber != null){
      return this.http.get(
        `${environment.apiUrl}${this.baseUrl}?pageSize=`+pageSize + `&pageNumber=` + pageNumber,{withCredentials: true}
      );
    }
    return this.http.get( `${environment.apiUrl}${this.baseUrl}`,{withCredentials: true} )
  }
  getSubcategory(id: number) {
    return this.http.get(`${environment.apiUrl}${this.baseUrl}/${id}`,{withCredentials: true});
  }

  createSubcategory(model: Subcategory) {
    return this.http.post(`${environment.apiUrl}${this.baseUrl}`, model,{withCredentials: true});
  }

  deleteSubcategory(model: Subcategory) {
    return this.http.delete(
      `${environment.apiUrl}${this.baseUrl}/${model.id}`,{withCredentials: true}
    );
  }
  updateSubcategory(model: Subcategory) {
    return this.http.put(
      `${environment.apiUrl}${this.baseUrl}/${model.id}`,
      model,{withCredentials: true}
    );
  }
}
