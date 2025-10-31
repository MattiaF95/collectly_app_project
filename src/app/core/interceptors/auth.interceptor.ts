// src/app/core/interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Usa la funzione inject() per ottenere il servizio
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Se il token esiste, clona la richiesta e aggiungi l'header
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Passa la richiesta (modificata o meno) al prossimo handler
  return next(req);
};
