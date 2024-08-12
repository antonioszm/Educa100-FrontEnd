import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';
import { CardModule } from 'primeng/card';
import { ToolbarComponent } from '../../toolbar/toolbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';




@Component({
  selector: 'app-listagem-docentes',
  standalone: true,
  imports: [CardModule, ToolbarComponent, CommonModule, FormsModule, ButtonModule],
  templateUrl: './listagem-docentes.component.html',
  styleUrl: './listagem-docentes.component.scss'
})
export class ListagemDocentesComponent implements OnInit {
  listaDeDocentes: User[] = [];
  filtroDocente: string = '';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.verificarDocentes();
  }

 
  verificarDocentes(): void {
    this.userService.listarDocentes().subscribe(docentes => {
      this.listaDeDocentes = docentes;
    });
  }

  filtrarDocentes(): User[] {
    if (!this.filtroDocente) {
      return this.listaDeDocentes;
    }

    const filtroLower = this.filtroDocente.toLowerCase();

    return this.listaDeDocentes.filter(docente =>
      docente.nomeCompleto.toLowerCase().includes(filtroLower) ||
      docente.id.toString().toLowerCase().includes(filtroLower)
    );
  }

  abrirDetalhesDocente(docenteId: number): void {
    this.router.navigate(['/cadastro-docente'], { queryParams: { id: docenteId } });
  }

}
