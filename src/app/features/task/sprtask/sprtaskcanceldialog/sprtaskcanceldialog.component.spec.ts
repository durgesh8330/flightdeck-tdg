import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SprtaskcanceldialogComponent } from './sprtaskcanceldialog.component';

describe('SprtaskcanceldialogComponent', () => {
  let component: SprtaskcanceldialogComponent;
  let fixture: ComponentFixture<SprtaskcanceldialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SprtaskcanceldialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SprtaskcanceldialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
