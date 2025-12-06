# AI Front - Vue 3 SPA Application

A modern, production-ready Vue 3 Single Page Application built with TypeScript, following strict coding standards, SOLID principles, and Test-Driven Development practices.

## Features

- 🚀 **Vue 3** with Composition API
- 📘 **TypeScript** with strict mode
- 🎨 **Tailwind CSS** for styling
- 🧪 **Vitest** for unit/component testing (90%+ coverage)
- 🎭 **Playwright** for E2E testing
- 📦 **Pinia** for state management
- 🛣️ **Vue Router** for navigation
- 🔍 **ESLint** + **Prettier** for code quality
- 🐶 **Husky** for git hooks
- 📝 **Commitlint** for conventional commits
- 🐳 **Docker** support with multi-stage builds
- 🔧 **Makefile** for CI/CD automation

## Quick Start

### Prerequisites

- Node.js 20+
- npm or yarn
- Docker (optional, for containerized deployment)

### Installation

```bash
# Install dependencies
make install

# Or using npm
npm ci
```

### Development

```bash
# Start development server (http://localhost:3000)
make dev

# Or using npm
npm run dev
```

### Testing

```bash
# Run all tests with coverage
make test

# Run tests in watch mode (TDD)
make test-watch

# Run E2E tests
make test-e2e
```

### Code Quality

```bash
# Run all quality checks (lint, format, type-check)
make validate

# Fix linting issues
make lint-fix

# Format code
make format
```

### Build

```bash
# Production build
make build

# Preview production build
make preview
```

## Project Structure

```
src/
├── features/           # Feature modules (feature-based architecture)
│   └── counter/       # Example counter feature
│       ├── components/     # Feature-specific components
│       ├── composables/    # Feature composables (hooks)
│       ├── stores/        # Pinia stores
│       ├── types/         # TypeScript types
│       ├── utils/         # Utility functions
│       ├── views/         # Page components
│       └── index.ts       # Feature exports
├── shared/            # Shared code across features
│   ├── components/   # Reusable components
│   ├── composables/  # Shared composables
│   ├── types/        # Common types
│   └── utils/        # Utility functions
├── core/             # Core application logic
│   ├── router/      # Vue Router configuration
│   ├── config/      # App configuration
│   └── services/    # Shared services
├── assets/          # Static assets
├── App.vue         # Root component
└── main.ts         # Application entry point
```

## Available Commands

### Development
- `make dev` - Start development server
- `make preview` - Preview production build locally

### Testing
- `make test` - Run unit/component tests with coverage
- `make test-watch` - Run tests in watch mode (TDD)
- `make test-e2e` - Run E2E tests
- `make test-coverage` - Generate and open coverage report

### Code Quality
- `make validate` - Run all quality checks
- `make lint` - Run ESLint
- `make lint-fix` - Fix linting issues
- `make format` - Format code with Prettier
- `make format-check` - Check code formatting
- `make type-check` - Run TypeScript type checking

### Build & Deploy
- `make build` - Production build
- `make clean` - Clean build artifacts
- `make optimize` - Build with bundle analysis

### Docker
- `make docker-build` - Build Docker image
- `make docker-run` - Run Docker container
- `make docker-stop` - Stop running containers

### Deployment
- `make deploy-staging` - Deploy to staging
- `make deploy-production` - Deploy to production
- `make deploy-preview` - Deploy preview environment
- `make smoke-test` - Run smoke tests
- `make rollback` - Rollback deployment

### Utilities
- `make deps-update` - Update dependencies
- `make deps-audit` - Security audit
- `make logs` - View application logs
- `make help` - Display all available commands

### CI/CD
- `make pipeline` - Run full CI/CD pipeline

## Documentation

Detailed documentation is available in the `docs/` directory:

- [Coding Standards](docs/CODING_STANDARDS.md) - Code style and conventions
- [TDD Guide](docs/TDD_GUIDE.md) - Test-Driven Development practices
- [SOLID Principles](docs/SOLID_PRINCIPLES.md) - Architecture and design principles
- [Testing](docs/TESTING.md) - Testing strategy and patterns
- [Architecture](docs/ARCHITECTURE.md) - System architecture overview
- [CI/CD](docs/CICD.md) - Continuous Integration/Deployment
- [Docker](docs/DOCKER.md) - Docker usage and deployment
- [Cursor AI](docs/CURSOR_AI.md) - Working with Cursor AI assistant

## Git Workflow

This project enforces:
- **Conventional Commits**: All commit messages must follow the conventional commits format
- **Pre-commit hooks**: Linting, formatting, and type-checking run before each commit
- **Commit message validation**: Ensures commit messages follow the standard

Example commit message:
```
feat: add user authentication feature

Implemented login and registration with JWT tokens
```

## CI/CD

The project includes CI/CD configurations for multiple platforms:
- **GitHub Actions**: `.github/workflows/ci.yml`
- **GitLab CI**: `.gitlab-ci.yml`
- **Jenkins**: `Jenkinsfile`

All platforms use the Makefile for consistency.

## Code Quality Standards

- **ESLint**: Strict rules with SOLID principles enforcement
- **Prettier**: Consistent code formatting
- **TypeScript**: Strict mode with explicit types
- **Test Coverage**: Minimum 90% required
- **JSDoc**: Comprehensive documentation required for all public APIs

## Contributing

1. Create a feature branch
2. Write tests first (TDD approach)
3. Implement the feature
4. Ensure all tests pass and coverage meets requirements
5. Create a pull request

## License

Proprietary

## Support

For questions or issues, please contact the development team.

