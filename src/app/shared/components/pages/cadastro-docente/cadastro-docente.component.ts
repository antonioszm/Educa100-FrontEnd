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

@Component({
  selector: 'app-cadastro-docente',
  standalone: true,
  imports: [MultiSelectModule, CommonModule, DropdownModule, CalendarModule, ReactiveFormsModule, ToastModule, MessagesModule, ToolbarComponent],
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

  constructor(private fb: FormBuilder, private http: HttpClient, private messageService: MessageService, private router: Router, private userService: UserService) {}

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
}
