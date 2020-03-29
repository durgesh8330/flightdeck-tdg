import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageWorkgroupNotificationComponent } from './manage-workgroup-notification.component';

describe('ManageWorkgroupNotificationComponent', () => {
  let component: ManageWorkgroupNotificationComponent;
  let fixture: ComponentFixture<ManageWorkgroupNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageWorkgroupNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageWorkgroupNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
