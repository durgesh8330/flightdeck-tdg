/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { IpvpnMenuComponent } from './ipvpn-menu.component';

describe('IpvpnMenuComponent', () => {
  let component: IpvpnMenuComponent;
  let fixture: ComponentFixture<IpvpnMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IpvpnMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IpvpnMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
