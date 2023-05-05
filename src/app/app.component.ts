import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AuthGuard } from './auth.guard';
import { AuthService } from './services/auth.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { User } from 'src/model/User';
import { FilterService } from './services/filter.service';
import { Filters } from 'src/model/Filters';
import { FilterType } from 'src/model/FilterType';
import { Module } from 'src/model/Module';
import { SubModule } from 'src/model/SubModule';
import { FunctionService } from './services/function.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

declare var $: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,AfterViewInit  {
  body = document.getElementsByTagName('body')[0]
  title = 'reporting';
  isAuth:boolean= false;
  user!:User;
  currentPath: string | undefined;
  routess!:any;
  
  filterType = FilterType;
  startDate!: Date|null;
  endDate!: Date|null;
  selectedFilter!: FilterType;
  isVaration=false;
  functionId: any;
  repRapports: any;
  repRapportId: any;
  reports: any;
  filtred: Filters = {
    startDate: null,
    endDate: null,
    idfunction: undefined,
    type_Filter: this.filterType.None,
    isVaration : false
  };

  constructor(private service:AuthService,private router:Router,private route: ActivatedRoute,public filterService: FilterService,private cookieService: CookieService,private functionService:FunctionService){
    
  }

  ngOnInit(): void {
    this.routess=this.router.url
    // set isOpen to false for all modules
    if(this.service.getToken()){
      this.service.checkToken().subscribe(
        (result: boolean) => {
          this.isAuth = result;
        },
        (error: any) => {
          console.log(error);
        }
      );
    }
    this.service.getUser().subscribe(
      (user: User) => {
        this.user = user;
        this.service.userToSave.emit(this.user);
        this.service.setUser(this.user)
        this.user.role = user.role;
        console.log(user)
      },
      (error: any) => {
        console.log(error);
      }
    );
    this.user?.user_group?.module_groups.forEach((group) => {
      group.isOpen = false; // set isOpen to false for each group
      group.list_sub_modules.forEach((subModule) => {
        subModule.isOpen = false; // set isOpen to false for each sub-module
      });
    });

    // this.functionId =this.route.snapshot.paramMap.get('id');
    // this.functionService.getReportsByFunctionId(this.functionId).subscribe(data=>{
    //   this.reports=data
    //   console.log(this.reports)
    // })
    
    }

    // onDrop(event: CdkDragDrop<any[]>) {
    //   const repId = this.reports[event.currentIndex].id;
    //   const newOrder = event.currentIndex+1;
    //   this.functionService.updateReportOrderForFunction(this.functionId, repId, newOrder)
    //     .subscribe(() => {
    //       console.log('Report order updated successfully');
    //     }, (error) => {
    //       console.error('Error updating report order:', error);
    //     });
    // }

    logOut(){
      this.cookieService.delete('jwtToken'),
      window.location.reload();
    }


  updateFilters() {
    this.filtred.startDate = this.startDate;
    this.filtred.endDate = this.endDate;
    this.filtred.type_Filter = this.selectedFilter;
    this.filtred.isVaration = this.isVaration
    this.filterService.filtredUpdated.emit(this.filtred);
  }

  toggleModuleGroup(moduleGroup: Module) {
    moduleGroup.isOpen = !moduleGroup.isOpen;
  }

  toggleSubModule(subModule: SubModule) {
    subModule.isOpen = !subModule.isOpen;
  }
  ngAfterViewInit() {
  }
}

