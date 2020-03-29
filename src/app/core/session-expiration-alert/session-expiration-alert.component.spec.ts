import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionExpirationAlertComponent } from './session-expiration-alert.component';

describe('SessionExpirationAlertComponent', () => {
  let component: SessionExpirationAlertComponent;
  let fixture: ComponentFixture<SessionExpirationAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionExpirationAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionExpirationAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
