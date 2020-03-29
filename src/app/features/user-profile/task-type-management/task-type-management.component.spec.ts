import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskTypeManagementComponent } from './task-type-management.component';

describe('TaskTypeManagementComponent', () => {
  let component: TaskTypeManagementComponent;
  let fixture: ComponentFixture<TaskTypeManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskTypeManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskTypeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
