import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { LandingComponent } from './pages/landing/landing.component';
import { MultiFactorComponent } from './pages/multi-factor/multi-factor.component';
import { LoadingScreenComponent } from './components/loading-screen/loading-screen.component';
import { AuthCallbackComponent } from './pages/auth-callback/auth-callback.component';
import { authGuard } from './guards/auth.guard';
import { NewAnimalComponent } from './pages/animal/new-animal/new-animal.component';
import { EditAnimalComponent } from './pages/animal/edit-animal/edit-animal.component';
import { HomeAnimalComponent } from './pages/animal/home-animal/home-animal.component';
import { MyProfileComponent } from './pages/user/my-profile/my-profile.component';
import { MySettingsComponent } from './pages/user/my-settings/my-settings.component';
import { TenantOptions } from './pages/tenant/options-tenant/options-tenant.component';
import { SubscriptionTenantComponent } from './pages/tenant/subscription-tenant/subscription-tenant.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'landing-page', component: LandingComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'tenant/setup/selection', component: TenantOptions },
  { path: 'tenant/setup/subscriptions', component: SubscriptionTenantComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password?token=:token', component: ResetPasswordComponent },
  { path: 'multifactor-auth', component: MultiFactorComponent },
  { path: 'auth/callback', component: AuthCallbackComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard], data: {'scopes': []} },
  { path: 'my-profile', component: MyProfileComponent, canActivate: [authGuard] },
  { path: 'settings', component: MySettingsComponent, canActivate: [authGuard] },
  { path: 'animal/home', component: HomeAnimalComponent, canActivate: [authGuard] },
  { path: 'animal/new', component: NewAnimalComponent, canActivate: [authGuard] },
  { path: 'animal/:id', component: EditAnimalComponent, canActivate: [authGuard] },
  { path: 'unauthorized', component: UnauthorizedComponent, canActivate: [authGuard] },
  { path: '**', component: NotFoundComponent },
];
