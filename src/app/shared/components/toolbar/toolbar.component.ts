import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ToolbarModule } from 'primeng/toolbar';
import { MenuLateralComponent } from '../menu-lateral/menu-lateral.component';
import { AvatarModule } from 'primeng/avatar';


@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [ButtonModule,ToolbarModule, SplitButtonModule, MenuLateralComponent, AvatarModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {

}
