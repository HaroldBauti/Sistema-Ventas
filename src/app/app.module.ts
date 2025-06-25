import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from './Reutilizable/shared/shared.module';
import { LoginComponent } from './Components/login/login.component';
import { LayoutComponent } from './Components/layout/layout.component';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LoginComponent,
    LayoutComponent,
    SharedModule
  ]
})
export class AppModule { }
