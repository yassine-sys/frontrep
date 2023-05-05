import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA ,MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-table-dialog',
  templateUrl: './table-dialog.component.html',
  styleUrls: ['./table-dialog.component.css']
})
export class TableDialogComponent {
  columns: string[];
  dataSource: MatTableDataSource<any>;

  constructor(@Inject(MAT_DIALOG_DATA) data: any,private dialogRef: MatDialogRef<TableDialogComponent>) {
    this.columns = data.columns;
    console.log(data)
    this.dataSource = new MatTableDataSource<any>(data.rows);
  }

  onCloseDialog():void{this.dialogRef.close();}
  saveAsCSV(){}
  saveAsXLSX(){}
}
