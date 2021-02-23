import { Injectable } from '@angular/core';

declare let _paq: any;

@Injectable({
  providedIn: 'root'
})
export class QCMatomoConnectorService {

  constructor() { }
  
  sendMatomoEvent(eventCategory: string, eventAction: string, eventName: string, eventValue: string) {
    _paq.push(['trackEvent', eventCategory, eventAction, eventName, eventValue]);
  }

}
