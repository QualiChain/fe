import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PilotHomeComponent } from './pilot-home.component';
import { HomePilot1Component, HomePilot2Component, HomePilot3Component, HomePilot4Component, HomePilot5Component } from './pilot-home.component';
import { TranslateModule } from "@ngx-translate/core";
import { HttpClientTestingModule } from '@angular/common/http/testing';


describe('PilotHomeComponent', () => {
  let component: PilotHomeComponent;
  let fixture: ComponentFixture<PilotHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PilotHomeComponent ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PilotHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

//pilot 1
describe('HomePilot1Component', () => {
  let component: HomePilot1Component;
  let fixture: ComponentFixture<HomePilot1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePilot1Component ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePilot1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

//pilot 2
describe('HomePilot2Component', () => {
  let component: HomePilot2Component;
  let fixture: ComponentFixture<HomePilot2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePilot2Component ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePilot2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

//pilot 3
describe('HomePilot3Component', () => {
  let component: HomePilot3Component;
  let fixture: ComponentFixture<HomePilot3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePilot3Component ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePilot3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

//pilot 4
describe('HomePilot4Component', () => {
  let component: HomePilot4Component;
  let fixture: ComponentFixture<HomePilot4Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePilot4Component ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePilot4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

//pilot 5
describe('HomePilot5Component', () => {
  let component: HomePilot5Component;
  let fixture: ComponentFixture<HomePilot5Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePilot5Component ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePilot5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

