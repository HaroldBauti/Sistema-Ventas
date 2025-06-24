import { Injectable } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Sesion } from '../Interfaces/sesion';

@Injectable({
  providedIn: 'root'
})
export class UtilidadService {

  constructor(private _nackBar:MatSnackBar) { }

  MostrarAlerta(mensaje:string,tipo:string){
    this._nackBar.open(mensaje,tipo,{
      horizontalPosition:"end",
      verticalPosition:"top",
      duration:3000 //representacion en milisegundos
    })
  }

  GuardarSesionUsuario(usuarioSesion:Sesion){
    localStorage.setItem("usuario",JSON.stringify(usuarioSesion));
  }
  ObtenerSesionUsuario(){
    const dataCadena=localStorage.getItem("usuario");
    const usuario=JSON.parse(dataCadena!)
    return usuario;
  }
  EliminarSesionUsuario(){
    localStorage.removeItem("usuario");
  }
}
