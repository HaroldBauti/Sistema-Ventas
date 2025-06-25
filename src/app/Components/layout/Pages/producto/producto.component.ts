import { Component,AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ModalProductoComponent } from '../../Modales/modal-producto/modal-producto.component';
import { Producto } from '../../../../Interfaces/producto';
import { ProductoService } from '../../../../Services/producto.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import Swal from 'sweetalert2';
import { SharedModule } from '../../../../Reutilizable/shared/shared.module';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [SharedModule,MatDialogModule],
    providers:[ProductoService],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css'
})
export class ProductoComponent implements AfterViewInit {
  columnasTabla:string[]=["nombre","categoria","stock","precio","estado","acciones"];
  dataInicio:Producto[]=[];
  dataListaProducto=new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!:MatPaginator;
  
  constructor(
    private dialog:MatDialog,
    private _productoServicio:ProductoService,
    private _utilidadServicio:UtilidadService
  ){}

  ObtenerProducto(){
    this._productoServicio.Lista().subscribe({
      next:(data)=>{
        if(data.status){ this.dataListaProducto.data=data.value
          
        }
        else
          this._utilidadServicio.MostrarAlerta("No se encontraron datos","Oops!")
      },error:(e)=>{}
    })
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.ObtenerProducto();
  }
  ngAfterViewInit(): void {
    this.dataListaProducto.paginator=this.paginacionTabla;
  }
  AplicarFiltroTabla(event:Event){
    const filtroValue=(event.target as HTMLInputElement).value;
    this.dataListaProducto.filter=filtroValue.trim().toLocaleLowerCase();
  }
  NuevoProducto(){
    this.dialog.open(ModalProductoComponent,{
      disableClose:true
    }).afterClosed().subscribe(resultado=>{
      if(resultado==="true") this.ObtenerProducto();
    });
  }
  EditarProducto(producto:Producto){
    this.dialog.open(ModalProductoComponent,{
      disableClose:true,
      data:producto
    }).afterClosed().subscribe(resultado=>{
      if(resultado==="true") this.ObtenerProducto();
    });
  }
    
  EliminarProducto(producto:Producto){
    Swal.fire({
    title:'Desea eliminar el producto?',
    text:producto.nombre,
    icon:"warning",
    confirmButtonColor:'#3085d6',
    confirmButtonText:"Si,Eliminar",
    showCancelButton:true,
    cancelButtonColor:'#d33',
    cancelButtonText:"No, volver"
  }).then((resultado)=>{
    if(resultado.isConfirmed){
      this._productoServicio.Eliminar(producto.idProducto).subscribe({
        next:(data)=>{
          if(data.status){
            this._utilidadServicio.MostrarAlerta("El producto eliminado","Listo!");
            this.ObtenerProducto();
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
