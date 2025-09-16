# Q360 Development Setup Guide

This guide will help you set up your development environment for the Q360 Performans İdarəetmə Platforması.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

1. **Docker** - [Download Docker](https://www.docker.com/products/docker-desktop)
2. **Docker Compose** - Usually included with Docker Desktop
3. **Git** - [Download Git](https://git-scm.com/downloads)
4. **Python 3.9+** - [Download Python](https://www.python.org/downloads/)
5. **Node.js 16+** - [Download Node.js](https://nodejs.org/)
6. **npm 8+** - Usually included with Node.js

## Quick Setup (Recommended)

The fastest way to get started is using Docker Compose:

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd q360
   ```

2. Start all services:
   ```bash
   make setup
   ```
   or
   ```bash
   docker-compose up -d
   ```

3. Access the applications:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Admin Panel: http://localhost:8000/admin

## Manual Setup (Alternative)

If you prefer to run services manually:

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd q360_backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements-dev.txt
   ```

4. Set up the database:
   ```bash
   python manage.py migrate
   ```

5. Create a superuser:
   ```bash
   python manage.py createsuperuser
   ```

6. Run the development server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd q360_frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Development Commands

We provide a Makefile with common development commands:

### Using Make (Recommended)

```bash
# Display all available commands
make help

# Install all dependencies
make install

# Start development servers
make start

# Stop development servers
make stop

# Run Django migrations
make migrate

# Create Django migrations
make makemigrations

# Create Django superuser
make createsuperuser

# Run tests
make test

# Run tests with coverage
make test-coverage

# Run code linting
make lint

# Format code
make format

# Run all checks
make check

# Clean development environment
make clean
```

### Using Docker Compose Directly

```bash
# Start services in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Run Django management commands
docker-compose exec backend python manage.py migrate

# Run tests
docker-compose exec backend pytest

# Access Django shell
docker-compose exec backend python manage.py shell
```

## Environment Variables

### Backend

Create a `.env` file in the `q360_backend` directory:

```env
DEBUG=1
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://q360_user:q360_pass@localhost:5432/q360_dev
REDIS_URL=redis://localhost:6379/0
```

### Frontend

Create a `.env` file in the `q360_frontend` directory:

```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_WS_URL=ws://localhost:8000/ws
```

## Database Management

### Creating Backups

```bash
# Using Make
make backup-db

# Using Docker Compose
docker-compose exec db pg_dump -U q360_user q360_dev > backup.sql
```

### Restoring Backups

```bash
# Using Make
make restore-db

# Using Docker Compose
docker-compose exec -T db pg_restore -U q360_user -d q360_dev < backup.sql
```

## Testing

### Backend Testing

```bash
# Run all tests
docker-compose exec backend pytest

# Run tests with coverage
docker-compose exec backend pytest --cov=. --cov-report=html

# Run specific test file
docker-compose exec backend pytest tests/test_accounts.py
```

### Frontend Testing

```bash
# Run all tests
cd q360_frontend && npm test

# Run tests in watch mode
cd q360_frontend && npm test -- --watch
```

## Code Quality

### Linting

```bash
# Backend linting
docker-compose exec backend pylint accounts evaluations ideas notifications reports

# Frontend linting
cd q360_frontend && npm run lint
```

### Formatting

```bash
# Backend formatting
docker-compose exec backend black .

# Frontend formatting
cd q360_frontend && npm run format
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: If ports 3000, 8000, 5432, or 6379 are already in use:
   - Stop the conflicting services
   - Or modify the ports in `docker-compose.yml`

2. **Permission denied errors**:
   - Ensure Docker is running
   - Check file permissions
   - On Linux, you might need to add your user to the docker group

3. **Database connection errors**:
   - Ensure the database service is running
   - Check database credentials in environment variables
   - Verify network connectivity between services

### Reset Development Environment

If you need to start fresh:

```bash
# Using Make
make clean

# Manual reset
docker-compose down -v
rm -rf q360_backend/node_modules
rm -rf q360_frontend/node_modules
find . -type f -name "*.pyc" -delete
find . -type d -name "__pycache__" -delete
```

## Development Workflow

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**

3. **Run tests and checks**:
   ```bash
   make test
   make lint
   make format
   ```

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Add your feature description"
   ```

5. **Push and create a pull request**

## Useful Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Docker Documentation](https://docs.docker.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)