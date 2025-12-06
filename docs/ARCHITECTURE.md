# Architecture Documentation

## Overview

AI Front is a modern Vue 3 Single Page Application (SPA) implementing a micro front-end architecture with a persistent shell layout. The application is built with TypeScript, following strict SOLID principles, and employs Test-Driven Development practices.

## Architecture Principles

### Micro Front-End SPA Architecture

The application implements a shell-based architecture where:
- A **persistent shell** (layout) wraps all routes
- **Feature modules** are self-contained and independently deployable
- **Shared resources** are centralized for reusability
- **Core infrastructure** provides common services

### Key Architectural Decisions

1. **Feature-Based Organization**: Code is organized by feature rather than by type
2. **Composition API**: All Vue components use the Composition API for better composition and reusability
3. **TypeScript Strict Mode**: Full type safety with no implicit any types
4. **Dependency Inversion**: Components depend on abstractions (composables) rather than concrete implementations
5. **Single Responsibility**: Each module has one reason to change

## Application Structure

### Shell Layout

The shell provides consistent navigation and branding across all routes:

```
┌─────────────────────────────────────────┐
│           Header (App Title)            │
├─────────────────────────────────────────┤
│       Navigation (Home | Grafana)       │
├─────────────────────────────────────────┤
│                                         │
│         Content Area (Router View)      │
│                                         │
│         - Home View (Counter)           │
│         - Grafana View (Dashboard)      │
│                                         │
└─────────────────────────────────────────┘
```

#### Components

**AppShell** (`src/features/layout/components/app-shell.vue`)
- Main layout wrapper
- Orchestrates header, navigation, and content
- Provides navigation configuration

**AppHeader** (`src/features/layout/components/app-header.vue`)
- Application title and branding
- Consistent across all routes
- Configurable title prop

**AppNavigation** (`src/features/layout/components/app-navigation.vue`)
- Dynamic navigation menu
- Highlights active route
- Filters items based on visibility property
- Supports internal and external links

### Routing Structure

```
/ (root)
├── → /home (redirect)
└── (shell layout)
    ├── /home (counter feature)
    └── /grafana (grafana feature)
```

**Router Configuration** (`src/core/router/index.ts`)
- Nested routes under shell layout
- Lazy-loaded feature views
- Navigation guards for logging
- Automatic page title updates

### Feature Modules

#### Counter Feature (`src/features/counter/`)

Example feature demonstrating the architecture:
- Components: Counter display, controls, history
- Composable: Counter state management
- Store: Pinia store for global state
- Views: Home view as container

#### Grafana Feature (`src/features/grafana/`)

Embedded Grafana dashboard integration:

**Components:**
- `grafana-iframe.vue`: Renders Grafana in sandboxed iframe
- `grafana-error.vue`: Error display with retry mechanism

**Composable:**
- `use-grafana.ts`: State management for loading, loaded, error states

**Types:**
- `GrafanaLoadingState`: Enum for lifecycle states
- `GrafanaErrorType`: Categorized error types
- `GrafanaState`: Complete state interface

**View:**
- `grafana-view.vue`: Container orchestrating iframe and error handling

**State Management:**

```
┌──────────┐
│   IDLE   │  Initial state
└────┬─────┘
     ↓
┌──────────┐
│ LOADING  │  Iframe loading
└─────┬────┘
     ↓
  ┌──┴───┐
  ↓      ↓
┌────┐  ┌───────┐
│LOAD│  │ ERROR │
└────┘  └───┬───┘
           ↓
        [Retry] → LOADING
```

#### Layout Feature (`src/features/layout/`)

Shell components and navigation infrastructure:

**Components:**
- `app-shell.vue`: Main layout container
- `app-header.vue`: Application header
- `app-navigation.vue`: Navigation menu

**Types:**
- `NavigationItem`: Navigation link definition
- `NavigationConfig`: Navigation structure

### Core Infrastructure

#### Configuration (`src/core/config/`)

Centralized application configuration:
- Environment variable management
- Feature flags
- API endpoints
- Grafana URL configuration

```typescript
interface AppConfig {
  apiBaseUrl: string;
  environment: string;
  enableDebug: boolean;
  grafanaUrl: string;
}
```

#### Router (`src/core/router/`)

Vue Router configuration with:
- Shell-based nested routing
- Navigation guards for logging
- Lazy-loaded routes
- Meta information for pages

### Shared Resources

#### Utilities (`src/shared/utils/`)

**Logger** (`logger.ts`)
- Centralized logging
- Environment-aware (silent in production)
- Structured log format
- Used across all features

#### Types (`src/shared/types/`)

Common TypeScript types and interfaces used across features.

## Data Flow

### Component Communication

1. **Props Down**: Parent components pass data to children via props
2. **Events Up**: Child components emit events to parents
3. **Composables**: Shared state and logic through composables
4. **Router**: Navigation state through Vue Router

### State Management Patterns

1. **Local State**: Component-specific state using `ref` and `reactive`
2. **Composables**: Feature-specific reusable state (e.g., `use-grafana`)
3. **Pinia Stores**: Global application state (e.g., counter store)
4. **Router State**: URL-based state through route params and query

## Error Handling

### Error Boundaries

Each feature implements its own error boundaries:

**Grafana Feature Error Handling:**
1. **Iframe Errors**: Detected and caught in iframe component
2. **Error Display**: User-friendly error messages
3. **Recovery**: Retry mechanism allows users to recover
4. **Isolation**: Grafana errors don't affect other features

### Error Types

```typescript
enum GrafanaErrorType {
  NETWORK_ERROR = 'network_error',
  TIMEOUT_ERROR = 'timeout_error',
  IFRAME_ERROR = 'iframe_error',
  UNKNOWN_ERROR = 'unknown_error',
}
```

### Logging

All navigation and errors are logged through the centralized logger:
- Navigation events (FR-008 requirement)
- Error occurrences with context
- State transitions
- Environment-aware verbosity

## Security Considerations

### Grafana Integration

**Iframe Sandboxing:**
```html
<iframe 
  sandbox="allow-same-origin allow-scripts allow-forms 
           allow-popups allow-popups-to-escape-sandbox"
/>
```

**Content Security:**
- No sensitive data in URLs
- No secrets in client-side code
- Isolated iframe context
- Proper CORS handling

### General Security

- TypeScript strict mode prevents many runtime errors
- Environment variables for sensitive configuration
- No `any` types allowed
- Input validation on all user inputs

## Performance Considerations

### Lazy Loading

All feature views are lazy-loaded:
```typescript
component: () => import('@/features/grafana/views/grafana-view.vue')
```

### Code Splitting

- Router-based code splitting
- Feature-based bundles
- Vendor bundle separation

### Optimization

- Computed properties for derived state
- Event handler memoization
- Proper key usage in v-for
- Minimal re-renders through reactive system

## Testing Strategy

### Unit Tests

Each component, composable, and utility has comprehensive unit tests:
- Component rendering and behavior
- Composable state management
- Utility function logic
- Edge cases and error conditions

### E2E Tests

Complete user flows are tested:
- Navigation between features
- Shell persistence across routes
- Grafana integration and error handling
- Browser navigation (back/forward)
- Direct URL access

### Coverage Requirements

- Minimum 90% code coverage
- All public APIs documented
- All error paths tested
- Critical user flows covered

## Deployment Architecture

### Build Process

1. TypeScript compilation
2. Vue component compilation
3. Asset optimization
4. Bundle generation
5. Source map generation

### Docker Deployment

Multi-stage Docker build:
1. **Build stage**: Compile application
2. **Runtime stage**: Nginx serving static files

### Environment Configuration

Configuration through environment variables:
- `VITE_GRAFANA_URL`: Grafana endpoint
- `VITE_API_BASE_URL`: API endpoint
- `VITE_ENV`: Environment name

## Extension Points

### Adding New Features

1. Create feature directory in `src/features/`
2. Implement feature components, composables, types
3. Add route to router configuration
4. Add navigation item to shell
5. Write comprehensive tests
6. Update documentation

### Adding Navigation Items

Update `app-shell.vue`:
```typescript
const navigationItems = computed((): NavigationItem[] => {
  return [
    { id: 'home', label: 'Home', path: '/home', visible: true },
    { id: 'grafana', label: 'Grafana', path: '/grafana', visible: true },
    { id: 'new-feature', label: 'New Feature', path: '/new', visible: true },
  ];
});
```

### Customizing Shell

The shell components accept props for customization:
- Header title
- Navigation items
- Layout styling

## SOLID Principles in Practice

### Single Responsibility Principle (SRP)

- Each component has one clear purpose
- Composables focus on specific state management
- Utility functions perform single operations

### Open/Closed Principle (OCP)

- Navigation accepts items via props (open for extension)
- Components use composition over modification
- Plugin-based architecture where applicable

### Liskov Substitution Principle (LSP)

- All navigation items follow the same interface
- Components implementing same interface are interchangeable
- Type safety ensures contract compliance

### Interface Segregation Principle (ISP)

- Small, focused composables
- Specific component props
- Targeted event emissions

### Dependency Inversion Principle (DIP)

- Components depend on composable abstractions
- No direct service dependencies
- Props and events for component communication

## Authentication Layer

The application implements comprehensive Keycloak OIDC authentication with PKCE:

### Components

**Core Services** (`src/core/auth/`)
- `keycloak-service.ts`: Keycloak client wrapper with PKCE, token management
- `auth-store.ts`: Pinia store for global authentication state
- `use-auth.ts`: Composable providing clean auth API to components
- `auth-events.ts`: Event bus for auth state changes across micro front-ends

**Route Protection** (`src/core/auth/guards/`)
- `auth-guard.ts`: Global navigation guard requiring authentication
- `role-guard.ts`: Role-based access control for routes

**HTTP Integration** (`src/core/api/`)
- `http-client.ts`: Automatic Bearer token injection, 401/403 handling
- `api-service.ts`: Base class for type-safe API services

**UI Components** (`src/features/auth/components/`)
- `auth-login-button.vue`: Keycloak login trigger
- `auth-logout-button.vue`: SSO logout with local session clear
- `user-profile.vue`: Display user info, roles, and logout option

**Views** (`src/features/auth/views/`)
- `auth-callback-view.vue`: Handles Keycloak redirect after login
- `unauthorized-view.vue`: Displayed when user lacks required roles

### Authentication Flow

```
User → Protected Route → Auth Guard → Keycloak Login → 
Token Exchange (PKCE) → Session Storage → Route Access → 
API Calls (Bearer Token) → Silent Refresh → Logout (SSO)
```

### Key Features

- **PKCE Flow**: Secure public client authentication
- **Hybrid Storage**: In-memory + sessionStorage for security and UX
- **Silent Refresh**: Automatic token renewal before expiration
- **Role-Based UI**: Menu items and routes filtered by user roles
- **401/403 Handling**: Automatic token refresh on API errors
- **SSO Support**: Single Sign-On with Keycloak

### Security

- Minimal PII storage (Loi 25 compliance)
- No tokens in URLs or logs
- Session cleared on tab close (sessionStorage)
- Content Security Policy ready
- HTTPS required in production

See [Authentication Guide](./AUTHENTICATION.md) for detailed setup and usage.

## Future Enhancements

Potential architectural improvements:

1. **State Persistence**: Add local storage sync for Pinia stores
2. **Internationalization**: Add i18n support to shell
3. **Theme System**: Add dark mode and theme switching
4. **Error Tracking**: Integrate error monitoring service
5. **Analytics**: Add navigation and interaction tracking
6. **Progressive Web App**: Add PWA capabilities
7. **Module Federation**: Support runtime feature loading

## Conclusion

This architecture provides:
- **Scalability**: Easy to add new features
- **Maintainability**: Clear separation of concerns
- **Testability**: Comprehensive test coverage
- **Type Safety**: Full TypeScript integration
- **Performance**: Optimized loading and rendering
- **Security**: Proper isolation and sandboxing
- **User Experience**: Consistent navigation and error handling

The micro front-end SPA approach with a persistent shell provides the foundation for a professional, enterprise-grade application that can grow and evolve while maintaining code quality and user experience standards.

