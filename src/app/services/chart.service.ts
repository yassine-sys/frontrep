import { HttpClient,HttpParams  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Filters } from 'src/model/Filters';

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  
  apiUrl = environment.chartApi

  constructor(private http : HttpClient) { }
  
  public getChart(id:any):Observable<Object>{
    return this.http.get(`${this.apiUrl}/welcome/rep/`+id);
  }

  public getFunctionChart(id:any):Observable<Object>{
    return this.http.get(`${this.apiUrl}/login/rep/`+id);
  }

  public getFunctionChartFiltred(data: Filters):Observable<any> {
    const startDate = data.startDate ? new Date(data.startDate) : null;
    const endDate = data.endDate ? new Date(data.endDate) : null;
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const format = new Intl.DateTimeFormat('en-CA', options).format;
    const body = new HttpParams()
      .set('idfunction', data.idfunction)
      .set('startDate', startDate ? format(startDate).split('/').reverse().join('-') : '')
      .set('endDate', endDate ? format(endDate).split('/').reverse().join('-') : '')
      .set('type_Filtre',data.type_Filter)
      .toString();
  
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    console.log(body)
    return this.http.post(`${this.apiUrl}/login/rep/`, body, { headers });
  }

  public getFunctionChartVariation(data:Filters):Observable<any>{
    const startDate = data.startDate ? new Date(data.startDate) : null;
    const endDate = data.endDate ? new Date(data.endDate) : null;
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const format = new Intl.DateTimeFormat('en-CA', options).format;
    const body = new HttpParams()
      .set('idfunction', data.idfunction)
      .set('startDate', startDate ? format(startDate).split('/').reverse().join('-') : '')
      .set('endDate', endDate ? format(endDate).split('/').reverse().join('-') : '')
      .set('type_Filtre',data.type_Filter)
      .toString();
  
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    return this.http.post(`${this.apiUrl}/login/trunding`, body, { headers });
  }
  
  }
    
