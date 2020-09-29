import {Component, OnInit} from '@angular/core';
import {FileElement} from './file-explorer/model/element';
import {Observable} from 'rxjs/Observable';
import {FileService} from './service/file.service';
import {catchError, finalize, tap} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public fileElements: Observable<FileElement[]>;

  fileInfos: Observable<any>;
  currentRoot: FileElement;
  currentPath: string;
  canNavigateUp = false;

  constructor(public fileService: FileService) {
  }

  ngOnInit() {
    this.refreshData();
  }

  refreshData() {
    this.fileService.getFiles().subscribe(files => {
      for (const file of files) {
        this.fileService.add(file);
        this.updateFileElementQuery();
      }
    });

    this.fileService.getFolders().subscribe(folders => {
      for (const folder of folders) {
        this.fileService.add(folder);
        this.updateFileElementQuery();
      }
    });
  }

  addFolder(name: string, parent, isFolder) {

    if (this.currentRoot !== undefined && this.currentPath) {
      parent = this.currentRoot.id;
    } else {
      parent = 'root';
    }

    isFolder = true;

    this.fileService.addFolder(name, parent, isFolder).pipe(
      tap(res => {
        // pass notice message to the login page
      }),
      catchError(err => {
        return err;
      }),
      finalize(() => {
        this.refreshData();
      }),
    ).subscribe();
  }

  addFile(file, parent, isFolder) {

    if (this.currentRoot !== undefined && this.currentPath) {
      parent = this.currentRoot.id;
    } else {
      parent = 'root';
    }

    isFolder = false;

    this.fileService.addFile(file, parent, isFolder).pipe(
      tap(res => {
        // pass notice message to the login page

      }),
      catchError(err => {
        return err;
      }),
      finalize(() => {
        this.refreshData();
      }),
    ).subscribe();
  }

  removeElement(element: FileElement) {
    this.fileService.deleteElement(element.id, element.isFolder).pipe(
      tap(res => {
        console.log(res);
      }),
      catchError(err => {
        return err;
      }),
      finalize(() => {
        this.refreshData();
      }),
    ).subscribe();
  }

  moveElement(event: { element: FileElement; moveTo: FileElement }) {
    this.fileService.moveToAnotherElement(event.element.id, event.moveTo.id, event.element.isFolder, {parent: event.moveTo.id}).pipe(
      tap(res => {
        console.log(res);
      }),
      catchError(err => {
        return err;
      }),
      finalize(() => {
        this.refreshData();
      }),
    ).subscribe();
  }

  navigateToFolder(element: FileElement) {
    this.currentRoot = element;
    this.updateFileElementQuery();
    this.currentPath = this.pushToPath(this.currentPath, element.name);
    this.canNavigateUp = true;
  }

  navigateUp() {
    if (this.currentRoot && this.currentRoot.parent === 'root') {
      this.currentRoot = null;
      this.canNavigateUp = false;
      this.updateFileElementQuery();
    } else {
      this.currentRoot = this.fileService.get(this.currentRoot.parent);
      this.updateFileElementQuery();
    }
    this.currentPath = this.popFromPath(this.currentPath);
  }

  renameElement(element: FileElement) {
    this.fileService.renameElement(element.id, element.name, element.isFolder, {name: element.name}).pipe(
      tap(res => {
        // pass notice message to the login page
        console.log(res);
      }),
      catchError(err => {
        return err;
      }),
      finalize(() => {
      }),
    ).subscribe();
  }

  updateFileElementQuery() {
    this.fileElements = this.fileService.queryInFolder(this.currentRoot ? this.currentRoot.id : 'root');
  }

  pushToPath(path: string, folderName: string) {
    let p = path ? path : '';
    p += `${folderName}/`;
    return p;
  }

  popFromPath(path: string) {
    let p = path ? path : '';
    const split = p.split('/');
    split.splice(split.length - 2, 1);
    p = split.join('/');
    return p;
  }
}
