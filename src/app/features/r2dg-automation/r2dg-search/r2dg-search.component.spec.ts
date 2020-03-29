import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { R2dgSearchComponent } from './r2dg-search.component';

describe('R2dgSearchComponent', () => {
  let component: R2dgSearchComponent;
  let fixture: ComponentFixture<R2dgSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ R2dgSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(R2dgSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
