import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule, MatTabNav } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatTabsModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTabsModule,
  ],
  templateUrl: './main.layout.component.html',
  styleUrl: './main.layout.component.scss',
})
export class MainLayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  @ViewChild('tabPanel') tabPanel!: MatTabNav;

  pageTitle = 'Home';
  showBackButton = false;

  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updatePageTitle();
        this.updateBackButton();
      }
    });
  }

  updatePageTitle() {
    const url = this.router.url;
    if (url.includes('collections')) this.pageTitle = 'Collezioni';
    else if (url.includes('favorites')) this.pageTitle = 'Preferiti';
    else if (url.includes('statistics')) this.pageTitle = 'Statistiche';
    else if (url.includes('settings')) this.pageTitle = 'Impostazioni';
    else this.pageTitle = 'Home';
  }

  updateBackButton() {
    const url = this.router.url;
    this.showBackButton = ![
      '/',
      '/home',
      '/collections',
      '/favorites',
      '/statistics',
    ].includes(url);
  }

  goBack() {
    this.location.back();
  }

  logout() {
    this.authService.logout();
  }
}
