import { Injectable } from '@angular/core';

declare let _paq: any;

@Injectable({
  providedIn: 'root'
})
export class QCMatomoConnectorService {

  constructor() { }
  
  sendMatomoEvent(eventCategory: string, eventAction: string, eventName: string, eventValue: string) {
    if (eventName && eventValue) {
      _paq.push(['trackEvent', eventCategory, eventAction, eventName, eventValue]);
    }
    else if (eventName) {
      _paq.push(['trackEvent', eventCategory, eventAction, eventName]);
    }
    else{
      _paq.push(['trackEvent', eventCategory, eventAction]);
    }
    
  }

}
