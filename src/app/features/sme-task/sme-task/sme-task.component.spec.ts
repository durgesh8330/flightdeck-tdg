import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmeTaskComponent } from './sme-task.component';

describe('SmeTaskComponent', () => {
  let component: SmeTaskComponent;
  let fixture: ComponentFixture<SmeTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmeTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmeTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
