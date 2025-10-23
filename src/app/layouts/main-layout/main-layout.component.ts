import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './main.layout.component.html',
  styleUrl: './main.layout.component.scss',
})
export class MainLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  pageTitle = 'Home';

  constructor() {
    this.router.events.subscribe(() => {
      this.updatePageTitle();
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

  logout() {
    this.authService.logout();
  }
}
