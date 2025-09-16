# Makefile for Q360 Development

# Variables
COMPOSE_FILE := docker-compose.yml
BACKEND_DIR := q360_backend
FRONTEND_DIR := q360_frontend

# Default target
.PHONY: help
help: ## Display this help message
	@echo "Q360 Development Makefile"
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

.PHONY: install
install: ## Install all dependencies
	cd $(BACKEND_DIR) && pip install -r requirements-dev.txt
	cd $(FRONTEND_DIR) && npm install

.PHONY: start
start: ## Start development servers
	docker-compose up -d

.PHONY: stop
stop: ## Stop development servers
	docker-compose down

.PHONY: restart
restart: ## Restart development servers
	docker-compose restart

.PHONY: logs
logs: ## View logs
	docker-compose logs -f

.PHONY: backend-logs
backend-logs: ## View backend logs
	docker-compose logs -f backend

.PHONY: frontend-logs
frontend-logs: ## View frontend logs
	docker-compose logs -f frontend

.PHONY: db-logs
db-logs: ## View database logs
	docker-compose logs -f db

.PHONY: migrate
migrate: ## Run Django migrations
	docker-compose exec backend python manage.py migrate

.PHONY: makemigrations
makemigrations: ## Create Django migrations
	docker-compose exec backend python manage.py makemigrations

.PHONY: createsuperuser
createsuperuser: ## Create Django superuser
	docker-compose exec backend python manage.py createsuperuser

.PHONY: shell
shell: ## Open Django shell
	docker-compose exec backend python manage.py shell

.PHONY: test
test: ## Run tests
	docker-compose exec backend pytest

.PHONY: test-coverage
test-coverage: ## Run tests with coverage
	docker-compose exec backend pytest --cov=. --cov-report=html

.PHONY: lint
lint: ## Run code linting
	docker-compose exec backend pylint accounts evaluations ideas notifications reports
	cd $(FRONTEND_DIR) && npm run lint

.PHONY: format
format: ## Format code
	docker-compose exec backend black .
	cd $(FRONTEND_DIR) && npm run format

.PHONY: check
check: ## Run all checks (linting, formatting, etc.)
	docker-compose exec backend black --check .
	docker-compose exec backend pylint accounts evaluations ideas notifications reports
	cd $(FRONTEND_DIR) && npm run lint
	cd $(FRONTEND_DIR) && npm run format:check

.PHONY: clean
clean: ## Clean development environment
	docker-compose down -v
	find . -type f -name "*.pyc" -delete
	find . -type d -name "__pycache__" -delete
	rm -rf $(FRONTEND_DIR)/node_modules
	rm -rf $(BACKEND_DIR)/htmlcov
	rm -rf $(BACKEND_DIR)/.coverage

.PHONY: setup
setup: ## Set up development environment from scratch
	docker-compose up -d db redis
	sleep 10
	docker-compose exec backend python manage.py migrate
	docker-compose up -d

.PHONY: backup-db
backup-db: ## Create database backup
	docker-compose exec db pg_dump -U q360_user q360_dev > backup_$(shell date +%Y%m%d_%H%M%S).sql

.PHONY: restore-db
restore-db: ## Restore database from backup
	docker-compose exec -T db pg_restore -U q360_user -d q360_dev < backup_*.sql