import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Preferences } from '@capacitor/preferences';
import { User } from '../models/user.model';

const AUTH_TOKEN_KEY = 'auth-token';
const AUTH_USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private authToken: string | null = null;

  constructor(private readonly http: HttpClient) {}

  // Chiamalo dall'AppComponent all'avvio
  async initAuthState(): Promise<void> {
    const { value: token } = await Preferences.get({ key: AUTH_TOKEN_KEY });
    const { value: userStr } = await Preferences.get({ key: AUTH_USER_KEY });

    if (token && userStr) {
      console.log('Token e utente trovati, ripristino sessione...');
      this.authToken = token;
      const user = JSON.parse(userStr);
      this.currentUserSubject.next(user);
    }
  }

  // Al login, salva token e utente
  login(credentials: { email: string; password: string }): Observable<User> {
    return this.http
      .post<{ token: string; user: User }>('/api/auth/login', credentials)
      .pipe(
        tap(async ({ token, user }) => {
          this.authToken = token;
          this.currentUserSubject.next(user);

          // Salva in modo persistente
          await Preferences.set({ key: AUTH_TOKEN_KEY, value: token });
          await Preferences.set({
            key: AUTH_USER_KEY,
            value: JSON.stringify(user),
          });
        }),
        map((response) => response.user)
      );
  }

  // Al logout, pulisci tutto
  async logout(): Promise<void> {
    this.authToken = null;
    this.currentUserSubject.next(null);

    // Rimuovi dallo storage persistente
    await Preferences.remove({ key: AUTH_TOKEN_KEY });
    await Preferences.remove({ key: AUTH_USER_KEY });
  }

  // Metodi di utilità
  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  getToken(): string | null {
    return this.authToken;
  }

  register(userData: User): Observable<User> {
    // Usa il tuo modello User
    return this.http
      .post<{ token: string; user: User }>('/api/auth/register', userData)
      .pipe(
        tap(async ({ token, user }) => {
          // Dopo la registrazione, effettua automaticamente il login
          this.authToken = token;
          this.currentUserSubject.next(user);

          // Salva in modo persistente
          await Preferences.set({ key: AUTH_TOKEN_KEY, value: token });
          await Preferences.set({
            key: AUTH_USER_KEY,
            value: JSON.stringify(user),
          });
        }),
        map((response) => response.user)
      );
  }
}
