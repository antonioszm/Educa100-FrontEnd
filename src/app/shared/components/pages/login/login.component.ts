import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonModule, DividerModule, InputTextModule, FloatLabelModule, PasswordModule, HttpClientModule, CommonModule, FormsModule,],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  senha: string = '';
  erro: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  verificarLogin() {
    this.authService.login(this.email, this.senha).subscribe(valido => {
      if (valido) {
        this.router.navigate(['/home']); // mudar para a home condizente com o papel
        console.log("logado")
      } else {
        this.erro = 'Email ou senha incorretos';
      }
    });
  }
}
