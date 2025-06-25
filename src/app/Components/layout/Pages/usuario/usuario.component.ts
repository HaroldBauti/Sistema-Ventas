import { Component,AfterViewInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ModalUsuarioComponent } from '../../Modales/modal-usuario/modal-usuario.component';
import { Usuario } from '../../../../Interfaces/usuario';
import { UsuarioService } from '../../../../Services/usuario.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import Swal from 'sweetalert2';
import { SharedModule } from '../../../../Reutilizable/shared/shared.module';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [SharedModule,MatDialogModule],
  providers:[UsuarioService],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent implements AfterViewInit{
  columnasTabla:string[]=["nombreCompleto","Correo","rolDescripcion","estado","acciones"];
  dataInicio:Usuario[]=[];
  dataListaUsuario=new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!:MatPaginator;

  constructor(
    private dialog:MatDialog,
    private _usuarioServicio:UsuarioService,
    private _utilidadServicio:UtilidadService
  ){}

  ObtenerUsuario(){
    this._usuarioServicio.Lista().subscribe({
      next:(data)=>{
        if(data.status){ this.dataListaUsuario.data=data.value
          
          console.log(this.dataListaUsuario.data);
        }
        else
          this._utilidadServicio.MostrarAlerta("No se encontraron datos","Oops!")
      },error:(e)=>{}
    })
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.ObtenerUsuario();
  }
  ngAfterViewInit(): void {
      this.dataListaUsuario.paginator=this.paginacionTabla;
  }

  AplicarFiltroTabla(event:Event){
    const filtroValue=(event.target as HTMLInputElement).value;
    this.dataListaUsuario.filter=filtroValue.trim().toLocaleLowerCase();
  }
  NuevoUsuario(){
    this.dialog.open(ModalUsuarioComponent,{
      disableClose:true
    }).afterClosed().subscribe(resultado=>{
      if(resultado==="true") this.ObtenerUsuario();
    });
  }
  EditarUsuario(usuario:Usuario){
    this.dialog.open(ModalUsuarioComponent,{
      disableClose:true,
      data:usuario
    }).afterClosed().subscribe(resultado=>{
      if(resultado==="true") this.ObtenerUsuario();
    });
  }
  
  EliminarUsuario(usuario:Usuario){
    Swal.fire({
      title:'Desea eliminar el usuario?',
      text:usuario.nombreCompleto,
      icon:"warning",
      confirmButtonColor:'#3085d6',
      confirmButtonText:"Si,Eliminar",
      showCancelButton:true,
      cancelButtonColor:'#d33',
      cancelButtonText:"No, volver"
    }).then((resultado)=>{
      if(resultado.isConfirmed){
        this._usuarioServicio.Eliminar(usuario.idUsuario).subscribe({
          next:(data)=>{
            if(data.status){
              this._utilidadServicio.MostrarAlerta("El usuario eliminado","Listo!");
              this.ObtenerUsuario();
            }else{
              this._utilidadServicio.MostrarAlerta("No se pudo eliminar","Error");
            }
          },
          error:(e)=>{}
        })
      }
    })
  }
}
