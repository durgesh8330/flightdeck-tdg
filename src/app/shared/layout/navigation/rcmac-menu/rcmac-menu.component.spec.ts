import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RcmacMenuComponent } from './rcmac-menu.component';

describe('RcmacMenuComponent', () => {
  let component: RcmacMenuComponent;
  let fixture: ComponentFixture<RcmacMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RcmacMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RcmacMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
