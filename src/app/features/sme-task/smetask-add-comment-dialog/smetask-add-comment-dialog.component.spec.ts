import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmetaskAddCommentDialogComponent } from './smetask-add-comment-dialog.component';

describe('SmetaskAddCommentDialogComponent', () => {
  let component: SmetaskAddCommentDialogComponent;
  let fixture: ComponentFixture<SmetaskAddCommentDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmetaskAddCommentDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmetaskAddCommentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
