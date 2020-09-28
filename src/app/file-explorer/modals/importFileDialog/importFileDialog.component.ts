import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-importFileDialog',
  templateUrl: './importFileDialog.component.html',
  styleUrls: ['./importFileDialog.component.css']
})
export class ImportFileDialogComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<ImportFileDialogComponent>) {
  }

  files: any = [];

  folderName: string;

  ngOnInit(): void {
  }

  uploadFile(event) {
    for (let index = 0; index < event.length; index++) {
      const element = event[index];
      this.files.push(element.name);
    }
  }

  deleteAttachment(index) {
    this.files.splice(index, 1)
  }


}
