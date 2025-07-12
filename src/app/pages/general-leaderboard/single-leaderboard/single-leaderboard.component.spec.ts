import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleLeaderboardComponent } from './single-leaderboard.component';

describe('SingleLeaderboardComponent', () => {
  let component: SingleLeaderboardComponent;
  let fixture: ComponentFixture<SingleLeaderboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleLeaderboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleLeaderboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
