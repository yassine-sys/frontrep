import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import Accessibility from 'highcharts/modules/accessibility';
import ExportingModule from 'highcharts/modules/exporting';
import type { SeriesOptionsType } from 'highcharts';
import { AuthService } from 'src/app/services/auth.service';
import { ChartService } from 'src/app/services/chart.service';
import { User } from 'src/model/User';
import { UserService } from 'src/app/services/user.service';


Accessibility(Highcharts)
ExportingModule(Highcharts);
@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  constructor(private userService:AuthService,private chartService:ChartService,private service:UserService){}

  user!: User
  highcharts = Highcharts;
  chartOptions: Highcharts.Options[] = [];
  chartData:any[] = [];
  
  ngOnInit(): void {
    this.userService.getUser().subscribe((user:User)=>{
      this.user = user
      this.chartService.getChart(this.user.uId).subscribe((data:any)=>{
          this.chartData = data
          console.log(data)
          this.buildChart(this.chartData)
          },
              (error: any) => {
                console.log(error);}
              )
      //getuser
    },(error: any) => {
      console.log(error);}
    )
  }

  buildChart(data:any){
    data.forEach((chartData: { listnamerep: any[]; list_de_donnees: any[][]; title: any; listnamereptab: any[]; chart_type: any; }) => {
      const seriesData = chartData.listnamerep.slice(0).map((name: any, i: number) => ({
        name: name,
        data: chartData.list_de_donnees.map((data: { toString: () => any; }[]) => data[i+1])
      }));
      this.chartOptions.push({
        credits: {
          enabled: false
      },
        chart: {
          type: chartData.chart_type,
          height: '40%'
      },
      title: {
        text: chartData.title.split()[0] + '<br><hr style="height:2px;color:gray;background-color:gray">',
        align: 'left',
        useHTML: true,
        style: {
          fontWeight: 'bold',
          fontSize: '16px',
          minWidth : '100%'
        }
      },
      subtitle: {
        text: chartData.title.split()[0]+(': ') + 'Date between '+ chartData.list_de_donnees.map((data: { toString: () => any; }[]) => data[0].toString()),
        align: 'center',
        style: {
          fontSize: '14px'
        }
      },
        xAxis: {
          categories: chartData.list_de_donnees.map((data: { toString: () => any; }[]) => data[0].toString())
        },
        yAxis: {
          title: {
            // text: chartData.listnamereptab[0]
            text : "Values"
          }
        },
        legend: {
          enabled: true
        },
        exporting: {
          enabled: true
        },
      tooltip:{
        valueDecimals : 1
      },
         plotOptions: {
          series: {
              borderWidth: 0,
              dataLabels: {
                  enabled: true,
                  format: '{point.y:.1f}'
              }
          }
          },
        series: seriesData.map((data: { name: any; data: any; }) => ({
          type: chartData.chart_type,
          name: data.name,
          data: data.data
        })) as SeriesOptionsType[]
      });
    })
  }



  removeFromDashboard(id:any){
    this.service.removeFromDashboard(this.user?.uId,id).subscribe(() => {
      this.chartOptions = []; // clear existing chart options
      this.chartService.getChart(this.user.uId).subscribe((data:any)=>{
      this.chartData = data;
      this.buildChart(this.chartData);
    });
    });
  }
  
}
