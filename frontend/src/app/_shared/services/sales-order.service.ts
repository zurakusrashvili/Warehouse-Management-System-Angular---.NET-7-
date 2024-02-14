import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment.development';
import { SalesOrder } from '../models/master-data/sales-order.model';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class SalesOrderService {
  private baseUrl: string = 'sales-orders';

  constructor(private http: HttpClient, private router: Router) {}

  getAllSalesOrders(pageSize?: number, pageNumber?: number):Observable<any> {
    if (pageSize != null && pageNumber != null) {
      return this.http.get(
        `${environment.apiUrl}${this.baseUrl}?pageSize=` +
          pageSize +
          `&pageNumber=` +
          pageNumber
      );
    }
    return this.http.get(`${environment.apiUrl}${this.baseUrl}`,{withCredentials: true});
  }

  getSalesOrder(id: number):Observable<any> {
    return this.http.get(`${environment.apiUrl}${this.baseUrl}/${id}`,{withCredentials: true});
  }

  createSalesOrder(model: SalesOrder):Observable<any>  {
    return this.http.post(`${environment.apiUrl}${this.baseUrl}`, model,{withCredentials: true});
  }

  deleteSalesOrder(model: SalesOrder):Observable<any>  {
    return this.http.delete(
      `${environment.apiUrl}${this.baseUrl}/${model.id}`,{withCredentials: true}
    );
  }
  updateSalesOrder(model: SalesOrder):Observable<any>  {
    return this.http.put(
      `${environment.apiUrl}${this.baseUrl}/${model.id}`,
      model,{withCredentials: true}
    );
  }
}
