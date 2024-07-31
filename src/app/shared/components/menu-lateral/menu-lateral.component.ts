import { Component } from '@angular/core';
import { Button, ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-menu-lateral',
  standalone: true,
  imports: [SidebarModule, ButtonModule],
  templateUrl: './menu-lateral.component.html',
  styleUrl: './menu-lateral.component.scss'
})
export class MenuLateralComponent {

  constructor(private authService: AuthService){}

  sidebarVisible: boolean = false;
  deslogar(){
    this.authService.logout()
  }
  tornaVisivel(){
    this.sidebarVisible = true
  }
}
