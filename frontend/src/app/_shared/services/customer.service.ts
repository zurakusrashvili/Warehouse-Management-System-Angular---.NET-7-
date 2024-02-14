import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment.development';
import { Customer } from '../models/master-data/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private baseUrl: string = 'customers';

  constructor(private http: HttpClient, private router: Router) {}

  getAllCustomers() {
    return this.http.get(`${environment.apiUrl}${this.baseUrl}`,{withCredentials: true});
  }

  getCustomer(id: number) {
    return this.http.get(
      `${environment.apiUrl}${this.baseUrl}/${id}`,{withCredentials: true}
    );
  }

  createCustomer(model: Customer) {
    return this.http.post(
      `${environment.apiUrl}${this.baseUrl}`, model,{withCredentials: true}
    );
  }

  deleteCustomer(model: Customer) {
    return this.http.delete(
      `${environment.apiUrl}${this.baseUrl}/${model.id}`,{withCredentials: true}
    );
  }
  updateCustomer(model: Customer) {
    return this.http.put(
      `${environment.apiUrl}${this.baseUrl}/${model.id}`, model,{withCredentials: true}
    );
  }
}
