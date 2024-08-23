import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
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
import { ActivatedRoute } from '@angular/router'; 
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-cadastro-aluno',
  standalone: true,
  imports: [MultiSelectModule, CommonModule, DropdownModule, CalendarModule, ReactiveFormsModule, ToastModule, MessagesModule, ToolbarComponent, ConfirmDialogModule],
  templateUrl: './cadastro-aluno.component.html',
  styleUrl: './cadastro-aluno.component.scss'
})
export class CadastroAlunoComponent implements OnInit{
  alunoForm!: FormGroup;
  generos = [{ label: 'Masculino', value: 'M' }, { label: 'Feminino', value: 'F' }, { label: 'Outro', value: 'O' }, { label: 'Prefiro não informar', value: 'N' }];
  turmasDisponiveis: any[] = [];
  alunoId!: number;
  isDeletavel!: boolean;
  isEditavel!: boolean;
  isSalvavel!: boolean;
  constructor(private fb: FormBuilder, private http: HttpClient, private messageService: MessageService, private router: Router, private userService: UserService, private turmaService: TurmaService, private route: ActivatedRoute, private confirmationService: ConfirmationService) {}

  ngOnInit(): void {
    this.http.get('http://localhost:3000/users').subscribe({
      next: (data) => console.log('Conexão com a API bem-sucedida', data),
      error: (error) => console.error('Erro ao conectar com a API', error)
    });

    this.turmaService.listarTurmas().subscribe({
      next: (turmas) => {
        this.turmasDisponiveis = turmas;
      },
      error: (error) => {
        console.error('Erro ao carregar as turmas', error);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar as turmas.' });
      }
    });

    this.alunoForm = this.fb.group({
      nomeCompleto: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(64)]],
      genero: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
      rg: ['', [Validators.required, Validators.maxLength(20), Validators.pattern(/^\d{1,2}\.\d{3}\.\d{3}-\d{1}-[A-Z]{2,}$/)]],
      telefone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\) \d{1} \d{4}-\d{4}$/)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(8)]],
      naturalidade: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(64)]],
      cep: ['', [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/)]],
      cidade: ['', Validators.required],
      estado: ['', Validators.required],
      logradouro: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: [''],
      bairro: ['', Validators.required],
      pontoDeReferencia: [''],
      turmas: [[]]
    });

    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if (id && !isNaN(+id)) {
        this.alunoId = +id;
        this.carregarAluno(this.alunoId);
        this.isEditavel = true;
        this.isDeletavel = true;
        this.isSalvavel = false;
      }else {
        this.isEditavel = false;
        this.isDeletavel = false;
        this.isSalvavel = true
      }
    });
  }
  carregarAluno(id: number): void {
    this.userService.listarUsuarioPorId(id).subscribe(aluno => {
      const dataNascimento = aluno.dataNascimento ? new Date(aluno.dataNascimento) : null;

      this.alunoForm.patchValue({
        nomeCompleto: aluno.nomeCompleto,
        genero: aluno.genero,
        dataNascimento: dataNascimento,
        cpf: aluno.cpf,
        rg: aluno.rg,
        telefone: aluno.telefone,
        email: aluno.email,
        senha: aluno.senha,
        naturalidade: aluno.naturalidade,
        cep: aluno.cep,
        cidade: aluno.cidade,
        estado: aluno.estado,
        logradouro: aluno.logradouro,
        numero: aluno.numero,
        complemento: aluno.complemento,
        bairro: aluno.bairro,
        pontoDeReferencia: aluno.pontoDeReferencia,
        turmas: aluno.turmas
      });
  
      this.atualizarValidacaoTurmas()
    });
  }


  buscarEndereco(): void {
    const cep = this.alunoForm.get('cep')?.value;
    if (cep && cep.replace(/[^0-9]/g, '').length === 8) { 
      this.http.get(`https://viacep.com.br/ws/${cep}/json/`).subscribe((data: any) => {
        if (!data.erro) {
          this.alunoForm.patchValue({
            cidade: data.localidade,
            estado: data.uf,
            logradouro: data.logradouro,
            bairro: data.bairro
          });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'CEP não encontrado' });
        }
      });
    }
  }
  onSubmit(): void {
    console.log('Formulário enviado:', this.alunoForm.value);
  
    if (this.alunoForm.valid) {
      const aluno = {
        ...this.alunoForm.value,
        papel: 'ALUNO',
        id : this.gerarId()
      };
      
      console.log('Dados enviados para API:', aluno);
  
      this.userService.criarUsuario(aluno).subscribe({
        next: () => {
          console.log('Usuário criado com sucesso');
          this.showSuccess();
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Aluno cadastrado com sucesso' });
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 3000); 
        },
        error: (error) => {
          console.error('Erro ao cadastrar aluno:', error);
          this.showError();
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao cadastrar aluno' });
        }
      });
    } else {
      console.error('Formulário inválido');
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Formulário inválido' });
    }
  }
  gerarId(): number {
    return Math.floor(Math.random() * 10000);
  }
  showSuccess() {
    this.messageService.add({ 
      key: 'success', 
      severity: 'success', 
      summary: 'Sucesso', 
      detail: 'aluno com sucesso!', 
      life: 3000
    });
  }

  showError() {
    this.messageService.add({ 
      key: 'success', 
      severity: 'error', 
      summary: 'Erro', 
      detail: 'Formulário inválido',
      life: 3000 
    });
  }
  atualizarAluno(): void {
    console.log('Formulário enviado para update:', this.alunoForm.value);
  
    if (this.alunoForm.valid) {
      const aluno = {
        ...this.alunoForm.value,
        papel: 'ALUNO',
        id: this.alunoId,
        endereco: {
          cep: this.alunoForm.value.cep,
          cidade: this.alunoForm.value.cidade,
          estado: this.alunoForm.value.estado,
          logradouro: this.alunoForm.value.logradouro,
          numero: this.alunoForm.value.numero,
          complemento: this.alunoForm.value.complemento,
          bairro: this.alunoForm.value.bairro,
          pontoDeReferencia: this.alunoForm.value.pontoDeReferencia
        }
      };
  
      console.log('Dados enviados para API {update}:', aluno);
  
      this.userService.atualizarUsuario(aluno).subscribe({
        next: () => {
          console.log('Aluno atualizado com sucesso');
          this.showSuccess();
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Aluno atualizado com sucesso' });
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 3000);
        },
        error: (error) => {
          console.error('Erro ao atualizar aluno:', error);
          this.showError();
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar aluno' });
        }
      });
    } else {
      console.error('Formulário inválido');
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Formulário inválido' });
    }
  }
  deletarAluno(): void {
    this.userService.verificarDependencias(this.alunoId, 'ALUNO').subscribe({
      next: (temDependencias) => {
        if (temDependencias) {
          console.log('Dependências verificadas:', temDependencias);
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não é possível deletar este aluno, pois ele possui turmas ou avaliações vinculadas.' });
        } else {
          console.log("Não tem dependências");
          this.userService.removerUsuario(this.alunoId).subscribe({
            next: () => {
              this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Aluno removido com sucesso' });
              this.router.navigate(['/home']);
            },
            error: (error) => {
              this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao remover aluno.' });
            }
          });
        }
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao verificar dependências do aluno.' });
      }
    });
  }
  
  confirmDeletarAluno(): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja deletar este aluno? Esta ação não pode ser desfeita.',
      accept: () => {
        this.deletarAluno();
      }
    });
  }  
  atualizarValidacaoTurmas(): void {
    if (this.isEditavel) {
      this.alunoForm.get('turmas')?.clearValidators();
    } else {
      this.alunoForm.get('turmas')?.setValidators(Validators.required);
    }
    this.alunoForm.get('turmas')?.updateValueAndValidity();
  } 
}