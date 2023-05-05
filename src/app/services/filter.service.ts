import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {Filters} from '../../model/Filters'
import { FilterType } from 'src/model/FilterType';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  funcId: any;
  private startDateFilter = new BehaviorSubject<Date | null>(null);
  private endDateFilter = new BehaviorSubject<Date | null>(null);
  filterType!: FilterType
  filters!:Filters;

  filtredUpdated = new EventEmitter<Filters>();

  startDateFilter$ = this.startDateFilter.asObservable();
  endDateFilter$ = this.endDateFilter.asObservable();

  setStartDateFilter(startDate: Date) {
    this.startDateFilter.next(startDate);
  }

  setEndDateFilter(endDate: Date) {
    this.endDateFilter.next(endDate);
  }

  getFilters(){
    return { startDateFilter: this.startDateFilter, endDateFilter: this.endDateFilter };
  }
}
