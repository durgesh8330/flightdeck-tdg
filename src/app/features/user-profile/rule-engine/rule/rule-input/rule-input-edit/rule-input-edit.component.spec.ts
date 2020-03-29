import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleInputEditComponent } from './rule-input-edit.component';

describe('RuleInputEditComponent', () => {
  let component: RuleInputEditComponent;
  let fixture: ComponentFixture<RuleInputEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RuleInputEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleInputEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
