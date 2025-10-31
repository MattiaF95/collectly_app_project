// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
  styles: [],
})
export class AppComponent implements OnInit {
  title = 'collectly';

  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    // Chiama il metodo di inizializzazione per ripristinare lo stato di login
    this.authService.initAuthState();
  }
}
