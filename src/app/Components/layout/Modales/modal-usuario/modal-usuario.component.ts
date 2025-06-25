import { Component,inject,Inject } from '@angular/core';

import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Rol } from '../../../../Interfaces/rol';
import { Usuario } from '../../../../Interfaces/usuario';
import { RolService } from '../../../../Services/rol.service';
import { UsuarioService } from '../../../../Services/usuario.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import { share } from 'rxjs';
import { SharedModule } from '../../../../Reutilizable/shared/shared.module';

@Component({
  selector: 'app-modal-usuario',
  standalone: true,
  imports: [SharedModule],
  providers:[UsuarioService,RolService],
  templateUrl: './modal-usuario.component.html',
  styleUrl: './modal-usuario.component.css'
})
export class ModalUsuarioComponent {
  formularioUsuario:FormGroup;
  ocultarPassword:boolean =true;
  tituloAccion:string = "Agregar";
  botonAccion:string = "Guardar";
  listaRoles:Rol[]=[];

  constructor(
    private modalActual:MatDialogRef<ModalUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public datosUsuario:Usuario,
    private fb:FormBuilder,
    private _rolServicio:RolService,
    private _usuarioServicio:UsuarioService,
    private _utilidadServicio:UtilidadService
  ){
    this.formularioUsuario=this.fb.group({
      nombreCompleto:['',Validators.required],
      correo:['',Validators.required],
      idRol:['',Validators.required],
      clave:['',Validators.required],
      esActivo:['1',Validators.required]
  });
    if(this.datosUsuario!=null){
      this.tituloAccion="Aditar";
      this.botonAccion="Actualizar"
    } 
    this._rolServicio.Lista().subscribe({
      next:(data)=>{
        if(data.status) this.listaRoles=data.value

      },error:(e)=>{}
    })
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if(this.datosUsuario!=null){
      this.formularioUsuario.patchValue({
        nombreCompleto:this.datosUsuario.nombreCompleto,
        correo:this.datosUsuario.correo,
        idRol:this.datosUsuario.idRol,
        clave:this.datosUsuario.clave,
        esActivo:this.datosUsuario.esActivo.toString()
      })
    }
  }

  GuardarEditar_Usuario(){
    const _usuario:Usuario={
      idUsuario:this.datosUsuario==null?0:this.datosUsuario.idUsuario,
      nombreCompleto:this.formularioUsuario.value.nombreCompleto,
      correo:this.formularioUsuario.value.correo,
      idRol:this.formularioUsuario.value.idRol,
      rolDescription:"",
      clave:this.formularioUsuario.value.clave,
      esActivo:parseInt(this.formularioUsuario.value.esActivo)
    }
    if(this.datosUsuario==null){
      this._usuarioServicio.Guardar(_usuario).subscribe({
        next:(data)=>{
          if(data.status){
            this._utilidadServicio.MostrarAlerta("Usuario fue registrado","Exito");
            this.modalActual.close("true");
          }else{
            this._utilidadServicio.MostrarAlerta("No se pudo registrar usuario","Error");
          }
        },error:(e)=>{}
      })
    }else{
      this._usuarioServicio.Editar(_usuario).subscribe({
        next:(data)=>{
          if(data.status){
            this._utilidadServicio.MostrarAlerta("Usuario fue editado","Exito");
            this.modalActual.close("true");
          }else{
            this._utilidadServicio.MostrarAlerta("No se pudo editar usuario","Error");
          }
        },error:(e)=>{}
      })
    }
  }
}
