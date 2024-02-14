import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDeleteStockComponent } from './edit-delete-stock.component';

describe('EditDeleteStockComponent', () => {
  let component: EditDeleteStockComponent;
  let fixture: ComponentFixture<EditDeleteStockComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditDeleteStockComponent]
    });
    fixture = TestBed.createComponent(EditDeleteStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
