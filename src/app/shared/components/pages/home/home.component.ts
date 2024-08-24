import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { TurmaService } from '../../../services/turma.service';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { SplitterModule } from 'primeng/splitter';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Notas } from '../../../models/notas.model';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarComponent } from '../../toolbar/toolbar.component';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import type { User } from '../../../models/user.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PanelModule,CardModule, SplitterModule, CommonModule, CardModule, FormsModule, InputTextModule, ToolbarComponent,ButtonModule, DividerModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
    listaDeAlunos: any[] = [];
    listaDeDocentes: any[] = [];
    listaDeTurmas: any[] = [];
    numeroDeAlunos!: number;
    numeroDeDocentes!: number;
    numeroDeTurmas!: number;
    filtroAluno: string = '';

    listaDeAvaliacoes: Notas[] = [];
    materiasCursando: string[] = [];
    cursosExtras: string[] = ['Curso de PowerBi', 'Curso de Clean Code', 'Curso de Kanban'];

    usuarioAluno: boolean = false;
    usuarioDocente: boolean = false;
    usuarioADM: boolean = false;
    usuarioLogado!: User;

    constructor(private userService: UserService, private turmaService: TurmaService, private authService: AuthService, private router: Router){}


    ngOnInit(): void {
      this.usuarioLogado = this.authService.getUsuarioLogado() as User;

      this.checarPerfilUsuario();
      this.verificarAlunos();
      this.verificarDocentes();
      this.verificarTurmas();
      this.carregarDadosDoAluno();
      this.verificarMaterias()
    }

    //funcoes de autorizacao
    checarPerfilUsuario(): void {
      if (this.authService.verificarSeForDocente()) {
          this.usuarioDocente = true;
          this.usuarioAluno = false;
          this.usuarioADM = false;

      } else if (this.authService.verificarSeForAluno()) {
          this.usuarioDocente = false;
          this.usuarioAluno = true;
          this.usuarioADM = false;

      } else if (this.authService.verificarSeForADM()) {
        this.usuarioDocente = false;
        this.usuarioAluno = false;
        this.usuarioADM = true;
    }
  }

    //funcoes Docente / ADM
    verificarAlunos(): void {
      this.userService.listarAlunos().subscribe(alunos => {
        console.log(alunos);
        this.listaDeAlunos = alunos;
        this.numeroDeAlunos = this.listaDeAlunos.length
      });
    }

    verificarDocentes(): void {
      this.userService.listarDocentes().subscribe(docentes => {
        this.listaDeDocentes = docentes;
        this.numeroDeDocentes = this.listaDeDocentes.length
      });
    }

    verificarTurmas(): void {
      this.turmaService.listarTurmas().subscribe(turmas => {
        this.listaDeTurmas = turmas;
        this.numeroDeTurmas = this.listaDeTurmas.length
      });
    }

    filtrarAlunos(): any[] {
      if (!this.filtroAluno) {
        return this.listaDeAlunos;
      }

      const filtroLower = this.filtroAluno.toLowerCase();
      return this.listaDeAlunos.filter(aluno =>
        aluno.nomeCompleto.toLowerCase().includes(filtroLower) ||
        aluno.telefone?.includes(filtroLower) ||
        aluno.email?.toLowerCase().includes(filtroLower) ||
        aluno.dataNascimento?.includes(filtroLower) 
      );
    }

    calcularIdade(dataDeNascimento: Date): number {
      const nascimento = new Date(dataDeNascimento);    
      const hoje = new Date();
      let idade = hoje.getFullYear() - nascimento.getFullYear();
      const mes = hoje.getMonth() - nascimento.getMonth();
    
      if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
      }
      return idade
    }

  //funcoes Aluno
    carregarDadosDoAluno(): void {
      const usuarioLogado = localStorage.getItem('usuariologado');
      if (usuarioLogado) {
          const user = JSON.parse(usuarioLogado);
          this.userService.listarAvaliacoesDoAluno(user.id).subscribe(avaliacoes => {
              this.listaDeAvaliacoes = avaliacoes
                  .sort((nota1, nota2) => new Date(nota2.dataAvaliacao).getTime() - new Date(nota1.dataAvaliacao).getTime())
                  .slice(0, 3);
          });
      }
  } 
  verificarMaterias(): void {
    if (this.usuarioLogado.papel === "ALUNO"){
      this.usuarioLogado.turmas.forEach(turma => {
        const listaMaterias = turma.professor.materias.split(',').map(materia => materia.trim());
        listaMaterias.forEach(materia => {
          if (!this.materiasCursando.includes(materia)) {
            this.materiasCursando.push(materia);
          }
        });
      });
    }
  } 

  redirecionarParaNota(avaliacao: Notas): void {
    this.router.navigate(['/notas-aluno'], { queryParams: { id: avaliacao.id } });
  }
  redirecionarCadastro(id: number): void {
    this.router.navigate(['/cadastro-aluno'], { queryParams: { id: id } });
  }
  redirecionarParaLancarNota(id: number): void {
    this.router.navigate(['/cadastro-nota'], { queryParams: { id: id } });
  }
}
