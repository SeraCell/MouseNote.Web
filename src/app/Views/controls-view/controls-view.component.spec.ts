import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlsViewComponent } from './controls-view.component';

describe('ControlsViewComponent', () => {
  let component: ControlsViewComponent;
  let fixture: ComponentFixture<ControlsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlsViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
