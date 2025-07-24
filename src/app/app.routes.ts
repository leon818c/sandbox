import { Routes } from '@angular/router';
import { HomepageComponent } from './pages/member/homepage/homepage.component';
import { AdminLandingPageComponent } from './pages/admin/admin-landing-page/admin-landing-page.component';
import { AddServerComponent } from './shared/add-server/add-server.component';
import { LeaderboardComponent } from './pages/member/general-leaderboard/leaderboard/leaderboard.component';
import { ScheduleComponent } from './pages/member/schedule/schedule.component';
import { InformationComponent } from './pages/member/information/information.component';
import { ServerComponent } from './pages/admin/server/server.component';
import { LeaderboardComponent as LeaderboardManagementComponent } from './pages/admin/leaderboard/leaderboard.component';
import { SingleLeaderboardComponent } from './pages/member/general-leaderboard/single-leaderboard/single-leaderboard.component';
import { GroupLeaderboardComponent } from './pages/member/general-leaderboard/group-leaderboard/group-leaderboard.component';
import { GroupComponent } from './pages/admin/group/group.component';
import { EuchMinComponent } from './pages/member/euch-min/euch-min.component';
import { CalendarComponent } from './pages/admin/calendar/calendar.component';
import { EventsComponent } from './pages/member/events/events.component';

export const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'admin', component: AdminLandingPageComponent },
  { path: 'leaderboard', component:LeaderboardComponent},
  { path: 'single-leaderboard', component: SingleLeaderboardComponent },
  { path: 'group-leaderboard', component: GroupLeaderboardComponent },
  { path: 'schedule', component: ScheduleComponent },
  { path: 'information', component: InformationComponent },
  { path: 'admin/add-server', component: AddServerComponent },
  { path: 'admin/servers', component: ServerComponent },
  { path: 'admin/leaderboard', component: LeaderboardManagementComponent },
  { path: 'admin/groups', component: GroupComponent },
  { path: 'euch-min', component: EuchMinComponent },
  { path: 'admin/calendar', component: CalendarComponent },
  { path: 'events', component: EventsComponent}
];
