import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { NotaService } from '../../../services/nota.service';  
import { User } from '../../../models/user.model';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { ToolbarComponent } from '../../toolbar/toolbar.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { CommonModule } from '@angular/common';
import { MessagesModule } from 'primeng/messages';


@Component({
  selector: 'app-cadastro-nota',
  standalone: true,
  imports: [MultiSelectModule, CommonModule, DropdownModule, CalendarModule, ReactiveFormsModule, ToastModule, MessagesModule, ToolbarComponent],
  templateUrl: './cadastro-nota.component.html',
  styleUrl: './cadastro-nota.component.scss'
})
export class CadastroNotaComponent implements OnInit  {
  notaForm!: FormGroup;
  professoresDisponiveis: User[] = [];
  alunosDisponiveis: User[] = [];
  materiasDisponiveis = [
    { label: 'Java', value: 'Java' },
    { label: 'Angular', value: 'Angular' },
    { label: 'SQL', value: 'SQL' }
  ];
  isAdm: boolean = false;
  isDocente: boolean = false;

  constructor(private fb: FormBuilder,private messageService: MessageService,private router: Router,private userService: UserService,private authService: AuthService,private notaService: NotaService) {}

  ngOnInit(): void {
    const usuarioLogado = this.authService.getUsuarioLogado();
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
      this.professoresDisponiveis = [usuarioLogado];
      this.notaForm.patchValue({ professor: usuarioLogado });
      this.notaForm.get('professor')?.disable();
    }

    this.userService.listarAlunos().subscribe({
      next: (alunos) => {
        this.alunosDisponiveis = alunos;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar alunos.' });
      }
    });
  }

  inicializarFormulario(usuarioLogado: User): void {
    this.notaForm = this.fb.group({
      professor: ['', Validators.required],
      nomeDaMateria: ['', Validators.required],
      nomeDaAvaliacao: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(64)]],
      dataAvaliacao: [new Date(), Validators.required],
      aluno: ['', Validators.required],
      nota: ['', [Validators.required, Validators.min(0), Validators.max(10)]],
    });

    if (this.isDocente) {
      this.notaForm.patchValue({ professor: usuarioLogado });
      this.notaForm.get('professor')?.disable();
    }
  }

  onSubmit(): void {
    if (this.notaForm.valid) {
      const nota = {
        ...this.notaForm.value,
        id: this.gerarId(),
      };

      this.notaService.criarNota(nota).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Avaliação cadastrada com sucesso' });
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 3000); 
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao cadastrar avaliação' });
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
