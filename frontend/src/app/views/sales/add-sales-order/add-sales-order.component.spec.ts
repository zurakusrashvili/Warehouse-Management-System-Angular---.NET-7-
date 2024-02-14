import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSalesOrderComponent } from './add-sales-order.component';

describe('AddSalesOrderComponent', () => {
  let component: AddSalesOrderComponent;
  let fixture: ComponentFixture<AddSalesOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddSalesOrderComponent]
    });
    fixture = TestBed.createComponent(AddSalesOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
