import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleCreateEditComponent } from './rule-create-edit.component';

describe('RuleCreateEditComponent', () => {
  let component: RuleCreateEditComponent;
  let fixture: ComponentFixture<RuleCreateEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RuleCreateEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleCreateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
