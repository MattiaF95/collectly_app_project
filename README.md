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

## Problema: Perdita dello Stato e Race Condition al Refresh

Nelle applicazioni a singola pagina (SPA), lo stato dell'applicazione (incluso il token di autenticazione) è conservato nella memoria JavaScript. Al refresh della pagina, questa memoria viene cancellata.

Il tentativo di ripristinare lo stato di login durante l'inizializzazione del componente principale (`AppComponent`) crea una **race condition**:

1.  La navigazione e le guardie di rotta (`AuthGuard`) vengono eseguite **immediatamente**.
2.  L'operazione asincrona di ripristino dello stato di login non è ancora terminata.
3.  La guardia di rotta non trova un utente autenticato e reindirizza alla pagina di login, anche se un token valido esiste nello storage.

## Soluzione: Blocco dell'App con `APP_INITIALIZER`

Per risolvere questa race condition, utilizziamo il token di dependency injection **`APP_INITIALIZER`** di Angular. Questo approccio garantisce che la logica di ripristino dell'autenticazione venga eseguita e completata **prima** che l'applicazione venga completamente avviata e che il routing diventi attivo.

La persistenza del token è gestita tramite il plugin **`@capacitor/preferences ^6.0.3`**, che offre un'API unificata:

- **Web**: Utilizza `localStorage`.
- **iOS**: Utilizza `UserDefaults` (storage nativo e sicuro).
- **Android**: Utilizza `SharedPreferences` (storage nativo e sicuro).

## Flusso di Inizializzazione dell'Autenticazione (Corretto)

Il flusso di ripristino della sessione è ora robusto e privo di race condition:

1.  **Avvio dell'Applicazione**: Il processo di bootstrap di Angular ha inizio.
2.  **Esecuzione di `APP_INITIALIZER`**: Prima di renderizzare qualsiasi componente, Angular esegue le funzioni fornite tramite il token `APP_INITIALIZER`. Nel nostro caso, esegue una factory che chiama `authService.initAuthState()`.
3.  **Attesa del Ripristino**: L'intera applicazione **attende** che la `Promise` restituita da `initAuthState()` venga risolta. Durante questa fase, il rendering e la navigazione sono in pausa.
4.  **Controllo dello Storage**: `AuthService` interroga il plugin `@capacitor/preferences` per leggere il token e i dati utente salvati.
5.  **Ripristino dello Stato**: Se i dati esistono, `AuthService` popola il suo stato interno (es. un `BehaviorSubject`).
6.  **Avvio Completo dell'App**: Solo dopo che la Promise è stata risolta, Angular completa il processo di bootstrap. L'applicazione viene renderizzata e il router inizia a processare la rotta iniziale.
7.  **Esecuzione delle Guardie di Rotta**: A questo punto, quando l'`AuthGuard` viene eseguito, interroga `AuthService`, che ha già uno stato di autenticazione aggiornato e corretto.

**Risultato**: L'utente rimane autenticato e sulla pagina corretta dopo un refresh, perché la logica di protezione delle rotte viene eseguita solo dopo che lo stato di login è stato completamente ripristinato, eliminando ogni race condition.
