import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment.development';
import { Stand } from '../models/master-data/Stand.model';
@Injectable({
  providedIn: 'root',
})
export class StandService {
  private baseUrl: string = 'stands';

  constructor(private http: HttpClient, private router: Router) {}

  getAllStands(pageSize?: number, pageNumber?: number) {
    if(pageSize != null && pageNumber != null){
      return this.http.get(
        `${environment.apiUrl}${this.baseUrl}?pageSize=`+pageSize + `&pageNumber=` + pageNumber,{withCredentials: true}
      );
    }
    return this.http.get( `${environment.apiUrl}${this.baseUrl}`,{withCredentials: true} )
  }
  getStand(id: number) {
    return this.http.get(`${environment.apiUrl}${this.baseUrl}/${id}`,{withCredentials: true});
  }

  createStand(model: Stand) {
    return this.http.post(`${environment.apiUrl}${this.baseUrl}`, model,{withCredentials: true});
  }

  deleteStand(model: Stand) {
    return this.http.delete(
      `${environment.apiUrl}${this.baseUrl}/${model.id}`,{withCredentials: true}
    );
  }
  updateStand(model: Stand) {
    return this.http.put(
      `${environment.apiUrl}${this.baseUrl}/${model.id}`,
      model,{withCredentials: true}
    );
  }
}
