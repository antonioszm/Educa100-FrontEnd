import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { TurmaService } from '../../../services/turma.service';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { SplitterModule } from 'primeng/splitter';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PanelModule,CardModule, SplitterModule],
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
}
