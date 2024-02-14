import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDeleteWarehouseComponent } from './edit-delete-warehouse.component';

describe('EditDeleteWarehouseComponent', () => {
  let component: EditDeleteWarehouseComponent;
  let fixture: ComponentFixture<EditDeleteWarehouseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditDeleteWarehouseComponent]
    });
    fixture = TestBed.createComponent(EditDeleteWarehouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
