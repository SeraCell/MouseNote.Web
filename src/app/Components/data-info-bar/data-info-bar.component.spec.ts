import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataInfoBarComponent } from './data-info-bar.component';

describe('DataInfoBarComponent', () => {
  let component: DataInfoBarComponent;
  let fixture: ComponentFixture<DataInfoBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataInfoBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataInfoBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
