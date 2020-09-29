import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FileElement} from './model/element';
import {MatMenuTrigger} from '@angular/material/menu';
import {MatDialog} from '@angular/material/dialog';
import {NewFolderDialogComponent} from './modals/newFolderDialog/newFolderDialog.component';
import {RenameDialogComponent} from './modals/renameDialog/renameDialog.component';
import {ImportFileDialogComponent} from './modals/importFileDialog/importFileDialog.component';

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.css']
})
export class FileExplorerComponent implements OnInit {

  @Input() fileElements: FileElement[];
  @Input() canNavigateUp: string;
  @Input() path: string;
  @Output() fileAdded = new EventEmitter<File>();
  @Output() folderAdded = new EventEmitter<string>();
  @Output() elementRemoved = new EventEmitter<FileElement>();
  @Output() elementRenamed = new EventEmitter<FileElement>();
  @Output() elementMoved = new EventEmitter<{ element: FileElement; moveTo: FileElement }>();
  @Output() navigatedDown = new EventEmitter<FileElement>();
  @Output() navigatedUp = new EventEmitter();

  constructor(public dialog: MatDialog) {
  }

  ngOnInit(): void {

  }

  deleteElement(element: FileElement) {
    this.elementRemoved.emit(element);
  }

  navigate(element: FileElement) {
    if (element.isFolder) {
      this.navigatedDown.emit(element);
    }
  }

  navigateUp() {
    this.navigatedUp.emit();
  }

  moveElement(element: FileElement, moveTo: FileElement) {
    this.elementMoved.emit({element: element, moveTo: moveTo});
  }

  openNewFolderDialog() {
    const dialogRef = this.dialog.open(NewFolderDialogComponent);
    dialogRef.afterClosed().subscribe(res => {
      console.log(res);
      if (res) {
        this.folderAdded.emit(res);
      }
    });
  }

  openRenameDialog(element: FileElement) {

    const dialogRef = this.dialog.open(RenameDialogComponent);
    dialogRef.afterClosed().subscribe(res => {
      console.log(res);
      if (res) {
        if (element.isFolder) {
          element.name = res;
        } else {
          element.name = res + '.pdf';
        }

        this.elementRenamed.emit(element);
      }
    });
  }

  openMenu(event: MouseEvent, viewChild: MatMenuTrigger) {
    event.preventDefault();
    viewChild.openMenu();
  }

  openImportNewFile() {
    const dialogRef = this.dialog.open(ImportFileDialogComponent, {
      width: '800px',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        for (const name of res) {
          this.fileAdded.emit(name);
        }
      }
    });
  }

  downloadElement(element) {
    window.location.href = element.url;
  }
}
