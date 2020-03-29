import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleInputCreateComponent } from './rule-input-create.component';

describe('RuleInputCreateComponent', () => {
  let component: RuleInputCreateComponent;
  let fixture: ComponentFixture<RuleInputCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RuleInputCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleInputCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
