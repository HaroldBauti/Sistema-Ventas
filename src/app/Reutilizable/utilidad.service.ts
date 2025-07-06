import { Injectable } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { jwtDecode } from 'jwt-decode';
import { Sesion } from '../Interfaces/sesion';
import { Usuario } from '../Interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class UtilidadService {

  constructor(private _snackBar:MatSnackBar) { }

  MostrarAlerta(mensaje:string,tipo:string){
    this._snackBar.open(mensaje,tipo,{
      horizontalPosition:"end",
      verticalPosition:"top",
      duration:3000 //representacion en milisegundos
    })
  }

  GuardarSesionUsuario(usuarioSesion:string){
    // localStorage.setItem("usuario",JSON.stringify(usuarioSesion));
    localStorage.setItem("usuario",usuarioSesion);
  }
  ObtenerSesionUsuario(){
    const dataCadena=localStorage.getItem("usuario");
    const usuario =jwtDecode<Usuario>(dataCadena!);
  
    return usuario;
  }
  EliminarSesionUsuario(){
    localStorage.removeItem("usuario");
  }
}
