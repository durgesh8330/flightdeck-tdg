import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleInputSearchComponent } from './rule-input-search.component';

describe('RuleInputSearchComponent', () => {
  let component: RuleInputSearchComponent;
  let fixture: ComponentFixture<RuleInputSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RuleInputSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleInputSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
