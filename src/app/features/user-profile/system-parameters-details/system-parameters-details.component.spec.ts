import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemParametersDetailsComponent } from './system-parameters-details.component';

describe('SystemParametersDetailsComponent', () => {
  let component: SystemParametersDetailsComponent;
  let fixture: ComponentFixture<SystemParametersDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemParametersDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemParametersDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
