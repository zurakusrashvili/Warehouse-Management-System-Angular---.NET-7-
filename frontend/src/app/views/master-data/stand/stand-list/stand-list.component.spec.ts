import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandListComponent } from './stand-list.component';

describe('StandListComponent', () => {
  let component: StandListComponent;
  let fixture: ComponentFixture<StandListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StandListComponent]
    });
    fixture = TestBed.createComponent(StandListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
