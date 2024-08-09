import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { TurmaService } from '../../../services/turma.service';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { SplitterModule } from 'primeng/splitter';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PanelModule,CardModule, SplitterModule, CommonModule, CardModule, FormsModule],
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
    
    constructor(private userService: UserService, private turmaService: TurmaService){}


    ngOnInit(): void {
      this.verificarAlunos();
      this.verificarDocentes();
      this.verificarTurmas();
    }

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

}
