import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UniSprComponent } from './uni-spr.component';

describe('UniSprComponent', () => {
  let component: UniSprComponent;
  let fixture: ComponentFixture<UniSprComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UniSprComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UniSprComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
