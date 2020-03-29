import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamasLayoutComponent } from './paramas-layout.component';

describe('ParamasLayoutComponent', () => {
  let component: ParamasLayoutComponent;
  let fixture: ComponentFixture<ParamasLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParamasLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParamasLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
