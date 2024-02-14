import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDeleteLocationComponent } from './edit-delete-location.component';

describe('EditDeleteLocationComponent', () => {
  let component: EditDeleteLocationComponent;
  let fixture: ComponentFixture<EditDeleteLocationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditDeleteLocationComponent]
    });
    fixture = TestBed.createComponent(EditDeleteLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
