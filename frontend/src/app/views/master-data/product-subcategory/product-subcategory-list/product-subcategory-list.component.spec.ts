import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSubcategoryListComponent } from './product-subcategory-list.component';

describe('ProductSubcategoryListComponent', () => {
  let component: ProductSubcategoryListComponent;
  let fixture: ComponentFixture<ProductSubcategoryListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductSubcategoryListComponent]
    });
    fixture = TestBed.createComponent(ProductSubcategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
