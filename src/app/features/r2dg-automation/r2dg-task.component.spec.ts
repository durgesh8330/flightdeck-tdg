import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { R2DGTaskComponent } from './r2dg-task.component';

describe('WorkmateTaskComponent', () => {
  let component: R2DGTaskComponent;
  let fixture: ComponentFixture<R2DGTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ R2DGTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(R2DGTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
