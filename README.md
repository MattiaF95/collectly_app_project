# Collectly

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.17.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

# Architettura di Autenticazione

Questa sezione documenta il flusso di autenticazione dell'applicazione, con un focus sulla persistenza della sessione utente al refresh della pagina, sia per il web sia per le piattaforme mobili (iOS/Android) tramite Capacitor.

## Problema: Perdita dello Stato al Refresh della Pagina

Nelle applicazioni a singola pagina (SPA), lo stato dell'applicazione, inclusi i dati di autenticazione come il token JWT, è conservato nella memoria JavaScript. Quando l'utente ricarica la pagina, questa memoria viene cancellata, causando la perdita dello stato di login e la disconnessione forzata dell'utente.

## Soluzione: Persistenza del Token tramite Capacitor Preferences

Per garantire che la sessione utente sopravviva al refresh, il token di autenticazione e i dati utente vengono salvati in uno storage persistente. La soluzione adottata utilizza il plugin **`@capacitor/preferences ^6.0.3`**, che offre un'API unificata per la persistenza dei dati:

- **Web**: Utilizza `localStorage`.
- **iOS**: Utilizza `UserDefaults` (storage nativo e sicuro).
- **Android**: Utilizza `SharedPreferences` (storage nativo e sicuro).

## Flusso di Inizializzazione dell'Autenticazione

Il flusso di ripristino della sessione all'avvio dell'app o al refresh della pagina è il seguente:

1.  **Caricamento Iniziale**: Angular carica il componente radice dell'applicazione, `AppComponent`.
2.  **Iniezione del Servizio**: Il costruttore di `AppComponent` inietta `AuthService`, il servizio centrale per la gestione dell'autenticazione.
3.  **Esecuzione di `ngOnInit`**: Una volta che il componente è pronto, viene eseguito il suo metodo `ngOnInit`.
4.  **Inizializzazione dello Stato Auth**: `ngOnInit` chiama il metodo asincrono `authService.initAuthState()`.
5.  **Controllo dello Storage Persistente**: `AuthService` interroga il plugin `@capacitor/preferences` per verificare la presenza di un token e di dati utente precedentemente salvati.
6.  **Ripristino dello Stato**: Se un token e i dati utente vengono trovati, `AuthService` popola il suo stato interno (es. un `BehaviorSubject`) con queste informazioni.
7.  **Sessione Ripristinata**: A questo punto, l'applicazione sa che l'utente è autenticato. Di conseguenza:
    - L'`AuthInterceptor` può aggiungere correttamente il token `Authorization: Bearer ...` alle richieste HTTP in uscita.
    - L'`AuthGuard` può proteggere le rotte riservate, consentendo l'accesso.

**Risultato**: L'utente rimane autenticato e può continuare a navigare nell'applicazione senza doversi autenticare di nuovo, garantendo un'esperienza utente fluida e continua.
