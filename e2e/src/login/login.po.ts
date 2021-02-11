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
    element(by.css('.btn-login')).click();
  }

  get title() {
    return element(by.css('.titleHome'));
  }

  getPageTitleText() {
    return element(by.css('h1')).getText();
  }

  getH1Text() {
    return element(by.css('h1')).getText() as Promise<string>;
  }

  getTitleHomeText() {
    return element(by.css('.titleHome')).getText() as Promise<string>;
    //return element(by.css('.titleHome')).getText();
  }

  getErrorMessage() {
    return element(by.css('.alert-danger')).getText();
  }

  getConfirmationMessage() {
    return element(by.css('.alert-success')).getText();
  }
}