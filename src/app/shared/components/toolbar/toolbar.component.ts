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

  constructor(private authService: AuthService){}

  ngOnInit(): void {
    this.checarPerfilUsuario();
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
