import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDeleteSalesOrderComponent } from './edit-delete-sales-order.component';

describe('EditDeleteSalesOrderComponent', () => {
  let component: EditDeleteSalesOrderComponent;
  let fixture: ComponentFixture<EditDeleteSalesOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditDeleteSalesOrderComponent]
    });
    fixture = TestBed.createComponent(EditDeleteSalesOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
