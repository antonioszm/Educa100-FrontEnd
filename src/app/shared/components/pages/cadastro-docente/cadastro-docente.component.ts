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
import { ActivatedRoute } from '@angular/router'; 
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressBarModule } from 'primeng/progressbar';


@Component({
  selector: 'app-cadastro-docente',
  standalone: true,
  imports: [MultiSelectModule, CommonModule, DropdownModule, CalendarModule, ReactiveFormsModule, ToastModule, MessagesModule, ToolbarComponent, ConfirmDialogModule, ProgressBarModule],
  templateUrl: './cadastro-docente.component.html',
  styleUrl: './cadastro-docente.component.scss'
})
export class CadastroDocenteComponent implements OnInit{
  docenteForm!: FormGroup;
  generos = [{ label: 'Masculino', value: 'M' }, { label: 'Feminino', value: 'F' }, { label: 'Outro', value: 'O' }, { label: 'Prefiro não informar', value: 'N' }];
  estadosCivis = [{ label: 'Solteiro', value: 'Solteiro' }, { label: 'Casado', value: 'Casado' }, { label: 'Divorciado', value: 'Divorciado' }, { label: 'Viúvo', value: 'Viúvo' } ];
  materiasDisponiveis = [
    { label: 'Java', value: 'Java' },
    { label: 'Angular', value: 'Angular' },
    { label: 'SQL', value: 'SQL' }
  ];
  docenteId!: number;
  isDeletavel!: boolean;
  isEditavel!: boolean;
  isSalvavel!: boolean;
  carregando!: boolean;




  constructor(private fb: FormBuilder, private http: HttpClient, private messageService: MessageService, private router: Router, private userService: UserService, private route: ActivatedRoute, private confirmationService: ConfirmationService) {}

  ngOnInit(): void {
    this.http.get('http://localhost:3000/users').subscribe({
      next: (data) => console.log('Conexão com a API bem-sucedida', data),
      error: (error) => console.error('Erro ao conectar com a API', error)
    });

    this.docenteForm = this.fb.group({
      nomeCompleto: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(64)]],
      genero: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
      rg: ['', [Validators.required, Validators.maxLength(20), Validators.pattern(/^\d{1,2}\.\d{3}\.\d{3}-\d{1}-[A-Z]{2,}$/)]],
      estadoCivil: ['', Validators.required],
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
      materias: [[], Validators.required]
    });

    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if (id && !isNaN(+id)) {
        this.docenteId = +id;
        this.carregarDocente(this.docenteId);
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
  
  carregarDocente(id: number): void {
    this.userService.listarUsuarioPorId(id).subscribe(docente => {
      const dataNascimento = docente.dataNascimento ? new Date(docente.dataNascimento) : null;

      this.docenteForm.patchValue({
        nomeCompleto: docente.nomeCompleto,
        genero: docente.genero,
        dataNascimento: dataNascimento,
        cpf: docente.cpf,
        rg: docente.rg,
        estadoCivil: docente.estadoCivil,
        telefone: docente.telefone,
        email: docente.email,
        senha: docente.senha,
        naturalidade: docente.naturalidade,
        cep: docente.cep,
        cidade: docente.cidade,
        estado: docente.estado,
        logradouro: docente.logradouro,
        numero: docente.numero,
        complemento: docente.complemento,
        bairro: docente.bairro,
        pontoDeReferencia: docente.pontoDeReferencia,
        materias: docente.materias.split(', ')
      });
    });
  }


  buscarEndereco(): void {
    const cep = this.docenteForm.get('cep')?.value;
    if (cep && cep.replace(/[^0-9]/g, '').length === 8) { 
      this.http.get(`https://viacep.com.br/ws/${cep}/json/`).subscribe((data: any) => {
        if (!data.erro) {
          this.docenteForm.patchValue({
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
    console.log('Formulário enviado:', this.docenteForm.value);
  
    if (this.docenteForm.valid) {
      const docente = {
        ...this.docenteForm.value,
        papel: 'DOCENTE',
        materias: this.docenteForm.value.materias.join(', '),
        id : this.gerarId()
      };
      
      console.log('Dados enviados para API:', docente);
  
      this.userService.criarUsuario(docente).subscribe({
        next: () => {
          console.log('Usuário criado com sucesso');
          this.showSuccess();
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Docente cadastrado com sucesso' });
          this.carregando = true
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 3000); 
        },
        error: (error) => {
          console.error('Erro ao cadastrar docente:', error);
          this.showError();
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao cadastrar docente' });
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
      detail: 'Docente com sucesso!', 
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

  atualizarDocente(): void {
    console.log('Formulário enviado para update:', this.docenteForm.value);
  
    if (this.docenteForm.valid) {
      const docente = {
        ...this.docenteForm.value,
        papel: 'DOCENTE',
        materias: this.docenteForm.value.materias.join(', '),
        id : this.docenteId,
      };
      
      console.log('Dados enviados para API {update}:', docente);
  
      this.userService.atualizarUsuario(docente).subscribe({
        next: () => {
          console.log('Usuário atualizado com sucesso');
          this.showSuccess();
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Docente atualizado com sucesso' });
          this.carregando = true
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 3000); 
        },
        error: (error) => {
          console.error('Erro ao atualizar docente:', error);
          this.showError();
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar docente' });
        }
      });
    } else {
      console.error('Formulário inválido');
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Formulário inválido' });
    }
  }

  deletarDocente(): void {
    this.userService.verificarDependencias(this.docenteId, 'DOCENTE').subscribe({
      next: (temDependencias) => {
        if (temDependencias) {
          console.log('Dependências verificadas:', temDependencias);
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não é possível deletar este docente, pois ele possui turmas ou avaliações vinculadas.' });
        } else {
          console.log("Nao tem dependencias")
          this.userService.removerUsuario(this.docenteId).subscribe({
            next: () => {
              this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Docente removido com sucesso' });
              this.carregando = true
              setTimeout(() => {
                this.router.navigate(['/home']);
              }, 3000);
            },
            error: (error) => {
              this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao remover docente.' });
            }
          });
        }
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao verificar dependências do docente.' });
      }
    });
  }
  confirmDeletarDocente(): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja deletar este docente? Esta ação não pode ser desfeita.',
      accept: () => {
        this.deletarDocente();
      }
    });
  }
}
