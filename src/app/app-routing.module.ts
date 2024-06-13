import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { RegistrationComponent } from './registration/registration.component';
import { ViewComponent } from './view/view.component';
import { LandingComponent } from './landing/landing.component';
import { NotifyComponent } from './notify/notify.component';
import { authGuard } from './auth.guard';

const routes: Routes = [
  {path:"",component:SignupComponent,pathMatch: 'full'},
  {path:'login',component:LoginComponent,pathMatch: 'full'},
  {
    path: '',
    component: HomeComponent,
    canActivate: [authGuard],
    children: [
      { path: 'landing', component: LandingComponent },
      { path: 'register', component: RegistrationComponent },
      { path: 'view', component: ViewComponent },
      { path: 'notify', component: NotifyComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
