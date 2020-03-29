import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SprtaskdialogComponent } from './sprtaskdialog.component';

describe('SprtaskdialogComponent', () => {
  let component: SprtaskdialogComponent;
  let fixture: ComponentFixture<SprtaskdialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SprtaskdialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SprtaskdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
