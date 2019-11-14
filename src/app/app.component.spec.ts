import { AppComponent } from './app.component';
import {HttpClient} from "@angular/common/http";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {async, TestBed} from '@angular/core/testing';
import {TranslateLoader, TranslateModule, TranslateService} from "@ngx-translate/core";
import {HttpLoaderFactory} from "./app.module";

const TRANSLATIONS_EN = require('../assets/i18n/en.json');
const TRANSLATIONS_EL = require('../assets/i18n/el.json');
const TRANSLATIONS_PT = require('../assets/i18n/pt.json');

describe('AppComponent', () => {
  
  let translate: TranslateService;
  let http: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ],
      providers: [TranslateService]      
    }).compileComponents();

    translate = TestBed.get(TranslateService);
    http = TestBed.get(HttpTestingController);
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'QualiChain-FE'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('QualiChain-FE');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.content span').textContent).toContain('QualiChain-FE app is running!');
  });

  it('should load translations', async(() => {
    spyOn(translate, 'getBrowserLang').and.returnValue('en');
    const fixture = TestBed.createComponent(AppComponent);
    const compiled = fixture.debugElement.nativeElement;

    // the DOM should be empty for now since the translations haven't been rendered yet
    expect(compiled.querySelector('h2').textContent).toEqual('');

    http.expectOne('/assets/i18n/en.json').flush(TRANSLATIONS_EN);
    //http.expectNone('/assets/i18n/fr.json');
    http.expectNone('/assets/i18n/el.json');
    http.expectNone('/assets/i18n/pt.json');

    // Finally, assert that there are no outstanding requests.
    http.verify();

    fixture.detectChanges();
    // the content should be translated to english now
    expect(compiled.querySelector('h2').textContent).toEqual(TRANSLATIONS_EN.HOME.TITLE);

    //translate.use('fr');
    //http.expectOne('/assets/i18n/fr.json').flush(TRANSLATIONS_FR);
    translate.use('el');
    http.expectOne('/assets/i18n/el.json').flush(TRANSLATIONS_EL);

    translate.use('pt');
    http.expectOne('/assets/i18n/pt.json').flush(TRANSLATIONS_PT);

    // Finally, assert that there are no outstanding requests.
    http.verify();

    // the content has not changed yet
    expect(compiled.querySelector('h2').textContent).toEqual(TRANSLATIONS_EN.HOME.TITLE);

    fixture.detectChanges();
    // the content should be translated to greeek now
    expect(compiled.querySelector('h2').textContent).toEqual(TRANSLATIONS_EL.HOME.TITLE);
    
    // the content should be translated to portuguesh now
    expect(compiled.querySelector('h2').textContent).toEqual(TRANSLATIONS_PT.HOME.TITLE);
  }));

});
