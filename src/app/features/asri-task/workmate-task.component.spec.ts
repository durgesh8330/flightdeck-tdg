import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkmateTaskComponent } from './workmate-task.component';

describe('WorkmateTaskComponent', () => {
  let component: WorkmateTaskComponent;
  let fixture: ComponentFixture<WorkmateTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkmateTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkmateTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
