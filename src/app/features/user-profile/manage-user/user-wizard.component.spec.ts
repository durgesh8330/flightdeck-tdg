import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserWizardComponent } from './user-wizard.component';

describe('UserWizardComponent', () => {
  let component: UserWizardComponent;
  let fixture: ComponentFixture<UserWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserWizardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
