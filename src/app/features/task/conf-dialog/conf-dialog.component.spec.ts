import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfDialogComponent } from './conf-dialog.component';

describe('ConfDialogComponent', () => {
  let component: ConfDialogComponent;
  let fixture: ComponentFixture<ConfDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
