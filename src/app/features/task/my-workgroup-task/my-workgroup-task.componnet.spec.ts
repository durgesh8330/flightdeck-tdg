import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import { MyWorkgroupTaskComponent} from './my-workgroup-task.component';

describe('MyWorkgroupTaskComponent', () => {
  let component: MyWorkgroupTaskComponent;
  let fixture: ComponentFixture<MyWorkgroupTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyWorkgroupTaskComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyWorkgroupTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
