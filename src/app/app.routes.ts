import { Routes } from '@angular/router';
import { LoginComponent } from './shared/components/pages/login/login.component';
import { HomeComponent } from './shared/components/pages/home/home.component';
import { CadastroDocenteComponent } from './shared/components/pages/cadastro-docente/cadastro-docente.component';
import { logadoGuard } from './guard/logado.guard';
import { admGuard } from './guard/adm.guard';

export const routes: Routes = [
    {
        path: "",
        pathMatch: "full",
        redirectTo: "home"
    },
    {
        path: "login",
        component: LoginComponent
    },
    {
        path: "home",
        component: HomeComponent,
        canActivate: [logadoGuard]
    },
    {
        path: "cadastro-docente",
        component: CadastroDocenteComponent,
        canActivate: [logadoGuard, admGuard]
    },
    {
        path: '**',
        redirectTo: 'home'
    }
];
