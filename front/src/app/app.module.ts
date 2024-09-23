import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { UserComponent } from './pages/user/user.component';
import { EventComponent } from './pages/event/event.component';
import { HighlightDirective } from './shared/directives/highlight.directive';
import { LoginStatusDirective } from './shared/directives/login-status.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegisterComponent } from './pages/register/register.component';
import { MaterialModule } from './modules/material/material.module'

import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { HttpClientModule } from '@angular/common/http';
import { UserListComponent } from './pages/user/user-list/user-list.component';
import { ConfirmDialogComponent } from './pages/dialogs/confirm-dialog/confirm-dialog.component';
import { UserProfileComponent } from './pages/user/user-profile/user-profile.component';
import { EventListOrgComponent } from './pages/event/event-list-org/event-list-org.component';
import { NewEventDialogComponent } from './pages/dialogs/new-event-dialog/new-event-dialog.component';
import { EventListUserComponent } from './pages/event/event-list-user/event-list-user.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { RoleDirective } from './shared/directives/role.directive';
import { NewUserDialogComponent } from './pages/dialogs/new-user-dialog/new-user-dialog.component';
import { EditEventDialogComponent } from './pages/dialogs/edit-event-dialog/edit-event-dialog.component';
import { EditProfileDialogComponent } from './pages/dialogs/edit-profile-dialog/edit-profile-dialog.component';
import { EventDetailsDialogComponent } from './pages/dialogs/event-details-dialog/event-details-dialog.component';
import { ChangePasswordComponent } from './pages/dialogs/change-password/change-password.component';
import { ApigoogleComponent } from './pages/apigoogle/apigoogle.component';



@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    LoginComponent,
    HomeComponent,
    UserComponent,
    EventComponent,
    HighlightDirective,
    LoginStatusDirective,
    RegisterComponent,
    UserListComponent,
    ConfirmDialogComponent,
    UserProfileComponent,
    EventListOrgComponent,
    NewEventDialogComponent,
    EventListUserComponent,
    NotificationsComponent,
    RoleDirective,
    NewUserDialogComponent,
    EditEventDialogComponent,
    EditProfileDialogComponent,
    EventDetailsDialogComponent,
    ChangePasswordComponent,
    ApigoogleComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    SocialLoginModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              environment.googleClientId
            )
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
