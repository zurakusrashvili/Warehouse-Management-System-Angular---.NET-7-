import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment.development';
import { Unit } from '../models/master-data/unit.model';
@Injectable({
  providedIn: 'root',
})
export class UnitService {
  private baseUrl: string = 'units';

  constructor(private http: HttpClient, private router: Router) {}

  getAllUnits(pageSize?: number, pageNumber?: number) {
    if(pageSize != null && pageNumber != null){
      return this.http.get(
        `${environment.apiUrl}${this.baseUrl}?pageSize=`+pageSize + `&pageNumber=` + pageNumber,{withCredentials: true}
      );
    }
    return this.http.get( `${environment.apiUrl}${this.baseUrl}`,{withCredentials: true} )
  }
  getUnit(id: number) {
    return this.http.get(`${environment.apiUrl}${this.baseUrl}/${id}`,{withCredentials: true});
  }

  createUnit(model: Unit) {
    return this.http.post(`${environment.apiUrl}${this.baseUrl}`, model,{withCredentials: true});
  }

  deleteUnit(model: Unit) {
    return this.http.delete(
      `${environment.apiUrl}${this.baseUrl}/${model.id}`,{withCredentials: true}
    );
  }
  updateUnit(model: Unit) {
    return this.http.put(
      `${environment.apiUrl}${this.baseUrl}/${model.id}`,
      model,{withCredentials: true}
    );
  }
}
