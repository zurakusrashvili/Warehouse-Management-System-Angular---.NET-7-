import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDeleteProductCategoryComponent } from './edit-delete-product-category.component';

describe('EditDeleteProductCategoryComponent', () => {
  let component: EditDeleteProductCategoryComponent;
  let fixture: ComponentFixture<EditDeleteProductCategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditDeleteProductCategoryComponent]
    });
    fixture = TestBed.createComponent(EditDeleteProductCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
