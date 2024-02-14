import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDeleteCustomerComponent } from './edit-delete-customer.component';

describe('EditDeleteCustomerComponent', () => {
  let component: EditDeleteCustomerComponent;
  let fixture: ComponentFixture<EditDeleteCustomerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditDeleteCustomerComponent]
    });
    fixture = TestBed.createComponent(EditDeleteCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
