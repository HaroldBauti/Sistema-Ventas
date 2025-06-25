import { Component, OnInit } from '@angular/core';

import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from '../../Interfaces/login';
import { UsuarioService } from '../../Services/usuario.service';
import { UtilidadService } from '../../Reutilizable/utilidad.service';
import { SharedModule } from '../../Reutilizable/shared/shared.module';
import { AppModule } from '../../app.module';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule],
  providers:[UsuarioService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{

  formulariologin:FormGroup;
  
  ocultarPassword:boolean=true;
  mostrarLoading:boolean=false;

  constructor(
    private fb:FormBuilder,
    private router:Router,
    private _usuarioServicio:UsuarioService,
    private utilidadServicio:UtilidadService
  ){
    this.formulariologin=this.fb.group({
      email:['',Validators.required],
      password:['',Validators.required]
    });
  }

  
  ngOnInit(): void {
      
  }
  IniciarSesion(){
    
    this.mostrarLoading=true;
    const request:Login={
      correo:this.formulariologin.value.email,
      clave:this.formulariologin.value.password
    };
    
    this._usuarioServicio.IniciarSesion(request).subscribe({
      next:(data)=>{
        if(data.status){
          this.utilidadServicio.GuardarSesionUsuario(data.value);
          this.router.navigate(["pages"]);
        }else{
          this.utilidadServicio.MostrarAlerta("No se encontraron coincidencias","Opps!");
        }
      },complete:()=>{
        this.mostrarLoading=false;
      },error:()=>{
        this.utilidadServicio.MostrarAlerta("Hubo un error","Opps!");
      }
    });

  }
}
