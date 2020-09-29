import {Injectable} from '@angular/core';
import {FileElement} from '../file-explorer/model/element';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';

export interface IFileService {
  add(fileElement: FileElement);

  delete(id: string);

  update(id: string, update: Partial<FileElement>);

  queryInFolder(folderId: string): Observable<FileElement[]>;

  get(id: string): FileElement;
}

@Injectable()
export class FileService {
  private map = new Map<string, FileElement>();
  private querySubject: BehaviorSubject<FileElement[]>;

  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {
  }

  addFolder(folderName: string, parent: string, isFolder: boolean): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/saveFolder`, {folderName: folderName, parent: parent, isFolder: isFolder});
  }

  addFile(file: File, parent: string, isFolder: boolean): Observable<any> {
    const formData: FormData = new FormData();

    formData.append('file', file);
    formData.append('parent', '' + parent);
    formData.append('isFolder', '' + isFolder);

    return this.http.post<any>(`${this.baseUrl}/uploadFile`, formData);

  }

  renameElement(id: string, newName: string, isFolder: boolean, update: Partial<FileElement>) {
    let element = this.map.get(id);
    element = Object.assign(element, update);
    this.map.set(element.id, element);

    return this.http.put<any>(`${this.baseUrl}/renameElement`, {id: id, newName: newName, isFolder: isFolder});
  }

  deleteElement(id: string, isFolder: boolean) {
    this.map.delete(id);
    return this.http.put<any>(`${this.baseUrl}/deleteElement`, {id: id, isFolder: isFolder});
  }

  moveToAnotherElement(id: string, moveToNewElementId: string, isFolder: boolean, update: Partial<FileElement>) {
    let element = this.map.get(id);
    element = Object.assign(element, update);
    this.map.set(element.id, element);
    return this.http.put<any>(`${this.baseUrl}/moveToAnotherElement`, {id: id, moveToNewElementId : moveToNewElementId, isFolder: isFolder});
  }

  getFiles(): Observable<FileElement[]> {
    return this.http.get<FileElement[]>(`${this.baseUrl}/files`);
  }

  getFolders(): Observable<FileElement[]> {
    return this.http.get<FileElement[]>(`${this.baseUrl}/folders`);
  }

  add(fileElement: FileElement) {
    this.map.set(fileElement.id, this.clone(fileElement));
    return fileElement;
  }

  queryInFolder(folderId: string) {
    const result: FileElement[] = [];
    this.map.forEach(element => {
      if (element.parent === folderId) {
        result.push(this.clone(element));
      }
    });
    if (!this.querySubject) {
      this.querySubject = new BehaviorSubject(result);
    } else {
      this.querySubject.next(result);
    }
    return this.querySubject.asObservable();
  }

  get(id: string) {
    return this.map.get(id);
  }

  clone(element: FileElement) {
    return JSON.parse(JSON.stringify(element));
  }
}
