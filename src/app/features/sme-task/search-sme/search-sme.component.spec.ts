import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSmeComponent } from './search-sme.component';

describe('SearchSmeComponent', () => {
  let component: SearchSmeComponent;
  let fixture: ComponentFixture<SearchSmeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchSmeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchSmeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
