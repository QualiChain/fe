import { browser, by, element } from 'protractor';

export class LoginPage {
  private credentias = {
    username: 'replaceforvalidusername',
    password: 'replaceforvalidpassword'
  };

  navigateTo() {
    return browser.get('/login');
  }

  fillCredentials(credentias: any = this.credentias) {
    element(by.css('[name="username"]')).sendKeys(credentias.username);
    element(by.css('[name="password"]')).sendKeys(credentias.password);
    //element(by.css('.btn-login')).click();
  }

  clickSignIn() {    
    element(by.css('.btn-login')).click();
  }

  getH1Text() {
    return element(by.css('h1')).getText() as Promise<string>;
  }

  getErrorMessage() {
    return element(by.css('.alert-danger')).getText();
  }

}