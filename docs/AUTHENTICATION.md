# Authentication Guide

## Overview

This application uses **Keycloak** for authentication and authorization, implementing OpenID Connect (OIDC) with PKCE (Proof Key for Code Exchange) flow. This guide covers setup, configuration, usage, and troubleshooting.

## Table of Contents

- [Architecture](#architecture)
- [Keycloak Setup](#keycloak-setup)
- [Configuration](#configuration)
- [Usage](#usage)
- [Role-Based Access Control](#role-based-access-control)
- [API Integration](#api-integration)
- [Token Management](#token-management)
- [Troubleshooting](#troubleshooting)
- [Security Considerations](#security-considerations)

## Architecture

### Authentication Flow

```
1. User accesses protected route
   ↓
2. Auth guard checks authentication
   ↓
3. If not authenticated → Redirect to Keycloak
   ↓
4. User logs in to Keycloak
   ↓
5. Keycloak redirects to /auth/callback with authorization code
   ↓
6. Keycloak service exchanges code for tokens (PKCE)
   ↓
7. Tokens stored (hybrid: memory + sessionStorage)
   ↓
8. User redirected to intended route
   ↓
9. Auth guard allows access
```

### Components

- **Keycloak Service**: Core authentication logic, token management
- **Auth Store**: Global state management with Pinia
- **Auth Composable**: Interface Segregation Principle - clean API for components
- **Route Guards**: Protection for routes requiring authentication/roles
- **HTTP Client**: Automatic Bearer token injection, 401/403 handling
- **UI Components**: Login button, user profile, logout button

## Keycloak Setup

### Prerequisites

- Keycloak 20+ running and accessible
- Admin access to Keycloak

### Step 1: Create Realm

1. Log in to Keycloak Admin Console
2. Create a new realm: `infra-admin` (or your preferred name)
3. Configure realm settings as needed

### Step 2: Create Client

1. Navigate to **Clients** → **Create Client**
2. Configure client:
   - **Client ID**: `ai-front-spa`
   - **Client Protocol**: `openid-connect`
   - **Access Type**: `public` (SPA client, no secret)
   - **Valid Redirect URIs**: `http://localhost:5173/*`, `http://your-domain.com/*`
   - **Web Origins**: `http://localhost:5173`, `http://your-domain.com`
   - **Enable PKCE**: `true`
   
3. In **Advanced Settings**:
   - **Proof Key for Code Exchange Code Challenge Method**: `S256`

### Step 3: Configure Roles

1. Navigate to **Roles** → **Add Role**
2. Create application roles:
   - `ROLE_VIEWER`: Basic access
   - `ROLE_USER`: Standard user access
   - `ROLE_ADMIN`: Administrative access
   - `ROLE_DEVOPS`: DevOps operations access
   - `ROLE_DBA`: Database administration access

### Step 4: Create Test User

1. Navigate to **Users** → **Add User**
2. Create a test user with username and email
3. Set password in **Credentials** tab
4. Assign roles in **Role Mappings** tab

### Step 5: Configure Token Claims

1. Navigate to **Client Scopes** → **roles**
2. Add mapper for realm roles:
   - **Name**: `realm roles`
   - **Mapper Type**: `User Realm Role`
   - **Token Claim Name**: `realm_access.roles`
   - **Add to ID token**: `ON`
   - **Add to access token**: `ON`

## Configuration

### Environment Variables

Create `.env.local` file in project root:

```bash
# Keycloak Configuration
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=infra-admin
VITE_KEYCLOAK_CLIENT_ID=ai-front-spa
VITE_KEYCLOAK_MIN_VALIDITY=70
VITE_KEYCLOAK_DEBUG=true
VITE_KEYCLOAK_CHECK_INTERVAL=60

# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
```

### Production Environment

For production, update `.env.production`:

```bash
VITE_KEYCLOAK_URL=https://keycloak.your-domain.com
VITE_KEYCLOAK_REALM=infra-admin
VITE_KEYCLOAK_CLIENT_ID=ai-front-spa
VITE_KEYCLOAK_MIN_VALIDITY=70
VITE_KEYCLOAK_DEBUG=false
VITE_KEYCLOAK_CHECK_INTERVAL=60
```

## Usage

### In Components

Use the `useAuth` composable for authentication functionality:

```typescript
import { useAuth } from '@/core/auth';

export default defineComponent({
  setup() {
    const auth = useAuth();

    // Check authentication status
    if (auth.isAuthenticated.value) {
      console.log('User is logged in:', auth.username.value);
    }

    // Trigger login
    async function login() {
      await auth.login();
    }

    // Trigger logout
    async function logout() {
      await auth.logout();
    }

    // Check roles
    const canViewAdmin = auth.hasRole('ROLE_ADMIN');
    const canEditOrView = auth.hasAnyRole(['ROLE_ADMIN', 'ROLE_USER']);

    return {
      auth,
      login,
      logout,
    };
  },
});
```

### Conditional Rendering

```vue
<template>
  <div>
    <!-- Show for authenticated users only -->
    <div v-if="auth.isAuthenticated.value">
      Welcome, {{ auth.username.value }}!
    </div>

    <!-- Show for users with admin role -->
    <button v-if="auth.hasRole('ROLE_ADMIN')" @click="deleteItem">
      Delete
    </button>

    <!-- Show for unauthenticated users -->
    <auth-login-button v-if="!auth.isAuthenticated.value" />
  </div>
</template>
```

## Role-Based Access Control

### Protecting Routes

Add `meta` fields to route definitions:

```typescript
{
  path: '/admin',
  component: AdminView,
  meta: {
    title: 'Administration',
    requiresAuth: true,
    requiredRoles: ['ROLE_ADMIN'],
    roleMatchMode: 'any', // 'any' (default) or 'all'
  },
}
```

### Route Meta Fields

- **requiresAuth**: `boolean` - Requires authentication (default: `true` for all routes)
- **requiredRoles**: `string[]` - Roles required to access route
- **roleMatchMode**: `'any' | 'all'` - How to match multiple roles

### Navigation Filtering

Navigation items are automatically filtered by roles:

```typescript
const navigationItems = [
  {
    id: 'home',
    label: 'Home',
    path: '/home',
    visible: true,
    // No role requirement - visible to all authenticated users
  },
  {
    id: 'admin',
    label: 'Admin',
    path: '/admin',
    visible: true,
    requiredRoles: ['ROLE_ADMIN'], // Only visible to admins
  },
];
```

## API Integration

### Making Authenticated Requests

The `httpClient` automatically injects Bearer tokens:

```typescript
import { httpClient } from '@/core/api';

// GET request
const data = await httpClient.get<User[]>('/users');

// POST request
const newUser = await httpClient.post<User>('/users', {
  name: 'John Doe',
  email: 'john@example.com',
});

// Skip auth for public endpoints
const publicData = await httpClient.get('/public/info', {
  skipAuth: true,
});
```

### Creating API Services

Extend the `ApiService` base class:

```typescript
import { ApiService } from '@/core/api';

class UserService extends ApiService {
  constructor() {
    super('/users');
  }

  async getUser(id: string): Promise<User> {
    return this.get<User>(`/${id}`);
  }

  async createUser(data: CreateUserDto): Promise<User> {
    return this.post<User>('/', data);
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    return this.put<User>(`/${id}`, data);
  }
}

export const userService = new UserService();
```

## Token Management

### Storage Strategy

The application uses a **hybrid storage strategy**:

- **Primary**: In-memory storage (most secure)
- **Backup**: sessionStorage (persists on page reload)
- **Cleared**: On tab/browser close

### Token Refresh

Tokens are automatically refreshed:

- **Threshold**: 70 seconds before expiration (configurable)
- **Check Interval**: Every 60 seconds (configurable)
- **Method**: Silent refresh using refresh token

### Manual Token Access

```typescript
import { useAuth } from '@/core/auth';

const auth = useAuth();

// Get current access token
const token = await auth.getAccessToken();

// Get token expiration time
const expiresIn = auth.getTokenExpiresIn();
console.log(`Token expires in ${expiresIn} seconds`);

// Force token refresh
await auth.refreshToken();
```

## Troubleshooting

### Issue: Redirect Loop

**Symptom**: Browser keeps redirecting between app and Keycloak

**Solutions**:
1. Check that redirect URIs in Keycloak client match your app URL
2. Verify PKCE is enabled in Keycloak client
3. Clear browser cache and sessionStorage
4. Check console for specific error messages

### Issue: Token Expired Error

**Symptom**: Frequent "token expired" messages

**Solutions**:
1. Increase `VITE_KEYCLOAK_MIN_VALIDITY` (token refresh threshold)
2. Decrease `VITE_KEYCLOAK_CHECK_INTERVAL` (check more frequently)
3. Verify refresh token is being returned by Keycloak
4. Check Keycloak session settings (SSO Session Idle, SSO Session Max)

### Issue: Roles Not Appearing

**Symptom**: User roles not detected in application

**Solutions**:
1. Verify roles are assigned to user in Keycloak
2. Check token mapper configuration in Keycloak (realm_access.roles)
3. Inspect token content in browser dev tools (Application → sessionStorage → kc_session)
4. Enable debug mode: `VITE_KEYCLOAK_DEBUG=true`

### Issue: CORS Errors

**Symptom**: Network errors when communicating with Keycloak

**Solutions**:
1. Add your app URL to Keycloak client **Web Origins**
2. Verify Keycloak is accessible from browser
3. Check Keycloak server CORS configuration

### Debug Mode

Enable detailed logging:

```bash
VITE_KEYCLOAK_DEBUG=true
```

This will log:
- Authentication initialization
- Token refresh attempts
- Navigation guards
- API requests

## Security Considerations

### Token Storage

✅ **Secure**: Hybrid storage (memory + sessionStorage)
- Tokens cleared on tab close
- Not accessible from other tabs
- Protected from XSS if using Content Security Policy

❌ **Avoid**: localStorage
- Persists across browser sessions
- Accessible from all tabs
- Higher XSS risk

### PII Minimization (Loi 25 Compliance)

The application minimizes Personal Identifiable Information:

- Only stores: `sub`, `preferredUsername`, `email` (optional), `roles`
- No PII in logs (production mode)
- No PII in URLs or query parameters
- Session data cleared on logout

### Content Security Policy

Recommended CSP headers for nginx:

```nginx
add_header Content-Security-Policy "
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  connect-src 'self' http://localhost:8080 https://keycloak.your-domain.com;
  img-src 'self' data:;
";
```

### HTTPS in Production

Always use HTTPS in production:
- Keycloak server must use HTTPS
- Application must use HTTPS
- Configure Keycloak with proper SSL certificates

## Advanced Topics

### Custom Claims

To access custom claims from tokens:

```typescript
import { keycloakService } from '@/core/auth';

const profile = keycloakService.getUserProfile();
const customClaim = profile?.['custom_claim_name'];
```

### Event Listening

Subscribe to authentication events:

```typescript
import { authEvents, AuthEvent } from '@/core/auth';

// Listen for login
authEvents.on(AuthEvent.LOGIN, (payload) => {
  console.log('User logged in:', payload.user);
});

// Listen for token refresh
authEvents.on(AuthEvent.TOKEN_REFRESH, () => {
  console.log('Token refreshed');
});

// Listen for errors
authEvents.on(AuthEvent.ERROR, (payload) => {
  console.error('Auth error:', payload.error);
});
```

### Multiple Keycloak Realms

To support multiple realms, create separate Keycloak service instances:

```typescript
const realm1Service = new KeycloakService();
await realm1Service.initialize({ ... });

const realm2Service = new KeycloakService();
await realm2Service.initialize({ ... });
```

## Testing

### Unit Tests

Run unit tests:

```bash
npm run test
```

### E2E Tests

Run E2E tests (requires running Keycloak):

```bash
npm run test:e2e
```

### Mocking Authentication

For testing without Keycloak:

```typescript
import { useAuthStore } from '@/core/auth';
import { AuthStatus } from '@/core/auth';

// In test setup
const authStore = useAuthStore();
authStore.status = AuthStatus.AUTHENTICATED;
authStore.user = {
  sub: 'test-123',
  preferredUsername: 'testuser',
  roles: ['ROLE_USER', 'ROLE_ADMIN'],
};
```

## Additional Resources

- [Keycloak Documentation](https://www.keycloak.org/documentation)
- [OpenID Connect Specification](https://openid.net/connect/)
- [PKCE RFC 7636](https://tools.ietf.org/html/rfc7636)
- [Vue 3 Documentation](https://v3.vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)

## Support

For issues or questions:

1. Check this documentation
2. Review console logs with debug mode enabled
3. Check Keycloak server logs
4. Verify configuration matches between app and Keycloak
5. Contact the development team

