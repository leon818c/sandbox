import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupLeaderboardComponent } from './group-leaderboard.component';

describe('GroupLeaderboardComponent', () => {
  let component: GroupLeaderboardComponent;
  let fixture: ComponentFixture<GroupLeaderboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupLeaderboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupLeaderboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
