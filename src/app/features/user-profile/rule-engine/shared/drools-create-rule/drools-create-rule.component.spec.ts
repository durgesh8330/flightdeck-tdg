import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DroolsCreateRuleComponent } from './drools-create-rule.component';

describe('DroolsCreateRuleComponent', () => {
  let component: DroolsCreateRuleComponent;
  let fixture: ComponentFixture<DroolsCreateRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DroolsCreateRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DroolsCreateRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
