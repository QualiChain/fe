import { browser, by, element } from 'protractor';

export class PublicPage {
  navigateTo() {
    return browser.get('/'); // we can navigate to '/' for get pblic page since this is the default route
  }

  
  getH1Text() {
    return element(by.css('h1')).getText() as Promise<string>;
  }

  
}