import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SPRTaskComponent } from './sprtask.component';

describe('SPRTaskComponent', () => {
  let component: SPRTaskComponent;
  let fixture: ComponentFixture<SPRTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SPRTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SPRTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
