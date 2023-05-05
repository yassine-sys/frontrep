import { FilterType } from "./FilterType";

export interface Filters {
    idfunction:any,
    startDate:Date|null,
    endDate:Date|null,
    type_Filter: FilterType;
    isVaration : boolean;
  }