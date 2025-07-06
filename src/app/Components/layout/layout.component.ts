import { Component } from '@angular/core';
import { SharedModule } from '../../Reutilizable/shared/shared.module';
import { NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Menu } from '../../Interfaces/menu';
import { MenuService } from '../../Services/menu.service';
import { UtilidadService } from '../../Reutilizable/utilidad.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '../../Custom/auth.interceptor';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule,CommonModule,SharedModule],
  providers:[MenuService],
  templateUrl:'./layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  listaMenus:Menu[]=[];
  correoUsuario:string='';
  rolUsuario:string='';

  constructor(private router:Router,
    private _menuServicio:MenuService,
    private _utilidadServicio:UtilidadService
  ){

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
      
    const usuario=this._utilidadServicio.ObtenerSesionUsuario();

    if(usuario!=null){
      this.correoUsuario=usuario.correo;
      this.rolUsuario=usuario.rolDescription;
      this._menuServicio.Lista(usuario.idUsuario).subscribe({
        next:(data)=>{
          if(data.status){ 
            this.listaMenus=data.value;
            console.log(this.listaMenus);
          }
        },error:(e)=>{}
      });
    }
  }
  CerrarSesion(){
    this._utilidadServicio.EliminarSesionUsuario();
    this.router.navigate(['login']);
  }
}
