import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {WorkgroupTaskComponent} from './workgroup-task.component';

describe('WorkgroupTaskComponent', () => {
  let component: WorkgroupTaskComponent;
  let fixture: ComponentFixture<WorkgroupTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WorkgroupTaskComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkgroupTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
