#!/bin/bash

# Banking System Startup Script
# This script helps start all services in the correct order

set -e

echo "🏦 Starting Banking System Services..."

# Color codes for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    print_error "docker-compose is not installed. Please install it and try again."
    exit 1
fi

print_status "Cleaning up any existing containers..."
docker-compose down --remove-orphans

print_status "Building and starting infrastructure services..."
docker-compose up -d zookeeper postgres redis

print_status "Waiting for infrastructure to be ready..."
sleep 10

print_status "Starting Kafka..."
docker-compose up -d kafka

print_status "Waiting for Kafka to be ready..."
sleep 15

print_status "Starting monitoring services..."
docker-compose up -d kafka-ui prometheus grafana

print_status "Building and starting application services..."
docker-compose up -d --build account-service

print_status "Starting remaining services..."
docker-compose up -d kafka-connect

print_success "All services started successfully! 🚀"

echo ""
echo "📊 Service URLs:"
echo "  - Account Service: http://localhost:8080"
echo "  - Account Service Health: http://localhost:8080/actuator/health"
echo "  - Kafka UI: http://localhost:8090"
echo "  - Grafana: http://localhost:3000 (admin/admin)"
echo "  - Prometheus: http://localhost:9090"
echo ""

print_status "Checking service health..."
sleep 30

# Check health of key services
services=("postgres" "kafka" "account-service")
for service in "${services[@]}"; do
    if docker-compose ps | grep -q "$service.*Up.*healthy\|$service.*Up"; then
        print_success "$service is running"
    else
        print_warning "$service may not be fully ready yet"
    fi
done

print_status "To view logs for all services:"
echo "  docker-compose logs -f"
echo ""
print_status "To view logs for a specific service:"
echo "  docker-compose logs -f account-service"
echo ""
print_status "To stop all services:"
echo "  docker-compose down" 