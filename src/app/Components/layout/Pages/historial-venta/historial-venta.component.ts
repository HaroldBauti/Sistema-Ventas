import { Component,AfterViewInit, ViewChild, viewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import moment from 'moment';
import { ModalDetalleVentaComponent } from '../../Modales/modal-detalle-venta/modal-detalle-venta.component';
import { Venta } from '../../../../Interfaces/venta';
import { VentaService } from '../../../../Services/venta.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import { SharedModule } from '../../../../Reutilizable/shared/shared.module';

export const MY_DATA_FORMATS={
  parse:{
    dateInput:'DD/MM/YYYY'
  },
  display:{
    dateInput:'DD/MM/YYYY',
    monthYearLabel:'MMMM YYYY'
  }
}

@Component({
  selector: 'app-historial-venta',
  standalone: true,
  imports: [SharedModule,MatDialogModule],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATA_FORMATS },VentaService],
  templateUrl: './historial-venta.component.html',
  styleUrl: './historial-venta.component.css'
})
export class HistorialVentaComponent {

  formularioBusqueda:FormGroup;
  opcionesBusqueda:any[]=[
    {value:"fecha",descripcion:"Por fechas"},
    {value:"numero",descripcion:"Por numero venta"},
  ]

  columnasTabla:string[]=['fechaRegistro','numeroDocumento','tipoPago','total','accion'];
  dataInicio:Venta[]=[];
  datosListaVenta=new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!:MatPaginator;
  
  constructor(
    private fb:FormBuilder,
    private dialog:MatDialog,
    private _ventaServicio:VentaService,
    private _utilidadServicio:UtilidadService
  ){
    this.formularioBusqueda=this.fb.group({
      buscarPor:['fecha'],
      numero:[''],
      fechaInicio:[''],
      fechaFin:['']
    })

    this.formularioBusqueda.get("buscarPor")?.valueChanges.subscribe(value=>{
      this.formularioBusqueda.patchValue({
        numero:"",
        fechaInicio:"",
        fechaFin:""
      })
    })
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    
  }
  ngAfterViewInit(): void {
    this.datosListaVenta.paginator=this.paginacionTabla;
  }

  AplicarFiltroTabla(event:Event){
    const filtroValue=(event.target as HTMLInputElement).value;
    this.datosListaVenta.filter=filtroValue.trim().toLocaleLowerCase();
  }

  buscarVentas(){
    let _fechaInicio:string="";
    let _fechaFin:string="";

    if(this.formularioBusqueda.value.buscarPor==="fecha"){
      _fechaInicio=moment(this.formularioBusqueda.value.fechaInicio).format('DD/MM/YYYY');
      _fechaFin=moment(this.formularioBusqueda.value.fechaFin).format('DD/MM/YYYY');
      
      if(_fechaInicio==="Invalid date"||_fechaFin==="Invalid date"){
        this._utilidadServicio.MostrarAlerta("Debe ingresar ambas fechas","Oops!");
        return;
      }
    }
    
    this._ventaServicio.Historial(
      this.formularioBusqueda.value.buscarPor,
      this.formularioBusqueda.value.numero,
      _fechaInicio,_fechaFin
    ).subscribe({
      next:(data)=>{
        if(data.status)
          this.datosListaVenta.data=data.value;
        else
          this._utilidadServicio.MostrarAlerta("No se encontraron datos","Oops!");
      },error:(e)=>{}
    })
  }
  verDetalleVenta(_venta:Venta){
    this.dialog.open(ModalDetalleVentaComponent,{
      data:_venta,
      disableClose:true,
      width:'700px'
    })
  }
}
