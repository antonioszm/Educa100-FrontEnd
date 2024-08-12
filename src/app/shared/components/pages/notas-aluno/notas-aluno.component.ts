import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { Notas } from '../../../models/notas.model';
import { User } from '../../../models/user.model';
import { ToolbarComponent } from '../../toolbar/toolbar.component';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-notas-aluno',
  standalone: true,
  imports: [ToolbarComponent, TableModule, CommonModule],
  templateUrl: './notas-aluno.component.html',
  styleUrl: './notas-aluno.component.scss'
})
export class NotasAlunoComponent implements OnInit{
  notas: Notas[] = [];
  alunoLogado!: User;

  constructor(private authService: AuthService,private userService: UserService,private router: Router) {}

  ngOnInit(): void {
    this.alunoLogado = this.authService.getUsuarioLogado() as User;

    if (!this.alunoLogado || this.alunoLogado.papel !== 'ALUNO') {
      this.router.navigate(['/home']);
      return;
    }

    this.carregarNotasAluno();
  }

  carregarNotasAluno(): void {
    this.userService.listarAvaliacoesDoAluno(this.alunoLogado.id).subscribe({
      next: (notas) => {
        this.notas = notas.sort((a, b) => new Date(b.dataAvaliacao).getTime() - new Date(a.dataAvaliacao).getTime());
      },
      error: (err) => {
        console.error('Erro ao carregar as notas do aluno:', err);
      }
    });
  }
}
