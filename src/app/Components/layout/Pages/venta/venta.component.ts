import { Component } from '@angular/core';

import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ProductoService } from '../../../../Services/producto.service';
import { VentaService } from '../../../../Services/venta.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import { Producto } from '../../../../Interfaces/producto';
import { Venta } from '../../../../Interfaces/venta';
import { DetalleVenta } from '../../../../Interfaces/detalle-venta';
import Swal from 'sweetalert2';
import { SharedModule } from '../../../../Reutilizable/shared/shared.module';

@Component({
  selector: 'app-venta',
  standalone: true,
  imports: [SharedModule],
  providers:[VentaService,ProductoService],
  templateUrl: './venta.component.html',
  styleUrl: './venta.component.css'
})
export class VentaComponent {
  listaProductos:Producto[]=[];
  listaProductosFiltro:Producto[]=[];
  listaProductoParaVenta:DetalleVenta[]=[];
  bloquearBotonRegistrar:boolean=false;
  productoSelecionado!:Producto;
  tipoPagoPorDefecto:string="Efectivo";
  totalPagar:number=0;

  formularioProductoVenta:FormGroup;
  columnasTabla:string[]=['producto','cantidad','precio','total','accion'];
  datosDetalleVenta=new MatTableDataSource(this.listaProductoParaVenta);

  retornarProductosPorElFiltro(busqueda:any){
    const valorBuscado=typeof busqueda=="string"?busqueda.toLocaleLowerCase():busqueda.nombre.toLocaleLowerCase();

    return this.listaProductos.filter(item=>item.nombre.toLocaleLowerCase().includes(valorBuscado));
  }
  constructor(
    private fb:FormBuilder,
    private _productoServicio:ProductoService,
    private _ventaServicio:VentaService,
    private _utilidadServicio:UtilidadService
  ){
    this.formularioProductoVenta= this.fb.group({
      producto:['',Validators.required],
      cantidad:['',Validators.required],
    });
    this._productoServicio.Lista().subscribe({
      next:(data)=>{
        if(data.status){
          const lista=data.value as Producto[];
          this.listaProductos=lista.filter(p=>p.esActivo==1 && p.stock>0);
        }
      },error:(e)=>{}
    })

    this.formularioProductoVenta.get('producto')?.valueChanges.subscribe(value=>{
      this.listaProductosFiltro=this.retornarProductosPorElFiltro(value);
    })
  }

  MostrarProducto(producto:Producto):string{
    return producto.nombre;
  }
  ProductoParaVenta(event:any){
    this.productoSelecionado=event.option.value;
  }
  AgregarProductosParaVenta(){
    const _cantidad:number=this.formularioProductoVenta.value.cantidad;
    const _precio:number=parseFloat(this.productoSelecionado.precio);
    const _total:number=_cantidad*_precio;
    this.totalPagar=this.totalPagar+_total;
    console.log(this.productoSelecionado);
    this.listaProductoParaVenta.push({
      idProducto:this.productoSelecionado.idProducto,
      descripcionProducto:this.productoSelecionado.nombre,
      cantidad:_cantidad,
      precioTexto:String(_precio.toFixed(2)),
      totalTexto:String(_total.toFixed(2))
    })
    console.log(this.listaProductoParaVenta);

    this.datosDetalleVenta=new MatTableDataSource(this.listaProductoParaVenta);
    this.formularioProductoVenta.patchValue({
      producto:'',
      cantidad:''
    })
  }

  EliminarProducto(detalle:DetalleVenta){
    this.totalPagar=this.totalPagar-parseFloat(detalle.totalTexto),
    this.listaProductoParaVenta=this.listaProductoParaVenta.filter(p=>p.idProducto!=detalle.idProducto);

    this.datosDetalleVenta=new MatTableDataSource(this.listaProductoParaVenta);
  }

  RegistrarVenta(){
    if(this.listaProductoParaVenta.length>0){
      this.bloquearBotonRegistrar=true;
      const request:Venta={
        tipoPago:this.tipoPagoPorDefecto,
        totalTexto:String(this.totalPagar.toFixed(2)),
        detalleVenta:this.listaProductoParaVenta
      }

      this._ventaServicio.Registrar(request).subscribe({
        next:(response)=>{
          if(response.status){
            this.totalPagar=0.00;
            this.listaProductoParaVenta=[];
            this.datosDetalleVenta=new MatTableDataSource(this.listaProductoParaVenta);

            Swal.fire({
              icon:'success',
              title:'Venta Registrada',
              text:`Numero Venta: ${response.value.numeroDocumento}`
            })
          }else{
            this._utilidadServicio.MostrarAlerta("No se pudo registrar la venta","Opps");
          }
        },complete:()=>{
          this.bloquearBotonRegistrar=false;
        },error:(e)=>{}
      })
    }
  }
}
