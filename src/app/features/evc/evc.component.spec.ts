import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvcComponent } from './evc.component';

describe('EvcComponent', () => {
  let component: EvcComponent;
  let fixture: ComponentFixture<EvcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
