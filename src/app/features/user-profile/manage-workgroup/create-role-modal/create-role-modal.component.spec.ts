import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRoleModalComponent } from './create-role-modal.component';

describe('CreateRoleModalComponent', () => {
  let component: CreateRoleModalComponent;
  let fixture: ComponentFixture<CreateRoleModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateRoleModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRoleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
