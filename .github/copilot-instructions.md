# Collectly - AI Coding Assistant Instructions

You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.
- Do not write arrow functions in templates (they are not supported).
- Do not write Regular expressions in templates (they are not supported).

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

## Project Overview

Collectly is a full-stack application for managing collections and collectibles with barcode scanning capabilities. It consists of:

- Angular frontend (`src/`)
- Express.js backend (`backend/`)
- Mobile integration via Capacitor (`android/`, `capacitor.config.ts`)

## Architecture & Core Patterns

### Frontend (Angular 18.x)

- Feature-based organization in `src/app/features/`
- Core services and models in `src/app/core/`
- Shared components in `src/app/shared/`
- Layout components in `src/app/layouts/`
- Angular Material for UI components
- State management via services with RxJS BehaviorSubjects (see `auth.service.ts`)

### Backend (Express.js)

- RESTful API structure in `backend/src/`
- MVC pattern: routes → controllers → models
- MongoDB with Mongoose for data persistence
- JWT-based authentication
- File uploads handled via Multer (images stored in `backend/uploads/`)

## Key Integration Points

### Authentication Flow

1. Frontend auth service (`src/app/core/services/auth.service.ts`) manages tokens
2. Backend auth middleware (`backend/src/middleware/auth.middleware.js`) validates tokens
3. Protected routes require auth interceptor (`src/app/core/interceptors/auth.interceptor.ts`)

### API Communication

- Environment-based API configuration (`src/environments/`)
- All API calls use environment.apiUrl
- Standard response format: `{ message: string, data?: any }`

### File Upload Pattern

1. Frontend: `form-image-upload` component
2. Backend: Multer config in `backend/src/config/multer.config.js`
3. Image processing via Sharp for optimization

## Development Workflow

### Setup

```bash
# Install dependencies for both frontend and backend
npm install
cd backend && npm install

# Start development servers
npm start          # Frontend on http://localhost:4200
cd backend && npm run dev  # Backend on http://localhost:3000
```

### Mobile Development

- Android platform setup required for barcode scanning
- Uses Capacitor MLKit for barcode functionality
- Test mobile features: `npx cap run android`

### Testing

- Unit tests with Karma: `npm test`
- Backend uses manual testing (no test framework yet)

## Common Tasks & Examples

### Adding New Features

1. Generate component: `ng generate component features/your-feature`
2. Add route in `app.routes.ts`
3. Create corresponding backend endpoint if needed

### Working with Collections

- See `collection.model.ts` and `collectible.model.ts` for data structures
- Follow CRUD patterns in `collection.controller.js` for new endpoints
- Use validation middleware for request validation

## Project-Specific Conventions

### Code Style

- Use TypeScript strict mode
- Angular services are singleton and provided in 'root'
- Backend uses ES modules (type: "module")
- Prefer async/await over promise chains

### Error Handling

- Frontend: Global error interceptor
- Backend: Error middleware in `error.middleware.js`
- Always use typed error responses

### State Management

- Use service-based state with RxJS
- Avoid component state for shared data
- See `auth.service.ts` for pattern example
