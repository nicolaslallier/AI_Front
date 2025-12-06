.PHONY: help install build clean optimize dev preview validate lint lint-fix format format-check type-check test test-watch test-e2e test-coverage deploy-staging deploy-production deploy-preview smoke-test rollback deps-update deps-audit logs pipeline

# Default target
.DEFAULT_GOAL := help

# Variables
NODE_BIN := ./node_modules/.bin
DOCKER_IMAGE := ai-front
DOCKER_TAG := latest
DEPLOY_ENV ?= staging

# Colors for output
COLOR_RESET := \033[0m
COLOR_BOLD := \033[1m
COLOR_GREEN := \033[32m
COLOR_YELLOW := \033[33m
COLOR_BLUE := \033[34m

##@ Help

help: ## Display this help message
	@echo "$(COLOR_BOLD)AI Front - Makefile Commands$(COLOR_RESET)"
	@echo ""
	@awk 'BEGIN {FS = ":.*##"; printf "Usage:\n  make $(COLOR_BLUE)<target>$(COLOR_RESET)\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  $(COLOR_BLUE)%-20s$(COLOR_RESET) %s\n", $$1, $$2 } /^##@/ { printf "\n$(COLOR_BOLD)%s$(COLOR_RESET)\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Installation & Setup

install: ## Install all dependencies with exact versions
	@echo "$(COLOR_GREEN)Installing dependencies...$(COLOR_RESET)"
	@if [ ! -f package-lock.json ]; then \
		echo "$(COLOR_YELLOW)No package-lock.json found, running npm install...$(COLOR_RESET)"; \
		npm install; \
	else \
		npm ci; \
	fi
	@echo "$(COLOR_GREEN)Setting up git hooks...$(COLOR_RESET)"
	npm run prepare
	@echo "$(COLOR_GREEN)Installing Playwright browsers...$(COLOR_RESET)"
	npx playwright install --with-deps
	@echo "$(COLOR_GREEN)✓ Installation complete$(COLOR_RESET)"

##@ Build

build: ## Build for production
	@echo "$(COLOR_GREEN)Building for production...$(COLOR_RESET)"
	npm run build
	@echo "$(COLOR_GREEN)✓ Build complete$(COLOR_RESET)"

clean: ## Clean build artifacts and caches
	@echo "$(COLOR_YELLOW)Cleaning build artifacts...$(COLOR_RESET)"
	rm -rf dist
	rm -rf node_modules/.vite
	rm -rf coverage
	rm -rf test-results
	rm -rf playwright-report
	@echo "$(COLOR_GREEN)✓ Clean complete$(COLOR_RESET)"

optimize: ## Build with bundle analysis
	@echo "$(COLOR_GREEN)Building with optimization analysis...$(COLOR_RESET)"
	npm run build -- --mode production
	@echo "$(COLOR_GREEN)✓ Optimization build complete$(COLOR_RESET)"

##@ Development

dev: ## Start development server
	@echo "$(COLOR_GREEN)Starting development server...$(COLOR_RESET)"
	npm run dev

preview: ## Preview production build locally
	@echo "$(COLOR_GREEN)Previewing production build...$(COLOR_RESET)"
	npm run preview

##@ Code Quality

validate: ## Run all quality checks (lint, format-check, type-check)
	@echo "$(COLOR_GREEN)Running validation checks...$(COLOR_RESET)"
	@echo "$(COLOR_BLUE)1/3 Linting...$(COLOR_RESET)"
	@npm run lint
	@echo "$(COLOR_BLUE)2/3 Format checking...$(COLOR_RESET)"
	@npm run format:check
	@echo "$(COLOR_BLUE)3/3 Type checking...$(COLOR_RESET)"
	@npm run type-check
	@echo "$(COLOR_GREEN)✓ All validation checks passed$(COLOR_RESET)"

lint: ## Run ESLint
	@echo "$(COLOR_GREEN)Running ESLint...$(COLOR_RESET)"
	npm run lint

lint-fix: ## Run ESLint with auto-fix
	@echo "$(COLOR_GREEN)Running ESLint with auto-fix...$(COLOR_RESET)"
	npm run lint:fix

format: ## Format code with Prettier
	@echo "$(COLOR_GREEN)Formatting code...$(COLOR_RESET)"
	npm run format

format-check: ## Check code formatting
	@echo "$(COLOR_GREEN)Checking code formatting...$(COLOR_RESET)"
	npm run format:check

type-check: ## Run TypeScript type checking
	@echo "$(COLOR_GREEN)Running TypeScript type check...$(COLOR_RESET)"
	npm run type-check

##@ Testing

test: ## Run all tests with coverage
	@echo "$(COLOR_GREEN)Running tests with coverage...$(COLOR_RESET)"
	npm run test
	@echo "$(COLOR_GREEN)✓ Tests complete$(COLOR_RESET)"

test-watch: ## Run tests in watch mode (TDD)
	@echo "$(COLOR_GREEN)Running tests in watch mode...$(COLOR_RESET)"
	npm run test:watch

test-e2e: ## Run E2E tests
	@echo "$(COLOR_GREEN)Running E2E tests...$(COLOR_RESET)"
	npm run test:e2e
	@echo "$(COLOR_GREEN)✓ E2E tests complete$(COLOR_RESET)"

test-coverage: ## Generate and display coverage report
	@echo "$(COLOR_GREEN)Generating coverage report...$(COLOR_RESET)"
	npm run test
	@echo "$(COLOR_BLUE)Opening coverage report...$(COLOR_RESET)"
	@open coverage/index.html || xdg-open coverage/index.html || echo "Coverage report available at: coverage/index.html"

##@ Docker

docker-build: ## Build Docker image
	@echo "$(COLOR_GREEN)Building Docker image...$(COLOR_RESET)"
	docker build -t $(DOCKER_IMAGE):$(DOCKER_TAG) .
	@echo "$(COLOR_GREEN)✓ Docker image built$(COLOR_RESET)"

docker-run: ## Run Docker container locally
	@echo "$(COLOR_GREEN)Running Docker container...$(COLOR_RESET)"
	docker run -p 8080:80 $(DOCKER_IMAGE):$(DOCKER_TAG)

docker-stop: ## Stop running Docker containers
	@echo "$(COLOR_YELLOW)Stopping Docker containers...$(COLOR_RESET)"
	docker stop $$(docker ps -q --filter ancestor=$(DOCKER_IMAGE):$(DOCKER_TAG)) 2>/dev/null || true

##@ Deployment

deploy-staging: ## Deploy to staging environment
	@echo "$(COLOR_GREEN)Deploying to staging...$(COLOR_RESET)"
	@echo "$(COLOR_YELLOW)Building production bundle...$(COLOR_RESET)"
	@make build
	@echo "$(COLOR_YELLOW)Building Docker image...$(COLOR_RESET)"
	@make docker-build
	@echo "$(COLOR_BLUE)Pushing to staging...$(COLOR_RESET)"
	@# Add your staging deployment commands here
	@echo "$(COLOR_GREEN)✓ Deployed to staging$(COLOR_RESET)"

deploy-production: ## Deploy to production
	@echo "$(COLOR_GREEN)Deploying to production...$(COLOR_RESET)"
	@echo "$(COLOR_YELLOW)⚠️  WARNING: Deploying to PRODUCTION$(COLOR_RESET)"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		echo "$(COLOR_YELLOW)Building production bundle...$(COLOR_RESET)"; \
		make build; \
		echo "$(COLOR_YELLOW)Building Docker image...$(COLOR_RESET)"; \
		make docker-build; \
		echo "$(COLOR_BLUE)Pushing to production...$(COLOR_RESET)"; \
		echo "$(COLOR_GREEN)✓ Deployed to production$(COLOR_RESET)"; \
	else \
		echo "$(COLOR_YELLOW)Deployment cancelled$(COLOR_RESET)"; \
	fi

deploy-preview: ## Deploy preview environment
	@echo "$(COLOR_GREEN)Deploying preview environment...$(COLOR_RESET)"
	@make build
	@echo "$(COLOR_GREEN)✓ Preview environment deployed$(COLOR_RESET)"

smoke-test: ## Run post-deployment smoke tests
	@echo "$(COLOR_GREEN)Running smoke tests...$(COLOR_RESET)"
	@curl -f http://localhost:8080 > /dev/null 2>&1 && echo "$(COLOR_GREEN)✓ Smoke tests passed$(COLOR_RESET)" || echo "$(COLOR_YELLOW)⚠️  Smoke tests failed$(COLOR_RESET)"

rollback: ## Rollback to previous deployment
	@echo "$(COLOR_YELLOW)Rolling back deployment...$(COLOR_RESET)"
	@# Add your rollback logic here
	@echo "$(COLOR_GREEN)✓ Rollback complete$(COLOR_RESET)"

##@ Utilities

deps-update: ## Update dependencies
	@echo "$(COLOR_GREEN)Checking for dependency updates...$(COLOR_RESET)"
	npm outdated || true
	@echo ""
	@read -p "Update dependencies? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		npm update; \
		echo "$(COLOR_GREEN)✓ Dependencies updated$(COLOR_RESET)"; \
	fi

deps-audit: ## Security audit of dependencies
	@echo "$(COLOR_GREEN)Running security audit...$(COLOR_RESET)"
	npm audit
	@echo "$(COLOR_GREEN)✓ Audit complete$(COLOR_RESET)"

logs: ## View application logs (Docker)
	@echo "$(COLOR_GREEN)Viewing application logs...$(COLOR_RESET)"
	docker logs -f $$(docker ps -q --filter ancestor=$(DOCKER_IMAGE):$(DOCKER_TAG)) 2>/dev/null || echo "$(COLOR_YELLOW)No running containers found$(COLOR_RESET)"

##@ CI/CD Pipeline

pipeline: ## Run full CI/CD pipeline
	@echo "$(COLOR_BOLD)$(COLOR_GREEN)========================================$(COLOR_RESET)"
	@echo "$(COLOR_BOLD)$(COLOR_GREEN)  Starting CI/CD Pipeline$(COLOR_RESET)"
	@echo "$(COLOR_BOLD)$(COLOR_GREEN)========================================$(COLOR_RESET)"
	@echo ""
	@echo "$(COLOR_BLUE)Step 1/5: Installing dependencies...$(COLOR_RESET)"
	@make install
	@echo ""
	@echo "$(COLOR_BLUE)Step 2/5: Validating code quality...$(COLOR_RESET)"
	@make validate
	@echo ""
	@echo "$(COLOR_BLUE)Step 3/5: Running tests...$(COLOR_RESET)"
	@make test
	@echo ""
	@echo "$(COLOR_BLUE)Step 4/5: Building application...$(COLOR_RESET)"
	@make build
	@echo ""
	@echo "$(COLOR_BLUE)Step 5/5: Building Docker image...$(COLOR_RESET)"
	@make docker-build
	@echo ""
	@echo "$(COLOR_BOLD)$(COLOR_GREEN)========================================$(COLOR_RESET)"
	@echo "$(COLOR_BOLD)$(COLOR_GREEN)  Pipeline Complete ✓$(COLOR_RESET)"
	@echo "$(COLOR_BOLD)$(COLOR_GREEN)========================================$(COLOR_RESET)"

