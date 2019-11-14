import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
//import { filter } from 'rxjs/operators'

@Injectable({ providedIn: 'root' })
export class MessageService {
    private subject = new Subject<any>();

    
    sendMessage(message: string) {
        let max = 10000;
        let min = 1;
        let messageId = Math.floor(Math.random() * (max - min)) + min;
        this.subject.next({ text: message , id: messageId});
    }

    clearMessages() {
        this.subject.next();
    }

    deleteItemMessages(id: number): void {
        console.log(id);
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
}