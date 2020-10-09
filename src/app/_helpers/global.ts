import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GlobalApp {

    constructor() {}
    
    public localStorageItem(id: string, soonId: string): string {
        let ls = localStorage.getItem(id);
        if (soonId) {
            ls = ls[soonId];
        }
        return ls;
    }
}

@Injectable({ providedIn: 'root' })
export class StorageService {
    
    private storageSub= new Subject<String>();
    
  
    watchStorage(): Observable<any> {
      return this.storageSub.asObservable();
    }
  
    setItem(key: any, data: any) {
      localStorage.setItem(key, data);      
      this.storageSub.next('changed');
    }
  
    removeItem(key) {
      localStorage.removeItem(key);
      this.storageSub.next('changed');
    }
  }