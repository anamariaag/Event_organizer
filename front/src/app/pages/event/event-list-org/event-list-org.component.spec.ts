import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventListOrgComponent } from './event-list-org.component';

describe('EventListOrgComponent', () => {
  let component: EventListOrgComponent;
  let fixture: ComponentFixture<EventListOrgComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventListOrgComponent]
    });
    fixture = TestBed.createComponent(EventListOrgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
