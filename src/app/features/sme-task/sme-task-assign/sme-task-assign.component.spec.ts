import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmeTaskAssignComponent } from './sme-task-assign.component';

describe('SmeTaskAssignComponent', () => {
  let component: SmeTaskAssignComponent;
  let fixture: ComponentFixture<SmeTaskAssignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmeTaskAssignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmeTaskAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
