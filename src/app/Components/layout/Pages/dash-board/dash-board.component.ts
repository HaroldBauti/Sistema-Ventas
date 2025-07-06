import { Component } from '@angular/core';
import {Chart,registerables} from 'chart.js' 
import { DashboardService } from '../../../../Services/dashboard.service';
import { SharedModule } from '../../../../Reutilizable/shared/shared.module';
Chart.register(...registerables);


@Component({
  selector: 'app-dash-board',
  standalone: true,
  imports: [SharedModule],
  providers:[DashboardService],
  templateUrl: './dash-board.component.html',
  styleUrl: './dash-board.component.css'
})
export class DashBoardComponent {
  totalIngresos:string="0";
  totalVentas:string="0";
  totalProducto:string="0";

  constructor(
    private _dahboardServicio:DashboardService
  ){}
  MostrarGrafico(labelGrafico:any[],dataGrafico:any[]){
    const charBarras=new Chart('chartBarras',{
      type:'bar',
      data:{
        labels:labelGrafico,
        datasets:[{
          label:"# de Ventas",
          data:dataGrafico,
          backgroundColor:[
            'rgba(54,162,235,0.2)'
          ],
          borderColor:[
            'rgba(54,162,235,1)'
          ],
          borderWidth:1
        }]
      },options:{
        maintainAspectRatio:false,
        responsive:true,
        scales:{
          y:{
            beginAtZero:true
          }
        }
      }
    });
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this._dahboardServicio.Resumen().subscribe({
      next:(data)=>{
        if(data.status){
          this.totalIngresos=data.value.totalIngresos;
          this.totalVentas=data.value.totalVenta;
          this.totalProducto=data.value.totalProducto;
          const arrayData:any[]=data.value.ventasUltimaSemana;
          console.log(arrayData);

          const labelTemp=arrayData.map((value)=>value.fecha);
          const dataTemp=arrayData.map((value)=>value.total);

          this.MostrarGrafico(labelTemp,dataTemp);
        }
      },error:(e)=>{}
    });
  }
}
