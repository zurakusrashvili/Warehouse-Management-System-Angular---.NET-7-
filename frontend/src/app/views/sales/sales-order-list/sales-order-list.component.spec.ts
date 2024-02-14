import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesOrderListComponent } from './sales-order-list.component';

describe('SalesOrderListComponent', () => {
  let component: SalesOrderListComponent;
  let fixture: ComponentFixture<SalesOrderListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesOrderListComponent]
    });
    fixture = TestBed.createComponent(SalesOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
