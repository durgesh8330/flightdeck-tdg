import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryHistoryDetailsComponent } from './query-history-details.component';

describe('QueryHistoryDetailsComponent', () => {
  let component: QueryHistoryDetailsComponent;
  let fixture: ComponentFixture<QueryHistoryDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueryHistoryDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryHistoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
