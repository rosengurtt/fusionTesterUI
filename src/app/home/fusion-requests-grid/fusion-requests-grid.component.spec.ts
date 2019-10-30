import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FusionRequestsGridComponent } from './fusion-requests-grid.component';

describe('FusionRequestsGridComponent', () => {
  let component: FusionRequestsGridComponent;
  let fixture: ComponentFixture<FusionRequestsGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FusionRequestsGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FusionRequestsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
