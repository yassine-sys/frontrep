import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import Accessibility from 'highcharts/modules/accessibility';
import ExportingModule from 'highcharts/modules/exporting';
import type { SeriesOptionsType } from 'highcharts';
import { AuthService } from 'src/app/services/auth.service';
import { ChartService } from 'src/app/services/chart.service';
import { User } from 'src/model/User';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterService } from 'src/app/services/filter.service';
import {Filters} from 'src/model/Filters'
import { FilterType } from 'src/model/FilterType';
import HC_exportData from 'highcharts/modules/export-data';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TableDialogComponent } from '../table-dialog/table-dialog.component';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';
import {HIGHCHARTS_TYPES } from 'src/model/HIGHCHARTS_TYPES'
import { FunctionService } from 'src/app/services/function.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';


Accessibility(Highcharts)
ExportingModule(Highcharts);
HC_exportData(Highcharts);
@Component({
  selector: 'app-function-charts',
  templateUrl: './function-charts.component.html',
  styleUrls: ['./function-charts.component.css']
})
export class FunctionChartsComponent implements OnInit{
  showTable = false;
  highcharts = Highcharts;
  chartOptions: Highcharts.Options[] = [];
  chart: Highcharts.Chart | null | undefined;
  chartData:any[] = [];
  funcId : any;
  user!:User;
  newuser!:User;


  startDate!: Date|null;
  endDate!: Date|null;
  isVaration= false
  filterType = FilterType
  reports: any;
  filtred: Filters = {
    startDate: null, endDate: null,
    idfunction: undefined,
    type_Filter: this.filterType.None,
    isVaration:false
  };
  public selectedChartType: string = 'default';
  highchartsTypes = HIGHCHARTS_TYPES


  constructor(private chartService:ChartService,
              private route: ActivatedRoute,
              private router:Router,
              public filterService:FilterService,
              public dialog: MatDialog,
              private userService:UserService,
              private service:AuthService,
              private toastr: ToastrService,
              private functionService:FunctionService){}

  

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.funcId = params['id'];
      this.filterService.filtredUpdated.subscribe((filtred) => {
        this.filtred.idfunction = this.funcId;
        this.filtred = filtred;
        console.log('filtred', this.filtred); // <-- console log the updated filtred object
        // do whatever you want with the updated filtred object
        if(this.filtred.isVaration === false){
          this.chartService.getFunctionChartFiltred(filtred).subscribe((data:any)=>{
            if(data){
              // update chartData with the filtered data
              data.forEach((filteredChartData: { title: any; list_de_donnees: any[][]; }) => {
                const existingChartData = this.chartData.find((chartData: { title: any; }) => chartData.title === filteredChartData.title);
                if (existingChartData) {
                  existingChartData.list_de_donnees = filteredChartData.list_de_donnees;
                } else {
                  this.chartData.push(filteredChartData);
                }
              });
              this.buildChart(this.chartData);
            } else {
              this.chartOptions = [];
            }
          },
          (error: any) => {
            console.log(error);
          });
        }else{
          this.chartService.getFunctionChartVariation(filtred).subscribe((data:any)=>{
            if(data){
              // filter the data array to keep only non-null variables
              const filteredData = data.filter((chartData: { list_de_donnees: any[][]; }) => chartData.list_de_donnees.every(row => row.every(val => val !== null)));
              
              // update chartData with the filtered data
              filteredData.forEach((filteredChartData: { title: any; list_de_donnees: any[][]; }) => {
                const existingChartData = this.chartData.find((chartData: { title: any; }) => chartData.title === filteredChartData.title);
                if (existingChartData) {
                  existingChartData.list_de_donnees = filteredChartData.list_de_donnees;
                } else {
                  this.chartData.push(filteredChartData);
                }
              });
              this.buildChart(this.chartData);
            } else {
              this.chartOptions = [];
            }
          },
          (error: any) => {
            console.log(error);
          });
        }
        
      });

      this.chartService.getFunctionChart(this.funcId).subscribe((data:any)=>{
        if(data){
          this.chartData = data
          this.buildChart(this.chartData)
        }else{
          this.chartOptions = [];
        }
      },
      (error: any) => {
        console.log(error);
      });
    });
    this.funcId =this.route.snapshot.paramMap.get('id');
    this.functionService.getReportsByFunctionId(this.funcId).subscribe(data=>{
      this.reports=data
      console.log(this.reports)
    })
  }

  onDrop(event: CdkDragDrop<any[]>) {
    const repId = this.reports[event.currentIndex].id;
    const newOrder = event.currentIndex+1;
    this.functionService.updateReportOrderForFunction(this.funcId, repId, newOrder)
      .subscribe(() => {
        console.log('Report order updated successfully');
      }, (error) => {
        console.error('Error updating report order:', error);
      });
  }
  


  buildChart(data:any){
    console.log(this.chartData)
    this.chartOptions = [];
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
          title: {
            text: chartData.listnamereptab[0]
        },
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
          enabled: true,
          menuItemDefinitions: {
            viewData: {
              text: 'View Data Table',
              onclick: () => this.openDialog(chartData.list_de_donnees,chartData.listnamereptab)
            }
          },
          buttons: {
            contextButton: {
              menuItems: ['viewData','viewFullscreen' ,'separator', 'downloadPNG', 'downloadPDF', 'downloadSVG','downloadCSV']
            }
          }
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

  exportCSV() {
    if (this.chart) {
      const csv = this.chart.getCSV();
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', 'chart_data.csv');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  openDialog(rows: any[], columns: string[]): void {
    const formattedRows = rows.map(row => {
      return row.reduce((obj: any, val: any, index: number) => {
        if (typeof val === 'number') {
          obj[columns[index]] = val.toLocaleString('en-US', {maximumFractionDigits: 2});
        } else {
          obj[columns[index]] = val;
        }
        return obj;
      }, {});
    });
    const dialogRef = this.dialog.open(TableDialogComponent, {
      data: { rows: formattedRows, columns: columns }
    });
  }
  
  
  addToDashboard(id:any){
    this.newuser = this.service.uuser
    this.userService.addToDashboard(this.newuser.uId,id).subscribe(() => {
      this.toastr.success('Repport added successfully!', 'Success');
    });
  }


  updateChartType(i: number, type: any) {
    console.log(type)
    this.chartData[i].chart_type = type.value;
    this.buildChart(this.chartData);
    }
  
  
}
