# Banking System Startup Script (PowerShell)
# This script helps start all services in the correct order

param(
    [switch]$Clean,
    [switch]$Build
)

Write-Host "Banking System Services Starting..." -ForegroundColor Blue

function Write-Status {
    param($Message)
    Write-Host "[INFO] $Message" -ForegroundColor Cyan
}

function Write-Success {
    param($Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param($Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param($Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Check if Docker is running
try {
    docker info | Out-Null
} catch {
    Write-Error "Docker is not running. Please start Docker and try again."
    exit 1
}

# Check if docker-compose is available
try {
    docker-compose --version | Out-Null
} catch {
    Write-Error "docker-compose is not installed. Please install it and try again."
    exit 1
}

if ($Clean) {
    Write-Status "Cleaning up any existing containers..."
    docker-compose down --remove-orphans --volumes
}

Write-Status "Building and starting infrastructure services..."
docker-compose up -d zookeeper postgres redis

Write-Status "Waiting for infrastructure to be ready..."
Start-Sleep -Seconds 10

# Ensure demo user exists in database
Write-Status "Ensuring demo user exists in database..."
$maxRetries = 5
$retryCount = 0
do {
    $retryCount++
    try {
        $query = "INSERT INTO users (id, username, email, password_hash, first_name, last_name, phone_number) VALUES ('b061f043-07b3-4006-be9f-b75e90631b96', 'john.doe', 'john.doe@bank.com', '`$2a`$10`$dummy.hash.for.testing', 'John', 'Doe', '+1234567890') ON CONFLICT (id) DO NOTHING;"
        docker-compose exec -T postgres psql -U banking_user -d banking_db -c $query 2>$null
        Write-Success "Demo user verified/created successfully"
        break
    }
    catch {
        if ($retryCount -lt $maxRetries) {
            Write-Warning "Database not ready yet, retrying in 5 seconds... ($retryCount/$maxRetries)"
            Start-Sleep -Seconds 5
        } else {
            Write-Warning "Could not verify demo user, but continuing... (database might still be initializing)"
        }
    }
} while ($retryCount -lt $maxRetries)

Write-Status "Starting Kafka..."
docker-compose up -d kafka

Write-Status "Waiting for Kafka to be ready..."
Start-Sleep -Seconds 15

Write-Status "Starting monitoring services..."
docker-compose up -d kafka-ui prometheus grafana

if ($Build) {
    Write-Status "Building and starting application services..."
    docker-compose up -d --build account-service
} else {
    Write-Status "Starting application services..."
    docker-compose up -d account-service
}

Write-Status "Starting remaining services..."
docker-compose up -d kafka-connect

Write-Success "All services started successfully!"

Write-Host ""
Write-Host "Service URLs:" -ForegroundColor Magenta
Write-Host "  - Account Service: http://localhost:8080"
Write-Host "  - Account Service Health: http://localhost:8080/actuator/health"
Write-Host "  - Kafka UI: http://localhost:8090"
Write-Host "  - Grafana: http://localhost:3000 (admin/admin)"
Write-Host "  - Prometheus: http://localhost:9090"
Write-Host ""

Write-Status "Checking service health..."
Start-Sleep -Seconds 30

# Check health of key services
$services = @("postgres", "kafka", "account-service")
foreach ($service in $services) {
    $status = docker-compose ps $service
    if ($status -match "Up.*healthy|Up") {
        Write-Success "$service is running"
    } else {
        Write-Warning "$service may not be fully ready yet"
    }
}

Write-Host ""
Write-Status "Useful commands:"
Write-Host "  View all logs: docker-compose logs -f"
Write-Host "  View service logs: docker-compose logs -f account-service"
Write-Host "  Stop all services: docker-compose down"
Write-Host "  Restart with clean: .\scripts\start-services.ps1 -Clean"
Write-Host "  Restart with rebuild: .\scripts\start-services.ps1 -Build" 