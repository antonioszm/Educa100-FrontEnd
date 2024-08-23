import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { MultiSelectModule } from 'primeng/multiselect';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { UserService } from '../../../services/user.service';
import { ToolbarComponent } from "../../toolbar/toolbar.component";
import { TurmaService } from '../../../services/turma.service';
import { AuthService } from '../../../services/auth.service';
import type { User } from '../../../models/user.model';
import { ProgressBarModule } from 'primeng/progressbar';


@Component({
  selector: 'app-cadastro-turma',
  standalone: true,
  imports: [MultiSelectModule, CommonModule, DropdownModule, CalendarModule, ReactiveFormsModule, ToastModule, MessagesModule, ToolbarComponent, ProgressBarModule],
  templateUrl: './cadastro-turma.component.html',
  styleUrl: './cadastro-turma.component.scss'
})
export class CadastroTurmaComponent {
  turmaForm!: FormGroup;
  professoresDisponiveis: User[] = [];
  isAdm: boolean = false;
  isDocente: boolean = false;
  usuarioLogado!: User
  professorLogado!: User
  carregando!: boolean;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private turmaService: TurmaService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const usuarioLogado = this.authService.getUsuarioLogado();
    this
    if (!usuarioLogado) {
      this.router.navigate(['/login']);
      return;
    }


    this.isAdm = this.authService.verificarSeForADM();
    this.isDocente = this.authService.verificarSeForDocente();

    this.inicializarFormulario(usuarioLogado);

    if (this.isAdm) {
      this.userService.listarDocentes().subscribe({
        next: (professores) => {
          this.professoresDisponiveis = professores;
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar professores.' });
        }
      });
    } else if (this.isDocente) {
      this.professorLogado = usuarioLogado
      this.professoresDisponiveis = [usuarioLogado];
      this.turmaForm.patchValue({ professor: usuarioLogado });
      this.turmaForm.get('professor')?.disable();
    }
  }

  inicializarFormulario(usuarioLogado: User): void {
    const dataAtual = new Date();
    const hora = dataAtual.getHours().toString().padStart(2, '0');
    const minuto = dataAtual.getMinutes().toString().padStart(2, '0');
    const horaAtual = `${hora}:${minuto}`;

    this.turmaForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(64)]],
      dataInicio: [dataAtual, Validators.required],
      dataTermino: ['', Validators.required],
      horario: [horaAtual, Validators.required],
      professor: ['', Validators.required]
    });

    if (this.isDocente) {
      this.turmaForm.patchValue({ professor: usuarioLogado });
      this.turmaForm.get('professor')?.disable();
    }
  }

  onSubmit(): void {
    console.log("Usuario Logado antes de onSubmit:", this.usuarioLogado);
    console.log(this.professorLogado)
    if (this.turmaForm.valid) {
      const turma = {
        ...this.turmaForm.value,
        id: this.gerarId(),
      };
      if (this.isDocente) {
        turma.professor = this.professorLogado; 
        console.log(this.usuarioLogado)
      }
      this.turmaService.criarTurma(turma).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Turma cadastrada com sucesso' });
          this.carregando = true
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 3000); 
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao cadastrar turma' });
        }
      });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Formulário inválido' });
    }
  }

  gerarId(): number {
    return Math.floor(Math.random() * 10000);
  }
}