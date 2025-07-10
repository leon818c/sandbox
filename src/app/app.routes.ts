import { Routes } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { AdminComponent } from './pages/admin/admin.component';
import { AddServerComponent } from './pages/add-server/add-server.component';
import { LeaderboardComponent } from './pages/leaderboard/leaderboard.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';

export const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'leaderboard', component:LeaderboardComponent},
  { path: 'schedule', component: ScheduleComponent },
  { path: 'admin/add-server', component: AddServerComponent }
];
