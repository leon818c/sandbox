import { Routes } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { AdminComponent } from './pages/admin/admin.component';
import { AddServerComponent } from './pages/add-server/add-server.component';
import { LeaderboardComponent } from './pages/leaderboard/leaderboard.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { InformationComponent } from './pages/information/information.component';
import { ServerComponent } from './pages/management/server/server.component';
import { LeaderboardComponent as LeaderboardManagementComponent } from './pages/management/leaderboard/leaderboard.component';

export const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'leaderboard', component:LeaderboardComponent},
  { path: 'schedule', component: ScheduleComponent },
  { path: 'information', component: InformationComponent },
  { path: 'admin/add-server', component: AddServerComponent },
  { path: 'admin/servers', component: ServerComponent },
  { path: 'admin/leaderboard', component: LeaderboardManagementComponent }
];
