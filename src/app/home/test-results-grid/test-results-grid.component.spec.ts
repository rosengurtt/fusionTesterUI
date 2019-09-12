import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestResultsGridComponent } from './test-results-grid.component';

describe('TestResultsGridComponent', () => {
  let component: TestResultsGridComponent;
  let fixture: ComponentFixture<TestResultsGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestResultsGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestResultsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
