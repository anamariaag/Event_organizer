import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventListUserComponent } from './event-list-user.component';

describe('EventListUserComponent', () => {
  let component: EventListUserComponent;
  let fixture: ComponentFixture<EventListUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventListUserComponent]
    });
    fixture = TestBed.createComponent(EventListUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
