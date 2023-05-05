import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { FunctionService } from 'src/app/services/function.service';
import { ModuleServicesService } from 'src/app/services/module-services.service';
import { SubmoduleService } from 'src/app/services/submodule.service';
import { ModuleFunction } from 'src/model/ModuleFunction';
import { SubModule } from 'src/model/SubModule';


@Component({
  selector: 'app-fonctionform',
  templateUrl: './fonctionform.component.html',
  styleUrls: ['./fonctionform.component.css']
})
export class FonctionformComponent implements OnInit{

   functionForm!: FormGroup;
   submodules: any[] = [];
   modules: any[] = [];
   fonctions:any[]=[]
  // selectedSubmodules: SubModule[] = [];
  // fonction!:ModuleFunction


  constructor(private formBuilder: FormBuilder,
    private fonctionService:FunctionService,
    private submoduleService:SubmoduleService,
    private dialogRef: MatDialogRef<FonctionformComponent>,
    private moduleService: ModuleServicesService,
    @Inject(MAT_DIALOG_DATA) public data: any
  
    ) {}

  

    ngOnInit() {
      this.functionForm = this.formBuilder.group({
        functionName: ['', Validators.required],
        submoduleId: ['', Validators.required],
      });

      this.moduleService.getAllModules().subscribe(
        data => {
          this.modules = data;
        },
        error => {
          console.log('Error retrieving modules', error);
        }
      );

      this.submoduleService.getAllSubModules().subscribe(
        data => {
          this.submodules = data;
          console.log(this.submodules)
        },
        error => {
          console.log('Error retrieving submodules', error);
        }
      );

      this.fonctionService.getAllFunction().subscribe(
        data => {
          this.fonctions = data;
        },
        error => {
          console.log('Error retrieving fonctions', error);
        }
      );
    }
    onSubmit(): void {
      if (this.functionForm.invalid) {
        return;
      }
    
      const newFunction = {
        functionName: this.functionForm.controls['functionName'].value,
        subModule: {
          id: this.functionForm.controls['submoduleId'].value
        }
      };
    
      this.fonctionService.addFonction(newFunction).subscribe(
        response => {
          console.log('New fonction added:', response);
          this.dialogRef.close();
          // handle success
        },
        error => {
          console.error('Error adding fonction:', error);
          // handle error
        }
      );
    }

    cancel(){
      this.dialogRef.close();
    }

  }