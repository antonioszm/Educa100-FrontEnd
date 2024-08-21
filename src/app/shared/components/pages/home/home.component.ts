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





@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PanelModule,CardModule, SplitterModule, CommonModule, CardModule, FormsModule, InputTextModule, ToolbarComponent,ButtonModule],
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
    nomeUsuario: string | null = '';

    constructor(private userService: UserService, private turmaService: TurmaService, private authService: AuthService, private router: Router){}


    ngOnInit(): void {
      this.checarPerfilUsuario();
      this.verificarAlunos();
      this.verificarDocentes();
      this.verificarTurmas();
      this.carregarDadosDoAluno();
      this.obterNomeUsuario();
    }

    obterNomeUsuario(): void {
      const usuarioLogado = localStorage.getItem('usuariologado');
      if (usuarioLogado) {
          const user = JSON.parse(usuarioLogado);
          this.nomeUsuario = user.nomeCompleto;
      }
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
    verificarAlunos(): number {
      this.userService.listarAlunos().subscribe(alunos => {
        this.listaDeAlunos = alunos;
      });
      this.numeroDeAlunos = this.listaDeAlunos.length
      return this.numeroDeAlunos
    }

    verificarDocentes(): number {
      this.userService.listarDocentes().subscribe(docentes => {
        this.listaDeDocentes = docentes;
      });
      this.numeroDeDocentes = this.listaDeDocentes.length
      return this.numeroDeDocentes  
    }

    verificarTurmas(): number {
      this.turmaService.listarTurmas().subscribe(turmas => {
        this.listaDeTurmas = turmas;
      });
      this.numeroDeTurmas = this.listaDeTurmas.length
      return this.numeroDeTurmas  
    }

    filtrarAlunos(): any[] {
      if (!this.filtroAluno) {
        return this.listaDeAlunos;
      }

      const filtroLower = this.filtroAluno.toLowerCase();

      return this.listaDeAlunos.filter(aluno =>
        aluno.nomeCompleto.toLowerCase().includes(filtroLower) ||
        aluno.telefone?.includes(filtroLower) ||
        aluno.email?.toLowerCase().includes(filtroLower)
      );
    }

    calcularIdade(dataDeNascimento: Date): number {
      const nascimento = new Date(dataDeNascimento);
      const diferenca = Date.now() - nascimento.getTime();
      const idade = new Date(diferenca).getUTCFullYear() - 1970;
      return idade;
    }

  //funcoes Aluno
    carregarDadosDoAluno(): void {
      const usuarioLogado = localStorage.getItem('usuariologado');
      if (usuarioLogado) {
          const user = JSON.parse(usuarioLogado);
          this.userService.listarAvaliacoesDoAluno(user.id).subscribe(avaliacoes => {
              this.listaDeAvaliacoes = avaliacoes.slice(0, 3);
          });
      }
  } 

  redirecionarParaNota(avaliacao: Notas): void {
    this.router.navigate(['/notas-aluno'], { queryParams: { id: avaliacao.id } });
  }
  redirecionarCadastro(id: number): void {
    this.router.navigate(['/cadastro-aluno'], { queryParams: { id: id } });
  }
  redirecionarParaLancarNota(): void {
    //implementar
  }
}
