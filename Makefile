.PHONY: up down build test logs backend-test backend-logs frontend-logs db-logs

# Start all services
up:
	docker compose up -d

# Stop all services
down:
	docker compose down

# Build all services
build:
	docker compose build

# Run backend tests
test:
	docker compose run --rm backend ./gradlew test

# View all logs
logs:
	docker compose logs -f

# View backend logs
backend-logs:
	docker compose logs -f backend

# View frontend logs
frontend-logs:
	docker compose logs -f frontend

# View database logs
db-logs:
	docker compose logs -f postgres

# Rebuild and restart backend
backend-restart:
	docker compose up -d --build backend

# Open database shell
db-shell:
	docker compose exec postgres psql -U womery -d womery

# Clean everything
clean:
	docker compose down -v --rmi local
