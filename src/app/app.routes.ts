import { Routes } from '@angular/router';
import { LoginComponent } from './shared/components/pages/login/login.component';
import { HomeComponent } from './shared/components/pages/home/home.component';
import { CadastroDocenteComponent } from './shared/components/pages/cadastro-docente/cadastro-docente.component';
import { logadoGuard } from './guard/logado.guard';
import { admGuard } from './guard/adm.guard';
import { CadastroAlunoComponent } from './shared/components/pages/cadastro-aluno/cadastro-aluno.component';
import { CadastroTurmaComponent } from './shared/components/pages/cadastro-turma/cadastro-turma.component';
import { admOuDocenteGuard } from './guard/adm-ou-docente.guard';
import { CadastroNotaComponent } from './shared/components/pages/cadastro-nota/cadastro-nota.component';
import { ListagemDocentesComponent } from './shared/components/pages/listagem-docentes/listagem-docentes.component';
import { NotasAlunoComponent } from './shared/components/pages/notas-aluno/notas-aluno.component';
import { alunoGuard } from './guard/aluno.guard';

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
        path: "cadastro-docente/:id",
        component: CadastroDocenteComponent,
        canActivate: [logadoGuard, admGuard]
    },
    {
        path: "cadastro-aluno",
        component: CadastroAlunoComponent,
        canActivate: [logadoGuard, admGuard]
    },
    {
        path: "cadastro-turma",
        component: CadastroTurmaComponent,
        canActivate: [logadoGuard, admOuDocenteGuard]
    },
    {
        path: "cadastro-nota",
        component: CadastroNotaComponent,
        canActivate: [logadoGuard, admOuDocenteGuard]
    },
    {
        path: "listagem-docentes",
        component: ListagemDocentesComponent,
        canActivate: [logadoGuard, admGuard]
    },
    {
        path: "notas-aluno",
        component: NotasAlunoComponent,
        canActivate: [logadoGuard, alunoGuard]
    },
    {
        path: '**',
        redirectTo: 'home'
    }
];
