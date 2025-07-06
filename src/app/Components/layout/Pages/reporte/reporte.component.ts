import { Component,AfterViewInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import moment from 'moment';

import * as XSLX from 'xlsx';
import { Reporte } from '../../../../Interfaces/reporte';
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
  selector: 'app-reporte',
  standalone: true,
  imports: [SharedModule],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATA_FORMATS },VentaService],
  templateUrl: './reporte.component.html',
  styleUrl: './reporte.component.css'
})
export class ReporteComponent {

  formularioFiltro:FormGroup;
  listaVentasReporte:Reporte[]=[];
  columnasTabla:string[]=['fechaRegistro','numeroVenta','tipoPago','total','producto','cantidad','precio','totalProducto'];
  dataVentaReporte=new MatTableDataSource(this.listaVentasReporte);
  @ViewChild(MatPaginator) paginacionTabla!:MatPaginator;
  constructor(
    private fb:FormBuilder,
    private _ventaServicio:VentaService,
    private _utilidadServicio:UtilidadService
  ){
    this.formularioFiltro=this.fb.group({
      fechaInicio:['',Validators.required],
      fechaFin:['',Validators.required]
    })
  }
  ngAfterViewInit(): void {
    this.dataVentaReporte.paginator=this.paginacionTabla;
  }
  BuscarVentas(){
    const _fechaInicio=moment(this.formularioFiltro.value.fechaInicio).format('DD/MM/YYYY');
    const _fechaFin=moment(this.formularioFiltro.value.fechaFin).format('DD/MM/YYYY');
      
    if(_fechaInicio==="Invalid date"||_fechaFin==="Invalid date"){
      this._utilidadServicio.MostrarAlerta("Debe ingresar ambas fechas","Oops!");
      return;
    }

    this._ventaServicio.Reporte(_fechaInicio,_fechaFin).subscribe({
      next:(data)=>{
        if(data.status){
          this.listaVentasReporte=data.value;
          this.dataVentaReporte.data=data.value;
        }else{
          this.listaVentasReporte=[];
          this.dataVentaReporte.data=[];
          this._utilidadServicio.MostrarAlerta("No se encontraron datos","Oops!")
        }
      },error:(e)=>{}
    })
  }
  ExportarExcel(){
    const wb=XSLX.utils.book_new();
    const ws=XSLX.utils.json_to_sheet(this.listaVentasReporte);

    XSLX.utils.book_append_sheet(wb,ws,"Reporte");
    XSLX.writeFile(wb,"Reporte Ventas.xlsx");
  }
}
