import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment.development';
import { Supplier } from '../models/master-data/supplier.model';
@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  private baseUrl: string = 'suppliers';

  constructor(private http: HttpClient, private router: Router) {}

  getAllSuppliers(pageSize?: number, pageNumber?: number) {
    if(pageSize != null && pageNumber != null){
      return this.http.get(
        `${environment.apiUrl}${this.baseUrl}?pageSize=`+pageSize + `&pageNumber=` + pageNumber,{withCredentials: true}
      );
    }
    return this.http.get( `${environment.apiUrl}${this.baseUrl}`,{withCredentials: true} )
  }
  getSupplier(id: number) {
    return this.http.get(`${environment.apiUrl}${this.baseUrl}/${id}`,{withCredentials: true});
  }

  createSupplier(model: Supplier) {
    return this.http.post(`${environment.apiUrl}${this.baseUrl}`, model,{withCredentials: true});
  }

  deleteSupplier(model: Supplier) {
    return this.http.delete(
      `${environment.apiUrl}${this.baseUrl}/${model.id}`,{withCredentials: true}
    );
  }
  updateSupplier(model: Supplier) {
    return this.http.put(
      `${environment.apiUrl}${this.baseUrl}/${model.id}`,
      model,{withCredentials: true}
    );
  }
}
