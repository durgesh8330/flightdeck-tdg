import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleInputComponent } from './rule-input.component';

describe('RuleInputComponent', () => {
  let component: RuleInputComponent;
  let fixture: ComponentFixture<RuleInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RuleInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
