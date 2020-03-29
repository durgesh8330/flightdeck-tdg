import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleImportComponent } from './rule-import.component';

describe('RuleImportComponent', () => {
  let component: RuleImportComponent;
  let fixture: ComponentFixture<RuleImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RuleImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
