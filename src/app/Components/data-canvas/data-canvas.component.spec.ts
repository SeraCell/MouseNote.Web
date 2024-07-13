import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataCanvasComponent } from './data-canvas.component';

describe('DataCanvasComponent', () => {
  let component: DataCanvasComponent;
  let fixture: ComponentFixture<DataCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataCanvasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
