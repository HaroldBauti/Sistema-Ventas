import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { DashBoardComponent } from './Pages/dash-board/dash-board.component';
import { UsuarioComponent } from './Pages/usuario/usuario.component';
import { ProductoComponent } from './Pages/producto/producto.component';
import { VentaComponent } from './Pages/venta/venta.component';
import { HistorialVentaComponent } from './Pages/historial-venta/historial-venta.component';
import { ReporteComponent } from './Pages/reporte/reporte.component';
import { SharedModule } from '../../Reutilizable/shared/shared.module';
import { RouterOutlet } from '@angular/router';
import { authInterceptor } from '../../Custom/auth.interceptor';

@NgModule({
  declarations: [

  ],
  imports: [
    RouterOutlet,
    CommonModule,
    LayoutRoutingModule,
    DashBoardComponent,
    UsuarioComponent,
    ProductoComponent,
    VentaComponent,
    HistorialVentaComponent,
    ReporteComponent,
    SharedModule
  ]
})
export class LayoutModule { }
