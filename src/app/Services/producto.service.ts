import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseApi } from '../Interfaces/response-api';

import { Producto } from '../Interfaces/producto';
@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private urlApi:string=environment.endpoint+"Producto/";
  constructor(private http:HttpClient) { }

  Lista():Observable<ResponseApi>{
      return this.http.get<ResponseApi>(`${this.urlApi}Lista`)
    }
  Guardar(request:Producto):Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlApi}Guardar`,request)
  }
  Editar(request:Producto):Observable<ResponseApi>{
    return this.http.put<ResponseApi>(`${this.urlApi}Editar`,request)
  }
  Eliminar(id:number):Observable<ResponseApi>{
    return this.http.delete<ResponseApi>(`${this.urlApi}Eliminar/${id}`)
  }
}
