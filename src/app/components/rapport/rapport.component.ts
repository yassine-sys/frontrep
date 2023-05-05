import { Component,OnInit  } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FunctionService } from '../../services/function.service';

@Component({
  selector: 'app-rapport',
  templateUrl: './rapport.component.html',
  styleUrls: ['./rapport.component.css']
})
export class RapportComponent implements OnInit{

  functions: any[]= [];
  repRapports: any[]= [];
  selectedFunctionId!: number;
selectedRepRapportId!: number;



  constructor(
    private functionService:FunctionService,
    private dialogRef: MatDialogRef<RapportComponent>)
     {}

    

     loadFunctions() {
      this.functionService.getAllFunction()
        .subscribe(response => {
          this.functions = response;
          console.log(this.functions)
        }, error => {
          console.error(error);
        });
    }

    loadRepRapports() {
      this.functionService.getAllRepRapports()
        .subscribe(response => {
          this.repRapports = response;
        }, error => {
          console.error(error);
        });
    }

    assignRepRapportToFunction() {
      this.functionService.assignRepRapportToFunction(this.selectedFunctionId, this.selectedRepRapportId)
        .subscribe(response => {
          console.log(response); // handle the response as needed
          this.dialogRef.close();
        }, error => {
          console.error(error); // handle the error as needed
        });
    }
    cancel(){
      this.dialogRef.close();
    }

  ngOnInit() {
    this.loadFunctions();
    this.loadRepRapports();
  }

}
