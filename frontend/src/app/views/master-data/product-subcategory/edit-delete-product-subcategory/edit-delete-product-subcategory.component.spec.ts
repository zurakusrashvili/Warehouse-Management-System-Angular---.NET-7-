import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDeleteProductSubcategoryComponent } from './edit-delete-product-subcategory.component';

describe('EditDeleteProductSubcategoryComponent', () => {
  let component: EditDeleteProductSubcategoryComponent;
  let fixture: ComponentFixture<EditDeleteProductSubcategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditDeleteProductSubcategoryComponent]
    });
    fixture = TestBed.createComponent(EditDeleteProductSubcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
