import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { EventComponent } from './pages/event/event.component';
import { UserComponent } from './pages/user/user.component';
import { unauthGuard } from './shared/guards/unauth.guard';
import { authGuard } from './shared/guards/auth.guard';
import { roleGuard } from './shared/guards/role.guard';
import { UserProfileComponent } from './pages/user/user-profile/user-profile.component';
import { EventListOrgComponent } from './pages/event/event-list-org/event-list-org.component';
import { EventListUserComponent } from './pages/event/event-list-user/event-list-user.component';
import { ApigoogleComponent } from './pages/apigoogle/apigoogle.component';


const routes: Routes = [
  { path: '', component: LoginComponent, canActivate: [unauthGuard]  },
  { path: 'home', component: HomeComponent, canActivate: [authGuard]},
  { path: 'register', component: RegisterComponent, canActivate: [unauthGuard] },
  { path: 'events', component: EventComponent, canActivate: [authGuard]},
  { path: 'user', component: UserComponent, canActivate: [authGuard, roleGuard], data: {role:'ADMIN'}},
  { path: 'events/org', component: EventListOrgComponent, canActivate: [authGuard, roleGuard], data: { role: 'ORG'}},
  { path: 'events/user', component: EventListUserComponent, canActivate: [authGuard, roleGuard], data: { role: 'USER'}},
  { path: 'profile', component: UserProfileComponent, canActivate:[authGuard]},
  { path: 'googleApi/redirect', component: ApigoogleComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
