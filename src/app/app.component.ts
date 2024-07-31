import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ButtonModule} from 'primeng/button'
import { HttpClientModule } from '@angular/common/http';
import { SidebarModule } from 'primeng/sidebar';
import { MenuLateralComponent } from './shared/components/menu-lateral/menu-lateral.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
//import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ButtonModule, CommonModule, HttpClientModule, SidebarModule, MenuLateralComponent, AppComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Educa100-FrontEnd';
}
