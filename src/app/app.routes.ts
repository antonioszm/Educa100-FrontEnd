import { Routes } from '@angular/router';
import { LoginComponent } from './shared/components/pages/login/login.component';
import { HomeComponent } from './shared/components/pages/home/home.component';

export const routes: Routes = [
    {
        path: "login",
        component: LoginComponent
    },
    {
        path: "home",
        component: HomeComponent
    }
];
