import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ToolbarModule } from 'primeng/toolbar';
import { MenuLateralComponent } from '../menu-lateral/menu-lateral.component';
import { AvatarModule } from 'primeng/avatar';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [ButtonModule,ToolbarModule, SplitButtonModule, MenuLateralComponent, AvatarModule, CommonModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {
  usuarioAluno: boolean = false;
  usuarioDocente: boolean = false;
  usuarioADM: boolean = false;
  nomeUsuario: string | null = '';
  titulo: string = '';
  showLogout = false;

  constructor(private authService: AuthService){}

  ngOnInit(): void {
    this.checarPerfilUsuario();
    this.obterNomeUsuario();
  }
  checarPerfilUsuario(): void {
    if (this.authService.verificarSeForDocente()) {
        this.usuarioDocente = true;
        this.usuarioAluno = false;
        this.usuarioADM = false;

    } else if (this.authService.verificarSeForAluno()) {
        this.usuarioDocente = false;
        this.usuarioAluno = true;
        this.usuarioADM = false;

    } else if (this.authService.verificarSeForADM()) {
      this.usuarioDocente = false;
      this.usuarioAluno = false;
      this.usuarioADM = true;
    }
  }
  obterNomeUsuario(): void {
    const usuarioLogado = localStorage.getItem('usuariologado');
    if (usuarioLogado) {
        const user = JSON.parse(usuarioLogado);
        this.nomeUsuario = user.nomeCompleto;
    }
  }
  toggleLogout(): void {
    this.showLogout = !this.showLogout;
  }
  deslogar(){
    this.authService.logout()
  }

}
