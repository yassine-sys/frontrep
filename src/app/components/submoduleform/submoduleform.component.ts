import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { FunctionService } from 'src/app/services/function.service';
import { ModuleServicesService } from 'src/app/services/module-services.service';
import { SubmoduleService } from 'src/app/services/submodule.service';
import { Module } from 'src/model/Module';
import { ModuleFunction } from 'src/model/ModuleFunction';
import { SubModule } from 'src/model/SubModule';

@Component({
  selector: 'app-submoduleform',
  templateUrl: './submoduleform.component.html',
  styleUrls: ['./submoduleform.component.css']
})
export class SubmoduleformComponent implements OnInit{

  // submoduleForm!: FormGroup;
  // functions: ModuleFunction[] = [];
  // selectedFunctions: ModuleFunction[] = [];
  // submodule!: SubModule;

  addSubmoduleForm!: FormGroup;
  modules: any[] = [];


  constructor( private formBuilder: FormBuilder,
    private submoduleService: SubmoduleService,
    private functionService: FunctionService,
    private moduleService:ModuleServicesService,
    private dialogRef: MatDialogRef<SubmoduleformComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  
    ) {}

    

  

  ngOnInit() :void{

    this.addSubmoduleForm = this.formBuilder.group({
      subModuleName: ['', Validators.required],
      path: ['', Validators.required],
      moduleId: ['', Validators.required]
    });

    this.moduleService.getAllModules().subscribe(
      data => {
        this.modules = data;
      },
      error => {
        console.log('Error retrieving modules', error);
      }
    );


}

onSubmit(): void {
  if (this.addSubmoduleForm.invalid) {
    return;
  }

  const newSubmodule = {
    subModuleName: this.addSubmoduleForm.controls['subModuleName'].value,
    path: this.addSubmoduleForm.controls['path'].value,
    module: {
      id: this.addSubmoduleForm.controls['moduleId'].value
    }
  };

  this.submoduleService.addSubmodule(newSubmodule).subscribe(
    response => {
      console.log('New submodule added:', response);
      this.dialogRef.close();
      // handle success
    },
    error => {
      console.error('Error adding submodule:', error);
      // handle error
    }
  );
}

}