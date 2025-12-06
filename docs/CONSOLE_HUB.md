# Console Hub Integration Guide

## Overview

The Console Hub provides a unified, role-based access point to all administration and observability consoles within the AI Front SPA. This integration maintains a consistent user experience while providing secure access to multiple backend tools.

## Architecture

### Design Principles

1. **Single Responsibility**: Each console feature is self-contained with its own components, state management, and error handling
2. **Consistent Pattern**: All consoles follow the same architectural pattern for maintainability
3. **Role-Based Access Control (RBAC)**: Access to each console is controlled via Keycloak roles
4. **Error Resilience**: Console unavailability doesn't crash the application
5. **Shell Preservation**: Header, navigation, and footer remain consistent across all views

### Integrated Consoles

| Console | Route | Purpose | Roles Required |
|---------|-------|---------|----------------|
| **Grafana** | `/grafana` | Dashboards and visualizations | `ROLE_DEVOPS`, `ROLE_SECOPS`, `ROLE_OBS_VIEWER` |
| **Loki** | `/logs` | Log aggregation and querying | `ROLE_DEVOPS`, `ROLE_SECOPS`, `ROLE_OBS_VIEWER` |
| **Tempo** | `/traces` | Distributed tracing | `ROLE_DEVOPS`, `ROLE_SECOPS`, `ROLE_OBS_VIEWER` |
| **Prometheus** | `/metrics` | Metrics and alerting | `ROLE_DEVOPS`, `ROLE_SECOPS`, `ROLE_OBS_VIEWER` |
| **pgAdmin** | `/pgadmin` | Database administration | `ROLE_DBA`, `ROLE_DB_ADMIN` |
| **Keycloak Admin** | `/keycloak` | IAM administration | `ROLE_IAM_ADMIN` |

## Implementation Details

### Feature Structure

Each console follows this standard structure:

```
src/features/<console-name>/
├── components/
│   ├── <console>-iframe.vue      # Iframe wrapper with loading states
│   ├── <console>-iframe.spec.ts
│   ├── <console>-error.vue       # Error display with retry
│   └── <console>-error.spec.ts
├── composables/
│   ├── use-<console>.ts          # State management composable
│   └── use-<console>.spec.ts
├── types/
│   ├── index.ts                  # TypeScript interfaces and enums
│   └── index.spec.ts
├── views/
│   ├── <console>-view.vue        # Main view component
│   └── <console>-view.spec.ts
└── index.ts                      # Barrel export
```

### State Management

Each console uses a dedicated composable that manages:

- **Loading States**: `IDLE`, `LOADING`, `LOADED`, `ERROR`
- **Error Handling**: Type-safe error objects with user messages and technical details
- **Retry Logic**: Automatic retry count tracking
- **URL Configuration**: Environment-specific URL management

Example composable usage:

```typescript
import { usePgAdmin } from '@/features/pgadmin/composables/use-pgadmin';

const { 
  state, 
  isLoading, 
  hasError, 
  setLoading, 
  setLoaded, 
  setError,
  incrementRetryCount 
} = usePgAdmin();
```

### Routing Configuration

Routes are defined in [`src/core/router/index.ts`](/Users/nicolaslallier/Dev Nick/AI_Front/src/core/router/index.ts):

```typescript
{
  path: 'pgadmin',
  name: 'pgadmin',
  component: () => import('@/features/pgadmin/views/pgadmin-view.vue'),
  meta: {
    title: 'pgAdmin',
    requiresAuth: true,
    requiredRoles: ['ROLE_DBA', 'ROLE_DB_ADMIN'],
    roleMatchMode: 'any',
  },
}
```

**Route Meta Properties:**
- `title`: Page title (appended to " | AI Front")
- `requiresAuth`: Always `true` for console routes
- `requiredRoles`: Array of Keycloak roles (user needs ANY of these roles)
- `roleMatchMode`: `'any'` (user needs at least one role) or `'all'` (user needs all roles)

### Navigation Menu

Navigation items are configured in [`src/features/layout/components/app-shell.vue`](/Users/nicolaslallier/Dev Nick/AI_Front/src/features/layout/components/app-shell.vue):

```typescript
{
  id: 'pgadmin',
  label: 'pgAdmin',
  path: '/pgadmin',
  visible: true,
  requiredRoles: ['ROLE_DBA', 'ROLE_DB_ADMIN'],
}
```

The `app-navigation.vue` component automatically filters menu items based on user roles.

### Error Handling

All consoles implement comprehensive error handling:

1. **Network Errors**: Failed to reach the console backend
2. **Timeout Errors**: Request exceeded timeout threshold
3. **Iframe Errors**: Failed to load iframe content (CORS, CSP issues)
4. **Unknown Errors**: Catchall for unexpected errors

Error displays include:
- User-friendly error message
- Technical details (collapsible)
- Retry button with count tracking
- Maintains shell layout (no white screen)

## Configuration

### Environment Variables

Add the following to your `.env` file:

```bash
# Console URLs
VITE_GRAFANA_URL=http://localhost/grafana/
VITE_PGADMIN_URL=http://localhost/pgadmin/
VITE_KEYCLOAK_ADMIN_URL=http://localhost/keycloak/
VITE_LOKI_URL=http://localhost/loki/
VITE_TEMPO_URL=http://localhost/tempo/
VITE_PROMETHEUS_URL=http://localhost/prometheus/
```

Configuration is centralized in [`src/core/config/index.ts`](/Users/nicolaslallier/Dev Nick/AI_Front/src/core/config/index.ts).

### Keycloak Roles

Ensure the following roles are configured in Keycloak:

**Observability Roles:**
- `ROLE_DEVOPS` - Full access to observability tools
- `ROLE_SECOPS` - Security operations access
- `ROLE_OBS_VIEWER` - Read-only observability access

**Administration Roles:**
- `ROLE_DBA` - Database administrator
- `ROLE_DB_ADMIN` - Database admin (alternative role name)
- `ROLE_IAM_ADMIN` - Identity and access management administrator

**Role Assignment:**
Users can be assigned multiple roles. Menu items and routes use `roleMatchMode: 'any'`, meaning users need at least ONE of the specified roles to access a console.

## Security Considerations

### Iframe Sandboxing

All consoles use strict iframe sandbox attributes:

```html
<iframe
  sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
/>
```

### CSP and X-Frame-Options

Ensure your NGINX reverse proxy configuration allows iframe embedding:

```nginx
# In NGINX config for each console
add_header X-Frame-Options "SAMEORIGIN";
add_header Content-Security-Policy "frame-ancestors 'self'";
```

### SSO Integration

- Authentication is handled via Keycloak SSO
- Frontend checks user authentication status before loading consoles
- NGINX proxy validates tokens for backend console access
- Unified logout invalidates access to all consoles

## Testing

### Unit Tests

Each console has comprehensive unit tests:

```bash
# Run all tests
npm run test

# Run tests for specific console
npm run test -- pgadmin

# Run tests in watch mode
npm run test:watch
```

### E2E Tests

Console hub E2E tests are in [`tests/e2e/console-hub.spec.ts`](/Users/nicolaslallier/Dev Nick/AI_Front/tests/e2e/console-hub.spec.ts):

```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests in UI mode
npm run test:e2e:ui
```

**Test Coverage:**
- Navigation between consoles
- Role-based menu filtering
- Loading states
- Error handling and retry
- Browser back/forward navigation
- Active navigation highlighting

## Troubleshooting

### Console Not Loading

**Symptoms:** Blank iframe or error message

**Possible Causes:**
1. Console backend service not running
2. Incorrect URL configuration
3. CORS or CSP blocking iframe
4. Network connectivity issues

**Solutions:**
```bash
# Check console URL configuration
cat .env | grep VITE_

# Verify backend service is running
curl http://localhost/pgadmin/

# Check browser console for CSP/CORS errors
# (F12 -> Console tab)

# Test direct access to console URL
# Open http://localhost/pgadmin/ in a new tab
```

### Menu Items Not Visible

**Symptoms:** Console links don't appear in navigation menu

**Possible Causes:**
1. User lacks required Keycloak roles
2. Role names mismatch between frontend and Keycloak
3. Navigation configuration error

**Solutions:**
```bash
# Check user's Keycloak roles
# (View JWT token payload in browser DevTools -> Application -> Storage)

# Verify role names in app-shell.vue match Keycloak
# src/features/layout/components/app-shell.vue

# Check browser console for role guard warnings
```

### Route Access Denied

**Symptoms:** Redirect to `/unauthorized` when accessing console route

**Possible Causes:**
1. User not authenticated
2. User lacks required roles
3. Role guard misconfiguration

**Solutions:**
- Verify authentication status
- Check Keycloak role assignments
- Review route meta configuration in `router/index.ts`
- Check browser console for role guard logs

### Iframe CORS Errors

**Symptoms:** Console error: "Blocked by CORS policy"

**Solution:**
This is typically an NGINX configuration issue:

```nginx
# Add to NGINX location block for console
add_header X-Frame-Options "SAMEORIGIN";
add_header Content-Security-Policy "frame-ancestors 'self' http://localhost:*";
```

### Console Logs for Debugging

Enable debug logging:

```typescript
// In browser console
localStorage.setItem('debug', 'app:*');

// Reload page to see detailed logs
```

## Adding a New Console

To add a new console to the hub:

1. **Create Feature Structure**

```bash
cd src/features
# Copy an existing console as template
cp -r pgadmin my-new-console
```

2. **Update Files**

Replace all instances of the template console name with your new console name:
- Component names (PgAdmin → MyNewConsole)
- File names (pgadmin-*.vue → my-new-console-*.vue)
- Route paths (/pgadmin → /my-new-console)
- Configuration keys (pgAdminUrl → myNewConsoleUrl)

3. **Add Configuration**

Update [`src/core/config/index.ts`](/Users/nicolaslallier/Dev Nick/AI_Front/src/core/config/index.ts):

```typescript
export interface AppConfig {
  // ... existing configs
  myNewConsoleUrl: string;
}

export const config: AppConfig = {
  // ... existing configs
  myNewConsoleUrl: import.meta.env.VITE_MY_NEW_CONSOLE_URL || 'http://localhost/my-console/',
};
```

4. **Add Route**

Update [`src/core/router/index.ts`](/Users/nicolaslallier/Dev Nick/AI_Front/src/core/router/index.ts):

```typescript
{
  path: 'my-new-console',
  name: 'my-new-console',
  component: () => import('@/features/my-new-console/views/my-new-console-view.vue'),
  meta: {
    title: 'My New Console',
    requiresAuth: true,
    requiredRoles: ['ROLE_NEW_CONSOLE_USER'],
    roleMatchMode: 'any',
  },
}
```

5. **Add Navigation Item**

Update [`src/features/layout/components/app-shell.vue`](/Users/nicolaslallier/Dev Nick/AI_Front/src/features/layout/components/app-shell.vue):

```typescript
{
  id: 'my-new-console',
  label: 'My New Console',
  path: '/my-new-console',
  visible: true,
  requiredRoles: ['ROLE_NEW_CONSOLE_USER'],
}
```

6. **Add Environment Variable**

Update `.env.example` and `.env`:

```bash
VITE_MY_NEW_CONSOLE_URL=http://localhost/my-console/
```

7. **Run Tests**

```bash
npm run test -- my-new-console
npm run test:e2e
```

## Performance Considerations

### Lazy Loading

All console routes use lazy loading via dynamic imports:

```typescript
component: () => import('@/features/pgadmin/views/pgadmin-view.vue')
```

This ensures:
- Faster initial page load
- Smaller main bundle size
- Console code loaded only when accessed

### Bundle Analysis

Analyze bundle sizes:

```bash
npm run build -- --mode analyze
```

Each console feature creates a separate chunk, ensuring isolation and optimal loading.

## Best Practices

1. **Consistent Naming**: Follow established naming conventions (kebab-case for files, PascalCase for components)
2. **Comprehensive Tests**: Maintain >90% test coverage for all console features
3. **Error Handling**: Always provide user-friendly error messages with technical details
4. **Accessibility**: Include ARIA labels, roles, and semantic HTML
5. **Documentation**: Keep JSDoc comments up-to-date
6. **Type Safety**: Use strict TypeScript typing, avoid `any`
7. **State Management**: Keep composables focused and single-purpose
8. **Security**: Never expose tokens or secrets in console URLs

## Support

For issues or questions:
- Check the troubleshooting section above
- Review browser console for error details
- Check Keycloak role assignments
- Verify NGINX proxy configuration
- Consult the specification document: `Analysis/Analysis-00006.html`

## References

- [Specification Document](/Users/nicolaslallier/Dev Nick/AI/Analysis/Analysis-00006.html)
- [Architecture Documentation](/Users/nicolaslallier/Dev Nick/AI_Front/docs/ARCHITECTURE.md)
- [Authentication Guide](/Users/nicolaslallier/Dev Nick/AI_Front/docs/AUTHENTICATION.md)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Keycloak Documentation](https://www.keycloak.org/documentation)

