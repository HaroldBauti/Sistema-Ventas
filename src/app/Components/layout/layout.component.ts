import { Component } from '@angular/core';
import { SharedModule } from '../../Reutilizable/shared/shared.module';
import { NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule,CommonModule,SharedModule],
  templateUrl:'./layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

}
