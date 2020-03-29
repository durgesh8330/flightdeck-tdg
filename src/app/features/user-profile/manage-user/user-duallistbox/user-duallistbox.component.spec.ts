import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDuallistboxComponent } from './user-duallistbox.component';

describe('UserDuallistboxComponent', () => {
  let component: UserDuallistboxComponent;
  let fixture: ComponentFixture<UserDuallistboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDuallistboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDuallistboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
