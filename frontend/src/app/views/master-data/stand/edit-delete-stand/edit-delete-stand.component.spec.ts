import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDeleteStandComponent } from './edit-delete-stand.component';

describe('EditDeleteStandComponent', () => {
  let component: EditDeleteStandComponent;
  let fixture: ComponentFixture<EditDeleteStandComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditDeleteStandComponent]
    });
    fixture = TestBed.createComponent(EditDeleteStandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
