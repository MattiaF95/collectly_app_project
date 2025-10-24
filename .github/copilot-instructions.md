# Collectly - AI Coding Assistant Instructions

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