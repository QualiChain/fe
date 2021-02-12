import { AppPage } from './app.po';
import { browser, logging, protractor, by, element, ExpectedConditions } from 'protractor';
import { PublicPage } from './public/public.po';
import { LoginPage } from './login/login.po';

describe('workspace-project App', () => {
  let page: AppPage;
  let publicPage: PublicPage;
  let loginPage: LoginPage;
  const EC = protractor.ExpectedConditions;

  const wrongCredentias = {
    username: 'wrongname',
    password: 'wrongpasswd'
  };

  beforeEach(() => {
    page = new AppPage();
    publicPage = new PublicPage();
    loginPage = new LoginPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    //expect(page.getTitleText()).toEqual('Welcome to QualiChain');
    expect(page.getH1Text()).toEqual('Welcome to QualiChain');
  });

  it('when user browses to our app he should see the default “public” screen', () => {
    publicPage.navigateTo();
    expect(publicPage.getH1Text()).toEqual('Welcome to QualiChain');
  });

  it('when user trying to login with wrong credentials he should stay on “login” page and see error notification', () => {
    loginPage.navigateTo();
    loginPage.fillCredentials(wrongCredentias);
    loginPage.clickSignIn();
    //expect(loginPage.getH1Text()).toEqual('Welcome to QualiChain');
    expect(loginPage.getErrorMessage()).toContain('Invalid credentials');
  });

  it('when user trying to login with valid credentials he should be redireted yo the main page', () => {
    loginPage.navigateTo();
    loginPage.fillCredentials();
    loginPage.clickSignIn();   
    
    browser.sleep(7500).then(
      function(){
         browser.waitForAngularEnabled(false);
         expect(loginPage.getH1Text()).toEqual('Home');
      }
    )
  });

  
  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
