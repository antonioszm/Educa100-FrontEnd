import { Component } from '@angular/core';
import { Button, ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-menu-lateral',
  standalone: true,
  imports: [SidebarModule, ButtonModule, CommonModule],
  templateUrl: './menu-lateral.component.html',
  styleUrl: './menu-lateral.component.scss'
})
export class MenuLateralComponent {
  usuarioAluno: boolean = false;
  usuarioDocente: boolean = false;
  usuarioADM: boolean = false;

  constructor(private authService: AuthService){}

  ngOnInit(): void {
    this.checarPerfilUsuario();
  }
  sidebarVisible: boolean = false;
  deslogar(){
    this.authService.logout()
  }
  tornaVisivel(){
    this.sidebarVisible = true
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
}
