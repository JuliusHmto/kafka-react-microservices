# 🏦 Banking System - Docker Setup Guide

This guide will help you get the entire banking system running smoothly with Docker.

## 🚀 Quick Start

### Prerequisites
- Docker Desktop installed and running
- Docker Compose installed
- 8GB+ RAM recommended
- Ports 5432, 6379, 8080, 8090, 9090, 9092, 3000 available

### Option 1: Using PowerShell Script (Windows - Recommended)
```powershell
# Start all services
.\scripts\start-services.ps1

# Start with clean rebuild
.\scripts\start-services.ps1 -Build -Clean
```

### Option 2: Using Docker Compose Directly
```bash
# Start infrastructure first
docker-compose up -d zookeeper postgres redis kafka

# Wait for services to be ready, then start the app
docker-compose up -d --build account-service

# Start remaining services
docker-compose up -d kafka-ui prometheus grafana kafka-connect
```

### Option 3: Start Everything at Once
```bash
docker-compose up -d --build
```

## 📊 Service URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Account Service | http://localhost:8080 | Main banking API |
| Health Check | http://localhost:8080/actuator/health | Service health status |
| Kafka UI | http://localhost:8090 | Kafka management interface |
| Grafana | http://localhost:3000 | Monitoring dashboards (admin/admin) |
| Prometheus | http://localhost:9090 | Metrics collection |

## 🔧 Configuration

### Environment Variables
The application supports different environments through profiles:

- **Local Development**: Uses `localhost` for database and Kafka
- **Docker Environment**: Uses service names (`postgres`, `kafka`)

### Database Configuration
- **Host**: postgres (in Docker) / localhost (local dev)
- **Port**: 5432
- **Database**: banking_db
- **Username**: banking_user
- **Password**: banking_pass

### Kafka Configuration
- **Bootstrap Servers**: kafka:29092 (in Docker) / localhost:9092 (local dev)
- **Consumer Group**: banking-account-service

## 🔍 Troubleshooting

### Check Service Status
```bash
# View all running services
docker-compose ps

# Check specific service health
docker-compose logs account-service

# Check PostgreSQL connection
docker-compose exec postgres pg_isready -U banking_user -d banking_db
```

### Common Issues

#### 1. Port Already in Use
```bash
# Stop conflicting services
docker-compose down
# Or kill specific processes using the ports
```

#### 2. Database Connection Failed
```bash
# Restart PostgreSQL
docker-compose restart postgres

# Check PostgreSQL logs
docker-compose logs postgres
```

#### 3. Application Won't Start
```bash
# Rebuild the application
docker-compose up -d --build account-service

# Check application logs
docker-compose logs -f account-service
```

#### 4. Out of Memory
```bash
# Increase Docker memory allocation to 8GB+
# Or stop unnecessary services
docker-compose stop grafana prometheus kafka-ui
```

### Health Checks

The system includes comprehensive health checks:

- **PostgreSQL**: Checks database connectivity
- **Account Service**: Checks application health via actuator
- **Kafka**: Implicit health through successful startup

## 🛠️ Development Workflow

### For Local Development
1. Start infrastructure: `docker-compose up -d postgres kafka zookeeper redis`
2. Run app locally: `cd backend/account-service && mvn spring-boot:run`

### For Full Docker Development
1. Use the PowerShell script: `.\scripts\start-services.ps1 -Build`
2. Make code changes
3. Rebuild: `docker-compose up -d --build account-service`

### Debugging
```bash
# View real-time logs
docker-compose logs -f account-service

# Execute commands in containers
docker-compose exec account-service bash
docker-compose exec postgres psql -U banking_user -d banking_db

# Restart specific service
docker-compose restart account-service
```

## 📈 Monitoring

### Application Metrics
- **Actuator Endpoints**: http://localhost:8080/actuator
- **Health**: http://localhost:8080/actuator/health
- **Metrics**: http://localhost:8080/actuator/metrics
- **Prometheus**: http://localhost:8080/actuator/prometheus

### Infrastructure Monitoring
- **Grafana Dashboards**: http://localhost:3000 (admin/admin)
- **Prometheus**: http://localhost:9090
- **Kafka UI**: http://localhost:8090

## 🧹 Cleanup

```bash
# Stop all services
docker-compose down

# Remove volumes and clean up
docker-compose down --volumes --remove-orphans

# Remove all unused Docker resources
docker system prune -a
```

## 🚀 Performance Tips

1. **Allocate sufficient memory** to Docker (8GB+ recommended)
2. **Use SSD storage** for better I/O performance
3. **Monitor resource usage** via Docker Desktop
4. **Tune JVM settings** in Dockerfile for your environment
5. **Use Docker BuildKit** for faster builds:
   ```bash
   export DOCKER_BUILDKIT=1
   ```

## 🔐 Security Notes

- The application runs as a non-root user in containers
- Database passwords are configured via environment variables
- Health checks are implemented for all critical services
- Resource limits can be configured in docker-compose.yml

## 📝 Additional Commands

```bash
# Build without cache
docker-compose build --no-cache account-service

# Scale services (if needed)
docker-compose up -d --scale account-service=2

# View resource usage
docker stats

# Export logs
docker-compose logs account-service > account-service.log
``` 