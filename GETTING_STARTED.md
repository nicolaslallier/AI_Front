# Getting Started with AI Front

This guide will help you set up and run the AI Front application on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20.x or higher
- **npm** 9.x or higher (comes with Node.js)
- **Git** for version control
- **Docker** (optional, for containerized development)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ai-front
```

### 2. Install Dependencies

```bash
# Using Makefile (recommended)
make install

# Or using npm directly
npm ci
```

The `npm ci` command (Clean Install) is preferred over `npm install` as it:
- Installs exact versions from package-lock.json
- Ensures consistent installations across environments
- Is faster and more reliable for CI/CD

## Configuration

### Environment Variables

The application uses environment variables for configuration. Create a `.env` file in the root directory:

```bash
# .env file

# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api

# Grafana Configuration
VITE_GRAFANA_URL=http://localhost/grafana/

# Environment
VITE_ENV=development
```

### Available Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API endpoint | `http://localhost:3000/api` |
| `VITE_GRAFANA_URL` | Grafana instance URL | `http://localhost/grafana/` |
| `VITE_ENV` | Environment name | `development` |

**Note**: All environment variables must be prefixed with `VITE_` to be accessible in the application.

### Environment-Specific Configuration

Create different `.env` files for different environments:

- `.env.development` - Development environment
- `.env.staging` - Staging environment
- `.env.production` - Production environment

Vite will automatically load the appropriate file based on the mode.

## Running the Application

### Development Server

Start the development server with hot-reload:

```bash
# Using Makefile
make dev

# Or using npm
npm run dev
```

The application will be available at `http://localhost:5173` (default Vite port).

### Features Available

Once running, you can access:

1. **Home Page** (`/home`): Counter feature demonstration
2. **Grafana** (`/grafana`): Embedded Grafana dashboards

The application shell provides persistent navigation between these features.

## Development Workflow

### Test-Driven Development (TDD)

This project follows TDD practices. The recommended workflow is:

1. **Write a failing test**
   ```bash
   npm run test:watch
   ```

2. **Implement the feature** to make the test pass

3. **Refactor** while keeping tests green

4. **Verify coverage**
   ```bash
   npm run test
   ```

### Running Tests

#### Unit and Component Tests

```bash
# Run all tests with coverage
make test

# Watch mode for TDD
make test-watch

# Or using npm
npm run test
npm run test:watch
```

Tests are written using:
- **Vitest** for test runner
- **@vue/test-utils** for component testing
- **jsdom** for DOM simulation

#### E2E Tests

```bash
# Run E2E tests
make test-e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Or using npm
npm run test:e2e
```

E2E tests use **Playwright** to test complete user flows.

### Code Quality Checks

#### Linting

```bash
# Check for linting errors
make lint

# Fix auto-fixable issues
make lint-fix

# Or using npm
npm run lint
npm run lint:fix
```

#### Code Formatting

```bash
# Check formatting
make format-check

# Format code
make format

# Or using npm
npm run format:check
npm run format
```

#### Type Checking

```bash
# Run TypeScript type checking
make type-check

# Or using npm
npm run type-check
```

#### Run All Quality Checks

```bash
# Run lint, format, and type checks
make validate

# Or using npm
npm run validate
```

## Building for Production

### Create Production Build

```bash
# Build optimized production bundle
make build

# Or using npm
npm run build
```

The build output will be in the `dist/` directory.

### Preview Production Build

```bash
# Preview production build locally
make preview

# Or using npm
npm run preview
```

This serves the production build locally for testing.

## Docker Development

### Build Docker Image

```bash
make docker-build
```

### Run in Docker Container

```bash
make docker-run
```

The application will be available at `http://localhost:80`.

### Stop Docker Container

```bash
make docker-stop
```

## Project Structure

Understanding the project structure:

```
src/
├── features/          # Feature modules
│   ├── counter/      # Counter feature
│   ├── grafana/      # Grafana integration
│   └── layout/       # Shell layout
├── shared/           # Shared utilities
│   ├── types/       # Common types
│   └── utils/       # Utility functions
├── core/            # Core infrastructure
│   ├── config/      # Configuration
│   └── router/      # Router setup
├── assets/          # Static assets
├── App.vue          # Root component
└── main.ts          # Entry point
```

### Adding a New Feature

1. **Create feature directory:**
   ```bash
   mkdir -p src/features/my-feature/{components,composables,types,views}
   ```

2. **Create feature files:**
   - Components in `components/`
   - State management in `composables/`
   - Types in `types/`
   - Page views in `views/`
   - Tests alongside each file (`.spec.ts`)

3. **Add route:**
   Edit `src/core/router/index.ts`:
   ```typescript
   {
     path: 'my-feature',
     name: 'my-feature',
     component: () => import('@/features/my-feature/views/my-feature-view.vue'),
     meta: { title: 'My Feature' },
   }
   ```

4. **Add navigation item:**
   Edit `src/features/layout/components/app-shell.vue`:
   ```typescript
   {
     id: 'my-feature',
     label: 'My Feature',
     path: '/my-feature',
     visible: true,
   }
   ```

5. **Write tests first** (TDD approach)

6. **Implement the feature**

## Grafana Integration

### Prerequisites for Grafana

The Grafana integration requires a running Grafana instance. You can:

1. **Use existing Grafana**: Configure `VITE_GRAFANA_URL` to point to your instance
2. **Run Grafana locally with Docker**:
   ```bash
   docker run -d -p 3000:3000 grafana/grafana
   ```
   Then set `VITE_GRAFANA_URL=http://localhost:3000/`

### Grafana Configuration

The Grafana feature will:
- Display a loading indicator while Grafana loads
- Show the Grafana interface in an isolated iframe
- Display an error message with retry if Grafana is unavailable
- Log navigation to the Grafana page

### Troubleshooting Grafana

If Grafana doesn't load:

1. **Check Grafana is running**: Visit the Grafana URL directly in a browser
2. **Check CORS settings**: Ensure Grafana allows embedding in iframes
3. **Check URL configuration**: Verify `VITE_GRAFANA_URL` is correct
4. **Check browser console**: Look for security or network errors
5. **Try the retry button**: Click retry in the error message

## Common Issues and Solutions

### Port Already in Use

If port 5173 is already in use:

```bash
# Kill the process using the port
lsof -ti:5173 | xargs kill -9

# Or specify a different port
npm run dev -- --port 3001
```

### Node Version Issues

Ensure you're using Node.js 20.x or higher:

```bash
node --version

# If wrong version, use nvm to switch
nvm use 20
```

### Module Not Found Errors

Clear node_modules and reinstall:

```bash
rm -rf node_modules package-lock.json
npm ci
```

### Test Failures

If tests fail after changes:

1. Run tests in watch mode to see failures: `npm run test:watch`
2. Check if snapshots need updating: Press `u` in watch mode
3. Verify all dependencies are installed: `npm ci`
4. Clear test cache: `npm run test -- --clearCache`

### TypeScript Errors

If you see TypeScript errors:

1. Ensure your IDE is using the workspace TypeScript version
2. Restart the TypeScript server in your IDE
3. Run `npm run type-check` to see all errors
4. Check `tsconfig.json` for configuration issues

## Git Workflow

### Commit Message Format

This project uses **Conventional Commits**:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(grafana): add embedded Grafana dashboard integration

Implemented iframe-based Grafana integration with error handling
and retry mechanism. Updated navigation to include Grafana menu item.

Closes #123
```

### Pre-commit Hooks

The project uses Husky for pre-commit hooks that automatically:
- Run linting
- Check formatting
- Run type checking
- Validate commit messages

If commit fails, fix the issues and try again.

## IDE Setup

### VS Code (Recommended)

Install recommended extensions:
- **Vue - Official** (Vue language support)
- **ESLint** (Linting)
- **Prettier** (Formatting)
- **TypeScript Vue Plugin (Volar)** (TypeScript support)

Settings are included in `.vscode/settings.json`.

### Other IDEs

Configure your IDE to:
- Use the workspace TypeScript version
- Enable ESLint integration
- Enable Prettier integration
- Use the project's formatter settings

## Next Steps

Now that you have the application running:

1. **Explore the codebase**: Start with `src/main.ts` and follow the imports
2. **Read the documentation**: Check `docs/` directory for detailed guides
3. **Try the features**: Navigate between Home and Grafana
4. **Run the tests**: See how testing works in this project
5. **Make a change**: Follow TDD to add a small feature
6. **Review coding standards**: Read `docs/CODING_STANDARDS.md`

## Getting Help

If you encounter issues:

1. Check this guide thoroughly
2. Review the documentation in `docs/`
3. Check the project README.md
4. Search for similar issues in the project's issue tracker
5. Ask the development team

## Additional Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vue Router Documentation](https://router.vuejs.org/)

Happy coding! 🚀

