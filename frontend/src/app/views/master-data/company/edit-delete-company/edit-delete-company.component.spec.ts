import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDeleteCompanyComponent } from './edit-delete-company.component';

describe('EditDeleteCompanyComponent', () => {
  let component: EditDeleteCompanyComponent;
  let fixture: ComponentFixture<EditDeleteCompanyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditDeleteCompanyComponent]
    });
    fixture = TestBed.createComponent(EditDeleteCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
